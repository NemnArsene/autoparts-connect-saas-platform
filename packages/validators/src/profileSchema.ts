import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email("Format d'email invalide"),
  phone: z
    .string()
    .regex(/^\+?\d[\d\s\-]{7,15}$/, 'Numéro de téléphone invalide'),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
