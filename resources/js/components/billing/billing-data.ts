import type { PaymentFrequency } from '@/types/properties/billing';

export const PAYMENT_FREQUENCIES = {
    monthly: {
        labelKey: 'properties.billing.frequencies.monthly',
        paymentsPerYear: 12,
        badgeClass:
            'border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    bimonthly: {
        labelKey: 'properties.billing.frequencies.bimonthly',
        paymentsPerYear: 6,
        badgeClass:
            'border-cyan-500/40 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    },
    quarterly: {
        labelKey: 'properties.billing.frequencies.quarterly',
        paymentsPerYear: 4,
        badgeClass:
            'border-yellow-500/40 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    },
    'semi-annual': {
        labelKey: 'properties.billing.frequencies.semi_annual',
        paymentsPerYear: 2,
        badgeClass:
            'border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-400',
    },
} as const satisfies Record<
    PaymentFrequency,
    {
        labelKey: string;
        paymentsPerYear: number;
        badgeClass: string;
    }
>;

export function getPaymentFrequency(frequency: PaymentFrequency) {
    return PAYMENT_FREQUENCIES[frequency];
}

export function getInstallmentAmount(
    quota: number,
    frequency: PaymentFrequency,
) {
    return quota / PAYMENT_FREQUENCIES[frequency].paymentsPerYear;
}

export function getProgress(collected: number, quota: number) {
    if (quota <= 0) {
        return 0;
    }

    return Math.min(100, Math.round((collected / quota) * 100));
}

export function getRemaining(collected: number, quota: number) {
    return Math.max(0, quota - collected);
}
