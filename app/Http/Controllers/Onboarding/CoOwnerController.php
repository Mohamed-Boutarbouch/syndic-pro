<?php

namespace App\Http\Controllers\Onboarding;

use App\Enums\BillingFrequency;
use App\Http\Requests\Onboarding\StoreCoOwnersRequest;
use App\Models\CoOwner;
use App\Models\Property;
use App\Models\Unit;
use App\Models\UnitCoOwner;
use App\Services\Onboarding\CoOwnerCycleObligation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CoOwnerController
{
    public function __construct(
        private readonly CoOwnerCycleObligation $cycleObligations,
    ) {}

    public function create(Property $property): Response
    {
        $units = $property->units()
            ->orderBy('id', 'asc')
            ->get([
                'id',
                'property_id',
                'label',
                'floor',
                'type',
                'weight_coefficient',
                'calculated_annual_budget',
                'is_active',
            ]);

        $budget = $property->currentAnnualTargetBudget()->first();

        return Inertia::render('onboarding/co-owner', [
            'property' => [
                'id' => $property->id,
                'name' => $property->name,
            ],
            'budget' => (float) $budget?->total_budget,

            'units' => $units->map(fn ($unit) => [
                'id' => $unit->id,
                'property_id' => $unit->property_id,
                'label' => $unit->label,
                'floor' => $unit->floor,
                'type' => $unit->type,
                'weight_coefficient' => (float) $unit->weight_coefficient,
                'calculated_annual_budget' => (float) $unit->calculated_annual_budget,
                'is_active' => $unit->is_active,
            ])->values(),

            'billingFrequency' => collect(BillingFrequency::cases())
                ->map(fn (BillingFrequency $type) => [
                    'value' => $type->value,
                    'label' => $type->name,
                ])
                ->values(),
        ]);
    }

    public function store(
        StoreCoOwnersRequest $request,
        Property $property,
    ): RedirectResponse {
        $syndicUnitId = (int) $request->validated('syndicUnitId');

        $annualTargetBudget = $property->currentAnnualTargetBudget()->first();

        if ($annualTargetBudget === null) {
            return back()->withErrors([
                'coOwners' => 'This property has no annual target budget set up yet. Create one before assigning co-owners.',
            ]);
        }

        DB::transaction(function () use ($request, $syndicUnitId, $annualTargetBudget) {
            $coOwnersInput = $request->validated('coOwners');

            // Load all referenced units up front, keyed by id, so every
            // amount below comes from the DB row — never from the request.
            $unitIds = collect($coOwnersInput)->pluck('unitId');
            $units = Unit::whereIn('id', $unitIds)->get()->keyBy('id');

            foreach ($coOwnersInput as $input) {
                $unit = $units->get($input['unitId']);

                $coOwner = CoOwner::create([
                    'name' => $input['name'],
                    'email' => $input['email'] ?: null,
                    'phone' => $input['phone'] ?: null,
                    'is_active' => $input['is_active'],
                ]);

                $unitCoOwner = UnitCoOwner::create([
                    'unit_id' => $unit->id,
                    'co_owner_id' => $coOwner->id,
                    // Single co-owner per unit in this flow => full share.
                    'ownership_percentage' => 100,
                    'billing_frequency' => $input['billing_frequency'],
                    'is_designated_syndic' => $unit->id === $syndicUnitId,
                ]);

                $this->cycleObligations->createForUnitCoOwner(
                    $unit,
                    $unitCoOwner,
                    $annualTargetBudget,
                );
            }
        });

        return to_route('properties.dashboard', [
            'property' => $property,
        ])->with('success', 'Co-owners created successfully.');
    }
}
