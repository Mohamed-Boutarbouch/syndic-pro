import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/format-currency';

export function FiscalYearCollectionCard() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">
                    Total Fiscal Year Collection
                </CardTitle>

                <span className="rounded-full border px-2 py-0.5 text-xs font-medium">
                    68%
                </span>
            </CardHeader>

            <CardContent>
                <Progress value={68} className="h-2" />

                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>{formatCurrency(41000)} collected</span>

                    <span>Target: {formatCurrency(60000)}</span>
                </div>
            </CardContent>
        </Card>
    );
}
