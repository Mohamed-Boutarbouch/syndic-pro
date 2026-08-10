import { CollectionProgress } from '@/components/dashboard/collection-progress';
import { DashboardCards } from '@/components/dashboard/dashboard-cards';
import { MonthlyCollection } from '@/components/dashboard/monthly-collection';
import { RecentPayments } from '@/components/dashboard/recent-payments';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <DashboardCards />

      <div className="px-4 lg:px-6">
        <CollectionProgress />
      </div>

      <div className="grid grid-cols-1 items-stretch gap-4 px-4 lg:grid-cols-3 lg:gap-6 lg:px-6">
        <div className="lg:col-span-2">
          <MonthlyCollection />
        </div>
        <div className="lg:col-span-1">
          <RecentPayments />
        </div>
      </div>
    </div>
  );
}
