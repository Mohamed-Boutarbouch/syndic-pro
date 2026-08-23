'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { createAnnualTargetBudgetSchema } from '@syndic-pro/validators';
import type { CreateAnnualTargetBudget } from '@syndic-pro/types';

import { Input } from '@/components/ui/input';
import { MonthYearPicker } from '@/components/month-year-picker';
import { Switch } from '@/components/ui/switch';
import { useOnboardingStore } from '@/features/onboarding/store';

export function FiscalYearForm() {
  const { fiscalYear, setFiscalYear } = useOnboardingStore();
  const router = useRouter();

  const form = useForm<CreateAnnualTargetBudget>({
    resolver: zodResolver(createAnnualTargetBudgetSchema),

    defaultValues: fiscalYear ?? {
      startDate: undefined,
      endDate: undefined,
      totalBudget: undefined,
      isBudgetLocked: false,
    },
  });

  function submitHandler(data: CreateAnnualTargetBudget) {
    console.log(data);
    setFiscalYear(data);
    router.push('/onboarding/units');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set up your fiscal year</CardTitle>

        <CardDescription>
          Define the budget period and annual target for this property.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="onboarding-fiscal-year-form"
          onSubmit={form.handleSubmit(submitHandler)}
        >
          <FieldGroup>
            <div className="grid gap-6 md:grid-cols-2">
              <Controller
                name="startDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Start of fiscal year
                      <span className="text-destructive">*</span>
                    </FieldLabel>

                    <MonthYearPicker
                      value={field.value}
                      onChange={field.onChange}
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="endDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      End of fiscal year
                      <span className="text-destructive">*</span>
                    </FieldLabel>

                    <MonthYearPicker
                      value={field.value}
                      onChange={field.onChange}
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <FieldSeparator />

            <Controller
              name="totalBudget"
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
                    min={50}
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

                  <FieldDescription>
                    The target annual budget for this property.
                  </FieldDescription>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="isBudgetLocked"
              control={form.control}
              render={({ field }) => (
                <FieldLabel htmlFor="lock-budget">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>Lock the budget after setup</FieldTitle>

                      <FieldDescription>
                        Existing co-owner quotas become immutable. New units
                        added later only adjust the total.
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
        </form>
      </CardContent>
    </Card>
  );
}
