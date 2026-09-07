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

    public static function translationsFor(string $locale): array
    {
        $path = lang_path("{$locale}.json");

        return file_exists($path) ? json_decode(file_get_contents($path), true) : [];
    }
}
