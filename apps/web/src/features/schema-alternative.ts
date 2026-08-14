import { z } from 'zod';

export const monthSchema = z.enum([
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]);

export const unitTypeSchema = z.enum(['Apartment', 'Commercial', 'Storage']);

export const billingFrequencySchema = z.enum([
  'Monthly',
  'Bimonthly',
  'Quarterly',
  'Semi-Annual',
]);

const propertySchema = z.object({
  propertyName: z.string().trim().min(3).max(80),
  propertyAddress: z.string().trim().max(80).optional(),
  propertyCity: z.string().trim().min(3).max(80),
});

const fiscalYearSchema = z.object({
  startMonth: monthSchema,
  endMonth: monthSchema,
  startYear: z.string().regex(/^\d{4}$/),
  endYear: z.string().regex(/^\d{4}$/),
  annualTargetBudget: z.number().min(50),
  lockBudget: z.boolean(),
});

const unitSchema = z.object({
  unitLabel: z.string().trim().min(1).max(80),
  unitType: unitTypeSchema,
  floor: z.string().trim().min(1).max(80),
  weightCoefficient: z.number().min(50),
});

const coOwnerSchema = z.object({
  coOwnerName: z.string().trim().min(3).max(80),
  coOwnerEmail: z.email(),
  coOwnerPhone: z.string().trim().max(15).optional(),
  billingFrequency: billingFrequencySchema,
  designatedSyndic: z.boolean(),
});

export const onboardingSyndicFormSchema = propertySchema
  .extend(fiscalYearSchema.shape)
  .extend(unitSchema.shape)
  .extend(coOwnerSchema.shape);

export type OnboardingSyndicForm = z.infer<typeof onboardingSyndicFormSchema>;
