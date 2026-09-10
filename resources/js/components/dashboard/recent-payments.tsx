import { CardTable } from '@/components/card-table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { TableCell, TableRow } from '@/components/ui/table';
import { useTranslation } from '@/hooks/use-translation';
import { getInitials } from '@/lib/utils';
import type { RecentPayment } from '@/types/properties/dashboard';

type RecentPaymentsProps = {
  payments: RecentPayment[];
};

export function RecentPayments({ payments }: RecentPaymentsProps) {
  const { money, isRtl, t, tChoice } = useTranslation('properties.dashboard');

  return (
    <CardTable
      title={t('recent_payments.title')}
      description={tChoice('recent_payments.subtitle', payments.length)}
      dir={isRtl ? 'rtl' : 'ltr'}
      className="h-full"
    >
      {payments.map((payment, index) => (
        <TableRow key={`${payment.name}-${payment.date}-${payment.amount}-${index}`}>
          <TableCell className="w-9 py-3 pl-0">
            <Avatar className="size-9">
              <AvatarFallback>{getInitials(payment.name)}</AvatarFallback>
            </Avatar>
          </TableCell>

          <TableCell className="py-3">
            <p className="truncate text-sm font-medium">{payment.name}</p>

            <p className="text-sm text-muted-foreground">{payment.date}</p>
          </TableCell>

          <TableCell className="py-3 pr-0 text-right text-sm font-semibold tabular-nums">
            {money(payment.amount)}
          </TableCell>
        </TableRow>
      ))}
    </CardTable>
  );
}
