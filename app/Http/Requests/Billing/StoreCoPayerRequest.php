<?php

namespace App\Http\Requests\Billing;

use Illuminate\Foundation\Http\FormRequest;

class StoreCoPayerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // plug in your syndic-of-property check/policy here
    }

    /** @return array<string, array<int, string>> */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email:rfc', 'max:255'],
            'share_percentage' => ['required', 'numeric', 'min:1', 'max:99'],
        ];
    }
}
