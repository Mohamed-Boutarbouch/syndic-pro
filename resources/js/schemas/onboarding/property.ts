import * as v from 'valibot';

export const propertySchema = v.object({
  name: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('Property name is required'),
    v.maxLength(200, 'Property name must be 200 characters or fewer'),
  ),

  address: v.optional(v.pipe(v.string(), v.trim())),

  city: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('City is required'),
    v.maxLength(100, 'City must be 100 characters or fewer'),
  ),

  postal_code: v.optional(
    v.pipe(v.string(), v.trim(), v.maxLength(20, 'Postal code must be 20 characters or fewer')),
  ),
});

export type PropertyFormValues = v.InferOutput<typeof propertySchema>;

export const propertyDefaultValues: PropertyFormValues = {
  name: '',
  address: '',
  city: '',
  postal_code: '',
};
