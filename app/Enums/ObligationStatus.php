<?php

namespace App\Enums;

enum ObligationStatus: string
{
    case Active = 'active';
    case Departed = 'departed';
    case Waived = 'waived';
    case Completed = 'completed';
}
