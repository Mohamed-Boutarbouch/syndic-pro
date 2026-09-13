<?php

namespace App\Actions\CoOwners;

use App\Models\Property;
use App\Models\Unit;

class CreateUnit
{
    /**
     * Create a bare unit record on a property.
     *
     * Deliberately does NOT touch AnnualTargetBudget, CycleObligation, or
     * CycleAdjustment. A unit can exist with no owner and no obligation —
     * budget wiring only happens once a co-owner is assigned AND a locked
     * budget exists (see AssignCoOwnerToUnit). This keeps "unit inventory"
     * and "budget participation" as separate concerns, per the immutability
     * rule already applied in AddMidYearUnitController's flow.
     *
     * @param  array{label: string, floor: ?string, type: string, weight_coefficient: float}  $data
     */
    public function handle(Property $property, array $data): Unit
    {
        return $property->units()->create([
            'label' => $data['label'],
            'floor' => $data['floor'] ?? null,
            'type' => $data['type'],
            'weight_coefficient' => $data['weight_coefficient'],
            'calculated_annual_budget' => 0,
            'is_active' => true,
        ]);
    }
}
