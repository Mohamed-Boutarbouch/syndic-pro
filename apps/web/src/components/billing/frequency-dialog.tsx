'use client';

import { AlertCircleIcon } from 'lucide-react';

import { SubmitEvent, useEffect, useState } from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { Button } from '@/components/ui/button';

import {
  formatMAD,
  getInstallmentAmount,
  PAYMENT_FREQUENCIES,
  type PaymentFrequency,
} from './billing-data';

type FrequencyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  quota: number;
  frequency: PaymentFrequency;
  onSave: (frequency: PaymentFrequency) => void;
};

export function FrequencyDialog({
  open,
  onOpenChange,
  name,
  quota,
  frequency,
  onSave,
}: FrequencyDialogProps) {
  const [value, setValue] = useState<PaymentFrequency>(frequency);

  useEffect(() => {
    if (open) {
      setValue(frequency);
    }
  }, [open, frequency]);

  const installment = getInstallmentAmount(quota, value);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    onSave(value);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Change Billing Frequency</DialogTitle>

            <DialogDescription>{name}</DialogDescription>
          </DialogHeader>

          <Alert className="mt-4">
            <AlertCircleIcon />
            <AlertTitle>Household co-payers will be affected</AlertTitle>
            <AlertDescription>
              Changing the billing frequency will also update the payment
              schedule for all household co-payers linked to this account.
            </AlertDescription>
          </Alert>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Payment Frequency</p>

              <Select
                value={value}
                onValueChange={(next) => {
                  setValue(next as PaymentFrequency);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {Object.entries(PAYMENT_FREQUENCIES).map(([key, item]) => (
                    <SelectItem key={key} value={key} className="py-2">
                      <div className="flex flex-col items-start gap-0.5">
                        <span className="text-sm">{item.label}</span>

                        <span className="text-xs text-muted-foreground">
                          {item.paymentsPerYear} payments/yr
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Item variant="muted">
              <ItemContent>
                <ItemTitle>Amount per installment</ItemTitle>

                <ItemDescription>
                  {formatMAD(installment)} /{' '}
                  {PAYMENT_FREQUENCIES[value].label.toLowerCase()}
                </ItemDescription>
              </ItemContent>
            </Item>
          </div>

          <DialogFooter>
            <DialogClose
              render={
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              }
            />

            <Button type="submit">Apply</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
