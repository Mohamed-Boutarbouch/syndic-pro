<?php

namespace App\Http\Controllers\Property;

use App\Models\Property;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController
{
    public function __invoke(Property $property): Response
    {
        $budget = $property->annualTargetBudgets()
            ->where('is_budget_locked', true)
            ->latest('start_date')
            ->first();

        $propertyData = [
            'id' => $property->id,
            'name' => $property->name,
        ];

        if (! $budget) {
            return Inertia::render('properties/dashboard', [
                'property' => $propertyData,
                'kpis' => null,
                'collectionProgress' => null,
                'monthlyCollection' => [],
                'recentPayments' => [],
            ]);
        }

        $collected = (float) DB::table('payments')
            ->join(
                'cycle_obligations',
                'payments.cycle_obligation_id',
                '=',
                'cycle_obligations.id',
            )
            ->where('cycle_obligations.annual_target_budget_id', $budget->id)
            ->whereNull('payments.voided_at')
            ->sum('payments.amount');

        $adjustments = (float) DB::table('cycle_adjustments')
            ->where('annual_target_budget_id', $budget->id)
            ->sum('delta_amount');

        $targetBudget = (float) $budget->total_budget;
        $adjustedTarget = $targetBudget + $adjustments;
        $remainingBalance = $adjustedTarget - $collected;

        /*
         * Load active obligations and their total paid amount in one query.
         */
        $obligations = DB::table('cycle_obligations')
            ->leftJoinSub(
                DB::table('payments')
                    ->whereNull('voided_at')
                    ->groupBy('cycle_obligation_id')
                    ->select(
                        'cycle_obligation_id',
                        DB::raw('SUM(amount) as paid'),
                    ),
                'payment_totals',
                'cycle_obligations.id',
                '=',
                'payment_totals.cycle_obligation_id',
            )
            ->where('cycle_obligations.annual_target_budget_id', $budget->id)
            ->where('cycle_obligations.status', 'active')
            ->select([
                'cycle_obligations.id',
                'cycle_obligations.ownership_id',
                'cycle_obligations.share_amount',
                DB::raw('COALESCE(payment_totals.paid, 0) as paid'),
            ])
            ->get();

        $paidCount = 0;
        $partialCount = 0;
        $pendingCount = 0;

        foreach ($obligations as $obligation) {
            $paid = (float) $obligation->paid;
            $share = (float) $obligation->share_amount;

            if ($paid <= 0) {
                $pendingCount++;
            } elseif ($paid >= $share) {
                $paidCount++;
            } else {
                $partialCount++;
            }
        }

        $unitsCount = DB::table('units')
            ->where('property_id', $property->id)
            ->count();

        /*
         * Load owner progress using the already-aggregated payment totals.
         */
        $ownerProgress = DB::table('cycle_obligations')
            ->join(
                'unit_co_owners',
                'cycle_obligations.ownership_id',
                '=',
                'unit_co_owners.id',
            )
            ->join(
                'co_owners',
                'unit_co_owners.co_owner_id',
                '=',
                'co_owners.id',
            )
            ->leftJoinSub(
                DB::table('payments')
                    ->whereNull('voided_at')
                    ->groupBy('cycle_obligation_id')
                    ->select(
                        'cycle_obligation_id',
                        DB::raw('SUM(amount) as paid'),
                    ),
                'payment_totals',
                'cycle_obligations.id',
                '=',
                'payment_totals.cycle_obligation_id',
            )
            ->where('cycle_obligations.annual_target_budget_id', $budget->id)
            ->where('cycle_obligations.status', 'active')
            ->select([
                'co_owners.name',
                'cycle_obligations.share_amount',
                DB::raw('COALESCE(payment_totals.paid, 0) as paid'),
            ])
            ->get();

        $owners = $ownerProgress
            ->map(function ($owner) {
                $paid = (float) $owner->paid;
                $share = (float) $owner->share_amount;

                return [
                    'name' => $owner->name,
                    'pct' => $share > 0
                        ? (int) min(100, round(($paid / $share) * 100))
                        : 0,
                ];
            })
            ->sortBy('pct')
            ->values();

        /*
         * Build the 12 months from the actual fiscal year start date.
         */
        $fiscalMonths = collect(range(0, 11))
            ->map(
                fn (int $offset) => $budget->start_date
                    ->copy()
                    ->addMonths($offset),
            );

        $collectedByMonth = DB::table('payments')
            ->join(
                'cycle_obligations',
                'payments.cycle_obligation_id',
                '=',
                'cycle_obligations.id',
            )
            ->where('cycle_obligations.annual_target_budget_id', $budget->id)
            ->whereNull('payments.voided_at')
            ->select(
                DB::raw("TO_CHAR(payments.paid_at, 'YYYY-MM') as month"),
                DB::raw('SUM(payments.amount) as total'),
            )
            ->groupBy('month')
            ->pluck('total', 'month');

        $monthlyTarget = $adjustedTarget > 0
            ? round($adjustedTarget / 12, 2)
            : 0;

        $monthlyCollection = $fiscalMonths->map(function ($date) use (
            $collectedByMonth,
            $monthlyTarget,
        ) {
            $month = $date->format('Y-m');

            return [
                'month' => $date->format('M'),
                'collected' => (float) ($collectedByMonth[$month] ?? 0),
                'target' => $monthlyTarget,
            ];
        });

        $recentPayments = DB::table('payments')
            ->join(
                'cycle_obligations',
                'payments.cycle_obligation_id',
                '=',
                'cycle_obligations.id',
            )
            ->join(
                'unit_co_owners',
                'cycle_obligations.ownership_id',
                '=',
                'unit_co_owners.id',
            )
            ->join(
                'co_owners',
                'unit_co_owners.co_owner_id',
                '=',
                'co_owners.id',
            )
            ->where('cycle_obligations.annual_target_budget_id', $budget->id)
            ->whereNull('payments.voided_at')
            ->orderByDesc('payments.paid_at')
            ->limit(5)
            ->select([
                'co_owners.name',
                'payments.paid_at',
                'payments.amount',
            ])
            ->get()
            ->map(fn ($payment) => [
                'name' => $payment->name,
                'date' => Carbon::parse($payment->paid_at)->format('Y-m-d'),
                'amount' => (float) $payment->amount,
            ]);

        $percentOfTarget = $adjustedTarget > 0
            ? (int) round(($collected / $adjustedTarget) * 100)
            : 0;

        return Inertia::render('properties/dashboard', [
            'property' => $propertyData,

            'kpis' => [
                'unitsCount' => $unitsCount,
                'coOwnersCount' => $obligations->count(),
                'targetBudget' => $adjustedTarget,
                'collectedYtd' => $collected,
                'remainingBalance' => $remainingBalance,
                'isDeficit' => $remainingBalance < 0,
                'percentOfTarget' => $percentOfTarget,
                'fiscalYearLabel' => $budget->start_date->format('M Y')
                    .' - '
                    .$budget->end_date->format('M Y'),
                'paidCount' => $paidCount,
                'partialCount' => $partialCount,
                'pendingCount' => $pendingCount,
            ],

            'collectionProgress' => [
                'collected' => $collected,
                'target' => $adjustedTarget,
                'totalOwners' => $ownerProgress->count(),
                'owners' => $owners->take(5)->values(),
            ],

            'monthlyCollection' => $monthlyCollection,

            'recentPayments' => $recentPayments,
        ]);
    }
}
