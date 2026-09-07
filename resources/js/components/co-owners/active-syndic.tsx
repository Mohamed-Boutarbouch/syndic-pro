import { useForm } from '@inertiajs/react';
import { ArrowRightLeft, Shield } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
    Field,
    FieldContent,
    FieldDescription,
    FieldLabel,
    FieldTitle,
} from '@/components/ui/field';
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from '@/components/ui/item';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { TransferCandidate } from './columns';

type ActiveSyndicData = {
    userId: number;
    name: string;
    email: string | null;
    phone: string | null;
    unit: string | null;
    assignedAt: string | null;
} | null;

interface ActiveSyndicProps {
    propertyId: number;
    activeSyndic: ActiveSyndicData;
    candidates: TransferCandidate[];
}

function initials(name: string) {
    return name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}

export function ActiveSyndic({
    propertyId,
    activeSyndic,
    candidates,
}: ActiveSyndicProps) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        user_id: '' as number | '',
    });

    function handleTransfer() {
        if (!data.user_id) {
            return;
        }

        post(`/properties/${propertyId}/co-owners/syndic/transfer`, {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    }

    function handleOpenChange(nextOpen: boolean) {
        setOpen(nextOpen);

        if (!nextOpen) {
            reset();
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield />
                    Active Syndic
                </CardTitle>
                <CardDescription>Designated property manager</CardDescription>
                <CardAction>
                    <Dialog open={open} onOpenChange={handleOpenChange}>
                        <DialogTrigger
                            render={
                                <Button
                                    variant="outline"
                                    disabled={candidates.length === 0}
                                >
                                    <ArrowRightLeft data-icon="inline-start" />
                                    Management Transfer
                                </Button>
                            }
                        />
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <ArrowRightLeft />
                                    Syndic Management Transfer
                                </DialogTitle>
                                <DialogDescription>
                                    Select the new syndic from active co-owners.
                                </DialogDescription>
                            </DialogHeader>
                            <Alert>
                                <Shield />
                                <AlertTitle>Irreversible Action</AlertTitle>
                                <AlertDescription>
                                    {activeSyndic
                                        ? `Current syndic ${activeSyndic.name} will lose all administrative rights.`
                                        : 'This property currently has no active syndic.'}
                                </AlertDescription>
                            </Alert>
                            <RadioGroup
                                value={String(data.user_id)}
                                onValueChange={(value) =>
                                    setData('user_id', Number(value))
                                }
                                className="min-w-0"
                            >
                                <ScrollArea className="h-64 pr-3">
                                    <div className="space-y-2">
                                        {candidates.map((owner) => (
                                            <FieldLabel
                                                key={owner.id}
                                                htmlFor={owner.id}
                                                className="block"
                                            >
                                                <Field
                                                    orientation="horizontal"
                                                    className="cursor-pointer rounded-lg border p-3 transition-colors hover:bg-muted/50"
                                                >
                                                    <Avatar className="size-9">
                                                        <AvatarFallback>
                                                            {initials(
                                                                owner.name,
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <FieldContent>
                                                        <FieldTitle>
                                                            {owner.name}
                                                        </FieldTitle>
                                                        <FieldDescription>
                                                            Unit {owner.unit}
                                                        </FieldDescription>
                                                    </FieldContent>
                                                    <RadioGroupItem
                                                        value={String(
                                                            owner.userId,
                                                        )}
                                                        id={owner.id}
                                                    />
                                                </Field>
                                            </FieldLabel>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </RadioGroup>
                            <DialogFooter>
                                <DialogClose
                                    render={
                                        <Button variant="outline">
                                            Cancel
                                        </Button>
                                    }
                                />
                                <Button
                                    type="button"
                                    disabled={!data.user_id || processing}
                                    onClick={handleTransfer}
                                >
                                    {processing
                                        ? 'Transferring…'
                                        : 'Transfer Management'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardAction>
            </CardHeader>
            <CardContent>
                {activeSyndic ? (
                    <Item variant="outline">
                        <ItemMedia className="self-center">
                            <Avatar className="size-10">
                                <AvatarFallback>
                                    {initials(activeSyndic.name)}
                                </AvatarFallback>
                            </Avatar>
                        </ItemMedia>
                        <ItemContent>
                            <ItemTitle className="flex items-center gap-2">
                                {activeSyndic.name}
                                <Badge>
                                    <Shield data-icon="inline-start" />
                                    Syndic
                                </Badge>
                            </ItemTitle>
                            <ItemDescription className="space-y-0.5">
                                <span className="block">
                                    {[activeSyndic.email, activeSyndic.phone]
                                        .filter(Boolean)
                                        .join(' · ')}
                                </span>
                                {activeSyndic.unit && (
                                    <span className="block">
                                        Unit: {activeSyndic.unit}
                                    </span>
                                )}
                            </ItemDescription>
                        </ItemContent>
                    </Item>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        No active syndic is currently assigned to this property.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
