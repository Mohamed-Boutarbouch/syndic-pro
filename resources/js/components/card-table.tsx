import { cn } from 'cn';
import type { ReactNode } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody } from '@/components/ui/table';

type CardTableProps = {
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  dir?: 'ltr' | 'rtl';
  className?: string;
  contentClassName?: string;
};

export function CardTable({
  title,
  description,
  children,
  dir,
  className,
  contentClassName,
}: CardTableProps) {
  return (
    <Card className={cn('flex min-h-0 flex-1 flex-col', className)} dir={dir}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>

        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent className={cn('flex-1', contentClassName)}>
        <Table>
          <TableBody>{children}</TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
