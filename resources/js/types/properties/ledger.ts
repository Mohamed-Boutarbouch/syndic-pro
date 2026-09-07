import type { Property } from '@/types/property';

export type FiscalYearCollection = {
    targetBudget: number;
    collected: number;
    percentage: number;
};

export type TransactionSummary = {
    total: number;
    partial: number;
    ownersPaidOff: number;
    ownersTotal: number;
};

export type LedgerPayment = {
    id: string;
    date: string;
    amount: number;
};

export type CoOwnerStatusData = {
    id: string;
    unitCoOwnerId: number;
    name: string;
    initials: string;
    unit: string;
    quota: number;
    payments: LedgerPayment[];
};

export type CoOwnerOption = {
    id: string;
    name: string;
    initials: string;
    remainingQuota: number;
};

export type PaymentLog = {
    id: string;
    date: string;
    coOwner: string;
    period: string;
    type: 'full' | 'partial';
    amount: number;
    notes: string;
};

export type LedgerProps = {
    property: Property;
    fiscalYear: FiscalYearCollection | null;
    transactionSummary: TransactionSummary;
    coOwnerStatuses: CoOwnerStatusData[];
    coOwnerOptions: CoOwnerOption[];
    payments: PaymentLog[];
};
