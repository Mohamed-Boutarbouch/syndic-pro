<?php

namespace App\Models;

use App\Enums\SyndicEvent;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $property_id
 * @property int $user_id
 * @property string $event
 * @property SyndicEvent $status
 * @property int|null $transferred_from_user_id
 * @property Carbon $assigned_at
 * @property Carbon|null $resigned_at
 * @property string|null $notes
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'property_id',
    'user_id',
    'event',
    'status',
    'transferred_from_user_id',
    'assigned_at',
    'resigned_at',
    'notes',
])]
class SyndicDesignation extends Model
{
    /** @use HasFactory<SyndicDesignationFactory> */
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
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function transferredFrom(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'transferred_from_user_id'
        );
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => SyndicEvent::class,
            'assigned_at' => 'datetime',
            'resigned_at' => 'datetime',
        ];
    }
}
