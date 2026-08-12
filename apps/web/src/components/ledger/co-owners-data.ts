export type Payment = {
  id: string;
  date: string;
  amount: number;
};

export type CoOwner = {
  id: string;
  name: string;
  initials: string;
  unit: string;
  quota: number;
  payments: Payment[];
};

export const coOwners: CoOwner[] = [
  {
    id: 'co-001',
    name: 'Ahmed Benali',
    initials: 'AB',
    unit: 'Apartment A-101',
    quota: 6000,
    payments: [
      {
        id: 'p-001',
        date: 'August 2026',
        amount: 1500,
      },
      {
        id: 'p-002',
        date: 'July 2026',
        amount: 1000,
      },
      {
        id: 'p-003',
        date: 'June 2026',
        amount: 1000,
      },
    ],
  },
  {
    id: 'co-002',
    name: 'Karim Alaoui',
    initials: 'KA',
    unit: 'Apartment A-102',
    quota: 6000,
    payments: [
      {
        id: 'p-004',
        date: 'August 2026',
        amount: 2000,
      },
      {
        id: 'p-005',
        date: 'July 2026',
        amount: 2000,
      },
      {
        id: 'p-006',
        date: 'June 2026',
        amount: 2000,
      },
    ],
  },
  {
    id: 'co-003',
    name: 'Nadia Cherkaoui',
    initials: 'NC',
    unit: 'Apartment B-201',
    quota: 6000,
    payments: [
      {
        id: 'p-007',
        date: 'August 2026',
        amount: 2500,
      },
    ],
  },
  {
    id: 'co-004',
    name: 'Hassan Tazi',
    initials: 'HT',
    unit: 'Apartment B-202',
    quota: 6000,
    payments: [
      {
        id: 'p-008',
        date: 'August 2026',
        amount: 3000,
      },
      {
        id: 'p-009',
        date: 'July 2026',
        amount: 3000,
      },
    ],
  },
];
