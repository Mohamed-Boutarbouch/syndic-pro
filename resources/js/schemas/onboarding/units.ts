import * as v from 'valibot';

type T = (key: string, params?: Record<string, string | number>) => string;

export const createUnitSchema = (t: T) =>
  v.object({
    label: v.pipe(
      v.string(),
      v.nonEmpty(t('onboarding.validation.units.label_required')),
      v.maxLength(30, t('onboarding.validation.units.label_max')),
    ),
    floor: v.pipe(v.string(), v.maxLength(30)),
    type: v.picklist(['residential', 'commercial', 'storage', 'other']),
    weight_coefficient: v.pipe(
      v.number(t('onboarding.validation.units.weight_required')),
      v.minValue(0, t('onboarding.validation.units.weight_min')),
      v.maxValue(10, t('onboarding.validation.units.weight_max')),
      v.check(
        (value) => Math.round(value * 10) === value * 10,
        t('onboarding.validation.units.weight_decimals'),
      ),
    ),
    is_active: v.boolean(),
  });

export const createUnitsSchema = (t: T) =>
  v.pipe(
    v.object({
      units: v.pipe(
        v.array(createUnitSchema(t)),
        v.minLength(1, t('onboarding.validation.units.min_one')),
      ),
    }),
    v.forward(
      v.check(({ units }) => {
        const labels = units.map((unit) => unit.label.trim().toLowerCase());

        return new Set(labels).size === labels.length;
      }, t('onboarding.validation.units.unique')),
      ['units'],
    ),
  );

export type UnitFormValues = v.InferInput<ReturnType<typeof createUnitSchema>>;
export type UnitFormOutputValues = v.InferOutput<ReturnType<typeof createUnitSchema>>;
export type UnitsFormValues = v.InferInput<ReturnType<typeof createUnitsSchema>>;
export type UnitsFormOutputValues = v.InferOutput<ReturnType<typeof createUnitsSchema>>;

export function createEmptyUnit(): UnitFormValues {
  return { label: '', floor: '', type: 'residential', weight_coefficient: 1, is_active: true };
}
