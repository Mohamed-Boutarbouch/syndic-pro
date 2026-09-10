import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ArrowUpDown } from 'lucide-react';
import { useMemo } from 'react';

import type { DataTableFeatures } from '@/components/ledger/data-table-features';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';

import type { PaymentLog } from '@/types/properties/ledger';

const columnHelper = createColumnHelper<DataTableFeatures, PaymentLog>();

export function useColumns() {
  const { t: columnsT, money, isRtl } = useTranslation('properties.ledger.columns');
  const { t: paymentTypeT } = useTranslation('properties.ledger.payment_type');

  return useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor('date', {
          header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              {columnsT('date')}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          ),

          cell: ({ row }) => {
            const date = row.getValue<string>('date');

            return format(new Date(date), 'dd/MM/yyyy');
          },
        }),

        columnHelper.accessor('coOwner', {
          header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              {columnsT('co_owner')}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          ),

          cell: ({ row }) => {
            const coOwner = row.getValue<string>('coOwner');

            const initials = coOwner
              .split(' ')
              .map((word) => word[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();

            return (
              <div className="flex items-center gap-2">
                <Avatar className="size-7">
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>

                <span>{coOwner}</span>
              </div>
            );
          },
        }),

        columnHelper.accessor('period', {
          header: () => columnsT('period'),

          cell: ({ row }) => (
            <span className="text-muted-foreground">{row.getValue<string>('period')}</span>
          ),
        }),

        columnHelper.accessor('type', {
          header: () => columnsT('type'),

          cell: ({ row }) => {
            const type = row.getValue<PaymentLog['type']>('type');

            return (
              <Badge
                variant="outline"
                className={
                  type === 'full'
                    ? 'border-green-600 text-green-600'
                    : 'border-orange-600 text-orange-600'
                }
              >
                {paymentTypeT(type)}
              </Badge>
            );
          },
        }),

        columnHelper.accessor('amount', {
          header: ({ column }) => (
            <div className="text-right">
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              >
                {columnsT('amount')}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ),

          cell: ({ row }) => {
            const amount = row.getValue<number>('amount');

            return (
              <div className={isRtl ? 'text-left' : 'text-right'}>
                <span className="font-medium">{money(amount)}</span>
              </div>
            );
          },
        }),

        columnHelper.accessor('notes', {
          header: () => columnsT('notes'),

          cell: ({ row }) => {
            const notes = row.getValue<string>('notes');

            return <span className="text-muted-foreground">{notes || '—'}</span>;
          },
        }),
      ]),
    [columnsT, paymentTypeT, money, isRtl],
  );
}
