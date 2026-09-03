/**
 * Splits a total budget across units proportionally to their weight
 * coefficients. Units with an invalid/missing coefficient (NaN, undefined,
 * or <= 0) are treated as contributing 0 to both the sum and their own share.
 */
export function calculateUnitBudgets(
    weightCoefficients: Array<number | undefined>,
    totalBudget: number,
): number[] {
    const normalized = weightCoefficients.map((coefficient) =>
        typeof coefficient === 'number' && coefficient > 0 ? coefficient : 0,
    );

    const sumOfCoefficients = normalized.reduce((sum, value) => sum + value, 0);

    if (sumOfCoefficients === 0 || totalBudget <= 0) {
        return normalized.map(() => 0);
    }

    return normalized.map(
        (coefficient) => (coefficient / sumOfCoefficients) * totalBudget,
    );
}
