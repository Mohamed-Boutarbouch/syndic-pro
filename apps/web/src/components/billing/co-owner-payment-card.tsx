'use client';

import { useState } from 'react';
import { ChevronDownIcon, Link2Icon } from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

import { cn } from '@/lib/utils';

import {
  formatMAD,
  getInstallmentAmount,
  getPaymentFrequency,
  getProgress,
  getRemaining,
  type CoOwnerPayment,
  type PaymentFrequency,
} from './billing-data';

import { FrequencyDialog } from './frequency-dialog';
import { HouseholdCoPayers } from './household-co-payers';

type CoOwnerPaymentCardProps = {
  payment: CoOwnerPayment;
  onFrequencyChange?: (paymentId: string, frequency: PaymentFrequency) => void;
};

export function CoOwnerPaymentCard({
  payment,
  onFrequencyChange,
}: CoOwnerPaymentCardProps) {
  const [open, setOpen] = useState(false);
  const [frequencyDialogOpen, setFrequencyDialogOpen] = useState(false);

  const frequency = getPaymentFrequency(payment.frequency);

  const progress = getProgress(payment.collected, payment.quota);

  const remaining = getRemaining(payment.collected, payment.quota);

  const installment = getInstallmentAmount(payment.quota, payment.frequency);

  const hasCoPayers = payment.coPayers && payment.coPayers.length > 1;

  return (
    <>
      <div className="rounded-lg border bg-card">
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger
            nativeButton={false}
            render={
              <div
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  'group h-auto w-full flex-col items-stretch gap-0 rounded-lg p-4 text-left',
                )}
                onClick={(event) => {
                  const target = event.target as HTMLElement;

                  if (target.closest('[data-collapsible-ignore]')) {
                    event.preventDefault();
                  }
                }}
              >
                <Item className="p-0">
                  <ItemMedia>
                    <Avatar className="size-8">
                      <AvatarFallback className="text-xs font-medium">
                        {payment.initials}
                      </AvatarFallback>
                    </Avatar>
                  </ItemMedia>

                  <ItemContent className="min-w-0">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <ItemTitle className="truncate">{payment.name}</ItemTitle>

                      {payment.role && (
                        <Badge variant="outline">{payment.role}</Badge>
                      )}

                      <Badge
                        variant="outline"
                        className={cn(frequency.badgeClass)}
                      >
                        {frequency.label}
                      </Badge>

                      {hasCoPayers && (
                        <Badge variant="outline">
                          <Link2Icon className="size-3" />
                          {payment.coPayers!.length - 1} co-payers
                        </Badge>
                      )}
                    </div>

                    <ItemDescription>
                      {payment.unit}
                      {' · '}
                      {formatMAD(installment)}/{frequency.label.toLowerCase()}
                      {' · '}
                      Quota: {formatMAD(payment.quota)}/yr
                    </ItemDescription>
                  </ItemContent>

                  <div className="flex shrink-0 items-center gap-2">
                    <div
                      data-collapsible-ignore
                      onPointerDown={(event) => {
                        event.stopPropagation();
                      }}
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFrequencyDialogOpen(true);
                        }}
                      >
                        <span className="hidden sm:inline">Frequency</span>

                        <span className="sm:hidden">{frequency.label}</span>
                      </Button>
                    </div>

                    <ChevronDownIcon
                      className={cn(
                        'size-4 transition-transform duration-200',
                        open && 'rotate-180',
                      )}
                    />
                  </div>
                </Item>

                <div className="mt-3 flex items-center gap-2 pl-11">
                  <Progress value={progress} className="flex-1" />

                  <span className="shrink-0 text-xs text-muted-foreground">
                    {progress}%
                  </span>

                  {remaining > 0 && (
                    <span className="shrink-0 text-xs text-muted-foreground">
                      · {formatMAD(remaining)} remaining
                    </span>
                  )}

                  {progress === 100 && (
                    <Badge
                      variant="outline"
                      className="shrink-0 border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    >
                      Paid off
                    </Badge>
                  )}
                </div>
              </div>
            }
          />

          <CollapsibleContent>
            <HouseholdCoPayers payment={payment} />
          </CollapsibleContent>
        </Collapsible>
      </div>

      <FrequencyDialog
        open={frequencyDialogOpen}
        onOpenChange={setFrequencyDialogOpen}
        name={payment.name}
        quota={payment.quota}
        frequency={payment.frequency}
        onSave={(nextFrequency) => {
          onFrequencyChange?.(payment.id, nextFrequency);
        }}
      />
    </>
  );
}
