import { router } from '@inertiajs/react';
import { RefreshCw, TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import type { SubmitEvent } from 'react';

import addMidYearUnit from '@/actions/App/Http/Controllers/AddMidYearUnitController';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/hooks/use-translation';

type BudgetActionsProps = {
  propertyId: number;
  sharePerPoint: number;
  currentTotalBudget: number;
};

export function BudgetActions({
  propertyId,
  sharePerPoint,
  currentTotalBudget,
}: BudgetActionsProps) {
  const [unitName, setUnitName] = useState('');
  const [weightCoefficient, setWeightCoefficient] = useState('1.0');
  const [open, setOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { t, money, isRtl } = useTranslation('properties.budget.actions');

  const parsedWeight = Number.parseFloat(weightCoefficient) || 0;
  const budgetImpact = parsedWeight * sharePerPoint;
  const newTotal = currentTotalBudget + budgetImpact;

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    setProcessing(true);

    router.post(
      addMidYearUnit.url({ property: propertyId }),
      {
        label: unitName,
        weight_coefficient: weightCoefficient,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setOpen(false);
          setUnitName('');
          setWeightCoefficient('1.0');
        },
        onFinish: () => setProcessing(false),
      },
    );
  };

  return (
    <Card dir={isRtl ? 'rtl' : 'ltr'}>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog open={open} onOpenChange={setOpen}>
          <form onSubmit={handleSubmit}>
            <DialogTrigger
              render={
                <Button variant="outline" className="mb-2 w-full">
                  {t('add_unit_button')}
                </Button>
              }
            />
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>{t('add_unit_dialog.title')}</DialogTitle>
                <DialogDescription>{t('add_unit_dialog.description')}</DialogDescription>
              </DialogHeader>
              <Alert>
                <TriangleAlert />
                <AlertTitle>{t('add_unit_dialog.immutability_alert.title')}</AlertTitle>
                <AlertDescription>
                  {t('add_unit_dialog.immutability_alert.description')}
                </AlertDescription>
              </Alert>
              <FieldGroup>
                <Field>
                  <Label htmlFor="unit-name">{t('add_unit_dialog.unit_name_label')}</Label>
                  <Input
                    id="unit-name"
                    name="unit-name"
                    placeholder={t('add_unit_dialog.unit_name_placeholder')}
                    value={unitName}
                    onChange={(event) => setUnitName(event.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <Label htmlFor="weight-coefficient">
                    {t('add_unit_dialog.weight_coefficient_label')}
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    id="weight-coefficient"
                    name="weight-coefficient"
                    value={weightCoefficient}
                    onChange={(event) => setWeightCoefficient(event.target.value)}
                    required
                  />
                </Field>
              </FieldGroup>
              <Item variant="muted">
                <ItemContent>
                  <ItemTitle>{t('add_unit_dialog.budget_impact.title')}</ItemTitle>
                  <ItemDescription>
                    {t('add_unit_dialog.budget_impact.description', {
                      impact: money(budgetImpact),
                      total: money(newTotal),
                    })}
                  </ItemDescription>
                </ItemContent>
              </Item>
              <DialogFooter>
                <DialogClose
                  render={<Button variant="outline">{t('add_unit_dialog.cancel_button')}</Button>}
                />
                <Button type="submit" disabled={processing}>
                  {t('add_unit_dialog.confirm_button')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
        <p className="mb-4 text-sm text-muted-foreground">{t('recalculation_note')}</p>
        <Separator className="mb-4" />
        <Button variant="outline" className="w-full">
          <RefreshCw data-icon="inline-start" /> {t('simulate_button')}
        </Button>
      </CardContent>
    </Card>
  );
}
