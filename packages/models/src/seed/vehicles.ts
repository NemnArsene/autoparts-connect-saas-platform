// ============================================================
// VEHICLES SEED DATA
// ============================================================

import type { Vehicle } from '../types/Vehicle';
import type { Brand } from '../types/Part';
import { BRANDS, MODELS_BY_BRAND } from '../constants/brands';
import { seedRandom } from './_seedRandom';

const COLORS = ['Blanc', 'Noir', 'Gris', 'Rouge', 'Bleu', 'Argent', 'Vert', 'Beige'];

function generateVehicles(): Vehicle[] {
  const rnd = seedRandom(99);
  const list: Vehicle[] = [];
  for (let i = 1; i <= 1000; i++) {
    const brand: Brand = BRANDS[Math.floor(rnd() * BRANDS.length)];
    const models = MODELS_BY_BRAND[brand];
    const model = models[Math.floor(rnd() * models.length)];
    list.push({
      id: `veh-${i.toString().padStart(4, '0')}`,
      brand,
      model,
      year: 2008 + Math.floor(rnd() * 18),
      plate: `${String.fromCharCode(65 + Math.floor(rnd() * 26))}${String.fromCharCode(65 + Math.floor(rnd() * 26))}-${1000 + Math.floor(rnd() * 9000)}-${String.fromCharCode(65 + Math.floor(rnd() * 26))}${String.fromCharCode(65 + Math.floor(rnd() * 26))}`,
      color: COLORS[Math.floor(rnd() * COLORS.length)],
    });
  }
  return list;
}

export const VEHICLES: Vehicle[] = generateVehicles();
