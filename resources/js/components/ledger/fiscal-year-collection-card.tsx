import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from '@/hooks/use-translation';

type FiscalYearCollectionCardProps = {
  collected: number;
  target: number;
  percentage: number;
};

export function FiscalYearCollectionCard({
  collected,
  target,
  percentage,
}: FiscalYearCollectionCardProps) {
  const { t, money, isRtl } = useTranslation('properties.ledger.fiscal_year_card');

  return (
    <Card dir={isRtl ? 'rtl' : 'ltr'}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">{t('title')}</CardTitle>

        <span className="rounded-full border px-2 py-0.5 text-xs font-medium">{percentage}%</span>
      </CardHeader>

      <CardContent>
        <Progress value={percentage} className="h-2" />

        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>
            {t('amount_collected', {
              amount: money(collected),
            })}
          </span>
          <span>
            {t('target_label', {
              amount: money(target),
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
