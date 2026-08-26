<?php

namespace App\Http\Requests\Onboarding;

use App\Enums\BillingFrequency;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCoOwnersRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $unitIds = collect($this->input('coOwners', []))
            ->pluck('unitId')
            ->filter()
            ->all();

        return [
            'coOwners' => ['required', 'array', 'min:1'],

            'coOwners.*.unitId' => [
                'required',
                'integer',
                Rule::exists('units', 'id')
                    ->where('property_id', $this->route('property')->id),
            ],

            'coOwners.*.name' => [
                'required',
                'string',
                'max:255',
            ],

            'coOwners.*.email' => [
                'nullable',
                'email',
                'max:255',
            ],

            'coOwners.*.phone' => [
                'nullable',
                'string',
                'max:255',
            ],

            'coOwners.*.billing_frequency' => [
                'required',
                'string',
                Rule::enum(BillingFrequency::class),
            ],

            'coOwners.*.is_active' => [
                'required',
                'boolean',
            ],

            'syndicUnitId' => [
                'required',
                'integer',
                Rule::in($unitIds),
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'coOwners' => 'co-owners',
            'coOwners.*.name' => 'co-owner name',
            'coOwners.*.email' => 'email',
            'coOwners.*.phone' => 'phone number',
            'coOwners.*.billing_frequency' => 'billing frequency',
            'coOwners.*.is_active' => 'active status',
            'syndicUnitId' => 'syndic',
        ];
    }
}
