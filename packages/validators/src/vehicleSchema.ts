import { z } from 'zod';

export const vehicleSchema = z.object({
  brand: z.string({ required_error: 'La marque est requise' }).min(1),
  model: z.string({ required_error: 'Le modèle est requis' }).min(1),
  year: z
    .number()
    .int()
    .min(1990, 'Année minimum : 1990')
    .max(new Date().getFullYear() + 1, 'Année invalide'),
  plate: z
    .string({ required_error: "La plaque d'immatriculation est requise" })
    .min(5, 'Format invalide'),
  color: z.string().optional(),
  vin: z.string().optional(),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;
