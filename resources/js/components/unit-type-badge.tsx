import type { LucideIcon } from 'lucide-react';
import { House, CircleOff, Store, Warehouse } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

export type UnitType = 'residential' | 'commercial' | 'storage' | 'other';

type UnitTypeConfig = {
    label: string;
    icon: LucideIcon;
    className: string;
};

const unitTypeConfig: Record<UnitType, UnitTypeConfig> = {
    residential: {
        label: 'Residential',
        icon: House,
        className:
            'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    },
    commercial: {
        label: 'Commercial',
        icon: Store,
        className:
            'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
    },
    storage: {
        label: 'Storage',
        icon: Warehouse,
        className:
            'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
    },
    other: {
        label: 'Other',
        icon: CircleOff,
        className:
            'bg-neutral-50 text-neutral-700 dark:bg-neutral-950 dark:text-neutral-300',
    },
};

type UnitTypeBadgeProps = {
    type: string;
};

export function UnitTypeBadge({ type }: UnitTypeBadgeProps) {
    const config = unitTypeConfig[type as UnitType];

    if (!config) {
        return null;
    }

    const Icon = config.icon;

    return (
        <Badge className={config.className}>
            <Icon data-icon="inline-start" />
            {config.label}
        </Badge>
    );
}
