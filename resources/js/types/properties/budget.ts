export type BudgetProperty = {
    id: number;
    name: string;
};

export type PropertyBudget = {
    id: number;
    startDate: string;
    endDate: string;
    totalBudget: number;
    isBudgetLocked: boolean;
} | null;

export type BudgetDistributionUnit = {
    unit: string;
    name: string | null;
    points: number;
    amount: number;
};

export type BudgetDistribution = {
    totalWeight: number;
    sharePerPoint: number;
    units: BudgetDistributionUnit[];
};

export type BudgetProps = {
    property: BudgetProperty;
    budget: PropertyBudget;
    distribution: BudgetDistribution;
};
