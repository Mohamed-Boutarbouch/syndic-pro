<?php

namespace App\Enums;

enum AdjustmentType: string
{
    case Initial = 'initial';
    case OwnerJoined = 'owner_joined';
    case OwnerDeparted = 'owner_departed';
    case WeightChange = 'weight_change';
    case Manual = 'manual';
}
