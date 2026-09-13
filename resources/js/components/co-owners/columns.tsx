import { useForm } from '@inertiajs/react';
import { createColumnHelper } from '@tanstack/react-table';
import { Building, CircleEllipsis, Pencil, Store, Warehouse } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { SubmitEvent } from 'react';

import { AssignCoOwnerCell } from '@/components/co-owners/assign-co-owner-cell';
import type { DataTableFeatures } from '@/components/co-owners/data-table-features';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { Field, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemTitle } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';
import type { MoneyFunction, TFunction } from '@/hooks/use-translation';
import type { UnitShare } from '@/types/properties/co-owners';

const columnHelper = createColumnHelper<DataTableFeatures, UnitShare>();

type CoefficientEditCellProps = {
  unit: UnitShare;
  propertyId: number;
  ratePerPoint: number;
  t: TFunction;
};

function CoefficientEditCell({ unit, propertyId, ratePerPoint, t }: CoefficientEditCellProps) {
  const { money, isRtl } = useTranslation();

  const [open, setOpen] = useState(false);

  const dir = isRtl ? 'rtl' : 'ltr';

  const { data, setData, patch, processing, errors, reset } = useForm({
    weight_coefficient: unit.coefficient,
  });

  useEffect(() => {
    if (!open) {
      setData('weight_coefficient', unit.coefficient);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit.coefficient, open]);

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    patch(`/properties/${propertyId}/co-owners/units/${unit.unitId}/coefficient`, {
      preserveScroll: true,
      onSuccess: () => setOpen(false),
    });
  }

  const previewAnnual = ratePerPoint * data.weight_coefficient;

  const previewMonthly = previewAnnual / 12;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);

        if (!next) {
          reset();
        }
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTrigger
          render={
            <Button variant="ghost" size="icon-sm">
              <Pencil />

              <span className="sr-only">
                {t('edit_dialog.trigger_sr_label', {
                  unit: unit.unit,
                })}
              </span>
            </Button>
          }
        />

        <DialogContent className="sm:max-w-sm" dir={dir}>
          <DialogHeader>
            <DialogTitle>{t('edit_dialog.title')}</DialogTitle>

            <DialogDescription>
              {t('edit_dialog.description', {
                unit: unit.unit,
              })}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <Label htmlFor={`coefficient-${unit.id}`}>
                {t('edit_dialog.weight_coefficient_label')}
              </Label>

              <Input
                id={`coefficient-${unit.id}`}
                name="weight_coefficient"
                type="number"
                step="0.1"
                min="0.01"
                value={data.weight_coefficient}
                onChange={(event) => setData('weight_coefficient', Number(event.target.value))}
              />

              {errors.weight_coefficient && (
                <p className="text-sm text-destructive">{errors.weight_coefficient}</p>
              )}
            </Field>
          </FieldGroup>

          <p className="text-sm text-muted-foreground">{t('edit_dialog.coefficient_hint')}</p>

          <Item variant="muted">
            <ItemContent>
              <ItemTitle>{t('edit_dialog.recalculated_impact.title')}</ItemTitle>

              <div className="text-sm leading-normal text-muted-foreground">
                <div className="flex justify-between gap-4">
                  <span>{t('edit_dialog.recalculated_impact.annual_share_label')}</span>

                  <span className="shrink-0 font-medium text-foreground">
                    {money(previewAnnual)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span>{t('edit_dialog.recalculated_impact.monthly_label')}</span>

                  <span className="shrink-0 font-medium text-foreground">
                    {money(previewMonthly)}
                  </span>
                </div>
              </div>
            </ItemContent>
          </Item>

          <DialogFooter>
            <DialogClose
              render={<Button variant="outline">{t('edit_dialog.cancel_button')}</Button>}
            />

            <Button type="submit" disabled={processing}>
              {processing ? t('edit_dialog.applying_button') : t('edit_dialog.apply_button')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export function buildColumns(
  propertyId: number,
  ratePerPoint: number,
  t: TFunction,
  money: MoneyFunction,
  unassignedCoOwners: { id: number; name: string }[],
) {
  return columnHelper.columns([
    columnHelper.accessor('unit', {
      header: t('columns.unit'),

      cell: ({ row }) => <span className="font-medium">{row.original.unit}</span>,
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

    columnHelper.accessor('coOwner', {
      header: t('columns.co_owner'),

      cell: ({ row }) => {
        const status = row.original.status;

        if (status === 'syndic') {
          return <Badge>{t('status_values.syndic')}</Badge>;
        }

        if (status === 'unassigned') {
          return <Badge variant="secondary">{t('status_values.unassigned')}</Badge>;
        }

        return <Badge variant="outline">{t('status_values.co_owner')}</Badge>;
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

    columnHelper.accessor('quotaMonth', {
      header: t('columns.quota_month'),

      cell: ({ row }) => (
        <span className="text-muted-foreground">{money(row.original.quotaMonth)}</span>
      ),
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
            <CoefficientEditCell
              unit={row.original}
              propertyId={propertyId}
              ratePerPoint={ratePerPoint}
              t={t}
            />
          )}
        </div>
      ),
    }),
  ]);
}
