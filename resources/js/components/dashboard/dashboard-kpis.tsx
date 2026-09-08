import { CircleDollarSign, Coins, Users, Wallet } from 'lucide-react';

import { KpiCard } from '@/components/kpi-card';
import { useTranslation } from '@/hooks/use-translation';
import { formatCurrency } from '@/lib/format-currency';
import type { DashboardKpis as DashboardKpisData } from '@/types/properties/dashboard';

type DashboardKpisProps = {
    kpis: DashboardKpisData | null;
};

export function DashboardKpis({ kpis }: DashboardKpisProps) {
    const { t } = useTranslation('properties.dashboard');

    const cards = kpis
        ? [
              {
                  id: 'annual-budget',
                  title: t('kpis.annual_budget.title'),
                  value: formatCurrency(kpis.targetBudget),
                  description: kpis.fiscalYearLabel,
                  icon: CircleDollarSign,
              },
              {
                  id: 'collected',
                  title: t('kpis.collected.title'),
                  value: formatCurrency(kpis.collectedYtd),
                  description: t('kpis.collected.description', {
                      percent: kpis.percentOfTarget,
                  }),
                  icon: Wallet,
              },
              {
                  id: 'co-owners',
                  title: t('kpis.co_owners.title'),
                  value: String(kpis.coOwnersCount),
                  description: t('kpis.co_owners.description', {
                      count: kpis.paidCount,
                  }),
                  icon: Users,
              },
              {
                  id: 'units',
                  title: t('kpis.units.title'),
                  value: String(kpis.unitsCount),
                  description: t('kpis.units.description'),
                  icon: Coins,
              },
          ]
        : [
              {
                  id: 'units',
                  title: t('kpis.units.title'),
                  value: '—',
                  description: t('kpis.empty_state'),
                  icon: Coins,
              },
              {
                  id: 'co-owners',
                  title: t('kpis.co_owners.title'),
                  value: '—',
                  description: t('kpis.empty_state'),
                  icon: Users,
              },
              {
                  id: 'annual-budget',
                  title: t('kpis.annual_budget.title'),
                  value: '—',
                  description: t('kpis.empty_state'),
                  icon: CircleDollarSign,
              },
              {
                  id: 'collected',
                  title: t('kpis.collected.title'),
                  value: '—',
                  description: t('kpis.empty_state'),
                  icon: Wallet,
              },
          ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
                <KpiCard key={card.id} {...card} />
            ))}
        </div>
    );
}
