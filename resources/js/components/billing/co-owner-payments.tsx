import { router } from '@inertiajs/react';
import { useState } from 'react';

import { CoOwnerPaymentCard } from '@/components/billing/co-owner-payment-card';
import type { CoOwnerPaymentsProps, PaymentFrequency } from '@/types/properties/billing';

export function CoOwnerPayments({ payments: initialPayments }: CoOwnerPaymentsProps) {
  const [payments, setPayments] = useState(initialPayments);

  function handleFrequencyChange(paymentId: string, frequency: PaymentFrequency) {
    const previous = payments;

    setPayments((current) =>
      current.map((payment) => (payment.id === paymentId ? { ...payment, frequency } : payment)),
    );

    router.patch(
      `/billing/co-owners/${paymentId}/frequency`,
      { billing_frequency: frequency },
      {
        preserveScroll: true,
        onError: () => {
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
