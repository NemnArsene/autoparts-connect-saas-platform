import { createContext, useContext, useMemo, useState, type ReactNode, useEffect } from 'react';
import type { Part, Reservation } from '@autoparts/models';
import { PARTS } from '@autoparts/models';
import {
  useCartStore,
  useFavoritesStore,
  useAuthStore,
  useThemeStore,
  useToastStore,
  useReservationsStore,
  useNotificationsStore,
} from '@autoparts/hooks';

// =========================================================
// GLOBAL APP STORE (ZUSTAND WRAPPER)
// AppContext now delegates all business logic to @autoparts/hooks
// preserving the exact interface for backward compatibility in apps/web
// =========================================================

export type ClientPage = 'home' | 'search' | 'reservations' | 'notifications' | 'more' | 'part-detail' | 'cart' | 'checkout' | 'profile' | 'vehicles' | 'history' | 'favorites' | 'settings' | 'support';
export type AdminPage = 'dashboard' | 'users' | 'suppliers' | 'catalog' | 'stock' | 'reservations' | 'payments' | 'cms' | 'reports' | 'settings' | 'part-detail';

interface CartItem { part: Part; quantity: number; }

interface AppState {
  clientPage: ClientPage;
  setClientPage: (p: ClientPage) => void;
  adminPage: AdminPage;
  setAdminPage: (p: AdminPage) => void;

  selectedPart: Part | null;
  setSelectedPart: (p: Part | null) => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Auth
  user: { name: string; email: string; phone: string; avatar: string; } | null;
  login: (email?: string) => void;
  logout: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (p: Part) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;

  // Favorites
  favorites: string[];
  toggleFavorite: (id: string) => void;

  // Reservations
  myReservations: Reservation[];
  addReservation: (r: Reservation) => void;

  // Theme
  dark: boolean;
  toggleDark: () => void;

  // Toast
  toast: { id: number; message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;

  // Notifications read
  notifRead: string[];
  markNotifRead: (id: string) => void;

  // History stack for smart back navigation
  pageHistory: string[];
  goBack: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  // 1. UI Local State (Not persisted, will be replaced by React Router eventually)
  const [clientPage, setClientPage] = useState<ClientPage>('home');
  const [adminPage, setAdminPage] = useState<AdminPage>('dashboard');
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageHistory, setPageHistory] = useState<string[]>(['home']);

  // 2. Zustand Shared Stores
  const authStore = useAuthStore();
  const cartStore = useCartStore();
  const favStore = useFavoritesStore();
  const resStore = useReservationsStore();
  const themeStore = useThemeStore();
  const toastStore = useToastStore();
  const notifStore = useNotificationsStore();

  // Handle routing logic that was previously in AppContext
  const smartSetClientPage = (p: ClientPage) => {
    setPageHistory((h) => {
      if (h[h.length - 1] === p) return h;
      return [...h, p].slice(-20);
    });
    setClientPage(p);
  };

  const goBack = () => {
    if (pageHistory.length <= 1) {
      setClientPage('home');
      return;
    }
    const newH = pageHistory.slice(0, -1);
    setPageHistory(newH);
    setClientPage((newH[newH.length - 1] || 'home') as ClientPage);
  };

  // Convert old toast id to number if needed to match interface
  const toastWrapper = useMemo(() => {
    if (!toastStore.toast) return null;
    return {
      id: parseInt(toastStore.toast.id) || Date.now(),
      message: toastStore.toast.message,
      type: toastStore.toast.type || 'success',
    };
  }, [toastStore.toast]);

  const value: AppState = useMemo(() => ({
    clientPage, setClientPage: smartSetClientPage,
    adminPage, setAdminPage,
    selectedPart, setSelectedPart,
    searchQuery, setSearchQuery,
    
    user: authStore.user,
    login: (email) => {
      authStore.login(email || 'admin@autoparts.ci', 'password123', 'admin');
    },
    logout: () => {
      authStore.logout();
      setClientPage('home');
      toastStore.showToast({ message: 'Déconnexion réussie', type: 'info' });
    },
    
    cart: cartStore.items,
    addToCart: (p) => {
      cartStore.addToCart(p, 1);
      toastStore.showToast(`${p.name} ajouté au panier`);
    },
    removeFromCart: cartStore.removeFromCart,
    updateQty: cartStore.updateQuantity,
    clearCart: cartStore.clearCart,
    
    favorites: favStore.favoriteIds,
    toggleFavorite: favStore.toggleFavorite,
    
    myReservations: resStore.myReservations,
    addReservation: (r) => {
      resStore.addReservation({
        partId: r.partId,
        partName: r.partName,
        partImage: r.partImage,
        supplierName: r.supplierName,
        quantity: r.quantity,
        totalPrice: r.totalPrice,
        pickupDate: r.pickupDate,
      }, authStore.user?.id || 'usr-1');
      toastStore.showToast(`Réservation ${r.reference} confirmée !`);
    },
    
    dark: themeStore.dark,
    toggleDark: themeStore.toggleDark,
    
    toast: toastWrapper,
    showToast: (message, type) => toastStore.showToast({ message, type }),
    
    notifRead: notifStore.readIds,
    markNotifRead: notifStore.markRead,

    pageHistory,
    goBack,
  }), [
    clientPage, adminPage, selectedPart, searchQuery, pageHistory,
    authStore, cartStore, favStore, resStore, themeStore, toastStore, notifStore,
    toastWrapper
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

export const FEATURED_PARTS = PARTS.filter((p) => p.isNew).slice(0, 8);
export const POPULAR_PARTS = PARTS.filter((p) => p.rating >= 4.5).slice(0, 8);
