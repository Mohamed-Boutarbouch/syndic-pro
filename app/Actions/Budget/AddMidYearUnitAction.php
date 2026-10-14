<?php

namespace App\Actions\Budget;

use App\Enums\AdjustmentType;
use App\Enums\UnitTypes;
use App\Models\AnnualTargetBudget;
use App\Models\Property;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AddMidYearUnitAction
{
    /**
     * Add a unit mid-fiscal-year and raise only the budget top-line.
     * Existing CycleObligation rows are never touched (immutability rule).
     *
     * @param  array{label: string, floor?: ?string, type?: ?string, weight_coefficient: float|string}  $data
     */
    public function handle(Property $property, array $data, User $actor): Unit
    {
        return DB::transaction(function () use ($property, $data, $actor) {
            // Query directly instead of currentAnnualTargetBudget(): latestOfMany()
            // joins a GROUP BY subquery, which Postgres rejects with FOR UPDATE.
            /** @var AnnualTargetBudget|null $budget */
            $budget = AnnualTargetBudget::query()
                ->where('property_id', $property->id)
                ->orderByDesc('id')
                ->lockForUpdate()
                ->first();

            // Must be computed BEFORE the new unit exists.
            $totalWeight = (float) $property->units()
                ->where('is_active', true)
                ->sum('weight_coefficient');

            $weight = (float) $data['weight_coefficient'];

            $addedBudget = 0.0;

            if ($budget && $totalWeight > 0) {
                $sharePerPoint = (float) $budget->total_budget / $totalWeight;
                $addedBudget = round($sharePerPoint * $weight, 2);
            }

            $unit = $property->units()->create([
                'label' => $data['label'],
                'floor' => $data['floor'] ?? null,
                'type' => $data['type'] ?? UnitTypes::Residential->value,
                'weight_coefficient' => $weight,
                'calculated_annual_budget' => $addedBudget,
                'is_active' => true,
            ]);

            if ($budget && $addedBudget > 0) {
                $budget->update([
                    'total_budget' => round((float) $budget->total_budget + $addedBudget, 2),
                ]);

                // Audit trail that powers the "Budget Variance Alert".
                $budget->cycleAdjustments()->create([
                    'type' => AdjustmentType::OwnerJoined,
                    'delta_amount' => $addedBudget,
                    'reason' => sprintf('Unit %s added mid-year (weight %s).', $unit->label, $weight),
                    'created_by_user_id' => $actor->id,
                ]);
            }

            return $unit;
        });
    }
}
