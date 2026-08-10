import { CollectionProgress } from '@/components/dashboard/collection-progress';
import { DashboardCards } from '@/components/dashboard/dashboard-cards';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <DashboardCards />
      <div className="px-4 lg:px-6">
        <CollectionProgress />
      </div>
      {/*<DataTable data={data} />*/}
    </div>
  );
}
