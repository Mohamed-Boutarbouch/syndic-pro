import { ActiveSyndic } from '@/components/co-owners/active-syndic';
import { CoOwnersCards } from '@/components/co-owners/co-owners-cards';
import { DataTable } from '@/components/co-owners/data-table';
import { useTranslation } from '@/hooks/use-translation';
import type { CoOwnersProps } from '@/types/properties/co-owners';

export default function CoOwners({
  property,
  kpis,
  unitShares,
  activeSyndic,
  transferCandidates,
  budget,
  unitTypes,
  unassignedCoOwners,
}: CoOwnersProps) {
  const { t } = useTranslation('properties.co_owners');

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>

          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            {t('subtitle', { property: property.name })}
          </p>
        </header>

        <div className="grid grid-cols-1 items-start gap-6">
          <CoOwnersCards kpis={kpis} />

          <ActiveSyndic activeSyndic={activeSyndic} candidates={transferCandidates} />

          <DataTable
            data={unitShares}
            ratePerPoint={budget?.ratePerPoint ?? 0}
            totalWeight={budget?.totalWeight ?? 0}
            unitTypes={unitTypes}
            unassignedCoOwners={unassignedCoOwners}
          />
        </div>
      </div>
    </main>
  );
}
