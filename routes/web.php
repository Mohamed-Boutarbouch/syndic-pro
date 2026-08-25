<?php

use App\Http\Controllers\Onboarding\PropertyController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::prefix('onboarding')->name('onboarding.')->group(function () {
    Route::get('/property', [PropertyController::class, 'show'])
        ->name('property.show');

    Route::post('/property', [PropertyController::class, 'store'])
        ->name('property.store');
});

require __DIR__.'/settings.php';
