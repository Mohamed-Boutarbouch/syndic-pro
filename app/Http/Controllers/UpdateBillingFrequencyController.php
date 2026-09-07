<?php

namespace App\Http\Controllers;

use App\Enums\BillingFrequency;
use App\Enums\ObligationStatus;
use App\Http\Requests\UpdateBillingFrequencyRequest;
use App\Models\Property;
use App\Models\UnitCoOwner;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class UpdateBillingFrequencyController
{
    public function __invoke(
        UpdateBillingFrequencyRequest $request,
        Property $property,
        UnitCoOwner $unitCoOwner,
    ): RedirectResponse {
        abort_unless(
            $unitCoOwner->unit->property_id === $property->id,
            404,
        );

        $frequency = $request->enum('billing_frequency', BillingFrequency::class);

        DB::transaction(function () use ($unitCoOwner, $frequency) {
            $unitCoOwner->update([
                'billing_frequency' => $frequency,
            ]);

            // Keep the active cycle obligation's interval in sync so future
            // payment schedules reflect the new frequency. Past schedules
            // and payments are left untouched (immutability of history).
            $unitCoOwner->cycleObligations()
                ->where('status', ObligationStatus::Active)
                ->update([
                    'payment_interval_months' => $frequency->intervalMonths(),
                ]);
        });

        return back();
    }
}
