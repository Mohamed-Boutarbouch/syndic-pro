import { ActiveSyndic } from '@/components/co-owners/active-syndic';
import { CoOwnersCards } from '@/components/co-owners/co-owners-cards';
import { columns } from '@/components/co-owners/columns';
import { DataTable } from '@/components/co-owners/data-table';
import { getUnitShares } from '@/components/co-owners/get-unit-shares';

export default function CoOwners() {
    const data = getUnitShares();

    return (
        <main className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <header>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Co-Owners
                    </h1>
                    <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                        Manage unit shares, ownership records, and the active
                        syndic for this property.
                    </p>
                </header>

                <div className="grid grid-cols-1 items-start gap-6">
                    <CoOwnersCards />
                    <ActiveSyndic />
                    <DataTable columns={columns} data={data} />
                </div>
            </div>
        </main>
    );
}
