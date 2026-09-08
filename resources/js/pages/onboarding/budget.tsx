import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';

import { BudgetForm } from '@/components/onboarding/budget-form';
import OnboardingLayout from '@/layouts/onboarding/layout';

type BudgetPageProps = {
  property: {
    id: number;
    name: string;
  };
};

export default function BudgetPage({ property }: BudgetPageProps) {
  return (
    <>
      <Head title="Onboarding — Annual Target Budget" />

      <BudgetForm property={property} />
    </>
  );
}

BudgetPage.layout = (page: ReactNode) => <OnboardingLayout>{page}</OnboardingLayout>;
