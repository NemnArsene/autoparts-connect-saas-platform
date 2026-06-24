import { LayoutDashboard, Users, Truck, Package, Boxes, ShoppingBag, CreditCard, FileText, BarChart3, Settings, Bell, Search, ChevronDown } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Logo } from './Logo';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../i18n';

const MENUS = [
  { id: 'dashboard', icon: LayoutDashboard, group: 'Pilotage' },
  { id: 'reports', icon: BarChart3, group: 'Pilotage' },

  { id: 'users', icon: Users, group: 'Gestion' },
  { id: 'suppliers', icon: Truck, group: 'Gestion' },
  { id: 'catalog', icon: Package, group: 'Gestion' },
  { id: 'stock', icon: Boxes, group: 'Gestion' },
  { id: 'reservations', icon: ShoppingBag, group: 'Gestion' },

  { id: 'payments', icon: CreditCard, group: 'Opérations' },
  { id: 'cms', icon: FileText, group: 'Opérations' },
  { id: 'settings', icon: Settings, group: 'Opérations' },
] as const;

export function AdminLayout({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) {
  const { adminPage, setAdminPage, user, dark, toggleDark } = useApp();
  const { t, i18n } = useTranslation();

  // Group menus using translated group titles
  const groups = MENUS.reduce<Record<string, typeof MENUS[number][]>>((acc, m) => {
    const groupKey = `menu.groups.${m.group.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`;
    const groupLabel = t(groupKey, m.group);
    if (!acc[groupLabel]) acc[groupLabel] = [];
    acc[groupLabel].push(m);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-slate-200 bg-white md:flex dark:border-slate-800 dark:bg-slate-900">
        <div className="flex h-16 items-center border-b border-slate-200 px-5 dark:border-slate-800">
          <Logo size="sm" />
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          {Object.entries(groups).map(([group, items]) => (
            <div key={group} className="mb-4">
              <div className="mb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">{group}</div>
              <div className="space-y-0.5">
                {items.map((m) => {
                  const Icon = m.icon;
                  const menuLabel = t(`menu.${m.id}`, m.id);
                  return (
                    <button
                      key={m.id}
                      onClick={() => setAdminPage(m.id as any)}
                      className={`menu-link w-full ${adminPage === m.id ? 'active' : ''}`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="flex-1 text-left">{menuLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-slate-200 p-3 dark:border-slate-800">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-2 dark:bg-slate-800/50">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">
              {user?.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="truncate text-xs font-semibold text-slate-900 dark:text-white">{user?.name}</div>
              <div className="truncate text-[10px] text-slate-500">{t('header.admin')}</div>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 md:ml-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-xl md:px-6 dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex-1">
            <h1 className="text-base font-bold text-slate-900 dark:text-white">{title}</h1>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          </div>
          <div className="hidden flex-1 max-w-sm md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder={t('header.searchPlaceholder')} className="input-base pl-9" />
            </div>
          </div>
          
          {/* Premium Language Switcher */}
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 gap-0.5 text-xs font-semibold">
            <button
              onClick={() => changeLanguage('fr')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                i18n.language.startsWith('fr')
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              FR
            </button>
            <button
              onClick={() => changeLanguage('en')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                i18n.language.startsWith('en')
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              EN
            </button>
          </div>

          <button onClick={toggleDark} className="btn-ghost !p-2" title={t('header.theme')}>
            {dark ? '☀️' : '🌙'}
          </button>
          <button className="btn-ghost !p-2 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500" />
          </button>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
