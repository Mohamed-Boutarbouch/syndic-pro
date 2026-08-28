import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';

import { CoOwnerForm } from '@/components/onboarding/co-owner-form';
import OnboardingLayout from '@/layouts/onboarding/layout';

export type CoOwnerPageProps = {
    property: {
        id: number;
        name: string;
    };

    units: {
        id: number;
        property_id: number;
        label: string;
        floor: string;
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
    units,
    billingFrequency,
}: CoOwnerPageProps) {
    return (
        <>
            <Head title="Onboarding — Co-Owners" />

            <CoOwnerForm
                property={property}
                units={units}
                billingFrequency={billingFrequency}
            />
        </>
    );
}

CoOwnerPage.layout = (page: ReactNode) => (
    <OnboardingLayout>{page}</OnboardingLayout>
);
