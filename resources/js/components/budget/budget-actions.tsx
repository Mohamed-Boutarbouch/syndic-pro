import { valibotResolver } from '@hookform/resolvers/valibot';
import { router } from '@inertiajs/react';
import { TriangleAlert } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import * as v from 'valibot';

import addMidYearUnit from '@/actions/App/Http/Controllers/Budget/AddMidYearUnitController';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { useTranslation } from '@/hooks/use-translation';

type BudgetActionsProps = {
  sharePerPoint: number;
  currentTotalBudget: number;
};

const defaultValues = { label: '', weight_coefficient: '1.0' };

export function BudgetActions({ sharePerPoint, currentTotalBudget }: BudgetActionsProps) {
  const [open, setOpen] = useState(false);
  const { t, money, isRtl } = useTranslation('properties.budget.actions');

  const schema = useMemo(
    () =>
      v.object({
        label: v.pipe(
          v.string(),
          v.trim(),
          v.nonEmpty(t('add_unit_dialog.errors.label_required')),
          v.maxLength(30, t('add_unit_dialog.errors.label_max')),
        ),
        weight_coefficient: v.pipe(
          v.string(),
          v.nonEmpty(t('add_unit_dialog.errors.weight_required')),
          v.transform(Number),
          v.number(t('add_unit_dialog.errors.weight_invalid')),
          v.minValue(0.1, t('add_unit_dialog.errors.weight_min')),
          v.maxValue(999.99, t('add_unit_dialog.errors.weight_max')),
        ),
      }),
    [t],
  );

  type FormInput = v.InferInput<typeof schema>;
  type FormOutput = v.InferOutput<typeof schema>;

  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: valibotResolver(schema),
    defaultValues,
  });

  const watchedWeight = useWatch({ control: form.control, name: 'weight_coefficient' });
  const parsedWeight = Number.parseFloat(watchedWeight) || 0;
  const budgetImpact = parsedWeight * sharePerPoint;
  const newTotal = currentTotalBudget + budgetImpact;

  const handleOpenChange = (next: boolean) => {
    setOpen(next);

    if (!next) {
      form.reset(defaultValues);
    }
  };

  // Returning a promise keeps formState.isSubmitting accurate for the whole request.
  const onSubmit = (values: FormOutput) =>
    new Promise<void>((resolve) => {
      router.post(addMidYearUnit.url(), values, {
        preserveScroll: true,
        onSuccess: () => handleOpenChange(false),
        onError: (serverErrors) => {
          Object.entries(serverErrors).forEach(([field, message]) => {
            if (field === 'label' || field === 'weight_coefficient') {
              form.setError(field, { type: 'server', message });
            }
          });
        },
        onFinish: () => resolve(),
      });
    });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    void form.handleSubmit(onSubmit)(event);
  };

  return (
    <Card dir={isRtl ? 'rtl' : 'ltr'}>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger
            render={
              <Button variant="outline" className="mb-2 w-full">
                {t('add_unit_button')}
              </Button>
            }
          />
          <DialogContent className="sm:max-w-sm">
            {/* Inside the portaled content, so the submit button is a DOM descendant of the form */}
            <form onSubmit={handleSubmit} noValidate className="grid gap-4">
              <DialogHeader>
                <DialogTitle>{t('add_unit_dialog.title')}</DialogTitle>
                <DialogDescription>{t('add_unit_dialog.description')}</DialogDescription>
              </DialogHeader>

              <Alert>
                <TriangleAlert />
                <AlertTitle>{t('add_unit_dialog.immutability_alert.title')}</AlertTitle>
                <AlertDescription>
                  {t('add_unit_dialog.immutability_alert.description')}
                </AlertDescription>
              </Alert>

              <FieldGroup>
                <Controller
                  name="label"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="unit-name">
                        {t('add_unit_dialog.unit_name_label')}
                      </FieldLabel>
                      <Input
                        {...field}
                        id="unit-name"
                        placeholder={t('add_unit_dialog.unit_name_placeholder')}
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="weight_coefficient"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="weight-coefficient">
                        {t('add_unit_dialog.weight_coefficient_label')}
                      </FieldLabel>
                      <Input
                        {...field}
                        id="weight-coefficient"
                        type="number"
                        step="0.1"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FieldGroup>

              <Item variant="muted">
                <ItemContent>
                  <ItemTitle>{t('add_unit_dialog.budget_impact.title')}</ItemTitle>
                  <ItemDescription>
                    {t('add_unit_dialog.budget_impact.description', {
                      impact: money(budgetImpact),
                      total: money(newTotal),
                    })}
                  </ItemDescription>
                </ItemContent>
              </Item>

              <DialogFooter>
                <DialogClose
                  render={
                    <Button type="button" variant="outline">
                      {t('add_unit_dialog.cancel_button')}
                    </Button>
                  }
                />
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {t('add_unit_dialog.confirm_button')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <p className="text-sm text-muted-foreground">{t('recalculation_note')}</p>
      </CardContent>
    </Card>
  );
}
