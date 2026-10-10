import { BudgetActions } from '@/components/budget/budget-actions';
import { CurrentDistribution } from '@/components/budget/current-distribution';
import { FiscalYear } from '@/components/budget/fiscal-year';
import { useTranslation } from '@/hooks/use-translation';
import type { BudgetProps } from '@/types/properties/budget';

export default function Budget({ budget, distribution }: BudgetProps) {
  const { t } = useTranslation('properties.budget');

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>

          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{t('subtitle')}</p>
        </header>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <section aria-labelledby="fiscal-year-heading" className="min-w-0 lg:col-span-8">
            <h2 id="fiscal-year-heading" className="sr-only">
              Fiscal year
            </h2>

            <FiscalYear budget={budget} distribution={distribution} />
          </section>

          <aside className="space-y-6 lg:sticky lg:top-6 lg:col-span-4">
            <section aria-labelledby="budget-actions-heading">
              <h2 id="budget-actions-heading" className="sr-only">
                Budget actions
              </h2>

              <BudgetActions
                sharePerPoint={distribution.sharePerPoint}
                currentTotalBudget={budget?.totalBudget ?? 0}
              />
            </section>

            <section aria-labelledby="current-distribution-heading">
              <h2 id="current-distribution-heading" className="sr-only">
                Current distribution
              </h2>

              <CurrentDistribution distribution={distribution} />
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
