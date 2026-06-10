// ============================================================
// PARTS SEED DATA
// ============================================================

import type { Part, Brand } from '../types/Part';
import { CATEGORIES } from '../constants/categories';
import { BRANDS, MODELS_BY_BRAND } from '../constants/brands';
import { SUPPLIERS } from './suppliers';
import { seedRandom } from './_seedRandom';

const PART_NAME_TEMPLATES: Record<string, string[]> = {
  freinage:        ['Plaquettes de frein avant', 'Disque de frein ventilé', 'Étrier de frein', 'Mâchoires de frein arrière', 'Tambour de frein', 'Flexible de frein', 'Maître-cylindre de frein', 'Servofrein'],
  moteur:          ['Filtre à air', "Bougie d'allumage", 'Courroie de distribution', 'Pompe à eau', 'Joint de culasse', 'Vanne EGR', 'Turbo compresseur', 'Pompe à carburant', 'Injecteur'],
  suspension:      ["Amortisseur avant", 'Ressort hélicoïdal', 'Barre stabilisatrice', 'Rotule de suspension', 'Bras de suspension', "Coupelle d'amortisseur", 'Silentbloc de barre'],
  filtration:      ["Filtre à huile", "Filtre à air habitacle", "Filtre à carburant", "Filtre à air moteur", 'Filtre hydraulique'],
  electricite:     ['Batterie 12V', 'Alternateur', 'Démarreur', 'Capteur ABS', "Bobine d'allumage", 'Capteur PMH', 'Faisceau électrique'],
  transmission:    ['Embrayage kit complet', 'Volant moteur', 'Cardan de transmission', 'Boîte de vitesses', 'Synchroniseur', "Câble d'embrayage", "Butée d'embrayage"],
  carrosserie:     ['Pare-chocs avant', 'Aile avant', 'Capot', 'Porte conducteur', 'Rétroviseur extérieur', 'Vitre latérale', 'Phare avant'],
  pneumatiques:    ['Pneu 205/55 R16', 'Pneu 225/45 R17', 'Pneu 195/65 R15', 'Pneu 4x4', 'Jante alliage 17"', 'Enjoliveur'],
  eclairage:       ['Phare LED H7', 'Ampoule H4', 'Feu arrière', 'Clignotant', 'Phare antibrouillard', 'Lampe LED habitacle'],
  refroidissement: ['Radiateur de refroidissement', 'Thermostat', 'Durite de radiateur', 'Ventilateur moteur', 'Bouchon de vase', 'Liquide de refroidissement'],
  echappement:     ['Catalyseur', 'Silencieux arrière', 'Tube intermédiaire', "Pot d'échappement", "Joint d'échappement", 'Sonde Lambda'],
  lubrification:   ['Huile moteur 5W30', 'Huile moteur 10W40', 'Huile de boîte', 'Graisse universelle', 'Liquide de frein DOT4', 'Liquide de direction'],
};

const PART_IMAGE_COLORS = [
  'from-slate-700 to-slate-900', 'from-rose-600 to-red-800',
  'from-amber-500 to-orange-700', 'from-violet-600 to-indigo-800',
  'from-emerald-600 to-teal-800', 'from-sky-600 to-blue-800',
  'from-fuchsia-600 to-pink-800', 'from-yellow-500 to-amber-700',
];

function generateParts(): Part[] {
  const rnd = seedRandom(7);
  const list: Part[] = [];
  let id = 1;

  CATEGORIES.forEach((cat) => {
    const templates = PART_NAME_TEMPLATES[cat.id] ?? ['Pièce automobile'];
    const count = Math.floor(380 + rnd() * 80);
    for (let i = 0; i < count; i++) {
      const template = templates[Math.floor(rnd() * templates.length)];
      const brand: Brand = BRANDS[Math.floor(rnd() * BRANDS.length)];
      const models = MODELS_BY_BRAND[brand];
      const compatibleCount = 1 + Math.floor(rnd() * 4);
      const compatibleModels: string[] = [];
      for (let m = 0; m < compatibleCount; m++) {
        const mdl = models[Math.floor(rnd() * models.length)];
        if (!compatibleModels.includes(mdl)) compatibleModels.push(mdl);
      }
      const supplier = SUPPLIERS[Math.floor(rnd() * SUPPLIERS.length)];
      const basePrice = Math.floor(3000 + rnd() * 80000);
      const isPromo = rnd() > 0.78;
      const oldPrice = isPromo ? Math.floor(basePrice * (1.15 + rnd() * 0.3)) : undefined;
      const stock = Math.floor(rnd() * 50);

      list.push({
        id: `prt-${id.toString().padStart(5, '0')}`,
        ref: `AP-${cat.id.toUpperCase().slice(0, 3)}-${(1000 + id).toString()}`,
        name: template,
        category: cat.id,
        brand,
        compatibleModels,
        price: basePrice,
        oldPrice,
        stock,
        supplierId: supplier.id,
        supplierName: supplier.name,
        image: PART_IMAGE_COLORS[Math.floor(rnd() * PART_IMAGE_COLORS.length)],
        rating: Math.round((3.5 + rnd() * 1.5) * 10) / 10,
        reviews: Math.floor(rnd() * 250),
        warranty: ['3 mois', '6 mois', '1 an', '2 ans'][Math.floor(rnd() * 4)],
        inStock: stock > 0,
        isNew: rnd() > 0.85,
        isPromo,
      });
      id++;
    }
  });

  return list.slice(0, 5000);
}

export const PARTS: Part[] = generateParts();

/** Pre-filtered slices — consumed directly by hooks */
export const FEATURED_PARTS: Part[] = PARTS.filter((p) => p.isNew).slice(0, 8);
export const POPULAR_PARTS: Part[] = PARTS.filter((p) => p.rating >= 4.5).slice(0, 8);
