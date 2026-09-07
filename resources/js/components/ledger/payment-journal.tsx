import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { Notebook, Plus } from 'lucide-react';
import { useState } from 'react';

import store from '@/actions/App/Http/Controllers/StorePaymentController';

import { CoOwnerSelect } from '@/components/ledger/co-owner-select';
import { columns } from '@/components/ledger/columns';
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { CoOwnerOption, PaymentLog } from '@/types/properties/ledger';

type PaymentJournalProps = {
    propertyId: number;
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
                    Payment Journal
                </CardTitle>

                <CardDescription>
                    {transactionCount} transactions shown
                </CardDescription>

                <CardAction>
                    <Dialog open={open} onOpenChange={setOpen}>
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
                                    value={data.unit_co_owner_id || null}
                                    onValueChange={(value) =>
                                        setData('unit_co_owner_id', value ?? '')
                                    }
                                    coOwners={coOwners}
                                />

                                {errors.unit_co_owner_id && (
                                    <FieldError>
                                        {errors.unit_co_owner_id}
                                    </FieldError>
                                )}

                                <div className="flex justify-between gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="amount">
                                            Amount (MAD)
                                        </FieldLabel>

                                        <Input
                                            type="number"
                                            step="1"
                                            id="amount"
                                            name="amount"
                                            placeholder="ex: 500"
                                            value={data.amount}
                                            onChange={(event) =>
                                                setData(
                                                    'amount',
                                                    event.target.value,
                                                )
                                            }
                                        />

                                        {errors.amount && (
                                            <FieldError>
                                                {errors.amount}
                                            </FieldError>
                                        )}
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="date-picker-simple">
                                            Date
                                        </FieldLabel>

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
                                                            <span>
                                                                Pick a date
                                                            </span>
                                                        )}
                                                    </Button>
                                                }
                                            />

                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={(
                                                        selectedDate,
                                                    ) => {
                                                        if (!selectedDate) {
                                                            return;
                                                        }

                                                        setDate(selectedDate);
                                                        setData(
                                                            'paid_at',
                                                            format(
                                                                selectedDate,
                                                                'yyyy-MM-dd',
                                                            ),
                                                        );
                                                    }}
                                                    defaultMonth={date}
                                                />
                                            </PopoverContent>
                                        </Popover>

                                        {errors.paid_at && (
                                            <FieldError>
                                                {errors.paid_at}
                                            </FieldError>
                                        )}
                                    </Field>
                                </div>

                                <FieldLabel htmlFor="partial-payment">
                                    <Field orientation="horizontal">
                                        <FieldContent>
                                            <FieldTitle>
                                                Partial Payment
                                            </FieldTitle>

                                            <FieldDescription>
                                                Balance will be completed later
                                            </FieldDescription>
                                        </FieldContent>

                                        <Switch
                                            id="partial-payment"
                                            checked={data.partial}
                                            onCheckedChange={(checked) =>
                                                setData('partial', checked)
                                            }
                                        />
                                    </Field>
                                </FieldLabel>

                                <Field>
                                    <FieldLabel htmlFor="notes">
                                        Notes
                                    </FieldLabel>

                                    <Textarea
                                        id="notes"
                                        placeholder="Optional remarks..."
                                        value={data.notes}
                                        onChange={(event) =>
                                            setData('notes', event.target.value)
                                        }
                                    />
                                </Field>
                            </FieldGroup>

                            <div className="mt-4 flex justify-end gap-2">
                                <Button
                                    variant="secondary"
                                    onClick={() => setOpen(false)}
                                    disabled={processing}
                                >
                                    Cancel
                                </Button>

                                <Button onClick={submit} disabled={processing}>
                                    {processing ? 'Saving…' : 'Save Payment'}
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
