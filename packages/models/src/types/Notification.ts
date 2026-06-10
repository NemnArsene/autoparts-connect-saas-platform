// ============================================================
// NOTIFICATION TYPE
// ============================================================

export type NotificationType = 'reservation' | 'stock' | 'promo' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
}
