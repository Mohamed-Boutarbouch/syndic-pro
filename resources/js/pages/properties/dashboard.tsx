import { CollectionProgress } from '@/components/dashboard/collection-progress';
import { Kpis } from '@/components/dashboard/kpis';

export default function Dashboard() {
    return (
        <div className="p-4 sm:p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                <Kpis />

                <div className="min-h-100">
                    <CollectionProgress />
                </div>
            </div>
        </div>
    );
}
