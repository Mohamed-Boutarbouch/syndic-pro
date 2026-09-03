<?php

namespace App\Http\Controllers\Onboarding;

use App\Enums\UnitTypes;
use App\Http\Requests\Onboarding\StoreUnitsRequest;
use App\Models\Property;
use App\Models\Unit;
use App\Services\Onboarding\UnitBudgetCalculator;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UnitController
{
    public function create(Property $property): Response
    {
        $budget = $property->annualTargetBudgets()
            ->latest('id')
            ->firstOrFail();

        return Inertia::render('onboarding/unit', [
            'property' => [
                'id' => $property->id,
                'name' => $property->name,
            ],
            'budget' => [
                'id' => $budget->id,
                'start_date' => $budget->start_date->toDateString(),
                'end_date' => $budget->end_date->toDateString(),
                'total_budget' => (float) $budget->total_budget,
            ],
            'unitTypes' => collect(UnitTypes::cases())
                ->map(fn (UnitTypes $type) => [
                    'value' => $type->value,
                    'label' => $type->name,
                ])
                ->values(),
            'maxUnits' => config('onboarding.max_units'),
        ]);
    }

    public function store(
        StoreUnitsRequest $request,
        Property $property,
    ): RedirectResponse {
        $budget = $property->annualTargetBudgets()
            ->latest('id')
            ->firstOrFail();

        $unitsInput = $request->validated('units');

        $shares = UnitBudgetCalculator::calculate(
            array_column($unitsInput, 'weight_coefficient'),
            (float) $budget->total_budget,
        );

        $now = now();

        $units = array_map(
            fn (array $unit, int $index) => [
                ...$unit,
                'property_id' => $property->id,
                'calculated_annual_budget' => $shares[$index],
                'created_at' => $now,
                'updated_at' => $now,
            ],
            $unitsInput,
            array_keys($unitsInput),
        );

        Unit::insert($units);

        return to_route(
            'onboarding.co-owners.create',
            ['property' => $property],
        )->with(
            'success',
            'Units created successfully.',
        );
    }
}
