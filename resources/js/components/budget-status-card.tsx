import { usePage } from '@inertiajs/react';
import { cn } from 'cn';
import { LockKeyhole, LockKeyholeOpen } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';

type SharedProps = {
  currentBudget: {
    id: number;
    isLocked: boolean;
    startDate: string;
    endDate: string;
  } | null;
};

export function BudgetStatusCard() {
  const { currentBudget } = usePage<SharedProps>().props;
  const { t, isRtl } = useTranslation('layout.budget_status');

  if (!currentBudget) {
    return null;
  }

  const { isLocked } = currentBudget;
  const Icon = isLocked ? LockKeyhole : LockKeyholeOpen;

  return (
    <Card dir={isRtl ? 'rtl' : 'ltr'} className="ms-auto gap-0 py-1.5">
      <CardContent className="flex items-center gap-2 px-3">
        <Icon
          className={cn('size-4', isLocked ? 'text-green-400' : 'text-amber-400')}
          aria-hidden
        />

        <div className="leading-tight">
          <p className="text-xs font-medium">{isLocked ? t('locked') : t('unlocked')}</p>

          <p className="hidden text-[11px] text-muted-foreground sm:block">
            {t('period', {
              start: currentBudget.startDate.slice(0, 7),
              end: currentBudget.endDate.slice(0, 7),
            })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
