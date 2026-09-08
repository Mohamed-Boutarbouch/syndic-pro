import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { useTranslation } from '@/hooks/use-translation';
import { formatCurrency } from '@/lib/format-currency';
import { getInitials } from '@/lib/utils';
import type { RecentPayment } from '@/types/properties/dashboard';

type RecentPaymentsProps = {
    payments: RecentPayment[];
};

export function RecentPayments({ payments }: RecentPaymentsProps) {
    const { t, tChoice } = useTranslation('properties.dashboard');

    return (
        <Card className="flex h-full flex-col">
            <CardHeader>
                <CardTitle>{t('recent_payments.title')}</CardTitle>

                <CardDescription>
                    {tChoice('recent_payments.subtitle', payments.length)}
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
                <Table>
                    <TableBody>
                        {payments.map((payment, index) => (
                            <TableRow
                                key={`${payment.name}-${payment.date}-${payment.amount}-${index}`}
                                className="border-none"
                            >
                                <TableCell className="w-9 py-3 pl-0">
                                    <Avatar className="size-9">
                                        <AvatarFallback>
                                            {getInitials(payment.name)}
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
