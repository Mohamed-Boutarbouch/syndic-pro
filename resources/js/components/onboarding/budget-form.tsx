import { valibotResolver } from '@hookform/resolvers/valibot';
import { router } from '@inertiajs/react';
import { addYears, format, subDays } from 'date-fns';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { useEffect } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { store } from '@/actions/App/Http/Controllers/Onboarding/AnnualTargetBudgetController';
import { MonthYearPicker } from '@/components/month-year-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldTitle,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import type { AnnualTargetBudgetFormValues } from '@/schemas/onboarding/budget';
import {
  annualTargetBudgetDefaultValues,
  annualTargetBudgetSchema,
} from '@/schemas/onboarding/budget';

type BudgetFormProps = {
  property: {
    id: string;
    name: string;
  };
};

export function BudgetForm({ property }: BudgetFormProps) {
  const form = useForm<AnnualTargetBudgetFormValues>({
    resolver: valibotResolver(annualTargetBudgetSchema),
    defaultValues: annualTargetBudgetDefaultValues,
    mode: 'onBlur',
  });

  const startDate = useWatch({ control: form.control, name: 'start_date' });
  const endDate = useWatch({ control: form.control, name: 'end_date' });

  useEffect(() => {
    if (!startDate) {
      return;
    }

    const computed = format(
      subDays(addYears(new Date(`${startDate}T00:00:00`), 1), 1),
      'yyyy-MM-dd',
    );
    form.setValue('end_date', computed, { shouldValidate: true });
  }, [startDate, form]);

  function submitHandler(values: AnnualTargetBudgetFormValues) {
    router.post(
      store.url({ property: property.id }),
      { ...values, property_id: property.id },
      {
        preserveScroll: true,
        onError: (errors) => {
          for (const [field, message] of Object.entries(errors)) {
            if (field in values && typeof message === 'string') {
              form.setError(field as keyof AnnualTargetBudgetFormValues, {
                type: 'server',
                message,
              });
            }
          }
        },
      },
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Set up your fiscal year
          {property.name && <> for {property.name} </>}
        </CardTitle>
        <CardDescription>
          Define the budget period and annual target for this property.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="onboarding-fiscal-year-form"
          onSubmit={form.handleSubmit(submitHandler)}
          noValidate
          className="space-y-6"
        >
          <FieldGroup>
            <div className="grid gap-6 md:grid-cols-2">
              <Controller
                name="start_date"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Start of fiscal year
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <MonthYearPicker
                      value={field.value}
                      onChangeAction={field.onChange}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Field>
                <FieldLabel>End of fiscal year</FieldLabel>
                <div className="relative">
                  <Input
                    disabled
                    readOnly
                    value={endDate ? format(new Date(`${endDate}T00:00:00`), 'MMMM d, yyyy') : ''}
                    placeholder="Auto-calculated from start date"
                  />
                  <CalendarDays className="absolute top-1/2 right-3 size-4 -translate-y-1/2 opacity-50" />
                </div>
                <FieldDescription>
                  Automatically set to 12 months after the start date.
                </FieldDescription>
              </Field>
            </div>
            <FieldSeparator />
            <Controller
              name="total_budget"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="annual-target-budget">
                    Annual target budget (MAD)
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="annual-target-budget"
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="60000"
                    aria-invalid={fieldState.invalid}
                    value={field.value ?? ''}
                    onChange={(event) => {
                      const value = event.target.value;
                      field.onChange(value === '' ? undefined : Number(value));
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                  <FieldDescription>The target annual budget for this property.</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="is_budget_locked"
              control={form.control}
              render={({ field }) => (
                <FieldLabel htmlFor="lock-budget">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>Lock the budget after setup</FieldTitle>
                      <FieldDescription>
                        Existing co-owner quotas become immutable. New units added later only adjust
                        the total.
                      </FieldDescription>
                    </FieldContent>
                    <Switch
                      id="lock-budget"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                    />
                  </Field>
                </FieldLabel>
              )}
            />
          </FieldGroup>
          <div className="flex justify-end">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Spinner data-icon="inline-start" />}
              Continue
              {!form.formState.isSubmitting && <ArrowRight data-icon="inline-end" />}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
