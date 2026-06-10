// ============================================================
// RESERVATIONS SEED DATA
// ============================================================

import type { Reservation, ReservationStatus } from '../types/Reservation';
import { PARTS } from './parts';
import { seedRandom } from './_seedRandom';

const STATUSES: ReservationStatus[] = ['pending', 'confirmed', 'ready', 'completed', 'cancelled'];

function generateReservations(): Reservation[] {
  const rnd = seedRandom(13);
  const list: Reservation[] = [];

  for (let i = 1; i <= 2000; i++) {
    const part = PARTS[Math.floor(rnd() * PARTS.length)];
    const qty = 1 + Math.floor(rnd() * 3);
    const status = STATUSES[Math.floor(rnd() * STATUSES.length)];
    const daysAgo = Math.floor(rnd() * 60);
    const created = new Date(Date.now() - daysAgo * 86400000);
    const pickup = new Date(Date.now() + (Math.floor(rnd() * 14) - 5) * 86400000);

    list.push({
      id: `res-${i.toString().padStart(4, '0')}`,
      userId: `usr-${100 + i}`,
      partId: part.id,
      partName: part.name,
      partImage: part.image,
      supplierName: part.supplierName,
      quantity: qty,
      totalPrice: part.price * qty,
      status,
      createdAt: created.toISOString(),
      pickupDate: pickup.toISOString(),
      reference: `APC-${(10000 + i).toString()}`,
    });
  }

  return list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export const RESERVATIONS: Reservation[] = generateReservations();
