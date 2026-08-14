'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { onboardingSyndicSchema } from '@/features/schema';

const onboardingPropertySchema = onboardingSyndicSchema.pick({
  propertyName: true,
  propertyAddress: true,
  propertyCity: true,
});

type OnboardingPropertySchema = z.infer<typeof onboardingPropertySchema>;

export function OnboardingPropertyForm() {
  const router = useRouter();
  const form = useForm<OnboardingPropertySchema>({
    resolver: zodResolver(onboardingPropertySchema),
    defaultValues: {
      propertyName: '',
      propertyAddress: '',
      propertyCity: '',
    },
  });

  function submitHandler(data: OnboardingPropertySchema) {
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
                  <FieldLabel htmlFor="property-name">Property name</FieldLabel>

                  <Input
                    {...field}
                    id="property-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Residence Al Amal"
                    autoComplete="organization"
                  />

                  <FieldDescription>
                    The name used to identify this property.
                  </FieldDescription>

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
