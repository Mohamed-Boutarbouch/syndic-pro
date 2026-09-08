import {
    CalendarClock,
    CalendarDays,
    CalendarRange,
    CalendarSync,
} from 'lucide-react';
import { KpiCard } from '@/components/kpi-card';
import { useTranslation } from '@/hooks/use-translation';
import type { BillingKpis } from '@/types/properties/billing';

type BillingCardsProps = {
    kpis: BillingKpis;
};

export function BillingCards({ kpis }: BillingCardsProps) {
    const { t } = useTranslation('properties.billing.cards');

    const billingCards = [
        {
            title: t('monthly.title'),
            value: kpis.monthly,
            description: t('monthly.description'),
            icon: CalendarClock,
        },
        {
            title: t('bimonthly.title'),
            value: kpis.bimonthly,
            description: t('bimonthly.description'),
            icon: CalendarSync,
        },
        {
            title: t('quarterly.title'),
            value: kpis.quarterly,
            description: t('quarterly.description'),
            icon: CalendarDays,
        },
        {
            title: t('semi_annual.title'),
            value: kpis.semi_annual,
            description: t('semi_annual.description'),
            icon: CalendarRange,
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {billingCards.map((card) => (
                <KpiCard key={card.title} {...card} />
            ))}
        </div>
    );
}
