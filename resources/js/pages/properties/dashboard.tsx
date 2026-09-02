import { Kpis } from '@/components/dashboard/kpis';
import { Card, CardContent } from '@/components/ui/card';

export default function Dashboard() {
    return (
        <div className="p-4 sm:p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                <Kpis />

                <Card className="min-h-100">
                    <CardContent className="h-full p-6">
                        {/* Future dashboard component */}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
