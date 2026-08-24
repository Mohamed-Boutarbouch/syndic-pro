<?php

namespace App\Models;

use App\Enums\ScheduleStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $cycle_obligation_id
 * @property int $installment_number
 * @property Carbon $due_date
 * @property string $amount_due
 * @property bool $is_final_installment
 * @property ScheduleStatus $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'cycle_obligation_id',
    'installment_number',
    'due_date',
    'amount_due',
    'is_final_installment',
    'status',
])]
class PaymentSchedule extends Model
{
    /** @use HasFactory<PaymentScheduleFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<CycleObligation, $this>
     */
    public function cycleObligation(): BelongsTo
    {
        return $this->belongsTo(CycleObligation::class);
    }

    /**
     * @return HasMany<Payment, $this>
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * @return HasMany<PaymentCoPayer, $this>
     */
    public function coPayers(): HasMany
    {
        return $this->hasMany(PaymentCoPayer::class);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'installment_number' => 'integer',
            'due_date' => 'date',
            'amount_due' => 'decimal:2',
            'is_final_installment' => 'boolean',
            'status' => ScheduleStatus::class,
        ];
    }
}
