import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { formatCurrency } from '@/lib/format-currency';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

type Payment = {
    name: string;
    initials: string;
    date: string;
    amount: number;
};

const payments: Payment[] = [
    {
        name: 'SARL Atlas Commerce',
        initials: 'AC',
        date: '2026-08-04',
        amount: 750,
    },
    {
        name: 'SARL Atlas Commerce',
        initials: 'AC',
        date: '2026-07-04',
        amount: 750,
    },
    {
        name: 'SARL Atlas Commerce',
        initials: 'AC',
        date: '2026-06-04',
        amount: 750,
    },
    { name: 'Sara El Fassi', initials: 'SE', date: '2026-05-13', amount: 1500 },
    { name: 'Ahmed Benali', initials: 'AB', date: '2026-05-07', amount: 500 },
];

export function RecentPayments() {
    return (
        <Card className="flex h-full flex-col">
            <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
                <CardDescription>
                    Last {payments.length} transactions
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <Table>
                    <TableBody>
                        {payments.map((payment, i) => (
                            <TableRow
                                key={`${payment.name}-${payment.date}-${i}`}
                                className="border-none"
                            >
                                <TableCell className="w-9 py-3 pl-0">
                                    <Avatar className="h-9 w-9">
                                        <AvatarFallback>
                                            {payment.initials}
                                        </AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="py-3">
                                    <p className="truncate text-sm font-medium">
                                        {payment.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {payment.date}
                                    </p>
                                </TableCell>
                                <TableCell className="py-3 pr-0 text-right text-sm font-semibold tabular-nums">
                                    {formatCurrency(payment.amount)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
