import {
    CalendarClock,
    CalendarDays,
    CalendarRange,
    CalendarSync,
} from 'lucide-react';
import { KpiCard } from '@/components/kpi-card';

const billingCards = [
    {
        title: 'Monthly',
        value: '5',
        description: '12 payments/yr',
        icon: CalendarClock,
    },
    {
        title: 'Bimonthly',
        value: '1',
        description: '6 payments/yr',
        icon: CalendarSync,
    },
    {
        title: 'Quarterly',
        value: '2',
        description: '4 payments/yr',
        icon: CalendarDays,
    },
    {
        title: 'Semi-annual',
        value: '2',
        description: '2 payments/yr',
        icon: CalendarRange,
    },
];

export function BillingCards() {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {billingCards.map((card) => (
                <KpiCard key={card.title} {...card} />
            ))}
        </div>
    );
}
