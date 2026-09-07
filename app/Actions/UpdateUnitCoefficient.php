<?php

namespace App\Actions;

use App\Models\Property;
use App\Models\Unit;
use Illuminate\Support\Facades\DB;

class UpdateUnitCoefficient
{
    /**
     * Update a unit's weight coefficient and recompute the *projected*
     * annual budget shares for the whole property against the current
     * (locked) annual target budget total.
     *
     * Important: this only ever writes to `units.calculated_annual_budget`.
     * It never touches `cycle_obligations` rows — those are locked at the
     * moment they're generated for a fiscal cycle and must stay immutable
     * even when weights change mid-year. A weight/coefficient change here
     * only reshapes forward-looking projections; already-issued obligations
     * are handled separately via CycleAdjustment when the cycle is next run.
     *
     * @return array{unit: Unit, totalWeight: float, ratePerPoint: float}
     */
    public function handle(Property $property, Unit $unit, float $weightCoefficient): array
    {
        return DB::transaction(function () use ($property, $unit, $weightCoefficient) {
            $unit->weight_coefficient = $weightCoefficient;
            $unit->save();

            $units = $property->units()->get();
            $totalWeight = $units->sum(fn (Unit $u) => (float) $u->weight_coefficient);

            $currentBudget = $property->currentAnnualTargetBudget()->first();
            $totalBudget = $currentBudget ? (float) $currentBudget->total_budget : 0;
            $ratePerPoint = $totalWeight > 0 ? $totalBudget / $totalWeight : 0;

            foreach ($units as $u) {
                $projected = round($ratePerPoint * (float) $u->weight_coefficient, 2);

                if ((float) $u->calculated_annual_budget !== $projected) {
                    $u->calculated_annual_budget = $projected;
                    $u->save();
                }
            }

            $unit->refresh();

            return [
                'unit' => $unit,
                'totalWeight' => $totalWeight,
                'ratePerPoint' => round($ratePerPoint, 2),
            ];
        });
    }
}
