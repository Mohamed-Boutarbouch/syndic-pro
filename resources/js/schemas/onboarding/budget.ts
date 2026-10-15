import type { DefaultValues } from 'react-hook-form';
import * as v from 'valibot';

type T = (key: string, params?: Record<string, string | number>) => string;

export const createAnnualTargetBudgetSchema = (t: T) =>
  v.pipe(
    v.object({
      start_date: v.pipe(v.string(), v.isoDate(t('validation.budget.start_invalid'))),
      end_date: v.pipe(v.string(), v.isoDate(t('validation.budget.end_invalid'))),
      total_budget: v.pipe(
        v.number(t('validation.budget.total_required')),
        v.minValue(0.01, t('validation.budget.total_min')),
        v.check((value) => Number.isInteger(value * 100), t('validation.budget.total_decimals')),
      ),
      is_budget_locked: v.boolean(),
    }),
    v.forward(
      v.partialCheck(
        [['start_date'], ['end_date']],
        ({ start_date, end_date }) => end_date > start_date,
        t('validation.budget.end_after_start'),
      ),
      ['end_date'],
    ),
  );

export type AnnualTargetBudgetFormValues = v.InferOutput<
  ReturnType<typeof createAnnualTargetBudgetSchema>
>;

export const annualTargetBudgetDefaultValues: DefaultValues<AnnualTargetBudgetFormValues> = {
  start_date: '',
  end_date: '',
  total_budget: undefined,
  is_budget_locked: false,
};
