<?php

namespace App\Http\Controllers\CoOwners;

use App\Actions\CoOwners\AssignCoOwnerToUnit;
use App\Http\Requests\CoOwners\StoreUnitCoOwnerRequest;
use App\Models\Property;
use App\Models\Unit;
use Illuminate\Http\RedirectResponse;

class StoreUnitCoOwnerController
{
    public function __invoke(
        StoreUnitCoOwnerRequest $request,
        Property $property,
        Unit $unit,
        AssignCoOwnerToUnit $action,
    ): RedirectResponse {
        abort_unless($unit->property_id === $property->id, 404);

        $action->handle($unit, $request->validated());

        $currentBudget = $property->currentAnnualTargetBudget()->first();

        // Billing participation only starts once a budget cycle picks this
        // unit up (see AssignCoOwnerToUnit's docblock) — surface that to
        // the user rather than letting them assume payments start now.
        if ($currentBudget && $currentBudget->is_budget_locked) {
            return back()->with(
                'warning',
                'Co-owner assigned. Billing will remain inactive for this unit until the next budget is created.',
            );
        }

        return back()->with('success', 'Co-owner assigned.');
    }
}
