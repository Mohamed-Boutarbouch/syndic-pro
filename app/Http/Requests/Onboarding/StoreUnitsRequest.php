<?php

namespace App\Http\Requests\Onboarding;

use App\Enums\UnitTypes;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUnitsRequest extends FormRequest
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
            'units' => [
                'required',
                'array',
                'min:1',
                'max:'.config('onboarding.max_units'),
            ],

            'units.*.label' => [
                'required',
                'string',
                'max:30',
                Rule::unique('units', 'label')
                    ->where(
                        fn ($query) => $query->where(
                            'property_id',
                            $this->route('property')->id,
                        ),
                    ),
            ],

            'units.*.floor' => [
                'nullable',
                'string',
                'max:30',
            ],

            'units.*.type' => [
                'required',
                Rule::enum(UnitTypes::class),
            ],

            'units.*.weight_coefficient' => [
                'required',
                'numeric',
                'decimal:0,1',
                'between:0,999',
            ],

            'units.*.is_active' => [
                'required',
                'boolean',
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'units' => 'units',
            'units.*.label' => 'unit label',
            'units.*.floor' => 'floor',
            'units.*.type' => 'unit type',
            'units.*.weight_coefficient' => 'weight coefficient',
            'units.*.is_active' => 'active status',
        ];
    }

    protected function prepareForValidation(): void
    {
        $units = collect($this->input('units', []))
            ->map(function (array $unit) {
                if (isset($unit['label'])) {
                    $unit['label'] = trim($unit['label']);
                }

                return $unit;
            })
            ->all();

        $this->merge([
            'units' => $units,
        ]);
    }
}
