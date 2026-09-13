<?php

namespace App\Actions\Budget;

use App\Models\AnnualTargetBudget;
use App\Models\Property;
use App\Models\Unit;
use Illuminate\Support\Facades\DB;

class AddMidYearUnitAction
{
    /**
     * Add a new unit mid-fiscal-year and recalculate only the
     * projected total budget top-line.
     *
     * Existing CycleObligation rows (locked-in monthly quotas for
     * current co-owners) are intentionally left untouched — the
     * immutability rule requires that only the AnnualTargetBudget's
     * total_budget shifts, never a resident's existing obligation.
     *
     * @param  array{label: string, floor: ?string, weight_coefficient: float|string}  $data
     */
    public function handle(Property $property, array $data): Unit
    {
        return DB::transaction(function () use ($property, $data) {
            /** @var AnnualTargetBudget|null $budget */
            $budget = $property->currentAnnualTargetBudget()
                ->lockForUpdate()
                ->first();

            $totalWeight = (float) $property->units()
                ->where('is_active', true)
                ->sum('weight_coefficient');

            $unit = $property->units()->create([
                'label' => $data['label'],
                'floor' => $data['floor'] ?? null,
                'weight_coefficient' => $data['weight_coefficient'],
                'is_active' => true,
            ]);

            if ($budget && $totalWeight > 0) {
                $sharePerPoint = round((float) $budget->total_budget / $totalWeight, 2);

                $addedBudget = round($sharePerPoint * (float) $data['weight_coefficient'], 2);

                $budget->update([
                    'total_budget' => round((float) $budget->total_budget + $addedBudget, 2),
                ]);
            }

            return $unit;
        });
    }
}
