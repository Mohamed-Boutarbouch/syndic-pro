'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { onboardingSyndicSchema } from '@/features/schema';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const onboardingFiscalYearSchema = onboardingSyndicSchema.pick({
  startMonth: true,
  endMonth: true,
  startYear: true,
  endYear: true,
  annualTargetBudget: true,
  lockBudget: true,
});

type OnboardingFiscalYearSchema = z.infer<typeof onboardingFiscalYearSchema>;

export function OnboardingFiscalYearForm() {
  const router = useRouter();
  const form = useForm<OnboardingFiscalYearSchema>({
    resolver: zodResolver(onboardingFiscalYearSchema),
    defaultValues: {
      startMonth: null,
      endMonth: null,
      startYear: null,
      endYear: null,
      annualTargetBudget: null,
      lockBudget: false,
    },
  });

  function submitHandler(data: OnboardingFiscalYearSchema) {
    console.log(data);
    router.push('/onboarding/units');
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Tell us about your property</CardTitle>
        <CardDescription>
          This is the residence you'll be managing as syndic.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="onboarding-property-form"
          onSubmit={form.handleSubmit(submitHandler)}
        >
          <FieldGroup>
            {/* Property name */}
            <Controller
              name="startMonth"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="responsive"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldLabel htmlFor="form-rhf-select-language">
                      Spoken Language
                    </FieldLabel>
                    <FieldDescription>
                      For best results, select the language you speak.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="form-rhf-select-language"
                      aria-invalid={fieldState.invalid}
                      className="min-w-30"
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      <SelectItem value="auto">Auto</SelectItem>
                      <SelectSeparator />
                      {spokenLanguages.map((language) => (
                        <SelectItem key={language.value} value={language.value}>
                          {language.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            {/* Property address */}
            <Controller
              name="propertyAddress"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="property-address">
                    Property address
                  </FieldLabel>

                  <Input
                    {...field}
                    id="property-address"
                    aria-invalid={fieldState.invalid}
                    placeholder="12 Avenue Hassan II"
                    autoComplete="street-address"
                  />

                  <FieldDescription>
                    Optional. You can leave this blank if you don't have the
                    address yet.
                  </FieldDescription>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Property city */}
            <Controller
              name="propertyCity"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="property-city">City</FieldLabel>

                  <Input
                    {...field}
                    id="property-city"
                    aria-invalid={fieldState.invalid}
                    placeholder="Casablanca"
                    autoComplete="address-level2"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
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

          <Button type="submit" form="onboarding-property-form">
            Continue
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
