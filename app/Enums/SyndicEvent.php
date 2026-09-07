<?php

namespace App\Enums;

enum SyndicEvent: string
{
    case Assigned = 'assigned';
    case Transferred = 'transferred';
    case Resigned = 'resigned';
}
