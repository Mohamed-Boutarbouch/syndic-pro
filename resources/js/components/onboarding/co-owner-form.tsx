import { valibotResolver } from '@hookform/resolvers/valibot';
import { router } from '@inertiajs/react';
import { Check, Info, Shield } from 'lucide-react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { store } from '@/actions/App/Http/Controllers/Onboarding/CoOwnerController';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Field,
    FieldContent,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldTitle,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from '@/components/ui/item';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { CoOwnerPageProps } from '@/pages/onboarding/co-owner';
import {
    coOwnersSchema,
    createEmptyCoOwner,
} from '@/schemas/onboarding/co-owners';
import type { CoOwnerFormValues } from '@/schemas/onboarding/co-owners';
export function CoOwnerForm({
    property,
    units,
    billingFrequency: BILLING_FREQUENCY,
}: CoOwnerPageProps) {
    const form = useForm<CoOwnerFormValues>({
        resolver: valibotResolver(coOwnersSchema),
        defaultValues: {
            coOwners: units.map((unit) => createEmptyCoOwner(unit)),
            syndicUnitId: undefined,
        },
        mode: 'onBlur',
    });

    const { fields } = useFieldArray({
        control: form.control,
        name: 'coOwners',
    });

    function submitHandler(values: CoOwnerFormValues) {
        router.post(store.url({ property: property.id }), values, {
            preserveScroll: true,
            onError: (errors) => {
                for (const [field, message] of Object.entries(errors)) {
                    if (typeof message === 'string') {
                        form.setError(field as keyof CoOwnerFormValues, {
                            type: 'server',
                            message,
                        });
                    }
                }
            },
        });
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Assign co-owners</CardTitle>
                <CardDescription>
                    Add a co-owner for each unit and configure their billing
                    preferences.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    id="onboarding-co-owners-form"
                    onSubmit={form.handleSubmit(submitHandler)}
                >
                    <Controller
                        name="syndicUnitId"
                        control={form.control}
                        render={({
                            field: syndicField,
                            fieldState: syndicFieldState,
                        }) => (
                            <>
                                <RadioGroup
                                    value={
                                        syndicField.value !== undefined
                                            ? String(syndicField.value)
                                            : undefined
                                    }
                                    onValueChange={(value) =>
                                        syndicField.onChange(Number(value))
                                    }
                                >
                                    <FieldGroup className="gap-6">
                                        {fields.map((field, index) => {
                                            const unit = units[index];

                                            return (
                                                <Item
                                                    key={field.id}
                                                    variant="outline"
                                                    className="relative flex-col items-stretch gap-4"
                                                >
                                                    <ItemTitle>
                                                        Unit {unit.label}
                                                        {unit.type
                                                            ? ` · ${unit.type}`
                                                            : ''}
                                                    </ItemTitle>
                                                    <div className="grid gap-6 md:grid-cols-2">
                                                        <Controller
                                                            name={`coOwners.${index}.name`}
                                                            control={
                                                                form.control
                                                            }
                                                            render={({
                                                                field: f,
                                                                fieldState,
                                                            }) => (
                                                                <Field
                                                                    data-invalid={
                                                                        fieldState.invalid
                                                                    }
                                                                >
                                                                    <FieldLabel
                                                                        htmlFor={`owner-name-${index}`}
                                                                    >
                                                                        Owner
                                                                        name
                                                                        <span className="text-destructive">
                                                                            *
                                                                        </span>
                                                                    </FieldLabel>
                                                                    <Input
                                                                        {...f}
                                                                        id={`owner-name-${index}`}
                                                                        aria-invalid={
                                                                            fieldState.invalid
                                                                        }
                                                                        placeholder="e.g. John Doe"
                                                                        autoComplete="name"
                                                                    />
                                                                    {fieldState.invalid && (
                                                                        <FieldError
                                                                            errors={[
                                                                                fieldState.error,
                                                                            ]}
                                                                        />
                                                                    )}
                                                                </Field>
                                                            )}
                                                        />
                                                        <Controller
                                                            name={`coOwners.${index}.email`}
                                                            control={
                                                                form.control
                                                            }
                                                            render={({
                                                                field: f,
                                                                fieldState,
                                                            }) => (
                                                                <Field
                                                                    data-invalid={
                                                                        fieldState.invalid
                                                                    }
                                                                >
                                                                    <FieldLabel
                                                                        htmlFor={`owner-email-${index}`}
                                                                    >
                                                                        Email
                                                                    </FieldLabel>
                                                                    <Input
                                                                        {...f}
                                                                        type="email"
                                                                        id={`owner-email-${index}`}
                                                                        aria-invalid={
                                                                            fieldState.invalid
                                                                        }
                                                                        placeholder="owner@email.com"
                                                                        autoComplete="email"
                                                                    />
                                                                    {fieldState.invalid && (
                                                                        <FieldError
                                                                            errors={[
                                                                                fieldState.error,
                                                                            ]}
                                                                        />
                                                                    )}
                                                                </Field>
                                                            )}
                                                        />
                                                        <Controller
                                                            name={`coOwners.${index}.phone`}
                                                            control={
                                                                form.control
                                                            }
                                                            render={({
                                                                field: f,
                                                                fieldState,
                                                            }) => (
                                                                <Field
                                                                    data-invalid={
                                                                        fieldState.invalid
                                                                    }
                                                                >
                                                                    <FieldLabel
                                                                        htmlFor={`owner-phone-${index}`}
                                                                    >
                                                                        Phone
                                                                    </FieldLabel>
                                                                    <Input
                                                                        {...f}
                                                                        type="tel"
                                                                        id={`owner-phone-${index}`}
                                                                        aria-invalid={
                                                                            fieldState.invalid
                                                                        }
                                                                        placeholder="+212 6XX XXX XXX"
                                                                        autoComplete="tel"
                                                                    />
                                                                    {fieldState.invalid && (
                                                                        <FieldError
                                                                            errors={[
                                                                                fieldState.error,
                                                                            ]}
                                                                        />
                                                                    )}
                                                                </Field>
                                                            )}
                                                        />
                                                        <Controller
                                                            name={`coOwners.${index}.billing_frequency`}
                                                            control={
                                                                form.control
                                                            }
                                                            render={({
                                                                field: f,
                                                                fieldState,
                                                            }) => (
                                                                <Field
                                                                    data-invalid={
                                                                        fieldState.invalid
                                                                    }
                                                                >
                                                                    <FieldLabel
                                                                        htmlFor={`billing-frequency-${index}`}
                                                                    >
                                                                        Billing
                                                                        frequency
                                                                    </FieldLabel>
                                                                    <Select
                                                                        name={
                                                                            f.name
                                                                        }
                                                                        value={
                                                                            f.value
                                                                        }
                                                                        onValueChange={
                                                                            f.onChange
                                                                        }
                                                                    >
                                                                        <SelectTrigger
                                                                            id={`billing-frequency-${index}`}
                                                                            aria-invalid={
                                                                                fieldState.invalid
                                                                            }
                                                                        >
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {BILLING_FREQUENCY.map(
                                                                                (
                                                                                    frequency,
                                                                                ) => (
                                                                                    <SelectItem
                                                                                        key={
                                                                                            frequency.value
                                                                                        }
                                                                                        value={
                                                                                            frequency.value
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            frequency.label
                                                                                        }
                                                                                    </SelectItem>
                                                                                ),
                                                                            )}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    {fieldState.invalid && (
                                                                        <FieldError
                                                                            errors={[
                                                                                fieldState.error,
                                                                            ]}
                                                                        />
                                                                    )}
                                                                </Field>
                                                            )}
                                                        />
                                                        <Field className="md:col-span-2">
                                                            <FieldLabel
                                                                htmlFor={`designated-syndic-${index}`}
                                                                className="cursor-pointer"
                                                            >
                                                                <Field
                                                                    orientation="horizontal"
                                                                    className="items-start"
                                                                >
                                                                    <RadioGroupItem
                                                                        value={String(
                                                                            unit.id,
                                                                        )}
                                                                        id={`designated-syndic-${index}`}
                                                                    />
                                                                    <FieldContent>
                                                                        <FieldTitle className="flex items-center gap-2">
                                                                            <Shield className="size-5" />
                                                                            Designate
                                                                            as
                                                                            syndic
                                                                        </FieldTitle>
                                                                        <span className="text-sm text-muted-foreground">
                                                                            This
                                                                            co-owner
                                                                            will
                                                                            manage
                                                                            the
                                                                            property.
                                                                        </span>
                                                                    </FieldContent>
                                                                </Field>
                                                            </FieldLabel>
                                                        </Field>
                                                    </div>
                                                </Item>
                                            );
                                        })}
                                    </FieldGroup>
                                </RadioGroup>
                                {syndicFieldState.invalid && (
                                    <FieldError
                                        errors={[syndicFieldState.error]}
                                    />
                                )}
                            </>
                        )}
                    />
                    {form.formState.errors.coOwners?.root && (
                        <FieldError
                            errors={[form.formState.errors.coOwners.root]}
                        />
                    )}
                </form>
                <Item className="mt-4" variant="outline" size="sm">
                    <ItemMedia>
                        <Info />
                    </ItemMedia>
                    <ItemContent>
                        <ItemDescription>
                            Only one co-owner can be the syndic. You can change
                            this later from the Co-Owners tab.
                        </ItemDescription>
                    </ItemContent>
                </Item>
                <div className="mt-6 flex justify-end">
                    <Button type="submit" form="onboarding-co-owners-form">
                        Complete setup
                        <Check data-icon="inline-end" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
