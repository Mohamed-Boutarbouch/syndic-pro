<?php

use App\Http\Controllers\BillingController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\CoOwnerController;
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

    Route::get(
        'properties/{property}/co-owners',
        CoOwnerController::class,
    )->name('properties.co-owners');

    Route::get(
        'properties/{property}/billing',
        BillingController::class,
    )->name('properties.billing');
});

require __DIR__.'/onboarding.php';
require __DIR__.'/settings.php';
