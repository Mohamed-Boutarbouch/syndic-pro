<?php

namespace App\Http\Controllers\CoOwners;

use App\Actions\CoOwners\UpdateUnitRow;
use App\Http\Requests\CoOwners\UpdateUnitRowRequest;
use App\Models\Property;
use App\Models\Unit;
use Illuminate\Http\RedirectResponse;

class UpdateUnitRowController
{
    public function __invoke(
        UpdateUnitRowRequest $request,
        Property $property,
        Unit $unit,
        UpdateUnitRow $action,
    ): RedirectResponse {
        abort_unless($unit->property_id === $property->id, 404);

        $unitCoOwner = $unit->unitCoOwners()->findOrFail(
            $request->validated('unitCoOwnerId')
        );

        $action->handle(
            $property,
            $unit,
            $unitCoOwner,
            $request->validated(),
        );

        return back();
    }
}
