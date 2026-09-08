import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import type { TransactionSummary } from '@/types/properties/ledger';

type TransactionSummaryCardProps = {
  summary: TransactionSummary;
};

export function TransactionSummaryCard({ summary }: TransactionSummaryCardProps) {
  const { t } = useTranslation('properties.ledger.transaction_summary');

  return (
    <Card>
      <CardContent className="space-y-2 pt-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{t('total_transactions')}</span>

          <span className="text-lg font-semibold">{summary.total}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{t('partial_label')}</span>

          <span className="text-sm font-semibold text-orange-500">{summary.partial}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{t('owners_paid_off')}</span>

          <span className="text-sm font-semibold text-emerald-500">
            {summary.ownersPaidOff}/{summary.ownersTotal}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
