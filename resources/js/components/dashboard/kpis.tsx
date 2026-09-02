import { Building2, CircleDollarSign, Users } from 'lucide-react';

import { KpiCard } from './kpi-card';

const kpis = [
    {
        title: 'Properties',
        value: '12',
        description: 'Managed properties',
        icon: Building2,
    },
    {
        title: 'Units',
        value: '148',
        description: 'Total units',
        icon: Building2,
    },
    {
        title: 'Co-owners',
        value: '86',
        description: 'Registered co-owners',
        icon: Users,
    },
    {
        title: 'Annual Budget',
        value: '€42,500',
        description: 'Total planned budget',
        icon: CircleDollarSign,
    },
];

export function Kpis() {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kpis.map((kpi) => (
                <KpiCard key={kpi.title} {...kpi} />
            ))}
        </div>
    );
}
