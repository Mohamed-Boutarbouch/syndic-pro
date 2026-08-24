<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $image
 * @property string|null $phone
 * @property string $locale
 * @property bool $is_active
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'name',
    'email',
    'password',
    'image',
    'phone',
    'locale',
    'is_active',
])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * @return HasMany<CoOwner, $this>
     */
    public function coOwners(): HasMany
    {
        return $this->hasMany(CoOwner::class);
    }

    /**
     * @return HasMany<UnitOwnership, $this>
     */
    public function unitOwnerships(): HasMany
    {
        return $this->hasMany(UnitOwnership::class);
    }

    /**
     * @return HasMany<Payment, $this>
     */
    public function paidPayments(): HasMany
    {
        return $this->hasMany(Payment::class, 'paid_by_user_id');
    }

    /**
     * @return HasMany<Payment, $this>
     */
    public function recordedPayments(): HasMany
    {
        return $this->hasMany(Payment::class, 'recorded_by_user_id');
    }

    /**
     * @return HasMany<Payment, $this>
     */
    public function voidedPayments(): HasMany
    {
        return $this->hasMany(Payment::class, 'voided_by_user_id');
    }

    /**
     * @return HasMany<PaymentCoPayer, $this>
     */
    public function paymentCoPayers(): HasMany
    {
        return $this->hasMany(PaymentCoPayer::class);
    }

    /**
     * @return HasMany<SyndicDesignation, $this>
     */
    public function syndicDesignations(): HasMany
    {
        return $this->hasMany(SyndicDesignation::class);
    }

    /**
     * @return HasMany<SyndicDesignation, $this>
     */
    public function transferredSyndicDesignations(): HasMany
    {
        return $this->hasMany(
            SyndicDesignation::class,
            'transferred_from_user_id'
        );
    }

    /**
     * @return HasMany<AnnualTargetBudget, $this>
     */
    public function createdAnnualTargetBudgets(): HasMany
    {
        return $this->hasMany(
            AnnualTargetBudget::class,
            'created_by_user_id'
        );
    }

    /**
     * @return HasMany<CycleAdjustment, $this>
     */
    public function createdCycleAdjustments(): HasMany
    {
        return $this->hasMany(
            CycleAdjustment::class,
            'created_by_user_id'
        );
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }
}
