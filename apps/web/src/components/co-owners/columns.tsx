'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { Building2, Pencil, Warehouse } from 'lucide-react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item';
import { Field, FieldGroup } from '@/components/ui/field';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

import { type DataTableFeatures } from './data-table-features';

export type UnitShare = {
  id: string;
  unit: string;
  type: 'apartment' | 'commercial' | 'storage';
  coOwner: string;
  coefficient: number;
  quotaYear: number;
  quotaMonth: number;
  status: 'syndic' | 'co-owner';
};

const columnHelper = createColumnHelper<DataTableFeatures, UnitShare>();

const currencyFormatter = new Intl.NumberFormat('fr-MA', {
  style: 'currency',
  currency: 'MAD',
  maximumFractionDigits: 0,
});

export const columns = columnHelper.columns([
  columnHelper.accessor('unit', {
    header: 'Unit',

    cell: ({ row }) => <span className="font-medium">{row.original.unit}</span>,
  }),

  columnHelper.accessor('type', {
    header: 'Type',

    cell: ({ row }) => {
      const type = row.original.type;

      if (type === 'commercial') {
        return (
          <Badge
            variant="outline"
            className="border-yellow-600 text-yellow-500"
          >
            <Building2 />
            Commercial
          </Badge>
        );
      }

      if (type === 'storage') {
        return (
          <Badge variant="secondary">
            <Warehouse />
            Storage
          </Badge>
        );
      }

      return (
        <Badge variant="outline" className="border-blue-600 text-blue-500">
          <Building2 />
          Apartment
        </Badge>
      );
    },
  }),

  columnHelper.accessor('coOwner', {
    header: 'Co-Owner',

    cell: ({ row }) => <span>{row.original.coOwner}</span>,
  }),

  columnHelper.accessor('coefficient', {
    header: 'Coeff.',

    cell: ({ row }) => (
      <Badge variant="outline">×{row.original.coefficient.toFixed(1)}</Badge>
    ),
  }),

  columnHelper.accessor('quotaYear', {
    header: 'Quota/yr',

    cell: ({ row }) => (
      <span className="font-medium">
        {currencyFormatter.format(row.original.quotaYear)}
      </span>
    ),
  }),

  columnHelper.accessor('quotaMonth', {
    header: 'Quota/mo',

    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {currencyFormatter.format(row.original.quotaMonth)}
      </span>
    ),
  }),

  columnHelper.accessor('status', {
    header: 'Status',

    cell: ({ row }) => {
      const status = row.original.status;

      return status === 'syndic' ? (
        <Badge>Syndic</Badge>
      ) : (
        <Badge variant="outline">Co-owner</Badge>
      );
    },
  }),

  columnHelper.display({
    id: 'actions',

    header: () => <div className="text-right">Actions</div>,

    cell: ({ row }) => {
      const unit = row.original;

      return (
        <div className="flex justify-end">
          <Dialog>
            <form>
              <DialogTrigger
                render={
                  <Button variant="ghost" size="icon-sm">
                    <Pencil />
                    <span className="sr-only">Edit {unit.unit}</span>
                  </Button>
                }
              />

              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Edit Coefficient</DialogTitle>

                  <DialogDescription>
                    Unit {unit.unit} · Adjusts the proportional budget share
                  </DialogDescription>
                </DialogHeader>

                <FieldGroup>
                  <Field>
                    <Label htmlFor={`coefficient-${unit.id}`}>
                      Weight Coefficient
                    </Label>

                    <Input
                      id={`coefficient-${unit.id}`}
                      name="coefficient"
                      type="number"
                      step="0.1"
                      defaultValue={unit.coefficient}
                    />
                  </Field>
                </FieldGroup>
                <p className="text-sm text-muted-foreground">
                  Standard: 1.0 · Commercial recommended: 1.5 · Storage: 0.5
                </p>

                <Item variant="muted">
                  <ItemContent>
                    <ItemTitle>Recalculated Impact</ItemTitle>

                    <div className="text-muted-foreground text-sm leading-normal">
                      <div className="flex justify-between">
                        <span>Annual share</span>
                        <span className="text-foreground font-medium">
                          30,000.00 MAD
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>Monthly</span>
                        <span className="text-foreground font-medium">
                          2,550.00 MAD
                        </span>
                      </div>
                    </div>
                  </ItemContent>
                </Item>

                <DialogFooter>
                  <DialogClose
                    render={<Button variant="outline">Cancel</Button>}
                  />

                  <Button type="submit">Apply</Button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>
        </div>
      );
    },
  }),
]);
