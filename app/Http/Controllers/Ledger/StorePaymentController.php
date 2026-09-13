<?php

namespace App\Http\Controllers\Ledger;

use App\Actions\Ledger\PaymentRecorder;
use App\Enums\PaymentMethod;
use App\Http\Requests\Ledger\StorePaymentRequest;
use App\Models\CycleObligation;
use App\Models\Property;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;

class StorePaymentController
{
    public function __invoke(
        Property $property,
        StorePaymentRequest $request,
        PaymentRecorder $recorder,
    ): RedirectResponse {
        $data = $request->validated();

        $obligation = CycleObligation::query()
            ->whereKey($request->input('_resolved_obligation_id'))
            ->with('ownership.coOwner.user')
            ->firstOrFail();

        $payerUser = $obligation->ownership->coOwner->user;

        abort_unless($payerUser, 422, 'This co-owner has no linked user account to attribute the payment to.');

        $recorder->record(
            obligation: $obligation,
            amount: (float) $data['amount'],
            paidAt: CarbonImmutable::parse($data['paid_at']),
            method: PaymentMethod::from($data['method']),
            paidBy: $payerUser,
            recordedBy: $request->user(),
            reference: $data['reference'] ?? null,
            notes: $data['notes'] ?? null,
        );

        return back()->with('success', 'Payment recorded.');
    }
}
