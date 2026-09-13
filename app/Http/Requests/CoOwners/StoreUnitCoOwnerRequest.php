<?php

namespace App\Http\Requests\CoOwners;

use App\Models\UnitCoOwner;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUnitCoOwnerRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Replace with a policy check once Property policies exist.
        return true;
    }

    /**
     * Supports two modes, distinguished by `mode`:
     *  - "existing": attach an existing CoOwner (`co_owner_id` required)
     *  - "new": create a CoOwner inline (`name` required, email/phone optional)
     *
     * NOTE: this enforces one co-owner per unit, per current product
     * decision. CoOwnerController's read side still supports multiple
     * unit_co_owners per unit (joint ownership) for legacy/future use —
     * that discrepancy is intentional for now but worth resolving before
     * joint-ownership UI is ever built, since the two are currently
     * inconsistent.
     *
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'mode' => ['required', Rule::in(['existing', 'new'])],

            'co_owner_id' => [
                Rule::requiredIf($this->input('mode') === 'existing'),
                'integer',
                Rule::exists('co_owners', 'id'),
                Rule::when(
                    $this->input('mode') === 'existing',
                    // Not currently linked to any unit_co_owners row.
                    function () {
                        return function (string $attribute, mixed $value, \Closure $fail) {
                            $alreadyLinked = UnitCoOwner::where('co_owner_id', $value)->exists();

                            if ($alreadyLinked) {
                                $fail('This co-owner is already assigned to a unit.');
                            }
                        };
                    },
                ),
            ],

            'name' => [
                Rule::requiredIf($this->input('mode') === 'new'),
                'string',
                'max:255',
            ],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
        ];
    }
}
