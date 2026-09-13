<?php

namespace App\Actions;

use App\Enums\BillingFrequency;
use App\Models\CoOwner;
use App\Models\Unit;
use App\Models\UnitCoOwner;
use Illuminate\Support\Facades\DB;

class AssignCoOwnerToUnit
{
    /**
     * Attach a co-owner (existing or newly created) to a unit.
     *
     * Enforces one co-owner per unit (current product decision — see the
     * note on StoreUnitCoOwnerRequest for the read-side discrepancy this
     * creates against CoOwnerController's joint-ownership support).
     *
     * Deliberately does NOT create a CycleObligation here, even if the
     * property's current AnnualTargetBudget is locked. That recalculation
     * path (share_amount, snapshot_contribution_weight, base_monthly_rate,
     * plus a CycleAdjustment of type OwnerJoined) already exists in the
     * mid-year-unit flow (AddMidYearUnitController) and should stay the
     * single source of truth for it, rather than being re-implemented here
     * and risking drift between the two. The caller is expected to surface
     * a warning to the user that billing participation is inactive until
     * the next budget is created/locked — see StoreUnitCoOwnerController.
     *
     * @param  array{mode: string, co_owner_id?: int, name?: string, email?: ?string, phone?: ?string}  $data
     */
    public function handle(Unit $unit, array $data): UnitCoOwner
    {
        return DB::transaction(function () use ($unit, $data) {
            abort_if(
                $unit->unitCoOwners()->exists(),
                409,
                'This unit already has a co-owner assigned.',
            );

            $coOwner = $data['mode'] === 'existing'
                ? CoOwner::findOrFail($data['co_owner_id'])
                : CoOwner::create([
                    'name' => $data['name'],
                    'email' => $data['email'] ?? null,
                    'phone' => $data['phone'] ?? null,
                    'is_active' => true,
                ]);

            return $unit->unitCoOwners()->create([
                'co_owner_id' => $coOwner->id,
                'ownership_percentage' => null,
                'billing_frequency' => BillingFrequency::Monthly,
                'is_designated_syndic' => false,
            ]);
        });
    }
}
