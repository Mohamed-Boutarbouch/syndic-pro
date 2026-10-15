import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';

import { PropertyForm } from '@/components/onboarding/property-form';
import { useTranslation } from '@/hooks/use-translation';
import OnboardingLayout from '@/layouts/onboarding/layout';

export default function PropertyPage() {
  const { t } = useTranslation();

  return (
    <>
      <Head title={t('onboarding.head.property')} />

      <PropertyForm />
    </>
  );
}

PropertyPage.layout = (page: ReactNode) => <OnboardingLayout>{page}</OnboardingLayout>;
