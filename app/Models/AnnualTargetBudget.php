<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $property_id
 * @property Carbon $start_date
 * @property Carbon $end_date
 * @property string $total_budget
 * @property bool $is_budget_locked
 * @property int|null $created_by_user_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'property_id',
    'start_date',
    'end_date',
    'total_budget',
    'is_budget_locked',
    'created_by_user_id',
])]
class AnnualTargetBudget extends Model
{
    /** @use HasFactory<AnnualTargetBudgetFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<Property, $this>
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
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
     * @return HasMany<CycleObligation, $this>
     */
    public function cycleObligations(): HasMany
    {
        return $this->hasMany(CycleObligation::class);
    }

    /**
     * @return HasMany<CycleAdjustment, $this>
     */
    public function cycleAdjustments(): HasMany
    {
        return $this->hasMany(CycleAdjustment::class);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'total_budget' => 'decimal:2',
            'is_budget_locked' => 'boolean',
        ];
    }
}
