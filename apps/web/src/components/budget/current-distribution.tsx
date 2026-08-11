import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

type Distribution = {
  unit: string;
  name: string;
  points: number;
  amount: number;
};

const distributions: Distribution[] = [
  { unit: 'A-101', name: 'Ahmed Benali', points: 1, amount: 6000 },
  { unit: 'A-201', name: 'Karim Alaoui', points: 1, amount: 6000 },
  { unit: 'A-202', name: 'Nadia Cherkaoui', points: 1, amount: 6000 },
  { unit: 'A-301', name: 'Hassan Tazi', points: 1, amount: 6000 },
  { unit: 'A-302', name: 'Laila Mansouri', points: 1, amount: 6000 },
  { unit: 'A-401', name: 'Youssef Idrissi', points: 1, amount: 6000 },
  { unit: 'A-402', name: 'Sara El Fassi', points: 1, amount: 6000 },
  { unit: 'A-501', name: 'Omar Bennani', points: 1, amount: 6000 },
  { unit: 'A-502', name: 'Salma Amrani', points: 1, amount: 6000 },
  { unit: 'A-601', name: 'Mehdi Chraibi', points: 1, amount: 6000 },
];

function formatMAD(amount: number) {
  return `${amount.toLocaleString('en-US').replace(/,/g, '.')} MAD/yr`;
}

export function CurrentDistribution() {
  const totalPoints = distributions.reduce(
    (total, distribution) => total + distribution.points,
    0,
  );

  return (
    <Card className="flex min-h-0 flex-1 flex-col">
      <CardHeader>
        <CardTitle>Current Distribution</CardTitle>
        <CardDescription>
          Total weight: {totalPoints.toFixed(1)} points
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <Table>
          <TableBody>
            {distributions.map((distribution) => (
              <TableRow key={distribution.unit}>
                <TableCell className="py-3 pl-0">
                  <p className="text-sm font-medium">{distribution.unit}</p>
                  <p className="text-xs text-muted-foreground">
                    {distribution.name}
                  </p>
                </TableCell>

                <TableCell className="py-3 pr-0 text-right">
                  <p className="text-sm font-semibold tabular-nums">
                    {formatMAD(distribution.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    coeff × {distribution.points.toFixed(1)}
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
