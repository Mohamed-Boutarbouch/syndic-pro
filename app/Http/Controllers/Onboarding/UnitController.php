<?php

namespace App\Http\Controllers\Onboarding;

use App\Enums\UnitTypes;
use App\Http\Requests\Onboarding\StoreUnitsRequest;
use App\Models\Property;
use App\Models\Unit;
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
                'total_budget' => $budget->total_budget,
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
        $now = now();

        $units = array_map(
            fn (array $unit) => [
                ...$unit,
                'property_id' => $property->id,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            $request->validated('units'),
        );

        Unit::insert($units);

        return to_route('dashboard')
            ->with(
                'success',
                'Units created successfully.',
            );
    }
}
