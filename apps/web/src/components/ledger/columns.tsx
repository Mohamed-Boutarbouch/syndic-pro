'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';

import { type DataTableFeatures } from './data-table-features';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '../ui/button';

export type PaymentLog = {
  id: string;
  date: Date;
  coOwner: string;
  period: string;
  type: 'full' | 'partial';
  amount: number;
  notes: string;
};

const columnHelper = createColumnHelper<DataTableFeatures, PaymentLog>();

export const columns = columnHelper.columns([
  columnHelper.accessor('date', {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return format(row.getValue('date'), 'dd/MM/yyyy');
    },
  }),

  columnHelper.accessor('coOwner', {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Co-Owner
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">
          {row.getValue<string>('period')}
        </span>
      );
    },
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
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = row.getValue<number>('amount');

      const formatted = new Intl.NumberFormat('fr-MA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);

      return <div className="text-right font-medium">{formatted} MAD</div>;
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
