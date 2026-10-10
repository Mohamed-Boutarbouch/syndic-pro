import { valibotResolver } from '@hookform/resolvers/valibot';
import { router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as v from 'valibot';

import store from '@/actions/App/Http/Controllers/Billing/StoreCoPayerController';
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
import { useTranslation } from '@/hooks/use-translation';

const schema = v.object({
  name: v.pipe(v.string(), v.trim(), v.minLength(1, 'add_dialog.errors.name_required')),
  email: v.pipe(v.string(), v.trim(), v.email('add_dialog.errors.email_invalid')),
  sharePercentage: v.pipe(
    v.number('add_dialog.errors.share_invalid'),
    v.minValue(1, 'add_dialog.errors.share_invalid'),
    v.maxValue(99, 'add_dialog.errors.share_invalid'),
  ),
});

type FormValues = v.InferInput<typeof schema>;

type Props = {
  unitCoOwnerId: number;
  name: string;
  quota: number;
};

export function AddCoPayerDialog({ unitCoOwnerId, name, quota }: Props) {
  const { t, money } = useTranslation('properties.billing.household');
  const [open, setOpen] = useState(false);

  const { control, handleSubmit, reset, setError, formState } = useForm<FormValues>({
    resolver: valibotResolver(schema),
    defaultValues: { name: '', email: '', sharePercentage: 50 },
  });

  function onSubmit(values: FormValues) {
    router.post(
      store.url({ unitCoOwner: unitCoOwnerId }),
      {
        name: values.name,
        email: values.email,
        share_percentage: values.sharePercentage,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          reset();
          setOpen(false);
        },
        onError: (errors) => {
          if (errors.name) {
            return setError('name', { message: errors.name });
          }

          if (errors.email) {
            return setError('email', { message: errors.email });
          }

          if (errors.share_percentage) {
            setError('sharePercentage', { message: errors.share_percentage });
          }
        },
      },
    );
  }

  const errorsOf = (message?: string) => (message ? [{ message: t(message) }] : []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline">
            <Plus data-icon="inline-start" />
            {t('add_button')}
          </Button>
        }
      />

      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogHeader>
            <DialogTitle>{t('add_dialog.title')}</DialogTitle>
            <DialogDescription>
              {t('add_dialog.description', { name, quota: money(quota) })}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4">
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="co-payer-name">{t('add_dialog.full_name_label')}</FieldLabel>
                  <Input
                    {...field}
                    id="co-payer-name"
                    aria-invalid={fieldState.invalid}
                    placeholder={t('add_dialog.full_name_placeholder')}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={errorsOf(fieldState.error?.message)} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="co-payer-email">{t('add_dialog.email_label')}</FieldLabel>
                  <Input
                    {...field}
                    id="co-payer-email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder={t('add_dialog.email_placeholder')}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={errorsOf(fieldState.error?.message)} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="sharePercentage"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="co-payer-share">
                    {t('add_dialog.quota_share_label')}
                  </FieldLabel>
                  <Input
                    id="co-payer-share"
                    type="number"
                    step="1"
                    min={1}
                    max={99}
                    aria-invalid={fieldState.invalid}
                    value={field.value ?? ''}
                    onBlur={field.onBlur}
                    onChange={(e) =>
                      field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
                    }
                  />
                  {fieldState.invalid && (
                    <FieldError errors={errorsOf(fieldState.error?.message)} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter>
            <DialogClose
              render={
                <Button type="button" variant="outline">
                  {t('add_dialog.cancel_button')}
                </Button>
              }
            />
            <Button type="submit" disabled={formState.isSubmitting}>
              {t('add_dialog.add_button')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
