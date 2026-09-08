import type { Property } from '@/types/property';

export type CoOwnersKpis = {
  residential: number;
  commercial: number;
  storage: number;
  other: number;
};

export type UnitShare = {
  id: string;
  unitId: number;
  unitCoOwnerId: number;
  unit: string;
  floor: string | null;
  type: 'residential' | 'commercial' | 'storage' | 'other';
  coOwner: string;
  coOwnerId: number | null;
  coefficient: number;
  quotaYear: number;
  quotaMonth: number;
  billingFrequency: 'monthly' | 'bi_monthly' | 'quarterly' | 'semestral' | string;
  status: 'syndic' | 'co-owner';
};

export type TransferCandidate = {
  id: string;
  userId: number;
  name: string;
  unit: string;
};

export type ActiveSyndic = {
  userId: number;
  name: string;
  email: string | null;
  phone: string | null;
  unit: string | null;
  assignedAt: string | null;
};

export type BudgetSummary = {
  id: number;
  totalBudget: number;
  ratePerPoint: number;
  totalWeight: number;
  isLocked: boolean;
};

export type CoOwnersProps = {
  property: Property;
  kpis: CoOwnersKpis;
  unitShares: UnitShare[];
  activeSyndic: ActiveSyndic | null;
  transferCandidates: TransferCandidate[];
  budget: BudgetSummary | null;
};
