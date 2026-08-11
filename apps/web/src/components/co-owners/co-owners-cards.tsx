import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Archive, Building, Store } from 'lucide-react';

export function CoOwnersCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-3 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Apartements</CardTitle>
          <CardAction>
            <div className="flex items-center justify-center rounded-md border p-2">
              <Building className="size-5 text-blue-400" />
            </div>
          </CardAction>
        </CardHeader>
        <CardContent className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          8
        </CardContent>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Commercial</CardTitle>
          <CardAction>
            <div className="flex items-center justify-center rounded-md border p-2">
              <Store className="size-5 text-yellow-400" />
            </div>
          </CardAction>
        </CardHeader>
        <CardContent className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          1
        </CardContent>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Storage</CardTitle>
          <CardAction>
            <div className="flex items-center justify-center rounded-md border p-2">
              <Archive className="size-5 text-muted-foreground" />
            </div>
          </CardAction>
        </CardHeader>
        <CardContent className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          1
        </CardContent>
      </Card>
    </div>
  );
}
