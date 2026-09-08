import { CoOwnerStatus } from '@/components/ledger/co-owner-status';
import { FiscalYearCollectionCard } from '@/components/ledger/fiscal-year-collection-card';
import { PaymentJournal } from '@/components/ledger/payment-journal';
import { TransactionSummaryCard } from '@/components/ledger/transaction-summary-card';
import { useTranslation } from '@/hooks/use-translation';
import type { LedgerProps } from '@/types/properties/ledger';

export default function Ledger({
  property,
  fiscalYear,
  transactionSummary,
  coOwnerStatuses,
  coOwnerOptions,
  payments,
}: LedgerProps) {
  const { t } = useTranslation('properties.ledger');

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>

          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{t('subtitle')}</p>
        </header>

        <div className="grid grid-cols-1 items-start gap-6">
          {fiscalYear && (
            <FiscalYearCollectionCard
              collected={fiscalYear.collected}
              target={fiscalYear.targetBudget}
              percentage={fiscalYear.percentage}
            />
          )}

          <TransactionSummaryCard summary={transactionSummary} />

          <CoOwnerStatus coOwners={coOwnerStatuses} />

          <PaymentJournal
            propertyId={property.id}
            coOwners={coOwnerOptions}
            payments={payments}
            transactionCount={transactionSummary.total}
          />
        </div>
      </div>
    </main>
  );
}
