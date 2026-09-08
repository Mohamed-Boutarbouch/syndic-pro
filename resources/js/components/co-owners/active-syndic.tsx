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
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslation } from '@/hooks/use-translation';
import type {
  ActiveSyndic as ActiveSyndicData,
  TransferCandidate,
} from '@/types/properties/co-owners';

type ActiveSyndicProps = {
  propertyId: number;
  activeSyndic: ActiveSyndicData | null;
  candidates: TransferCandidate[];
};

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function ActiveSyndic({ propertyId, activeSyndic, candidates }: ActiveSyndicProps) {
  const { t } = useTranslation('properties.co_owners.active_syndic');
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
          {t('title')}
          {/*Active Syndic*/}
        </CardTitle>

        <CardDescription>
          {t('description')}
          {/*Designated property manager*/}
        </CardDescription>

        <CardAction>
          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger
              render={
                <Button variant="outline" disabled={candidates.length === 0}>
                  <ArrowRightLeft data-icon="inline-start" />
                  {t('transfer_button')}
                  {/*Management Transfer*/}
                </Button>
              }
            />

            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ArrowRightLeft />
                  {t('transfer_dialog.title')}
                  {/*Syndic Management Transfer*/}
                </DialogTitle>

                <DialogDescription>
                  {t('transfer_dialog.description')}
                  {/*Select the new syndic from active co-owners.*/}
                </DialogDescription>
              </DialogHeader>

              <Alert>
                <Shield />

                <AlertTitle>
                  {t('transfer_dialog.irreversible_alert.title')}
                  {/*Irreversible Action*/}
                </AlertTitle>

                <AlertDescription>
                  {activeSyndic
                    ? t('transfer_dialog.irreversible_alert.current_syndic_description', {
                        name: activeSyndic.name,
                      })
                    : t('transfer_dialog.irreversible_alert.no_syndic_description')}
                </AlertDescription>
              </Alert>

              <RadioGroup
                value={String(data.user_id)}
                onValueChange={(value) => setData('user_id', Number(value))}
                className="min-w-0"
              >
                <ScrollArea className="h-64 pr-3">
                  <div className="space-y-2">
                    {candidates.map((owner) => (
                      <FieldLabel key={owner.id} htmlFor={owner.id} className="block">
                        <Field
                          orientation="horizontal"
                          className="cursor-pointer rounded-lg border p-3 transition-colors hover:bg-muted/50"
                        >
                          <Avatar className="size-9">
                            <AvatarFallback>{initials(owner.name)}</AvatarFallback>
                          </Avatar>

                          <FieldContent>
                            <FieldTitle>{owner.name}</FieldTitle>

                            <FieldDescription>
                              {t('transfer_dialog.candidate_unit_label', {
                                unit: owner.unit,
                              })}
                              {/*Unit {owner.unit}*/}
                            </FieldDescription>
                          </FieldContent>

                          <RadioGroupItem value={String(owner.userId)} id={owner.id} />
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
                      {t('transfer_dialog.cancel_button')}
                      {/*Cancel*/}
                    </Button>
                  }
                />

                <Button
                  type="button"
                  disabled={!data.user_id || processing}
                  onClick={handleTransfer}
                >
                  {processing
                    ? t('transfer_dialog.transferring_button')
                    : t('transfer_dialog.transfer_button')}
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
                <AvatarFallback>{initials(activeSyndic.name)}</AvatarFallback>
              </Avatar>
            </ItemMedia>

            <ItemContent>
              <ItemTitle className="flex items-center gap-2">
                {activeSyndic.name}

                <Badge>
                  <Shield data-icon="inline-start" />
                  {t('syndic_badge')}
                  {/*Syndic*/}
                </Badge>
              </ItemTitle>

              <ItemDescription className="space-y-0.5">
                <span className="block">
                  {[activeSyndic.email, activeSyndic.phone].filter(Boolean).join(' · ')}
                </span>

                {activeSyndic.unit && (
                  <span className="block">
                    {t('unit_label', {
                      unit: activeSyndic.unit,
                    })}
                    {/*Unit: {activeSyndic.unit}*/}
                  </span>
                )}
              </ItemDescription>
            </ItemContent>
          </Item>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t('empty_state')}
            {/*No active syndic is currently assigned to this property.*/}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
