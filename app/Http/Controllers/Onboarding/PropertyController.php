<?php

namespace App\Http\Controllers\Onboarding;

use App\Http\Requests\Onboarding\StorePropertyRequest;
use App\Models\Property;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
        $property = Property::create($request->validated());

        return to_route('onboarding.budget.create', $property)
            ->with('success', 'Property created. Now set up your first budget cycle.');
    }

    public function edit(Request $request, Property $property): Response
    {
        return Inertia::render('onboarding/property', [
            'property' => $property,
        ]);
    }
}
