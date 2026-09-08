import * as v from 'valibot';

export const coOwnerSchema = v.object({
  unitId: v.number(),
  name: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('Co-owner name is required'),
    v.maxLength(255, 'Co-owner name must not exceed 255 characters'),
  ),
  email: v.pipe(
    v.string(),
    v.trim(),
    v.maxLength(255, 'Email must not exceed 255 characters'),
    v.check(
      (value) => value === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      'Please enter a valid email address',
    ),
  ),
  phone: v.pipe(
    v.string(),
    v.trim(),
    v.maxLength(255, 'Phone number must not exceed 255 characters'),
  ),
  billing_frequency: v.pipe(v.string(), v.nonEmpty('Billing frequency is required')),
  is_active: v.boolean(),
});

export const coOwnersSchema = v.object({
  coOwners: v.pipe(v.array(coOwnerSchema), v.minLength(1, 'At least one co-owner is required')),
  syndicUnitId: v.number('Please designate one co-owner as syndic'),
});

export type CoOwnerFormValues = v.InferInput<typeof coOwnersSchema>;
export type CoOwnerFormOutputValues = v.InferOutput<typeof coOwnersSchema>;

export function createEmptyCoOwner(unit: { id: number }): CoOwnerFormValues['coOwners'][number] {
  return {
    unitId: unit.id,
    name: '',
    email: '',
    phone: '',
    billing_frequency: 'monthly',
    is_active: true,
  };
}
