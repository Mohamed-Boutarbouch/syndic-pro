<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string|null $address
 * @property string $city
 * @property string|null $postal_code
 * @property string|null $country_code
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'name',
    'address',
    'city',
    'postal_code',
    'country_code',
    'is_active',
])]
class Property extends Model
{
    /** @use HasFactory<PropertyFactory> */
    use HasFactory;

    /**
     * @return HasMany<Unit, $this>
     */
    public function units(): HasMany
    {
        return $this->hasMany(Unit::class);
    }

    /**
     * @return HasMany<SyndicDesignation, $this>
     */
    public function syndicDesignations(): HasMany
    {
        return $this->hasMany(SyndicDesignation::class);
    }

    /**
     * @return HasMany<AnnualTargetBudget, $this>
     */
    public function annualTargetBudgets(): HasMany
    {
        return $this->hasMany(AnnualTargetBudget::class);
    }

    public function currentAnnualTargetBudget(): HasOne
    {
        return $this->hasOne(AnnualTargetBudget::class)
            ->latestOfMany();
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
