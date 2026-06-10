// ============================================================
// SUPPLIERS SEED DATA
// ============================================================

import type { Supplier } from '../types/Supplier';
import { seedRandom } from './_seedRandom';

const CITIES: [string, string][] = [
  ['Abidjan', "Côte d'Ivoire"], ['Dakar', 'Sénégal'], ['Lomé', 'Togo'],
  ['Douala', 'Cameroun'], ['Bamako', 'Mali'], ['Cotonou', 'Bénin'],
  ['Ouagadougou', 'Burkina Faso'], ['Niamey', 'Niger'], ['Kinshasa', 'RDC'],
  ['Brazzaville', 'Congo'], ['Libreville', 'Gabon'], ['Yaoundé', 'Cameroun'],
];

const SUPPLIER_PREFIXES = [
  'Africa', 'Afri', 'Sun', 'Star', 'Royal',
  'Auto', 'Garage', 'Sahel', 'Tropic', 'Continental',
];

const SUPPLIER_SUFFIXES = [
  'Pièces Auto', 'Auto Parts', 'Motors', 'Garage', 'Distribution',
];

function generateSuppliers(): Supplier[] {
  const rnd = seedRandom(42);
  const list: Supplier[] = [];
  for (let i = 1; i <= 20; i++) {
    const [city, country] = CITIES[Math.floor(rnd() * CITIES.length)];
    const prefix = SUPPLIER_PREFIXES[Math.floor(rnd() * SUPPLIER_PREFIXES.length)];
    const validated = rnd() > 0.25;
    list.push({
      id: `sup-${i.toString().padStart(3, '0')}`,
      name: `${prefix} ${SUPPLIER_SUFFIXES[Math.floor(rnd() * SUPPLIER_SUFFIXES.length)]}`,
      city,
      country,
      rating: Math.round((3.5 + rnd() * 1.5) * 10) / 10,
      validated,
      productsCount: Math.floor(80 + rnd() * 600),
      phone: `+225 0${Math.floor(10 + rnd() * 89)} ${Math.floor(10 + rnd() * 89)} ${Math.floor(10 + rnd() * 89)} ${Math.floor(10 + rnd() * 89)}`,
      email: `contact@${prefix.toLowerCase()}-auto.ci`,
      logo: prefix.charAt(0) + (SUPPLIER_PREFIXES[Math.floor(rnd() * SUPPLIER_PREFIXES.length)].charAt(0)),
    });
  }
  return list;
}

export const SUPPLIERS: Supplier[] = generateSuppliers();
