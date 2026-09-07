<?php

namespace Database\Seeders;

use App\Enums\AdjustmentType;
use App\Enums\BillingFrequency;
use App\Enums\ObligationStatus;
use App\Enums\PaymentMethod;
use App\Enums\ScheduleStatus;
use App\Enums\SyndicEvent;
use App\Enums\UnitTypes;
use App\Models\AnnualTargetBudget;
use App\Models\CoOwner;
use App\Models\CycleAdjustment;
use App\Models\CycleObligation;
use App\Models\Payment;
use App\Models\PaymentCoPayer;
use App\Models\PaymentSchedule;
use App\Models\Property;
use App\Models\SyndicDesignation;
use App\Models\Unit;
use App\Models\UnitCoOwner;
use App\Models\UnitOwnership;
use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;

class SyndicProDemoSeeder extends Seeder
{
    public function run(): void
    {
        /*
         * Demo fiscal year:
         * November 2025 -> October 2026.
         *
         * $demoToday is deliberately fixed so the seeded dataset remains
         * deterministic when the seeder is run months later.
         */
        $fiscalStart = Carbon::parse('2025-11-01');
        $fiscalEnd = Carbon::parse('2026-10-31');
        $demoToday = Carbon::parse('2026-09-07');

        // --------------------------------------------------------------
        // 1. Property
        // --------------------------------------------------------------

        $property = Property::create([
            'name' => 'Résidence Al Manar',
            'address' => '12 Rue des Orangers',
            'city' => 'Casablanca',
            'postal_code' => '20000',
            'country_code' => 'MA',
            'is_active' => true,
        ]);

        // --------------------------------------------------------------
        // 2. Users + CoOwners
        // --------------------------------------------------------------

        // Index 0 is the syndic.
        $people = [
            [
                'name' => 'Yassine El Amrani',
                'email' => 'yassine.elamrani@example.com',
            ],
            [
                'name' => 'Salma Bennis',
                'email' => 'salma.bennis@example.com',
            ],
            [
                'name' => 'Karim Fassi',
                'email' => 'karim.fassi@example.com',
            ],
            [
                'name' => 'Nadia Chraibi',
                'email' => 'nadia.chraibi@example.com',
            ],
            [
                'name' => 'Omar Idrissi',
                'email' => 'omar.idrissi@example.com',
            ],
            [
                'name' => 'Leila Tazi',
                'email' => 'leila.tazi@example.com',
            ],
            [
                'name' => 'Hicham Berrada',
                'email' => 'hicham.berrada@example.com',
            ],
            [
                'name' => 'Fatima Zahra Alaoui',
                'email' => 'fz.alaoui@example.com',
            ],
            [
                'name' => 'Anas Squalli',
                'email' => 'anas.squalli@example.com',
            ],
        ];

        /*
         * Family co-payer for Hicham Berrada's unit.
         * This user is not a co-owner.
         */
        $familyPayerUser = User::create([
            'name' => 'Sana Fassi',
            'email' => 'sana.fassi@example.com',
            'password' => Hash::make('password'),
            'locale' => 'fr',
            'is_active' => true,
        ]);

        $users = [];
        $coOwners = [];

        foreach ($people as $person) {
            $user = User::create([
                'name' => $person['name'],
                'email' => $person['email'],
                'password' => Hash::make('password'),
                'locale' => 'fr',
                'is_active' => true,
            ]);

            $users[] = $user;

            $coOwners[] = CoOwner::create([
                'name' => $person['name'],
                'email' => $person['email'],
                'phone' => '+2126'.random_int(10000000, 99999999),
                'user_id' => $user->id,
                'is_active' => true,
            ]);
        }

        [
            $syndicUser,
            $u2,
            $u3,
            $u4,
            $u5,
            $u6,
            $u7,
            $u8,
            $u9,
        ] = $users;

        [
            $syndicCoOwner,
            $co2,
            $co3,
            $co4,
            $co5,
            $co6,
            $co7,
            $co8,
            $co9,
        ] = $coOwners;

        // --------------------------------------------------------------
        // 3. Units
        // --------------------------------------------------------------

        $unitDefs = [
            [
                'label' => 'Apt 101',
                'floor' => '1',
                'type' => UnitTypes::Residential,
                'weight' => 1.00,
            ],
            [
                'label' => 'Apt 102',
                'floor' => '1',
                'type' => UnitTypes::Residential,
                'weight' => 1.00,
            ],
            [
                'label' => 'Apt 201',
                'floor' => '2',
                'type' => UnitTypes::Residential,
                'weight' => 1.00,
            ],
            [
                'label' => 'Apt 202',
                'floor' => '2',
                'type' => UnitTypes::Residential,
                'weight' => 1.00,
            ],
            [
                'label' => 'Apt 301',
                'floor' => '3',
                'type' => UnitTypes::Residential,
                'weight' => 1.00,
            ],
            [
                'label' => 'Apt 302',
                'floor' => '3',
                'type' => UnitTypes::Residential,
                'weight' => 1.00,
            ],
            [
                'label' => 'Apt 401',
                'floor' => '4',
                'type' => UnitTypes::Residential,
                'weight' => 1.00,
            ],
            [
                'label' => 'Shop RDC-A',
                'floor' => 'RDC',
                'type' => UnitTypes::Commercial,
                'weight' => 1.20,
            ],
            [
                'label' => 'Cave B-03',
                'floor' => 'Sous-sol',
                'type' => UnitTypes::Storage,
                'weight' => 0.50,
            ],
        ];

        $units = [];

        foreach ($unitDefs as $def) {
            $units[] = Unit::create([
                'property_id' => $property->id,
                'label' => $def['label'],
                'floor' => $def['floor'],
                'type' => $def['type'],
                'weight_coefficient' => $def['weight'],
                'calculated_annual_budget' => 0,
                'is_active' => true,
            ]);
        }

        // --------------------------------------------------------------
        // 4. Annual Target Budget
        // --------------------------------------------------------------

        $totalBudget = 43200.00;

        $budget = AnnualTargetBudget::create([
            'property_id' => $property->id,
            'start_date' => $fiscalStart,
            'end_date' => $fiscalEnd,
            'total_budget' => $totalBudget,
            'is_budget_locked' => true,
            'created_by_user_id' => $syndicUser->id,
        ]);

        // --------------------------------------------------------------
        // 5. Syndic Designation
        // --------------------------------------------------------------

        SyndicDesignation::create([
            'property_id' => $property->id,
            'user_id' => $syndicUser->id,
            'event' => SyndicEvent::Assigned->value,
            'status' => SyndicEvent::Assigned->value,
            'transferred_from_user_id' => null,
            'assigned_at' => $fiscalStart->copy()->subMonths(6),
            'resigned_at' => null,
            'notes' => 'Elected at the annual general assembly.',
        ]);

        // --------------------------------------------------------------
        // 6. Unit Ownership
        // --------------------------------------------------------------

        $assignment = [
            0 => [$syndicCoOwner, $syndicUser],
            1 => [$co2, $u2],
            2 => [$co3, $u3],
            3 => [$co4, $u4],
            4 => [$co5, $u5], // Departed mid-fiscal-year.
            5 => [$co6, $u6],
            6 => [$co7, $u7],
            7 => [$co8, $u8],
            8 => [$co9, $u9],
        ];

        $departedUnitIndex = 4;
        $departedAt = Carbon::parse('2026-03-01');

        foreach ($assignment as $idx => [$coOwner, $user]) {
            UnitOwnership::create([
                'unit_id' => $units[$idx]->id,
                'user_id' => $user->id,
                'started_at' => $fiscalStart->copy()->subYears(2),
                'ended_at' => $idx === $departedUnitIndex
                    ? $departedAt
                    : null,
                'notes' => $idx === $departedUnitIndex
                    ? 'Unit sold; co-owner departed mid-fiscal-year.'
                    : null,
            ]);
        }

        // --------------------------------------------------------------
        // 7. Unit Co-Owners
        // --------------------------------------------------------------

        $frequencies = [
            0 => BillingFrequency::Monthly,
            1 => BillingFrequency::Monthly,
            2 => BillingFrequency::Quarterly,
            3 => BillingFrequency::Monthly,
            4 => BillingFrequency::Monthly,
            5 => BillingFrequency::Bimonthly,
            6 => BillingFrequency::Monthly,
            7 => BillingFrequency::Quarterly,
            8 => BillingFrequency::SemiAnnual,
        ];

        $unitCoOwners = [];

        foreach ($assignment as $idx => [$coOwner, $user]) {
            $unitCoOwners[$idx] = UnitCoOwner::create([
                'unit_id' => $units[$idx]->id,
                'co_owner_id' => $coOwner->id,
                'ownership_percentage' => 100.00,
                'billing_frequency' => $frequencies[$idx]->value,
                'is_designated_syndic' => $idx === 0,
            ]);
        }

        // --------------------------------------------------------------
        // 8. Calculate Annual Budget Shares
        // --------------------------------------------------------------

        $totalWeight = array_sum(
            array_column($unitDefs, 'weight')
        );

        $baseSharePerWeightPoint = round(
            $totalBudget / $totalWeight,
            2
        );

        foreach ($units as $idx => $unit) {
            $unitShare = round(
                $baseSharePerWeightPoint *
                (float) $unit->weight_coefficient,
                2
            );

            $unit->update([
                'calculated_annual_budget' => $unitShare,
            ]);
        }

        // --------------------------------------------------------------
        // 9. Cycle Obligations
        // --------------------------------------------------------------

        $obligations = [];

        foreach ($units as $idx => $unit) {
            $annualShare = (float) $unit->calculated_annual_budget;

            $intervalMonths = $frequencies[$idx]->intervalMonths();

            $baseMonthlyRate = round(
                $annualShare / 12,
                2
            );

            $obligations[$idx] = CycleObligation::create([
                'annual_target_budget_id' => $budget->id,
                'ownership_id' => $unitCoOwners[$idx]->id,
                'share_amount' => $annualShare,
                'snapshot_contribution_weight' => $unit->weight_coefficient,
                'base_monthly_rate' => $baseMonthlyRate,
                'payment_interval_months' => $intervalMonths,
                'credit_balance' => 0,
                'status' => $idx === $departedUnitIndex
                    ? ObligationStatus::Departed->value
                    : ObligationStatus::Active->value,
                'departed_at' => $idx === $departedUnitIndex
                    ? $departedAt
                    : null,
                'notes' => $idx === $departedUnitIndex
                    ? 'Baseline quota locked at departure; budget variance handled via CycleAdjustment, not obligation recalculation.'
                    : null,
            ]);
        }

        // --------------------------------------------------------------
        // 10. Cycle Adjustment
        // --------------------------------------------------------------

        $departedAnnualShare = (float) $units[
            $departedUnitIndex
        ]->calculated_annual_budget;

        // March through October = 7 remaining fiscal months.
        $monthsRemainingAfterDeparture = $fiscalEnd->diffInMonths(
            $departedAt
        );

        CycleAdjustment::create([
            'annual_target_budget_id' => $budget->id,
            'type' => AdjustmentType::OwnerDeparted->value,
            'delta_amount' => -1 * round(
                ($departedAnnualShare / 12) *
                $monthsRemainingAfterDeparture,
                2
            ),
            'reason' => 'Co-owner departed mid-fiscal-year (unit sold); remaining months of their projected contribution removed from the top-line budget target. Other co-owners\' baseline monthly quotas are unaffected.',
            'related_ownership_id' => UnitOwnership::where(
                'unit_id',
                $units[$departedUnitIndex]->id
            )->value('id'),
            'created_by_user_id' => $syndicUser->id,
        ]);

        // --------------------------------------------------------------
        // 11. Payment Schedules
        // --------------------------------------------------------------
        //
        // Generate:
        //   - all schedules up to the demo date
        //   - up to 2 future schedules
        //
        // Future schedules remain Pending and are never automatically paid.
        // Departed owners stop receiving schedules after departure.
        // --------------------------------------------------------------

        $futureScheduleLimit = 2;
        $schedulesByObligation = [];

        foreach ($obligations as $idx => $obligation) {
            $intervalMonths = $obligation->payment_interval_months;

            $installmentAmount = round(
                (float) $obligation->base_monthly_rate *
                $intervalMonths,
                2
            );

            $cycleEndForThisUnit = $idx === $departedUnitIndex
                ? $departedAt
                : $fiscalEnd;

            $installments = [];
            $dueDate = $fiscalStart->copy();
            $installmentNumber = 1;
            $futureSchedulesCreated = 0;

            while ($dueDate->lte($cycleEndForThisUnit)) {
                $isFuture = $dueDate->gt($demoToday);

                /*
                 * We keep at most two future schedules.
                 */
                if ($isFuture && $futureSchedulesCreated >= $futureScheduleLimit) {
                    break;
                }

                $nextDueDate = $dueDate
                    ->copy()
                    ->addMonthsNoOverflow($intervalMonths);

                $isFinal = $nextDueDate->gt($fiscalEnd);

                $installments[] = [
                    'installment_number' => $installmentNumber,
                    'due_date' => $dueDate->copy(),
                    'amount_due' => $installmentAmount,
                    'is_final_installment' => $isFinal,
                ];

                if ($isFuture) {
                    $futureSchedulesCreated++;
                }

                $dueDate = $nextDueDate;
                $installmentNumber++;

                if ($isFinal) {
                    break;
                }
            }

            $schedulesByObligation[$idx] = [];

            foreach ($installments as $installment) {
                $schedulesByObligation[$idx][] = PaymentSchedule::create([
                    'cycle_obligation_id' => $obligation->id,
                    'installment_number' => $installment['installment_number'],
                    'due_date' => $installment['due_date'],
                    'amount_due' => $installment['amount_due'],
                    'is_final_installment' => $installment['is_final_installment'],
                    'status' => ScheduleStatus::Pending->value,
                ]);
            }
        }

        // --------------------------------------------------------------
        // 12. Payments
        // --------------------------------------------------------------

        /*
         * idx 0: syndic — fully paid on time
         */
        $this->payAllOnTime(
            $schedulesByObligation[0],
            $obligations[0],
            $syndicUser,
            $syndicUser,
            $demoToday,
        );

        /*
         * idx 1: fully paid on time
         */
        $this->payAllOnTime(
            $schedulesByObligation[1],
            $obligations[1],
            $u2,
            $syndicUser,
            $demoToday,
        );

        /*
         * idx 2: quarterly payer.
         *
         * Latest past schedule is deliberately left unpaid and marked
         * overdue. Future schedules remain pending.
         */
        $schedules2 = $schedulesByObligation[2];

        $latestPastIndex2 = $this->latestPastScheduleIndex(
            $schedules2,
            $demoToday
        );

        foreach ($schedules2 as $i => $sched) {
            if ($i === $latestPastIndex2) {
                $sched->update([
                    'status' => ScheduleStatus::Overdue->value,
                ]);

                continue;
            }

            if ($sched->due_date->lte($demoToday)) {
                $this->recordFullPayment(
                    $sched,
                    $obligations[2],
                    $u3,
                    $syndicUser,
                    $sched->due_date,
                    PaymentMethod::Cash,
                );
            }
        }

        /*
         * idx 3: partial payment on the latest payable schedule.
         */
        $schedules3 = $schedulesByObligation[3];

        $latestPastIndex3 = $this->latestPastScheduleIndex(
            $schedules3,
            $demoToday
        );

        foreach ($schedules3 as $i => $sched) {
            if ($i === $latestPastIndex3) {
                $partialAmount = round(
                    (float) $sched->amount_due * 0.40,
                    2
                );

                Payment::create([
                    'cycle_obligation_id' => $obligations[3]->id,
                    'payment_schedule_id' => $sched->id,
                    'paid_by_user_id' => $u4->id,
                    'recorded_by_user_id' => $syndicUser->id,
                    'amount' => $partialAmount,
                    'paid_at' => $sched->due_date->copy()->subDays(2),
                    'method' => PaymentMethod::Cash->value,
                    'reference' => null,
                    'notes' => 'Partial payment received; balance still outstanding.',
                ]);

                $sched->update([
                    'status' => ScheduleStatus::Partial->value,
                ]);

                continue;
            }

            if ($sched->due_date->lte($demoToday)) {
                $this->recordFullPayment(
                    $sched,
                    $obligations[3],
                    $u4,
                    $syndicUser,
                    $sched->due_date,
                    PaymentMethod::Cash,
                );
            }
        }

        /*
         * idx 4: departed co-owner.
         *
         * Only schedules up to departure exist, so all generated schedules
         * can be paid normally.
         */
        $this->payAllOnTime(
            $schedulesByObligation[4],
            $obligations[4],
            $u5,
            $syndicUser,
            $demoToday,
        );

        /*
         * idx 5: bi-monthly payer.
         *
         * Latest payable schedule is overpaid by 25%.
         * The excess becomes credit_balance.
         */
        $schedules5 = $schedulesByObligation[5];

        $latestPastIndex5 = $this->latestPastScheduleIndex(
            $schedules5,
            $demoToday
        );

        $overpayAmount = 0.0;

        foreach ($schedules5 as $i => $sched) {
            if ($i === $latestPastIndex5) {
                $overpayAmount = round(
                    (float) $sched->amount_due * 1.25,
                    2
                );

                Payment::create([
                    'cycle_obligation_id' => $obligations[5]->id,
                    'payment_schedule_id' => $sched->id,
                    'paid_by_user_id' => $u6->id,
                    'recorded_by_user_id' => $syndicUser->id,
                    'amount' => $overpayAmount,
                    'paid_at' => $sched->due_date->copy()->subDay(),
                    'method' => PaymentMethod::BankTransfer->value,
                    'reference' => 'VIR-'.random_int(100000, 999999),
                    'notes' => 'Co-owner rounded up voluntarily; excess held as credit toward next installment.',
                ]);

                $sched->update([
                    'status' => ScheduleStatus::Paid->value,
                ]);

                continue;
            }

            if ($sched->due_date->lte($demoToday)) {
                $this->recordFullPayment(
                    $sched,
                    $obligations[5],
                    $u6,
                    $syndicUser,
                    $sched->due_date,
                    PaymentMethod::Cash,
                );
            }
        }

        if ($latestPastIndex5 !== null) {
            $latestSchedule5 = $schedules5[$latestPastIndex5];

            $creditAmount = round(
                $overpayAmount -
                (float) $latestSchedule5->amount_due,
                2
            );

            $obligations[5]->update([
                'credit_balance' => $creditAmount,
            ]);
        }

        /*
         * idx 6: family co-payer split.
         *
         * Hicham + Sana contribute toward one payment schedule.
         */
        $schedules6 = $schedulesByObligation[6];

        $latestPastIndex6 = $this->latestPastScheduleIndex(
            $schedules6,
            $demoToday
        );

        foreach ($schedules6 as $i => $sched) {
            if ($i === $latestPastIndex6) {
                $halfShare = round(
                    (float) $sched->amount_due / 2,
                    2
                );

                $otherHalf = round(
                    (float) $sched->amount_due - $halfShare,
                    2
                );

                PaymentCoPayer::create([
                    'payment_schedule_id' => $sched->id,
                    'user_id' => $u7->id,
                    'expected_share' => $halfShare,
                ]);

                PaymentCoPayer::create([
                    'payment_schedule_id' => $sched->id,
                    'user_id' => $familyPayerUser->id,
                    'expected_share' => $otherHalf,
                ]);

                Payment::create([
                    'cycle_obligation_id' => $obligations[6]->id,
                    'payment_schedule_id' => $sched->id,
                    'paid_by_user_id' => $u7->id,
                    'recorded_by_user_id' => $syndicUser->id,
                    'amount' => $halfShare,
                    'paid_at' => $sched->due_date->copy()->subDays(5),
                    'method' => PaymentMethod::Cash->value,
                    'reference' => null,
                    'notes' => 'Family split — Hicham\'s portion.',
                ]);

                Payment::create([
                    'cycle_obligation_id' => $obligations[6]->id,
                    'payment_schedule_id' => $sched->id,
                    'paid_by_user_id' => $familyPayerUser->id,
                    'recorded_by_user_id' => $syndicUser->id,
                    'amount' => $otherHalf,
                    'paid_at' => $sched->due_date->copy()->subDay(),
                    'method' => PaymentMethod::BankTransfer->value,
                    'reference' => 'VIR-'.random_int(100000, 999999),
                    'notes' => 'Family split — Sana\'s (sister) portion.',
                ]);

                $sched->update([
                    'status' => ScheduleStatus::Paid->value,
                ]);

                continue;
            }

            if ($sched->due_date->lte($demoToday)) {
                $this->recordFullPayment(
                    $sched,
                    $obligations[6],
                    $u7,
                    $syndicUser,
                    $sched->due_date,
                    PaymentMethod::Cash,
                );
            }
        }

        /*
         * idx 7: commercial unit — quarterly, bank transfer.
         */
        $this->payAllOnTime(
            $schedulesByObligation[7],
            $obligations[7],
            $u8,
            $syndicUser,
            $demoToday,
            PaymentMethod::BankTransfer,
        );

        /*
         * idx 8: storage unit — semi-annual, fully paid.
         */
        $this->payAllOnTime(
            $schedulesByObligation[8],
            $obligations[8],
            $u9,
            $syndicUser,
            $demoToday,
            PaymentMethod::Cash,
        );
    }

    /**
     * Return the index of the latest schedule whose due date is on or before
     * the demo date.
     *
     * @param  array<int, PaymentSchedule>  $schedules
     */
    private function latestPastScheduleIndex(
        array $schedules,
        CarbonInterface $demoToday,
    ): ?int {
        $latestIndex = null;

        foreach ($schedules as $index => $schedule) {
            if ($schedule->due_date->lte($demoToday)) {
                $latestIndex = $index;
            }
        }

        return $latestIndex;
    }

    /**
     * Pay every schedule that is currently due.
     *
     * Future schedules are deliberately left Pending.
     *
     * @param  array<int, PaymentSchedule>  $schedules
     */
    private function payAllOnTime(
        array $schedules,
        CycleObligation $obligation,
        User $payer,
        User $recordedBy,
        CarbonInterface $demoToday,
        PaymentMethod $method = PaymentMethod::Cash,
    ): void {
        foreach ($schedules as $sched) {
            if ($sched->due_date->gt($demoToday)) {
                continue;
            }

            $this->recordFullPayment(
                $sched,
                $obligation,
                $payer,
                $recordedBy,
                $sched->due_date,
                $method,
            );
        }
    }

    private function recordFullPayment(
        PaymentSchedule $sched,
        CycleObligation $obligation,
        User $payer,
        User $recordedBy,
        CarbonInterface $onDate,
        PaymentMethod $method = PaymentMethod::Cash,
    ): void {
        Payment::create([
            'cycle_obligation_id' => $obligation->id,
            'payment_schedule_id' => $sched->id,
            'paid_by_user_id' => $payer->id,
            'recorded_by_user_id' => $recordedBy->id,
            'amount' => $sched->amount_due,
            'paid_at' => $onDate->copy()->subDay(),
            'method' => $method->value,
            'reference' => $method === PaymentMethod::BankTransfer
                ? 'VIR-'.random_int(100000, 999999)
                : null,
            'notes' => null,
        ]);

        $sched->update([
            'status' => ScheduleStatus::Paid->value,
        ]);
    }
}
