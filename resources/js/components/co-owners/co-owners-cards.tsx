import { Building, CircleEllipsis, Store, Warehouse } from 'lucide-react';
import { KpiCard } from '@/components/kpi-card';
import { useTranslation } from '@/hooks/use-translation';
import type { CoOwnersKpis } from '@/types/properties/co-owners';

type CoOwnersCardsProps = {
    kpis: CoOwnersKpis;
};

export function CoOwnersCards({ kpis }: CoOwnersCardsProps) {
    const { t } = useTranslation('properties.co_owners.kpis');

    const cards = [
        {
            id: 'residential',
            title: t('residential.title'),
            value: kpis.residential,
            description: t('residential.description'),
            icon: Building,
        },
        {
            id: 'commercial',
            title: t('commercial.title'),
            value: kpis.commercial,
            description: t('commercial.description'),
            icon: Store,
        },
        {
            id: 'storage',
            title: t('storage.title'),
            value: kpis.storage,
            description: t('storage.description'),
            icon: Warehouse,
        },
        {
            id: 'other',
            title: t('other.title'),
            value: kpis.other,
            description: t('other.description'),
            icon: CircleEllipsis,
        },
    ].filter((card) => card.value > 0);

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
            {cards.map((card) => (
                <KpiCard key={card.id} {...card} value={String(card.value)} />
            ))}
        </div>
    );
}
