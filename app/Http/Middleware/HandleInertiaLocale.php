<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class HandleInertiaLocale
{
    private const SUPPORTED = ['en', 'fr', 'ar'];

    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->session()->get('locale')
            ?? $request->user()?->locale
            ?? $request->getPreferredLanguage(self::SUPPORTED)
            ?? 'en';

        if (! in_array($locale, self::SUPPORTED, true)) {
            $locale = 'en';
        }

        App::setLocale($locale);

        return $next($request);
    }

    /**
     * Return the JSON translations for the requested locale.
     *
     * @return array<string, mixed>
     */
    public static function translationsFor(string $locale): array
    {
        if (! in_array($locale, self::SUPPORTED, true)) {
            $locale = 'en';
        }

        $path = lang_path("{$locale}.json");

        if (! is_file($path)) {
            return [];
        }

        $translations = json_decode(
            file_get_contents($path),
            true,
        );

        return is_array($translations) ? $translations : [];
    }
}
