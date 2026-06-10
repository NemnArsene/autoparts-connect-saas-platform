// ============================================================
// STORAGE ADAPTER INTERFACE
// Used by Zustand persist middleware to support both
// localStorage (Web) and MMKV (Mobile).
// ============================================================

import type { StateStorage } from 'zustand/middleware';

export interface AppStorageAdapter extends StateStorage {
  getItem: (name: string) => string | null | Promise<string | null>;
  setItem: (name: string, value: string) => void | Promise<void>;
  removeItem: (name: string) => void | Promise<void>;
}

/** 
 * Default web implementation using localStorage.
 * The mobile app will override this with an MMKV implementation.
 */
export const webStorageAdapter: AppStorageAdapter = {
  getItem: (name) => {
    try { return localStorage.getItem(name); } catch { return null; }
  },
  setItem: (name, value) => {
    try { localStorage.setItem(name, value); } catch {}
  },
  removeItem: (name) => {
    try { localStorage.removeItem(name); } catch {}
  },
};

/**
 * The current storage adapter. Defaults to webStorageAdapter.
 * Mobile app MUST call setAppStorageAdapter(mobileStorageAdapter) on boot.
 */
export let appStorageAdapter: AppStorageAdapter = webStorageAdapter;

export function setAppStorageAdapter(adapter: AppStorageAdapter) {
  appStorageAdapter = adapter;
}
