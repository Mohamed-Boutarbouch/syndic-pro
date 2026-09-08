import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';

import { UnitForm } from '@/components/onboarding/unit-form';
import OnboardingLayout from '@/layouts/onboarding/layout';

export type UnitPageProps = {
  property: {
    id: number;
    name: string;
  };

  budget: {
    id: number;
    start_date: string;
    end_date: string;
    total_budget: number;
  };

  unitTypes: {
    value: string;
    label: string;
  }[];

  maxUnits: number;
};

export default function UnitPage({ property, budget, unitTypes, maxUnits }: UnitPageProps) {
  return (
    <>
      <Head title="Onboarding — Units" />

      <UnitForm property={property} budget={budget} unitTypes={unitTypes} maxUnits={maxUnits} />
    </>
  );
}

UnitPage.layout = (page: ReactNode) => <OnboardingLayout>{page}</OnboardingLayout>;
