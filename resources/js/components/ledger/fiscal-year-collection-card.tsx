import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/format-currency';

type FiscalYearCollectionCardProps = {
    collected: number;
    target: number;
    percentage: number;
};

export function FiscalYearCollectionCard({
    collected,
    target,
    percentage,
}: FiscalYearCollectionCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">
                    Total Fiscal Year Collection
                </CardTitle>
                <span className="rounded-full border px-2 py-0.5 text-xs font-medium">
                    {percentage}%
                </span>
            </CardHeader>
            <CardContent>
                <Progress value={percentage} className="h-2" />
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>{formatCurrency(collected)} collected</span>
                    <span>Target: {formatCurrency(target)}</span>
                </div>
            </CardContent>
        </Card>
    );
}
