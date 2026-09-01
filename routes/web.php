<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get(
        'properties/{property}/dashboard',
        DashboardController::class,
    )->name('properties.dashboard');
});

require __DIR__.'/onboarding.php';
require __DIR__.'/settings.php';
