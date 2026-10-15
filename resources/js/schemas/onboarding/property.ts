import * as v from 'valibot';

type T = (key: string, params?: Record<string, string | number>) => string;

export const createPropertySchema = (t: T) =>
  v.object({
    name: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty(t('validation.property.name_required')),
      v.maxLength(200, t('validation.property.name_max')),
    ),
    address: v.optional(v.pipe(v.string(), v.trim())),
    city: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty(t('validation.property.city_required')),
      v.maxLength(100, t('validation.property.city_max')),
    ),
    postal_code: v.optional(
      v.pipe(v.string(), v.trim(), v.maxLength(20, t('validation.property.postal_max'))),
    ),
  });

export type PropertyFormValues = v.InferOutput<ReturnType<typeof createPropertySchema>>;

export const propertyDefaultValues: PropertyFormValues = {
  name: '',
  address: '',
  city: '',
  postal_code: '',
};
