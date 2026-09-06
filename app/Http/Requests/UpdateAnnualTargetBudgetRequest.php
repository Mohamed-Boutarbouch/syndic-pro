<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAnnualTargetBudgetRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Replace with a policy check once Property policies exist.
        return true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'total_budget' => ['required', 'numeric', 'min:0'],
            'is_budget_locked' => ['required', 'boolean'],
        ];
    }
}
