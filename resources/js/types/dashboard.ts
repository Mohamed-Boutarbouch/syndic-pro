export type Property = {
    id: number;
    name: string;
};

export type KpisData = {
    unitsCount: number;
    coOwnersCount: number;
    targetBudget: number;
    collectedYtd: number;
    remainingBalance: number;
    isDeficit: boolean;
    percentOfTarget: number;
    fiscalYearLabel: string;
    paidCount: number;
    partialCount: number;
    pendingCount: number;
};

export type OwnerProgress = {
    name: string;
    pct: number;
};

export type CollectionProgressData = {
    collected: number;
    target: number;
    totalOwners: number;
    owners: OwnerProgress[];
};

export type MonthlyPoint = {
    month: string;
    collected: number;
    target: number;
};

export type Payment = {
    name: string;
    date: string;
    amount: number;
};
