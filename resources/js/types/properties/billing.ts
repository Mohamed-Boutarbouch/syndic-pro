export type BillingProperty = {
  id: string;
  name: string;
};

export type BillingKpis = {
  monthly: string;
  bimonthly: string;
  quarterly: string;
  semi_annual: string;
};

export type PaymentFrequency = 'monthly' | 'bimonthly' | 'quarterly' | 'semi-annual';

export type HouseholdCoPayer = {
  id: string;
  initials: string;
  name: string;
  relationship: string;
  sharePercentage: number;
  collected: number;
  isOwner: boolean;
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

export type BillingProps = {
  property: BillingProperty;
  payments: CoOwnerPayment[];
  kpis: BillingKpis;
};

export type CoOwnerPaymentsProps = {
  payments: CoOwnerPayment[];
};

export type CoOwnerPaymentCardProps = {
  payment: CoOwnerPayment;
  onFrequencyChange?: (paymentId: string, frequency: PaymentFrequency) => void;
};

export type FrequencyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  quota: number;
  frequency: PaymentFrequency;
  onSave: (frequency: PaymentFrequency) => void;
};

export type HouseholdCoPayersProps = {
  payment: CoOwnerPayment;
};
