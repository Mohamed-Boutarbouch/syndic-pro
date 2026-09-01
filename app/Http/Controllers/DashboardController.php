<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController
{
    public function __invoke(Property $property): Response
    {
        return Inertia::render('dashboard', [
            'property' => [
                'id' => $property->id,
                'name' => $property->name,
            ],
        ]);
    }
}
