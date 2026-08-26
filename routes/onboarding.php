<?php

use App\Http\Controllers\Onboarding\AnnualTargetBudgetController;
use App\Http\Controllers\Onboarding\CoOwnerController;
use App\Http\Controllers\Onboarding\PropertyController;
use App\Http\Controllers\Onboarding\UnitController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')
    ->prefix('onboarding')
    ->name('onboarding.')
    ->group(function () {
        Route::get('property', [PropertyController::class, 'create'])
            ->name('property.create');

        Route::post('property', [PropertyController::class, 'store'])
            ->name('property.store');

        Route::get('property/{property}/budget', [
            AnnualTargetBudgetController::class,
            'create',
        ])->name('budget.create');

        Route::post('property/{property}/budget', [
            AnnualTargetBudgetController::class,
            'store',
        ])->name('budget.store');

        Route::get('property/{property}/units', [
            UnitController::class,
            'create',
        ])->name('units.create');

        Route::post('property/{property}/units', [
            UnitController::class,
            'store',
        ])->name('units.store');

        Route::get('property/{property}/co-owners', [
            CoOwnerController::class,
            'create',
        ])->name('co-owners.create');

        Route::post('property/{property}/co-owners', [
            CoOwnerController::class,
            'store',
        ])->name('co-owners.store');
    });
