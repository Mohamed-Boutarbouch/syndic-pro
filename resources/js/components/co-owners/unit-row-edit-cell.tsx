import { valibotResolver } from '@hookform/resolvers/valibot';
import { router } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import * as v from 'valibot';

import UpdateUnitRowController from '@/actions/App/Http/Controllers/CoOwners/UpdateUnitRowController';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import type { UnitType } from '@/components/unit-type-badge';
import type { UnitShare } from '@/types/properties/co-owners';

const BILLING_FREQUENCIES = ['monthly', 'bimonthly', 'quarterly', 'semi_annual'] as const;

type BillingFrequencyValue = (typeof BILLING_FREQUENCIES)[number];

const BILLING_FREQUENCY_LABELS: Record<BillingFrequencyValue, string> = {
  monthly: 'Monthly',
  bimonthly: 'Bi-monthly',
  quarterly: 'Quarterly',
  semi_annual: 'Semi-annual',
};

const READ_FREQUENCY_MAP: Record<string, BillingFrequencyValue> = {
  monthly: 'monthly',
  bi_monthly: 'bimonthly',
  bimonthly: 'bimonthly',
  'bi-monthly': 'bimonthly',
  quarterly: 'quarterly',
  semestral: 'semi_annual',
  semi_annual: 'semi_annual',
  'semi-annual': 'semi_annual',
};

function toFormFrequency(value: string | null | undefined): BillingFrequencyValue | undefined {
  if (!value) {
    return undefined;
  }

  return READ_FREQUENCY_MAP[value];
}

export type UnitRowEditSource = UnitShare & {
  coOwnerEmail?: string | null;
  coOwnerPhone?: string | null;
};

type UnitRowEditCellProps = {
  unit: UnitRowEditSource;
  ratePerPoint: number;
  unitTypes: UnitType[];
};

const unitRowEditSchema = v.object({
  label: v.pipe(v.string(), v.trim(), v.nonEmpty('Unit label is required.')),

  type: v.picklist(
    ['residential', 'commercial', 'storage', 'other'] as const,
    'Unit type is required.',
  ),

  floor: v.optional(v.pipe(v.string(), v.trim())),

  coOwnerName: v.pipe(v.string(), v.trim(), v.nonEmpty('Owner name is required.')),

  coOwnerEmail: v.optional(
    v.union([
      v.pipe(v.string(), v.trim(), v.length(0)),
      v.pipe(v.string(), v.trim(), v.email('The email is badly formatted.')),
    ]),
  ),

  coOwnerPhone: v.optional(v.pipe(v.string(), v.trim())),

  billingFrequency: v.optional(v.picklist(BILLING_FREQUENCIES, 'Billing frequency is invalid.')),

  weightCoefficient: v.pipe(
    v.number(),
    v.minValue(0.1, 'Coefficient must be at least 0.1.'),
    v.maxValue(9.9, 'Coefficient must be at most 9.9.'),
  ),
});

type UnitRowEditFormValues = v.InferInput<typeof unitRowEditSchema>;

function buildDefaultValues(unit: UnitRowEditSource): UnitRowEditFormValues {
  return {
    label: unit.unit,
    type: unit.type,
    floor: unit.floor ?? '',
    coOwnerName: unit.coOwner ?? '',
    coOwnerEmail: unit.coOwnerEmail ?? '',
    coOwnerPhone: unit.coOwnerPhone ?? '',
    billingFrequency: toFormFrequency(unit.billingFrequency),
    weightCoefficient: unit.coefficient,
  };
}

export function UnitRowEditCell({ unit, ratePerPoint, unitTypes }: UnitRowEditCellProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<UnitRowEditFormValues>({
    resolver: valibotResolver(unitRowEditSchema),
    defaultValues: buildDefaultValues(unit),
    mode: 'onBlur',
  });

  const coefficient =
    useWatch({
      control: form.control,
      name: 'weightCoefficient',
    }) ?? 0;

  const previewAnnual = ratePerPoint * coefficient;
  const previewMonthly = previewAnnual / 12;

  function submitHandler(values: UnitRowEditFormValues) {
    router.patch(
      UpdateUnitRowController.url({ unit: unit.unitId }),
      {
        ...values,
        unitCoOwnerId: unit.unitCoOwnerId,
      },
      {
        preserveScroll: true,

        onSuccess: () => {
          form.reset(buildDefaultValues(unit));
          setOpen(false);
        },

        onError: (errors) => {
          for (const [field, message] of Object.entries(errors)) {
            if (field in values && typeof message === 'string') {
              form.setError(field as keyof UnitRowEditFormValues, {
                type: 'server',
                message,
              });
            }
          }
        },
      },
    );
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);

    if (next) {
      form.reset(buildDefaultValues(unit));
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon-sm">
            <Pencil />

            <span className="sr-only">Edit unit</span>
          </Button>
        }
      />

      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={form.handleSubmit(submitHandler)} noValidate>
          <DialogHeader>
            <DialogTitle>Edit unit</DialogTitle>

            <DialogDescription>
              Edit the details, co-owner and billing for unit {unit.unit}.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4">
            {/* Unit details */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-foreground">Unit details</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <Controller
                  name="label"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`unit-label-${unit.id}`}>
                        Unit label
                        <span className="text-destructive">*</span>
                      </FieldLabel>

                      <Input
                        {...field}
                        id={`unit-label-${unit.id}`}
                        aria-invalid={fieldState.invalid}
                        placeholder="A-101"
                      />

                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="type"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`unit-type-${unit.id}`}>Unit type</FieldLabel>

                      <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger
                          id={`unit-type-${unit.id}`}
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>

                        <SelectContent>
                          {unitTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="floor"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`unit-floor-${unit.id}`}>Floor</FieldLabel>

                      <Input
                        {...field}
                        id={`unit-floor-${unit.id}`}
                        aria-invalid={fieldState.invalid}
                        placeholder="Ground floor"
                      />

                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>
            </div>

            {/* Co-owner identity */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-foreground">Co-owner</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <Controller
                  name="coOwnerName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="sm:col-span-2">
                      <FieldLabel htmlFor={`owner-name-${unit.id}`}>
                        Owner name
                        <span className="text-destructive">*</span>
                      </FieldLabel>

                      <Input
                        {...field}
                        id={`owner-name-${unit.id}`}
                        aria-invalid={fieldState.invalid}
                        placeholder="e.g. John Doe"
                        autoComplete="name"
                      />

                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="coOwnerEmail"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`owner-email-${unit.id}`}>Email</FieldLabel>

                      <Input
                        {...field}
                        type="email"
                        id={`owner-email-${unit.id}`}
                        aria-invalid={fieldState.invalid}
                        placeholder="owner@email.com"
                        autoComplete="email"
                      />

                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="coOwnerPhone"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`owner-phone-${unit.id}`}>Phone</FieldLabel>

                      <Input
                        {...field}
                        type="tel"
                        id={`owner-phone-${unit.id}`}
                        aria-invalid={fieldState.invalid}
                        placeholder="+212 6XX XXX XXX"
                        autoComplete="tel"
                      />

                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>
            </div>

            {/* Billing */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-foreground">Billing</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <Controller
                  name="billingFrequency"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`billing-frequency-${unit.id}`}>
                        Billing frequency
                      </FieldLabel>

                      <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger
                          id={`billing-frequency-${unit.id}`}
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>

                        <SelectContent>
                          {BILLING_FREQUENCIES.map((frequency) => (
                            <SelectItem key={frequency} value={frequency}>
                              {BILLING_FREQUENCY_LABELS[frequency]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="weightCoefficient"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`weight-coefficient-${unit.id}`}>
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
                          id={`weight-coefficient-${unit.id}`}
                          type="number"
                          inputMode="decimal"
                          step={0.1}
                          min={0.1}
                          max={9.9}
                          placeholder="1.0"
                          aria-invalid={fieldState.invalid}
                          name={field.name}
                          ref={field.ref}
                          onBlur={field.onBlur}
                          value={field.value ?? ''}
                          onChange={(event) => {
                            const value = event.target.valueAsNumber;

                            field.onChange(Number.isNaN(value) ? undefined : value);
                          }}
                          className="pl-8"
                        />
                      </div>

                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>

              <p className="mt-2 text-sm text-muted-foreground">
                Enter a coefficient between 0.1 and 9.9.
              </p>
            </div>

            <div className="rounded-lg border bg-muted/40 p-4">
              <div className="mb-3 font-medium">Recalculated impact</div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Annual share</span>

                  <span className="font-medium text-foreground">{previewAnnual}</span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Monthly share</span>

                  <span className="font-medium text-foreground">{previewMonthly}</span>
                </div>
              </div>
            </div>
          </FieldGroup>

          <DialogFooter>
            <DialogClose
              render={
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              }
            />

            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Spinner data-icon="inline-start" />}

              {form.formState.isSubmitting ? 'Applying...' : 'Apply changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
