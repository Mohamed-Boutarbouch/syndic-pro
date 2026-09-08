import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ArrowUpDown } from 'lucide-react';

import type { DataTableFeatures } from '@/components/ledger/data-table-features';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/format-currency';

import type { PaymentLog } from '@/types/properties/ledger';

const columnHelper = createColumnHelper<DataTableFeatures, PaymentLog>();

export const columns = columnHelper.columns([
  columnHelper.accessor('date', {
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Date
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
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Co-Owner
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
    header: 'Period',
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue<string>('period')}</span>
    ),
  }),

  columnHelper.accessor('type', {
    header: 'Type',
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
          {type === 'full' ? 'Full' : 'Partial'}
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
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const amount = row.getValue<number>('amount');

      return <div className="text-right font-medium">{formatCurrency(amount)}</div>;
    },
  }),

  columnHelper.accessor('notes', {
    header: 'Notes',
    cell: ({ row }) => {
      const notes = row.getValue<string>('notes');

      return <span className="text-muted-foreground">{notes || '—'}</span>;
    },
  }),
]);
