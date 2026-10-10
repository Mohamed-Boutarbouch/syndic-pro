<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ResolveCurrentProperty
{
    public function handle(Request $request, Closure $next)
    {
        $property = $request->user()
            ->currentSyndicDesignations()
            ->with('property')
            ->latest('assigned_at')
            ->first()
            ?->property;

        if (! $property) {
            return redirect()->route('onboarding.property.create');
        }

        // Same mechanism implicit binding uses, so `Property $property`
        // in controllers and `$this->route('property')` in requests still work.
        $request->route()->setParameter('property', $property);

        return $next($request);
    }
}
