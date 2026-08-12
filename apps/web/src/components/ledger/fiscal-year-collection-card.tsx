import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

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
          <span>41,000 MAD collected</span>

          <span>Target: 60,000 MAD</span>
        </div>
      </CardContent>
    </Card>
  );
}
