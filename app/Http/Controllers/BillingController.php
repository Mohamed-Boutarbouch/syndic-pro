<?php

namespace App\Http\Controllers;

use App\Enums\ObligationStatus;
use App\Enums\UnitTypes;
use App\Models\Property;
use App\Models\UnitCoOwner;
use Inertia\Inertia;
use Inertia\Response;

class BillingController
{
    public function __invoke(Property $property): Response
    {
        $activeBudget = $property->currentAnnualTargetBudget()->first();

        $unitCoOwners = $activeBudget
            ? UnitCoOwner::query()
                ->whereHas('unit', fn ($query) => $query->where('property_id', $property->id))
                ->with([
                    'coOwner',
                    'unit',
                    'cycleObligations' => function ($query) use ($activeBudget) {
                        $query
                            ->where('annual_target_budget_id', $activeBudget->id)
                            ->where('status', ObligationStatus::Active)
                            ->with([
                                'paymentSchedules.payments' => function ($paymentsQuery) {
                                    $paymentsQuery->whereNull('voided_at');
                                },
                                'paymentSchedules.coPayers.user',
                                'paymentSchedules.coPayers.paymentSchedule',
                            ]);
                    },
                ])
                ->get()
            : collect();

        $payments = $unitCoOwners
            ->map(fn ($unitCoOwner) => $this->formatCoOwnerPayment($unitCoOwner))
            ->filter()
            ->values();

        return Inertia::render('properties/billing', [
            'property' => [
                'id' => $property->id,
                'name' => $property->name,
            ],
            'payments' => $payments,
            'kpis' => $this->unitTypeCounts($property),
        ]);
    }

    /**
     * @return array{apartment: int, commercial: int, storage: int}
     */
    private function unitTypeCounts(Property $property): array
    {
        $counts = $property->units()
            ->selectRaw('type, count(*) as aggregate')
            ->groupBy('type')
            ->pluck('aggregate', 'type');

        // NOTE: I haven't seen the actual App\Enums\UnitTypes source, only
        // its usage (UnitTypes::Commercial->value as a column default), so
        // I can't confirm the case names/values for "apartment" and
        // "storage" the user story implies (Apartments, Commercial Spaces,
        // Storage Vaults). Adjust the three keys below to match your real
        // enum's backed values if they differ.
        return [
            'apartment' => (int) ($counts['apartment'] ?? 0),
            'commercial' => (int) ($counts[UnitTypes::Commercial->value] ?? 0),
            'storage' => (int) ($counts['storage'] ?? 0),
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    private function formatCoOwnerPayment(UnitCoOwner $unitCoOwner): ?array
    {
        $obligation = $unitCoOwner->cycleObligations->first();

        if (! $obligation) {
            return null;
        }

        $quota = (float) $obligation->share_amount;

        $collected = $obligation->paymentSchedules
            ->flatMap(fn ($schedule) => $schedule->payments)
            ->sum(fn ($payment) => (float) $payment->amount);

        $coOwner = $unitCoOwner->coOwner;
        $name = $coOwner->name;

        // NOTE: payment_co_payers is keyed to individual payment_schedules,
        // not to a shared "household" concept, so a co-payer's aggregate
        // quota share across the whole fiscal year is approximated here by
        // averaging their expected_share percentage across this
        // obligation's schedules. A dedicated family-group table (see
        // outstanding gap in project notes) would make this exact.
        $coPayerRows = $obligation->paymentSchedules
            ->flatMap(fn ($schedule) => $schedule->coPayers)
            ->groupBy('user_id');

        $coPayers = null;

        if ($coPayerRows->isNotEmpty()) {
            $coPayers = $coPayerRows
                ->map(function ($rowsForUser, $userId) use ($obligation) {
                    $user = $rowsForUser->first()->user;

                    $collectedForUser = $obligation->paymentSchedules
                        ->flatMap(fn ($schedule) => $schedule->payments)
                        ->where('paid_by_user_id', (int) $userId)
                        ->sum(fn ($payment) => (float) $payment->amount);

                    $avgSharePercentage = $rowsForUser->avg(function ($coPayer) {
                        $scheduleTotal = (float) $coPayer->paymentSchedule->amount_due;

                        return $scheduleTotal > 0
                            ? ((float) $coPayer->expected_share / $scheduleTotal) * 100
                            : 0;
                    });

                    return [
                        'id' => (string) $userId,
                        'initials' => $this->initials($user?->name ?? ''),
                        'name' => $user?->name ?? 'Unknown',
                        'relationship' => 'Co-payer',
                        'sharePercentage' => (int) round($avgSharePercentage),
                        'collected' => $collectedForUser,
                    ];
                })
                ->values()
                ->all();
        }

        return [
            'id' => (string) $unitCoOwner->id,
            'initials' => $this->initials($name),
            'name' => $name,
            'role' => $unitCoOwner->is_designated_syndic ? 'Syndic' : null,
            'unit' => $unitCoOwner->unit->label,
            'quota' => $quota,
            'collected' => $collected,
            'frequency' => $this->mapFrequency($unitCoOwner->billing_frequency->value),
            'coPayers' => $coPayers,
        ];
    }

    private function initials(string $name): string
    {
        $parts = array_filter(explode(' ', trim($name)));

        $initials = collect($parts)
            ->map(fn ($part) => mb_strtoupper(mb_substr($part, 0, 1)))
            ->take(2)
            ->implode('');

        return $initials ?: '?';
    }

    /**
     * The backend enum uses `semi_annual`; the frontend uses `semi-annual`.
     */
    private function mapFrequency(string $backendValue): string
    {
        return $backendValue === 'semi_annual' ? 'semi-annual' : $backendValue;
    }
}
