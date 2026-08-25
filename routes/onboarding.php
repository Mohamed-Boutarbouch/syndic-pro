<?php

// use App\Http\Controllers\Onboarding\AnnualTargetBudgetController;
use App\Http\Controllers\Onboarding\PropertyController;
use Illuminate\Support\Facades\Route;

// Route::middleware('auth')
// ->prefix('onboarding')
Route::prefix('onboarding')
    ->name('onboarding.')
    ->group(function () {
        Route::get('property', [PropertyController::class, 'create'])->name('property.create');
        Route::post('property', [PropertyController::class, 'store'])->name('property.store');

        // Route::get('property/{property}/budget', [AnnualTargetBudgetController::class, 'create'])
        //     ->name('budget.create');
        // Route::post('property/{property}/budget', [AnnualTargetBudgetController::class, 'store'])
        //     ->name('budget.store');
    });
