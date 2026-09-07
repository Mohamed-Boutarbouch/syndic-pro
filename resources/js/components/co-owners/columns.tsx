import { useForm } from '@inertiajs/react';
import { createColumnHelper } from '@tanstack/react-table';
import { Building2, Pencil, Warehouse } from 'lucide-react';
import { useEffect, useState } from 'react';

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
import { formatCurrency } from '@/lib/format-currency';
import type { UnitShare } from '@/types/properties/co-owners';

const columnHelper = createColumnHelper<DataTableFeatures, UnitShare>();

function CoefficientEditCell({
    unit,
    propertyId,
    ratePerPoint,
}: {
    unit: UnitShare;
    propertyId: number;
    ratePerPoint: number;
}) {
    const [open, setOpen] = useState(false);

    const { data, setData, patch, processing, errors, reset } = useForm({
        weight_coefficient: unit.coefficient,
    });

    useEffect(() => {
        if (!open) {
            setData('weight_coefficient', unit.coefficient);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [unit.coefficient, open]);

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        patch(
            `/properties/${propertyId}/co-owners/units/${unit.unitId}/coefficient`,
            {
                preserveScroll: true,
                onSuccess: () => setOpen(false),
            },
        );
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
                            <span className="sr-only">Edit {unit.unit}</span>
                        </Button>
                    }
                />

                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Edit Coefficient</DialogTitle>

                        <DialogDescription>
                            Unit {unit.unit} · Adjusts the proportional budget
                            share
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup>
                        <Field>
                            <Label htmlFor={`coefficient-${unit.id}`}>
                                Weight Coefficient
                            </Label>

                            <Input
                                id={`coefficient-${unit.id}`}
                                name="weight_coefficient"
                                type="number"
                                step="0.1"
                                min="0.01"
                                value={data.weight_coefficient}
                                onChange={(event) =>
                                    setData(
                                        'weight_coefficient',
                                        Number(event.target.value),
                                    )
                                }
                            />

                            {errors.weight_coefficient && (
                                <p className="text-sm text-destructive">
                                    {errors.weight_coefficient}
                                </p>
                            )}
                        </Field>
                    </FieldGroup>

                    <p className="text-sm text-muted-foreground">
                        Standard: 1.0 · Commercial recommended: 1.5 · Storage:
                        0.5
                    </p>

                    <Item variant="muted">
                        <ItemContent>
                            <ItemTitle>Recalculated Impact</ItemTitle>

                            <div className="text-sm leading-normal text-muted-foreground">
                                <div className="flex justify-between">
                                    <span>Annual share</span>

                                    <span className="font-medium text-foreground">
                                        {formatCurrency(previewAnnual)}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Monthly</span>

                                    <span className="font-medium text-foreground">
                                        {formatCurrency(previewMonthly)}
                                    </span>
                                </div>
                            </div>
                        </ItemContent>
                    </Item>

                    <DialogFooter>
                        <DialogClose
                            render={<Button variant="outline">Cancel</Button>}
                        />

                        <Button type="submit" disabled={processing}>
                            {processing ? 'Applying…' : 'Apply'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}

export function buildColumns(propertyId: number, ratePerPoint: number) {
    return columnHelper.columns([
        columnHelper.accessor('unit', {
            header: 'Unit',
            cell: ({ row }) => (
                <span className="font-medium">{row.original.unit}</span>
            ),
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
                    <Badge
                        variant="outline"
                        className="border-blue-600 text-blue-500"
                    >
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
                <Badge variant="outline">
                    ×{row.original.coefficient.toFixed(1)}
                </Badge>
            ),
        }),

        columnHelper.accessor('quotaYear', {
            header: 'Quota/yr',
            cell: ({ row }) => (
                <span className="font-medium">
                    {formatCurrency(row.original.quotaYear)}
                </span>
            ),
        }),

        columnHelper.accessor('quotaMonth', {
            header: 'Quota/mo',
            cell: ({ row }) => (
                <span className="text-muted-foreground">
                    {formatCurrency(row.original.quotaMonth)}
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
            cell: ({ row }) => (
                <div className="flex justify-end">
                    <CoefficientEditCell
                        unit={row.original}
                        propertyId={propertyId}
                        ratePerPoint={ratePerPoint}
                    />
                </div>
            ),
        }),
    ]);
}
