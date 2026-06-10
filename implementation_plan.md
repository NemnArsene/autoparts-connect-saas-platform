# AutoParts Connect — Monorepo Migration Plan

## Overview

Transform the existing React/Vite single-app prototype into a **Turborepo monorepo** with a shared React (web) + React Native Expo (mobile) ecosystem, maximizing code reuse and preparing for a future NestJS backend.

**Confirmed Tech Stack:**
- **Monorepo:** Turborepo + pnpm workspaces
- **Mobile UI:** React Native Paper
- **Backend:** NestJS + MongoDB
- **Mobile Build/Deploy:** Expo + EAS
- **Admin Access:** Desktop Web Only (Mobile app is strictly for clients)
- **Internationalization (i18n):** Deferred to a later phase

---

## 1. Package Breakdown

### `packages/models` (Phase 1 - ✅ Terminé)
100% copy-paste from existing `seed.ts`, split into pure TS modules. Zero dependencies.

### `packages/hooks` (Phase 2 - 🔄 En cours)
Zustand stores extracting the monolithic logic from `AppContext.tsx`:
- `useCart`, `useFavorites`, `useAuth`, `useReservations`, `useNotifications`, `useTheme`, `useToast`
Each hook uses a **StorageAdapter interface** (`localStorage` for web, `MMKV` for mobile).

### `packages/services` (Phase 2 - 🔄 En cours)
Interface-first API service layer (`PartsService`, `ReservationService`, etc.).
Mock implementations initially using `@autoparts/models`. Ready for NestJS HTTP endpoints later.

### `packages/ui-core` (Phase 2 - 🔄 En cours)
Shared design tokens (colors, spacing) and cross-platform primitive UI components (e.g. `StatusBadge`).

### `packages/validators` (Phase 1 - ✅ Terminé)
Zod schemas for forms.

### `packages/shared` (Phase 1 - ✅ Terminé)
Misc shared utilities (`cn`, `constants`).

---

## 2. Code Reuse Strategy

| Layer | Reusable? | Target package | Notes |
|---|---|---|---|
| TS Models / Seed Data | ✅ 100% | `packages/models` | Pure TS, no DOM |
| Helper functions | ✅ 100% | `packages/shared`, `packages/models` | Pure functions |
| AppContext logic | ✅ ~90% | `packages/hooks` | Moved to Zustand + StorageAdapter |
| Search filter logic | ✅ 100% | `packages/hooks` → `usePartSearch` | Pure logic |
| Checkout logic | ✅ 100% | `packages/hooks` → `useCheckout` | No DOM |
| Gradient/color tokens | ✅ 80% | `packages/ui-core` | Adapted to RN StyleSheet |
| Web UI (Tailwind) | ❌ 0% reuse | `apps/web` stays | Not valid in RN |

---

## 3. Expo Mobile App — `apps/mobile` (Phase 3 & 4)

### Mobile Screen Mapping

| Web Screen | Mobile Route (Expo Router) | Reused Logic |
|---|---|---|
| `HomePage` | `app/(client)/index.tsx` | `usePartSearch`, `FEATURED_PARTS` |
| `SearchPage` | `app/(client)/search/index.tsx` | `usePartSearch` hook (100%) |
| `PartDetailPage` | `app/(client)/search/[id].tsx` | Part data from models |
| `ReservationsPage` | `app/(client)/reservations/index.tsx` | `useReservations` hook |
| `NotificationsPage` | `app/(client)/notifications.tsx` | `useNotifications` hook |
| `CartPage` | `app/(client)/cart.tsx` | `useCart` hook (100%) |
| `CheckoutPage` | `app/(client)/checkout.tsx` | `useCheckout` hook (100%) |
| `ProfilePage` | `app/(client)/profile/index.tsx` | `useAuth` hook |
| Admin (web only) | ❌ Not in mobile | Admin remains web-only |

### Offline-First Architecture
- **Persistent cache:** TanStack Query + `AsyncStorage` persister.
- **Key-value store:** MMKV for mobile (replaces `localStorage`).

---

## 4. Phased Execution Plan

### Phase 1 — Monorepo Scaffold (✅ Terminé)
- Init Turborepo, pnpm workspaces, `packages/models`, `packages/shared`, `packages/validators`.
- Move Vite app to `apps/web/` and update imports.
- Scaffold `apps/api` (NestJS).

### Phase 2 — Shared Hooks & Services (🔄 En cours)
- Créer `packages/hooks` avec Zustand (`useCart`, `useFavorites`, etc.).
- Créer `packages/services` (Mock API implementations).
- Créer `packages/ui-core`.
- Wire hooks back into `apps/web` to replace the monolithic `AppContext`.

### Phase 3 — Expo App Bootstrap (À venir)
- `create-expo-app apps/mobile`.
- Install Expo Router, RN Paper, MMKV, Zustand.
- Wire hooks and UI base.

### Phase 4 — Mobile Screens (À venir)
- Develop the 13 client screens in React Native Paper.

### Phase 5 — Polish + NestJS (À venir)
- Implement NestJS + MongoDB endpoints.
- Swap Mock services for real HTTP calls.
- Setup EAS Build.
