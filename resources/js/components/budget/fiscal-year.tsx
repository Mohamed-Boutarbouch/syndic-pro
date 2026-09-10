import { router } from '@inertiajs/react';
import { BadgeCheck, Calculator, CalendarDays, LockKeyhole } from 'lucide-react';
import { useState } from 'react';

import update from '@/actions/App/Http/Controllers/UpdateAnnualTargetBudgetController';
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

type FiscalYearProps = {
  budget: Budget | null;
  distribution: Pick<BudgetDistribution, 'totalWeight' | 'sharePerPoint'>;
};

function monthOf(dateString: string): string {
  return dateString.slice(5, 7);
}

export function FiscalYear({ budget, distribution }: FiscalYearProps) {
  const { t, money, isRtl } = useTranslation('properties.budget.fiscal_year');

  const months = [
    { label: t('period.months.01'), value: '01' },
    { label: t('period.months.02'), value: '02' },
    { label: t('period.months.03'), value: '03' },
    { label: t('period.months.04'), value: '04' },
    { label: t('period.months.05'), value: '05' },
    { label: t('period.months.06'), value: '06' },
    { label: t('period.months.07'), value: '07' },
    { label: t('period.months.08'), value: '08' },
    { label: t('period.months.09'), value: '09' },
    { label: t('period.months.10'), value: '10' },
    { label: t('period.months.11'), value: '11' },
    { label: t('period.months.12'), value: '12' },
  ];

  const [isActive, setIsActive] = useState(false);
  const [startMonth, setStartMonth] = useState(budget ? monthOf(budget.startDate) : '');
  const [endMonth, setEndMonth] = useState(budget ? monthOf(budget.endDate) : '');
  const [annualTarget, setAnnualTarget] = useState(budget ? String(budget.totalBudget) : '0');
  const [isLocked, setIsLocked] = useState(budget?.isBudgetLocked ?? false);

  const handleSave = () => {
    if (!budget) {
      return;
    }

    const startYear = budget.startDate.slice(0, 4);
    const endYear = budget.endDate.slice(0, 4);

    router.patch(
      update.url({
        property: budget.id,
        budget: budget.id,
      }),
      {
        start_date: `${startYear}-${startMonth}-01`,
        end_date: `${endYear}-${endMonth}-01`,
        total_budget: annualTarget,
        is_budget_locked: isLocked,
      },
      {
        preserveScroll: true,
        onSuccess: () => setIsActive(false),
      },
    );
  };

  const totalBudget = budget?.totalBudget ?? 0;
  const { totalWeight, sharePerPoint } = distribution;

  return (
    <Card dir={isRtl ? 'rtl' : 'ltr'}>
      <CardHeader>
        <CardTitle className="mb-2 flex gap-2">
          <CalendarDays /> {t('title')}
        </CardTitle>

        <CardDescription>{t('description')}</CardDescription>

        <CardAction>
          {isActive ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsActive(false)}>
                {t('cancel_button')}
              </Button>

              <Button onClick={handleSave}>{t('save_button')}</Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setIsActive(true)}>
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
            <div className="space-y-1.5">
              <p className="text-sm text-muted-foreground">{t('period.start_month_label')}</p>

              <Select
                disabled={!isActive}
                value={startMonth}
                onValueChange={(value) => setStartMonth(value ?? '')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a month" />
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
            </div>

            <div className="space-y-1.5">
              <p className="text-sm text-muted-foreground">{t('period.end_month_label')}</p>

              <Select
                disabled={!isActive}
                value={endMonth}
                onValueChange={(value) => setEndMonth(value ?? '')}
              >
                <SelectTrigger className="w-full">
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
            </div>
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
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder={t('annual_target.amount_placeholder')}
                  className="w-40"
                  value={annualTarget}
                  disabled={isLocked}
                  onChange={(event) => setAnnualTarget(event.target.value)}
                />

                <span className="text-sm text-muted-foreground">
                  {t('annual_target.currency_label')}
                </span>
              </div>

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

        <FieldLabel htmlFor="activate-budget">
          <Field orientation="horizontal" className="gap-4">
            <div className="flex shrink-0 items-center justify-center self-center rounded-md border p-2">
              <LockKeyhole
                className={isLocked ? 'size-5 text-green-400' : 'size-5 text-muted-foreground'}
              />
            </div>

            <FieldContent className="flex-1">
              <FieldTitle>{t('lock.title')}</FieldTitle>

              <FieldDescription>{t('lock.description')}</FieldDescription>
            </FieldContent>

            <Switch
              id="activate-budget"
              className="shrink-0 self-center"
              checked={isLocked}
              disabled={!isActive}
              onCheckedChange={setIsLocked}
            />
          </Field>
        </FieldLabel>

        <Alert>
          <BadgeCheck />

          <AlertTitle>{t('immutable_alert.title')}</AlertTitle>

          <AlertDescription>{t('immutable_alert.description')}</AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
