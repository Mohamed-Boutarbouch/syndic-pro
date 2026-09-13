<?php

namespace App\Http\Requests\Billing;

use App\Enums\BillingFrequency;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBillingFrequencyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * The frontend's PaymentFrequency type uses `semi-annual` (hyphen) as
     * an object key, while the backend enum is `semi_annual` (underscore).
     * Normalize before validation so the enum rule can match it.
     */
    protected function prepareForValidation(): void
    {
        if ($this->input('billing_frequency') === 'semi-annual') {
            $this->merge(['billing_frequency' => 'semi_annual']);
        }
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'billing_frequency' => [
                'required',
                Rule::enum(BillingFrequency::class),
            ],
        ];
    }
}
