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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item';
import {
  UNIT_TYPES,
  OnboardingUnit,
  onboardingUnitSchema,
} from '@/features/schema';
import { Input } from '@/components/ui/input';

export function OnboardingUnitForm() {
  const router = useRouter();

  const form = useForm<OnboardingUnit>({
    resolver: zodResolver(onboardingUnitSchema),

    defaultValues: {
      unitLabel: '',
      unitType: 'Apartment',
      unitFloor: '',
      weightCoefficient: undefined,
    },
  });

  function submitHandler(data: OnboardingUnit) {
    console.log(data);

    router.push('/onboarding/co-owners');
  }

  return (
    <Card>
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
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              <Controller
                name="unitLabel"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="unit-label">
                      Label
                      <span className="text-destructive">*</span>
                    </FieldLabel>

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
                        {UNIT_TYPES.map((type) => (
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

              <Controller
                name="weightCoefficient"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="weight-coefficient">
                      Weight coefficient
                      <span className="text-destructive">*</span>
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

                        field.onChange(
                          value === '' ? undefined : Number(value),
                        );
                      }}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
