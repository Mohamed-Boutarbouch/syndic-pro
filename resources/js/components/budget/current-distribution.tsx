import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/format-currency';

type Distribution = {
    unit: string;
    name: string | null;
    points: number;
    amount: number;
};

type CurrentDistributionProps = {
    distribution: {
        totalWeight: number;
        sharePerPoint: number;
        units: Distribution[];
    };
};

export function CurrentDistribution({
    distribution,
}: CurrentDistributionProps) {
    const { totalWeight, units } = distribution;

    return (
        <Card className="flex min-h-0 flex-1 flex-col">
            <CardHeader>
                <CardTitle>Current Distribution</CardTitle>
                <CardDescription>
                    Total weight: {totalWeight.toFixed(1)} points
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <Table>
                    <TableBody>
                        {units.map((unit) => (
                            <TableRow key={unit.unit}>
                                <TableCell className="py-3 pl-0">
                                    <p className="text-sm font-medium">
                                        {unit.unit}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {unit.name ?? 'Unassigned'}
                                    </p>
                                </TableCell>
                                <TableCell className="py-3 pr-0 text-right">
                                    <p className="text-sm font-semibold tabular-nums">
                                        {formatCurrency(unit.amount)}
                                    </p>
                                    <p className="text-xs text-muted-foreground tabular-nums">
                                        coeff × {unit.points.toFixed(1)}
                                    </p>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
