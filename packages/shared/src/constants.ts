// ============================================================
// APP CONSTANTS — Platform agnostic
// ============================================================

export const APP_NAME = 'AutoParts Connect';
export const APP_TAGLINE = 'La marketplace des pièces auto en Afrique';

export const CURRENCY = 'XOF';
export const CURRENCY_LOCALE = 'fr-FR';

export const SUPPORT_EMAIL = 'support@autoparts-connect.ci';
export const SUPPORT_PHONE = '+225 27 22 49 30 00';

export const CONTACT_EMAIL = 'contact@autoparts-connect.ci';

export const MAX_CART_QUANTITY = 99;
export const MAX_HISTORY_PAGES = 20;

/** Default pickup delay in days after reservation */
export const DEFAULT_PICKUP_DELAY_DAYS = 3;

/** Storage keys — used by web (localStorage) and mobile (MMKV) */
export const STORAGE_KEYS = {
  CART: 'apc-cart',
  FAVORITES: 'apc-fav',
  THEME: 'apc-dark',
  RESERVATIONS: 'apc-res',
  NOTIF_READ: 'apc-notif',
  AUTH_USER: 'apc-user',
  PUSH_TOKEN: 'apc-push-token',
} as const;
