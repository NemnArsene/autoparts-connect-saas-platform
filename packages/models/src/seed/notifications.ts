// ============================================================
// NOTIFICATIONS SEED DATA
// ============================================================

import type { Notification } from '../types/Notification';

export const NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'reservation', title: 'Réservation confirmée',    message: 'Votre commande #APC-10245 est prête à être retirée chez Africa Auto Parts.',           time: 'Il y a 5 min',    read: false, icon: 'check' },
  { id: 'n2', type: 'stock',       title: 'Stock disponible',          message: 'Les plaquettes de frein Toyota Corolla 2019 sont de nouveau en stock.',                time: 'Il y a 32 min',   read: false, icon: 'package' },
  { id: 'n3', type: 'promo',       title: 'Promotion -25%',            message: 'Découvrez nos promotions sur les filtres à huile premium cette semaine.',              time: 'Il y a 2 h',      read: false, icon: 'tag' },
  { id: 'n4', type: 'system',      title: 'Mise à jour application',   message: 'Nouvelle version disponible avec amélioration des performances.',                      time: 'Hier',            read: true,  icon: 'bell' },
  { id: 'n5', type: 'reservation', title: 'Rappel de retrait',         message: "N'oubliez pas de retirer votre commande avant 18h aujourd'hui.",                      time: 'Hier',            read: true,  icon: 'clock' },
  { id: 'n6', type: 'promo',       title: 'Black Friday anticipé',     message: "Jusqu'à -40% sur une sélection de pièces détachées premium.",                         time: 'Il y a 3 jours',  read: true,  icon: 'tag' },
];
