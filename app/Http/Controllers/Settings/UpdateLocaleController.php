<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UpdateLocaleRequest;
use Illuminate\Http\RedirectResponse;

class UpdateLocaleController extends Controller
{
    /**
     * Switch the active locale.
     *
     * Persists to the authenticated user's `locale` column when logged in
     * (so the preference follows them across devices/sessions), and always
     * writes to session as well so guests and the current request both
     * pick it up immediately — HandleInertiaLocale checks session before
     * falling back to Accept-Language.
     */
    public function __invoke(UpdateLocaleRequest $request): RedirectResponse
    {
        $locale = $request->validated('locale');

        $request->user()->update(['locale' => $locale]);
        $request->session()->put('locale', $locale);

        return back();
    }
}
