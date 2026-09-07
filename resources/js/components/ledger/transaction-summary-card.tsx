import { Card, CardContent } from '@/components/ui/card';
import type { TransactionSummary } from '@/types/properties/ledger';

type TransactionSummaryCardProps = {
    summary: TransactionSummary;
};

export function TransactionSummaryCard({
    summary,
}: TransactionSummaryCardProps) {
    return (
        <Card>
            <CardContent className="space-y-2 pt-6">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                        Total Transactions
                    </span>

                    <span className="text-lg font-semibold">
                        {summary.total}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                        Of which partial
                    </span>

                    <span className="text-sm font-semibold text-orange-500">
                        {summary.partial}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                        Owners paid off
                    </span>

                    <span className="text-sm font-semibold text-emerald-500">
                        {summary.ownersPaidOff}/{summary.ownersTotal}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
