// ============================================================
// RESERVATION STATUS CONSTANTS
// Used by both web StatusBadge and mobile StatusBadge
// ============================================================

import type { ReservationStatus } from '../types/Reservation';

export interface StatusMeta {
  label: string;
  /** Tailwind classes (web) */
  webClass: string;
  /** Hex color (mobile) */
  color: string;
  bgColor: string;
}

export const RESERVATION_STATUS_MAP: Record<ReservationStatus, StatusMeta> = {
  pending: {
    label:    'En attente',
    webClass: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
    color:    '#d97706',
    bgColor:  '#fef3c7',
  },
  confirmed: {
    label:    'Confirmée',
    webClass: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
    color:    '#0284c7',
    bgColor:  '#e0f2fe',
  },
  ready: {
    label:    'Prête',
    webClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    color:    '#059669',
    bgColor:  '#d1fae5',
  },
  completed: {
    label:    'Terminée',
    webClass: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    color:    '#475569',
    bgColor:  '#f1f5f9',
  },
  cancelled: {
    label:    'Annulée',
    webClass: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
    color:    '#e11d48',
    bgColor:  '#fee2e2',
  },
};
