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
