import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastState {
  toast: (ToastOptions & { id: string }) | null;
  showToast: (options: ToastOptions | string) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toast: null,
  
  showToast: (options) => {
    const opts = typeof options === 'string' ? { message: options } : options;
    const id = Date.now().toString();
    set({ toast: { ...opts, id, type: opts.type || 'success' } });
    
    setTimeout(() => {
      set((state) => (state.toast?.id === id ? { toast: null } : state));
    }, opts.duration || 3000);
  },
  
  hideToast: () => set({ toast: null }),
}));
