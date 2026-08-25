<?php

namespace App\Http\Controllers\Onboarding;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PropertyController extends Controller
{
    public function show(): Response
    {
        return Inertia::render('onboarding/property');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'postalCode' => ['required', 'string', 'max:5'],
            'unitsCount' => ['required', 'integer', 'min:1'],
        ]);

        $property = DB::transaction(function () use ($validated) {
            $property = Property::create([
                'name' => $validated['name'],
                'address' => $validated['address'],
                'city' => $validated['city'],
                'postal_code' => $validated['postalCode'],
                'country_code' => 'MA',
                'is_active' => true,
            ]);

            return $property;
        });

        return redirect()->route('onboarding.units', $property);
    }
}
