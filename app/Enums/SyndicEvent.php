<?php

namespace App\Enums;

enum SyndicEvent: string
{
    case Assigned = 'assigned';
    case Resigned = 'resigned';
    case Transferred = 'transferred';
}
