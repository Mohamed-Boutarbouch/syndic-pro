import { z } from 'zod';
import { insertPropertySchema } from './properties.js';
import { insertAnnualTargetBudgetSchema } from './annual-target-budgets.js';
import { insertUnitSchema } from './units.js';
import { insertCoOwnerSchema } from './co-owners.js';
import { insertUnitCoOwnerSchema } from './unit-co-owners.js';

// -----------------------------------------------------------------------------
// Property step
// -----------------------------------------------------------------------------
export const onboardingPropertySchema = insertPropertySchema.pick({
  name: true,
  address: true,
  city: true,
});

// -----------------------------------------------------------------------------
// Fiscal year step
// -----------------------------------------------------------------------------
export const onboardingFiscalYearSchema = insertAnnualTargetBudgetSchema
  .pick({
    startDate: true,
    endDate: true,
    totalBudget: true,
  })
  .extend({
    lockBudget: z.boolean().default(false),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: 'endDate must be after startDate',
    path: ['endDate'],
  });

// -----------------------------------------------------------------------------
// Unit step — clientId is a client-generated temp key, only used to link
// co-owners to units within this payload. It never touches the units table.
// -----------------------------------------------------------------------------
export const onboardingUnitSchema = insertUnitSchema
  .pick({
    unitLabel: true,
    type: true,
    floor: true,
    weightCoefficient: true,
  })
  .extend({
    clientId: z.string().min(1),
  });

export const onboardingUnitsSchema = z
  .array(onboardingUnitSchema)
  .min(1, 'Add at least one unit')
  .max(50, 'You can add up to 50 units')
  .superRefine((units, ctx) => {
    const seen = new Set<string>();
    units.forEach((u, i) => {
      if (seen.has(u.clientId)) {
        ctx.addIssue({
          code: 'custom',
          path: [i, 'clientId'],
          message: 'Duplicate clientId in units array',
        });
      }
      seen.add(u.clientId);
    });
  });

// -----------------------------------------------------------------------------
// Co-owner step — linked back to a unit via unitClientId
// -----------------------------------------------------------------------------
export const onboardingCoOwnerSchema = insertCoOwnerSchema
  .pick({
    name: true,
    email: true,
    phone: true,
  })
  .extend({
    unitClientId: z.string().min(1),
    ownershipPercentage: insertUnitCoOwnerSchema.shape.ownershipPercentage,
    billingFrequency: insertUnitCoOwnerSchema.shape.billingFrequency,
    designatedSyndic: z.boolean().default(false),
  });

export const onboardingCoOwnersSchema = z
  .array(onboardingCoOwnerSchema)
  .min(1, 'Add at least one co-owner')
  .superRefine((coOwners, ctx) => {
    const syndicCount = coOwners.filter((c) => c.designatedSyndic).length;
    if (syndicCount > 1) {
      ctx.addIssue({
        code: 'custom',
        message: 'Only one co-owner can be designated as syndic',
      });
    }
  });

// -----------------------------------------------------------------------------
// Master payload — cross-step referential checks live here, where both
// arrays are visible together
// -----------------------------------------------------------------------------
export const onboardingPayloadSchema = z
  .object({
    property: onboardingPropertySchema,
    fiscalYear: onboardingFiscalYearSchema,
    units: onboardingUnitsSchema,
    coOwners: onboardingCoOwnersSchema,
  })
  .superRefine((data, ctx) => {
    const unitClientIds = new Set(data.units.map((u) => u.clientId));

    data.coOwners.forEach((co, i) => {
      if (!unitClientIds.has(co.unitClientId)) {
        ctx.addIssue({
          code: 'custom',
          path: ['coOwners', i, 'unitClientId'],
          message: `unitClientId "${co.unitClientId}" does not match any unit in this payload`,
        });
      }
    });

    const coveredUnits = new Set(data.coOwners.map((c) => c.unitClientId));
    data.units.forEach((u, i) => {
      if (!coveredUnits.has(u.clientId)) {
        ctx.addIssue({
          code: 'custom',
          path: ['units', i],
          message: `Unit "${u.unitLabel}" has no co-owner assigned`,
        });
      }
    });
  });

export type OnboardingPayload = z.infer<typeof onboardingPayloadSchema>;
export type OnboardingUnit = z.infer<typeof onboardingUnitSchema>;
export type OnboardingCoOwner = z.infer<typeof onboardingCoOwnerSchema>;
