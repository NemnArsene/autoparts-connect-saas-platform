import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({ required_error: "L'email est requis" })
    .email("Format d'email invalide"),
  password: z
    .string({ required_error: 'Le mot de passe est requis' })
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
