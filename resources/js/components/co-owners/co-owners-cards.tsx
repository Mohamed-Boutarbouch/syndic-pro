import { Archive, Building, Store } from 'lucide-react';

import { KpiCard } from './kpi-card';

const cards = [
    {
        title: 'Apartements',
        value: '8',
        description: 'Residential units',
        icon: Building,
    },
    {
        title: 'Commercial',
        value: '1',
        description: 'Commercial units',
        icon: Store,
    },
    {
        title: 'Storage',
        value: '1',
        description: 'Storage units',
        icon: Archive,
    },
];

export function CoOwnersCards() {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
                <KpiCard key={card.title} {...card} />
            ))}
        </div>
    );
}
