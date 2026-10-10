import { useTable } from '@tanstack/react-table';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Columns3,
  Search,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { AddUnitDialog } from '@/components/co-owners/add-unit-dialog';
import { buildColumns } from '@/components/co-owners/columns';
import { features } from '@/components/co-owners/data-table-features';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { UnitType } from '@/components/unit-type-badge';
import { useTranslation } from '@/hooks/use-translation';
import type { UnitShare } from '@/types/properties/co-owners';

interface DataTableProps {
  data: UnitShare[];
  ratePerPoint: number;
  totalWeight: number;
  unitTypes: UnitType[];
  unassignedCoOwners: { id: string; name: string }[];
}

export function DataTable({
  data,
  ratePerPoint,
  totalWeight,
  unitTypes,
  unassignedCoOwners,
}: DataTableProps) {
  const { t, money, isRtl } = useTranslation('properties.co_owners.data_table');
  const [search, setSearch] = useState('');

  const columns = useMemo(
    () => buildColumns(ratePerPoint, t, money, unitTypes, unassignedCoOwners),
    [ratePerPoint, t, money, unitTypes, unassignedCoOwners],
  );

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
    <Card dir={isRtl ? 'rtl' : 'ltr'}>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>

        <CardDescription>
          {t('description', {
            weight: totalWeight.toFixed(1),
            rate: money(ratePerPoint),
          })}
        </CardDescription>

        <CardAction>
          <AddUnitDialog />
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(event) => handleSearch(event.target.value)}
                placeholder={t('search_placeholder')}
                className="pl-9"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline">
                    <Columns3 />
                    {t('columns_button')}
                  </Button>
                }
              />

              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>{t('toggle_columns_label')}</DropdownMenuLabel>

                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : <table.FlexRender header={header} />}
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
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      {t('empty_state')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {totalRows === 0
                ? t('pagination.no_results')
                : t('pagination.showing_range', {
                    start: startRow,
                    end: endRow,
                    total: totalRows,
                  })}
            </p>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronsLeft />
                <span className="sr-only">{t('pagination.first_page')}</span>
              </Button>

              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft />
                <span className="sr-only">{t('pagination.previous_page')}</span>
              </Button>

              <span className="px-2 text-sm">
                {t('pagination.page_of', {
                  page: pageIndex,
                  count: pageCount,
                })}
              </span>

              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight />
                <span className="sr-only">{t('pagination.next_page')}</span>
              </Button>

              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => table.setPageIndex(pageCount - 1)}
                disabled={!table.getCanNextPage()}
              >
                <ChevronsRight />
                <span className="sr-only">{t('pagination.last_page')}</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
