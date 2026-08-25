import { z } from 'zod';

export const propertySchema = z.object({
    name: z
        .string()
        .min(2, 'Property name must be at least 2 characters')
        .max(120, 'Property name is too long'),
    address: z.string().min(5, 'Enter a full street address'),
    city: z.string().min(2, 'City is required'),
    postalCode: z.string().regex(/^\d{5}$/, 'Postal code must be 5 digits'),
    unitsCount: z.coerce
        .number({ message: 'Units count must be a number' })
        .int('Units count must be a whole number')
        .min(1, 'Property must have at least 1 unit')
        .max(2000, 'That seems too large — contact support for bulk imports'),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;

export type PropertyFormErrors = Partial<
    Record<keyof PropertyFormValues, string>
>;

export function validatePropertyForm(values: Record<string, unknown>): {
    success: boolean;
    data?: PropertyFormValues;
    errors: PropertyFormErrors;
} {
    const result = propertySchema.safeParse(values);

    if (result.success) {
        return { success: true, data: result.data, errors: {} };
    }

    const errors: PropertyFormErrors = {};

    for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof PropertyFormValues;

        if (!errors[field]) {
            errors[field] = issue.message;
        }
    }

    return { success: false, errors };
}
