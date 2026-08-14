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
// Shared schemas
// -----------------------------------------------------------------------------

export const unitTypeSchema = z.enum(UNIT_TYPES);
export const billingFrequencySchema = z.enum(BILLING_FREQUENCIES);

const fiscalDateSchema = z.iso.date('Enter a valid date');

const requiredString = (label: string, min: number, max = 80) =>
  z
    .string()
    .trim()
    .min(min, `${label} must be at least ${min} characters`)
    .max(max, `${label} must be at most ${max} characters`);

const optionalString = (label: string, max = 80) =>
  z
    .string()
    .trim()
    .max(max, `${label} must be at most ${max} characters`)
    .optional();

// -----------------------------------------------------------------------------
// Master onboarding schema
// -----------------------------------------------------------------------------

export const onboardingSyndicSchema = z.object({
  // Property
  propertyName: requiredString('Property name', 3),
  propertyAddress: optionalString('Address'),
  propertyCity: requiredString('City', 3),

  // Fiscal year
  fiscalYearStart: fiscalDateSchema,
  fiscalYearEnd: fiscalDateSchema,

  annualTargetBudget: z
    .number()
    .min(50, 'Annual target budget must be at least 50'),

  lockBudget: z.boolean(),

  // Unit
  unitLabel: requiredString('Unit label', 1),
  unitType: unitTypeSchema,
  unitFloor: requiredString('Floor', 1).optional().or(z.literal('')),

  weightCoefficient: z
    .number()
    .positive('Weight coefficient must be greater than 0'),

  // Co-owner
  coOwnerName: requiredString('Name', 3),
  coOwnerEmail: z
    .email('Enter a valid email address')
    .optional()
    .or(z.literal('')),
  coOwnerPhone: optionalString('Phone number', 15),
  billingFrequency: billingFrequencySchema,
  designatedSyndic: z.boolean(),
});

// -----------------------------------------------------------------------------
// Step schemas
// -----------------------------------------------------------------------------

export const onboardingPropertySchema = onboardingSyndicSchema.pick({
  propertyName: true,
  propertyAddress: true,
  propertyCity: true,
});

export const onboardingFiscalYearSchema = onboardingSyndicSchema
  .pick({
    fiscalYearStart: true,
    fiscalYearEnd: true,
    annualTargetBudget: true,
    lockBudget: true,
  })
  .refine((data) => data.fiscalYearEnd >= data.fiscalYearStart, {
    path: ['fiscalYearEnd'],
    message: 'End of fiscal year must be after the start date',
  });

export const onboardingUnitSchema = onboardingSyndicSchema.pick({
  unitLabel: true,
  unitType: true,
  unitFloor: true,
  weightCoefficient: true,
});

export const onboardingCoOwnerSchema = onboardingSyndicSchema.pick({
  coOwnerName: true,
  coOwnerEmail: true,
  coOwnerPhone: true,
  billingFrequency: true,
  designatedSyndic: true,
});

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type OnboardingSyndicSchema = z.infer<typeof onboardingSyndicSchema>;

export type OnboardingProperty = z.infer<typeof onboardingPropertySchema>;

export type OnboardingFiscalYear = z.infer<typeof onboardingFiscalYearSchema>;

export type OnboardingUnit = z.infer<typeof onboardingUnitSchema>;

export type OnboardingCoOwner = z.infer<typeof onboardingCoOwnerSchema>;
