import { cn } from 'cn';
import { ChevronDownIcon, Link2Icon } from 'lucide-react';
import { useState } from 'react';

import {
    getInstallmentAmount,
    getPaymentFrequency,
    getProgress,
    getRemaining,
} from '@/components/billing/billing-data';
import { FrequencyDialog } from '@/components/billing/frequency-dialog';
import { HouseholdCoPayers } from '@/components/billing/household-co-payers';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
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
import { Progress } from '@/components/ui/progress';
import { useTranslation } from '@/hooks/use-translation';
import { formatCurrency } from '@/lib/format-currency';
import type { CoOwnerPaymentCardProps } from '@/types/properties/billing';

export function CoOwnerPaymentCard({
    payment,
    onFrequencyChange,
}: CoOwnerPaymentCardProps) {
    const { t, tChoice } = useTranslation();

    const [open, setOpen] = useState(false);
    const [frequencyDialogOpen, setFrequencyDialogOpen] = useState(false);

    const frequency = getPaymentFrequency(payment.frequency);
    const translatedFrequency = t(frequency.labelKey);

    const progress = getProgress(payment.collected, payment.quota);
    const remaining = getRemaining(payment.collected, payment.quota);
    const installment = getInstallmentAmount(payment.quota, payment.frequency);

    const coPayerCount = Math.max(0, (payment.coPayers?.length ?? 0) - 1);

    const hasCoPayers = coPayerCount > 0;

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

                                    if (
                                        target.closest(
                                            '[data-collapsible-ignore]',
                                        )
                                    ) {
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
                                            <ItemTitle className="truncate">
                                                {payment.name}
                                            </ItemTitle>

                                            {payment.role && (
                                                <Badge variant="outline">
                                                    {payment.role}
                                                </Badge>
                                            )}

                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    frequency.badgeClass,
                                                )}
                                            >
                                                {translatedFrequency}
                                            </Badge>

                                            {hasCoPayers && (
                                                <Badge variant="outline">
                                                    <Link2Icon className="size-3" />
                                                    {tChoice(
                                                        'properties.billing.payment_card.co_payers',
                                                        coPayerCount,
                                                    )}
                                                </Badge>
                                            )}
                                        </div>

                                        <ItemDescription>
                                            {t(
                                                'properties.billing.payment_card.description',
                                                {
                                                    unit: payment.unit,
                                                    installment:
                                                        formatCurrency(
                                                            installment,
                                                        ),
                                                    frequency:
                                                        translatedFrequency,
                                                    quota: formatCurrency(
                                                        payment.quota,
                                                    ),
                                                },
                                            )}
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
                                                    setFrequencyDialogOpen(
                                                        true,
                                                    );
                                                }}
                                            >
                                                <span className="hidden sm:inline">
                                                    {t(
                                                        'properties.billing.payment_card.frequency_button',
                                                    )}
                                                </span>

                                                <span className="sm:hidden">
                                                    {translatedFrequency}
                                                </span>
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
                                    <Progress
                                        value={progress}
                                        className="min-w-0 flex-1 **:data-[slot=progress-track]:h-2"
                                    />

                                    <span className="shrink-0 text-xs text-muted-foreground">
                                        {progress}%
                                    </span>

                                    {remaining > 0 && (
                                        <span className="shrink-0 text-xs text-muted-foreground">
                                            {t(
                                                'properties.billing.payment_card.remaining',
                                                {
                                                    amount: formatCurrency(
                                                        remaining,
                                                    ),
                                                },
                                            )}
                                        </span>
                                    )}

                                    {progress === 100 && (
                                        <Badge
                                            variant="outline"
                                            className="shrink-0 border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                        >
                                            {t(
                                                'properties.billing.payment_card.paid_off',
                                            )}
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
