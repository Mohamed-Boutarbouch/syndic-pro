import { valibotResolver } from '@hookform/resolvers/valibot';
import { router } from '@inertiajs/react';
import { Check, Info, Shield } from 'lucide-react';
import { useMemo } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

import { store } from '@/actions/App/Http/Controllers/Onboarding/CoOwnerController';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UnitTypeBadge } from '@/components/unit-type-badge';
import { useTranslation } from '@/hooks/use-translation';
import { calculateInstallmentAmount } from '@/lib/billing';
import type { CoOwnerPageProps } from '@/pages/onboarding/co-owner';
import { createCoOwnersSchema, createEmptyCoOwner } from '@/schemas/onboarding/co-owners';
import type { CoOwnerFormValues } from '@/schemas/onboarding/co-owners';

export function CoOwnerForm({
  property,
  budget,
  units,
  billingFrequency: BILLING_FREQUENCY,
}: CoOwnerPageProps) {
  const { t, money } = useTranslation();
  const schema = useMemo(() => createCoOwnersSchema(t), [t]);

  const form = useForm<CoOwnerFormValues>({
    resolver: valibotResolver(schema),
    defaultValues: {
      coOwners: units.map((unit) => createEmptyCoOwner(unit)),
      syndicUnitId: undefined,
    },
    mode: 'onBlur',
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'coOwners',
  });

  function submitHandler(values: CoOwnerFormValues) {
    router.post(store.url({ property: property.id }), values, {
      preserveScroll: true,
      onError: (errors) => {
        for (const [field, message] of Object.entries(errors)) {
          if (typeof message === 'string') {
            form.setError(field as keyof CoOwnerFormValues, {
              type: 'server',
              message,
            });
          }
        }
      },
    });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>{t('onboarding.co_owners.title')}</CardTitle>
            <CardDescription>{t('onboarding.co_owners.description')}</CardDescription>
          </div>

          <div className="shrink-0 rounded-lg border bg-muted/30 px-4 py-2 text-right">
            <div className="text-xs text-muted-foreground">
              {t('onboarding.co_owners.overall_budget')}
            </div>
            <div className="text-lg font-semibold tabular-nums">{money(budget)}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form id="onboarding-co-owners-form" onSubmit={form.handleSubmit(submitHandler)}>
          <Controller
            name="syndicUnitId"
            control={form.control}
            render={({ field: syndicField, fieldState: syndicFieldState }) => (
              <>
                <RadioGroup
                  value={syndicField.value != null ? String(syndicField.value) : ''}
                  onValueChange={(value) => syndicField.onChange(Number(value))}
                >
                  <FieldGroup className="gap-6">
                    {fields.map((field, index) => {
                      const unit = units[index];

                      return (
                        <Item
                          key={field.id}
                          variant="outline"
                          className="relative flex-col items-stretch gap-4"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <ItemTitle className="flex items-center gap-2">
                              {t('onboarding.co_owners.unit', {
                                label: unit.label,
                              })}
                              {unit.type && <UnitTypeBadge type={unit.type} />}
                            </ItemTitle>

                            <div className="text-right">
                              <span className="text-sm font-semibold tabular-nums">
                                {money(unit.calculated_annual_budget)}
                              </span>
                              <div className="text-xs text-muted-foreground">
                                {t('onboarding.co_owners.annual_budget')}
                              </div>
                            </div>
                          </div>

                          <div className="grid gap-6 md:grid-cols-2">
                            <Controller
                              name={`coOwners.${index}.name`}
                              control={form.control}
                              render={({ field: f, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                  <FieldLabel htmlFor={`owner-name-${index}`}>
                                    {t('onboarding.co_owners.name')}
                                    <span className="text-destructive">*</span>
                                  </FieldLabel>

                                  <Input
                                    {...f}
                                    id={`owner-name-${index}`}
                                    aria-invalid={fieldState.invalid}
                                    placeholder={t('onboarding.co_owners.name_placeholder')}
                                    autoComplete="name"
                                  />

                                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                              )}
                            />

                            <Controller
                              name={`coOwners.${index}.email`}
                              control={form.control}
                              render={({ field: f, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                  <FieldLabel htmlFor={`owner-email-${index}`}>
                                    {t('onboarding.co_owners.email')}
                                  </FieldLabel>

                                  <Input
                                    {...f}
                                    type="email"
                                    id={`owner-email-${index}`}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="owner@email.com"
                                    autoComplete="email"
                                  />

                                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                              )}
                            />

                            <Controller
                              name={`coOwners.${index}.phone`}
                              control={form.control}
                              render={({ field: f, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                  <FieldLabel htmlFor={`owner-phone-${index}`}>
                                    {t('onboarding.co_owners.phone')}
                                  </FieldLabel>

                                  <Input
                                    {...f}
                                    type="tel"
                                    id={`owner-phone-${index}`}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="+212 6XX XXX XXX"
                                    autoComplete="tel"
                                  />

                                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                              )}
                            />

                            <Controller
                              name={`coOwners.${index}.billing_frequency`}
                              control={form.control}
                              render={({ field: f, fieldState }) => {
                                const installmentAmount = calculateInstallmentAmount(
                                  Number(unit.calculated_annual_budget),
                                  f.value,
                                );

                                return (
                                  <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={`billing-frequency-${index}`}>
                                      {t('onboarding.co_owners.billing_frequency')}
                                    </FieldLabel>

                                    <Select
                                      name={f.name}
                                      value={f.value}
                                      onValueChange={f.onChange}
                                    >
                                      <SelectTrigger
                                        id={`billing-frequency-${index}`}
                                        aria-invalid={fieldState.invalid}
                                      >
                                        <SelectValue />
                                      </SelectTrigger>

                                      <SelectContent>
                                        {BILLING_FREQUENCY.map((frequency) => {
                                          const amount = calculateInstallmentAmount(
                                            Number(unit.calculated_annual_budget),
                                            frequency.value,
                                          );

                                          return (
                                            <SelectItem
                                              key={frequency.value}
                                              value={frequency.value}
                                            >
                                              <span className="flex w-full items-center justify-between gap-4">
                                                <span>{frequency.label}</span>

                                                {amount !== null && (
                                                  <span className="text-xs text-muted-foreground tabular-nums">
                                                    {money(amount)}
                                                  </span>
                                                )}
                                              </span>
                                            </SelectItem>
                                          );
                                        })}
                                      </SelectContent>
                                    </Select>

                                    {installmentAmount !== null && !fieldState.invalid && (
                                      <span className="text-xs text-muted-foreground">
                                        {t('onboarding.co_owners.per_installment', {
                                          amount: money(installmentAmount),
                                        })}
                                      </span>
                                    )}

                                    {fieldState.invalid && (
                                      <FieldError errors={[fieldState.error]} />
                                    )}
                                  </Field>
                                );
                              }}
                            />

                            <Field className="md:col-span-2">
                              <FieldLabel
                                htmlFor={`designated-syndic-${index}`}
                                className="cursor-pointer"
                              >
                                <Field orientation="horizontal" className="items-start">
                                  <RadioGroupItem
                                    value={String(unit.id)}
                                    id={`designated-syndic-${index}`}
                                  />

                                  <FieldContent>
                                    <FieldTitle className="flex items-center gap-2">
                                      <Shield className="size-5" />
                                      {t('onboarding.co_owners.designate')}
                                    </FieldTitle>

                                    <span className="text-sm text-muted-foreground">
                                      {t('onboarding.co_owners.designate_help')}
                                    </span>
                                  </FieldContent>
                                </Field>
                              </FieldLabel>
                            </Field>
                          </div>
                        </Item>
                      );
                    })}
                  </FieldGroup>
                </RadioGroup>

                {syndicFieldState.invalid && <FieldError errors={[syndicFieldState.error]} />}
              </>
            )}
          />

          {form.formState.errors.coOwners?.root && (
            <FieldError errors={[form.formState.errors.coOwners.root]} />
          )}
        </form>

        <Item className="mt-4" variant="outline" size="sm">
          <ItemMedia>
            <Info />
          </ItemMedia>

          <ItemContent>
            <ItemDescription>{t('onboarding.co_owners.syndic_note')}</ItemDescription>
          </ItemContent>
        </Item>

        <div className="mt-6 flex justify-end">
          <Button type="submit" form="onboarding-co-owners-form">
            {t('onboarding.complete_setup')}
            <Check data-icon="inline-end" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
