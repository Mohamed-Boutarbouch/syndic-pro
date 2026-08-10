'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';

type MonthlyPoint = {
  month: string;
  collected: number;
  target: number;
};

const data: MonthlyPoint[] = [
  { month: 'Nov', collected: 4700, target: 4700 },
  { month: 'Dec', collected: 4200, target: 4700 },
  { month: 'Jan', collected: 4550, target: 4700 },
  { month: 'Feb', collected: 3600, target: 4700 },
  { month: 'Mar', collected: 4300, target: 4700 },
  { month: 'Apr', collected: 3900, target: 4700 },
  { month: 'May', collected: 3550, target: 4700 },
  { month: 'Jun', collected: 0, target: 4700 },
  { month: 'Jul', collected: 0, target: 4700 },
  { month: 'Aug', collected: 0, target: 4700 },
  { month: 'Sep', collected: 0, target: 4700 },
  { month: 'Oct', collected: 0, target: 4700 },
];

const chartConfig = {
  collected: {
    label: 'Collected',
    color: 'var(--color-chart-1)',
  },
  target: {
    label: 'Target',
    color: 'var(--color-chart-2)',
  },
} satisfies ChartConfig;

export function MonthlyCollection() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Monthly Collection</CardTitle>
        <CardDescription>
          Collected vs monthly target · Nov 2025 – Oct 2026
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80 w-full">
          <BarChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="collected" fill="var(--color-collected)" radius={2} />
            <Bar dataKey="target" fill="var(--color-target)" radius={2} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
