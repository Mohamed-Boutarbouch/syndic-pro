import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';

import { BudgetForm } from '@/components/onboarding/budget-form';
import { useTranslation } from '@/hooks/use-translation';
import OnboardingLayout from '@/layouts/onboarding/layout';

type BudgetPageProps = {
  property: {
    id: string;
    name: string;
  };
};

export default function BudgetPage({ property }: BudgetPageProps) {
  const { t } = useTranslation();

  return (
    <>
      <Head title={t('onboarding.head.budget')} />
      <Head title="Onboarding — Annual Target Budget" />

      <BudgetForm property={property} />
    </>
  );
}

BudgetPage.layout = (page: ReactNode) => <OnboardingLayout>{page}</OnboardingLayout>;
