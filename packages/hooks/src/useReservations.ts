import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { appStorageAdapter } from './storage';
import { STORAGE_KEYS } from '@autoparts/shared';
import type { Reservation, CreateReservationPayload } from '@autoparts/models';

interface ReservationsState {
  myReservations: Reservation[];
  addReservation: (payload: CreateReservationPayload, userId: string) => void;
  updateStatus: (reservationId: string, status: Reservation['status']) => void;
}

export const useReservationsStore = create<ReservationsState>()(
  persist(
    (set) => ({
      myReservations: [],
      
      addReservation: (payload, userId) => set((state) => {
        const newRes: Reservation = {
          id: `res-${Date.now()}`,
          userId,
          partId: payload.partId,
          partName: payload.partName,
          partImage: payload.partImage,
          supplierName: payload.supplierName,
          quantity: payload.quantity,
          totalPrice: payload.totalPrice,
          status: 'pending',
          createdAt: new Date().toISOString(),
          pickupDate: payload.pickupDate,
          reference: `APC-${Math.floor(10000 + Math.random() * 90000)}`,
        };
        return { myReservations: [newRes, ...state.myReservations] };
      }),

      updateStatus: (id, status) => set((state) => ({
        myReservations: state.myReservations.map((r) => 
          r.id === id ? { ...r, status } : r
        ),
      })),
    }),
    {
      name: STORAGE_KEYS.RESERVATIONS,
      storage: createJSONStorage(() => appStorageAdapter),
    }
  )
);
