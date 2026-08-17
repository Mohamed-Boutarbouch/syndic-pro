'use client';

import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react';
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
  FieldSet,
  FieldLegend,
  FieldDescription,
} from '@/components/ui/field';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { Button } from '@/components/ui/button';
import {
  UNIT_TYPES,
  OnboardingUnits,
  unitsSchema,
  UnitItem,
} from '@/features/onboarding/schema';
import { Input } from '@/components/ui/input';
import { useOnboardingStore } from '@/features/onboarding/store';
import { useEffect } from 'react';

const MAX_UNITS = 50;

function createEmptyUnit(): UnitItem {
  return {
    clientId: crypto.randomUUID(),
    unitLabel: '',
    unitType: 'Apartment',
    unitFloor: '',
    weightCoefficient: undefined,
  };
}

export function UnitForm() {
  const hasHydrated = useOnboardingStore((s) => s._hasHydrated);
  const units = useOnboardingStore((s) => s.units);
  const setUnits = useOnboardingStore((s) => s.setUnits);
  const router = useRouter();
  const form = useForm<OnboardingUnits>({
    resolver: zodResolver(unitsSchema),
    defaultValues: {
      units: units.length > 0 ? units : [createEmptyUnit()],
    },
  });

  useEffect(() => {
    if (hasHydrated && units.length > 0) {
      form.reset({ units });
    }
  }, [hasHydrated]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'units',
  });

  function submitHandler(data: OnboardingUnits) {
    console.log(data);
    setUnits(data.units);
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
          <FieldSet className="gap-4">
            <FieldLegend variant="label">Units</FieldLegend>
            <FieldDescription>
              Add up to {MAX_UNITS} units for this property.
            </FieldDescription>
            <FieldGroup className="gap-4">
              {fields.map((field, index) => (
                <Item
                  key={field.id}
                  variant="outline"
                  className="relative flex-col items-stretch gap-4"
                >
                  <ItemTitle>Unit {index + 1}</ItemTitle>
                  <ItemContent className="grid w-full gap-4 sm:grid-cols-2 md:grid-cols-4 md:items-start">
                    <Controller
                      name={`units.${index}.unitLabel`}
                      control={form.control}
                      render={({ field: controllerField, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={`unit-label-${index}`}>
                            Label
                            <span className="text-destructive">*</span>
                          </FieldLabel>
                          <Input
                            {...controllerField}
                            id={`unit-label-${index}`}
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
                      name={`units.${index}.unitType`}
                      control={form.control}
                      render={({ field: controllerField, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={`unit-type-${index}`}>
                            Type
                          </FieldLabel>
                          <Select
                            name={controllerField.name}
                            value={controllerField.value}
                            onValueChange={controllerField.onChange}
                          >
                            <SelectTrigger
                              id={`unit-type-${index}`}
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
                      name={`units.${index}.unitFloor`}
                      control={form.control}
                      render={({ field: controllerField, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={`unit-floor-${index}`}>
                            Floor
                          </FieldLabel>
                          <Input
                            {...controllerField}
                            id={`unit-floor-${index}`}
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
                      name={`units.${index}.weightCoefficient`}
                      control={form.control}
                      render={({ field: controllerField, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={`weight-coefficient-${index}`}>
                            Weight coefficient
                            <span className="text-destructive">*</span>
                          </FieldLabel>

                          <div className="relative">
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xl font-medium text-muted-foreground"
                            >
                              ×
                            </span>

                            <Input
                              id={`weight-coefficient-${index}`}
                              type="number"
                              min={0}
                              step="0.1"
                              placeholder="1.0"
                              aria-invalid={fieldState.invalid}
                              name={controllerField.name}
                              ref={controllerField.ref}
                              onBlur={controllerField.onBlur}
                              value={controllerField.value ?? ''}
                              onChange={(event) => {
                                const value = event.target.value;

                                controllerField.onChange(
                                  value === '' ? undefined : Number(value),
                                );
                              }}
                              className="pl-8"
                            />
                          </div>

                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </ItemContent>

                  {fields.length > 1 && (
                    <ItemActions>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => remove(index)}
                        aria-label={`Remove unit ${index + 1}`}
                      >
                        <X className="size-4" />
                      </Button>
                    </ItemActions>
                  )}
                </Item>
              ))}
            </FieldGroup>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append(createEmptyUnit())}
              disabled={fields.length >= MAX_UNITS}
            >
              <Plus data-icon="inline-start" />
              Add Another Unit
            </Button>
            {form.formState.errors.units?.root && (
              <FieldError errors={[form.formState.errors.units.root]} />
            )}
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  );
}
