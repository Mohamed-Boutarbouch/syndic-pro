import type {
    TransferCandidate,
    UnitShare,
} from '@/components/co-owners/columns';

export type CoOwnersProperty = {
    id: number;
    name: string;
};

export type CoOwnersKpis = {
    apartment: number;
    commercial: number;
    storage: number;
};

export type ActiveSyndic = {
    userId: number;
    name: string;
    email: string | null;
    phone: string | null;
    unit: string | null;
    assignedAt: string | null;
} | null;

export type BudgetSummary = {
    id: number;
    totalBudget: number;
    ratePerPoint: number;
    totalWeight: number;
    isLocked: boolean;
} | null;

export type CoOwnersPageProps = {
    property: CoOwnersProperty;
    kpis: CoOwnersKpis;
    unitShares: UnitShare[];
    activeSyndic: ActiveSyndic;
    transferCandidates: TransferCandidate[];
    budget: BudgetSummary;
};
