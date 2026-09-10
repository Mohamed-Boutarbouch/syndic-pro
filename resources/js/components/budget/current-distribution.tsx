import { CardTable } from '@/components/card-table';
import { TableCell, TableRow } from '@/components/ui/table';
import { useTranslation } from '@/hooks/use-translation';
import type { BudgetDistribution } from '@/types/properties/budget';

type CurrentDistributionProps = {
  distribution: BudgetDistribution;
};

export function CurrentDistribution({ distribution }: CurrentDistributionProps) {
  const { t, money, isRtl } = useTranslation('properties.budget.current_distribution');
  const { totalWeight, units } = distribution;

  return (
    <CardTable
      title={t('title')}
      description={t('description', {
        weight: totalWeight.toFixed(1),
      })}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {units.map((unit) => (
        <TableRow key={unit.unit}>
          <TableCell className="py-3 pl-0">
            <p className="text-sm font-medium">{unit.unit}</p>

            <p className="text-xs text-muted-foreground">{unit.name ?? t('unassigned_unit')}</p>
          </TableCell>

          <TableCell className="py-3 pr-0 text-right">
            <p className="text-sm font-semibold tabular-nums">{money(unit.amount)}</p>

            <p className="text-xs text-muted-foreground tabular-nums">
              {t('coefficient_label', {
                points: unit.points.toFixed(1),
              })}
            </p>
          </TableCell>
        </TableRow>
      ))}
    </CardTable>
  );
}
