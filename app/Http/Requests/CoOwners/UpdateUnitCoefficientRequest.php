<?php

namespace App\Http\Requests\CoOwners;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUnitCoefficientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'weight_coefficient' => ['required', 'numeric', 'min:0.01', 'max:999.99'],
        ];
    }
}
