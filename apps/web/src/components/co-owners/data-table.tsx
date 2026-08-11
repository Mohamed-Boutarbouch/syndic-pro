'use client';

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Columns3,
  Search,
} from 'lucide-react';
import { useTable, type ColumnDef, type RowData } from '@tanstack/react-table';
import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { features, type DataTableFeatures } from './data-table-features';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData>[];
  data: TData[];
}

export function DataTable<TData extends RowData>({
  columns,
  data,
}: DataTableProps<TData>) {
  const [search, setSearch] = useState('');

  const table = useTable({
    features,
    data,
    columns,
  });

  const coOwnerColumn = table.getColumn('coOwner');

  function handleSearch(value: string) {
    setSearch(value);
    coOwnerColumn?.setFilterValue(value);
  }

  const { pageIndex, pageSize } = table.state.pagination;

  const totalRows = table.getFilteredRowModel().rows.length;

  const rows = table.getRowModel().rows;

  const pageCount = table.getPageCount();

  const startRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;

  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unit Shares & Co-Owners Matrix</CardTitle>
        <CardDescription>
          Total weight: 10.0 pts · Rate: 6,000 MAD/pt/yr
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />

              <Input
                value={search}
                onChange={(event) => handleSearch(event.target.value)}
                placeholder="Search co-owners..."
                className="pl-9"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline">
                    <Columns3 />
                    Columns
                  </Button>
                }
              />

              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>

                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : (
                          <table.FlexRender header={header} />
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {rows.length > 0 ? (
                  rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() ? 'selected' : undefined}
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
                      No co-owners found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted-foreground text-sm">
              {totalRows === 0
                ? 'No results'
                : `Showing ${startRow}–${endRow} of ${totalRows}`}
            </p>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronsLeft />
                <span className="sr-only">First page</span>
              </Button>

              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft />
                <span className="sr-only">Previous page</span>
              </Button>

              <span className="px-2 text-sm">
                Page {pageIndex + 1} of {pageCount}
              </span>

              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight />
                <span className="sr-only">Next page</span>
              </Button>

              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => table.setPageIndex(pageCount - 1)}
                disabled={!table.getCanNextPage()}
              >
                <ChevronsRight />
                <span className="sr-only">Last page</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
