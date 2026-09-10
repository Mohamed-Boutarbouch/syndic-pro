import { AlertCircle, CheckCircle2, ChevronRightIcon, Clock } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/hooks/use-translation';
import type { CoOwnerStatusData } from '@/types/properties/ledger';

type CoOwnerStatusProps = {
  coOwners: CoOwnerStatusData[];
  title?: string;
  description?: string;
};

function getTotalPaid(coOwner: CoOwnerStatusData) {
  return coOwner.payments.reduce((total, payment) => total + payment.amount, 0);
}

function getStatus(paid: number, quota: number) {
  if (paid >= quota) {
    return {
      key: 'paid',
      icon: CheckCircle2,
      className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    };
  }

  if (paid > 0) {
    return {
      key: 'partial',
      icon: Clock,
      className: 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
    };
  }

  return {
    key: 'unpaid',
    icon: AlertCircle,
    className: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
  };
}

function CoOwnerRow({ coOwner }: { coOwner: CoOwnerStatusData }) {
  const { t, money, isRtl } = useTranslation('properties.ledger.co_owner_status');

  const paid = getTotalPaid(coOwner);

  const percentage =
    coOwner.quota > 0 ? Math.min(Math.round((paid / coOwner.quota) * 100), 100) : 0;

  const remaining = Math.max(coOwner.quota - paid, 0);

  const status = getStatus(paid, coOwner.quota);
  const StatusIcon = status.icon;

  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg border p-3 text-start transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          />
        }
      >
        <Avatar className="size-6 shrink-0">
          <AvatarFallback className="text-[10px] font-medium">{coOwner.initials}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="truncate text-xs font-medium">{coOwner.name}</span>

              <Badge variant="outline" className={status.className}>
                <StatusIcon data-icon="inline-start" />

                {t(`status.${status.key}`)}
              </Badge>
            </div>

            <span className="shrink-0 text-xs text-muted-foreground">
              {t('balance_summary', {
                paid: money(paid),
                quota: money(coOwner.quota),
              })}

              {remaining > 0 &&
                ` ${t('balance_remaining_suffix', {
                  amount: money(remaining),
                })}`}
            </span>
          </div>

          <Progress value={percentage} className="mt-1 h-2" />
        </div>

        <ChevronRightIcon
          className={`size-4 shrink-0 text-muted-foreground ${isRtl ? 'rotate-180' : ''}`}
        />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <Avatar className="size-6">
                <AvatarFallback className="text-[10px] font-medium">
                  {coOwner.initials}
                </AvatarFallback>
              </Avatar>

              {coOwner.name}
            </div>
          </DialogTitle>

          <DialogDescription>
            {t('detail_dialog.quota_label', {
              unit: coOwner.unit,
              amount: money(coOwner.quota),
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">
              {t('detail_dialog.progress_label')}
            </span>

            <span className="text-end text-sm font-medium">
              {t('detail_dialog.progress_summary', {
                paid: money(paid),
                quota: money(coOwner.quota),
                percent: percentage,
              })}
            </span>
          </div>

          <Progress value={percentage} className="h-2" />
        </div>

        <Separator />

        <ScrollArea className="h-72 rounded-md border">
          <div className="p-4">
            {coOwner.payments.length > 0 ? (
              coOwner.payments.map((payment) => (
                <Item key={payment.id} variant="outline" className="mb-2">
                  <ItemContent>
                    <ItemTitle>{payment.date}</ItemTitle>

                    <ItemDescription>{t('detail_dialog.payment_received')}</ItemDescription>
                  </ItemContent>

                  <ItemActions>
                    <span className="text-sm font-medium">{money(payment.amount)}</span>
                  </ItemActions>
                </Item>
              ))
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground">
                {t('detail_dialog.empty_state')}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export function CoOwnerStatus({ coOwners, title, description }: CoOwnerStatusProps) {
  const { t } = useTranslation('properties.ledger.co_owner_status');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title ?? t('title')}</CardTitle>

        <CardDescription>{description ?? t('description')}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          {coOwners.map((coOwner) => (
            <CoOwnerRow key={coOwner.id} coOwner={coOwner} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
