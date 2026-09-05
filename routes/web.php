<?php

use App\Http\Controllers\BudgetController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get(
        'properties/{property}/dashboard',
        DashboardController::class,
    )->name('properties.dashboard');

    Route::get(
        'properties/{property}/budget',
        BudgetController::class,
    )->name('properties.budget');
});

require __DIR__.'/onboarding.php';
require __DIR__.'/settings.php';
