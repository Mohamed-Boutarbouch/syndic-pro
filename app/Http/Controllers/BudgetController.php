<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Inertia\Inertia;
use Inertia\Response;

class BudgetController
{
    public function __invoke(Property $property): Response
    {
        return Inertia::render('properties/budget', [
            'property' => [
                'id' => $property->id,
                'name' => $property->name,
            ],
        ]);
    }
}
