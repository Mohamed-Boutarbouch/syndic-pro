import { valibotResolver } from '@hookform/resolvers/valibot';
import { router } from '@inertiajs/react';
import { BadgeCheck, Calculator, CalendarDays, LockKeyhole } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import * as v from 'valibot';

import update from '@/actions/App/Http/Controllers/Budget/UpdateBudgetController';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from '@/hooks/use-translation';
import type { Budget, BudgetDistribution } from '@/types/properties/budget';

const MONTHS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'] as const;

const MONTH_REGEX = /^(0[1-9]|1[0-2])$/;

type ValidationMessages = {
  monthRequired: string;
  totalInvalid: string;
  totalPositive: string;
};

function createFiscalYearSchema(messages: ValidationMessages) {
  return v.object({
    startMonth: v.pipe(
      v.string(messages.monthRequired),
      v.regex(MONTH_REGEX, messages.monthRequired),
    ),
    endMonth: v.pipe(
      v.string(messages.monthRequired),
      v.regex(MONTH_REGEX, messages.monthRequired),
    ),
    totalBudget: v.pipe(
      v.string(messages.totalInvalid),
      v.regex(/^\d+(\.\d{1,2})?$/, messages.totalInvalid),
      v.check((value) => Number(value) > 0, messages.totalPositive),
    ),
    isBudgetLocked: v.boolean(),
  });
}

type FiscalYearValues = v.InferInput<ReturnType<typeof createFiscalYearSchema>>;

// Server error keys (snake_case) -> form field names
const SERVER_ERROR_FIELDS = {
  start_date: 'startMonth',
  end_date: 'endMonth',
  total_budget: 'totalBudget',
  is_budget_locked: 'isBudgetLocked',
} as const satisfies Record<string, keyof FiscalYearValues>;

type FiscalYearProps = {
  budget: Budget | null;
  distribution: Pick<BudgetDistribution, 'totalWeight' | 'sharePerPoint'>;
};

function monthOf(dateString: string): string {
  return dateString.slice(5, 7);
}

// month is 1-based
function lastDayOf(year: number, month: number): string {
  const day = new Date(Date.UTC(year, month, 0)).getUTCDate();

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function toFormValues(budget: Budget | null): FiscalYearValues {
  return {
    startMonth: budget ? monthOf(budget.startDate) : '',
    endMonth: budget ? monthOf(budget.endDate) : '',
    totalBudget: budget ? String(budget.totalBudget) : '0',
    isBudgetLocked: budget?.isBudgetLocked ?? false,
  };
}

export function FiscalYear({ budget, distribution }: FiscalYearProps) {
  const { t, money, isRtl } = useTranslation('properties.budget.fiscal_year');

  const months = MONTHS.map((value) => ({
    value,
    label: t(`period.months.${value}`),
  }));

  const [isActive, setIsActive] = useState(false);
  const [processing, setProcessing] = useState(false);

  const defaults = toFormValues(budget);

  const { control, handleSubmit, reset, setValue, setError } = useForm<FiscalYearValues>({
    resolver: valibotResolver(
      createFiscalYearSchema({
        monthRequired: t('validation.month_required'),
        totalInvalid: t('validation.total_invalid'),
        totalPositive: t('validation.total_positive'),
      }),
    ),
    // Re-syncs the form whenever Inertia returns a fresh budget (deep-compared).
    values: defaults,
  });

  const isLocked = useWatch({ control, name: 'isBudgetLocked' });

  const handleCancel = () => {
    reset(defaults);
    setIsActive(false);
  };

  // Re-locking discards unsaved edits to the frozen fields.
  const restoreFrozenFields = () => {
    setValue('startMonth', defaults.startMonth, { shouldValidate: true });
    setValue('endMonth', defaults.endMonth, { shouldValidate: true });
    setValue('totalBudget', defaults.totalBudget, { shouldValidate: true });
  };

  const onSubmit = (values: FiscalYearValues) => {
    if (!budget) {
      return;
    }

    const startYear = Number(budget.startDate.slice(0, 4));
    const startMonth = Number(values.startMonth);
    const endMonth = Number(values.endMonth);
    const endYear = endMonth >= startMonth ? startYear : startYear + 1;

    router.patch(
      update.url({ budget: budget.id }),
      {
        start_date: `${startYear}-${values.startMonth}-01`,
        end_date: lastDayOf(endYear, endMonth),
        total_budget: values.totalBudget,
        is_budget_locked: values.isBudgetLocked,
      },
      {
        preserveScroll: true,
        onStart: () => setProcessing(true),
        onError: (errors) => {
          for (const [key, message] of Object.entries(errors)) {
            const field = SERVER_ERROR_FIELDS[key as keyof typeof SERVER_ERROR_FIELDS];

            if (field) {
              setError(field, { type: 'server', message });
            }
          }
        },
        onSuccess: () => setIsActive(false),
        onFinish: () => setProcessing(false),
      },
    );
  };

  const totalBudget = budget?.totalBudget ?? 0;
  const { totalWeight, sharePerPoint } = distribution;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Card dir={isRtl ? 'rtl' : 'ltr'}>
        <CardHeader>
          <CardTitle className="mb-2 flex gap-2">
            <CalendarDays />
            {t('title')}
          </CardTitle>

          <CardDescription>{t('description')}</CardDescription>

          <CardAction>
            {isActive ? (
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  {t('cancel_button')}
                </Button>

                <Button type="submit" disabled={processing}>
                  {t('save_button')}
                </Button>
              </div>
            ) : (
              <Button type="button" variant="outline" onClick={() => setIsActive(true)}>
                {t('edit_button')}
              </Button>
            )}
          </CardAction>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h2 className="cn-font-heading text-base leading-snug font-medium">
              {t('period.title')}
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {(['startMonth', 'endMonth'] as const).map((name) => (
                <Controller
                  key={name}
                  name={name}
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`fiscal-${name}`}>
                        {t(
                          name === 'startMonth'
                            ? 'period.start_month_label'
                            : 'period.end_month_label',
                        )}
                      </FieldLabel>

                      <Select
                        items={months}
                        disabled={!isActive || isLocked}
                        value={field.value}
                        onValueChange={(value) => field.onChange(value ?? '')}
                      >
                        <SelectTrigger
                          id={`fiscal-${name}`}
                          className="w-full"
                          aria-invalid={fieldState.invalid}
                          onBlur={field.onBlur}
                        >
                          <SelectValue placeholder={t('period.month_placeholder')} />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectGroup>
                            {months.map((month) => (
                              <SelectItem key={month.value} value={month.value}>
                                {month.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="cn-font-heading mb-4 text-base leading-snug font-medium">
              <span className="mb-2 flex gap-2">
                <Calculator />
                {t('annual_target.title')}
              </span>
            </h2>

            {isActive ? (
              <div className="flex flex-col gap-4">
                <Controller
                  name="totalBudget"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex items-center gap-2">
                        <Input
                          {...field}
                          type="number"
                          inputMode="decimal"
                          step="0.01"
                          aria-label={t('annual_target.title')}
                          aria-invalid={fieldState.invalid}
                          placeholder={t('annual_target.amount_placeholder')}
                          className="w-40"
                          disabled={isLocked}
                        />

                        <span className="text-sm text-muted-foreground">
                          {t('annual_target.currency_label')}
                        </span>
                      </div>

                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Item variant="muted">
                  <ItemContent>
                    <ItemTitle>{t('annual_target.auto_calculation.title')}</ItemTitle>

                    <ItemDescription>
                      {t('annual_target.auto_calculation.description', {
                        weight: totalWeight.toFixed(1),
                        share: money(sharePerPoint),
                      })}
                    </ItemDescription>
                  </ItemContent>
                </Item>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <h2 className="cn-font-heading text-2xl leading-snug font-bold">
                  {money(totalBudget)}
                </h2>

                <Badge variant="secondary">
                  {t('annual_target.per_point_badge', {
                    amount: money(sharePerPoint),
                  })}
                </Badge>
              </div>
            )}
          </div>

          <Separator />

          <Controller
            name="isBudgetLocked"
            control={control}
            render={({ field }) => (
              <FieldLabel htmlFor="activate-budget">
                <Field orientation="horizontal" className="gap-4">
                  <div className="flex shrink-0 items-center justify-center self-center rounded-md border p-2">
                    <LockKeyhole
                      className={
                        isLocked ? 'size-5 text-green-400' : 'size-5 text-muted-foreground'
                      }
                    />
                  </div>

                  <FieldContent className="flex-1">
                    <FieldTitle>{t('lock.title')}</FieldTitle>

                    <FieldDescription>{t('lock.description')}</FieldDescription>
                  </FieldContent>

                  <Switch
                    id="activate-budget"
                    className="shrink-0 self-center"
                    checked={field.value}
                    disabled={!isActive}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);

                      if (checked) {
                        restoreFrozenFields();
                      }
                    }}
                  />
                </Field>
              </FieldLabel>
            )}
          />

          <Alert>
            <BadgeCheck />

            <AlertTitle>{t('immutable_alert.title')}</AlertTitle>

            <AlertDescription>{t('immutable_alert.description')}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </form>
  );
}
