<?php

use App\Http\Controllers\Billing\ShowBillingController;
use App\Http\Controllers\Billing\StoreCoPayerController;
use App\Http\Controllers\Billing\UpdateBillingFrequencyController;
use App\Http\Controllers\Budget\AddMidYearUnitController;
use App\Http\Controllers\Budget\ShowBudgetController;
use App\Http\Controllers\Budget\UpdateBudgetController;
use App\Http\Controllers\CoOwners\ShowCoOwnersController;
use App\Http\Controllers\CoOwners\StoreUnitController;
use App\Http\Controllers\CoOwners\StoreUnitCoOwnerController;
use App\Http\Controllers\CoOwners\TransferSyndicController;
use App\Http\Controllers\CoOwners\UpdateUnitRowController;
use App\Http\Controllers\Ledger\ShowLedgerController;
use App\Http\Controllers\Ledger\StorePaymentController;
use App\Http\Controllers\Property\DashboardController;
use App\Http\Controllers\Property\PropertySelectionController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/properties/select', PropertySelectionController::class)
        ->name('properties.select');

    Route::get(
        'properties/{property}/dashboard',
        DashboardController::class,
    )->name('properties.dashboard');

    // Add alongside existing property routes (adjust prefix/middleware to match
    // how properties/{property} routes are already grouped in your routes file).
    Route::get(
        'properties/{property}/budget',
        ShowBudgetController::class,
    )->name('properties.budget');

    Route::post('properties/{property}/budget/units', AddMidYearUnitController::class)
        ->name('properties.budget.units.store');

    // NOTE: scoping this route model binding (Route::scopedBindings()) so that
    // {budget} is automatically constrained to the parent {property} would let
    // you drop the manual abort_unless() check in the controller.
    Route::patch(
        'properties/{property}/budget/{budget}',
        UpdateBudgetController::class
    )->name('properties.budget.update');

    Route::get(
        'properties/{property}/co-owners',
        ShowCoOwnersController::class,
    )->name('properties.co-owners');

    Route::patch(
        'properties/{property}/co-owners/units/{unit}',
        UpdateUnitRowController::class,
    )->name('properties.co-owners.units.update');

    Route::post(
        'properties/{property}/co-owners/syndic/transfer',
        TransferSyndicController::class,
    )->name('properties.co-owners.syndic.transfer');

    Route::post(
        'properties/{property}/units',
        StoreUnitController::class,
    )->name('properties.units.store');

    Route::post(
        'properties/{property}/units/{unit}/co-owners',
        StoreUnitCoOwnerController::class,
    )->name('properties.units.co-owners.store');

    Route::get(
        'properties/{property}/billing',
        ShowBillingController::class,
    )->name('properties.billing');

    Route::patch(
        'properties/{property}/billing/co-owners/{unitCoOwner}/frequency',
        UpdateBillingFrequencyController::class,
    )->name('properties.billing.co-owners.frequency');

    Route::post(
        'properties/{property}/billing/co-owners/{unitCoOwner}/co-payers',
        StoreCoPayerController::class,
    )->name('properties.billing.co-owners.co-payers.store');

    Route::get(
        'properties/{property}/ledger',
        ShowLedgerController::class,
    )->name('properties.ledger');

    Route::post(
        'properties/{property}/ledger/payments',
        StorePaymentController::class,
    )->name('properties.ledger.payments.store');
});

require __DIR__.'/onboarding.php';
require __DIR__.'/settings.php';
