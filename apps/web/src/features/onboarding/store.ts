import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  OnboardingCoOwner,
  OnboardingFiscalYear,
  OnboardingProperty,
  UnitItem,
} from './schema';

interface OnboardingState {
  property?: OnboardingProperty;
  fiscalYear?: OnboardingFiscalYear;
  units: UnitItem[];
  coOwners: OnboardingCoOwner[];
  _hasHydrated: boolean;
  setProperty: (data: OnboardingProperty) => void;
  setFiscalYear: (data: OnboardingFiscalYear) => void;
  setUnits: (data: UnitItem[]) => void;
  setCoOwners: (data: OnboardingCoOwner[]) => void;
  setHasHydrated: (state: boolean) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      units: [],
      coOwners: [],
      _hasHydrated: false,
      setProperty: (data) => set({ property: data }),
      setFiscalYear: (data) => set({ fiscalYear: data }),
      setUnits: (data) => set({ units: data }),
      setCoOwners: (data) => set({ coOwners: data }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      reset: () =>
        set({
          property: undefined,
          fiscalYear: undefined,
          units: [],
          coOwners: [],
        }),
    }),
    {
      name: 'syndicpro-onboarding',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
