<?php

namespace App\Services\Onboarding;

use App\Enums\BillingFrequency;
use App\Enums\ObligationStatus;
use App\Enums\ScheduleStatus;
use App\Models\AnnualTargetBudget;
use App\Models\CycleObligation;
use App\Models\Unit;
use App\Models\UnitCoOwner;
use Carbon\CarbonInterface;

class CoOwnerCycleObligation
{
    /**
     * Create the CycleObligation + PaymentSchedule rows for a single unit's
     * co-owner, deriving every amount server-side from the unit's stored
     * annual budget. Never trust amounts sent by the client — only the
     * billing_frequency *choice* is taken from input.
     */
    public function createForUnitCoOwner(
        Unit $unit,
        UnitCoOwner $unitCoOwner,
        AnnualTargetBudget $annualTargetBudget,
    ): CycleObligation {
        $frequency = $unitCoOwner->billing_frequency;

        // Single co-owner per unit => 100% ownership => full unit budget.
        $shareAmount = round((float) $unit->calculated_annual_budget, 2);
        $baseMonthlyRate = round($shareAmount / 12, 2);

        $obligation = CycleObligation::create([
            'annual_target_budget_id' => $annualTargetBudget->id,
            'ownership_id' => $unitCoOwner->id,
            'share_amount' => $shareAmount,
            'snapshot_contribution_weight' => $unit->weight_coefficient,
            'base_monthly_rate' => $baseMonthlyRate,
            'payment_interval_months' => $frequency->intervalMonths(),
            'credit_balance' => 0,
            'status' => ObligationStatus::Active,
            'departed_at' => null,
            'notes' => null,
        ]);

        $this->generatePaymentSchedule($obligation, $frequency, $annualTargetBudget->start_date, $shareAmount);

        return $obligation;
    }

    /**
     * Split the share amount evenly across installments and persist the
     * schedule. Any rounding remainder is folded into the final installment
     * so the sum always equals share_amount exactly.
     */
    private function generatePaymentSchedule(
        CycleObligation $obligation,
        BillingFrequency $frequency,
        CarbonInterface $cycleStartDate,
        float $shareAmount,
    ): void {
        $count = $frequency->installmentCount();
        $intervalMonths = $frequency->intervalMonths();

        $baseInstallment = round($shareAmount / $count, 2);
        $allocated = 0.0;

        for ($i = 0; $i < $count; $i++) {
            $isFinal = $i === $count - 1;

            $amountDue = $isFinal
                ? round($shareAmount - $allocated, 2)
                : $baseInstallment;

            $allocated += $amountDue;

            $obligation->paymentSchedules()->create([
                'installment_number' => $i + 1,
                'due_date' => $cycleStartDate->copy()->addMonths($i * $intervalMonths),
                'amount_due' => $amountDue,
                'is_final_installment' => $isFinal,
                'status' => ScheduleStatus::Pending,
            ]);
        }
    }
}
