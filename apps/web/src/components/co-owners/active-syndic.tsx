'use client';

import { useState } from 'react';
import { ArrowRightLeft, Shield } from 'lucide-react';

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
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const coOwners = [
  {
    id: 'karim-alaoui',
    name: 'Karim Alaoui',
    unit: 'A-201',
  },
  {
    id: 'nadia-cherkaoui',
    name: 'Nadia Cherkaoui',
    unit: 'A-202',
  },
  {
    id: 'hassan-tazi',
    name: 'Hassan Tazi',
    unit: 'A-301',
  },
  {
    id: 'laila-mansouri',
    name: 'Laila Mansouri',
    unit: 'A-302',
  },
  {
    id: 'youssef-idrissi',
    name: 'Youssef Idrissi',
    unit: 'A-401',
  },
  {
    id: 'salma-bennani',
    name: 'Salma Bennani',
    unit: 'A-402',
  },
  {
    id: 'omar-fassi',
    name: 'Omar Fassi',
    unit: 'A-501',
  },
  {
    id: 'sara-el-mansouri',
    name: 'Sara El Mansouri',
    unit: 'A-502',
  },
  {
    id: 'mehdi-benjelloun',
    name: 'Mehdi Benjelloun',
    unit: 'A-601',
  },
  {
    id: 'amina-tazi',
    name: 'Amina Tazi',
    unit: 'A-602',
  },
  {
    id: 'ayoub-errami',
    name: 'Ayoub Errami',
    unit: 'A-701',
  },
  {
    id: 'imane-chraibi',
    name: 'Imane Chraibi',
    unit: 'A-702',
  },
];

export function ActiveSyndic() {
  const [selectedOwner, setSelectedOwner] = useState('');

  function handleTransfer() {
    if (!selectedOwner) return;

    const owner = coOwners.find((owner) => owner.id === selectedOwner);

    console.log('Transfer management to:', owner);

    setSelectedOwner('');
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      setSelectedOwner('');
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
          <Dialog onOpenChange={handleOpenChange}>
            <DialogTrigger
              render={
                <Button variant="outline">
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
                  Current syndic Ahmed Benali will lose all administrative
                  rights.
                </AlertDescription>
              </Alert>

              <RadioGroup
                value={selectedOwner}
                onValueChange={setSelectedOwner}
                className="min-w-0"
              >
                <ScrollArea className="h-64 pr-3">
                  <div className="space-y-2">
                    {coOwners.map((owner) => (
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
                            <AvatarImage
                              src="https://github.com/shadcn.png"
                              alt={owner.name}
                            />
                            <AvatarFallback>
                              {owner.name
                                .split(' ')
                                .map((name) => name[0])
                                .join('')
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>

                          <FieldContent>
                            <FieldTitle>{owner.name}</FieldTitle>
                            <FieldDescription>
                              Unit {owner.unit}
                            </FieldDescription>
                          </FieldContent>

                          <RadioGroupItem value={owner.id} id={owner.id} />
                        </Field>
                      </FieldLabel>
                    ))}
                  </div>
                </ScrollArea>
              </RadioGroup>

              <DialogFooter>
                <DialogClose
                  render={<Button variant="outline">Cancel</Button>}
                />

                <Button
                  type="button"
                  disabled={!selectedOwner}
                  onClick={handleTransfer}
                >
                  Transfer Management
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardAction>
      </CardHeader>

      <CardContent>
        <Item variant="outline">
          <ItemMedia className="self-center">
            <Avatar className="size-10">
              <AvatarImage src="https://github.com/evilrabbit.png" />
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
          </ItemMedia>

          <ItemContent>
            <ItemTitle className="flex items-center gap-2">
              Ahmed Benali
              <Badge>
                <Shield data-icon="inline-start" />
                Syndic
              </Badge>
            </ItemTitle>

            <ItemDescription className="space-y-0.5">
              <span className="block">
                ahmed.benali@email.ma · +212 661 234 121 03
              </span>
              <span className="block">Unit: A-103</span>
            </ItemDescription>
          </ItemContent>
        </Item>
      </CardContent>
    </Card>
  );
}
