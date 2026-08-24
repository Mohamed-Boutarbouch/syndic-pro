<?php

namespace App\Models;

use App\Enums\PaymentMethod;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $cycle_obligation_id
 * @property int|null $payment_schedule_id
 * @property int $paid_by_user_id
 * @property int $recorded_by_user_id
 * @property string $amount
 * @property Carbon $paid_at
 * @property PaymentMethod $method
 * @property string|null $reference
 * @property string|null $notes
 * @property Carbon|null $voided_at
 * @property int|null $voided_by_user_id
 * @property string|null $void_reason
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'cycle_obligation_id',
    'payment_schedule_id',
    'paid_by_user_id',
    'recorded_by_user_id',
    'amount',
    'paid_at',
    'method',
    'reference',
    'notes',
    'voided_at',
    'voided_by_user_id',
    'void_reason',
])]
class Payment extends Model
{
    /** @use HasFactory<PaymentFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<CycleObligation, $this>
     */
    public function cycleObligation(): BelongsTo
    {
        return $this->belongsTo(CycleObligation::class);
    }

    /**
     * @return BelongsTo<PaymentSchedule, $this>
     */
    public function paymentSchedule(): BelongsTo
    {
        return $this->belongsTo(PaymentSchedule::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function paidBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'paid_by_user_id'
        );
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function recordedBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'recorded_by_user_id'
        );
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function voidedBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'voided_by_user_id'
        );
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'paid_at' => 'datetime',
            'method' => PaymentMethod::class,
            'voided_at' => 'datetime',
        ];
    }
}
