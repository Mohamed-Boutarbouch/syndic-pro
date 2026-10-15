import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';

import { CoOwnerForm } from '@/components/onboarding/co-owner-form';
import { useTranslation } from '@/hooks/use-translation';
import OnboardingLayout from '@/layouts/onboarding/layout';

export type CoOwnerPageProps = {
  property: {
    id: string;
    name: string;
  };

  budget: number;

  units: {
    id: number;
    property_id: string;
    label: string;
    floor: number;
    type: string;
    weight_coefficient: number;
    calculated_annual_budget: number;
    is_active: boolean;
  }[];

  billingFrequency: {
    value: string;
    label: string;
  }[];
};

export default function CoOwnerPage({
  property,
  budget,
  units,
  billingFrequency,
}: CoOwnerPageProps) {
  const { t } = useTranslation();

  return (
    <>
      <Head title={t('onboarding.head.co_owners')} />

      <CoOwnerForm
        property={property}
        budget={budget}
        units={units}
        billingFrequency={billingFrequency}
      />
    </>
  );
}

CoOwnerPage.layout = (page: ReactNode) => <OnboardingLayout>{page}</OnboardingLayout>;
