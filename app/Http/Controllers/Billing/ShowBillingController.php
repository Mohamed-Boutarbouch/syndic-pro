<?php

namespace App\Http\Controllers\Billing;

use App\Enums\BillingFrequency;
use App\Enums\ObligationStatus;
use App\Models\Property;
use App\Models\UnitCoOwner;
use Inertia\Inertia;
use Inertia\Response;

class ShowBillingController
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
            'kpis' => $this->billingFrequencyCounts($property),
        ]);
    }

    /**
     * @return array{
     *     monthly: int,
     *     bimonthly: int,
     *     quarterly: int,
     *     semi_annual: int
     * }
     */
    private function billingFrequencyCounts(Property $property): array
    {
        $counts = UnitCoOwner::query()
            ->whereHas('unit', function ($query) use ($property) {
                $query->where('property_id', $property->id);
            })
            ->selectRaw('billing_frequency, COUNT(*) as aggregate')
            ->groupBy('billing_frequency')
            ->pluck('aggregate', 'billing_frequency');

        return [
            'monthly' => (int) ($counts[BillingFrequency::Monthly->value] ?? 0),
            'bimonthly' => (int) ($counts[BillingFrequency::Bimonthly->value] ?? 0),
            'quarterly' => (int) ($counts[BillingFrequency::Quarterly->value] ?? 0),
            'semi_annual' => (int) ($counts[BillingFrequency::SemiAnnual->value] ?? 0),
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
