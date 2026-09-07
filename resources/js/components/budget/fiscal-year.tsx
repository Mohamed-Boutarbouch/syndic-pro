import { router } from '@inertiajs/react';
import {
    BadgeCheck,
    Calculator,
    CalendarDays,
    LockKeyhole,
} from 'lucide-react';
import { useState } from 'react';

import update from '@/actions/App/Http/Controllers/UpdateAnnualTargetBudgetController';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
    FieldLabel,
    FieldTitle,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemTitle,
} from '@/components/ui/item';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { formatCurrency } from '@/lib/format-currency';
import type { Budget, BudgetDistribution } from '@/types/properties/budget';

const months = [
    { label: 'January', value: '01' },
    { label: 'February', value: '02' },
    { label: 'March', value: '03' },
    { label: 'April', value: '04' },
    { label: 'May', value: '05' },
    { label: 'June', value: '06' },
    { label: 'July', value: '07' },
    { label: 'August', value: '08' },
    { label: 'September', value: '09' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' },
];

type FiscalYearProps = {
    budget: Budget | null;
    distribution: Pick<BudgetDistribution, 'totalWeight' | 'sharePerPoint'>;
};

function monthOf(dateString: string): string {
    return dateString.slice(5, 7);
}

export function FiscalYear({ budget, distribution }: FiscalYearProps) {
    const [isActive, setIsActive] = useState(false);
    const [startMonth, setStartMonth] = useState(
        budget ? monthOf(budget.startDate) : '',
    );
    const [endMonth, setEndMonth] = useState(
        budget ? monthOf(budget.endDate) : '',
    );
    const [annualTarget, setAnnualTarget] = useState(
        budget ? String(budget.totalBudget) : '0',
    );
    const [isLocked, setIsLocked] = useState(budget?.isBudgetLocked ?? false);

    const handleSave = () => {
        if (!budget) {
            return;
        }

        const startYear = budget.startDate.slice(0, 4);
        const endYear = budget.endDate.slice(0, 4);

        router.patch(
            update.url({
                property: budget.id,
                budget: budget.id,
            }),
            {
                start_date: `${startYear}-${startMonth}-01`,
                end_date: `${endYear}-${endMonth}-01`,
                total_budget: annualTarget,
                is_budget_locked: isLocked,
            },
            {
                preserveScroll: true,
                onSuccess: () => setIsActive(false),
            },
        );
    };

    const totalBudget = budget?.totalBudget ?? 0;
    const { totalWeight, sharePerPoint } = distribution;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="mb-2 flex gap-2">
                    <CalendarDays /> Fiscal Year
                </CardTitle>

                <CardDescription>Fiscal year configuration</CardDescription>

                <CardAction>
                    {isActive ? (
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsActive(false)}
                            >
                                Cancel
                            </Button>

                            <Button onClick={handleSave}>Save</Button>
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            onClick={() => setIsActive(true)}
                        >
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
                            <p className="text-sm text-muted-foreground">
                                Start Month
                            </p>

                            <Select
                                disabled={!isActive}
                                value={startMonth}
                                onValueChange={(value) =>
                                    setStartMonth(value ?? '')
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a month" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectGroup>
                                        {months.map((month) => (
                                            <SelectItem
                                                key={month.value}
                                                value={month.value}
                                            >
                                                {month.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <p className="text-sm text-muted-foreground">
                                End Month
                            </p>

                            <Select
                                disabled={!isActive}
                                value={endMonth}
                                onValueChange={(value) =>
                                    setEndMonth(value ?? '')
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a month" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectGroup>
                                        {months.map((month) => (
                                            <SelectItem
                                                key={month.value}
                                                value={month.value}
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
                    <h2 className="cn-font-heading mb-4 text-base leading-snug font-medium">
                        <span className="mb-2 flex gap-2">
                            <Calculator />
                            Annual Target Budget
                        </span>
                    </h2>

                    {isActive ? (
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    placeholder="Enter amount"
                                    className="w-40"
                                    value={annualTarget}
                                    disabled={isLocked}
                                    onChange={(event) =>
                                        setAnnualTarget(event.target.value)
                                    }
                                />

                                <span className="text-sm text-muted-foreground">
                                    MAD
                                </span>
                            </div>

                            <Item variant="muted">
                                <ItemContent>
                                    <ItemTitle>Auto-calculation</ItemTitle>

                                    <ItemDescription>
                                        Total weight: {totalWeight.toFixed(1)}{' '}
                                        pts → Share per point:{' '}
                                        {formatCurrency(sharePerPoint)}
                                    </ItemDescription>
                                </ItemContent>
                            </Item>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <h2 className="cn-font-heading text-2xl leading-snug font-bold">
                                {formatCurrency(totalBudget)}
                            </h2>

                            <Badge variant="secondary">
                                {formatCurrency(sharePerPoint)} / point
                            </Badge>
                        </div>
                    )}
                </div>

                <Separator />

                <FieldLabel htmlFor="activate-budget">
                    <Field orientation="horizontal" className="gap-4">
                        <div className="flex shrink-0 items-center justify-center self-center rounded-md border p-2">
                            <LockKeyhole
                                className={
                                    isLocked
                                        ? 'size-5 text-green-400'
                                        : 'size-5 text-muted-foreground'
                                }
                            />
                        </div>

                        <FieldContent className="flex-1">
                            <FieldTitle>Budget Active & Locked</FieldTitle>

                            <FieldDescription>
                                Existing co-owner quotas are immutable
                            </FieldDescription>
                        </FieldContent>

                        <Switch
                            id="activate-budget"
                            className="shrink-0 self-center"
                            checked={isLocked}
                            disabled={!isActive}
                            onCheckedChange={setIsLocked}
                        />
                    </Field>
                </FieldLabel>

                <Alert>
                    <BadgeCheck />

                    <AlertTitle>Immutable Quotas</AlertTitle>

                    <AlertDescription>
                        Existing co-owners monthly obligations cannot be
                        modified. Any new unit will only adjust the total
                        budget.
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    );
}
