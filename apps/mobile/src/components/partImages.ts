// ============================================================
// PART IMAGE MAPPING
// Maps part names to their corresponding real product images
// Supports local assets (Filtration & Électricité) and
// dynamic Unsplash CDN URLs for all other categories.
// ============================================================

// Local assets for Filtration
const filtreHuile = require('../../assets/images/filtration/filtre_a_huile.png');
const filtreAirHabitacle = require('../../assets/images/filtration/filtre_air_habitacle.png');
const filtreCarburant = require('../../assets/images/filtration/filtre_a_carburant.png');
const filtreAirMoteur = require('../../assets/images/filtration/filtre_air_moteur.png');
const filtreHydraulique = require('../../assets/images/filtration/filtre_hydraulique.png');

// Local assets for Électricité
const batterie12V = require('../../assets/images/electricite/batterie_12v.png');
const alternateur = require('../../assets/images/electricite/alternateur.png');
const demarreur = require('../../assets/images/electricite/demarreur.png');
const capteurABS = require('../../assets/images/electricite/capteur_abs.png');
const bobineAllumage = require('../../assets/images/electricite/bobine_allumage.png');
const capteurPMH = require('../../assets/images/electricite/capteur_pmh.png');
const faisceauElectrique = require('../../assets/images/electricite/faisceau_electrique.png');

// Local Name → Image mapping (normalized lowercase keys)
const LOCAL_IMAGE_MAP: Record<string, any> = {
  // Filtration
  'filtre à huile': filtreHuile,
  'filtre à air habitacle': filtreAirHabitacle,
  'filtre à carburant': filtreCarburant,
  'filtre à air moteur': filtreAirMoteur,
  'filtre hydraulique': filtreHydraulique,

  // Électricité
  'batterie 12v': batterie12V,
  'alternateur': alternateur,
  'démarreur': demarreur,
  'capteur abs': capteurABS,
  "bobine d'allumage": bobineAllumage,
  'capteur pmh': capteurPMH,
  'faisceau électrique': faisceauElectrique,
};

// Premium Unsplash Photos for each category (studio/professional neutral background)
const DYNAMIC_CATEGORY_IMAGES = {
  freinage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&h=400&fit=crop&q=80',
  pneumatiques: 'https://images.unsplash.com/photo-1552656967-7a0991a13906?w=400&h=400&fit=crop&q=80',
  eclairage: 'https://images.unsplash.com/photo-1606577924006-27d39b132ae2?w=400&h=400&fit=crop&q=80',
  lubrification: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=400&fit=crop&q=80',
  refroidissement: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&h=400&fit=crop&q=80',
  echappement: 'https://images.unsplash.com/photo-1506015391300-4802db74de2e?w=400&h=400&fit=crop&q=80',
  transmission: 'https://images.unsplash.com/photo-1562620644-65ab4779728f?w=400&h=400&fit=crop&q=80',
  suspension: 'https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?w=400&h=400&fit=crop&q=80',
  carrosserie: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=400&fit=crop&q=80',
  moteur: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400&h=400&fit=crop&q=80',
};

/**
 * Returns the real product image source (local require OR remote { uri }) for a part.
 * Returns null if no image is mapped.
 */
export function getPartImage(partName: string): any | null {
  const key = partName.toLowerCase().trim();
  
  // 1. Check local assets mapping
  if (LOCAL_IMAGE_MAP[key]) {
    return LOCAL_IMAGE_MAP[key];
  }

  // 2. Keyword-based matching for other categories
  if (key.includes('frein') || key.includes('plaquette') || key.includes('disque') || key.includes('étrier') || key.includes('tambour') || key.includes('cylindre')) {
    return { uri: DYNAMIC_CATEGORY_IMAGES.freinage };
  }
  if (key.includes('pneu') || key.includes('jante') || key.includes('enjoliveur')) {
    return { uri: DYNAMIC_CATEGORY_IMAGES.pneumatiques };
  }
  if (key.includes('phare') || key.includes('ampoule') || key.includes('feu') || key.includes('clignotant') || key.includes('lampe')) {
    return { uri: DYNAMIC_CATEGORY_IMAGES.eclairage };
  }
  if (key.includes('huile') || key.includes('graisse') || key.includes('liquide de frein') || key.includes('liquide de direction') || key.includes('lubrifi')) {
    return { uri: DYNAMIC_CATEGORY_IMAGES.lubrification };
  }
  if (key.includes('radiateur') || key.includes('thermostat') || key.includes('durite') || key.includes('ventilateur') || key.includes('refroidissement')) {
    return { uri: DYNAMIC_CATEGORY_IMAGES.refroidissement };
  }
  if (key.includes('catalyseur') || key.includes('silencieux') || key.includes('pot') || key.includes('échappement') || key.includes('lambda')) {
    return { uri: DYNAMIC_CATEGORY_IMAGES.echappement };
  }
  if (key.includes('embrayage') || key.includes('volant moteur') || key.includes('cardan') || key.includes('boîte') || key.includes('boite') || key.includes('synchroniseur')) {
    return { uri: DYNAMIC_CATEGORY_IMAGES.transmission };
  }
  if (key.includes('amortisseur') || key.includes('ressort') || key.includes('stabilisatrice') || key.includes('suspension') || key.includes('silentbloc') || key.includes('bras') || key.includes('rotule')) {
    return { uri: DYNAMIC_CATEGORY_IMAGES.suspension };
  }
  if (key.includes('pare-chocs') || key.includes('aile') || key.includes('capot') || key.includes('porte') || key.includes('rétroviseur') || key.includes('vitre')) {
    return { uri: DYNAMIC_CATEGORY_IMAGES.carrosserie };
  }
  if (key.includes('moteur') || key.includes('courroie') || key.includes('pompe') || key.includes('joint') || key.includes('vanne') || key.includes('turbo') || key.includes('injecteur') || key.includes('bougie')) {
    return { uri: DYNAMIC_CATEGORY_IMAGES.moteur };
  }

  // Fallback to a general professional part image
  return { uri: 'https://images.unsplash.com/photo-1562620644-65ab4779728f?w=400&h=400&fit=crop&q=80' };
}

/**
 * Check if a part has a mapped real image or keyword category matching
 */
export function hasPartImage(partName: string): boolean {
  return getPartImage(partName) !== null;
}
