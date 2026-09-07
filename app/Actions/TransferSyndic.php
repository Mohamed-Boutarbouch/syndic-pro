<?php

namespace App\Actions;

use App\Enums\SyndicEvent;
use App\Models\Property;
use App\Models\SyndicDesignation;
use App\Models\UnitCoOwner;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class TransferSyndic
{
    /**
     * Transfer the active syndic role on a property to another user.
     *
     * Resigns the current active SyndicDesignation (if any), creates a new
     * "transferred" designation for the incoming syndic, and keeps the
     * `unit_co_owners.is_designated_syndic` flag in sync so the fast-lookup
     * badge in the matrix stays correct without re-joining designations.
     */
    public function handle(Property $property, User $toUser): SyndicDesignation
    {
        return DB::transaction(function () use ($property, $toUser) {
            $current = $property->syndicDesignations()
                ->where('status', SyndicEvent::Assigned)
                ->whereNull('resigned_at')
                ->latest('assigned_at')
                ->first();

            if ($current) {
                $current->status = SyndicEvent::Resigned;
                $current->resigned_at = now();
                $current->save();
            }

            $new = $property->syndicDesignations()->create([
                'user_id' => $toUser->id,
                'event' => 'transferred',
                'status' => SyndicEvent::Assigned,
                'transferred_from_user_id' => $current?->user_id,
                'assigned_at' => now(),
            ]);

            // Sync the fast-lookup flag across all unit_co_owners for this
            // property: clear the old syndic's flag, set it on the new one.
            $unitIds = $property->units()->pluck('id');

            UnitCoOwner::whereIn('unit_id', $unitIds)
                ->where('is_designated_syndic', true)
                ->update(['is_designated_syndic' => false]);

            UnitCoOwner::whereIn('unit_id', $unitIds)
                ->whereHas('coOwner', fn ($query) => $query->where('user_id', $toUser->id))
                ->update(['is_designated_syndic' => true]);

            return $new;
        });
    }
}
