import { CoOwnersCards } from '@/components/co-owners/co-owners-cards';

export default function CoOwners() {
    return (
        <main className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Page header */}
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
                    <section
                        aria-labelledby="co-owners-heading"
                        className="min-w-0"
                    >
                        <h2 id="co-owners-heading" className="sr-only">
                            Co-owners
                        </h2>

                        <CoOwnersCards />
                    </section>

                    {/* Sidebar */}
                    {/*<aside className="space-y-6 lg:sticky lg:top-6 lg:col-span-4">
                        <section aria-labelledby="budget-actions-heading">
                            <h2 id="budget-actions-heading" className="sr-only">
                                Budget actions
                            </h2>

                            <BudgetActions />
                        </section>

                        <section aria-labelledby="current-distribution-heading">
                            <h2
                                id="current-distribution-heading"
                                className="sr-only"
                            >
                                Current distribution
                            </h2>

                            <CurrentDistribution />
                        </section>
                    </aside>*/}
                </div>
            </div>
        </main>
    );
}
