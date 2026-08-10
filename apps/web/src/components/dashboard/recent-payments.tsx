import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

type Payment = {
  name: string;
  date: string;
  amount: number;
};

const payments: Payment[] = [
  { name: 'SARL Atlas Commerce', date: '2026-08-04', amount: 750 },
  { name: 'SARL Atlas Commerce', date: '2026-07-04', amount: 750 },
  { name: 'SARL Atlas Commerce', date: '2026-06-04', amount: 750 },
  { name: 'Sara El Fassi', date: '2026-05-13', amount: 1500 },
  { name: 'Ahmed Benali', date: '2026-05-07', amount: 500 },
];

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function formatMAD(n: number) {
  return `${n.toLocaleString('en-US').replace(/,/g, '.')} MAD`;
}

export function RecentPayments() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Recent Payments</CardTitle>
        <CardDescription>Last {payments.length} transactions</CardDescription>
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
                    <AvatarFallback>{initials(payment.name)}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="py-3">
                  <p className="text-sm font-medium truncate">{payment.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {payment.date}
                  </p>
                </TableCell>
                <TableCell className="py-3 pr-0 text-right text-sm font-semibold tabular-nums">
                  {formatMAD(payment.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
