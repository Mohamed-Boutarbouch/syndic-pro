import { router } from '@inertiajs/react';
import { useState } from 'react';
import type { CoOwnerPayment, PaymentFrequency } from './billing-data';
import { CoOwnerPaymentCard } from './co-owner-payment-card';

type CoOwnerPaymentsProps = {
    propertyId: number | string;
    payments: CoOwnerPayment[];
};

export function CoOwnerPayments({
    propertyId,
    payments: initialPayments,
}: CoOwnerPaymentsProps) {
    const [payments, setPayments] = useState(initialPayments);

    function handleFrequencyChange(
        paymentId: string,
        frequency: PaymentFrequency,
    ) {
        const previous = payments;

        // Optimistically update the UI, then reconcile with the server.
        setPayments((current) =>
            current.map((payment) =>
                payment.id === paymentId
                    ? {
                          ...payment,
                          frequency,
                      }
                    : payment,
            ),
        );

        router.patch(
            `/properties/${propertyId}/billing/co-owners/${paymentId}/frequency`,
            { billing_frequency: frequency },
            {
                preserveScroll: true,
                onError: () => {
                    // Roll back on validation/server failure.
                    setPayments(previous);
                },
            },
        );
    }

    return (
        <section className="flex flex-col gap-4">
            {payments.map((payment) => (
                <CoOwnerPaymentCard
                    key={payment.id}
                    payment={payment}
                    onFrequencyChange={handleFrequencyChange}
                />
            ))}
        </section>
    );
}
