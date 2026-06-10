// ============================================================
// BRANDS & MODELS CONSTANTS
// ============================================================

import type { Brand } from '../types/Part';

export const BRANDS: Brand[] = [
  'Toyota', 'Honda', 'BMW', 'Mercedes', 'Audi',
  'Ford', 'Nissan', 'Peugeot', 'Hyundai', 'Kia',
];

export const MODELS_BY_BRAND: Record<Brand, string[]> = {
  Toyota:   ['Corolla', 'Yaris', 'RAV4', 'Hilux', 'Camry', 'Land Cruiser', 'Prado', 'C-HR'],
  Honda:    ['Civic', 'Accord', 'CR-V', 'HR-V', 'Jazz', 'Pilot', 'City'],
  BMW:      ['Série 1', 'Série 3', 'Série 5', 'X1', 'X3', 'X5', 'X6', 'i8'],
  Mercedes: ['Classe A', 'Classe C', 'Classe E', 'GLA', 'GLC', 'GLE', 'AMG GT'],
  Audi:     ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7', 'RS6', 'e-tron'],
  Ford:     ['Fiesta', 'Focus', 'Mondeo', 'Kuga', 'Puma', 'Ranger', 'Mustang'],
  Nissan:   ['Micra', 'Sentra', 'Qashqai', 'X-Trail', 'Patrol', 'Leaf', 'Juke'],
  Peugeot:  ['208', '308', '3008', '5008', '2008', '508', 'Partner'],
  Hyundai:  ['i10', 'i20', 'i30', 'Tucson', 'Santa Fe', 'Kona', 'Ioniq'],
  Kia:      ['Picanto', 'Rio', 'Ceed', 'Sportage', 'Sorento', 'Stonic', 'EV6'],
};
