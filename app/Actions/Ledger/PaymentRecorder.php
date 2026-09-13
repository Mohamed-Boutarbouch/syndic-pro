<?php

namespace App\Actions\Ledger;

use App\Enums\PaymentMethod;
use App\Enums\ScheduleStatus;
use App\Models\CycleObligation;
use App\Models\Payment;
use App\Models\PaymentSchedule;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class PaymentRecorder
{
    /**
     * Apply a single incoming payment across a co-owner's outstanding
     * payment schedules (oldest due date first), splitting it into one
     * Payment row per schedule it touches. Any amount left over after every
     * schedule is fully paid is banked as credit_balance on the obligation.
     *
     * @return Collection<int, Payment>
     */
    public function record(
        CycleObligation $obligation,
        float $amount,
        CarbonImmutable $paidAt,
        PaymentMethod $method,
        User $paidBy,
        User $recordedBy,
        ?string $reference,
        ?string $notes,
    ): Collection {
        return DB::transaction(function () use (
            $obligation,
            $amount,
            $paidAt,
            $method,
            $paidBy,
            $recordedBy,
            $reference,
            $notes,
        ) {
            /** @var CycleObligation $obligation */
            $obligation = CycleObligation::query()
                ->whereKey($obligation->id)
                ->lockForUpdate()
                ->firstOrFail();

            $remaining = $amount;
            $createdPayments = collect();

            $outstandingSchedules = PaymentSchedule::query()
                ->where('cycle_obligation_id', $obligation->id)
                ->whereIn('status', [ScheduleStatus::Pending, ScheduleStatus::Partial, ScheduleStatus::Overdue])
                ->orderBy('due_date')
                ->lockForUpdate()
                ->get();

            foreach ($outstandingSchedules as $schedule) {
                if ($remaining <= 0) {
                    break;
                }

                $alreadyPaid = $schedule->payments()
                    ->whereNull('voided_at')
                    ->sum('amount');

                $outstandingOnSchedule = round((float) $schedule->amount_due - (float) $alreadyPaid, 2);

                if ($outstandingOnSchedule <= 0) {
                    continue;
                }

                $portion = min($remaining, $outstandingOnSchedule);

                $payment = Payment::create([
                    'cycle_obligation_id' => $obligation->id,
                    'payment_schedule_id' => $schedule->id,
                    'paid_by_user_id' => $paidBy->id,
                    'recorded_by_user_id' => $recordedBy->id,
                    'amount' => $portion,
                    'paid_at' => $paidAt,
                    'method' => $method,
                    'reference' => $reference,
                    'notes' => $notes,
                ]);

                $createdPayments->push($payment);

                $remaining = round($remaining - $portion, 2);

                $newTotalPaid = round((float) $alreadyPaid + $portion, 2);
                $schedule->update([
                    'status' => $newTotalPaid >= (float) $schedule->amount_due
                        ? ScheduleStatus::Paid
                        : ScheduleStatus::Partial,
                ]);
            }

            // Nothing left owing anywhere but money remains: park it as credit
            // for future installments instead of silently dropping it.
            if ($remaining > 0) {
                if ($createdPayments->isEmpty()) {
                    // No outstanding schedule at all (fully paid obligation) —
                    // still record the payment as an unattached credit deposit.
                    $payment = Payment::create([
                        'cycle_obligation_id' => $obligation->id,
                        'payment_schedule_id' => null,
                        'paid_by_user_id' => $paidBy->id,
                        'recorded_by_user_id' => $recordedBy->id,
                        'amount' => $remaining,
                        'paid_at' => $paidAt,
                        'method' => $method,
                        'reference' => $reference,
                        'notes' => trim(($notes ?? '').' [surplus credited to balance]'),
                    ]);
                    $createdPayments->push($payment);
                }

                $obligation->update([
                    'credit_balance' => round((float) $obligation->credit_balance + $remaining, 2),
                ]);
            }

            return $createdPayments;
        });
    }
}
