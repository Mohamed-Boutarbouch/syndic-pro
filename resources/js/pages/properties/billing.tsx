import { BillingCards } from '@/components/billing/billing-cards';
import { CoOwnerPayments } from '@/components/billing/co-owner-payments';
import { useTranslation } from '@/hooks/use-translation';
import type { BillingProps } from '@/types/properties/billing';

export default function Billing({ payments, kpis }: BillingProps) {
  const { t } = useTranslation('properties.billing');

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>

          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{t('subtitle')}</p>
        </header>

        <div className="grid grid-cols-1 items-start gap-6">
          <BillingCards kpis={kpis} />

          {payments.length > 0 ? (
            <CoOwnerPayments payments={payments} />
          ) : (
            <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
              {t('empty_state')}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
