<?php

namespace App\Http\Controllers\Billing;

use App\Actions\Billing\AddCoPayerAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Billing\StoreCoPayerRequest;
use App\Models\CycleObligation;
use App\Models\Property;
use App\Models\UnitCoOwner;
use Illuminate\Http\RedirectResponse;

class StoreCoPayerController extends Controller
{
    public function __invoke(
        StoreCoPayerRequest $request,
        Property $property,
        UnitCoOwner $unitCoOwner,
        AddCoPayerAction $action,
    ): RedirectResponse {
        abort_unless(
            $unitCoOwner->unit()->where('property_id', $property->id)->exists(),
            404,
        );

        $budget = $property->currentAnnualTargetBudget;
        abort_if($budget === null, 404);

        $obligation = CycleObligation::query()
            ->where('annual_target_budget_id', $budget->id)
            ->where('ownership_id', $unitCoOwner->id) // FK points to unit_co_owners, as intended
            ->firstOrFail();

        $action->handle(
            $unitCoOwner,
            $obligation,
            $request->string('name')->toString(),
            $request->string('email')->lower()->toString(),
            (float) $request->input('share_percentage'),
        );

        return back();
    }
}
