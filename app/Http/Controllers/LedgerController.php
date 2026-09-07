<?php

namespace App\Http\Controllers;

use App\Enums\ScheduleStatus;
use App\Models\Property;
use Inertia\Inertia;
use Inertia\Response;

class LedgerController
{
    public function __invoke(Property $property): Response
    {
        $budget = $property->currentAnnualTargetBudget()->first();

        $obligations = $budget
            ? $budget->cycleObligations()
                ->with([
                    'ownership.coOwner',
                    'ownership.unit',
                    'paymentSchedules.payments' => fn ($q) => $q->whereNull('voided_at'),
                ])
                ->get()
            : collect();

        $coOwnerStatuses = $obligations->map(function ($obligation) {
            $unitCoOwner = $obligation->ownership;
            $paid = $obligation->paymentSchedules
                ->flatMap->payments
                ->sum('amount');

            return [
                'id' => (string) $unitCoOwner->id,
                'unitCoOwnerId' => $unitCoOwner->id,
                'name' => $unitCoOwner->coOwner->name,
                'initials' => $this->initials($unitCoOwner->coOwner->name),
                'unit' => $unitCoOwner->unit->label,
                'quota' => (float) $obligation->share_amount,
                'payments' => $obligation->paymentSchedules
                    ->flatMap->payments
                    ->sortByDesc('paid_at')
                    ->values()
                    ->map(fn ($payment) => [
                        'id' => (string) $payment->id,
                        'date' => $payment->paid_at->format('F Y'),
                        'amount' => (float) $payment->amount,
                    ]),
            ];
        })->values();

        $allPayments = $obligations
            ->flatMap(function ($obligation) {
                $unitCoOwner = $obligation->ownership;

                return $obligation->paymentSchedules->flatMap(
                    fn ($schedule) => $schedule->payments->map(fn ($payment) => [
                        'id' => (string) $payment->id,
                        'date' => $payment->paid_at->toDateString(),
                        'coOwner' => $unitCoOwner->coOwner->name,
                        'period' => 'Installment '.$schedule->installment_number,
                        'type' => $schedule->status === ScheduleStatus::Partial ? 'partial' : 'full',
                        'amount' => (float) $payment->amount,
                        'notes' => $payment->notes ?? '',
                    ]),
                );
            })
            ->sortByDesc('date')
            ->values();

        $totalTarget = (float) ($budget?->total_budget ?? 0);
        $totalCollected = $allPayments->sum('amount');

        return Inertia::render('properties/ledger', [
            'property' => [
                'id' => $property->id,
                'name' => $property->name,
            ],
            'fiscalYear' => $budget ? [
                'targetBudget' => $totalTarget,
                'collected' => $totalCollected,
                'percentage' => $totalTarget > 0
                    ? min(round(($totalCollected / $totalTarget) * 100), 100)
                    : 0,
            ] : null,
            'transactionSummary' => [
                'total' => $allPayments->count(),
                'partial' => $obligations->flatMap->paymentSchedules
                    ->where('status', ScheduleStatus::Partial)->count(),
                'ownersPaidOff' => $obligations->filter(
                    fn ($o) => $o->paymentSchedules->every(
                        fn ($s) => $s->status === ScheduleStatus::Paid,
                    ),
                )->count(),
                'ownersTotal' => $obligations->count(),
            ],
            'coOwnerStatuses' => $coOwnerStatuses,
            'coOwnerOptions' => $coOwnerStatuses->map(fn ($c) => [
                'id' => (string) $c['unitCoOwnerId'],
                'name' => $c['name'],
                'initials' => $c['initials'],
                'remainingQuota' => max(
                    $c['quota'] - collect($c['payments'])->sum('amount'),
                    0,
                ),
            ])->values(),
            'payments' => $allPayments,
        ]);
    }

    private function initials(string $name): string
    {
        return collect(explode(' ', $name))
            ->map(fn ($word) => mb_substr($word, 0, 1))
            ->take(2)
            ->implode('')
            ? mb_strtoupper(
                collect(explode(' ', $name))
                    ->map(fn ($word) => mb_substr($word, 0, 1))
                    ->take(2)
                    ->implode('')
            )
            : '';
    }
}
