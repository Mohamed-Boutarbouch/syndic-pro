<?php

namespace App\Http\Requests\CoOwners;

use App\Enums\BillingFrequency;
use App\Enums\UnitTypes;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUnitRowRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'label' => ['required', 'string', 'max:30'],
            'type' => ['required', Rule::enum(UnitTypes::class)],
            'floor' => ['nullable', 'string', 'max:30'],

            'coOwnerName' => ['required', 'string', 'max:255'],
            'coOwnerEmail' => ['nullable', 'string', 'email', 'max:255'],
            'coOwnerPhone' => ['nullable', 'string', 'max:30'],

            'billingFrequency' => ['nullable', Rule::enum(BillingFrequency::class)],

            'weightCoefficient' => ['required', 'numeric', 'min:0.1', 'max:9.9'],

            'unitCoOwnerId' => ['required', 'integer', 'exists:unit_co_owners,id'],
        ];
    }
}
