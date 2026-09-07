import type { CoOwnerPayment } from '@/components/billing/billing-data';
import { CoOwnerPayments } from '@/components/billing/co-owner-payments';
import { CoOwnersCards } from '@/components/co-owners/co-owners-cards';

type BillingProps = {
    property: {
        id: number;
        name: string;
    };
    payments: CoOwnerPayment[];
    kpis: {
        apartment: number;
        commercial: number;
        storage: number;
    };
};

export default function Billing({ property, payments, kpis }: BillingProps) {
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
                    <CoOwnersCards kpis={kpis} />
                    {payments.length > 0 ? (
                        <CoOwnerPayments
                            propertyId={property.id}
                            payments={payments}
                        />
                    ) : (
                        <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
                            No active fiscal budget with billed co-owners yet
                            for this property.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
