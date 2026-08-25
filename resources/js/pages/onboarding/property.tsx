import { Head, setLayoutProps, useForm } from '@inertiajs/react';
import type { SubmitEvent } from 'react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { validatePropertyForm } from '@/schemas/property';
import type { PropertyFormErrors } from '@/schemas/property';
import { store } from '@/actions/App/Http/Controllers/Onboarding/PropertyController';

type PropertyFormData = {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    unitsCount: string;
};

export default function OnboardingProperty() {
    setLayoutProps({
        title: 'Tell us about your property',
        description: 'Step 1 of 3',
        step: 1,
        totalSteps: 3,
    });

    const { data, setData, post, processing, errors, setError, clearErrors } =
        useForm<PropertyFormData>({
            name: '',
            address: '',
            city: '',
            postalCode: '',
            unitsCount: '',
        });

    const [clientErrors, setClientErrors] = useState<PropertyFormErrors>({});

    const submit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        clearErrors();

        // Client-side validation first — fail fast, no round trip
        const result = validatePropertyForm(data);

        if (!result.success) {
            setClientErrors(result.errors);

            return;
        }

        setClientErrors({});

        post(store.url(), {
            onSuccess: () => {
                // Server redirect (e.g. to the next onboarding step) takes over;
                // this onSuccess is a fallback / for toasts, not a hard requirement.
            },
            onError: (serverErrors) => {
                // Inertia already populates `errors` from a 422 response,
                // this is only needed if you want extra client-side handling.
                Object.entries(serverErrors).forEach(([field, message]) => {
                    setError(
                        field as keyof PropertyFormData,
                        message as string,
                    );
                });
            },
        });
    };

    const fieldError = (field: keyof PropertyFormData) =>
        clientErrors[field as keyof typeof clientErrors] ?? errors[field];

    return (
        <>
            <Head title="Add your property" />

            <form onSubmit={submit} className="space-y-6" noValidate>
                <div className="grid gap-2">
                    <Label htmlFor="name">Property name</Label>
                    <Input
                        id="name"
                        name="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Résidence Al Manar"
                        autoFocus
                    />
                    <InputError message={fieldError('name')} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="address">Street address</Label>
                    <Input
                        id="address"
                        name="address"
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        placeholder="12 Avenue Hassan II"
                    />
                    <InputError message={fieldError('address')} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                            id="city"
                            name="city"
                            value={data.city}
                            onChange={(e) => setData('city', e.target.value)}
                            placeholder="Fès"
                        />
                        <InputError message={fieldError('city')} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="postalCode">Postal code</Label>
                        <Input
                            id="postalCode"
                            name="postalCode"
                            value={data.postalCode}
                            onChange={(e) =>
                                setData('postalCode', e.target.value)
                            }
                            placeholder="30000"
                            inputMode="numeric"
                        />
                        <InputError message={fieldError('postalCode')} />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="unitsCount">Number of units</Label>
                    <Input
                        id="unitsCount"
                        name="unitsCount"
                        type="number"
                        min={1}
                        value={data.unitsCount}
                        onChange={(e) => setData('unitsCount', e.target.value)}
                        placeholder="24"
                    />
                    <InputError message={fieldError('unitsCount')} />
                </div>

                <Button type="submit" className="w-full" disabled={processing}>
                    {processing && <Spinner />}
                    Continue
                </Button>
            </form>
        </>
    );
}

OnboardingProperty.layout = (page: React.ReactNode) => (
    <div>{page}</div> // overridden by app.tsx's onboarding/* match; kept for per-page props if needed
);
