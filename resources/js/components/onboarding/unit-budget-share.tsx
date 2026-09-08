import { useWatch } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { formatCurrency } from '@/lib/format-currency';
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
  const weightCoefficients = useWatch({
    control,
    name: 'units',
  })?.map((unit) => unit?.weight_coefficient);

  const budgets = calculateUnitBudgets(weightCoefficients ?? [], totalBudget);
  const share = budgets[index] ?? 0;

  return <span className="text-sm text-muted-foreground">{formatCurrency(share)}/year</span>;
}
