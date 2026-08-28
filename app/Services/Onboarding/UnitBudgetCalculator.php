<?php

namespace App\Services\Onboarding;

class UnitBudgetCalculator
{
    /**
     * Splits a total budget across units proportionally to their weight
     * coefficients. Units with an invalid/missing coefficient (null or <= 0)
     * are treated as contributing 0 to both the sum and their own share.
     *
     * Mirrors resources/js/lib/onboarding/unit-budget.ts::calculateUnitBudgets
     * exactly — same semantics, no independent rounding/remainder logic.
     *
     * @param  array<int, float|int|string|null>  $weightCoefficients
     * @return array<int, float>
     */
    public static function calculate(
        array $weightCoefficients,
        float $totalBudget,
    ): array {
        $normalized = array_map(
            fn ($coefficient) => is_numeric($coefficient) && (float) $coefficient > 0
                ? (float) $coefficient
                : 0.0,
            $weightCoefficients,
        );

        $sumOfCoefficients = array_sum($normalized);

        if ($sumOfCoefficients === 0.0 || $totalBudget <= 0) {
            return array_map(fn () => 0.0, $normalized);
        }

        return array_map(
            fn (float $coefficient) => ($coefficient / $sumOfCoefficients) * $totalBudget,
            $normalized,
        );
    }
}
