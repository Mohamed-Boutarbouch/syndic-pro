import { Link } from '@inertiajs/react';

import ledger from '@/actions/App/Http/Controllers/LedgerController';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { buttonVariants } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/format-currency';

type Owner = {
    name: string;
    pct: number;
};

type Property = {
    id: number;
    name: string;
};

type CollectionProgressProps = {
    property: Property;
};

const owners: Owner[] = [
    { name: 'Ahmed Benali', pct: 58 },
    { name: 'Karim Alaoui', pct: 100 },
    { name: 'Nadia Cherkaoui', pct: 42 },
    { name: 'Hassan Tazi', pct: 100 },
    { name: 'Laila Mansouri', pct: 25 },
];
const totalOwners = 10;
const collected = 38000;
const target = 60000;
const overallPct = Math.round((collected / target) * 100);

function initials(name: string) {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}

export function CollectionProgress({ property }: CollectionProgressProps) {
    const hiddenCount = totalOwners - owners.length;

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="space-y-1.5">
                    <CardTitle>Collection Progress</CardTitle>
                    <CardDescription>
                        Collected vs annual fiscal target
                    </CardDescription>
                </div>
                <span className="text-lg font-semibold tabular-nums">
                    {overallPct}%
                </span>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Progress
                        value={overallPct}
                        className="**:data-[slot=progress-track]:h-2"
                    />
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                            {formatCurrency(collected)} collected
                        </span>
                        <span className="text-muted-foreground">
                            Target: {formatCurrency(target)}
                        </span>
                    </div>
                </div>
                <div className="space-y-4 pt-2">
                    {owners.map((owner) => (
                        <div
                            key={owner.name}
                            className="flex items-center gap-3"
                        >
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                    {initials(owner.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1.5">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">
                                        {owner.name}
                                    </span>
                                    <span className="text-muted-foreground tabular-nums">
                                        {owner.pct}%
                                    </span>
                                </div>
                                <Progress value={owner.pct} className="h-2" />
                            </div>
                        </div>
                    ))}
                </div>
                {hiddenCount > 0 && (
                    <Link
                        href={ledger(property.id).url}
                        className={buttonVariants({
                            variant: 'secondary',
                            size: 'sm',
                        })}
                    >
                        {'>'} {hiddenCount} more co-owners — see Ledger
                    </Link>
                )}
            </CardContent>
        </Card>
    );
}
