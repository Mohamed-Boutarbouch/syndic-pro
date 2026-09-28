<?php

namespace App\Actions\CoOwners;

use App\Models\Property;
use App\Models\Unit;
use App\Models\UnitCoOwner;
use Illuminate\Support\Facades\DB;

class UpdateUnitRow
{
    /**
     * Update a unit's own fields (label/type/floor/weight_coefficient), its
     * linked co-owner's identity fields (name/email/phone), and the
     * unit_co_owner bridge row's billing_frequency — then recompute the
     * *projected* annual budget shares for the whole property against the
     * current (locked) annual target budget total.
     *
     * Important: coefficient recalculation only ever writes to
     * `units.calculated_annual_budget`. It never touches `cycle_obligations`
     * rows — those are locked at the moment they're generated for a fiscal
     * cycle and must stay immutable even when weights change mid-year. A
     * weight/coefficient change here only reshapes forward-looking
     * projections; already-issued obligations are handled separately via
     * CycleAdjustment when the cycle is next run.
     *
     * @param  array{
     *     label: string,
     *     type: string,
     *     floor: string|null,
     *     coOwnerName: string,
     *     coOwnerEmail: string|null,
     *     coOwnerPhone: string|null,
     *     billingFrequency: string|null,
     *     weightCoefficient: float,
     * }  $data
     * @return array{unit: Unit, totalWeight: float, ratePerPoint: float}
     */
    public function handle(Property $property, Unit $unit, UnitCoOwner $unitCoOwner, array $data): array
    {
        return DB::transaction(function () use ($property, $unit, $unitCoOwner, $data) {
            $unit->fill([
                'label' => $data['label'],
                'type' => $data['type'],
                'floor' => $data['floor'],
                'weight_coefficient' => $data['weightCoefficient'],
            ]);
            $unit->save();

            $unitCoOwner->coOwner()->update([
                'name' => $data['coOwnerName'],
                'email' => $data['coOwnerEmail'],
                'phone' => $data['coOwnerPhone'],
            ]);

            if ($data['billingFrequency'] !== null) {
                $unitCoOwner->billing_frequency = $data['billingFrequency'];
                $unitCoOwner->save();
            }

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
