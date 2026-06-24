import { useState } from 'react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TrendingUp, TrendingDown, Users, Package, ShoppingBag, DollarSign, Star, Eye, MoreVertical, Check, Filter, Download, RefreshCw, AlertCircle, MapPin, Phone, Mail, Plus, Edit3, Trash2, BarChart3, FileText } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import { RESERVATIONS, SUPPLIERS, PARTS, CATEGORIES, formatPrice, BRANDS } from '../../data/seed';
import { StatusBadge } from '../../components/Shared';
import { PartImage } from '../../components/PartImage';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../../i18n';

// ===================== DASHBOARD =====================
const REVENUE_DATA = [
  { m: 'Jan', v: 12.4 }, { m: 'Fév', v: 15.8 }, { m: 'Mar', v: 18.2 },
  { m: 'Avr', v: 22.5 }, { m: 'Mai', v: 19.8 }, { m: 'Juin', v: 26.1 },
  { m: 'Juil', v: 31.2 }, { m: 'Août', v: 28.7 }, { m: 'Sept', v: 34.5 },
  { m: 'Oct', v: 38.9 }, { m: 'Nov', v: 42.1 }, { m: 'Déc', v: 47.3 },
];

const CATEGORY_DATA = CATEGORIES.slice(0, 6).map((c, i) => ({
  name: c.name, value: c.count, color: ['#6366f1', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6', '#06b6d4'][i],
}));

const TOP_PARTS = PARTS.slice(0, 6);

export function AdminDashboard() {
  const { t } = useTranslation();
  const stats = [
    { label: t('dashboard.stats.revenue'), value: '47,3M', unit: 'XAF', delta: '+12.5%', up: true, icon: DollarSign, color: 'from-indigo-500 to-violet-600' },
    { label: t('dashboard.stats.reservations'), value: '2 154', unit: '', delta: '+8.2%', up: true, icon: ShoppingBag, color: 'from-emerald-500 to-teal-600' },
    { label: t('dashboard.stats.activeUsers'), value: '8 421', unit: '', delta: '+15.3%', up: true, icon: Users, color: 'from-amber-500 to-orange-600' },
    { label: t('dashboard.stats.partsSold'), value: '5 832', unit: '', delta: '-2.1%', up: false, icon: Package, color: 'from-rose-500 to-pink-600' },
  ];

  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          const TrendIcon = s.up ? TrendingUp : TrendingDown;
          return (
            <div key={s.label} className="card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-500">{s.label}</div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{s.value}</div>
                    {s.unit && <div className="text-xs text-slate-500">{s.unit}</div>}
                  </div>
                  <div className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold ${s.up ? 'text-emerald-600' : 'text-rose-600'}`}>
                    <TrendIcon className="h-3 w-3" />
                    {s.delta}
                  </div>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-white shadow-md`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-4 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t('dashboard.revenueEvolution.title')}</h3>
              <p className="text-xs text-slate-500">{t('dashboard.revenueEvolution.subtitle')}</p>
            </div>
            <select className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800">
              <option>2025</option><option>2024</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="m" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
              <Area type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={2.5} fill="url(#grad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t('dashboard.topCategories.title')}</h3>
          <p className="mb-2 text-xs text-slate-500">{t('dashboard.topCategories.subtitle')}</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={CATEGORY_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40} paddingAngle={2}>
                {CATEGORY_DATA.map((c, i) => <Cell key={i} fill={c.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-1.5 text-[10px]">
            {CATEGORY_DATA.map((c) => (
              <div key={c.name} className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full" style={{ background: c.color }} />
                <span className="truncate text-slate-600 dark:text-slate-400">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bar chart + Recent */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-4 lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t('dashboard.reservationsByBrand.title')}</h3>
          <p className="mb-2 text-xs text-slate-500">{t('dashboard.reservationsByBrand.subtitle')}</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={BRANDS.slice(0, 8).map((b, i) => ({ name: b, v: 200 + i * 45 + (i % 2) * 80 }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ borderRadius: 12 }} />
              <Bar dataKey="v" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t('dashboard.topSuppliers.title')}</h3>
          <p className="mb-3 text-xs text-slate-500">{t('dashboard.topSuppliers.subtitle')}</p>
          <div className="space-y-2">
            {SUPPLIERS.slice(0, 5).map((s, i) => (
              <div key={s.id} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate text-xs font-semibold text-slate-900 dark:text-white">{s.name}</div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {s.rating} · {s.productsCount} {t('dashboard.topSuppliers.productsCount')}
                  </div>
                </div>
                <div className="text-xs font-bold text-emerald-600">+{Math.floor(15 - i * 2)}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders + alerts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t('dashboard.recentReservations.title')}</h3>
            <button className="text-xs font-semibold text-indigo-600">{t('dashboard.recentReservations.seeAll')}</button>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {RESERVATIONS.slice(0, 5).map((r) => (
              <div key={r.id} className="flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                  <ShoppingBag className="h-4 w-4 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">{r.partName}</div>
                  <div className="text-[11px] text-slate-500">{r.reference} · {r.supplierName}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{formatPrice(r.totalPrice)}</div>
                  <StatusBadge status={r.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-4">
          <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">{t('dashboard.alerts.title')}</h3>
          <div className="space-y-2">
            {[
              { type: 'stock', label: t('dashboard.alerts.lowStock'), desc: t('dashboard.alerts.lowStockDesc'), color: 'bg-amber-100 text-amber-700' },
              { type: 'order', label: t('dashboard.alerts.pendingOrders'), desc: t('dashboard.alerts.pendingOrdersDesc'), color: 'bg-sky-100 text-sky-700' },
              { type: 'user', label: t('dashboard.alerts.newUsers'), desc: t('dashboard.alerts.newUsersDesc'), color: 'bg-emerald-100 text-emerald-700' },
            ].map((a) => (
              <div key={a.label} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${a.color}`}>
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{a.label}</div>
                  <div className="text-[11px] text-slate-500">{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================== USERS =====================
const MOCK_USERS = Array.from({ length: 30 }).map((_, i) => ({
  id: `usr-${i + 1}`,
  name: ['Kouamé Yao', 'Aminata Diallo', 'Jean Kouassi', 'Fatou Camara', 'Marc Bamba', 'Awa Traoré', 'Olivier Diop', 'Mariam Sanogo', 'Pascal N\'Guessan', 'Léa Mensah'][i % 10] + ' ' + (i + 1),
  email: `user${i + 1}@autoparts.ci`,
  phone: `+225 07 ${String(10 + i).padStart(2, '0')} ${String(10 + i * 2).padStart(2, '0')} ${String(10 + i * 3).padStart(2, '0')}`,
  city: ['Abidjan', 'Dakar', 'Lomé', 'Douala', 'Bamako'][i % 5],
  role: i % 8 === 0 ? 'admin' : 'client',
  status: i % 4 === 0 ? 'inactive' : 'active',
  orders: Math.floor(Math.random() * 30),
  spent: Math.floor(50000 + Math.random() * 800000),
  joined: new Date(Date.now() - Math.floor(Math.random() * 365) * 86400000).toISOString(),
}));

export function AdminUsers() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const filtered = MOCK_USERS.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search));
  return (
    <div className="space-y-4">
      <div className="card p-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input type="text" placeholder={t('users.searchPlaceholder')} value={search} onChange={(e) => setSearch(e.target.value)} className="input-base flex-1" />
        <div className="flex gap-2">
          <button className="btn-secondary"><Filter className="h-4 w-4" /> {t('common.filters', 'Filtres')}</button>
          <button className="btn-primary"><Plus className="h-4 w-4" /> {t('users.addBtn')}</button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3">{t('users.table.name')}</th>
                <th className="px-4 py-3">{t('common.contact', 'Contact')}</th>
                <th className="px-4 py-3">{t('common.city', 'Ville')}</th>
                <th className="px-4 py-3">{t('users.table.role')}</th>
                <th className="px-4 py-3">{t('menu.reservations')}</th>
                <th className="px-4 py-3">{t('common.totalSpent', 'Total dépensé')}</th>
                <th className="px-4 py-3">{t('users.table.status')}</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filtered.slice(0, 20).map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">
                        {u.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">{u.name}</div>
                        <div className="text-[11px] text-slate-500">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{u.phone}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{u.city}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${u.role === 'admin' ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-700'}`}>
                      {u.role === 'admin' ? 'Admin' : t('common.client', 'Client')}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold">{u.orders}</td>
                  <td className="px-4 py-3 font-semibold text-indigo-600">{formatPrice(u.spent)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${u.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {u.status === 'active' ? t('common.statusActive', 'Actif') : t('common.statusInactive', 'Inactif')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-slate-400 hover:text-indigo-600"><MoreVertical className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs text-slate-500 dark:border-slate-800">
          <span>{t('common.paginationDisplay', 'Affichage 1-20 sur {{count}}', { count: filtered.length })}</span>
          <div className="flex gap-1">
            <button className="rounded border border-slate-200 px-2 py-1 dark:border-slate-700">{t('common.back')}</button>
            <button className="rounded border border-indigo-500 bg-indigo-500 px-2 py-1 text-white">1</button>
            <button className="rounded border border-slate-200 px-2 py-1 dark:border-slate-700">2</button>
            <button className="rounded border border-slate-200 px-2 py-1 dark:border-slate-700">{t('common.next')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================== SUPPLIERS =====================
export function AdminSuppliers() {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="card p-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input type="text" placeholder={t('suppliers.searchPlaceholder')} className="input-base flex-1" />
        <button className="btn-primary"><Plus className="h-4 w-4" /> {t('suppliers.addBtn')}</button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SUPPLIERS.map((s) => (
          <div key={s.id} className="card p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-base font-bold text-white">
                {s.logo}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white">{s.name}</h3>
                  {s.validated && <Check className="h-4 w-4 text-emerald-500" />}
                </div>
                <p className="flex items-center gap-1 text-[11px] text-slate-500">
                  <MapPin className="h-3 w-3" /> {s.city}, {s.country}
                </p>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{s.rating}</span>
                  <span className="text-slate-500">· {s.productsCount} {t('dashboard.topSuppliers.productsCount')}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5"><Phone className="h-3 w-3 text-slate-400" /> {s.phone}</div>
              <div className="flex items-center gap-1.5 truncate"><Mail className="h-3 w-3 text-slate-400" /> {s.email}</div>
            </div>
            <div className="mt-3 flex gap-1">
              <button className="btn-ghost flex-1 text-xs"><Eye className="h-3 w-3" /> {t('common.details')}</button>
              <button className="btn-ghost flex-1 text-xs"><Edit3 className="h-3 w-3" /> {t('common.edit')}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===================== CATALOG =====================

// --- Add Part Modal Component ---
function AddPartModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: '', category: '', brand: '' as string, ref: '',
    compatibleModels: '', description: '',
    price: '', oldPrice: '', stock: '', warranty: '12 mois',
    isNew: true, isPromo: false,
  });

  const updateField = (field: string, value: any) => setForm((f) => ({ ...f, [field]: value }));

  // Auto-generate ref
  const autoRef = `AP-${(form.category || 'XX').slice(0, 3).toUpperCase()}-${Date.now().toString(36).slice(-5).toUpperCase()}`;

  const resetForm = () => {
    setStep(1); setSaving(false); setSuccess(false);
    setForm({ name: '', category: '', brand: '', ref: '', compatibleModels: '', description: '', price: '', oldPrice: '', stock: '', warranty: '12 mois', isNew: true, isPromo: false });
  };

  const handleSubmit = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setSuccess(true); }, 1800);
  };

  const handleClose = () => { resetForm(); onClose(); };

  if (!open) return null;

  const canNext1 = form.name && form.category && form.brand;
  const canNext2 = form.price && form.stock;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ animation: 'fadeIn .25s ease-out' }}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800" style={{ animation: 'slideUp .35s cubic-bezier(.16,1,.3,1)' }}>
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur-xl px-6 py-4 dark:border-slate-800 dark:bg-slate-900/95 rounded-t-3xl">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('catalog.addModal.title')}</h2>
            <p className="text-xs text-slate-500">{t('common.step', 'Étape')} {step} {t('common.of', 'sur')} 3</p>
          </div>
          <button onClick={handleClose} className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700">✕</button>
        </div>

        {/* Progress bar */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 flex items-center gap-2">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${step >= s ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
                  {success && s <= 3 ? <Check className="h-4 w-4" /> : s}
                </div>
                {s < 3 && <div className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${step > s ? 'bg-gradient-to-r from-indigo-500 to-violet-600' : 'bg-slate-200 dark:bg-slate-700'}`} />}
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] font-semibold text-slate-400">
            <span className={step >= 1 ? 'text-indigo-600' : ''}>{t('catalog.addModal.steps.basic')}</span>
            <span className={step >= 2 ? 'text-indigo-600' : ''}>{t('catalog.addModal.steps.pricing')}</span>
            <span className={step >= 3 ? 'text-indigo-600' : ''}>{t('catalog.addModal.steps.details')}</span>
          </div>
        </div>

        {/* Success state */}
        {success ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center" style={{ animation: 'slideUp .4s cubic-bezier(.16,1,.3,1)' }}>
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 shadow-xl shadow-emerald-500/30" style={{ animation: 'pulse-soft 1.5s ease-in-out infinite' }}>
              <Check className="h-10 w-10 text-white" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">{t('catalog.addModal.successTitle')}</h3>
            <p className="mt-2 text-sm text-slate-500">{t('catalog.addModal.successMessage')} <span className="font-semibold text-indigo-600">{form.name}</span></p>
            <p className="text-xs text-slate-400 mt-1">{t('catalog.table.ref')} : {form.ref || autoRef}</p>
            <button onClick={handleClose} className="btn-primary mt-6">{t('common.close')}</button>
          </div>
        ) : (
          <div className="p-6">
            {/* STEP 1 — Basic Info */}
            {step === 1 && (
              <div className="space-y-4" style={{ animation: 'fadeIn .3s ease-out' }}>
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-500/20 dark:bg-indigo-500/5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                    <Package className="h-4 w-4" /> {t('catalog.addModal.steps.basic')}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('catalog.addModal.form.partName')} *</label>
                  <input className="input-base mt-1" placeholder="Ex : Plaquettes de frein avant" value={form.name} onChange={(e) => updateField('name', e.target.value)} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('catalog.addModal.form.category')} *</label>
                    <select className="input-base mt-1" value={form.category} onChange={(e) => updateField('category', e.target.value)}>
                      <option value="">{t('common.select', 'Sélectionner…')}</option>
                      {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('catalog.addModal.form.brand')} *</label>
                    <select className="input-base mt-1" value={form.brand} onChange={(e) => updateField('brand', e.target.value)}>
                      <option value="">{t('common.select', 'Sélectionner…')}</option>
                      {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('catalog.addModal.form.reference')}</label>
                  <div className="relative mt-1">
                    <input className="input-base pr-24" placeholder={t('catalog.addModal.form.referencePlaceholder', 'Laisser vide pour auto-générer')} value={form.ref} onChange={(e) => updateField('ref', e.target.value)} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md">{form.ref || autoRef}</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('catalog.addModal.form.compat')}</label>
                  <input className="input-base mt-1" placeholder="Ex : Corolla 2020, Yaris 2021 (séparés par virgule)" value={form.compatibleModels} onChange={(e) => updateField('compatibleModels', e.target.value)} />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('catalog.addModal.form.description')}</label>
                  <textarea className="input-base mt-1 min-h-[80px] resize-none" placeholder="Description détaillée de la pièce…" value={form.description} onChange={(e) => updateField('description', e.target.value)} />
                </div>

                {/* Image upload simulation */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('common.productImage', 'Image du produit')}</label>
                  <div className="mt-1 flex items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-indigo-400 hover:bg-indigo-50/30 cursor-pointer dark:border-slate-700 dark:bg-slate-800/30 dark:hover:border-indigo-500">
                    <div>
                      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                        <Plus className="h-6 w-6" />
                      </div>
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('common.dragDrop', 'Glisser-déposer ou cliquer')}</p>
                      <p className="text-[10px] text-slate-400">PNG, JPG, WebP · Max 5 Mo</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 — Pricing & Stock */}
            {step === 2 && (
              <div className="space-y-4" style={{ animation: 'fadeIn .3s ease-out' }}>
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    <DollarSign className="h-4 w-4" /> {t('catalog.addModal.steps.pricing')}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('catalog.addModal.form.price')} *</label>
                    <div className="relative mt-1">
                      <input type="number" className="input-base pr-16" placeholder="0" value={form.price} onChange={(e) => updateField('price', e.target.value)} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">FCFA</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('common.oldPrice', 'Ancien prix (optionnel)')}</label>
                    <div className="relative mt-1">
                      <input type="number" className="input-base pr-16" placeholder="0" value={form.oldPrice} onChange={(e) => updateField('oldPrice', e.target.value)} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">FCFA</span>
                    </div>
                  </div>
                </div>

                {form.price && form.oldPrice && Number(form.oldPrice) > Number(form.price) && (
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" style={{ animation: 'fadeIn .3s ease-out' }}>
                    <TrendingDown className="h-4 w-4" /> {t('common.reduction', 'Réduction')} de {Math.round((1 - Number(form.price) / Number(form.oldPrice)) * 100)}%
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('catalog.addModal.form.stockQty')} *</label>
                    <input type="number" className="input-base mt-1" placeholder="0" value={form.stock} onChange={(e) => updateField('stock', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('catalog.table.warranty')}</label>
                    <select className="input-base mt-1" value={form.warranty} onChange={(e) => updateField('warranty', e.target.value)}>
                      <option>6 mois</option>
                      <option>12 mois</option>
                      <option>24 mois</option>
                      <option>36 mois</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 cursor-pointer hover:bg-slate-50 transition dark:border-slate-700 dark:hover:bg-slate-800/50">
                    <input type="checkbox" checked={form.isNew} onChange={(e) => updateField('isNew', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    <div>
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">{t('common.novelty', 'Nouveauté')}</div>
                      <div className="text-[10px] text-slate-400">{t('common.noveltyDesc', 'Afficher le badge "Nouveau"')}</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 cursor-pointer hover:bg-slate-50 transition dark:border-slate-700 dark:hover:bg-slate-800/50">
                    <input type="checkbox" checked={form.isPromo} onChange={(e) => updateField('isPromo', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    <div>
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">{t('common.promo', 'En promotion')}</div>
                      <div className="text-[10px] text-slate-400">{t('common.promoDesc', 'Afficher le badge "Promo"')}</div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* STEP 3 — Review */}
            {step === 3 && (
              <div className="space-y-4" style={{ animation: 'fadeIn .3s ease-out' }}>
                <div className="rounded-2xl border border-violet-100 bg-violet-50/50 p-4 dark:border-violet-500/20 dark:bg-violet-500/5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-violet-700 dark:text-violet-300">
                    <Eye className="h-4 w-4" /> {t('common.reviewTitle', 'Vérification avant publication')}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider dark:bg-slate-800/50">{t('common.summary', 'Récapitulatif')}</div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {[
                      { label: t('catalog.addModal.form.partName'), value: form.name },
                      { label: t('catalog.addModal.form.category'), value: CATEGORIES.find((c) => c.id === form.category)?.name || '-' },
                      { label: t('catalog.addModal.form.brand'), value: form.brand || '-' },
                      { label: t('catalog.addModal.form.reference'), value: form.ref || autoRef },
                      { label: t('catalog.table.price'), value: form.price ? formatPrice(Number(form.price)) : '-' },
                      { label: t('common.oldPrice', 'Ancien prix'), value: form.oldPrice ? formatPrice(Number(form.oldPrice)) : '-' },
                      { label: t('catalog.table.stock'), value: form.stock ? `${form.stock} unités` : '-' },
                      { label: t('catalog.table.warranty'), value: form.warranty },
                      { label: t('common.compatibleModelsLabel', 'Modèles'), value: form.compatibleModels || 'Non spécifié' },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between px-4 py-2.5">
                        <span className="text-xs text-slate-500">{row.label}</span>
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  {form.isNew && <span className="badge bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">{t('common.novelty', 'Nouveauté')}</span>}
                  {form.isPromo && <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">{t('common.promo', 'En promotion')}</span>}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
              <button onClick={() => step > 1 ? setStep(step - 1) : handleClose()} className="btn-ghost text-sm">
                {step === 1 ? t('common.cancel') : `← ${t('common.back')}`}
              </button>
              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 ? !canNext1 : !canNext2}
                  className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {t('common.next')} →
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={saving} className="btn-primary disabled:opacity-70">
                  {saving ? (
                    <span className="flex items-center gap-2"><RefreshCw className="h-4 w-4 animate-spin" /> {t('common.saving', 'Publication…')}</span>
                  ) : (
                    <span className="flex items-center gap-2"><Check className="h-4 w-4" /> {t('catalog.addModal.submitBtn')}</span>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Export Center Modal Component ---
function ExportCenterModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, i18n } = useTranslation();
  const [format, setFormat] = useState<'csv' | 'excel' | 'pdf'>('csv');
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [columns, setColumns] = useState({
    ref: true, name: true, category: true, brand: true,
    price: true, stock: true, supplier: true, warranty: true,
    rating: true, status: true,
  });

  const toggleCol = (key: string) => setColumns((c) => ({ ...c, [key]: !(c as any)[key] }));
  const toggleCat = (id: string) => setSelectedCats((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const toggleBrand = (b: string) => setSelectedBrands((s) => s.includes(b) ? s.filter((x) => x !== b) : [...s, b]);

  const colCount = Object.values(columns).filter(Boolean).length;

  // Filtered data for preview
  const filteredParts = PARTS.filter((p) => {
    if (selectedCats.length && !selectedCats.includes(p.category)) return false;
    if (selectedBrands.length && !selectedBrands.includes(p.brand)) return false;
    return true;
  });

  const colLabels: Record<string, string> = {
    ref: t('catalog.table.ref'), name: t('catalog.table.name'), category: t('catalog.table.category'), brand: t('catalog.table.brand'),
    price: t('catalog.table.price'), stock: t('catalog.table.stock'), supplier: t('catalog.table.supplier'), warranty: t('catalog.table.warranty'),
    rating: t('suppliers.table.rating'), status: t('common.status'),
  };

  const getPartValue = (p: typeof PARTS[0], key: string): string => {
    switch (key) {
      case 'ref': return p.ref;
      case 'name': return p.name;
      case 'category': return CATEGORIES.find((c) => c.id === p.category)?.name || p.category;
      case 'brand': return p.brand;
      case 'price': return formatPrice(p.price);
      case 'stock': return String(p.stock);
      case 'supplier': return p.supplierName;
      case 'warranty': return p.warranty;
      case 'rating': return `${p.rating} ★`;
      case 'status': return p.inStock ? t('common.inStock', 'En stock') : t('common.outOfStock', 'Rupture');
      default: return '';
    }
  };

  // Raw value for Excel (numbers stay numbers)
  const getPartRawValue = (p: typeof PARTS[0], key: string): string | number => {
    switch (key) {
      case 'ref': return p.ref;
      case 'name': return p.name;
      case 'category': return CATEGORIES.find((c) => c.id === p.category)?.name || p.category;
      case 'brand': return p.brand;
      case 'price': return p.price;
      case 'stock': return p.stock;
      case 'supplier': return p.supplierName;
      case 'warranty': return p.warranty;
      case 'rating': return p.rating;
      case 'status': return p.inStock ? t('common.inStock', 'En stock') : t('common.outOfStock', 'Rupture');
      default: return '';
    }
  };

  const formatIcons: Record<string, { label: string; icon: string; desc: string; color: string }> = {
    csv: { label: t('catalog.exportModal.formats.csv.title'), icon: '📄', desc: t('catalog.exportModal.formats.csv.desc'), color: 'from-emerald-500 to-teal-600' },
    excel: { label: t('catalog.exportModal.formats.xlsx.title'), icon: '📊', desc: t('catalog.exportModal.formats.xlsx.desc'), color: 'from-green-600 to-emerald-700' },
    pdf: { label: t('catalog.exportModal.formats.pdf.title'), icon: '📕', desc: t('catalog.exportModal.formats.pdf.desc'), color: 'from-rose-500 to-red-600' },
  };

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportCSV = (activeCols: string[], data: typeof PARTS) => {
    const headerRow = activeCols.map((k) => colLabels[k]).join(';');
    const dataRows = data.map((p) => activeCols.map((k) => {
      const val = getPartValue(p, k);
      return `"${val.replace(/"/g, '""')}"`;
    }).join(';'));
    const csvContent = [headerRow, ...dataRows].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    triggerDownload(blob, `catalogue_autoparts_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const exportExcel = (activeCols: string[], data: typeof PARTS) => {
    // Build header and data rows with raw values
    const headers = activeCols.map((k) => colLabels[k]);
    const rows = data.map((p) => activeCols.map((k) => getPartRawValue(p, k)));

    // Create workbook
    const wb = XLSX.utils.book_new();
    const wsData = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Auto column widths
    const colWidths = activeCols.map((key, i) => {
      const maxLen = Math.max(
        headers[i].length,
        ...rows.slice(0, 100).map((r) => String(r[i]).length)
      );
      return { wch: Math.min(maxLen + 4, 40) };
    });
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, t('menu.catalog', 'Catalogue'));

    // Summary sheet
    const summaryData = [
      [`AutoParts Connect — ${t('catalog.exportModal.title')}`],
      [],
      [t('common.date', 'Date'), new Date().toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })],
      [`${t('catalog.addModal.form.partName', 'Pièces')}`, data.length],
      [`${t('catalog.exportModal.columnsToExport', 'Colonnes')}`, activeCols.map((k) => colLabels[k]).join(', ')],
      [],
      [`${t('common.filters', 'Filtres')}`],
      [`${t('catalog.addModal.form.category', 'Catégories')}`, selectedCats.length ? selectedCats.map((id) => CATEGORIES.find((c) => c.id === id)?.name).join(', ') : t('common.all', 'Toutes')],
      [`${t('catalog.addModal.form.brand', 'Marques')}`, selectedBrands.length ? selectedBrands.join(', ') : t('common.all', 'Toutes')],
      [],
      [`${t('common.statistics', 'Statistiques')}`],
      [`${t('common.totalStockValue', 'Valeur totale du stock')}`, data.reduce((s, p) => s + p.price * p.stock, 0)],
      [`${t('common.avgPrice', 'Prix moyen')}`, Math.round(data.reduce((s, p) => s + p.price, 0) / data.length)],
      [`${t('common.totalStockQty', 'Stock total (unités)')}`, data.reduce((s, p) => s + p.stock, 0)],
      [`${t('common.inStock', 'En stock')}`, data.filter((p) => p.inStock).length],
      [`${t('common.outOfStock', 'Rupture')}`, data.filter((p) => !p.inStock).length],
      [`${t('common.avgRating', 'Note moyenne')}`, Math.round(data.reduce((s, p) => s + p.rating, 0) / data.length * 100) / 100],
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    wsSummary['!cols'] = [{ wch: 30 }, { wch: 50 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, t('common.summary', 'Résumé'));

    // Generate file
    const wbOut = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbOut], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    triggerDownload(blob, `catalogue_autoparts_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const exportPDF = (activeCols: string[], data: typeof PARTS) => {
    const doc = new jsPDF({ orientation: data.length > 0 && activeCols.length > 6 ? 'landscape' : 'portrait', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const today = new Date().toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

    // Header
    doc.setFillColor(99, 102, 241); // indigo-500
    doc.rect(0, 0, pageW, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('AutoParts Connect', 14, 12);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${t('catalog.title')} — ${today}`, 14, 19);
    doc.text(`${data.length} ${t('catalog.addModal.form.partName', 'pièces')}`, pageW - 14, 12, { align: 'right' });
    doc.text(`${activeCols.length} ${t('catalog.exportModal.columnsToExport', 'colonnes')}`, pageW - 14, 19, { align: 'right' });

    // Summary box
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(8);
    const statsY = 34;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, statsY, pageW - 28, 16, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text(`${t('common.summary', 'Résumé')} :`, 18, statsY + 5);
    doc.setFont('helvetica', 'normal');
    const statsText = [
      `${t('catalog.table.stock', 'Stock total')}: ${data.reduce((s, p) => s + p.stock, 0).toLocaleString(i18n.language)}`,
      `${t('common.inStock', 'En stock')}: ${data.filter((p) => p.inStock).length}`,
      `${t('common.outOfStock', 'Rupture')}: ${data.filter((p) => !p.inStock).length}`,
      `${t('common.avgRating', 'Note moy')}: ${(data.reduce((s, p) => s + p.rating, 0) / data.length).toFixed(1)}`,
    ].join('  |  ');
    doc.text(statsText, 18, statsY + 11);

    // Table
    const tableHeaders = activeCols.map((k) => colLabels[k]);
    const tableRows = data.map((p) => activeCols.map((k) => getPartValue(p, k)));

    autoTable(doc, {
      head: [tableHeaders],
      body: tableRows,
      startY: statsY + 22,
      styles: { fontSize: 7, cellPadding: 2, overflow: 'linebreak', font: 'helvetica' },
      headStyles: { fillColor: [99, 102, 241], textColor: 255, fontStyle: 'bold', fontSize: 7 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: activeCols.reduce((acc, key, i) => {
        if (key === 'price') acc[i] = { halign: 'right', fontStyle: 'bold' };
        if (key === 'stock') acc[i] = { halign: 'center' };
        if (key === 'rating') acc[i] = { halign: 'center' };
        return acc;
      }, {} as Record<number, any>),
      margin: { left: 14, right: 14 },
      didDrawPage: (hookData: any) => {
        // Footer on every page
        const pageNum = doc.getNumberOfPages();
        doc.setFontSize(7);
        doc.setTextColor(150, 150, 150);
        doc.text(`AutoParts Connect — ${t('catalog.exportModal.title')} ${today}`, 14, pageH - 8);
        doc.text(`Page ${hookData.pageNumber} / ${pageNum}`, pageW - 14, pageH - 8, { align: 'right' });
      },
    });

    // Fix page numbers (re-render footer with correct total)
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      // White out old page number area
      doc.setFillColor(255, 255, 255);
      doc.rect(pageW - 40, pageH - 12, 30, 8, 'F');
      doc.text(`Page ${i} / ${totalPages}`, pageW - 14, pageH - 8, { align: 'right' });
    }

    doc.save(`catalogue_autoparts_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const handleExport = () => {
    setExporting(true); setProgress(0);
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(timer); return 100; }
        return p + Math.floor(Math.random() * 15) + 5;
      });
    }, 200);
    setTimeout(() => {
      clearInterval(timer); setProgress(100);
      const activeCols = Object.entries(columns).filter(([, v]) => v).map(([k]) => k);

      try {
        if (format === 'csv') {
          exportCSV(activeCols, filteredParts);
        } else if (format === 'excel') {
          exportExcel(activeCols, filteredParts);
        } else if (format === 'pdf') {
          exportPDF(activeCols, filteredParts);
        }
      } catch (err) {
        console.error('Export error:', err);
      }

      setExporting(false); setExported(true);
    }, 2200);
  };

  const handleClose = () => {
    setExporting(false); setExported(false); setProgress(0);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ animation: 'fadeIn .25s ease-out' }}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800" style={{ animation: 'slideUp .35s cubic-bezier(.16,1,.3,1)' }}>
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur-xl px-6 py-4 dark:border-slate-800 dark:bg-slate-900/95 rounded-t-3xl">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('catalog.exportModal.title')}</h2>
            <p className="text-xs text-slate-500">{filteredParts.length} {t('catalog.addModal.form.partName', 'pièces')} · {colCount} {t('catalog.exportModal.columnsToExport', 'colonnes')} {t('common.selected', 'sélectionnées')}</p>
          </div>
          <button onClick={handleClose} className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700">✕</button>
        </div>

        {/* Success / Exported */}
        {exported ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center" style={{ animation: 'slideUp .4s cubic-bezier(.16,1,.3,1)' }}>
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 shadow-xl shadow-emerald-500/30">
              <Check className="h-10 w-10 text-white" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">{t('catalog.exportModal.status.success')}</h3>
            <p className="mt-2 text-sm text-slate-500">{filteredParts.length} {t('catalog.addModal.form.partName', 'pièces')} {t('common.exportedInFormat', 'exportées en format')} <span className="font-semibold text-indigo-600 uppercase">{format}</span></p>
            <p className="text-xs text-slate-400 mt-1">{t('catalog.exportModal.autoDownload')}</p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => { setExported(false); }} className="btn-secondary">{t('catalog.exportModal.newExport', 'Nouvelle exportation')}</button>
              <button onClick={handleClose} className="btn-primary">{t('common.close')}</button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Format Selection */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('catalog.exportModal.title')}</label>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {Object.entries(formatIcons).map(([key, f]) => (
                  <button
                    key={key}
                    onClick={() => setFormat(key as any)}
                    className={`relative flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all cursor-pointer ${format === key ? 'border-indigo-500 bg-indigo-50/50 shadow-lg shadow-indigo-500/10 dark:bg-indigo-500/5' : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'}`}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} text-lg shadow-md`}>{f.icon}</div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{f.label}</div>
                      <div className="text-[10px] text-slate-500">{f.desc}</div>
                    </div>
                    {format === key && (
                      <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-white">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Columns */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('catalog.exportModal.columnsToExport', 'Colonnes à exporter')}</label>
                <button onClick={() => setColumns(Object.fromEntries(Object.keys(columns).map((k) => [k, true])) as any)} className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer">{t('common.selectAll', 'Tout sélectionner')}</button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.entries(colLabels).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => toggleCol(key)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${(columns as any)[key] ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filters row */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('catalog.exportModal.filterByCategory', 'Filtrer par catégorie')}</label>
                <div className="mt-2 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {CATEGORIES.map((c) => (
                    <button key={c.id} onClick={() => toggleCat(c.id)} className={`rounded-lg px-2 py-1 text-[10px] font-semibold transition cursor-pointer ${selectedCats.includes(c.id) ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                      {c.icon} {c.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('catalog.exportModal.filterByBrand', 'Filtrer par marque')}</label>
                <div className="mt-2 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {BRANDS.map((b) => (
                    <button key={b} onClick={() => toggleBrand(b)} className={`rounded-lg px-2 py-1 text-[10px] font-semibold transition cursor-pointer ${selectedBrands.includes(b) ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Date range */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('common.startDate', 'Date de début')}</label>
                <input type="date" className="input-base mt-1" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('common.endDate', 'Date de fin')}</label>
                <input type="date" className="input-base mt-1" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
              </div>
            </div>

            {/* Live Preview */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('common.dataPreview', 'Aperçu des données')}</label>
                <span className="badge bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">{t('common.linesCount', '{{count}} lignes', { count: filteredParts.length })}</span>
              </div>
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                      <tr>
                        {Object.entries(columns).filter(([, v]) => v).map(([key]) => (
                          <th key={key} className="px-3 py-2 text-left font-bold uppercase tracking-wider text-slate-400">{colLabels[key]}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredParts.slice(0, 5).map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                          {Object.entries(columns).filter(([, v]) => v).map(([key]) => (
                            <td key={key} className="px-3 py-2 text-slate-700 dark:text-slate-300 whitespace-nowrap max-w-[150px] truncate">
                              {key === 'status' ? (
                                <span className={`badge text-[10px] ${p.inStock ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{p.inStock ? t('common.inStock', 'En stock') : t('common.outOfStock', 'Rupture')}</span>
                              ) : getPartValue(p, key)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredParts.length > 5 && (
                  <div className="border-t border-slate-200 bg-slate-50 px-3 py-2 text-center text-[10px] text-slate-400 dark:border-slate-800 dark:bg-slate-800/50">
                    {t('common.moreLines', '… et {{count}} autres lignes', { count: filteredParts.length - 5 })}
                  </div>
                )}
              </div>
            </div>

            {/* Export Button with Progress */}
            <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
              <button onClick={handleClose} className="btn-ghost text-sm">{t('common.cancel')}</button>
              <button onClick={handleExport} disabled={exporting || colCount === 0} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed min-w-[200px]">
                {exporting ? (
                  <div className="flex items-center gap-2 w-full">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <div className="flex-1">
                      <div className="h-1.5 w-full rounded-full bg-white/30 overflow-hidden">
                        <div className="h-full rounded-full bg-white transition-all duration-300" style={{ width: `${Math.min(progress, 100)}%` }} />
                      </div>
                    </div>
                    <span className="text-xs">{Math.min(progress, 100)}%</span>
                  </div>
                ) : (
                  <span className="flex items-center gap-2"><Download className="h-4 w-4" /> {t('catalog.exportModal.download')} ({filteredParts.length} {t('catalog.addModal.form.partName', 'pièces')})</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AdminCatalog() {
  const { t } = useTranslation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [search, setSearch] = useState('');

  const filteredParts = PARTS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.ref.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );
  const displayParts = search ? filteredParts.slice(0, 12) : TOP_PARTS;

  return (
    <div className="space-y-4">
      <div className="card p-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input type="text" placeholder={t('catalog.searchPlaceholder')} className="input-base flex-1" value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={() => setShowExportModal(true)}><Download className="h-4 w-4" /> {t('common.export', 'Exporter')}</button>
          <button className="btn-primary" onClick={() => setShowAddModal(true)}><Plus className="h-4 w-4" /> {t('common.add', 'Ajouter')}</button>
        </div>
      </div>

      {search && (
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>{t('common.searchResults', '{{count}} résultats pour', { count: filteredParts.length })}</span>
          <span className="badge bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">"{search}"</span>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {displayParts.map((p) => {
          const cat = CATEGORIES.find((c) => c.id === p.category);
          return (
            <div key={p.id} className="card p-3">
              <PartImage category={p.category} gradient={p.image} size="sm" className="!h-32 !w-full rounded-lg" />
              <div className="mt-2">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{p.brand} · {cat?.name}</div>
                <h3 className="mt-0.5 line-clamp-2 text-sm font-bold text-slate-900 dark:text-white">{p.name}</h3>
                <p className="text-[11px] text-slate-500">{t('catalog.table.ref')} {p.ref}</p>
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-extrabold text-indigo-600">{formatPrice(p.price)}</div>
                    <div className="text-[10px] text-slate-500">{t('catalog.table.stock')} : {p.stock}</div>
                  </div>
                  <span className={`badge ${p.inStock ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {p.inStock ? t('common.inStock', 'En stock') : t('common.outOfStock', 'Rupture')}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex gap-1">
                <button className="btn-ghost flex-1 text-xs" title={t('common.edit')}><Edit3 className="h-3 w-3" /></button>
                <button className="btn-ghost flex-1 text-xs" title={t('common.details')}><Eye className="h-3 w-3" /></button>
                <button className="btn-ghost flex-1 text-xs text-rose-500" title={t('common.delete')}><Trash2 className="h-3 w-3" /></button>
              </div>
              <a
                href={`https://wa.me/237696567184?text=${encodeURIComponent(`Bonjour VizuParts, je veux ${p.name} à ${formatPrice(p.price)}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold text-white transition-all hover:brightness-110"
                style={{ backgroundColor: '#25D366' }}
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                Commander
              </a>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <AddPartModal open={showAddModal} onClose={() => setShowAddModal(false)} />
      <ExportCenterModal open={showExportModal} onClose={() => setShowExportModal(false)} />
    </div>
  );
}

// ===================== STOCK =====================
export function AdminStock() {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="card p-4">
          <div className="text-xs font-semibold text-slate-500">{t('common.totalStockValue', 'Valeur totale du stock')}</div>
          <div className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">847M XOF</div>
          <div className="mt-1 text-xs text-emerald-600 font-semibold flex items-center gap-1"><TrendingUp className="h-3 w-3" /> +5.2%</div>
        </div>
        <div className="card p-4">
          <div className="text-xs font-semibold text-slate-500">{t('common.outOfStockProducts', 'Produits en rupture')}</div>
          <div className="mt-1 text-2xl font-extrabold text-rose-600">42</div>
          <div className="mt-1 text-xs text-rose-600 font-semibold">{t('common.actionRequired', 'Action requise')}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs font-semibold text-slate-500">{t('dashboard.alerts.lowStock')}</div>
          <div className="mt-1 text-2xl font-extrabold text-amber-600">128</div>
          <div className="mt-1 text-xs text-amber-600 font-semibold">{t('common.restock', 'Réapprovisionner')}</div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-slate-200 p-4 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t('common.stockAlerts', 'Alertes de stock')}</h3>
          <button className="btn-secondary"><RefreshCw className="h-3.5 w-3.5" /> {t('common.refresh', 'Actualiser')}</button>
        </div>
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {PARTS.slice(0, 8).map((p) => {
            const lvl = p.stock === 0 ? 'critical' : p.stock < 5 ? 'low' : p.stock < 15 ? 'medium' : 'good';
            const colors = { critical: 'bg-rose-500', low: 'bg-amber-500', medium: 'bg-yellow-500', good: 'bg-emerald-500' };
            return (
              <div key={p.id} className="flex items-center gap-3 p-3">
                <PartImage category={p.category} gradient={p.image} size="sm" className="!h-12 !w-12" />
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">{p.name}</div>
                  <div className="text-[11px] text-slate-500">{p.brand} · {p.supplierName}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-sm font-bold">{p.stock}</div>
                    <div className="text-[10px] text-slate-500">{t('common.units', 'unités')}</div>
                  </div>
                  <div className={`h-2 w-2 rounded-full ${colors[lvl]}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ===================== RESERVATIONS =====================
export function AdminReservations() {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="card p-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input type="text" placeholder={t('reservations.searchPlaceholder')} className="input-base flex-1" />
        <div className="flex gap-2">
          <button className="btn-secondary"><Filter className="h-4 w-4" /> {t('common.filters', 'Filtres')}</button>
          <button className="btn-secondary"><Download className="h-4 w-4" /> {t('common.export', 'Exporter')}</button>
        </div>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3">{t('catalog.table.ref')}</th>
                <th className="px-4 py-3">{t('reservations.table.client', 'Client')}</th>
                <th className="px-4 py-3">{t('reservations.table.part', 'Pièce')}</th>
                <th className="px-4 py-3">{t('reservations.table.amount', 'Montant')}</th>
                <th className="px-4 py-3">{t('common.status')}</th>
                <th className="px-4 py-3">{t('common.date')}</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {RESERVATIONS.slice(0, 15).map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="px-4 py-3 font-mono text-xs font-semibold">{r.reference}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{r.userId}</td>
                  <td className="px-4 py-3 max-w-xs truncate">{r.partName}</td>
                  <td className="px-4 py-3 font-bold text-indigo-600">{formatPrice(r.totalPrice)}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3 text-xs text-slate-500">{new Date(r.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td className="px-4 py-3"><button className="text-slate-400 hover:text-indigo-600"><MoreVertical className="h-4 w-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ===================== PAYMENTS =====================
export function AdminPayments() {
  const { t } = useTranslation();
  const data = [
    { m: 'Lun', v: 2.4 }, { m: 'Mar', v: 3.1 }, { m: 'Mer', v: 2.8 },
    { m: 'Jeu', v: 4.2 }, { m: 'Ven', v: 5.1 }, { m: 'Sam', v: 6.3 }, { m: 'Dim', v: 4.7 },
  ];
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: t('payments.stats.total'), value: '47,3M', color: 'from-indigo-500 to-violet-600' },
          { label: t('payments.stats.transactions'), value: '2 154', color: 'from-emerald-500 to-teal-600' },
          { label: t('payments.stats.pending'), value: '384K', color: 'from-amber-500 to-orange-600' },
          { label: t('payments.stats.refunds'), value: '127K', color: 'from-rose-500 to-pink-600' },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <div className="text-xs font-semibold text-slate-500">{s.label}</div>
            <div className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">{s.value} <span className="text-xs">XAF</span></div>
            <div className={`mt-1 h-1 rounded-full bg-gradient-to-r ${s.color}`} />
          </div>
        ))}
      </div>
      <div className="card p-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">{t('payments.chartTitle')}</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="m" stroke="#94a3b8" fontSize={11} />
            <YAxis stroke="#94a3b8" fontSize={11} />
            <Tooltip />
            <Line type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { method: t('payments.methods.momo'), percent: 62, color: 'from-amber-500 to-orange-600' },
          { method: t('payments.methods.card'), percent: 28, color: 'from-indigo-500 to-violet-600' },
          { method: t('payments.methods.cod'), percent: 10, color: 'from-emerald-500 to-teal-600' },
        ].map((m) => (
          <div key={m.method} className="card p-4">
            <div className="text-xs font-semibold text-slate-500">{m.method}</div>
            <div className="mt-1 text-2xl font-extrabold">{m.percent}%</div>
            <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div className={`h-full rounded-full bg-gradient-to-r ${m.color}`} style={{ width: `${m.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===================== CMS =====================
export function AdminCMS() {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { title: 'Bannière accueil', status: 'Publié', date: '15 Déc 2025' },
          { title: 'Promo Black Friday', status: 'Brouillon', date: '20 Déc 2025' },
          { title: 'Article blog — Sécurité auto', status: 'Publié', date: '10 Déc 2025' },
        ].map((c) => (
          <div key={c.title} className="card p-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{c.title}</h3>
            <p className="text-xs text-slate-500 mt-1">{c.date}</p>
            <span className={`badge mt-2 ${c.status === 'Publié' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
              {c.status === 'Publié' ? t('cms.status.published') : t('cms.status.draft')}
            </span>
            <div className="mt-3 flex gap-1">
              <button className="btn-ghost flex-1 text-xs"><Edit3 className="h-3 w-3" /> {t('common.edit')}</button>
              <button className="btn-ghost flex-1 text-xs"><Eye className="h-3 w-3" /> {t('cms.actions.preview')}</button>
            </div>
          </div>
        ))}
      </div>
      <div className="card p-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">{t('cms.newContent.title')}</h3>
        <div className="space-y-3">
          <input className="input-base" placeholder={t('cms.newContent.titlePlaceholder')} />
          <textarea className="input-base min-h-[120px]" placeholder={t('cms.newContent.descPlaceholder')} />
          <div className="flex gap-2">
            <button className="btn-secondary">{t('cms.newContent.draft')}</button>
            <button className="btn-primary">{t('cms.newContent.publish')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================== REPORTS =====================
export function AdminReports() {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t('reports.title')}</h3>
        <p className="text-xs text-slate-500 mb-3">{t('reports.subtitle')}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            { icon: BarChart3, title: t('reports.sales.title'), desc: t('reports.sales.desc') },
            { icon: Users, title: t('reports.users.title'), desc: t('reports.users.desc') },
            { icon: Package, title: t('reports.inventory.title'), desc: t('reports.inventory.desc') },
            { icon: FileText, title: t('reports.financial.title'), desc: t('reports.financial.desc') },
          ].map((r) => {
            const Icon = r.icon;
            return (
              <div key={r.title} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">{r.title}</div>
                  <div className="text-[11px] text-slate-500">{r.desc}</div>
                </div>
                <Download className="h-4 w-4 text-slate-400" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ===================== SETTINGS =====================
export function AdminSettings() {
  const { t, i18n } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">{t('settings.title')}</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-500">{t('settings.platformName')}</label>
            <input className="input-base mt-1" defaultValue="AutoParts Connect" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">{t('settings.contactEmail')}</label>
            <input className="input-base mt-1" defaultValue="contact@autoparts-connect.ci" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">{t('settings.language', 'Langue')}</label>
            <select
              value={i18n.language.startsWith('fr') ? 'fr' : 'en'}
              onChange={(e) => changeLanguage(e.target.value as 'fr' | 'en')}
              className="input-base mt-1 cursor-pointer"
            >
              <option value="fr">Français (FR)</option>
              <option value="en">English (EN)</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">{t('settings.currency')}</label>
            <select className="input-base mt-1">
              <option>XAF (FCFA)</option><option>EUR</option><option>USD</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">{t('settings.timezone')}</label>
            <select className="input-base mt-1">
              <option>Africa/Cameroun (GMT+1)</option>
            </select>
          </div>
          <button className="btn-primary">{t('common.save')}</button>
        </div>
      </div>
      <div className="card p-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">{t('settings.security.title')}</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div>
              <div className="font-semibold">{t('settings.security.twoFactor')}</div>
              <div className="text-xs text-slate-500">{t('settings.security.twoFactorDesc')}</div>
            </div>
            <span className="badge bg-emerald-100 text-emerald-700">{t('settings.security.enabled')}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div>
              <div className="font-semibold">{t('settings.security.rateLimit')}</div>
              <div className="text-xs text-slate-500">{t('settings.security.rateLimitDesc')}</div>
            </div>
            <span className="badge bg-emerald-100 text-emerald-700">{t('settings.security.enabled')}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div>
              <div className="font-semibold">{t('settings.security.auditLogs')}</div>
              <div className="text-xs text-slate-500">{t('settings.security.auditLogsDesc')}</div>
            </div>
            <span className="badge bg-emerald-100 text-emerald-700">{t('settings.security.enabled')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
