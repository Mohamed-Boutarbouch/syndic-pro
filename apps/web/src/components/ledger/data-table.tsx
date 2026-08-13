'use client';
import {
  useTable,
  type ColumnDef,
  type ColumnFiltersState,
  type RowData,
  type SortingState,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { features, type DataTableFeatures } from './data-table-features';
import { Search } from 'lucide-react';
import { DataTablePagination } from './data-table-pagination';

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData>[];
  data: TData[];
}

export function DataTable<TData extends RowData>({
  columns,
  data,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useTable({
    features,
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  const typeLabels = {
    all: 'All Types',
    full: 'Full',
    partial: 'Partial',
  } as const;

  const typeValue =
    (table.getColumn('type')?.getFilterValue() as keyof typeof typeLabels) ??
    'all';

  const coOwnerOptions = useMemo(() => {
    const names = new Set<string>();
    for (const row of data) {
      const coOwner = (row as { coOwner?: string }).coOwner;
      if (coOwner) names.add(coOwner);
    }
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [data]);

  const coOwnerValue =
    (table.getColumn('coOwner')?.getFilterValue() as string) ?? 'all';

  return (
    <div>
      <div className="flex items-center gap-2 py-4">
        {/* Search */}
        <div className="flex justify-between gap-4 w-full">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Filter co-owners..."
              value={
                (table.getColumn('coOwner')?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn('coOwner')?.setFilterValue(event.target.value)
              }
              className="pl-9"
            />
          </div>

          <div className="flex itemsce items-center gap-4">
            {/* Co-owner selector */}
            <Select
              value={coOwnerValue}
              onValueChange={(value) => {
                table
                  .getColumn('coOwner')
                  ?.setFilterValue(value === 'all' ? undefined : value);
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue>
                  {coOwnerValue === 'all' ? 'All Co-owners' : coOwnerValue}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Co-owners</SelectItem>
                {coOwnerOptions.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Type filter */}
            <Select
              value={typeValue}
              onValueChange={(value) => {
                table
                  .getColumn('type')
                  ?.setFilterValue(value === 'all' ? undefined : value);
              }}
            >
              <SelectTrigger className="w-35">
                <SelectValue>{typeLabels[typeValue]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full">Full</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <table.FlexRender header={header} />
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  -
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
