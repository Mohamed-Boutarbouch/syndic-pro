<?php

namespace App\Http\Controllers;

use App\Actions\Budget\UpdateAnnualTargetBudgetAction;
use App\Http\Requests\UpdateAnnualTargetBudgetRequest;
use App\Models\AnnualTargetBudget;
use App\Models\Property;
use Illuminate\Http\RedirectResponse;

class UpdateAnnualTargetBudgetController
{
    public function __invoke(
        UpdateAnnualTargetBudgetRequest $request,
        Property $property,
        AnnualTargetBudget $budget,
        UpdateAnnualTargetBudgetAction $action
    ): RedirectResponse {
        // Defensive check: ensure the budget actually belongs to this property
        // (scoped binding is the cleaner long-term fix — see note below).
        abort_unless($budget->property_id === $property->id, 404);

        $action->handle($budget, $request->validated());

        return back()->with('success', 'Fiscal year updated.');
    }
}
