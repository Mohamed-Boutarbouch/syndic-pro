<?php

namespace App\Http\Requests;

use App\Enums\UnitTypes;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUnitRequest extends FormRequest
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
            'label' => ['required', 'string', 'max:30'],
            'floor' => ['nullable', 'string', 'max:30'],
            'type' => ['required', Rule::enum(UnitTypes::class)],
            'weight_coefficient' => ['required', 'numeric', 'min:0.1', 'max:9.9'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
