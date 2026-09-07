import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import type { ChartConfig } from '@/components/ui/chart';
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import type { MonthlyCollectionPoint } from '@/types/properties/dashboard';

type MonthlyCollectionProps = {
    data: MonthlyCollectionPoint[];
};

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

export function MonthlyCollection({ data }: MonthlyCollectionProps) {
    return (
        <Card className="flex h-full flex-col">
            <CardHeader>
                <CardTitle>Monthly Collection</CardTitle>

                <CardDescription>
                    Collected vs monthly target · Nov 2025 – Oct 2026
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
                <ChartContainer
                    config={chartConfig}
                    className="h-full min-h-70 w-full"
                >
                    <BarChart data={data}>
                        <CartesianGrid vertical={false} />

                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />

                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />

                        <ChartTooltip content={<ChartTooltipContent />} />

                        <ChartLegend content={<ChartLegendContent />} />

                        <Bar
                            dataKey="collected"
                            fill="var(--color-collected)"
                            radius={2}
                        />

                        <Bar
                            dataKey="target"
                            fill="var(--color-target)"
                            radius={2}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
