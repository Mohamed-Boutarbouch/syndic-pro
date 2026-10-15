import * as v from 'valibot';

type T = (key: string, params?: Record<string, string | number>) => string;

export const createCoOwnerSchema = (t: T) =>
  v.object({
    unitId: v.number(),
    name: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty(t('onboarding.validation.co_owners.name_required')),
      v.maxLength(255, t('onboarding.validation.co_owners.name_max')),
    ),
    email: v.pipe(
      v.string(),
      v.trim(),
      v.maxLength(255, t('onboarding.validation.co_owners.email_max')),
      v.check(
        (value) => value === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        t('onboarding.validation.co_owners.email_invalid'),
      ),
    ),
    phone: v.pipe(
      v.string(),
      v.trim(),
      v.maxLength(255, t('onboarding.validation.co_owners.phone_max')),
    ),
    billing_frequency: v.pipe(
      v.string(),
      v.nonEmpty(t('onboarding.validation.co_owners.billing_required')),
    ),
    is_active: v.boolean(),
  });

export const createCoOwnersSchema = (t: T) =>
  v.object({
    coOwners: v.pipe(
      v.array(createCoOwnerSchema(t)),
      v.minLength(1, t('onboarding.validation.co_owners.min_one')),
    ),
    syndicUnitId: v.number(t('onboarding.validation.co_owners.syndic_required')),
  });

export type CoOwnerFormValues = v.InferInput<ReturnType<typeof createCoOwnersSchema>>;
export type CoOwnerFormOutputValues = v.InferOutput<ReturnType<typeof createCoOwnersSchema>>;

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
