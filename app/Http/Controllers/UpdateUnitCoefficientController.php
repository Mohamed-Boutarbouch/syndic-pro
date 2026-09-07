<?php

namespace App\Http\Controllers;

use App\Actions\UpdateUnitCoefficient;
use App\Http\Requests\UpdateUnitCoefficientRequest;
use App\Models\Property;
use App\Models\Unit;
use Illuminate\Http\RedirectResponse;

class UpdateUnitCoefficientController
{
    public function __invoke(
        UpdateUnitCoefficientRequest $request,
        Property $property,
        Unit $unit,
        UpdateUnitCoefficient $action,
    ): RedirectResponse {
        abort_unless($unit->property_id === $property->id, 404);

        $action->handle(
            $property,
            $unit,
            (float) $request->validated('weight_coefficient'),
        );

        return back();
    }
}
