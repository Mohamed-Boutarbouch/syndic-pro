import { AlertCircleIcon } from 'lucide-react';
import type { SubmitEvent } from 'react';
import { useState } from 'react';

import { getInstallmentAmount, PAYMENT_FREQUENCIES } from '@/components/billing/billing-data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from '@/hooks/use-translation';
import type { FrequencyDialogProps, PaymentFrequency } from '@/types/properties/billing';

export function FrequencyDialog({
  open,
  onOpenChange,
  name,
  quota,
  frequency,
  onSave,
}: FrequencyDialogProps) {
  const { t, money, isRtl } = useTranslation('properties.billing.frequency_dialog');

  const dir = isRtl ? 'rtl' : 'ltr';

  const [value, setValue] = useState<PaymentFrequency>(frequency);

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setValue(frequency);
    }

    onOpenChange(nextOpen);
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    onSave(value);
    onOpenChange(false);
  }

  const installment = getInstallmentAmount(quota, value);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm" dir={dir}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t('title')}</DialogTitle>

            <DialogDescription>{name}</DialogDescription>
          </DialogHeader>

          <Alert className="mt-4">
            <AlertCircleIcon />

            <AlertTitle>{t('household_alert.title')}</AlertTitle>

            <AlertDescription>{t('household_alert.description')}</AlertDescription>
          </Alert>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">{t('payment_frequency_label')}</p>

              <Select
                value={value}
                onValueChange={(next) => {
                  if (next) {
                    setValue(next as PaymentFrequency);
                  }
                }}
              >
                <SelectTrigger className="w-full" dir={dir}>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent dir={dir}>
                  {Object.entries(PAYMENT_FREQUENCIES).map(([key, item]) => (
                    <SelectItem key={key} value={key} className="py-2">
                      <div className="flex flex-col items-start gap-0.5 text-start">
                        <span className="text-sm">{t(item.labelKey)}</span>

                        <span className="text-xs text-muted-foreground">
                          {t('payments_per_year', {
                            count: item.paymentsPerYear,
                          })}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Item variant="muted">
              <ItemContent>
                <ItemTitle>{t('installment.title')}</ItemTitle>

                <ItemDescription>
                  {t('installment.description', {
                    amount: money(installment),
                  })}
                </ItemDescription>
              </ItemContent>
            </Item>
          </div>

          <DialogFooter>
            <DialogClose
              render={
                <Button type="button" variant="outline">
                  {t('cancel_button')}
                </Button>
              }
            />

            <Button type="submit">{t('apply_button')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
