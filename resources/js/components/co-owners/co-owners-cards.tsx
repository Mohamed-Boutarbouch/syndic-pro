import { Archive, Building, Store } from 'lucide-react';
import { KpiCard } from '@/components/kpi-card';
import type { CoOwnersKpis } from '@/types/properties/co-owners';

interface CoOwnersCardsProps {
    kpis: CoOwnersKpis;
}

export function CoOwnersCards({ kpis }: CoOwnersCardsProps) {
    const cards = [
        {
            title: 'Apartements',
            value: String(kpis.apartment),
            description: 'Residential units',
            icon: Building,
        },
        {
            title: 'Commercial',
            value: String(kpis.commercial),
            description: 'Commercial units',
            icon: Store,
        },
        {
            title: 'Storage',
            value: String(kpis.storage),
            description: 'Storage units',
            icon: Archive,
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
                <KpiCard key={card.title} {...card} />
            ))}
        </div>
    );
}
