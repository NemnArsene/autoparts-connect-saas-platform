// ============================================================
// RESERVATION TYPE
// ============================================================

export type ReservationStatus = 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled';

export interface Reservation {
  id: string;
  userId: string;
  partId: string;
  partName: string;
  partImage: string;
  supplierName: string;
  quantity: number;
  totalPrice: number;
  status: ReservationStatus;
  createdAt: string;  // ISO 8601
  pickupDate: string; // ISO 8601
  reference: string;
}

/** Payload to create a new reservation (POST /reservations) */
export interface CreateReservationPayload {
  partId: string;
  partName: string;
  partImage: string;
  supplierName: string;
  quantity: number;
  totalPrice: number;
  pickupDate: string;
}
