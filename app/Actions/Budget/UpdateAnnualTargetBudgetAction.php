<?php

namespace App\Actions\Budget;

use App\Models\AnnualTargetBudget;
use Illuminate\Validation\ValidationException;

class UpdateAnnualTargetBudgetAction
{
    /**
     * @param  array{start_date: string, end_date: string, total_budget: float|string, is_budget_locked: bool}  $data
     */
    public function handle(AnnualTargetBudget $budget, array $data): AnnualTargetBudget
    {
        // Once locked, the fiscal period and total_budget are frozen —
        // only the mid-year-add flow (AddMidYearUnitAction) may adjust
        // total_budget after lock, and it does so directly, bypassing
        // this action. Locking itself is still allowed here.
        // UpdateAnnualTargetBudgetAction
        if ($budget->is_budget_locked && $data['is_budget_locked']) {
            $frozenFieldsChanged =
                $budget->start_date->toDateString() !== $data['start_date']
                || $budget->end_date->toDateString() !== $data['end_date']
                || round((float) $budget->total_budget, 2) !== round((float) $data['total_budget'], 2);

            if ($frozenFieldsChanged) {
                throw ValidationException::withMessages([
                    'total_budget' => 'This budget is locked. Unlock it before changing the period or total.',
                ]);
            }
        }

        $budget->update([
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'total_budget' => $data['total_budget'],
            'is_budget_locked' => $data['is_budget_locked'],
        ]);

        return $budget;
    }
}
