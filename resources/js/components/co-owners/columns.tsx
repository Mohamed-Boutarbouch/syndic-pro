import { createColumnHelper } from '@tanstack/react-table';
import { Building, CircleEllipsis, Store, Warehouse } from 'lucide-react';

import { BillingFrequencyBadge } from '@/components/billing-frequency-badge';
import { AssignCoOwnerCell } from '@/components/co-owners/assign-co-owner-cell';
import type { DataTableFeatures } from '@/components/co-owners/data-table-features';
import { Badge } from '@/components/ui/badge';
import type { UnitType } from '@/components/unit-type-badge';
import type { MoneyFunction, TFunction } from '@/hooks/use-translation';
import type { UnitShare } from '@/types/properties/co-owners';
import { UnitRowEditCell } from '@/components/co-owners/unit-row-edit-cell';

const columnHelper = createColumnHelper<DataTableFeatures, UnitShare>();

export function buildColumns(
  propertyId: string,
  ratePerPoint: number,
  t: TFunction,
  money: MoneyFunction,
  unitTypes: UnitType[],
  unassignedCoOwners: { id: number; name: string }[],
) {
  return columnHelper.columns([
    columnHelper.accessor('unit', {
      header: t('columns.unit'),

      cell: ({ row }) => <span className="font-medium">{row.original.unit}</span>,
    }),

    columnHelper.accessor('coOwner', {
      header: t('columns.co_owner'),

      cell: ({ row }) => {
        const coOwner = row.original.coOwner;

        return coOwner ? (
          <span className="font-medium">{coOwner}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
    }),

    columnHelper.accessor('type', {
      header: t('columns.type'),

      cell: ({ row }) => {
        const type = row.original.type;

        if (type === 'residential') {
          return (
            <Badge variant="outline" className="border-blue-600 text-blue-500">
              <Building />

              {t('unit_types.residential')}
            </Badge>
          );
        }

        if (type === 'commercial') {
          return (
            <Badge variant="outline" className="border-purple-600 text-purple-500">
              <Store />

              {t('unit_types.commercial')}
            </Badge>
          );
        }

        if (type === 'storage') {
          return (
            <Badge variant="outline" className="border-yellow-600 text-yellow-500">
              <Warehouse />

              {t('unit_types.storage')}
            </Badge>
          );
        }

        return (
          <Badge variant="secondary">
            <CircleEllipsis />

            {t('unit_types.other')}
          </Badge>
        );
      },
    }),

    columnHelper.accessor('coefficient', {
      header: t('columns.coefficient'),

      cell: ({ row }) => <Badge variant="outline">×{row.original.coefficient.toFixed(1)}</Badge>,
    }),

    columnHelper.accessor('quotaYear', {
      header: t('columns.quota_year'),

      cell: ({ row }) => <span className="font-medium">{money(row.original.quotaYear)}</span>,
    }),

    columnHelper.accessor('billingFrequency', {
      header: t('columns.billing_frequency'),

      cell: ({ row }) => {
        const frequency = row.original.billingFrequency;

        if (!frequency) {
          return <span className="text-muted-foreground">—</span>;
        }

        return <BillingFrequencyBadge frequency={frequency} />;
      },
    }),

    columnHelper.accessor('status', {
      header: t('columns.status'),

      cell: ({ row }) => {
        const status = row.original.status;

        if (status === 'syndic') {
          return <Badge>{t('status_values.syndic')}</Badge>;
        }

        return <Badge variant="outline">{t('status_values.co_owner')}</Badge>;
      },
    }),

    columnHelper.display({
      id: 'actions',

      header: () => <div className="text-end">{t('columns.actions')}</div>,

      cell: ({ row }) => (
        <div className="flex justify-end">
          {row.original.unitCoOwnerId === null ? (
            <AssignCoOwnerCell
              propertyId={propertyId}
              unitId={row.original.unitId}
              unitLabel={row.original.unit}
              unassignedCoOwners={unassignedCoOwners}
              t={t}
            />
          ) : (
            <UnitRowEditCell
              unit={row.original}
              propertyId={propertyId}
              ratePerPoint={ratePerPoint}
              unitTypes={unitTypes}
              // t={t}
            />
          )}
        </div>
      ),
    }),
  ]);
}
