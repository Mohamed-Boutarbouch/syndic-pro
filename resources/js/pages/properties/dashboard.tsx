import { CollectionProgress } from '@/components/dashboard/collection-progress';
import { Kpis } from '@/components/dashboard/kpis';
import { MonthlyCollection } from '@/components/dashboard/monthly-collection';

export default function Dashboard() {
    return (
        <main className="p-4 sm:p-6">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-12">
                <header className="lg:col-span-12">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Property Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Overview of your property finances, collections, and
                        payments.
                    </p>
                </header>

                <section
                    aria-labelledby="dashboard-overview"
                    className="lg:col-span-12"
                >
                    <h2 id="dashboard-overview" className="sr-only">
                        Property overview
                    </h2>

                    <Kpis />
                </section>

                <section
                    aria-labelledby="collection-progress"
                    className="lg:col-span-12"
                >
                    <h2 id="collection-progress" className="sr-only">
                        Collection progress
                    </h2>

                    <CollectionProgress />
                </section>

                <section
                    aria-labelledby="monthly-collection"
                    className="lg:col-span-8"
                >
                    <h2 id="monthly-collection" className="sr-only">
                        Monthly collection
                    </h2>

                    <MonthlyCollection />
                </section>

                <section
                    aria-labelledby="recent-payments"
                    className="lg:col-span-4"
                >
                    <h2 id="recent-payments" className="sr-only">
                        Recent payments
                    </h2>

                    {/* <RecentPayments /> */}
                </section>
            </div>
        </main>
    );
}
