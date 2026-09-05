import { CoOwnerStatus } from '@/components/ledger/co-owner-status';
import { coOwners } from '@/components/ledger/co-owners-data';
import { FiscalYearCollectionCard } from '@/components/ledger/fiscal-year-collection-card';
import { PaymentJournal } from '@/components/ledger/payment-journal';
import { TransactionSummaryCard } from '@/components/ledger/transaction-summary-card';

export default function Ledger() {
    return (
        <main className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <header>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Property Financial Budget
                    </h1>

                    <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                        Overview of your property finances, collections, and
                        payments.
                    </p>
                </header>

                <div className="grid grid-cols-1 items-start gap-6">
                    <FiscalYearCollectionCard />
                    <TransactionSummaryCard />
                    {<CoOwnerStatus coOwners={coOwners} />}
                    <PaymentJournal />
                </div>
            </div>
        </main>
    );
}
