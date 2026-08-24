<?php

namespace App\Models;

use App\Enums\ObligationStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $annual_target_budget_id
 * @property int $ownership_id
 * @property string $share_amount
 * @property string $snapshot_contribution_weight
 * @property string $base_monthly_rate
 * @property int $payment_interval_months
 * @property string $credit_balance
 * @property ObligationStatus $status
 * @property Carbon|null $departed_at
 * @property string|null $notes
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'annual_target_budget_id',
    'ownership_id',
    'share_amount',
    'snapshot_contribution_weight',
    'base_monthly_rate',
    'payment_interval_months',
    'credit_balance',
    'status',
    'departed_at',
    'notes',
])]
class CycleObligation extends Model
{
    /** @use HasFactory<CycleObligationFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<AnnualTargetBudget, $this>
     */
    public function annualTargetBudget(): BelongsTo
    {
        return $this->belongsTo(AnnualTargetBudget::class);
    }

    /**
     * The migration intentionally points this to unit_co_owners.
     *
     * @return BelongsTo<UnitCoOwner, $this>
     */
    public function ownership(): BelongsTo
    {
        return $this->belongsTo(
            UnitCoOwner::class,
            'ownership_id'
        );
    }

    /**
     * @return HasMany<PaymentSchedule, $this>
     */
    public function paymentSchedules(): HasMany
    {
        return $this->hasMany(PaymentSchedule::class);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'share_amount' => 'decimal:2',
            'snapshot_contribution_weight' => 'decimal:2',
            'base_monthly_rate' => 'decimal:2',
            'payment_interval_months' => 'integer',
            'credit_balance' => 'decimal:2',
            'status' => ObligationStatus::class,
            'departed_at' => 'date',
        ];
    }
}
