import { BudgetActions } from '@/components/budget/budget-actions';
import { CurrentDistribution } from '@/components/budget/current-distribution';
import { FiscalYear } from '@/components/budget/fiscal-year';

export default function Budget() {
    return (
        <main className="min-h-full p-4 sm:p-6 lg:p-8">
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

                {/* Main content */}
                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                    {/* Fiscal year */}
                    <section
                        aria-labelledby="fiscal-year-heading"
                        className="min-w-0 lg:col-span-8"
                    >
                        <h2 id="fiscal-year-heading" className="sr-only">
                            Fiscal year
                        </h2>

                        <FiscalYear />
                    </section>

                    {/* Sidebar */}
                    <aside className="space-y-6 lg:sticky lg:top-6 lg:col-span-4">
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
                    </aside>
                </div>
            </div>
        </main>
    );
}
