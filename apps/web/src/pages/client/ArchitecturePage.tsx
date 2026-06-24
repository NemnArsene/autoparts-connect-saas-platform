import { useState } from 'react';
import { Database, Server, Smartphone, Cloud, Shield, Zap, GitBranch, Layers, Code, FileCode, Cpu, Globe, Lock, Activity, CheckCircle2, ChevronRight } from 'lucide-react';
import { useApp } from '../../store/AppContext';

export function ArchitecturePage() {
  const { setAdminPage } = useApp();
  const [tab, setTab] = useState<'stack' | 'api' | 'ddd' | 'roadmap'>('stack');

  return (
    <div className="space-y-4 animate-fade-in pb-20">
      {/* Hero */}
      <section className="card relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-5 text-white">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-90">
            <Layers className="h-3 w-3" />
            Architecture Technique
          </div>
          <h1 className="mt-2 text-xl font-extrabold">AutoParts Connect v1.0</h1>
          <p className="mt-1 text-sm opacity-90">SaaS automobile de référence — 2026</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { k: 'Frontend', v: 'Angular 20' },
              { k: 'Backend', v: 'NestJS 10' },
              { k: 'Database', v: 'MongoDB' },
            ].map((m) => (
              <div key={m.k} className="rounded-xl bg-white/10 p-2 backdrop-blur">
                <div className="text-[9px] uppercase tracking-wider opacity-80">{m.k}</div>
                <div className="text-sm font-bold">{m.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {[
          { id: 'stack', label: 'Stack' },
          { id: 'api', label: 'API REST' },
          { id: 'ddd', label: 'DDD / Bounded' },
          { id: 'roadmap', label: 'Roadmap' },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id as any)} className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${tab === t.id ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'stack' && <StackTab />}
      {tab === 'api' && <APITab />}
      {tab === 'ddd' && <DDDTab />}
      {tab === 'roadmap' && <RoadmapTab />}

      {/* CTA Admin */}
      <button
        onClick={() => { setAdminPage('dashboard'); }}
        className="card flex w-full items-center justify-between p-4 text-left transition hover:shadow-md"
      >
        <div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">Voir le Backoffice en action</div>
          <p className="text-xs text-slate-500">Dashboard analytics, gestion utilisateurs, stocks, paiements</p>
        </div>
        <ChevronRight className="h-5 w-5 text-indigo-600" />
      </button>
    </div>
  );
}

function StackTab() {
  const layers = [
    {
      title: 'Frontend — PWA Client',
      icon: Smartphone,
      color: 'from-indigo-500 to-violet-600',
      items: ['Angular 20+ Standalone Components', 'Angular Signals & RxJS', 'PrimeNG & Tailwind CSS', 'PWA + Service Workers', 'IndexedDB (offline)', 'Capacitor (iOS/Android APK)'],
    },
    {
      title: 'Frontend — Backoffice',
      icon: Layers,
      color: 'from-slate-700 to-slate-900',
      items: ['Angular 20+ PrimeNG Dashboard', 'Analytics & Charts', 'Reactive Forms + Zod', 'Role-based UI', 'Desktop-first responsive'],
    },
    {
      title: 'Backend — API',
      icon: Server,
      color: 'from-emerald-500 to-teal-600',
      items: ['NestJS 10 + TypeScript', 'Clean Architecture + DDD', 'CQRS + Event-Driven', 'BullMQ (jobs/queues)', 'Swagger / OpenAPI 3.0', 'JWT + Refresh + RBAC + OAuth2'],
    },
    {
      title: 'Data & Cache',
      icon: Database,
      color: 'from-amber-500 to-orange-600',
      items: ['MongoDB (11 collections)', 'Redis (cache/sessions/rate-limit)', 'Mongoose ODM', 'S3 + CloudFront (CDN)'],
    },
    {
      title: 'DevOps & Observabilité',
      icon: Cloud,
      color: 'from-sky-500 to-blue-600',
      items: ['Docker + Docker Compose', 'GitHub Actions (CI/CD)', 'Nginx reverse proxy', 'AWS (ECS / RDS / S3)', 'Prometheus + Grafana', 'Sentry (error tracking)'],
    },
    {
      title: 'Sécurité',
      icon: Shield,
      color: 'from-rose-500 to-pink-600',
      items: ['Helmet + CORS + CSRF', 'Rate limiting (Redis)', 'Password hashing (bcrypt)', 'Audit logs + Encryption', 'OWASP Top 10 compliance'],
    },
  ];

  return (
    <div className="space-y-3">
      {layers.map((l) => {
        const Icon = l.icon;
        return (
          <div key={l.title} className="card p-4">
            <div className="flex items-center gap-2">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${l.color} text-white`}>
                <Icon className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{l.title}</h3>
            </div>
            <ul className="mt-3 space-y-1.5">
              {l.items.map((it) => (
                <li key={it} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function APITab() {
  const endpoints = [
    { method: 'POST', path: '/api/auth/register', desc: 'Inscription utilisateur', color: 'bg-emerald-500' },
    { method: 'POST', path: '/api/auth/login', desc: 'Connexion + JWT', color: 'bg-emerald-500' },
    { method: 'POST', path: '/api/auth/refresh', desc: 'Refresh token', color: 'bg-emerald-500' },
    { method: 'GET', path: '/api/parts?search=plaquette', desc: 'Recherche pièces', color: 'bg-sky-500' },
    { method: 'GET', path: '/api/parts/:id', desc: 'Détail pièce + compatibilités', color: 'bg-sky-500' },
    { method: 'GET', path: '/api/categories', desc: 'Liste catégories', color: 'bg-sky-500' },
    { method: 'POST', path: '/api/reservations', desc: 'Créer réservation', color: 'bg-amber-500' },
    { method: 'GET', path: '/api/reservations/me', desc: 'Mes réservations', color: 'bg-sky-500' },
    { method: 'PATCH', path: '/api/reservations/:id/cancel', desc: 'Annuler réservation', color: 'bg-amber-500' },
    { method: 'GET', path: '/api/vehicles', desc: 'Liste véhicules', color: 'bg-sky-500' },
    { method: 'POST', path: '/api/vehicles', desc: 'Ajouter véhicule', color: 'bg-amber-500' },
    { method: 'GET', path: '/api/suppliers', desc: 'Fournisseurs validés', color: 'bg-sky-500' },
    { method: 'POST', path: '/api/uploads', desc: 'Upload image (S3)', color: 'bg-amber-500' },
    { method: 'GET', path: '/api/dashboard/stats', desc: 'Stats admin', color: 'bg-violet-500' },
    { method: 'GET', path: '/api/notifications', desc: 'Notifications utilisateur', color: 'bg-sky-500' },
  ];

  return (
    <div className="space-y-3">
      <div className="card p-4">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">REST API · OpenAPI 3.0 · Swagger</h3>
        </div>
        <p className="mt-1 text-xs text-slate-500">15+ endpoints · Authentification JWT · RBAC · Rate limiting</p>
      </div>
      <div className="card overflow-hidden divide-y divide-slate-200 dark:divide-slate-800">
        {endpoints.map((e, i) => (
          <div key={i} className="flex items-center gap-2 p-3 text-xs">
            <span className={`shrink-0 rounded-md ${e.color} px-2 py-0.5 text-[10px] font-bold text-white`}>
              {e.method}
            </span>
            <code className="flex-1 truncate font-mono text-slate-700 dark:text-slate-300">{e.path}</code>
            <span className="hidden text-[10px] text-slate-500 sm:inline">{e.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DDDTab() {
  const contexts = [
    { name: 'Auth & Identity', desc: 'users, roles, permissions, sessions', color: 'from-violet-500 to-purple-600' },
    { name: 'Catalog', desc: 'parts, categories, vehicles, compatibilités', color: 'from-indigo-500 to-blue-600' },
    { name: 'Inventory', desc: 'suppliers, stocks, movements, alerts', color: 'from-emerald-500 to-teal-600' },
    { name: 'Reservation', desc: 'panier, bookings, lifecycle, events', color: 'from-amber-500 to-orange-600' },
    { name: 'Notification', desc: 'push, email, sms, templates', color: 'from-rose-500 to-pink-600' },
    { name: 'Billing', desc: 'payments, invoices, mobile money', color: 'from-cyan-500 to-sky-600' },
  ];
  return (
    <div className="space-y-3">
      <div className="card p-4">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Domain Driven Design</h3>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          6 Bounded Contexts · Aggregates · Value Objects · Domain Events
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {contexts.map((c) => (
          <div key={c.name} className="card p-3">
            <div className={`inline-flex h-1.5 w-12 rounded-full bg-gradient-to-r ${c.color}`} />
            <h4 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">{c.name}</h4>
            <p className="mt-0.5 text-[11px] text-slate-500">{c.desc}</p>
          </div>
        ))}
      </div>
      <div className="card p-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">MongoDB Collections (11)</h4>
        <div className="grid grid-cols-3 gap-1 text-[10px] sm:grid-cols-4">
          {['users','vehicles','suppliers','categories','parts','inventories','reservations','notifications','settings','audits','uploads'].map((c) => (
            <div key={c} className="rounded-lg bg-slate-100 px-2 py-1.5 font-mono text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {c}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RoadmapTab() {
  const phases = [
    {
      tag: 'MVP v1', color: 'from-emerald-500 to-teal-600', current: true,
      items: ['Auth JWT + OTP', 'Catalogue & recherche', 'Réservations', 'Notifications push', 'Backoffice admin', 'Mode mock pour tests'],
    },
    {
      tag: 'Phase 2', color: 'from-amber-500 to-orange-600',
      items: ['Marketplace multi-vendeurs', 'Paiements Mobile Money / Stripe', 'Livraison & tracking GPS', 'Chat support intégré', 'Recommandations IA'],
    },
    {
      tag: 'Phase 3', color: 'from-violet-500 to-fuchsia-600',
      items: ['Intégration ERP', 'Multi-pays (XOF/EUR/USD)', 'API publique B2B', 'Programme de fidélité', 'App native iOS/Android via Capacitor'],
    },
  ];
  return (
    <div className="space-y-3">
      {phases.map((p) => (
        <div key={p.tag} className="card relative overflow-hidden p-4">
          <div className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${p.color} px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white`}>
            {p.current && <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
            {p.tag} {p.current && '· Live'}
          </div>
          <ul className="mt-3 space-y-1.5">
            {p.items.map((it) => (
              <li key={it} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200">
                <Activity className="h-3 w-3 text-indigo-500" />
                {it}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="card p-4 text-center">
        <Globe className="mx-auto h-8 w-8 text-indigo-600" />
        <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">Marché cible</h3>
        <p className="mt-1 text-xs text-slate-500">Afrique francophone d'abord (CIV, SEN, CMR) · Expansion internationale</p>
      </div>
    </div>
  );
}
