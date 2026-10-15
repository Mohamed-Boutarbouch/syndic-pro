import { useWatch } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { useTranslation } from '@/hooks/use-translation';
import { calculateUnitBudgets } from '@/lib/onboarding/unit-budget';
import type { UnitsFormValues } from '@/schemas/onboarding/units';

export function UnitBudgetShare({
  control,
  index,
  totalBudget,
}: {
  control: Control<UnitsFormValues>;
  index: number;
  totalBudget: number;
}) {
  const { t, money } = useTranslation();
  const weightCoefficients = useWatch({
    control,
    name: 'units',
  })?.map((unit) => unit?.weight_coefficient);

  const budgets = calculateUnitBudgets(weightCoefficients ?? [], totalBudget);
  const share = budgets[index] ?? 0;

  return (
    <span className="text-sm text-muted-foreground">
      {t('onboarding.units.per_year', { amount: money(share) })}
    </span>
  );
}
