<?php

namespace App\Http\Controllers\Onboarding;

use App\Http\Requests\Onboarding\StoreBudgetRequest;
use App\Models\Property;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AnnualTargetBudgetController
{
    public function create(Property $property): Response
    {
        return Inertia::render('onboarding/budget', [
            'property' => [
                'id' => $property->id,
                'name' => $property->name,
            ],
        ]);
    }

    public function store(
        StoreBudgetRequest $request,
        Property $property,
    ): RedirectResponse {
        $property->annualTargetBudgets()->create(
            $request->validated(),
        );

        return to_route(
            'onboarding.units.create',
            ['property' => $property->id],
        )->with(
            'success',
            'Annual target budget created. Now set up your property units.',
        );
    }
}
