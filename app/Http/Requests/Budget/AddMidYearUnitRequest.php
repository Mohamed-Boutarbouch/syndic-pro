<?php

namespace App\Http\Requests\Budget;

use App\Enums\UnitTypes;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
            'label' => [
                'required', 'string', 'max:30',
                Rule::unique('units', 'label')
                    ->where('property_id', $this->route('property')?->id ?? app('currentProperty')->id)
                    ->where('is_active', true),
            ],
            'floor' => ['nullable', 'string', 'max:30'],
            'type' => ['nullable', Rule::enum(UnitTypes::class)],
            'weight_coefficient' => ['required', 'numeric', 'min:0.1', 'max:999.99'],
        ];
    }
}
