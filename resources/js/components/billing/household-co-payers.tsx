import { Plus, UserRoundX, UsersRoundIcon } from 'lucide-react';

import { getProgress } from '@/components/billing/billing-data';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Field, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from '@/hooks/use-translation';
import type { HouseholdCoPayer, HouseholdCoPayersProps } from '@/types/properties/billing';

export function HouseholdCoPayers({ payment }: HouseholdCoPayersProps) {
  const { t, money } = useTranslation('properties.billing.household');
  const coPayers = payment.coPayers ?? [];

  const totalCollected = coPayers.reduce((total, coPayer) => total + coPayer.collected, 0);

  const progress = getProgress(totalCollected, payment.quota);

  return (
    <div className="border-t px-4 py-3">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UsersRoundIcon className="size-4" />

          <span className="text-sm font-medium">{t('title')}</span>
        </div>

        <Dialog>
          <form>
            <DialogTrigger
              render={
                <Button variant="outline">
                  <Plus data-plus="inline-start" />
                  {t('add_button')}
                </Button>
              }
            />

            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>{t('add_dialog.title')}</DialogTitle>

                <DialogDescription>
                  {t('add_dialog.description', {
                    name: payment.name,
                    quota: money(payment.quota),
                  })}
                </DialogDescription>
              </DialogHeader>

              <FieldGroup>
                <Field>
                  <Label htmlFor="full-name">{t('add_dialog.full_name_label')}</Label>

                  <Input
                    id="full-name"
                    name="full-name"
                    placeholder={t('add_dialog.full_name_placeholder')}
                  />
                </Field>

                <Field>
                  <Label htmlFor="relationship">{t('add_dialog.relationship_label')}</Label>

                  <Input
                    id="relationship"
                    name="relationship"
                    placeholder={t('add_dialog.relationship_placeholder')}
                  />
                </Field>

                <Field>
                  <Label htmlFor="quota-share">{t('add_dialog.quota_share_label')}</Label>

                  <Input
                    type="number"
                    step="1"
                    id="quota-share"
                    name="quota-share"
                    placeholder={t('add_dialog.quota_share_placeholder')}
                  />
                </Field>
              </FieldGroup>

              <DialogFooter>
                <DialogClose
                  render={<Button variant="outline">{t('add_dialog.cancel_button')}</Button>}
                />

                <Button type="submit">{t('add_dialog.add_button')}</Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>

      <div className="rounded-md border bg-muted/30 p-2.5">
        <Item className="p-0">
          <ItemContent>
            <ItemTitle className="text-xs">{t('shared_goal')}</ItemTitle>
          </ItemContent>

          <span className="text-xs font-medium">{money(payment.quota)}</span>
        </Item>

        <Progress value={progress} className="mt-2 h-2" />

        <div className="mt-1.5 flex justify-between text-xs text-muted-foreground">
          <span>
            {t('collected', {
              amount: money(totalCollected),
            })}
          </span>

          <span>
            {t('remaining', {
              amount: money(Math.max(0, payment.quota - totalCollected)),
            })}
          </span>
        </div>
      </div>

      {coPayers.length === 0 ? (
        <Empty className="py-8">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UserRoundX />
            </EmptyMedia>

            <EmptyTitle>{t('empty.title')}</EmptyTitle>

            <EmptyDescription className="max-w-xs text-pretty">
              {t('empty.description')}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="mt-3 space-y-2">
          {coPayers.map((coPayer) => (
            <CoPayer key={coPayer.id} coPayer={coPayer} householdQuota={payment.quota} />
          ))}
        </div>
      )}
    </div>
  );
}

function CoPayer({
  coPayer,
  householdQuota,
}: {
  coPayer: HouseholdCoPayer;
  householdQuota: number;
}) {
  const { t, money, isRtl } = useTranslation('properties.billing.household');
  const quota = householdQuota * (coPayer.sharePercentage / 100);

  const progress = getProgress(coPayer.collected, quota);

  return (
    <Item className="px-0" dir={isRtl ? 'rtl' : 'ltr'}>
      <ItemMedia>
        <Avatar className="size-6">
          <AvatarFallback className="text-[10px] font-medium">{coPayer.initials}</AvatarFallback>
        </Avatar>
      </ItemMedia>

      <ItemContent className="min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <ItemTitle className="truncate text-xs">{coPayer.name}</ItemTitle>

            <Badge variant="outline" className="h-4 shrink-0 px-1.5 text-[10px]">
              {coPayer.relationship}
            </Badge>
          </div>

          <span className="shrink-0 text-xs text-muted-foreground">
            {t('co_payer_progress', {
              percentage: coPayer.sharePercentage,
              collected: money(coPayer.collected),
              quota: money(quota),
            })}
          </span>
        </div>

        <Progress value={progress} className="mt-1" />
      </ItemContent>
    </Item>
  );
}
