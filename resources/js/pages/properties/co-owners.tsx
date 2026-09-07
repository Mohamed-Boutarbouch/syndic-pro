import { ActiveSyndic } from '@/components/co-owners/active-syndic';
import { CoOwnersCards } from '@/components/co-owners/co-owners-cards';
import type {
    TransferCandidate,
    UnitShare,
} from '@/components/co-owners/columns';
import { DataTable } from '@/components/co-owners/data-table';

type ActiveSyndicData = {
    userId: number;
    name: string;
    email: string | null;
    phone: string | null;
    unit: string | null;
    assignedAt: string | null;
} | null;

type BudgetSummary = {
    id: number;
    totalBudget: number;
    ratePerPoint: number;
    totalWeight: number;
    isLocked: boolean;
} | null;

interface CoOwnersPageProps {
    property: {
        id: number;
        name: string;
    };
    kpis: {
        apartment: number;
        commercial: number;
        storage: number;
    };
    unitShares: UnitShare[];
    activeSyndic: ActiveSyndicData;
    transferCandidates: TransferCandidate[];
    budget: BudgetSummary;
}

export default function CoOwners({
    property,
    kpis,
    unitShares,
    activeSyndic,
    transferCandidates,
    budget,
}: CoOwnersPageProps) {
    return (
        <main className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <header>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Co-Owners
                    </h1>
                    <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                        Manage unit shares, ownership records, and the active
                        syndic for {property.name}.
                    </p>
                </header>
                <div className="grid grid-cols-1 items-start gap-6">
                    <CoOwnersCards kpis={kpis} />
                    <ActiveSyndic
                        propertyId={property.id}
                        activeSyndic={activeSyndic}
                        candidates={transferCandidates}
                    />
                    <DataTable
                        data={unitShares}
                        propertyId={property.id}
                        ratePerPoint={budget?.ratePerPoint ?? 0}
                        totalWeight={budget?.totalWeight ?? 0}
                    />
                </div>
            </div>
        </main>
    );
}
