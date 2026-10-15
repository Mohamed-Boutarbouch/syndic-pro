import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';

import { UnitForm } from '@/components/onboarding/unit-form';
import { useTranslation } from '@/hooks/use-translation';
import OnboardingLayout from '@/layouts/onboarding/layout';

export type UnitPageProps = {
  property: {
    id: string;
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
  const { t } = useTranslation();

  return (
    <>
      <Head title={t('onboarding.head.units')} />

      <UnitForm property={property} budget={budget} unitTypes={unitTypes} maxUnits={maxUnits} />
    </>
  );
}

UnitPage.layout = (page: ReactNode) => <OnboardingLayout>{page}</OnboardingLayout>;
