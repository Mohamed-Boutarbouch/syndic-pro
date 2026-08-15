'use client';

import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { Info, Shield } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';

import {
  BILLING_FREQUENCIES,
  CoOwnerItem,
  OnboardingCoOwners,
  coOwnersSchema,
} from '@/features/onboarding/schema';

import { useOnboardingStore } from '@/features/onboarding/store';

function createEmptyCoOwner(unitClientId: string): CoOwnerItem {
  return {
    unitClientId,
    coOwnerName: '',
    coOwnerEmail: '',
    coOwnerPhone: '',
    billingFrequency: 'Monthly',
    designatedSyndic: false,
  };
}

export function OnboardingCoOwnerForm() {
  const hasHydrated = useOnboardingStore((s) => s._hasHydrated);
  const units = useOnboardingStore((s) => s.units);
  const coOwners = useOnboardingStore((s) => s.coOwners);
  const setCoOwners = useOnboardingStore((s) => s.setCoOwners);

  const router = useRouter();

  const form = useForm<OnboardingCoOwners>({
    resolver: zodResolver(coOwnersSchema),
    defaultValues: {
      coOwners:
        coOwners.length > 0
          ? coOwners
          : units.map((unit) => createEmptyCoOwner(unit.clientId)),
    },
  });

  useEffect(() => {
    if (!hasHydrated) return;

    const existingByUnit = new Map(coOwners.map((c) => [c.unitClientId, c]));

    const reconciled = units.map(
      (unit) =>
        existingByUnit.get(unit.clientId) ?? createEmptyCoOwner(unit.clientId),
    );

    form.reset({ coOwners: reconciled });
  }, [hasHydrated]);

  const { fields } = useFieldArray({
    control: form.control,
    name: 'coOwners',
  });

  const watchedCoOwners = useWatch({
    control: form.control,
    name: 'coOwners',
  });

  const selectedSyndic =
    watchedCoOwners.find((coOwner) => coOwner.designatedSyndic)?.unitClientId ??
    '';

  function handleSyndicChange(unitClientId: string) {
    form.setValue(
      'coOwners',
      form.getValues('coOwners').map((coOwner) => ({
        ...coOwner,
        designatedSyndic: coOwner.unitClientId === unitClientId,
      })),
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      },
    );
  }

  function submitHandler(data: OnboardingCoOwners) {
    setCoOwners(data.coOwners);
    router.push('/onboarding/review');
  }

  const unitByClientId = new Map(units.map((u) => [u.clientId, u]));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Assign co-owners</CardTitle>
        <CardDescription>
          Add a co-owner for each unit and configure their billing preferences.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="onboarding-co-owners-form"
          onSubmit={form.handleSubmit(submitHandler)}
        >
          <RadioGroup value={selectedSyndic} onValueChange={handleSyndicChange}>
            <FieldGroup className="gap-6">
              {fields.map((field, index) => {
                const unit = unitByClientId.get(field.unitClientId);

                return (
                  <Item
                    key={field.id}
                    variant="outline"
                    className="relative flex-col items-stretch gap-4"
                  >
                    <ItemTitle>
                      Unit {unit?.unitLabel ?? index + 1}
                      {unit?.unitType ? ` · ${unit.unitType}` : ''}
                    </ItemTitle>

                    <div className="grid gap-6 md:grid-cols-2">
                      <Controller
                        name={`coOwners.${index}.coOwnerName`}
                        control={form.control}
                        render={({ field: f, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={`owner-name-${index}`}>
                              Owner name
                              <span className="text-destructive">*</span>
                            </FieldLabel>

                            <Input
                              {...f}
                              id={`owner-name-${index}`}
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
                        name={`coOwners.${index}.coOwnerEmail`}
                        control={form.control}
                        render={({ field: f, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={`owner-email-${index}`}>
                              Email
                            </FieldLabel>

                            <Input
                              {...f}
                              type="email"
                              id={`owner-email-${index}`}
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
                        name={`coOwners.${index}.coOwnerPhone`}
                        control={form.control}
                        render={({ field: f, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={`owner-phone-${index}`}>
                              Phone
                            </FieldLabel>

                            <Input
                              {...f}
                              type="tel"
                              id={`owner-phone-${index}`}
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
                        name={`coOwners.${index}.billingFrequency`}
                        control={form.control}
                        render={({ field: f, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={`billing-frequency-${index}`}>
                              Billing frequency
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
                                {BILLING_FREQUENCIES.map((frequency) => (
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

                      <Field className="md:col-span-2">
                        <FieldLabel
                          htmlFor={`designated-syndic-${index}`}
                          className="cursor-pointer"
                        >
                          <Field
                            orientation="horizontal"
                            className="items-start"
                          >
                            <RadioGroupItem
                              value={field.unitClientId}
                              id={`designated-syndic-${index}`}
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
                      </Field>
                    </div>
                  </Item>
                );
              })}

              {form.formState.errors.coOwners?.root && (
                <FieldError errors={[form.formState.errors.coOwners.root]} />
              )}
            </FieldGroup>
          </RadioGroup>
        </form>

        <Item className="mt-4" variant="outline" size="sm">
          <ItemMedia>
            <Info />
          </ItemMedia>

          <ItemContent>
            <ItemDescription>
              Only one co-owner can be the syndic. You can change this later
              from the Co-Owners tab.
            </ItemDescription>
          </ItemContent>
        </Item>
      </CardContent>
    </Card>
  );
}
