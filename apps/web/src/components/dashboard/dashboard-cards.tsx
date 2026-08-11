// TODO: No card content?
import { Target, TrendingDown, Users, Wallet } from 'lucide-react';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function DashboardCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="mb-4">Anual Budget</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            60,000 MAD
          </CardTitle>
          <CardAction>
            <div className="flex items-center justify-center rounded-md border p-2">
              <Target className="size-5 text-muted-foreground" />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm text-muted-foreground">
          Nov 2025 - Oct 2026
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="mb-4">Collected (YTD)</CardDescription>
          <CardTitle className="text-2xl text-green-400 font-semibold tabular-nums @[250px]/card:text-3xl">
            38,000 MAD
          </CardTitle>
          <CardAction>
            <div className="flex items-center justify-center rounded-md border p-2">
              <Wallet className="size-5 text-green-400" />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm text-muted-foreground">
          63% of target
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="mb-4">Remaining Balance</CardDescription>
          <CardTitle className="text-2xl text-red-400 font-semibold tabular-nums @[250px]/card:text-3xl">
            22,000 MAD
          </CardTitle>
          <CardAction>
            <div className="flex items-center justify-center rounded-md border p-2">
              <TrendingDown className="size-5 text-red-400" />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm text-muted-foreground">
          Deficit
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="mb-4">Co-Owners</CardDescription>
          <CardTitle className="text-2xl text-blue-400 font-semibold tabular-nums @[250px]/card:text-3xl">
            10
          </CardTitle>
          <CardAction>
            <div className="flex items-center justify-center rounded-md border p-2">
              <Users className="size-5 text-blue-400" />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm text-muted-foreground">
          3 paid · 7 partial · 0 pending
        </CardFooter>
      </Card>
    </div>
  );
}
