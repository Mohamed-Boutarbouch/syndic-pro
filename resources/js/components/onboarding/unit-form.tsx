import { valibotResolver } from '@hookform/resolvers/valibot';
import { router } from '@inertiajs/react';
import { ArrowRight, Plus, X } from 'lucide-react';
import { useMemo } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

import { store } from '@/actions/App/Http/Controllers/Onboarding/UnitController';
import { UnitBudgetShare } from '@/components/onboarding/unit-budget-share';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FieldSet,
  FieldLegend,
  FieldGroup,
  FieldDescription,
  FieldError,
  Field,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/hooks/use-translation';
import type { UnitPageProps } from '@/pages/onboarding/unit';
import type { UnitsFormOutputValues, UnitsFormValues } from '@/schemas/onboarding/units';
import { createEmptyUnit, createUnitsSchema } from '@/schemas/onboarding/units';

export function UnitForm({ property, budget, unitTypes, maxUnits: MAX_UNITS }: UnitPageProps) {
  const { t, money } = useTranslation();
  const schema = useMemo(() => createUnitsSchema(t), [t]);

  const form = useForm<UnitsFormValues, any, UnitsFormOutputValues>({
    resolver: valibotResolver(schema),
    defaultValues: {
      units: [createEmptyUnit()],
    },
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'units',
  });

  function submitHandler(values: UnitsFormOutputValues) {
    router.post(store.url({ property: property.id }), values, {
      preserveScroll: true,
      onError: (errors) => {
        for (const [field, message] of Object.entries(errors)) {
          if (typeof message === 'string') {
            form.setError(field as keyof UnitsFormValues, {
              type: 'server',
              message,
            });
          }
        }
      },
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('onboarding.units.title')}</CardTitle>
        <CardDescription>{t('onboarding.units.description')}</CardDescription>
      </CardHeader>

      <CardContent>
        <Item className="mb-4" variant="outline" size="sm">
          <ItemMedia className="text-muted-foreground">{t('onboarding.units.budget')}</ItemMedia>
          <ItemContent>
            <ItemTitle>
              {t('onboarding.units.per_year', {
                amount: money(budget.total_budget),
              })}
            </ItemTitle>
          </ItemContent>
        </Item>

        <form id="onboarding-units-form" onSubmit={form.handleSubmit(submitHandler)}>
          <FieldSet className="gap-4">
            <FieldLegend variant="label">{t('onboarding.units.legend')}</FieldLegend>

            <FieldDescription>{t('onboarding.units.limit', { max: MAX_UNITS })}</FieldDescription>

            <FieldGroup className="gap-4">
              {fields.map((field, index) => (
                <Item
                  key={field.id}
                  variant="outline"
                  className="relative flex-col items-stretch gap-4"
                >
                  <ItemTitle className="flex items-center justify-between">
                    <span>
                      {t('onboarding.units.unit_n', {
                        number: index + 1,
                      })}
                    </span>

                    <UnitBudgetShare
                      control={form.control}
                      index={index}
                      totalBudget={budget.total_budget}
                    />
                  </ItemTitle>

                  <ItemContent className="grid w-full gap-4 sm:grid-cols-2 md:grid-cols-4 md:items-start">
                    <Controller
                      name={`units.${index}.label`}
                      control={form.control}
                      render={({ field: controllerField, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={`unit-label-${index}`}>
                            {t('onboarding.units.label')}
                            <span className="text-destructive">*</span>
                          </FieldLabel>

                          <Input
                            {...controllerField}
                            id={`unit-label-${index}`}
                            aria-invalid={fieldState.invalid}
                            placeholder="A-101"
                          />

                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    <Controller
                      name={`units.${index}.type`}
                      control={form.control}
                      render={({ field: controllerField, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={`unit-type-${index}`}>
                            {t('onboarding.units.type')}
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
                              {unitTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    <Controller
                      name={`units.${index}.floor`}
                      control={form.control}
                      render={({ field: controllerField, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={`unit-floor-${index}`}>
                            {t('onboarding.units.floor')}
                          </FieldLabel>

                          <Input
                            {...controllerField}
                            id={`unit-floor-${index}`}
                            aria-invalid={fieldState.invalid}
                            placeholder="RDC"
                          />

                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    <Controller
                      name={`units.${index}.weight_coefficient`}
                      control={form.control}
                      render={({ field: controllerField, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={`weight-coefficient-${index}`}>
                            {t('onboarding.units.weight')}
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
                              inputMode="decimal"
                              step={0.1}
                              min={0}
                              max={10}
                              placeholder="1.0"
                              aria-invalid={fieldState.invalid}
                              name={controllerField.name}
                              ref={controllerField.ref}
                              onBlur={controllerField.onBlur}
                              value={controllerField.value ?? ''}
                              onChange={(event) => {
                                const num = event.target.valueAsNumber;

                                controllerField.onChange(Number.isNaN(num) ? undefined : num);
                              }}
                              className="pl-8"
                            />
                          </div>

                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                        aria-label={t('onboarding.units.remove', {
                          number: index + 1,
                        })}
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
              {t('onboarding.units.add')}
            </Button>

            {form.formState.errors.units?.root && (
              <FieldError errors={[form.formState.errors.units.root]} />
            )}
          </FieldSet>

          <div className="mt-8 flex justify-end">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Spinner data-icon="inline-start" />}

              {t('onboarding.continue')}

              {!form.formState.isSubmitting && <ArrowRight data-icon="inline-end" />}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
