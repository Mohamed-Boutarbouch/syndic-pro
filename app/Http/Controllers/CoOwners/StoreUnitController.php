<?php

namespace App\Http\Controllers\CoOwners;

use App\Actions\CoOwners\CreateUnit;
use App\Http\Requests\CoOwners\StoreUnitRequest;
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
