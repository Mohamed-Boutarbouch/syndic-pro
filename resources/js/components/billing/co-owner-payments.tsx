import { useState } from 'react';

import type { PaymentFrequency } from './billing-data';
import { coOwnerPayments as seedPayments } from './billing-data';

import { CoOwnerPaymentCard } from './co-owner-payment-card';

export function CoOwnerPayments() {
    const [payments, setPayments] = useState(seedPayments);

    function handleFrequencyChange(
        paymentId: string,
        frequency: PaymentFrequency,
    ) {
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
