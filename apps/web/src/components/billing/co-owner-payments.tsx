// TODO: Collapsible opens when a select item is clicked from the frequency dialog
'use client';

import { ChevronDownIcon, Plus, UsersRoundIcon } from 'lucide-react';

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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Field, FieldGroup } from '../ui/field';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

const items = [
  { label: 'Select a frequency', value: null, paymentFrequency: '' },
  { label: 'Monthly', value: 'monthly', paymentFrequency: '12 payments/yr' },
  { label: 'Bimonthly', value: 'bimonthly', paymentFrequency: '6 payments/yr' },
  { label: 'Quarterly', value: 'quarterly', paymentFrequency: '4 payments/yr' },
  {
    label: 'Semi-annual',
    value: 'semi-annual',
    paymentFrequency: '2 payments/yr',
  },
] as const;

export function CoOwnerPayments() {
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <Card>
      <CardContent className="p-0">
        <Collapsible>
          {/* Everything above the expanded content is clickable */}
          <CollapsibleTrigger
            nativeButton={false}
            render={
              <div
                onClick={(e) => {
                  if (dialogOpen) e.preventDefault();
                }}
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  'h-auto w-full flex-col items-stretch gap-0 rounded-md p-4 text-left',
                )}
              >
                {/* Header */}
                <Item className="p-0">
                  <ItemMedia>
                    <Avatar className="size-8">
                      <AvatarFallback className="text-xs font-medium">
                        NC
                      </AvatarFallback>
                    </Avatar>
                  </ItemMedia>

                  <ItemContent className="min-w-0">
                    <div className="flex items-center gap-2">
                      <ItemTitle>Nadia Cherkaoui</ItemTitle>

                      <Badge variant="outline">Syndic</Badge>

                      <Badge className="bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">
                        Bimonthly
                      </Badge>

                      <Badge variant="outline">2 co-payers</Badge>
                    </div>

                    <ItemDescription>
                      Unit A-202 · 1,000 MAD/bimonthly · Quota: 6,000 MAD/yr
                    </ItemDescription>
                  </ItemContent>

                  <div className="flex shrink-0 items-center gap-2">
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <form>
                        <DialogTrigger
                          render={<Button variant="outline">Frequency</Button>}
                        />

                        <DialogContent className="sm:max-w-sm">
                          <DialogHeader>
                            <DialogTitle>Change Billing Frequency</DialogTitle>
                            <DialogDescription>
                              Nadia Cherkaoui
                            </DialogDescription>
                          </DialogHeader>

                          <Select items={items}>
                            <p className="text-sm">Payment Frequency</p>

                            <SelectTrigger className="w-full max-w-48">
                              <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                              <SelectGroup>
                                {items.map((item) => (
                                  <SelectItem
                                    key={item.value}
                                    value={item.value}
                                    className="py-2"
                                  >
                                    <div className="flex flex-col items-start gap-0.5">
                                      <span className="text-sm">
                                        {item.label}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {item.paymentFrequency}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>

                          <Item variant="muted">
                            <ItemContent>
                              <ItemTitle>Amount per installment</ItemTitle>
                              <ItemDescription>
                                500 MAD / monthly
                              </ItemDescription>
                            </ItemContent>
                          </Item>

                          <DialogFooter>
                            <DialogClose
                              render={<Button variant="outline">Cancel</Button>}
                            />
                            <Button type="submit">Apply</Button>
                          </DialogFooter>
                        </DialogContent>
                      </form>
                    </Dialog>

                    <ChevronDownIcon className="size-4 transition-transform duration-200 group-data-panel-open:rotate-180" />
                  </div>
                </Item>

                {/* Progress */}
                <div className="mt-3 flex items-center gap-2 pl-11">
                  <Progress value={42} className="flex-1" />

                  <span className="shrink-0 text-xs text-muted-foreground">
                    42%
                  </span>

                  <span className="shrink-0 text-xs text-muted-foreground">
                    · 3,500 MAD remaining
                  </span>
                </div>
              </div>
            }
          />

          {/* Expanded content */}
          <CollapsibleContent>
            <div className="border-t px-4 py-3">
              {/* Section header */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UsersRoundIcon className="size-4" />

                  <span className="text-sm font-medium">
                    Household Co-Payers
                  </span>
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

              {/* Shared goal */}
              <div className="rounded-md border bg-muted/30 p-2.5">
                <Item className="p-0">
                  <ItemContent>
                    <ItemTitle className="text-xs">
                      Shared Household Goal
                    </ItemTitle>
                  </ItemContent>

                  <span className="text-xs font-medium">6,000 MAD</span>
                </Item>

                <Progress value={42} className="mt-2" />

                <div className="mt-1.5 flex justify-between text-xs text-muted-foreground">
                  <span>2,500 MAD collected</span>
                  <span>3,500 MAD remaining</span>
                </div>
              </div>

              {/* Co-payers */}
              <div className="mt-3 space-y-2">
                <CoPayer
                  initials="NC"
                  name="Nadia Cherkaoui"
                  role="account holder"
                  percentage={0}
                  amount="0 MAD"
                  quota="3,600 MAD"
                />

                <CoPayer
                  initials="OC"
                  name="Omar Cherkaoui"
                  role="Husband"
                  percentage={60}
                  amount="1,500 MAD"
                  quota="3,600 MAD"
                />

                <CoPayer
                  initials="YC"
                  name="Youssef Cherkaoui"
                  role="Son"
                  percentage={40}
                  amount="1,000 MAD"
                  quota="2,400 MAD"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

function CoPayer({
  initials,
  name,
  role,
  percentage,
  amount,
  quota,
}: {
  initials: string;
  name: string;
  role: string;
  percentage: number;
  amount: string;
  quota: string;
}) {
  return (
    <Item className="px-0">
      <ItemMedia>
        <Avatar className="size-6">
          <AvatarFallback className="text-[10px] font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
      </ItemMedia>

      <ItemContent className="min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <ItemTitle className="text-xs">{name}</ItemTitle>

            <Badge
              variant="outline"
              className="h-4 shrink-0 px-1.5 text-[10px]"
            >
              {role}
            </Badge>
          </div>

          <span className="shrink-0 text-xs text-muted-foreground">
            {percentage}% · {amount}/{quota}
          </span>
        </div>

        <Progress value={percentage} className="mt-1" />
      </ItemContent>
    </Item>
  );
}
