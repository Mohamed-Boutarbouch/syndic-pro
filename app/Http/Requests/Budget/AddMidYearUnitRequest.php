<?php

namespace App\Http\Requests\Budget;

use Illuminate\Foundation\Http\FormRequest;

class AddMidYearUnitRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Replace with a policy check once Property policies exist, e.g.:
        // return $this->user()->can('update', $this->route('property'));
        return true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'label' => ['required', 'string', 'max:30'],
            'floor' => ['nullable', 'string', 'max:30'],
            'weight_coefficient' => ['required', 'numeric', 'min:0.01', 'max:999.99'],
        ];
    }
}
