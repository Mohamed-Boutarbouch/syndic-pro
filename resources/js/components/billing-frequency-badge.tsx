import type { LucideIcon } from 'lucide-react';
import { Calendar, CalendarDays, CalendarRange, CalendarClock } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

export type BillingFrequency = 'monthly' | 'bimonthly' | 'quarterly' | 'semi_annual';

type BillingFrequencyConfig = {
  label: string;
  icon: LucideIcon;
  className: string;
};

const billingFrequencyConfig: Record<BillingFrequency, BillingFrequencyConfig> = {
  monthly: {
    label: 'Monthly',
    icon: Calendar,
    className: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  },
  bimonthly: {
    label: 'Every 2 Months',
    icon: CalendarDays,
    className: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
  },
  quarterly: {
    label: 'Quarterly',
    icon: CalendarRange,
    className: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  },
  semi_annual: {
    label: 'Semi-Annual',
    icon: CalendarClock,
    className: 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  },
};

type BillingFrequencyBadgeProps = {
  frequency: string;
};

export function BillingFrequencyBadge({ frequency }: BillingFrequencyBadgeProps) {
  const config = billingFrequencyConfig[frequency as BillingFrequency];

  if (!config) {
    return null;
  }

  const Icon = config.icon;

  return (
    <Badge className={config.className}>
      <Icon data-icon="inline-start" />
      {config.label}
    </Badge>
  );
}
