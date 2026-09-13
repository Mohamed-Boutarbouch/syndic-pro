<?php

namespace App\Http\Requests\Ledger;

use App\Enums\ObligationStatus;
use App\Enums\PaymentMethod;
use App\Models\CycleObligation;
use App\Models\Property;
use App\Models\UnitCoOwner;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StorePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Route-level 'auth' + 'verified' middleware already gates access.
        // Tighten this to a policy (e.g. $this->user()->can('recordPayment', $property))
        // once Syndic-vs-co-owner authorization is modeled.
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'unit_co_owner_id' => [
                'required',
                'integer',
                Rule::exists('unit_co_owners', 'id'),
            ],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'paid_at' => ['required', 'date', 'before_or_equal:today'],
            'method' => ['required', Rule::enum(PaymentMethod::class)],
            'reference' => ['nullable', 'string', 'max:100'],
            'notes' => ['nullable', 'string'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator) {
                if ($validator->errors()->has('unit_co_owner_id')) {
                    return;
                }

                /** @var Property $property */
                $property = $this->route('property');

                $unitCoOwner = UnitCoOwner::query()
                    ->whereKey($this->input('unit_co_owner_id'))
                    ->whereHas('unit', fn ($q) => $q->where('property_id', $property->id))
                    ->first();

                if (! $unitCoOwner) {
                    $validator->errors()->add(
                        'unit_co_owner_id',
                        'This co-owner does not belong to the selected property.',
                    );

                    return;
                }

                $obligation = CycleObligation::query()
                    ->where('ownership_id', $unitCoOwner->id)
                    ->where('status', ObligationStatus::Active)
                    ->whereHas(
                        'annualTargetBudget',
                        fn ($q) => $q->where('property_id', $property->id)
                            ->where('is_budget_locked', true),
                    )
                    ->first();

                if (! $obligation) {
                    $validator->errors()->add(
                        'unit_co_owner_id',
                        'No active obligation exists for this co-owner under the current locked budget.',
                    );

                    return;
                }

                // Stash for the controller so it doesn't have to re-resolve this.
                $this->merge(['_resolved_obligation_id' => $obligation->id]);
            },
        ];
    }
}
