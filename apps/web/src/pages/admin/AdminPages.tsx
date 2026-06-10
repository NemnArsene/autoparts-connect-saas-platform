import { useState } from 'react';
import { TrendingUp, TrendingDown, Users, Package, ShoppingBag, DollarSign, Star, Eye, MoreVertical, Check, Filter, Download, RefreshCw, AlertCircle, MapPin, Phone, Mail, Plus, Edit3, Trash2, BarChart3, FileText } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import { RESERVATIONS, SUPPLIERS, PARTS, CATEGORIES, formatPrice, BRANDS } from '../../data/seed';
import { StatusBadge } from '../../components/Shared';
import { PartImage } from '../../components/PartImage';

// ===================== DASHBOARD =====================
const REVENUE_DATA = [
  { m: 'Jan', v: 12.4 }, { m: 'Fév', v: 15.8 }, { m: 'Mar', v: 18.2 },
  { m: 'Avr', v: 22.5 }, { m: 'Mai', v: 19.8 }, { m: 'Juin', v: 26.1 },
  { m: 'Juil', v: 31.2 }, { m: 'Août', v: 28.7 }, { m: 'Sept', v: 34.5 },
  { m: 'Oct', v: 38.9 }, { m: 'Nov', v: 42.1 }, { m: 'Déc', v: 47.3 },
];

const CATEGORY_DATA = CATEGORIES.slice(0, 6).map((c, i) => ({
  name: c.name, value: c.count, color: ['#6366f1','#f59e0b','#10b981','#ec4899','#8b5cf6','#06b6d4'][i],
}));

const TOP_PARTS = PARTS.slice(0, 6);

export function AdminDashboard() {
  const stats = [
    { label: "Chiffre d'affaires", value: '47,3M', unit: 'XOF', delta: '+12.5%', up: true, icon: DollarSign, color: 'from-indigo-500 to-violet-600' },
    { label: 'Réservations', value: '2 154', unit: '', delta: '+8.2%', up: true, icon: ShoppingBag, color: 'from-emerald-500 to-teal-600' },
    { label: 'Utilisateurs actifs', value: '8 421', unit: '', delta: '+15.3%', up: true, icon: Users, color: 'from-amber-500 to-orange-600' },
    { label: 'Pièces vendues', value: '5 832', unit: '', delta: '-2.1%', up: false, icon: Package, color: 'from-rose-500 to-pink-600' },
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
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Évolution du chiffre d'affaires</h3>
              <p className="text-xs text-slate-500">12 derniers mois · Millions XOF</p>
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
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Top catégories</h3>
          <p className="mb-2 text-xs text-slate-500">Répartition des pièces</p>
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
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Réservations par marque</h3>
          <p className="mb-2 text-xs text-slate-500">Volume mensuel</p>
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
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Top fournisseurs</h3>
          <p className="mb-3 text-xs text-slate-500">Par performance</p>
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
                    {s.rating} · {s.productsCount} produits
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
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Dernières réservations</h3>
            <button className="text-xs font-semibold text-indigo-600">Voir tout</button>
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
          <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">Alertes</h3>
          <div className="space-y-2">
            {[
              { type: 'stock', label: 'Stock faible', desc: '12 produits à réapprovisionner', color: 'bg-amber-100 text-amber-700' },
              { type: 'order', label: 'Commandes en attente', desc: '24 réservations à valider', color: 'bg-sky-100 text-sky-700' },
              { type: 'user', label: 'Nouveaux utilisateurs', desc: '47 inscriptions aujourd\'hui', color: 'bg-emerald-100 text-emerald-700' },
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
  id: `usr-${i+1}`,
  name: ['Kouamé Yao','Aminata Diallo','Jean Kouassi','Fatou Camara','Marc Bamba','Awa Traoré','Olivier Diop','Mariam Sanogo','Pascal N\'Guessan','Léa Mensah'][i % 10] + ' ' + (i + 1),
  email: `user${i+1}@autoparts.ci`,
  phone: `+225 07 ${String(10 + i).padStart(2,'0')} ${String(10 + i*2).padStart(2,'0')} ${String(10 + i*3).padStart(2,'0')}`,
  city: ['Abidjan','Dakar','Lomé','Douala','Bamako'][i % 5],
  role: i % 8 === 0 ? 'admin' : 'client',
  status: i % 4 === 0 ? 'inactive' : 'active',
  orders: Math.floor(Math.random() * 30),
  spent: Math.floor(50000 + Math.random() * 800000),
  joined: new Date(Date.now() - Math.floor(Math.random() * 365) * 86400000).toISOString(),
}));

export function AdminUsers() {
  const [search, setSearch] = useState('');
  const filtered = MOCK_USERS.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search));
  return (
    <div className="space-y-4">
      <div className="card p-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input type="text" placeholder="Rechercher un utilisateur…" value={search} onChange={(e) => setSearch(e.target.value)} className="input-base flex-1" />
        <div className="flex gap-2">
          <button className="btn-secondary"><Filter className="h-4 w-4" /> Filtres</button>
          <button className="btn-primary"><Plus className="h-4 w-4" /> Inviter</button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3">Utilisateur</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Ville</th>
                <th className="px-4 py-3">Rôle</th>
                <th className="px-4 py-3">Commandes</th>
                <th className="px-4 py-3">Total dépensé</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filtered.slice(0, 20).map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">
                        {u.name.split(' ').map((n) => n[0]).slice(0,2).join('')}
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
                      {u.role === 'admin' ? 'Admin' : 'Client'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold">{u.orders}</td>
                  <td className="px-4 py-3 font-semibold text-indigo-600">{formatPrice(u.spent)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${u.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {u.status === 'active' ? 'Actif' : 'Inactif'}
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
          <span>Affichage 1-20 sur {filtered.length}</span>
          <div className="flex gap-1">
            <button className="rounded border border-slate-200 px-2 py-1 dark:border-slate-700">Précédent</button>
            <button className="rounded border border-indigo-500 bg-indigo-500 px-2 py-1 text-white">1</button>
            <button className="rounded border border-slate-200 px-2 py-1 dark:border-slate-700">2</button>
            <button className="rounded border border-slate-200 px-2 py-1 dark:border-slate-700">Suivant</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================== SUPPLIERS =====================
export function AdminSuppliers() {
  return (
    <div className="space-y-4">
      <div className="card p-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input type="text" placeholder="Rechercher un fournisseur…" className="input-base flex-1" />
        <button className="btn-primary"><Plus className="h-4 w-4" /> Nouveau fournisseur</button>
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
                  <span className="text-slate-500">· {s.productsCount} produits</span>
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5"><Phone className="h-3 w-3 text-slate-400" /> {s.phone}</div>
              <div className="flex items-center gap-1.5 truncate"><Mail className="h-3 w-3 text-slate-400" /> {s.email}</div>
            </div>
            <div className="mt-3 flex gap-1">
              <button className="btn-ghost flex-1 text-xs"><Eye className="h-3 w-3" /> Voir</button>
              <button className="btn-ghost flex-1 text-xs"><Edit3 className="h-3 w-3" /> Éditer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===================== CATALOG =====================
export function AdminCatalog() {
  return (
    <div className="space-y-4">
      <div className="card p-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input type="text" placeholder="Rechercher une pièce…" className="input-base flex-1" />
        <div className="flex gap-2">
          <button className="btn-secondary"><Download className="h-4 w-4" /> Exporter</button>
          <button className="btn-primary"><Plus className="h-4 w-4" /> Ajouter</button>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {TOP_PARTS.map((p) => {
          const cat = CATEGORIES.find((c) => c.id === p.category);
          return (
            <div key={p.id} className="card p-3">
              <PartImage category={p.category} gradient={p.image} size="sm" className="!h-32 !w-full rounded-lg" />
              <div className="mt-2">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{p.brand} · {cat?.name}</div>
                <h3 className="mt-0.5 line-clamp-2 text-sm font-bold text-slate-900 dark:text-white">{p.name}</h3>
                <p className="text-[11px] text-slate-500">Réf {p.ref}</p>
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-extrabold text-indigo-600">{formatPrice(p.price)}</div>
                    <div className="text-[10px] text-slate-500">Stock : {p.stock}</div>
                  </div>
                  <span className={`badge ${p.inStock ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {p.inStock ? 'En stock' : 'Rupture'}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex gap-1">
                <button className="btn-ghost flex-1 text-xs"><Edit3 className="h-3 w-3" /></button>
                <button className="btn-ghost flex-1 text-xs"><Eye className="h-3 w-3" /></button>
                <button className="btn-ghost flex-1 text-xs text-rose-500"><Trash2 className="h-3 w-3" /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ===================== STOCK =====================
export function AdminStock() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="card p-4">
          <div className="text-xs font-semibold text-slate-500">Valeur totale du stock</div>
          <div className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">847M XOF</div>
          <div className="mt-1 text-xs text-emerald-600 font-semibold flex items-center gap-1"><TrendingUp className="h-3 w-3" /> +5.2%</div>
        </div>
        <div className="card p-4">
          <div className="text-xs font-semibold text-slate-500">Produits en rupture</div>
          <div className="mt-1 text-2xl font-extrabold text-rose-600">42</div>
          <div className="mt-1 text-xs text-rose-600 font-semibold">Action requise</div>
        </div>
        <div className="card p-4">
          <div className="text-xs font-semibold text-slate-500">Stock faible</div>
          <div className="mt-1 text-2xl font-extrabold text-amber-600">128</div>
          <div className="mt-1 text-xs text-amber-600 font-semibold">Réapprovisionner</div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-slate-200 p-4 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Alertes de stock</h3>
          <button className="btn-secondary"><RefreshCw className="h-3.5 w-3.5" /> Actualiser</button>
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
                    <div className="text-[10px] text-slate-500">unités</div>
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
  return (
    <div className="space-y-4">
      <div className="card p-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input type="text" placeholder="Rechercher une réservation…" className="input-base flex-1" />
        <div className="flex gap-2">
          <button className="btn-secondary"><Filter className="h-4 w-4" /> Filtres</button>
          <button className="btn-secondary"><Download className="h-4 w-4" /> Exporter</button>
        </div>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3">Référence</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Pièce</th>
                <th className="px-4 py-3">Montant</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Date</th>
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
  const data = [
    { m: 'Lun', v: 2.4 }, { m: 'Mar', v: 3.1 }, { m: 'Mer', v: 2.8 },
    { m: 'Jeu', v: 4.2 }, { m: 'Ven', v: 5.1 }, { m: 'Sam', v: 6.3 }, { m: 'Dim', v: 4.7 },
  ];
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: 'Volume total', value: '47,3M', color: 'from-indigo-500 to-violet-600' },
          { label: 'Transactions', value: '2 154', color: 'from-emerald-500 to-teal-600' },
          { label: 'En attente', value: '384K', color: 'from-amber-500 to-orange-600' },
          { label: 'Remboursements', value: '127K', color: 'from-rose-500 to-pink-600' },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <div className="text-xs font-semibold text-slate-500">{s.label}</div>
            <div className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">{s.value} <span className="text-xs">XOF</span></div>
            <div className={`mt-1 h-1 rounded-full bg-gradient-to-r ${s.color}`} />
          </div>
        ))}
      </div>
      <div className="card p-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Volume des paiements (7 derniers jours)</h3>
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
          { method: 'Mobile Money', percent: 62, color: 'from-amber-500 to-orange-600' },
          { method: 'Carte bancaire', percent: 28, color: 'from-indigo-500 to-violet-600' },
          { method: 'Paiement à la livraison', percent: 10, color: 'from-emerald-500 to-teal-600' },
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
            <span className={`badge mt-2 ${c.status === 'Publié' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{c.status}</span>
            <div className="mt-3 flex gap-1">
              <button className="btn-ghost flex-1 text-xs"><Edit3 className="h-3 w-3" /> Éditer</button>
              <button className="btn-ghost flex-1 text-xs"><Eye className="h-3 w-3" /> Aperçu</button>
            </div>
          </div>
        ))}
      </div>
      <div className="card p-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Créer un nouveau contenu</h3>
        <div className="space-y-3">
          <input className="input-base" placeholder="Titre du contenu" />
          <textarea className="input-base min-h-[120px]" placeholder="Description…" />
          <div className="flex gap-2">
            <button className="btn-secondary">Brouillon</button>
            <button className="btn-primary">Publier</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================== REPORTS =====================
export function AdminReports() {
  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Rapports disponibles</h3>
        <p className="text-xs text-slate-500 mb-3">Générez des rapports détaillés sur votre activité</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            { icon: BarChart3, title: 'Rapport des ventes', desc: 'Détails par période, catégorie, fournisseur' },
            { icon: Users, title: 'Rapport utilisateurs', desc: 'Inscriptions, activité, comportement' },
            { icon: Package, title: 'Rapport inventaire', desc: 'Stock, mouvements, valorisations' },
            { icon: FileText, title: 'Rapport financier', desc: 'Revenus, commissions, taxes' },
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
  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Paramètres généraux</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-500">Nom de la plateforme</label>
            <input className="input-base mt-1" defaultValue="AutoParts Connect" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Email de contact</label>
            <input className="input-base mt-1" defaultValue="contact@autoparts-connect.ci" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Devise</label>
            <select className="input-base mt-1">
              <option>XOF (FCFA)</option><option>EUR</option><option>USD</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Fuseau horaire</label>
            <select className="input-base mt-1">
              <option>Africa/Abidjan (GMT+0)</option>
            </select>
          </div>
          <button className="btn-primary">Enregistrer</button>
        </div>
      </div>
      <div className="card p-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Sécurité & API</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div>
              <div className="font-semibold">Authentification à deux facteurs</div>
              <div className="text-xs text-slate-500">SMS OTP pour tous les admins</div>
            </div>
            <span className="badge bg-emerald-100 text-emerald-700">Activé</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div>
              <div className="font-semibold">Rate limiting API</div>
              <div className="text-xs text-slate-500">100 req/min par utilisateur</div>
            </div>
            <span className="badge bg-emerald-100 text-emerald-700">Activé</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div>
              <div className="font-semibold">Audit logs</div>
              <div className="text-xs text-slate-500">Toutes les actions sensibles sont tracées</div>
            </div>
            <span className="badge bg-emerald-100 text-emerald-700">Activé</span>
          </div>
        </div>
      </div>
    </div>
  );
}
