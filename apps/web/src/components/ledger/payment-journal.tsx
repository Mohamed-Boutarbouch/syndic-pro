'use client';

import { Notebook, Plus } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { CoOwnerSelect } from './co-owner-select';
import { coOwners } from './co-owners-select-data';
import { DataTable } from './data-table';
import { columns } from './columns';
import { getData } from './get-data';

export function PaymentJournal() {
  const [coOwnerId, setCoOwnerId] = useState<string | null>(null);
  const [date, setDate] = useState<Date>();
  const data = getData();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Notebook />
          Payment Journal
        </CardTitle>
        <CardDescription>37 transaction shown</CardDescription>
        <CardAction>
          <Dialog>
            <form>
              <DialogTrigger
                render={
                  <Button>
                    <Plus data-icon="inline-start" />
                    Log Payment
                  </Button>
                }
              />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Plus />
                    Log Payment
                  </DialogTitle>
                  <DialogDescription>
                    Record a new contribution
                  </DialogDescription>
                </DialogHeader>
                <FieldGroup>
                  <CoOwnerSelect
                    value={coOwnerId}
                    onValueChange={setCoOwnerId}
                    coOwners={coOwners}
                  />
                  <div className="flex justify-between gap-4">
                    <Field>
                      <FieldLabel htmlFor="amount">Amount (MAD)</FieldLabel>
                      <Input
                        type="number"
                        step="1"
                        id="amount"
                        name="amount"
                        placeholder="ex: 500"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="date-picker-simple">Date</FieldLabel>
                      <Popover>
                        <PopoverTrigger
                          render={
                            <Button
                              variant="secondary"
                              id="date-picker-simple"
                              className="justify-start font-normal"
                            >
                              {date ? (
                                format(date, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          }
                        />
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            defaultMonth={date}
                          />
                        </PopoverContent>
                      </Popover>
                    </Field>
                  </div>
                  <Field>
                    <FieldLabel htmlFor="period-label">Period Label</FieldLabel>
                    <Input
                      id="period-label"
                      name="period-label"
                      placeholder="e.g. May, 2026, Q2 2026"
                    />
                  </Field>
                  <FieldLabel htmlFor="partial-payment">
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle>Partial Payment</FieldTitle>
                        <FieldDescription>
                          Balance will be completed later
                        </FieldDescription>
                      </FieldContent>
                      <Switch id="partial-payment" />
                    </Field>
                  </FieldLabel>
                  <Field>
                    <FieldLabel htmlFor="notes">Notes</FieldLabel>
                    <Textarea id="notes" placeholder="Optional remarks..." />
                  </Field>
                </FieldGroup>
              </DialogContent>
            </form>
          </Dialog>
        </CardAction>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
}
