import type { DefaultValues } from 'react-hook-form';
import * as v from 'valibot';

export const annualTargetBudgetSchema = v.pipe(
  v.object({
    start_date: v.pipe(v.string(), v.isoDate('Start date must be a valid date')),

    end_date: v.pipe(v.string(), v.isoDate('End date must be a valid date')),

    total_budget: v.pipe(
      v.number('Total budget is required'),
      v.minValue(0.01, 'Total budget must be greater than 0'),
      v.check(
        (value) => Number.isInteger(value * 100),
        'Total budget may have a maximum of 2 decimal places',
      ),
    ),

    is_budget_locked: v.boolean(),
  }),

  v.forward(
    v.partialCheck(
      [['start_date'], ['end_date']],
      ({ start_date, end_date }) => end_date > start_date,
      'End date must be after start date',
    ),
    ['end_date'],
  ),
);

export type AnnualTargetBudgetFormValues = v.InferOutput<typeof annualTargetBudgetSchema>;

export const annualTargetBudgetDefaultValues: DefaultValues<AnnualTargetBudgetFormValues> = {
  start_date: '',
  end_date: '',
  total_budget: undefined,
  is_budget_locked: false,
};
