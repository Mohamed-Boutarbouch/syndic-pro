import * as v from 'valibot';

export const unitSchema = v.object({
  label: v.pipe(v.string(), v.nonEmpty('Unit label is required'), v.maxLength(30)),
  floor: v.pipe(v.string(), v.maxLength(30)),
  type: v.picklist(['residential', 'commercial', 'storage', 'other']),
  weight_coefficient: v.pipe(
    v.number('Weight coefficient is required'),
    v.minValue(0, 'Weight coefficient cannot be negative'),
    v.maxValue(10, 'Weight coefficient must be at most 10'),
    v.check(
      (value) => Math.round(value * 10) === value * 10,
      'Weight coefficient must have at most 1 decimal place',
    ),
  ),
  is_active: v.boolean(),
});

export const unitsSchema = v.pipe(
  v.object({
    units: v.pipe(v.array(unitSchema), v.minLength(1, 'At least one unit is required')),
  }),
  v.forward(
    v.check(({ units }) => {
      const labels = units.map((unit) => unit.label.trim().toLowerCase());

      return new Set(labels).size === labels.length;
    }, 'Unit labels must be unique within this property'),
    ['units'],
  ),
);

export type UnitFormValues = v.InferInput<typeof unitSchema>;
export type UnitFormOutputValues = v.InferOutput<typeof unitSchema>;
export type UnitsFormValues = v.InferInput<typeof unitsSchema>;
export type UnitsFormOutputValues = v.InferOutput<typeof unitsSchema>;

export function createEmptyUnit(): UnitFormValues {
  return {
    label: '',
    floor: '',
    type: 'residential',
    weight_coefficient: 1,
    is_active: true,
  };
}
