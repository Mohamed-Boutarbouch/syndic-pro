<?php

namespace App\Enums;

enum BillingFrequency: string
{
    case Monthly = 'monthly';
    case Bimonthly = 'bimonthly';
    case Quarterly = 'quarterly';
    case SemiAnnual = 'semi_annual';
}
