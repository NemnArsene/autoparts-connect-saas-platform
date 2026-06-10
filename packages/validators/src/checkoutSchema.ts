import { z } from 'zod';

export const checkoutSchema = z.object({
  paymentMethod: z.enum(['mobile', 'card', 'cash'], {
    required_error: 'Veuillez choisir un mode de paiement',
  }),
  pickupDate: z
    .string()
    .optional()
    .refine((d) => !d || !isNaN(Date.parse(d)), { message: 'Date invalide' }),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
