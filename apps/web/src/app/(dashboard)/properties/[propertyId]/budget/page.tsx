import FiscalYear from '@/components/budget/fiscal-year';

export default function BudgetPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="grid grid-cols-1 items-stretch gap-4 px-4 lg:grid-cols-3 lg:gap-6 lg:px-6">
        <div className="lg:col-span-2">
          <FiscalYear />
        </div>
        <div className="lg:col-span-1">{/*<RecentPayments />*/}</div>
      </div>
    </div>
  );
}
