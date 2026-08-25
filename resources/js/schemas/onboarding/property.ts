import { z } from 'zod';

export const propertySchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Property name is required')
        .max(200, 'Property name must be 200 characters or fewer'),

    address: z.string().trim().optional().or(z.literal('')),

    city: z
        .string()
        .trim()
        .min(1, 'City is required')
        .max(100, 'City must be 100 characters or fewer'),

    postal_code: z
        .string()
        .trim()
        .max(20, 'Postal code must be 20 characters or fewer')
        .optional()
        .or(z.literal('')),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;

export const propertyDefaultValues: PropertyFormValues = {
    name: '',
    address: '',
    city: '',
    postal_code: '',
};
