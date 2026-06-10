import { useState } from 'react';
import { useCartStore } from './useCart';
import { useReservationsStore } from './useReservations';
import type { CreateReservationPayload, User } from '@autoparts/models';

export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const { items, clearCart } = useCartStore();
  const { addReservation } = useReservationsStore();

  const processCheckout = async (user: User, pickupDate: string): Promise<boolean> => {
    if (items.length === 0) return false;
    
    setLoading(true);
    try {
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 1500));

      items.forEach((item) => {
        const payload: CreateReservationPayload = {
          partId: item.part.id,
          partName: item.part.name,
          partImage: item.part.image,
          supplierName: item.part.supplierName,
          quantity: item.quantity,
          totalPrice: item.part.price * item.quantity,
          pickupDate,
        };
        addReservation(payload, user.id);
      });

      clearCart();
      return true;
    } catch (error) {
      console.error('Checkout error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { processCheckout, loading };
}
