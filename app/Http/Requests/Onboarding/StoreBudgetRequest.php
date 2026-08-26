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
            'property_id' => [
                'required',
                'integer',
                'exists:properties,id',
            ],

            'start_date' => [
                'required',
                'date',
            ],

            'end_date' => [
                'required',
                'date',
                'after_or_equal:start_date',
            ],

            'total_budget' => [
                'required',
                'numeric',
                'min:0',
                'decimal:0,2',
            ],

            'is_budget_locked' => [
                'sometimes',
                'boolean',
            ],

            'created_by_user_id' => [
                'nullable',
                'integer',
                'exists:users,id',
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'property_id' => 'property',
            'start_date' => 'start date',
            'end_date' => 'end date',
            'total_budget' => 'total budget',
            'is_budget_locked' => 'budget locked status',
            'created_by_user_id' => 'creator',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'property_id.exists' => 'The selected property does not exist.',

            'end_date.after_or_equal' => 'The end date must be on or after the start date.',

            'total_budget.min' => 'The total budget cannot be negative.',

            'total_budget.decimal' => 'The total budget may have a maximum of 2 decimal places.',

            'created_by_user_id.exists' => 'The selected creator does not exist.',
        ];
    }
}
