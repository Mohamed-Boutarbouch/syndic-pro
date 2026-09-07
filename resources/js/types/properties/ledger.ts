import type { CoOwnerOption } from '@/components/ledger/co-owner-select';
import type { PaymentLog } from '@/components/ledger/columns';

export type LedgerProperty = {
    id: number;
    name: string;
};

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

export type CoOwnerPayment = {
    id: string;
    date: string;
    amount: number;
};

export type CoOwnerStatus = {
    id: string;
    unitCoOwnerId: number;
    name: string;
    initials: string;
    unit: string;
    quota: number;
    payments: CoOwnerPayment[];
};

export type LedgerProps = {
    property: LedgerProperty;
    fiscalYear: FiscalYearCollection | null;
    transactionSummary: TransactionSummary;
    coOwnerStatuses: CoOwnerStatus[];
    coOwnerOptions: CoOwnerOption[];
    payments: PaymentLog[];
};
