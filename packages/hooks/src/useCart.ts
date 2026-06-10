import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { appStorageAdapter } from './storage';
import { STORAGE_KEYS } from '@autoparts/shared';
import type { CartItem, Part } from '@autoparts/models';

interface CartState {
  items: CartItem[];
  addToCart: (part: Part, quantity?: number) => void;
  removeFromCart: (partId: string) => void;
  updateQuantity: (partId: string, quantity: number) => void;
  clearCart: () => void;
  get cartTotal(): number;
  get cartItemCount(): number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToCart: (part, quantity = 1) => set((state) => {
        const existing = state.items.find((i) => i.part.id === part.id);
        if (existing) {
          return {
            items: state.items.map((i) =>
              i.part.id === part.id ? { ...i, quantity: i.quantity + quantity } : i
            ),
          };
        }
        return { items: [...state.items, { part, quantity }] };
      }),
      
      removeFromCart: (partId) => set((state) => ({
        items: state.items.filter((i) => i.part.id !== partId),
      })),
      
      updateQuantity: (partId, quantity) => set((state) => {
        if (quantity <= 0) {
          return { items: state.items.filter((i) => i.part.id !== partId) };
        }
        return {
          items: state.items.map((i) =>
            i.part.id === partId ? { ...i, quantity } : i
          ),
        };
      }),
      
      clearCart: () => set({ items: [] }),
      
      get cartTotal() {
        return get().items.reduce((total, item) => total + item.part.price * item.quantity, 0);
      },
      
      get cartItemCount() {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: STORAGE_KEYS.CART,
      storage: createJSONStorage(() => appStorageAdapter),
    }
  )
);
