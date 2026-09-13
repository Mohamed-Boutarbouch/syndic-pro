<?php

namespace App\Http\Controllers\CoOwners;

use App\Enums\SyndicEvent;
use App\Models\CoOwner;
use App\Models\Property;
use Inertia\Inertia;
use Inertia\Response;

class ShowCoOwnersController
{
    public function __invoke(Property $property): Response
    {
        $units = $property->units()
            ->with([
                'unitCoOwners' => function ($query) {
                    $query->with('coOwner');
                },
            ])
            ->orderBy('label')
            ->get();

        $currentBudget = $property->currentAnnualTargetBudget()->first();

        // Total weight across active unit_co_owner links, used to display
        // the "rate per point" the same way the matrix table derives it.
        $totalWeight = $units->sum(fn ($unit) => (float) $unit->weight_coefficient);

        $ratePerPoint = $currentBudget && $totalWeight > 0
            ? round(((float) $currentBudget->total_budget) / $totalWeight, 2)
            : 0;

        $unitShares = $units->flatMap(function ($unit) {
            if ($unit->unitCoOwners->isEmpty()) {
                // Surface the unit even with no co-owner attached yet, so it's
                // discoverable for assignment. unitCoOwnerId/coOwnerId/billing
                // fields are null — the frontend's actions column swaps the
                // coefficient-edit pencil for the "assign co-owner" action when
                // it sees unitCoOwnerId === null.
                return [[
                    'id' => 'unit-'.$unit->id,
                    'unitId' => $unit->id,
                    'unitCoOwnerId' => null,
                    'unit' => $unit->label,
                    'floor' => $unit->floor,
                    'type' => $unit->type->value,
                    'coOwner' => null,
                    'coOwnerId' => null,
                    'coefficient' => (float) $unit->weight_coefficient,
                    'quotaYear' => (float) $unit->calculated_annual_budget,
                    'quotaMonth' => round(((float) $unit->calculated_annual_budget) / 12, 2),
                    'billingFrequency' => null,
                    'status' => 'unassigned',
                ]];
            }

            // A unit can have multiple co-owners linked (joint ownership);
            // surface one matrix row per unit_co_owner link so coefficient
            // edits stay scoped to the unit, and status/billing reflect the
            // specific co-owner link.
            //
            // NOTE: AssignCoOwnerToUnit currently enforces ONE co-owner per unit
            // (per product decision), so in practice this map now only ever
            // produces a single row per unit. Left as flatMap/map rather than
            // simplified to a single lookup, since joint ownership may return —
            // this keeps the two code paths (read side here, write side in the
            // action) independently reversible.
            return $unit->unitCoOwners->map(function ($unitCoOwner) use ($unit) {
                $coOwner = $unitCoOwner->coOwner;

                return [
                    'id' => (string) $unitCoOwner->id,
                    'unitId' => $unit->id,
                    'unitCoOwnerId' => $unitCoOwner->id,
                    'unit' => $unit->label,
                    'floor' => $unit->floor,
                    'type' => $unit->type->value,
                    'coOwner' => $coOwner?->name ?? '—',
                    'coOwnerId' => $coOwner?->id,
                    'coefficient' => (float) $unit->weight_coefficient,
                    'quotaYear' => (float) $unit->calculated_annual_budget,
                    'quotaMonth' => round(((float) $unit->calculated_annual_budget) / 12, 2),
                    'billingFrequency' => $unitCoOwner->billing_frequency->value,
                    'status' => $unitCoOwner->is_designated_syndic ? 'syndic' : 'co-owner',
                ];
            });
        })->values();

        $kpis = [
            'residential' => $units->filter(fn ($unit) => $unit->type->value === 'residential')->count(),
            'commercial' => $units->filter(fn ($unit) => $unit->type->value === 'commercial')->count(),
            'storage' => $units->filter(fn ($unit) => $unit->type->value === 'storage')->count(),
            'other' => $units->filter(fn ($unit) => $unit->type->value === 'other')->count(),
        ];

        $activeSyndicDesignation = $property->syndicDesignations()
            ->with('user')
            ->where('status', SyndicEvent::Assigned)
            ->whereNull('resigned_at')
            ->latest('assigned_at')
            ->first();

        $activeSyndic = null;

        if ($activeSyndicDesignation && $activeSyndicDesignation->user) {
            $user = $activeSyndicDesignation->user;

            $syndicUnitCoOwner = $units
                ->flatMap(fn ($unit) => $unit->unitCoOwners)
                ->first(fn ($uco) => $uco->is_designated_syndic);

            $activeSyndic = [
                'userId' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'unit' => $syndicUnitCoOwner
                    ? optional($units->firstWhere('id', $syndicUnitCoOwner->unit_id))->label
                    : null,
                'assignedAt' => $activeSyndicDesignation->assigned_at?->toIso8601String(),
            ];
        }

        // Eligible transfer candidates: co-owners on this property who are
        // not the current syndic. Deduped by co_owner id.
        $candidates = $units
            ->flatMap(fn ($unit) => $unit->unitCoOwners->map(fn ($uco) => [
                'unitLabel' => $unit->label,
                'unitCoOwner' => $uco,
            ]))
            ->filter(fn ($row) => ! $row['unitCoOwner']->is_designated_syndic && $row['unitCoOwner']->coOwner?->user_id)
            ->unique(fn ($row) => $row['unitCoOwner']->coOwner->user_id)
            ->map(fn ($row) => [
                'id' => (string) $row['unitCoOwner']->coOwner->user_id,
                'userId' => $row['unitCoOwner']->coOwner->user_id,
                'name' => $row['unitCoOwner']->coOwner->name,
                'unit' => $row['unitLabel'],
            ])
            ->values();

        // Co-owners not linked to any unit on this property — feeds the
        // "assign existing" tab in AssignCoOwnerCell. Property-scoped via the
        // units already loaded, since CoOwner has no direct property_id.
        $linkedCoOwnerIds = $units
            ->flatMap(fn ($unit) => $unit->unitCoOwners->pluck('co_owner_id'))
            ->all();

        $unassignedCoOwners = CoOwner::query()
            ->where('is_active', true)
            ->whereNotIn('id', $linkedCoOwnerIds)
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn ($coOwner) => [
                'id' => $coOwner->id,
                'name' => $coOwner->name,
            ]);

        return Inertia::render('properties/co-owners', [
            'property' => [
                'id' => $property->id,
                'name' => $property->name,
            ],
            'kpis' => $kpis,
            'unitShares' => $unitShares,
            'activeSyndic' => $activeSyndic,
            'transferCandidates' => $candidates,
            'budget' => $currentBudget ? [
                'id' => $currentBudget->id,
                'totalBudget' => (float) $currentBudget->total_budget,
                'ratePerPoint' => $ratePerPoint,
                'totalWeight' => $totalWeight,
                'isLocked' => $currentBudget->is_budget_locked,
            ] : null,
            'unassignedCoOwners' => $unassignedCoOwners,
        ]);
    }
}
