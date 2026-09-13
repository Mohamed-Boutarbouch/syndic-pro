<?php

namespace App\Http\Controllers\Property;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PropertySelectionController extends Controller
{
    /**
     * Show the property selection screen for syndics managing multiple properties.
     */
    public function __invoke(Request $request): Response|RedirectResponse
    {
        $designations = $request->user()
            ->currentSyndicDesignations()
            ->with('property:id,name,address,city')
            ->get();

        // Guard against someone landing here directly with 0 or 1 designation.
        if ($designations->count() < 2) {
            return $designations->isEmpty()
                ? redirect('/onboarding/property')
                : redirect("/properties/{$designations->first()->property_id}/dashboard");
        }

        return Inertia::render('properties/select', [
            'properties' => $designations->map(fn ($designation) => [
                'id' => $designation->property->id,
                'name' => $designation->property->name,
                'address' => $designation->property->address,
                'city' => $designation->property->city,
            ])->values(),
        ]);
    }
}
