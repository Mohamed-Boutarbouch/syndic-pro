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
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified', 'property.current'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::get('budget', ShowBudgetController::class)->name('budget');
    Route::post('budget/units', AddMidYearUnitController::class)->name('budget.units.store');
    Route::patch('budget/{budget}', UpdateBudgetController::class)->name('budget.update');

    Route::get('co-owners', ShowCoOwnersController::class)->name('co-owners');
    Route::patch('co-owners/units/{unit}', UpdateUnitRowController::class)->name('co-owners.units.update');
    Route::post('co-owners/syndic/transfer', TransferSyndicController::class)->name('co-owners.syndic.transfer');

    Route::post('units', StoreUnitController::class)->name('units.store');
    Route::post('units/{unit}/co-owners', StoreUnitCoOwnerController::class)->name('units.co-owners.store');

    Route::get('billing', ShowBillingController::class)->name('billing');
    Route::patch('billing/co-owners/{unitCoOwner}/frequency', UpdateBillingFrequencyController::class)->name('billing.co-owners.frequency');
    Route::post('billing/co-owners/{unitCoOwner}/co-payers', StoreCoPayerController::class)->name('billing.co-owners.co-payers.store');

    Route::get('ledger', ShowLedgerController::class)->name('ledger');
    Route::post('ledger/payments', StorePaymentController::class)->name('ledger.payments.store');
});

require __DIR__.'/onboarding.php';
require __DIR__.'/settings.php';
