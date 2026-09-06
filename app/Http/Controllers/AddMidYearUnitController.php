<?php

namespace App\Http\Controllers;

use App\Actions\Budget\AddMidYearUnitAction;
use App\Http\Requests\AddMidYearUnitRequest;
use App\Models\Property;
use Illuminate\Http\RedirectResponse;

class AddMidYearUnitController
{
    public function __invoke(
        AddMidYearUnitRequest $request,
        Property $property,
        AddMidYearUnitAction $action
    ): RedirectResponse {
        $action->handle($property, $request->validated());

        return back()->with('success', 'Unit added — total budget updated.');
    }
}
