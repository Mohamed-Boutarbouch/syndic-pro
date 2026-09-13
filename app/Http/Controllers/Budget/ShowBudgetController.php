<?php

namespace App\Http\Controllers\Budget;

use App\Models\Property;
use Inertia\Inertia;
use Inertia\Response;

class ShowBudgetController
{
    public function __invoke(Property $property): Response
    {
        // Note: avoid select() here — latestOfMany() builds an internal
        // join keyed on annual_target_budgets.property_id, and adding an
        // unqualified select('property_id', ...) collides with it and
        // throws "column reference property_id is ambiguous" on Postgres.
        $budget = $property->currentAnnualTargetBudget()->first();

        // Total weight across active units — used for "share per point".
        $totalWeight = (float) $property->units()
            ->where('is_active', true)
            ->sum('weight_coefficient');

        $sharePerPoint = $totalWeight > 0 && $budget
            ? round((float) $budget->total_budget / $totalWeight, 2)
            : 0.0;

        // Current distribution table: one row per active unit, with its
        // primary co-owner (the one flagged as designated syndic takes
        // priority for display, otherwise the first active co-owner).
        $units = $property->units()
            ->select(['id', 'label', 'floor', 'weight_coefficient', 'is_active'])
            ->where('is_active', true)
            ->with(['unitCoOwners' => function ($query) {
                $query->select([
                    'id',
                    'unit_id',
                    'co_owner_id',
                    'is_designated_syndic',
                ])
                    ->with(['coOwner:id,name']);
            }])
            ->orderBy('label')
            ->get()
            ->map(function ($unit) use ($totalWeight, $budget) {
                $primaryCoOwner = $unit->unitCoOwners
                    ->sortByDesc('is_designated_syndic')
                    ->first()?->coOwner;

                $amount = $totalWeight > 0 && $budget
                    ? round(
                        ((float) $unit->weight_coefficient / $totalWeight)
                            * (float) $budget->total_budget,
                        2
                    )
                    : 0.0;

                return [
                    'unit' => $unit->label,
                    'name' => $primaryCoOwner?->name,
                    'points' => (float) $unit->weight_coefficient,
                    'amount' => $amount,
                ];
            })
            ->values();

        return Inertia::render('properties/budget', [
            'property' => [
                'id' => $property->id,
                'name' => $property->name,
            ],
            'budget' => $budget ? [
                'id' => $budget->id,
                'startDate' => $budget->start_date->toDateString(),
                'endDate' => $budget->end_date->toDateString(),
                'totalBudget' => (float) $budget->total_budget,
                'isBudgetLocked' => $budget->is_budget_locked,
            ] : null,
            'distribution' => [
                'totalWeight' => $totalWeight,
                'sharePerPoint' => $sharePerPoint,
                'units' => $units,
            ],
        ]);
    }
}
