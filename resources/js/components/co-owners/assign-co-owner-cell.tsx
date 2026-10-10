import { valibotResolver } from '@hookform/resolvers/valibot';
import { router } from '@inertiajs/react';
import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import * as v from 'valibot';

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
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useTranslation } from '@/hooks/use-translation';
import type { TFunction } from '@/hooks/use-translation';

type UnassignedCoOwnerOption = {
  id: string;
  name: string;
};

type AssignCoOwnerCellProps = {
  unitId: number;
  unitLabel: string;
  unassignedCoOwners: UnassignedCoOwnerOption[];
  t: TFunction;
};

function buildSchema(unassignedCoOwnerIds: string[]) {
  return v.variant('mode', [
    v.object({
      mode: v.literal('existing'),
      co_owner_id: v.picklist(unassignedCoOwnerIds, 'Select a valid co-owner.'),
    }),
    v.object({
      mode: v.literal('new'),
      name: v.pipe(
        v.string(),
        v.trim(),
        v.minLength(1, 'Name is required.'),
        v.maxLength(255, 'Name must be 255 characters or fewer.'),
      ),
      email: v.optional(
        v.pipe(v.string(), v.trim(), v.email('Enter a valid email.'), v.maxLength(255)),
      ),
      phone: v.optional(v.pipe(v.string(), v.trim(), v.maxLength(50))),
    }),
  ]);
}

type AssignCoOwnerFormValues = v.InferOutput<ReturnType<typeof buildSchema>>;

const FORM_ID = 'assign-co-owner-form';

export function AssignCoOwnerCell({
  unitId,
  unitLabel,
  unassignedCoOwners,
  t,
}: AssignCoOwnerCellProps) {
  const { isRtl } = useTranslation();
  const [open, setOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const defaultMode: 'existing' | 'new' = unassignedCoOwners.length > 0 ? 'existing' : 'new';

  const schema = buildSchema(unassignedCoOwners.map((c) => c.id));

  const { control, reset, setError, handleSubmit } = useForm<AssignCoOwnerFormValues>({
    resolver: valibotResolver(schema),
    defaultValues: {
      mode: defaultMode,
      co_owner_id: undefined,
      name: '',
      email: '',
      phone: '',
    } as never,
  });

  const mode = useWatch({
    control,
    name: 'mode',
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);

    if (!next) {
      reset();
    }
  }

  function handleModeChange(next: 'existing' | 'new') {
    reset(
      next === 'existing'
        ? { mode: 'existing', co_owner_id: undefined }
        : { mode: 'new', name: '', email: '', phone: '' },
    );
  }

  function onSubmit(values: AssignCoOwnerFormValues) {
    setProcessing(true);

    router.post(`/units/${unitId}/co-owners`, values, {
      preserveScroll: true,
      onSuccess: () => {
        setOpen(false);
        reset();
      },
      onError: (errors) => {
        Object.entries(errors).forEach(([field, message]) => {
          setError(field as keyof AssignCoOwnerFormValues, {
            type: 'server',
            message: message as string,
          });
        });
      },
      onFinish: () => setProcessing(false),
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon-sm">
            <UserPlus />
            <span className="sr-only">
              {t('assign_dialog.trigger_sr_label', { unit: unitLabel })}
            </span>
          </Button>
        }
      />

      <DialogContent className="sm:max-w-sm" dir={isRtl ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle>{t('assign_dialog.title')}</DialogTitle>
          <DialogDescription>
            {t('assign_dialog.description', { unit: unitLabel })}
          </DialogDescription>
        </DialogHeader>

        <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <Tabs
              value={mode}
              onValueChange={(value) => handleModeChange(value as 'existing' | 'new')}
              className="flex w-full flex-col"
            >
              <TabsList className="flex w-full">
                <TabsTrigger value="existing" className="flex-1">
                  {t('assign_dialog.existing_tab')}
                </TabsTrigger>

                <TabsTrigger value="new" className="flex-1">
                  {t('assign_dialog.new_tab')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="existing" className="w-full pt-4">
                <FieldGroup>
                  <Controller
                    name="co_owner_id"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="existing-co-owner">
                          {t('assign_dialog.existing_co_owner_label')}
                        </FieldLabel>

                        <Select
                          name={field.name}
                          value={field.value ? String(field.value) : ''}
                          onValueChange={(value) => field.onChange(Number(value))}
                          disabled={unassignedCoOwners.length === 0}
                        >
                          <SelectTrigger
                            id="existing-co-owner"
                            className="w-full"
                            aria-invalid={fieldState.invalid}
                          >
                            <SelectValue
                              placeholder={
                                unassignedCoOwners.length === 0
                                  ? t('assign_dialog.no_unassigned_co_owners')
                                  : t('assign_dialog.existing_co_owner_placeholder')
                              }
                            />
                          </SelectTrigger>

                          <SelectContent>
                            {unassignedCoOwners.map((coOwner) => (
                              <SelectItem key={coOwner.id} value={String(coOwner.id)}>
                                {coOwner.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </TabsContent>

              <TabsContent value="new" className="w-full pt-4">
                <FieldGroup>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          {t('assign_dialog.name_label')}
                        </FieldLabel>

                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          autoComplete="off"
                        />

                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="email"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          {t('assign_dialog.email_label')}
                        </FieldLabel>

                        <Input
                          {...field}
                          id={field.name}
                          type="email"
                          aria-invalid={fieldState.invalid}
                          autoComplete="off"
                        />

                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="phone"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          {t('assign_dialog.phone_label')}
                        </FieldLabel>

                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          autoComplete="off"
                        />

                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </TabsContent>
            </Tabs>
          </div>
        </form>

        <DialogFooter>
          <DialogClose
            render={<Button variant="outline">{t('assign_dialog.cancel_button')}</Button>}
          />

          <Button
            type="submit"
            form={FORM_ID}
            disabled={processing || (mode === 'existing' && unassignedCoOwners.length === 0)}
          >
            {processing ? t('assign_dialog.assigning_button') : t('assign_dialog.assign_button')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
