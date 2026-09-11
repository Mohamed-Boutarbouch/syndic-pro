<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     */
    public function toResponse($request)
    {
        if ($request->wantsJson()) {
            return response()->json(['two_factor' => false]);
        }

        $designations = $request->user()
            ->currentSyndicDesignations()
            ->get(['id', 'property_id']);

        return match (true) {
            $designations->isEmpty() => redirect()->intended('/onboarding/property'),

            $designations->count() === 1 => redirect()->intended(
                "/properties/{$designations->first()->property_id}/dashboard"
            ),

            default => redirect()->intended('/properties/select'),
        };
    }
}
