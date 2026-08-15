import { z } from 'zod';

// -----------------------------------------------------------------------------
// Shared values
// -----------------------------------------------------------------------------
export const UNIT_TYPES = ['Apartment', 'Commercial', 'Storage'] as const;
export const BILLING_FREQUENCIES = [
  'Monthly',
  'Bimonthly',
  'Quarterly',
  'Semi-Annual',
] as const;

// -----------------------------------------------------------------------------
// Shared schemas / helpers
// -----------------------------------------------------------------------------
export const unitTypeSchema = z.enum(UNIT_TYPES);
export const billingFrequencySchema = z.enum(BILLING_FREQUENCIES);

const fiscalDateSchema = z.iso.date('Enter a valid date');

function requiredString(label: string, min: number, max = 80) {
  return z
    .string()
    .trim()
    .min(min, `${label} must be at least ${min} characters`)
    .max(max, `${label} must be at most ${max} characters`);
}

function optionalString(label: string, max = 80) {
  return z
    .string()
    .trim()
    .max(max, `${label} must be at most ${max} characters`)
    .optional();
}

// -----------------------------------------------------------------------------
// Step schemas (each standalone — source of truth for its step)
// -----------------------------------------------------------------------------

// Property -------------------------------------------------------------------
export const propertySchema = z.object({
  propertyName: requiredString('Property name', 3),
  propertyAddress: optionalString('Address'),
  propertyCity: requiredString('City', 3),
});

// Fiscal year ------------------------------------------------------------------
const fiscalYearBaseSchema = z.object({
  fiscalYearStart: fiscalDateSchema,
  fiscalYearEnd: fiscalDateSchema,
  annualTargetBudget: z
    .number()
    .min(50, 'Annual target budget must be at least 50'),
  lockBudget: z.boolean(),
});

export const fiscalYearSchema = fiscalYearBaseSchema.superRefine(
  (data, ctx) => {
    if (data.fiscalYearEnd <= data.fiscalYearStart) {
      ctx.addIssue({
        code: 'custom',
        path: ['fiscalYearEnd'],
        message: 'End of fiscal year must be after the start date',
      });
    }
  },
);

// Unit (single item) + Units (array step) ---------------------------------------
export const unitItemSchema = z.object({
  unitLabel: requiredString('Unit label', 1),
  unitType: unitTypeSchema,
  unitFloor: optionalString('Floor', 10),
  weightCoefficient: z
    .number()
    .optional()
    .refine((val) => val !== undefined && val > 0, {
      message: 'Weight coefficient is required and must be greater than 0',
    }),
});

export const unitsSchema = z.object({
  units: z
    .array(unitItemSchema)
    .min(1, 'Add at least one unit')
    .max(50, 'You can add up to 50 units'),
});

// Co-owner ---------------------------------------------------------------------
export const coOwnerSchema = z.object({
  coOwnerName: requiredString('Name', 3),
  coOwnerEmail: optionalString('Email', 100),
  coOwnerPhone: optionalString('Phone number', 15),
  billingFrequency: billingFrequencySchema,
  designatedSyndic: z.boolean(),
});

// -----------------------------------------------------------------------------
// Master onboarding schema (composed from step schemas)
// -----------------------------------------------------------------------------
export const onboardingSyndicFormSchema = propertySchema
  .extend(fiscalYearBaseSchema.shape)
  .extend(unitsSchema.shape)
  .extend(coOwnerSchema.shape);

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
export type OnboardingSyndicFormSchema = z.infer<
  typeof onboardingSyndicFormSchema
>;
export type OnboardingProperty = z.infer<typeof propertySchema>;
export type OnboardingFiscalYear = z.infer<typeof fiscalYearSchema>;
export type UnitItem = z.infer<typeof unitItemSchema>;
export type OnboardingUnits = z.infer<typeof unitsSchema>;
export type OnboardingCoOwner = z.infer<typeof coOwnerSchema>;
