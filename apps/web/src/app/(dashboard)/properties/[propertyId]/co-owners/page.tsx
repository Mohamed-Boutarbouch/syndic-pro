import { CoOwnersCards } from '@/components/co-owners/co-owners-cards';
import { ActiveSyndic } from '@/components/co-owners/active-syndic';
import { getUnitShares } from '@/components/co-owners/get-unit-shares';
import { DataTable } from '@/components/co-owners/data-table';
import { columns } from '@/components/co-owners/columns';

export default async function CoOwnersPage() {
  const data = await getUnitShares();

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <CoOwnersCards />

      <div className="px-4 lg:px-6">
        <ActiveSyndic />
      </div>

      <div className="px-4 lg:px-6">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
