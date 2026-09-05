export const BILLING_FREQUENCY_DIVISOR: Record<string, number> = {
    monthly: 12,
    bimonthly: 6,
    quarterly: 4,
    semi_annual: 2,
};

/**
 * Computes the per-installment amount for a given annual budget
 * and billing frequency.
 */
export function calculateInstallmentAmount(
    annualBudget: number,
    frequency: string | undefined,
): number | null {
    if (!frequency || !annualBudget) {
        return null;
    }

    const divisor = BILLING_FREQUENCY_DIVISOR[frequency];

    if (!divisor) {
        return null;
    }

    return annualBudget / divisor;
}
