<?php

namespace App\Http\Controllers\Budget;

use App\Actions\Budget\UpdateAnnualTargetBudgetAction;
use App\Http\Requests\Budget\UpdateBudgetRequest;
use App\Models\AnnualTargetBudget;
use App\Models\Property;
use Illuminate\Http\RedirectResponse;

class UpdateBudgetController
{
    public function __invoke(
        UpdateBudgetRequest $request,
        AnnualTargetBudget $budget,
        Property $property,
        UpdateAnnualTargetBudgetAction $action
    ): RedirectResponse {
        abort_unless($budget->property_id === $property->id, 404);

        $action->handle($budget, $request->validated());

        return back()->with('success', 'Fiscal year updated.');
    }
}
