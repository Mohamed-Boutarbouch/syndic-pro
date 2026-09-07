<?php

use App\Http\Controllers\AddMidYearUnitController;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\CoOwnerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LedgerController;
use App\Http\Controllers\StorePaymentController;
use App\Http\Controllers\TransferSyndicController;
use App\Http\Controllers\UpdateAnnualTargetBudgetController;
use App\Http\Controllers\UpdateBillingFrequencyController;
use App\Http\Controllers\UpdateUnitCoefficientController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get(
        'properties/{property}/dashboard',
        DashboardController::class,
    )->name('properties.dashboard');

    // Add alongside existing property routes (adjust prefix/middleware to match
    // how properties/{property} routes are already grouped in your routes file).
    Route::get(
        'properties/{property}/budget',
        BudgetController::class,
    )->name('properties.budget');

    Route::post('properties/{property}/budget/units', AddMidYearUnitController::class)
        ->name('properties.budget.units.store');

    // NOTE: scoping this route model binding (Route::scopedBindings()) so that
    // {budget} is automatically constrained to the parent {property} would let
    // you drop the manual abort_unless() check in the controller.
    Route::patch(
        'properties/{property}/budget/{budget}',
        UpdateAnnualTargetBudgetController::class
    )->name('properties.budget.update');

    Route::get(
        'properties/{property}/co-owners',
        CoOwnerController::class,
    )->name('properties.co-owners');

    Route::patch(
        'properties/{property}/co-owners/units/{unit}/coefficient',
        UpdateUnitCoefficientController::class,
    )->name('properties.co-owners.units.coefficient');

    Route::post(
        'properties/{property}/co-owners/syndic/transfer',
        TransferSyndicController::class,
    )->name('properties.co-owners.syndic.transfer');

    Route::get(
        'properties/{property}/billing',
        BillingController::class,
    )->name('properties.billing');

    Route::patch(
        'properties/{property}/billing/co-owners/{unitCoOwner}/frequency',
        UpdateBillingFrequencyController::class,
    )->name('properties.billing.co-owners.frequency');

    Route::get(
        'properties/{property}/ledger',
        LedgerController::class,
    )->name('properties.ledger');

    Route::post(
        'properties/{property}/ledger/payments',
        StorePaymentController::class,
    )->name('properties.ledger.payments.store');
});

require __DIR__.'/onboarding.php';
require __DIR__.'/settings.php';
