<?php

namespace App\Enums;

enum BillingFrequency: string
{
    case Monthly = 'monthly';
    case Bimonthly = 'bimonthly';
    case Quarterly = 'quarterly';
    case SemiAnnual = 'semi_annual';

    /**
     * Number of months between installments.
     */
    public function intervalMonths(): int
    {
        return match ($this) {
            self::Monthly => 1,
            self::Bimonthly => 2,
            self::Quarterly => 3,
            self::SemiAnnual => 6,
        };
    }

    /**
     * Number of installments per 12-month cycle.
     */
    public function installmentCount(): int
    {
        return intdiv(12, $this->intervalMonths());
    }
}
