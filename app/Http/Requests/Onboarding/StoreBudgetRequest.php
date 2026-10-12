<?php

namespace App\Http\Requests\Onboarding;

use Illuminate\Foundation\Http\FormRequest;

class StoreBudgetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'start_date' => ['required', 'date'],

            'end_date' => ['required', 'date', 'after:start_date'],

            'total_budget' => ['required', 'numeric', 'gt:0', 'decimal:0,2'],

            'is_budget_locked' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'start_date' => 'start date',
            'end_date' => 'end date',
            'total_budget' => 'total budget',
            'is_budget_locked' => 'budget locked status',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'end_date.after' => 'The end date must be after the start date.',
            'total_budget.gt' => 'The total budget must be greater than 0.',
            'total_budget.decimal' => 'The total budget may have a maximum of 2 decimal places.',
        ];
    }
}
