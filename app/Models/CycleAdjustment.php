<?php

namespace App\Models;

use App\Enums\AdjustmentType;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $annual_target_budget_id
 * @property AdjustmentType $type
 * @property string $delta_amount
 * @property string $reason
 * @property int|null $related_ownership_id
 * @property int $created_by_user_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'annual_target_budget_id',
    'type',
    'delta_amount',
    'reason',
    'related_ownership_id',
    'created_by_user_id',
])]
class CycleAdjustment extends Model
{
    /** @use HasFactory<CycleAdjustmentFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<AnnualTargetBudget, $this>
     */
    public function annualTargetBudget(): BelongsTo
    {
        return $this->belongsTo(AnnualTargetBudget::class);
    }

    /**
     * @return BelongsTo<UnitOwnership, $this>
     */
    public function relatedOwnership(): BelongsTo
    {
        return $this->belongsTo(
            UnitOwnership::class,
            'related_ownership_id'
        );
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'created_by_user_id'
        );
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => AdjustmentType::class,
            'delta_amount' => 'decimal:2',
        ];
    }
}
