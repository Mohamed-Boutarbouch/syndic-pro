import { z } from 'zod';
import {
  createUnitSchema,
  updateUnitSchema,
  unitResponseSchema,
  onboardingUnitSchema,
  onboardingUnitsFormSchema,
} from '@syndic-pro/validators';

export type CreateUnit = z.infer<typeof createUnitSchema>;
export type UpdateUnit = z.infer<typeof updateUnitSchema>;
export type UnitResponse = z.infer<typeof unitResponseSchema>;

export type OnboardingUnit = z.infer<typeof onboardingUnitSchema>;

export type OnboardingUnitsFormInput = z.input<
  typeof onboardingUnitsFormSchema
>;
export type OnboardingUnitsFormOutput = z.output<
  typeof onboardingUnitsFormSchema
>;
