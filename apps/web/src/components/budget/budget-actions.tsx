import { RefreshCw, TriangleAlert } from 'lucide-react';

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
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Field, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function BudgetActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog>
          <form>
            <DialogTrigger
              render={
                <Button variant="outline" className="w-full mb-2">
                  Add unit mid-fiscal year
                </Button>
              }
            />
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Add unit mid-fiscal year</DialogTitle>
                <DialogDescription>
                  This will recalculate only the projected total budget.
                  Existing co-owner quotas will remain unchanged.
                </DialogDescription>
              </DialogHeader>

              <Alert>
                <TriangleAlert />
                <AlertTitle>Immutability Rules</AlertTitle>
                <AlertDescription>
                  Existing resident monthly quotas are locked. Only the total
                  budget will be adjusted upward.
                </AlertDescription>
              </Alert>
              <FieldGroup>
                <Field>
                  <Label htmlFor="unit-name">Unit Name / Number</Label>
                  <Input
                    id="unit-name"
                    name="unit-name"
                    placeholder="e.g. A-502"
                  />
                </Field>
                <Field>
                  <Label htmlFor="weight-coefficient">Weight Coefficient</Label>
                  <Input
                    type="number"
                    step="0.1"
                    id="weight-coefficient"
                    name="weight-coefficient"
                    defaultValue="1.0"
                  />
                </Field>
              </FieldGroup>
              <Item variant="muted">
                <ItemContent>
                  <ItemTitle>Budget Impact</ItemTitle>
                  <ItemDescription>
                    + 6,000 MAD &rarr; New total: 66,000 MAD
                  </ItemDescription>
                </ItemContent>
              </Item>
              <DialogFooter>
                <DialogClose
                  render={<Button variant="outline">Cancel</Button>}
                />
                <Button type="submit">Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
        <p className="text-sm text-muted-foreground mb-4">
          Recalculation global budget without modifying existing quotas
        </p>
        <Separator className="mb-4" />
        <Button variant="outline" className="w-full">
          <RefreshCw data-icon="inline-start" /> Simulate new fiscal year
        </Button>
      </CardContent>
    </Card>
  );
}
