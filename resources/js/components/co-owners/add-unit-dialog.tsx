import { valibotResolver } from '@hookform/resolvers/valibot';
import { router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as v from 'valibot';

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
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from '@/hooks/use-translation';

type AddUnitDialogProps = {
  propertyId: number;
};

const UNIT_TYPES = ['residential', 'commercial', 'storage', 'other'] as const;

const unitSchema = v.object({
  label: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, 'Unit label is required.'),
    v.maxLength(30, 'Unit label must be 30 characters or fewer.'),
  ),
  floor: v.optional(
    v.pipe(v.string(), v.trim(), v.maxLength(30, 'Floor must be 30 characters or fewer.')),
  ),
  type: v.picklist(UNIT_TYPES, 'Select a unit type.'),
  weight_coefficient: v.pipe(
    v.number('Coefficient must be a number.'),
    v.minValue(0.1, 'Coefficient must be at least 0.1.'),
    v.maxValue(9.9, 'Coefficient must be 9.9 or less.'),
  ),
  is_active: v.optional(v.boolean()),
});

type UnitFormValues = v.InferOutput<typeof unitSchema>;

const FORM_ID = 'add-unit-form';

export function AddUnitDialog({ propertyId }: AddUnitDialogProps) {
  const { t, isRtl } = useTranslation('properties.co_owners.add_unit_dialog');
  const [open, setOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const form = useForm<UnitFormValues>({
    resolver: valibotResolver(unitSchema),
    defaultValues: {
      label: '',
      floor: '',
      type: 'residential',
      weight_coefficient: undefined,
      is_active: false,
    },
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);

    if (!next) {
      form.reset();
    }
  }

  function onSubmit(values: UnitFormValues) {
    setProcessing(true);

    router.post(`/properties/${propertyId}/units`, values, {
      preserveScroll: true,
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
      // Surface backend (Laravel FormRequest) validation errors on the
      // matching RHF fields, so server-side rules beyond the valibot
      // schema (e.g. uniqueness) still show up per-field.
      onError: (errors) => {
        Object.entries(errors).forEach(([field, message]) => {
          form.setError(field as keyof UnitFormValues, {
            type: 'server',
            message: message as string,
          });
        });
      },
      onFinish: () => setProcessing(false),
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button variant="outline">
            <Plus data-icon="inline-start" />
            {t('trigger_button')}
            {/*Add Unit*/}
          </Button>
        }
      />

      <DialogContent className="sm:max-w-sm" dir={isRtl ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <form id={FORM_ID} onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="label"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>{t('label_field')}</FieldLabel>

                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder={t('label_placeholder')}
                    autoComplete="off"
                  />

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="floor"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>{t('floor_field')}</FieldLabel>

                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder={t('floor_placeholder')}
                    autoComplete="off"
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
                  <FieldLabel htmlFor={field.name}>{t('type_field')}</FieldLabel>

                  <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {UNIT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {t(`unit_types.${type}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="weight_coefficient"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>{t('coefficient_field')}</FieldLabel>
                    <FieldDescription>{t('coefficient_hint')}</FieldDescription>
                  </FieldContent>

                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="9.9"
                    value={field.value ?? ''}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    aria-invalid={fieldState.invalid}
                    onChange={(event) => {
                      field.onChange(
                        event.target.value === '' ? undefined : event.target.valueAsNumber,
                      );
                    }}
                  />

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose render={<Button variant="outline">{t('cancel_button')}</Button>} />

          <Button type="submit" form={FORM_ID} disabled={processing}>
            {processing ? t('adding_button') : t('add_button')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
