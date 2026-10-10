// export type DashboardProperty = {
//   id: string;
//   name: string;
// };

export type DashboardKpis = {
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

export type MonthlyCollectionPoint = {
  month: string;
  collected: number;
  target: number;
};

export type RecentPayment = {
  name: string;
  date: string;
  amount: number;
};

export type DashboardProps = {
  // property: DashboardProperty;
  kpis: DashboardKpis | null;
  collectionProgress: CollectionProgressData | null;
  monthlyCollection: MonthlyCollectionPoint[];
  recentPayments: RecentPayment[];
};
