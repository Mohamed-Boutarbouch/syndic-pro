<?php

namespace App\Models;

use App\Enums\BillingFrequency;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $unit_id
 * @property int $co_owner_id
 * @property string|null $ownership_percentage
 * @property BillingFrequency $billing_frequency
 * @property bool $is_designated_syndic
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'unit_id',
    'co_owner_id',
    'ownership_percentage',
    'billing_frequency',
    'is_designated_syndic',
])]
class UnitCoOwner extends Model
{
    /** @use HasFactory<UnitCoOwnerFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<Unit, $this>
     */
    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    /**
     * @return BelongsTo<CoOwner, $this>
     */
    public function coOwner(): BelongsTo
    {
        return $this->belongsTo(CoOwner::class);
    }

    /**
     * @return HasMany<CycleObligation, $this>
     */
    public function cycleObligations(): HasMany
    {
        return $this->hasMany(
            CycleObligation::class,
            'ownership_id'
        );
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'ownership_percentage' => 'decimal:2',
            'billing_frequency' => BillingFrequency::class,
            'is_designated_syndic' => 'boolean',
        ];
    }
}
