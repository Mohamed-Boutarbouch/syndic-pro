import { CircleDollarSign, Coins, Users, Wallet } from 'lucide-react';

import { KpiCard } from '@/components/kpi-card';
import { formatCurrency } from '@/lib/format-currency';
import type { KpisData } from '@/types/dashboard';

type KpisProps = {
    kpis: KpisData | null;
};

export function DashboardKpis({ kpis }: KpisProps) {
    const cards = kpis
        ? [
              {
                  title: 'Annual Budget',
                  value: formatCurrency(kpis.targetBudget),
                  description: kpis.fiscalYearLabel,
                  icon: CircleDollarSign,
              },
              {
                  title: 'Collected',
                  value: formatCurrency(kpis.collectedYtd),
                  description: `${kpis.percentOfTarget}% of target`,
                  icon: Wallet,
              },
              {
                  title: 'Co-owners',
                  value: String(kpis.coOwnersCount),
                  description: `${kpis.paidCount} fully paid`,
                  icon: Users,
              },
              {
                  title: 'Units',
                  value: String(kpis.unitsCount),
                  description: 'Units in this property',
                  icon: Coins,
              },
          ]
        : [
              {
                  title: 'Units',
                  value: '—',
                  description: 'No active budget',
                  icon: Coins,
              },
              {
                  title: 'Co-owners',
                  value: '—',
                  description: 'No active budget',
                  icon: Users,
              },
              {
                  title: 'Annual Budget',
                  value: '—',
                  description: 'No active budget',
                  icon: CircleDollarSign,
              },
              {
                  title: 'Collected',
                  value: '—',
                  description: 'No active budget',
                  icon: Wallet,
              },
          ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
                <KpiCard key={card.title} {...card} />
            ))}
        </div>
    );
}
