<?php

namespace App\Http\Controllers\Onboarding;

use App\Enums\SyndicEvent;
use App\Http\Requests\Onboarding\StorePropertyRequest;
use App\Models\Property;
use App\Models\SyndicDesignation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PropertyController
{
    public function create(): Response
    {
        return Inertia::render('onboarding/property');
    }

    public function store(StorePropertyRequest $request): RedirectResponse
    {
        $property = DB::transaction(function () use ($request) {
            $property = Property::create($request->validated());

            SyndicDesignation::create([
                'property_id' => $property->id,
                'user_id' => $request->user()->id,
                'event' => SyndicEvent::Assigned->value,
                'status' => SyndicEvent::Assigned,
                'assigned_at' => now(),
            ]);

            return $property;
        });

        return to_route('onboarding.budget.create', $property)
            ->with('success', 'Property created. Now set up your first budget cycle.');
    }
}
