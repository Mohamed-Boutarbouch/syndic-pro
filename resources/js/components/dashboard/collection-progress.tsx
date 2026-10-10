import { Link } from '@inertiajs/react';

import ledger from '@/actions/App/Http/Controllers/Ledger/ShowLedgerController';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from '@/hooks/use-translation';
import type { CollectionProgressData } from '@/types/properties/dashboard';

type CollectionProgressProps = {
  data: CollectionProgressData | null;
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function CollectionProgress({ data }: CollectionProgressProps) {
  const { t, tChoice, money, isRtl } = useTranslation('properties.dashboard');

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('collection_progress.title')}</CardTitle>

          <CardDescription>{t('collection_progress.empty_state')}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { collected, target, totalOwners, owners } = data;

  const overallPercentage = target > 0 ? Math.min(100, Math.round((collected / target) * 100)) : 0;

  const remainingOwners = Math.max(totalOwners - owners.length, 0);

  return (
    <Card dir={isRtl ? 'rtl' : 'ltr'}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1.5">
          <CardTitle>{t('collection_progress.title')}</CardTitle>

          <CardDescription>{t('collection_progress.description')}</CardDescription>
        </div>

        <span className="text-lg font-semibold tabular-nums">{overallPercentage}%</span>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Progress value={overallPercentage} className="**:data-[slot=progress-track]:h-2" />

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {t('collection_progress.amount_collected', {
                amount: money(collected),
              })}
            </span>

            <span className="text-muted-foreground">
              {t('collection_progress.target_label', {
                amount: money(target),
              })}
            </span>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {owners.map((owner) => (
            <div key={owner.name} className="flex items-center gap-3">
              <Avatar className="size-8">
                <AvatarFallback>{getInitials(owner.name)}</AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate font-medium">{owner.name}</span>

                  <span className="shrink-0 text-muted-foreground tabular-nums">{owner.pct}%</span>
                </div>

                <Progress value={owner.pct} className="h-2" />
              </div>
            </div>
          ))}
        </div>

        {remainingOwners > 0 && (
          <Link
            href={ledger().url}
            className={buttonVariants({
              variant: 'secondary',
              size: 'sm',
            })}
          >
            {tChoice('collection_progress.more_owners_link', remainingOwners)}
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
