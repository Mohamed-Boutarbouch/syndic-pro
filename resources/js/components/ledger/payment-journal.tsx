import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { Notebook, Plus } from 'lucide-react';
import { useState } from 'react';

import store from '@/actions/App/Http/Controllers/Ledger/StorePaymentController';
import { CoOwnerSelect } from '@/components/ledger/co-owner-select';
import { useColumns } from '@/components/ledger/columns';
import { DataTable } from '@/components/ledger/data-table';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/use-translation';
import type { CoOwnerOption, PaymentLog } from '@/types/properties/ledger';

type PaymentJournalProps = {
  propertyId: string;
  coOwners: CoOwnerOption[];
  payments: PaymentLog[];
  transactionCount: number;
};

export function PaymentJournal({
  propertyId,
  coOwners,
  payments,
  transactionCount,
}: PaymentJournalProps) {
  const { t, tChoice } = useTranslation('properties.ledger.payment_journal');
  const columns = useColumns();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());

  const { data, setData, post, processing, errors, reset } = useForm({
    unit_co_owner_id: '',
    amount: '',
    paid_at: format(new Date(), 'yyyy-MM-dd'),
    method: 'cash',
    reference: '',
    notes: '',
    partial: false,
  });

  function submit() {
    post(store.url({ property: propertyId }), {
      preserveScroll: true,
      onSuccess: () => {
        reset();
        setDate(new Date());
        setOpen(false);
      },
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Notebook />
          {t('title')}
        </CardTitle>

        <CardDescription>{tChoice('subtitle', transactionCount)}</CardDescription>

        <CardAction>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
              render={
                <Button>
                  <Plus data-icon="inline-start" />
                  {t('log_payment_button')}
                </Button>
              }
            />

            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Plus />
                  {t('dialog.title')}
                </DialogTitle>

                <DialogDescription>{t('dialog.description')}</DialogDescription>
              </DialogHeader>

              <FieldGroup>
                <CoOwnerSelect
                  value={data.unit_co_owner_id || null}
                  onValueChange={(value) => setData('unit_co_owner_id', value ?? '')}
                  coOwners={coOwners}
                />

                {errors.unit_co_owner_id && <FieldError>{errors.unit_co_owner_id}</FieldError>}

                <div className="flex justify-between gap-4">
                  <Field>
                    <FieldLabel htmlFor="amount">{t('dialog.amount_label')}</FieldLabel>

                    <Input
                      type="number"
                      step="1"
                      id="amount"
                      name="amount"
                      placeholder={t('dialog.amount_placeholder')}
                      value={data.amount}
                      onChange={(event) => setData('amount', event.target.value)}
                    />

                    {errors.amount && <FieldError>{errors.amount}</FieldError>}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="date-picker-simple">{t('dialog.date_label')}</FieldLabel>

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
                              <span>{t('dialog.date_placeholder')}</span>
                            )}
                          </Button>
                        }
                      />

                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(selectedDate) => {
                            if (!selectedDate) {
                              return;
                            }

                            setDate(selectedDate);
                            setData('paid_at', format(selectedDate, 'yyyy-MM-dd'));
                          }}
                          defaultMonth={date}
                        />
                      </PopoverContent>
                    </Popover>

                    {errors.paid_at && <FieldError>{errors.paid_at}</FieldError>}
                  </Field>
                </div>

                <FieldLabel htmlFor="partial-payment">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>{t('dialog.partial_payment.title')}</FieldTitle>

                      <FieldDescription>{t('dialog.partial_payment.description')}</FieldDescription>
                    </FieldContent>

                    <Switch
                      id="partial-payment"
                      checked={data.partial}
                      onCheckedChange={(checked) => setData('partial', checked)}
                    />
                  </Field>
                </FieldLabel>

                <Field>
                  <FieldLabel htmlFor="notes">{t('dialog.notes_label')}</FieldLabel>

                  <Textarea
                    id="notes"
                    placeholder={t('dialog.notes_placeholder')}
                    value={data.notes}
                    onChange={(event) => setData('notes', event.target.value)}
                  />
                </Field>
              </FieldGroup>

              <div className="mt-4 flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setOpen(false)} disabled={processing}>
                  {t('dialog.cancel_button')}
                </Button>

                <Button onClick={submit} disabled={processing}>
                  {processing ? t('dialog.saving_button') : t('dialog.save_button')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardAction>
      </CardHeader>

      <CardContent>
        <DataTable columns={columns} data={payments} />
      </CardContent>
    </Card>
  );
}
