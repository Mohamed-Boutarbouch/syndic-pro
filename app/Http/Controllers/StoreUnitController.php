<?php

namespace App\Http\Controllers;

use App\Actions\CreateUnit;
use App\Http\Requests\StoreUnitRequest;
use App\Models\Property;
use Illuminate\Http\RedirectResponse;

class StoreUnitController
{
    public function __invoke(
        StoreUnitRequest $request,
        Property $property,
        CreateUnit $action,
    ): RedirectResponse {
        $action->handle($property, $request->validated());

        return back()->with('success', 'Unit added.');
    }
}
