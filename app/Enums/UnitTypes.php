<?php

namespace App\Enums;

enum UnitTypes: string
{
    case Residential = 'residential';
    case Commercial = 'commercial';
    case Storage = 'storage';
    case Other = 'other';
}
