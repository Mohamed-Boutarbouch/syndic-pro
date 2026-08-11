'use client';

import { useState } from 'react';
import {
  BadgeCheck,
  Calculator,
  CalendarDays,
  LockKeyhole,
} from 'lucide-react';

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const months = [
  { label: 'January', value: 'January' },
  { label: 'February', value: 'February' },
  { label: 'March', value: 'March' },
  { label: 'April', value: 'April' },
  { label: 'May', value: 'May' },
  { label: 'June', value: 'June' },
  { label: 'July', value: 'July' },
  { label: 'August', value: 'August' },
  { label: 'September', value: 'September' },
  { label: 'October', value: 'October' },
  { label: 'November', value: 'November' },
  { label: 'December', value: 'December' },
];

export function FiscalYear() {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [annualTarget, setAnnualTarget] = useState('60000');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-2 mb-2">
          <CalendarDays /> Fiscal Year
        </CardTitle>
        <CardDescription>Fiscal year configuration</CardDescription>

        <CardAction>
          {isActive ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsActive(false)}>
                Cancel
              </Button>
              <Button>Save</Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setIsActive(true)}>
              Edit
            </Button>
          )}
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h2 className="cn-font-heading text-base leading-snug font-medium">
            Fiscal Period
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <p className="text-sm text-muted-foreground">Start Month</p>

              <Select disabled={!isActive}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a month" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {months.map((month) => (
                      <SelectItem
                        key={month.value}
                        value={month.value}
                        disabled={!isActive}
                      >
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <p className="text-sm text-muted-foreground">End Month</p>

              <Select disabled={!isActive}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a month" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {months.map((month) => (
                      <SelectItem
                        key={month.value}
                        value={month.value}
                        disabled={!isActive}
                      >
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h2 className="cn-font-heading text-base leading-snug font-medium mb-4">
            <div className="flex gap-2 mb-2">
              <Calculator />
              Annual Target Budget
            </div>
          </h2>
          {isActive ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Enter amount"
                  className="w-40"
                  value={annualTarget}
                  onChange={(event) => setAnnualTarget(event.target.value)}
                />
                <span className="text-sm text-muted-foreground">MAD</span>
              </div>

              <Item variant="muted">
                <ItemContent>
                  <ItemTitle>Auto-calculation</ItemTitle>
                  <ItemDescription>
                    Total weight: 10.0 pts &rarr; Share per point: 6.000 MAD
                  </ItemDescription>
                </ItemContent>
              </Item>
            </div>
          ) : (
            <div className="flex gap-4 items-center">
              <h2 className="cn-font-heading text-2xl leading-snug font-bold">
                60.000 MAD
              </h2>
              <Badge variant="secondary">6.000 MAD / point</Badge>
            </div>
          )}
        </div>

        <Separator />

        <FieldLabel htmlFor="activate-budget">
          <Field orientation="horizontal" className="gap-4">
            <div className="flex shrink-0 self-center items-center justify-center rounded-md border p-2">
              <LockKeyhole className="size-5 text-green-400" />
            </div>

            <FieldContent className="flex-1">
              <FieldTitle>Budget Active & Locked</FieldTitle>
              <FieldDescription>
                Existing co-owner quotas are immutable
              </FieldDescription>
            </FieldContent>

            <Switch id="activate-budget" className="shrink-0 self-center" />
          </Field>
        </FieldLabel>
        <Alert>
          <BadgeCheck />
          <AlertTitle>Immutable Quotas</AlertTitle>
          <AlertDescription>
            Existing co-owners monthly obligations cannot be modified. Any new
            untill will only adjust the total budget.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
