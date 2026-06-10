// ============================================================
// COMPATIBILITY SHIM
// All data now lives in @autoparts/models.
// This file re-exports everything so existing web imports
// (import { PARTS } from '../../data/seed') keep working.
// ============================================================

export type {
  Brand,
  Part,
  Supplier,
  Vehicle,
  Reservation,
  Notification,
} from '@autoparts/models';

export {
  PARTS,
  FEATURED_PARTS,
  POPULAR_PARTS,
  SUPPLIERS,
  VEHICLES,
  RESERVATIONS,
  NOTIFICATIONS,
  CATEGORIES,
  BRANDS,
  MODELS_BY_BRAND,
  formatPrice,
  relativeDate,
} from '@autoparts/models';
