import { CoOwnerPayments } from '@/components/billing/co-owner-payments';
import { CoOwnersCards } from '@/components/co-owners/co-owners-cards';

export default function Billing() {
    return (
        <main className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <header>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Billing
                    </h1>
                    <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                        Track co-owner payments and outstanding balances.
                    </p>
                </header>

                <div className="grid grid-cols-1 items-start gap-6">
                    <CoOwnersCards />
                    <CoOwnerPayments />
                </div>
            </div>
        </main>
    );
}
