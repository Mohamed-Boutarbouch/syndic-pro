export const PAYMENT_FREQUENCIES = {
  monthly: {
    label: 'Monthly',
    paymentsPerYear: 12,
    badgeClass:
      'border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  bimonthly: {
    label: 'Bimonthly',
    paymentsPerYear: 6,
    badgeClass:
      'border-cyan-500/40 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
  },
  quarterly: {
    label: 'Quarterly',
    paymentsPerYear: 4,
    badgeClass:
      'border-yellow-500/40 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  },
  'semi-annual': {
    label: 'Semi-annual',
    paymentsPerYear: 2,
    badgeClass:
      'border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-400',
  },
} as const;

export type PaymentFrequency = keyof typeof PAYMENT_FREQUENCIES;

export type HouseholdCoPayer = {
  id: string;
  initials: string;
  name: string;
  relationship: string;
  sharePercentage: number;
  collected: number;
};

export type CoOwnerPayment = {
  id: string;
  initials: string;
  name: string;
  role?: string;
  unit: string;
  quota: number;
  collected: number;
  frequency: PaymentFrequency;
  coPayers?: HouseholdCoPayer[];
};

export const coOwnerPayments: CoOwnerPayment[] = [
  {
    id: 'ahmed-benali',
    initials: 'AB',
    name: 'Ahmed Benali',
    role: 'Syndic',
    unit: 'A-101',
    quota: 6000,
    collected: 3500,
    frequency: 'monthly',
    coPayers: [
      {
        id: 'ahmed-benali',
        initials: 'AB',
        name: 'Ahmed Benali',
        relationship: 'account holder',
        sharePercentage: 100,
        collected: 3500,
      },
    ],
  },

  {
    id: 'karim-alaoui',
    initials: 'KA',
    name: 'Karim Alaoui',
    unit: 'A-201',
    quota: 6000,
    collected: 6000,
    frequency: 'quarterly',
  },

  {
    id: 'nadia-cherkaoui',
    initials: 'NC',
    name: 'Nadia Cherkaoui',
    unit: 'A-202',
    quota: 6000,
    collected: 2500,
    frequency: 'bimonthly',
    coPayers: [
      {
        id: 'nadia',
        initials: 'NC',
        name: 'Nadia Cherkaoui',
        relationship: 'account holder',
        sharePercentage: 0,
        collected: 0,
      },
      {
        id: 'omar',
        initials: 'OC',
        name: 'Omar Cherkaoui',
        relationship: 'Husband',
        sharePercentage: 60,
        collected: 1500,
      },
      {
        id: 'youssef',
        initials: 'YC',
        name: 'Youssef Cherkaoui',
        relationship: 'Son',
        sharePercentage: 40,
        collected: 1000,
      },
    ],
  },

  {
    id: 'hassan-tazi',
    initials: 'HT',
    name: 'Hassan Tazi',
    unit: 'A-301',
    quota: 6000,
    collected: 6000,
    frequency: 'semi-annual',
  },

  {
    id: 'laila-mansouri',
    initials: 'LM',
    name: 'Laila Mansouri',
    unit: 'A-302',
    quota: 6000,
    collected: 1500,
    frequency: 'monthly',
  },

  {
    id: 'youssef-idrissi',
    initials: 'YI',
    name: 'Youssef Idrissi',
    unit: 'A-401',
    quota: 6000,
    collected: 3000,
    frequency: 'monthly',
  },

  {
    id: 'sara-el-fassi',
    initials: 'SE',
    name: 'Sara El Fassi',
    unit: 'A-402',
    quota: 6000,
    collected: 4500,
    frequency: 'quarterly',
    coPayers: [],
  },

  {
    id: 'mohamed-berrada',
    initials: 'MB',
    name: 'Mohamed Berrada',
    unit: 'A-501',
    quota: 6000,
    collected: 500,
    frequency: 'monthly',
    coPayers: [
      {
        id: 'mohamed',
        initials: 'MB',
        name: 'Mohamed Berrada',
        relationship: 'account holder',
        sharePercentage: 50,
        collected: 250,
      },
      {
        id: 'fatima',
        initials: 'FB',
        name: 'Fatima Berrada',
        relationship: 'Spouse',
        sharePercentage: 50,
        collected: 250,
      },
    ],
  },

  {
    id: 'sarl-atlas',
    initials: 'AC',
    name: 'SARL Atlas Commerce',
    unit: 'COM-01',
    quota: 9000,
    collected: 7500,
    frequency: 'monthly',
  },

  {
    id: 'rachid-ouali',
    initials: 'RO',
    name: 'Rachid Ouali',
    unit: 'STK-01',
    quota: 3000,
    collected: 3000,
    frequency: 'semi-annual',
  },

  {
    id: 'farah-el-amrani',
    initials: 'FA',
    name: 'Farah El Amrani',
    unit: 'B-101',
    quota: 6000,
    collected: 900,
    frequency: 'bimonthly',
  },

  {
    id: 'othmane-benali',
    initials: 'OB',
    name: 'Othmane Benali',
    unit: 'B-202',
    quota: 6000,
    collected: 0,
    frequency: 'quarterly',
  },
];

export function getPaymentFrequency(frequency: PaymentFrequency) {
  return PAYMENT_FREQUENCIES[frequency];
}

export function getInstallmentAmount(
  quota: number,
  frequency: PaymentFrequency,
) {
  return quota / PAYMENT_FREQUENCIES[frequency].paymentsPerYear;
}

export function getProgress(collected: number, quota: number) {
  if (quota <= 0) return 0;

  return Math.min(100, Math.round((collected / quota) * 100));
}

export function getRemaining(collected: number, quota: number) {
  return Math.max(0, quota - collected);
}

export function formatMAD(value: number) {
  return `${value.toLocaleString('en-US')} MAD`;
}
