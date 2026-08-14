'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item';

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
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { onboardingSyndicSchema, unitTypes } from '@/features/schema';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const onboardingUnitSchema = onboardingSyndicSchema.pick({
  unitLabel: true,
  unitType: true,
  unitFloor: true,
  weightCoefficient: true,
});

type OnboardingUnitSchema = z.infer<typeof onboardingUnitSchema>;

export function OnboardingUnitForm() {
  const router = useRouter();

  const form = useForm<OnboardingUnitSchema>({
    resolver: zodResolver(onboardingUnitSchema),

    defaultValues: {
      unitLabel: '',
      unitType: 'Apartment',
      unitFloor: '',
      weightCoefficient: 1.0,
    },
  });

  function submitHandler(data: OnboardingUnitSchema) {
    console.log(data);

    router.push('/onboarding/co-owners');
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Add your units</CardTitle>

        <CardDescription>
          List all units in the property. You can add co-owners in the next
          step.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Item className="mb-4" variant="outline" size="sm">
          <ItemMedia className="text-muted-foreground">Rate:</ItemMedia>

          <ItemContent>
            <ItemTitle>10,000 MAD/point/year</ItemTitle>
          </ItemContent>
        </Item>

        <form
          id="onboarding-units-form"
          onSubmit={form.handleSubmit(submitHandler)}
        >
          <FieldGroup>
            {/* ---------------------------------------------------------------- */}
            {/* Unit Label */}
            {/* ---------------------------------------------------------------- */}

            <Controller
              name="unitLabel"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="unit-label">Label</FieldLabel>

                  <Input
                    {...field}
                    id="unit-label"
                    aria-invalid={fieldState.invalid}
                    placeholder="A-101"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* ---------------------------------------------------------------- */}
            {/* Unit Type */}
            {/* ---------------------------------------------------------------- */}

            <Controller
              name="unitType"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="unit-type">Type</FieldLabel>

                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="unit-type"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {unitTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
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

            {/* ---------------------------------------------------------------- */}
            {/* Floor */}
            {/* ---------------------------------------------------------------- */}

            <Controller
              name="unitFloor"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="unit-floor">Floor</FieldLabel>

                  <Input
                    {...field}
                    id="unit-floor"
                    aria-invalid={fieldState.invalid}
                    placeholder="RDC"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* ---------------------------------------------------------------- */}
            {/* Weight Coefficient */}
            {/* ---------------------------------------------------------------- */}

            <Controller
              name="weightCoefficient"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="weight-coefficient">
                    Weight coefficient
                  </FieldLabel>

                  <Input
                    id="weight-coefficient"
                    type="number"
                    min={0}
                    step="0.1"
                    placeholder="1.0"
                    aria-invalid={fieldState.invalid}
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    value={field.value ?? ''}
                    onChange={(event) => {
                      const value = event.target.value;

                      field.onChange(value === '' ? undefined : Number(value));
                    }}
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

          <Button type="submit" form="onboarding-units-form">
            Continue
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
