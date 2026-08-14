'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
} from '@/components/ui/item';

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
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { billingFrequencies, onboardingSyndicSchema } from '@/features/schema';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Checkbox } from '@/components/ui/checkbox';

import { Info, Shield } from 'lucide-react';

const onboardingCoOwnerSchema = onboardingSyndicSchema.pick({
  coOwnerName: true,
  coOwnerEmail: true,
  coOwnerPhone: true,
  billingFrequency: true,
  designatedSyndic: true,
});

type OnboardingCoOwnerSchema = z.infer<typeof onboardingCoOwnerSchema>;

export function OnboardingCoOwnerForm() {
  const form = useForm<OnboardingCoOwnerSchema>({
    resolver: zodResolver(onboardingCoOwnerSchema),

    defaultValues: {
      coOwnerName: '',
      coOwnerEmail: '',
      coOwnerPhone: '',
      billingFrequency: 'Monthly',
      designatedSyndic: false,
    },
  });

  function submitHandler(data: OnboardingCoOwnerSchema) {
    console.log(data);
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Assign co-owner</CardTitle>

        <CardDescription>
          Add the co-owner and configure their billing preferences.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="onboarding-co-owners-form"
          onSubmit={form.handleSubmit(submitHandler)}
        >
          <FieldGroup>
            <Controller
              name="coOwnerName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="owner-name">Owner name</FieldLabel>

                  <Input
                    {...field}
                    id="owner-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g. John Doe"
                    autoComplete="name"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="coOwnerEmail"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="owner-email">Email</FieldLabel>

                  <Input
                    {...field}
                    type="email"
                    id="owner-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="owner@email.com"
                    autoComplete="email"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="coOwnerPhone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="owner-phone">Phone</FieldLabel>

                  <Input
                    {...field}
                    type="tel"
                    id="owner-phone"
                    aria-invalid={fieldState.invalid}
                    placeholder="+212 6XX XXX XXX"
                    autoComplete="tel"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="billingFrequency"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="billing-frequency">
                    Billing frequency
                  </FieldLabel>

                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="billing-frequency"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {billingFrequencies.map((frequency) => (
                        <SelectItem key={frequency} value={frequency}>
                          {frequency}
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
              name="designatedSyndic"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="designated-syndic"
                    className="cursor-pointer"
                  >
                    <Field orientation="horizontal">
                      <Checkbox
                        id="designated-syndic"
                        name={field.name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        aria-invalid={fieldState.invalid}
                      />

                      <FieldContent>
                        <FieldTitle className="flex items-center gap-2">
                          <Shield className="size-5" />
                          Designate as syndic
                        </FieldTitle>

                        <span className="text-muted-foreground text-sm">
                          This co-owner will manage the property.
                        </span>
                      </FieldContent>
                    </Field>
                  </FieldLabel>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <Item className="mt-4" variant="outline" size="sm">
        <ItemMedia>
          <Info />
        </ItemMedia>

        <ItemContent>
          <ItemDescription>
            Only one co-owner can be the syndic. You can change this later from
            the Co-Owners tab.
          </ItemDescription>
        </ItemContent>
      </Item>

      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>

          <Button type="submit" form="onboarding-co-owners-form">
            Continue
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
