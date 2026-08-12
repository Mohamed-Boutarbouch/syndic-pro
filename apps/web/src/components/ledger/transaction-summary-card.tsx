import { Card, CardContent } from '@/components/ui/card';

export function TransactionSummaryCard() {
  return (
    <Card>
      <CardContent className="space-y-2 pt-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Total Transactions
          </span>

          <span className="text-lg font-semibold">37</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Of which partial
          </span>

          <span className="text-sm font-semibold text-orange-500">2</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Owners paid off</span>

          <span className="text-sm font-semibold text-emerald-500">3/10</span>
        </div>
      </CardContent>
    </Card>
  );
}
