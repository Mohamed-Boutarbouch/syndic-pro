import { z } from 'zod';

// -----------------------------------------------------------------------------
// Shared values
// -----------------------------------------------------------------------------

export const months = [
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
] as const;

export const unitTypes = ['Apartment', 'Commercial', 'Storage'] as const;

export const billingFrequencies = [
  'Monthly',
  'Bimonthly',
  'Quarterly',
  'Semi-Annual',
] as const;

// -----------------------------------------------------------------------------
// Shared schemas
// -----------------------------------------------------------------------------

export const monthSchema = z.enum(months);

export const unitTypeSchema = z.enum(unitTypes);

export const billingFrequencySchema = z.enum(billingFrequencies);

// -----------------------------------------------------------------------------
// Onboarding schema
// -----------------------------------------------------------------------------

export const onboardingSyndicSchema = z.object({
  // ---------------------------------------------------------------------------
  // Property
  // ---------------------------------------------------------------------------

  propertyName: z
    .string()
    .trim()
    .min(3, 'Property name must be at least 3 characters')
    .max(80, 'Property name must be at most 80 characters'),

  propertyAddress: z
    .string()
    .trim()
    .max(80, 'Address must be at most 80 characters')
    .optional(),

  propertyCity: z
    .string()
    .trim()
    .min(3, 'City must be at least 3 characters')
    .max(80, 'City must be at most 80 characters'),

  // ---------------------------------------------------------------------------
  // Fiscal year
  // ---------------------------------------------------------------------------

  startMonth: monthSchema,

  endMonth: monthSchema,

  startYear: z.string().regex(/^\d{4}$/, 'Enter a valid 4-digit year'),

  endYear: z.string().regex(/^\d{4}$/, 'Enter a valid 4-digit year'),

  annualTargetBudget: z
    .number()
    .min(50, 'Annual target budget must be at least 50'),

  lockBudget: z.boolean(),

  // ---------------------------------------------------------------------------
  // Unit
  // ---------------------------------------------------------------------------

  unitLabel: z
    .string()
    .trim()
    .min(1, 'Unit label is required')
    .max(80, 'Unit label must be at most 80 characters'),

  unitType: unitTypeSchema,

  floor: z
    .string()
    .trim()
    .min(1, 'Floor is required')
    .max(80, 'Floor must be at most 80 characters'),

  weightCoefficient: z
    .number()
    .min(50, 'Weight coefficient must be at least 50'),

  // ---------------------------------------------------------------------------
  // Co-owner
  // ---------------------------------------------------------------------------

  coOwnerName: z
    .string()
    .trim()
    .min(3, 'Name must be at least 3 characters')
    .max(80, 'Name must be at most 80 characters'),

  coOwnerEmail: z.email('Enter a valid email address'),

  coOwnerPhone: z
    .string()
    .trim()
    .max(15, 'Phone number must be at most 15 characters')
    .optional(),

  billingFrequency: billingFrequencySchema,

  designatedSyndic: z.boolean(),
});

// -----------------------------------------------------------------------------
// Full form type
// -----------------------------------------------------------------------------

export type OnboardingSyndicSchema = z.infer<typeof onboardingSyndicSchema>;

// -----------------------------------------------------------------------------
// Step schemas
// -----------------------------------------------------------------------------

export const onboardingPropertySchema = onboardingSyndicSchema.pick({
  propertyName: true,
  propertyAddress: true,
  propertyCity: true,
});

export const onboardingFiscalYearSchema = onboardingSyndicSchema.pick({
  startMonth: true,
  endMonth: true,
  startYear: true,
  endYear: true,
  annualTargetBudget: true,
  lockBudget: true,
});

export const onboardingUnitSchema = onboardingSyndicSchema.pick({
  unitLabel: true,
  unitType: true,
  floor: true,
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
// Step types
// -----------------------------------------------------------------------------

export type OnboardingProperty = z.infer<typeof onboardingPropertySchema>;

export type OnboardingFiscalYear = z.infer<typeof onboardingFiscalYearSchema>;

export type OnboardingUnit = z.infer<typeof onboardingUnitSchema>;

export type OnboardingCoOwner = z.infer<typeof onboardingCoOwnerSchema>;
