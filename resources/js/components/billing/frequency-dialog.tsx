import { AlertCircleIcon } from 'lucide-react';
import type { SubmitEvent } from 'react';
import { useState } from 'react';

import {
    getInstallmentAmount,
    PAYMENT_FREQUENCIES,
} from '@/components/billing/billing-data';
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
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemTitle,
} from '@/components/ui/item';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { formatCurrency } from '@/lib/format-currency';
import type {
    FrequencyDialogProps,
    PaymentFrequency,
} from '@/types/properties/billing';

export function FrequencyDialog({
    open,
    onOpenChange,
    name,
    quota,
    frequency,
    onSave,
}: FrequencyDialogProps) {
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
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Change Billing Frequency</DialogTitle>

                        <DialogDescription>{name}</DialogDescription>
                    </DialogHeader>

                    <Alert className="mt-4">
                        <AlertCircleIcon />

                        <AlertTitle>
                            Household co-payers will be affected
                        </AlertTitle>

                        <AlertDescription>
                            Changing the billing frequency will also update the
                            payment schedule for all household co-payers linked
                            to this account.
                        </AlertDescription>
                    </Alert>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <p className="text-sm font-medium">
                                Payment Frequency
                            </p>

                            <Select
                                value={value}
                                onValueChange={(next) => {
                                    if (next) {
                                        setValue(next as PaymentFrequency);
                                    }
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent>
                                    {Object.entries(PAYMENT_FREQUENCIES).map(
                                        ([key, item]) => (
                                            <SelectItem
                                                key={key}
                                                value={key}
                                                className="py-2"
                                            >
                                                <div className="flex flex-col items-start gap-0.5">
                                                    <span className="text-sm">
                                                        {item.label}
                                                    </span>

                                                    <span className="text-xs text-muted-foreground">
                                                        {item.paymentsPerYear}{' '}
                                                        payments/yr
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <Item variant="muted">
                            <ItemContent>
                                <ItemTitle>Amount per installment</ItemTitle>

                                <ItemDescription>
                                    {formatCurrency(installment)} /{' '}
                                    {PAYMENT_FREQUENCIES[
                                        value
                                    ].label.toLowerCase()}
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
