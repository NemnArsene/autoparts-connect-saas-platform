import { Search, MapPin, ShieldCheck, Sparkles, ChevronRight, TrendingUp, Star, Heart, Plus, Tag, Truck, Clock, Wrench } from 'lucide-react';
import { useApp, FEATURED_PARTS, POPULAR_PARTS } from '../../store/AppContext';
import { CATEGORIES, formatPrice, VEHICLES } from '../../data/seed';
import { PartImage } from '../../components/PartImage';

// =========================================================
// WhatsApp helper — ouvre directement l'app WhatsApp
// sans target='_blank' (basculement instantané)
// =========================================================
const WA_NUMBER = '237696567184';

export function openWhatsApp(productName: string, price: string) {
  const msg = encodeURIComponent(
    `Bonjour Autopart Connects, je veux ${productName} à ${price} FCFA`
  );
  window.location.href = `https://wa.me/${WA_NUMBER}?text=${msg}`;
}

// =========================================================
// Icône WhatsApp SVG inline
// =========================================================
function WhatsAppIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function HomePage() {
  const { setClientPage, setSelectedPart, setSearchQuery, favorites, toggleFavorite, addToCart, user } = useApp();
  const myVehicle = VEHICLES[0];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Greeting Hero — Cameroun */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-5 text-white shadow-2xl shadow-indigo-500/30">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2 text-xs font-medium opacity-90">
            <MapPin className="h-3.5 w-3.5" />
            <span>Yaoundé / Douala, Cameroun 🇨🇲</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold leading-tight">Bonjour {user?.name?.split(' ')[0]} 👋</h1>
          <p className="mt-1 text-sm opacity-90">Trouvez votre pièce auto en moins de 30 secondes</p>

          <button
            onClick={() => setClientPage('search')}
            className="mt-4 flex w-full items-center gap-3 rounded-2xl bg-white/15 px-4 py-3 text-left backdrop-blur transition hover:bg-white/25"
          >
            <Search className="h-5 w-5 opacity-80" />
            <span className="flex-1 text-sm opacity-90">Rechercher une pièce, marque, modèle…</span>
            <kbd className="hidden sm:inline-flex rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold">⌘K</kbd>
          </button>

          {/* Quick stats Cameroun */}
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-white/10 px-2 py-2 backdrop-blur">
              <div className="text-base font-extrabold">5000+</div>
              <div className="text-[10px] uppercase tracking-wider opacity-80">Pièces</div>
            </div>
            <div className="rounded-xl bg-white/10 px-2 py-2 backdrop-blur">
              <div className="text-base font-extrabold">25+</div>
              <div className="text-[10px] uppercase tracking-wider opacity-80">Fournisseurs</div>
            </div>
            <div className="rounded-xl bg-white/10 px-2 py-2 backdrop-blur">
              <div className="text-base font-extrabold">10</div>
              <div className="text-[10px] uppercase tracking-wider opacity-80">Villes CM</div>
            </div>
          </div>
        </div>
      </section>

      {/* My Vehicle Card */}
      <section className="card p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Mon véhicule</h2>
            <p className="text-xs text-slate-500">Pièces compatibles à portée de main</p>
          </div>
          <button onClick={() => setClientPage('vehicles')} className="text-xs font-semibold text-indigo-600">Gérer</button>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100 p-3 dark:from-slate-800/50 dark:to-slate-800/20">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-white">
            <Wrench className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="truncate text-sm font-bold text-slate-900 dark:text-white">{myVehicle.brand} {myVehicle.model}</div>
            <div className="text-xs text-slate-500">{myVehicle.year} · {myVehicle.plate} · {myVehicle.color}</div>
          </div>
          <span className="badge bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Actif
          </span>
        </div>
      </section>

      {/* Categories Grid */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Catégories</h2>
          <button onClick={() => setClientPage('search')} className="flex items-center gap-1 text-xs font-semibold text-indigo-600">
            Tout voir <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3 md:grid-cols-6">
          {CATEGORIES.slice(0, 8).map((c) => (
            <button
              key={c.id}
              onClick={() => { setSearchQuery(c.name); setClientPage('search'); }}
              className="group flex flex-col items-center gap-1.5"
            >
              <div className={`flex aspect-square w-full items-center justify-center rounded-2xl bg-gradient-to-br ${c.color} text-2xl shadow-md transition group-hover:scale-105 group-hover:shadow-lg`}>
                {c.icon}
              </div>
              <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 text-center line-clamp-1">{c.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Promo banner Cameroun */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 p-4 text-white shadow-lg">
        <div className="absolute -right-4 -top-4 text-6xl opacity-20">🔥</div>
        <div className="relative flex items-center gap-3">
          <Tag className="h-7 w-7" />
          <div className="flex-1">
            <div className="text-xs font-bold uppercase tracking-wider opacity-90">Offre limitée</div>
            <div className="text-base font-extrabold">-25% sur les filtres à huile</div>
            <div className="text-xs opacity-90">Jusqu'à dimanche · Code AUTO25</div>
          </div>
          <button onClick={() => { setSearchQuery('huile'); setClientPage('search'); }} className="rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-orange-600">
            Voir
          </button>
        </div>
      </section>

      {/* Featured Parts */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Nouveautés
            </h2>
            <p className="text-xs text-slate-500">Pièces récemment ajoutées</p>
          </div>
        </div>
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
          {FEATURED_PARTS.map((p) => (
            <PartCard
              key={p.id}
              part={p}
              onClick={() => { setSelectedPart(p); setClientPage('part-detail'); }}
              isFav={favorites.includes(p.id)}
              onFav={() => toggleFavorite(p.id)}
              onAdd={() => addToCart(p)}
            />
          ))}
        </div>
      </section>

      {/* Trending Parts */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Tendances
            </h2>
            <p className="text-xs text-slate-500">Les plus réservés cette semaine</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {POPULAR_PARTS.slice(0, 4).map((p) => (
            <PartCard
              key={p.id}
              part={p}
              onClick={() => { setSelectedPart(p); setClientPage('part-detail'); }}
              isFav={favorites.includes(p.id)}
              onFav={() => toggleFavorite(p.id)}
              onAdd={() => addToCart(p)}
            />
          ))}
        </div>
      </section>

      {/* Trust signals */}
      <section className="grid grid-cols-3 gap-2 pt-2">
        {[
          { icon: ShieldCheck, label: 'Pièces certifiées', color: 'text-emerald-600' },
          { icon: Truck, label: 'Livraison rapide', color: 'text-sky-600' },
          { icon: Clock, label: 'Support 24/7', color: 'text-violet-600' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card flex flex-col items-center gap-1 p-3 text-center">
              <Icon className={`h-5 w-5 ${s.color}`} />
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">{s.label}</span>
            </div>
          );
        })}
      </section>

      {/* Tech showcase */}
      <section className="card relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 text-white">
        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-indigo-300">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Autopart Connects — Plateforme Live
          </div>
          <h3 className="mt-2 text-lg font-extrabold">Stack technique 2026</h3>
          <p className="mt-1 text-xs opacity-80">React · NestJS 12 · MongoDB · Redis · PWA · Capacitor</p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-[10px]">
            {[
              { k: 'API Latency', v: '< 500ms' },
              { k: 'Lighthouse', v: '> 90' },
              { k: 'Uptime', v: '99.9%' },
              { k: 'Offline', v: '✓ IndexedDB' },
            ].map((m) => (
              <div key={m.k} className="rounded-lg bg-white/5 p-2 backdrop-blur">
                <div className="font-bold text-indigo-200">{m.v}</div>
                <div className="text-[9px] uppercase tracking-wider opacity-60">{m.k}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-4" />
    </div>
  );
}

// =========================================================
// PartCard — avec bouton WhatsApp vert #25D366
// =========================================================
export function PartCard({ part, onClick, isFav, onFav, onAdd, compact }: {
  part: any;
  onClick: () => void;
  isFav?: boolean;
  onFav?: () => void;
  onAdd?: () => void;
  compact?: boolean;
}) {
  const cat = CATEGORIES.find((c: any) => c.id === part.category);

  return (
    <div className={`group relative flex ${compact ? 'flex-row' : 'flex-col'} w-44 md:w-48 shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-xl hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900`}>
      <div onClick={onClick} className={`relative ${compact ? 'w-20' : ''}`}>
        <PartImage category={part.category} gradient={cat?.color || 'from-slate-500 to-slate-700'} size={compact ? 'sm' : 'md'} className="!w-full !h-32 rounded-none" partName={part.name} />
        {part.isPromo && part.oldPrice && (
          <span className="absolute left-2 top-2 badge bg-rose-500 text-white">-{Math.round((1 - part.price/part.oldPrice)*100)}%</span>
        )}
        {part.isNew && !part.isPromo && (
          <span className="absolute left-2 top-2 badge bg-emerald-500 text-white">Nouveau</span>
        )}
        {onFav && (
          <button
            onClick={(e) => { e.stopPropagation(); onFav(); }}
            className={`absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full ${isFav ? 'bg-rose-500 text-white' : 'bg-white/90 text-slate-600'} shadow-md transition hover:scale-110`}
          >
            <Heart className={`h-3.5 w-3.5 ${isFav ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>
      <div className="flex flex-1 flex-col p-2.5">
        <div onClick={onClick}>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{part.brand}</div>
          <h3 className="mt-0.5 line-clamp-2 text-xs font-bold text-slate-900 dark:text-white">{part.name}</h3>
          <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-500">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="font-semibold">{part.rating}</span>
            <span>({part.reviews})</span>
          </div>
          <div className="mt-1 flex items-end justify-between">
            <div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">{formatPrice(part.price)}</div>
              {part.oldPrice && <div className="text-[10px] text-slate-400 line-through">{formatPrice(part.oldPrice)}</div>}
            </div>
            {onAdd && (
              <button
                onClick={(e) => { e.stopPropagation(); onAdd(); }}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white shadow-md transition hover:bg-indigo-700"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ===== Bouton WhatsApp ===== */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            openWhatsApp(part.name, part.price);
          }}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl py-1.5 text-[11px] font-bold text-white transition hover:brightness-110 active:scale-95"
          style={{ backgroundColor: '#25D366' }}
          aria-label={`Commander ${part.name} via WhatsApp`}
        >
          <WhatsAppIcon className="h-3.5 w-3.5" />
          Commander via WA
        </button>
      </div>
    </div>
  );
}

// Export icon for reuse
export { WhatsAppIcon, openWhatsApp as openWA };
