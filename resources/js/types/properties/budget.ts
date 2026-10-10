export type Budget = {
  id: number;
  startDate: string;
  endDate: string;
  totalBudget: number;
  isBudgetLocked: boolean;
};

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
  budget: Budget | null;
  distribution: BudgetDistribution;
};
