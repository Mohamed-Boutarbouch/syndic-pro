'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  OnboardingProperty,
  onboardingPropertySchema,
} from '@/features/schema';

export function OnboardingPropertyForm() {
  const router = useRouter();
  const form = useForm<OnboardingProperty>({
    resolver: zodResolver(onboardingPropertySchema),
    defaultValues: {
      propertyName: '',
      propertyAddress: '',
      propertyCity: '',
    },
  });

  function submitHandler(data: OnboardingProperty) {
    console.log(data);
    router.push('/onboarding/fiscal-year');
  }

  return (
    <Card>
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
            <Controller
              name="propertyName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="property-name">
                    Property name <span className="text-destructive">*</span>
                  </FieldLabel>

                  <Input
                    {...field}
                    id="property-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Residence Al Amal"
                    autoComplete="organization"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

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

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="propertyCity"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="property-city">
                    City <span className="text-destructive">*</span>
                  </FieldLabel>

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
    </Card>
  );
}
