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
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MONTHS,
  OnboardingFiscalYear,
  onboardingFiscalYearSchema,
} from '@/features/schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export function OnboardingFiscalYearForm() {
  const router = useRouter();

  const form = useForm<OnboardingFiscalYear>({
    resolver: zodResolver(onboardingFiscalYearSchema),

    defaultValues: {
      startMonth: undefined,
      endMonth: undefined,
      startYear: '',
      endYear: '',
      annualTargetBudget: undefined,
      lockBudget: false,
    },
  });

  function submitHandler(data: OnboardingFiscalYear) {
    console.log(data);

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
            <Controller
              name="startMonth"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="start-month">Start month</FieldLabel>

                  <Select
                    name={field.name}
                    value={field.value ?? ''}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="start-month"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select start month" />
                    </SelectTrigger>

                    <SelectContent>
                      {MONTHS.map((month) => (
                        <SelectItem key={month} value={month}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="startYear"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="start-year">Start year</FieldLabel>

                  <Input
                    {...field}
                    id="start-year"
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="2026"
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="endMonth"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="end-month">End month</FieldLabel>

                  <Select
                    name={field.name}
                    value={field.value ?? ''}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="end-month"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select end month" />
                    </SelectTrigger>

                    <SelectContent>
                      {MONTHS.map((month) => (
                        <SelectItem key={month} value={month}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="endYear"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="end-year">End year</FieldLabel>

                  <Input
                    {...field}
                    id="end-year"
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="2027"
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <FieldSeparator />

            <Controller
              name="annualTargetBudget"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="annual-target-budget">
                    Annual target budget (MAD)
                  </FieldLabel>

                  <Input
                    id="annual-target-budget"
                    type="number"
                    min={50}
                    step="1"
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
              name="lockBudget"
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

      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>

          <Button type="submit" form="onboarding-fiscal-year-form">
            Continue
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
