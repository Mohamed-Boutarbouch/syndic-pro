import { valibotResolver } from '@hookform/resolvers/valibot';
import { router } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { store } from '@/actions/App/Http/Controllers/Onboarding/PropertyController';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/use-translation';
import type { PropertyFormValues } from '@/schemas/onboarding/property';
import { createPropertySchema, propertyDefaultValues } from '@/schemas/onboarding/property';

export function PropertyForm() {
  const { t } = useTranslation('onboarding');
  const schema = useMemo(() => createPropertySchema(t), [t]);
  const form = useForm<PropertyFormValues>({
    resolver: valibotResolver(schema),
    defaultValues: propertyDefaultValues,
    mode: 'onBlur',
  });

  function submitHandler(values: PropertyFormValues) {
    router.post(store.url(), values, {
      preserveScroll: true,

      onError: (errors) => {
        for (const [field, message] of Object.entries(errors)) {
          if (field in values && typeof message === 'string') {
            form.setError(field as keyof PropertyFormValues, {
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
        <CardTitle>{t('property.title')}</CardTitle>
        <CardDescription>{t('property.description')}</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="onboarding-property-form"
          onSubmit={form.handleSubmit(submitHandler)}
          noValidate
          className="space-y-6"
        >
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="property-name">
                    {t('property.name')}
                    <span className="text-destructive">*</span>
                  </FieldLabel>

                  <Input
                    {...field}
                    id="property-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Résidence Al Manar"
                    autoComplete="organization"
                  />

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="address"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="property-address">{t('property.address')}</FieldLabel>

                  <Textarea
                    {...field}
                    id="property-address"
                    aria-invalid={fieldState.invalid}
                    placeholder={t('property.address_placeholder')}
                    rows={3}
                    className="resize-none"
                    autoComplete="street-address"
                  />

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Controller
                name="city"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="property-city">
                      {t('property.city')}
                      <span className="text-destructive">*</span>
                    </FieldLabel>

                    <Input
                      {...field}
                      id="property-city"
                      aria-invalid={fieldState.invalid}
                      placeholder="Fès"
                      autoComplete="address-level2"
                    />

                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="postal_code"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="property-postal-code">
                      {t('property.postal_code')}
                    </FieldLabel>

                    <Input
                      {...field}
                      id="property-postal-code"
                      aria-invalid={fieldState.invalid}
                      placeholder="30000"
                      inputMode="numeric"
                      autoComplete="postal-code"
                    />

                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>

          <div className="flex justify-end">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Spinner data-icon="inline-start" />}
              {t('continue')}
              {!form.formState.isSubmitting && <ArrowRight data-icon="inline-end" />}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
