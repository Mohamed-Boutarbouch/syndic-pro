import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';

import OnboardingLayout from '@/layouts/onboarding/layout';
import { PropertyForm } from '@/components/onboarding/property-form';

export default function PropertyPage() {
    return (
        <>
            <Head title="Onboarding — Property" />

            <PropertyForm />
        </>
    );
}

PropertyPage.layout = (page: ReactNode) => (
    <OnboardingLayout>{page}</OnboardingLayout>
);
