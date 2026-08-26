<?php

namespace App\Http\Controllers\Onboarding;

use App\Enums\BillingFrequency;
use App\Http\Requests\Onboarding\StoreCoOwnersRequest;
use App\Models\CoOwner;
use App\Models\Property;
use App\Models\UnitCoOwner;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CoOwnerController
{
    public function create(Property $property): Response
    {
        $units = $property->units()
            ->latest('id')
            ->get([
                'id',
                'property_id',
                'label',
                'floor',
                'type',
                'weight_coefficient',
                'is_active',
            ]);

        return Inertia::render('onboarding/co-owner', [
            'property' => [
                'id' => $property->id,
                'name' => $property->name,
            ],
            'units' => $units,
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
        $now = now();
        $syndicUnitId = (int) $request->validated('syndicUnitId');

        DB::transaction(function () use ($request, $syndicUnitId) {
            $coOwnersInput = $request->validated('coOwners');

            foreach ($coOwnersInput as $input) {
                $coOwner = CoOwner::create([
                    'name' => $input['name'],
                    'email' => $input['email'] ?: null,
                    'phone' => $input['phone'] ?: null,
                    'is_active' => $input['is_active'],
                ]);

                UnitCoOwner::create([
                    'unit_id' => $input['unitId'],
                    'co_owner_id' => $coOwner->id,
                    'billing_frequency' => $input['billing_frequency'],
                    'is_designated_syndic' => $input['unitId'] === $syndicUnitId,
                ]);
            }
        });

        return to_route('dashboard')
            ->with('success', 'Co-owners created successfully.');
    }
}
