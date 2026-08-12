'use client';

import { Plus, UserRoundX, UsersRoundIcon } from 'lucide-react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Field, FieldGroup } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import type { CoOwnerPayment, HouseholdCoPayer } from './billing-data';

import { formatMAD, getProgress } from './billing-data';

type HouseholdCoPayersProps = {
  payment: CoOwnerPayment;
  onAdd?: (coPayer: HouseholdCoPayer) => void;
};

export function HouseholdCoPayers({ payment }: HouseholdCoPayersProps) {
  const coPayers = payment.coPayers ?? [];

  const totalCollected = coPayers.reduce(
    (total, coPayer) => total + coPayer.collected,
    0,
  );

  const progress = getProgress(totalCollected, payment.quota);

  return (
    <div className="border-t px-4 py-3">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UsersRoundIcon className="size-4" />

          <span className="text-sm font-medium">Household Co-Payers</span>
        </div>

        <Dialog>
          <form>
            <DialogTrigger
              render={
                <Button variant="outline">
                  <Plus data-plus="inline-start" /> Add
                </Button>
              }
            />
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Add Co-Payer</DialogTitle>
                <DialogDescription>
                  Household of Sara El Fassi · Quota: 6,000 MAD/yr
                </DialogDescription>
              </DialogHeader>
              <FieldGroup>
                <Field>
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input
                    id="full-name"
                    name="full-name"
                    placeholder="e.g. John Smith"
                  />
                </Field>
                <Field>
                  <Label htmlFor="relationship">Relationship</Label>
                  <Input
                    id="relationship"
                    name="relationship"
                    placeholder="e.g. Spouse, Son..."
                  />
                </Field>
                <Field>
                  <Label htmlFor="quota-share">Quota Share (%)</Label>
                  <Input
                    type="number"
                    step="1"
                    id="quota-share"
                    name="quota-share"
                    placeholder="10"
                  />
                </Field>
              </FieldGroup>
              <DialogFooter>
                <DialogClose
                  render={<Button variant="outline">Cancel</Button>}
                />
                <Button type="submit">Add</Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>

      <div className="rounded-md border bg-muted/30 p-2.5">
        <Item className="p-0">
          <ItemContent>
            <ItemTitle className="text-xs">Shared Household Goal</ItemTitle>
          </ItemContent>

          <span className="text-xs font-medium">
            {formatMAD(payment.quota)}
          </span>
        </Item>

        <Progress value={progress} className="mt-2 h-2" />

        <div className="mt-1.5 flex justify-between text-xs text-muted-foreground">
          <span>{formatMAD(totalCollected)} collected</span>

          <span>{formatMAD(payment.quota - totalCollected)} remaining</span>
        </div>
      </div>

      {coPayers.length === 0 ? (
        <Empty className="py-8">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UserRoundX />
            </EmptyMedia>

            <EmptyTitle>No co-payers</EmptyTitle>

            <EmptyDescription className="max-w-xs text-pretty">
              No household members are linked to this payment yet. Click
              &quot;Add&quot; to link a co-payer.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="mt-3 space-y-2">
          {coPayers.map((coPayer) => (
            <CoPayer
              key={coPayer.id}
              coPayer={coPayer}
              householdQuota={payment.quota}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CoPayer({
  coPayer,
  householdQuota,
}: {
  coPayer: HouseholdCoPayer;
  householdQuota: number;
}) {
  const quota = householdQuota * (coPayer.sharePercentage / 100);

  const progress = getProgress(coPayer.collected, quota);

  return (
    <Item className="px-0">
      <ItemMedia>
        <Avatar className="size-6">
          <AvatarFallback className="text-[10px] font-medium">
            {coPayer.initials}
          </AvatarFallback>
        </Avatar>
      </ItemMedia>

      <ItemContent className="min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <ItemTitle className="truncate text-xs">{coPayer.name}</ItemTitle>

            <Badge
              variant="outline"
              className="h-4 shrink-0 px-1.5 text-[10px]"
            >
              {coPayer.relationship}
            </Badge>
          </div>

          <span className="shrink-0 text-xs text-muted-foreground">
            {coPayer.sharePercentage}% · {formatMAD(coPayer.collected)}/
            {formatMAD(quota)}
          </span>
        </div>

        <Progress value={progress} className="mt-1" />
      </ItemContent>
    </Item>
  );
}
