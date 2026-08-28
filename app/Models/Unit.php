<?php

namespace App\Models;

use App\Enums\UnitTypes;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $property_id
 * @property string $label
 * @property string|null $floor
 * @property UnitTypes $type
 * @property string $weight_coefficient
 * @property string $calculated_annual_budget
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'property_id',
    'label',
    'floor',
    'type',
    'weight_coefficient',
    'calculated_annual_budget',
    'is_active',
])]
class Unit extends Model
{
    /** @use HasFactory<UnitFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<Property, $this>
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * @return HasMany<CoOwner, $this>
     */
    public function coOwners(): HasMany
    {
        return $this->hasMany(CoOwner::class);
    }

    /**
     * @return HasMany<UnitCoOwner, $this>
     */
    public function unitCoOwners(): HasMany
    {
        return $this->hasMany(UnitCoOwner::class);
    }

    /**
     * @return HasMany<UnitOwnership, $this>
     */
    public function ownerships(): HasMany
    {
        return $this->hasMany(UnitOwnership::class);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => UnitTypes::class,
            'weight_coefficient' => 'decimal:2',
            'calculated_annual_budget' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }
}
