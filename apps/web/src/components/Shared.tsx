import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Bell, Moon, Sun, User, Search, Settings, LogOut, Smartphone, Heart, Package, HelpCircle, LayoutDashboard, ChevronRight, X, Check, ShoppingCart, History, Car as CarIcon, WifiOff } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Logo } from './Logo';

// =========================================================
// COMPOSANTS PARTAGÉS
// =========================================================

export function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  const colors = {
    success: 'from-emerald-500 to-teal-600',
    error: 'from-rose-500 to-red-600',
    info: 'from-sky-500 to-indigo-600',
  };
  return (
    <div className="fixed top-4 left-1/2 z-[100] -translate-x-1/2 animate-slide-up">
      <div className={`flex items-center gap-3 rounded-2xl bg-gradient-to-r ${colors[toast.type]} px-5 py-3 text-sm font-semibold text-white shadow-2xl shadow-indigo-500/30`}>
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
          <Check className="h-4 w-4" />
        </div>
        {toast.message}
      </div>
    </div>
  );
}

// ===================== View Switcher (PWA / Backoffice) =====================
export function ViewSwitcher() {
  const { view, setView, setClientPage, setAdminPage } = useApp();

  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col gap-2 md:bottom-6">
      <div className="card overflow-hidden p-1.5 shadow-2xl shadow-slate-900/20 ring-1 ring-slate-900/5">
        <div className="mb-1 px-2 pt-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">Apps</div>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => { setView('client'); setClientPage('home'); }}
            className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
              view === 'client' ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
            title="Application Client (PWA Mobile)"
          >
            <Smartphone className="h-4 w-4" />
            <span className="hidden sm:inline">PWA Client</span>
          </button>
          <button
            onClick={() => { setView('admin'); setAdminPage('dashboard'); }}
            className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
              view === 'admin' ? 'bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
            title="Backoffice Admin Desktop"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Backoffice</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ===================== Mobile Bottom Navigation (4 + 1) =====================
export function BottomNav({ onMore }: { onMore?: () => void } = {}) {
  const { clientPage, setClientPage, cart } = useApp() as any;
  const cartCount = cart?.reduce((s: number, i: any) => s + i.quantity, 0) || 0;

  const items = [
    { id: 'home', label: 'Accueil', icon: Logo_ },
    { id: 'search', label: 'Recherche', icon: Search },
    { id: 'reservations', label: 'Réservations', icon: Package },
    { id: 'notifications', label: 'Notifs', icon: Bell, badge: 3 },
    { id: 'more', label: 'Autres', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-xl md:hidden dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-md items-center justify-around px-1 pb-safe">
        {items.map((it) => {
          const Icon = it.icon;
          const active = clientPage === it.id || (it.id === 'more' && ['profile','vehicles','history','favorites','settings','support'].includes(clientPage));
          return (
            <button
              key={it.id}
              onClick={() => {
                if (it.id === 'more') { onMore?.(); return; }
                setClientPage(it.id as any);
              }}
              className={`nav-item relative flex-1 ${active ? 'active' : ''}`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {it.badge ? (
                  <span className="absolute -right-2 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">{it.badge}</span>
                ) : null}
                {it.id === 'cart' && cartCount > 0 ? (
                  <span className="absolute -right-2 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">{cartCount}</span>
                ) : null}
              </div>
              <span>{it.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function Logo_({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9,22 9,12 15,12 15,22"/>
    </svg>
  );
}

// ===================== Mobile Top Header =====================
export function MobileHeader({ title, subtitle, onBack, action }: { title: string; subtitle?: string; onBack?: () => void; action?: ReactNode }) {
  const { dark, toggleDark, cart } = useApp();
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
      {!online && (
        <div className="flex items-center justify-center gap-2 bg-amber-500 px-3 py-1 text-[10px] font-semibold text-white">
          <WifiOff className="h-3 w-3" />
          Mode hors-ligne — données synchronisées à la reconnexion
        </div>
      )}
      <div className="flex items-center gap-3 px-4 py-3">
        {onBack ? (
          <button onClick={onBack} className="btn-ghost !p-2"><ChevronRight className="h-5 w-5 rotate-180" /></button>
        ) : (
          <Logo size="sm" />
        )}
        <div className="flex-1 min-w-0">
          <h1 className="truncate text-base font-bold text-slate-900 dark:text-white">{title}</h1>
          {subtitle && <p className="truncate text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-1">
          {action}
          <button onClick={toggleDark} className="btn-ghost !p-2" aria-label="Basculer thème">
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button className="btn-ghost !p-2 relative" aria-label="Panier">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500" />}
          </button>
        </div>
      </div>
    </header>
  );
}

// ===================== Drawer Menu (Autres) =====================
export function MoreMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { setClientPage, logout, user } = useApp();
  if (!open) return null;
  const items = [
    { icon: User, label: 'Mon profil', page: 'profile' },
    { icon: CarIcon, label: 'Mes véhicules', page: 'vehicles' },
    { icon: History, label: 'Historique', page: 'history' },
    { icon: Heart, label: 'Favoris', page: 'favorites' },
    { icon: Settings, label: 'Paramètres', page: 'settings' },
    { icon: HelpCircle, label: 'Support', page: 'support' },
  ];
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl animate-slide-up dark:bg-slate-900">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-base font-bold text-white">
            {user?.avatar || 'U'}
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">{user?.name}</div>
            <div className="text-xs text-slate-500">{user?.email}</div>
          </div>
          <button onClick={onClose} className="ml-auto btn-ghost !p-2"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-1">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <button
                key={it.page}
                onClick={() => { setClientPage(it.page as any); onClose(); }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Icon className="h-5 w-5 text-slate-500" />
                <span className="flex-1">{it.label}</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>
            );
          })}
          <button
            onClick={() => { logout(); onClose(); }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-500/10"
          >
            <LogOut className="h-5 w-5" />
            <span className="flex-1">Déconnexion</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ===================== Page Container =====================
export function PageContainer({ children, noPadding }: { children: React.ReactNode; noPadding?: boolean }) {
  return (
    <div className={`mx-auto w-full max-w-7xl ${noPadding ? '' : 'px-4 py-4'} pb-24 md:px-6 md:py-6 md:pb-8`}>
      {children}
    </div>
  );
}

// ===================== Empty State =====================
export function EmptyState({ icon: Icon, title, description, action }: { icon: any; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
        <Icon className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ===================== Status Badge =====================
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; class: string }> = {
    pending:   { label: 'En attente', class: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300' },
    confirmed: { label: 'Confirmée',   class: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300' },
    ready:     { label: 'Prête',       class: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' },
    completed: { label: 'Terminée',    class: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300' },
    cancelled: { label: 'Annulée',     class: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300' },
  };
  const m = map[status] || map.pending;
  return <span className={`badge ${m.class}`}>{m.label}</span>;
}
