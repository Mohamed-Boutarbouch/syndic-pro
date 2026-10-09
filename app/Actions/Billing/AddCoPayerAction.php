<?php

namespace App\Actions\Billing;

use App\Enums\ScheduleStatus;
use App\Models\CycleObligation;
use App\Models\PaymentCoPayer;
use App\Models\UnitCoOwner;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AddCoPayerAction
{
    public function handle(
        UnitCoOwner $unitCoOwner,
        CycleObligation $obligation,
        string $name,
        string $email,
        float $percentage,
    ): User {
        return DB::transaction(function () use ($unitCoOwner, $obligation, $name, $email, $percentage) {
            $ownerUserId = $unitCoOwner->coOwner->user_id;

            $schedules = $obligation->paymentSchedules()
                ->whereIn('status', [
                    ScheduleStatus::Pending,
                    ScheduleStatus::Partial,
                    ScheduleStatus::Overdue,
                ])
                ->orderBy('installment_number')
                ->lockForUpdate()
                ->get();

            if ($schedules->isEmpty()) {
                throw ValidationException::withMessages([
                    'email' => 'No open installments left to split.',
                ]);
            }

            $user = User::firstOrCreate(
                ['email' => $email],
                ['name' => $name, 'password' => Str::random(40)], // 'hashed' cast hashes it
            );

            if ($ownerUserId && $user->id === $ownerUserId) {
                throw ValidationException::withMessages([
                    'email' => 'The owner is already the primary payer.',
                ]);
            }

            $scheduleIds = $schedules->pluck('id');

            $alreadyLinked = PaymentCoPayer::whereIn('payment_schedule_id', $scheduleIds)
                ->where('user_id', $user->id)
                ->exists();

            if ($alreadyLinked) {
                throw ValidationException::withMessages([
                    'email' => 'This person is already a co-payer.',
                ]);
            }

            // Capacity check: others' shares (excluding the owner) + new % must be <= 100.
            $first = $schedules->first();
            $takenAmount = (float) PaymentCoPayer::where('payment_schedule_id', $first->id)
                ->when($ownerUserId, fn ($q) => $q->where('user_id', '!=', $ownerUserId))
                ->sum('expected_share');

            $takenPct = (float) $first->amount_due > 0
                ? $takenAmount / (float) $first->amount_due * 100
                : 0;

            if ($percentage > 100 - $takenPct + 0.001) {
                throw ValidationException::withMessages([
                    'share_percentage' => 'Share exceeds what is left of the household quota.',
                ]);
            }

            foreach ($schedules as $schedule) {
                $due = (float) $schedule->amount_due;

                PaymentCoPayer::create([
                    'payment_schedule_id' => $schedule->id,
                    'user_id' => $user->id,
                    'expected_share' => round($due * $percentage / 100, 2),
                ]);

                if ($ownerUserId) {
                    $others = (float) PaymentCoPayer::where('payment_schedule_id', $schedule->id)
                        ->where('user_id', '!=', $ownerUserId)
                        ->sum('expected_share');

                    PaymentCoPayer::updateOrCreate(
                        ['payment_schedule_id' => $schedule->id, 'user_id' => $ownerUserId],
                        ['expected_share' => round($due - $others, 2)],
                    );
                }
            }

            return $user;
        });
    }
}
