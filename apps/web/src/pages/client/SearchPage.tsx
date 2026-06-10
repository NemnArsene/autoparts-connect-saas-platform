import { useMemo, useState } from 'react';
import { Search as SearchIcon, X, SlidersHorizontal, Star, Heart, MapPin, ShieldCheck, Zap, ChevronDown, Plus } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { PARTS, CATEGORIES, BRANDS, formatPrice } from '../../data/seed';
import { PartImage } from '../../components/PartImage';
import { PartCard } from './HomePage';

export function SearchPage() {
  const { searchQuery, setSearchQuery, setSelectedPart, setClientPage, favorites, toggleFavorite, addToCart } = useApp();
  const [activeCats, setActiveCats] = useState<string[]>([]);
  const [activeBrands, setActiveBrands] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState(90000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState<'pop' | 'price-asc' | 'price-desc' | 'rating'>('pop');

  const filtered = useMemo(() => {
    let r = PARTS;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      r = r.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.ref.toLowerCase().includes(q)
      );
    }
    if (activeCats.length) r = r.filter((p) => activeCats.includes(p.category));
    if (activeBrands.length) r = r.filter((p) => activeBrands.includes(p.brand));
    r = r.filter((p) => p.price <= priceMax);
    if (inStockOnly) r = r.filter((p) => p.inStock);

    if (sort === 'price-asc') r = [...r].sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') r = [...r].sort((a, b) => b.price - a.price);
    else if (sort === 'rating') r = [...r].sort((a, b) => b.rating - a.rating);
    return r;
  }, [searchQuery, activeCats, activeBrands, priceMax, inStockOnly, sort]);

  const displayed = filtered.slice(0, 60);

  const toggleCat = (id: string) => setActiveCats((c) => c.includes(id) ? c.filter((x) => x !== id) : [...c, id]);
  const toggleBrand = (b: string) => setActiveBrands((br) => br.includes(b) ? br.filter((x) => x !== b) : [...br, b]);
  const clearFilters = () => { setActiveCats([]); setActiveBrands([]); setPriceMax(90000); setInStockOnly(false); };

  return (
    <div className="animate-fade-in">
      {/* Search bar */}
      <div className="sticky top-0 z-20 -mx-4 mb-4 bg-slate-50/90 px-4 py-3 backdrop-blur-xl md:mx-0 md:bg-transparent md:px-0 md:backdrop-filter-none dark:bg-slate-950/90">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Plaquette de frein Toyota, filtre à huile…"
            className="input-base pl-11 pr-12"
            autoFocus
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-14 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="card mb-4 space-y-4 p-4 animate-slide-up">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Catégorie</h3>
              {(activeCats.length + activeBrands.length > 0 || priceMax < 90000 || inStockOnly) && (
                <button onClick={clearFilters} className="text-xs font-semibold text-rose-600">Réinitialiser</button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => toggleCat(c.id)}
                  className={`badge cursor-pointer transition ${
                    activeCats.includes(c.id)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {c.icon} {c.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-bold text-slate-900 dark:text-white">Marque véhicule</h3>
            <div className="flex flex-wrap gap-1.5">
              {BRANDS.map((b) => (
                <button
                  key={b}
                  onClick={() => toggleBrand(b)}
                  className={`badge cursor-pointer transition ${
                    activeBrands.includes(b)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-bold text-slate-900 dark:text-white">Prix max : <span className="text-indigo-600">{formatPrice(priceMax)}</span></h3>
            <input type="range" min={5000} max={100000} step={1000} value={priceMax} onChange={(e) => setPriceMax(+e.target.value)} className="w-full accent-indigo-600" />
          </div>
          <label className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
            <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="h-4 w-4 rounded text-indigo-600" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">En stock uniquement</span>
          </label>
        </div>
      )}

      {/* Sort + count */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-slate-500">
          <span className="font-bold text-slate-900 dark:text-white">{filtered.length.toLocaleString('fr-FR')}</span> résultats
          {filtered.length > 60 && <span className="ml-1 text-amber-600">(affichage des 60 premiers)</span>}
        </p>
        <div className="relative">
          <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="appearance-none rounded-lg border border-slate-200 bg-white px-3 py-1.5 pr-7 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800">
            <option value="pop">Pertinence</option>
            <option value="price-asc">Prix ↑</option>
            <option value="price-desc">Prix ↓</option>
            <option value="rating">Mieux notés</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {/* Results grid */}
      {displayed.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl">🔍</div>
          <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">Aucun résultat</h3>
          <p className="text-sm text-slate-500">Essayez d'autres termes ou ajustez les filtres.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {displayed.map((p) => (
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
      )}
    </div>
  );
}

export function PartDetailPage() {
  const { selectedPart, setClientPage, addToCart, toggleFavorite, favorites } = useApp();
  if (!selectedPart) {
    setClientPage('search');
    return null;
  }
  const cat = CATEGORIES.find((c) => c.id === selectedPart.category);
  const isFav = favorites.includes(selectedPart.id);

  return (
    <div className="animate-fade-in space-y-4 pb-24">
      <div className={`relative -mx-4 md:mx-0 md:rounded-3xl overflow-hidden bg-gradient-to-br ${selectedPart.image} md:aspect-[16/9] aspect-square md:aspect-auto`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <PartImage category={selectedPart.category} gradient={cat?.color || ''} size="xl" className="!h-48 !w-48 md:!h-64 md:!w-64" />
        </div>
        {selectedPart.isPromo && selectedPart.oldPrice && (
          <span className="absolute left-4 top-4 badge bg-rose-500 text-white">-{Math.round((1 - selectedPart.price/selectedPart.oldPrice)*100)}%</span>
        )}
        {selectedPart.isNew && <span className="absolute left-4 top-12 badge bg-emerald-500 text-white">Nouveau</span>}
        <button
          onClick={() => toggleFavorite(selectedPart.id)}
          className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full ${isFav ? 'bg-rose-500 text-white' : 'bg-white/90 text-slate-700'} shadow-lg`}
        >
          <Heart className={`h-5 w-5 ${isFav ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="card p-4 space-y-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{selectedPart.brand} · Réf {selectedPart.ref}</div>
          <h1 className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">{selectedPart.name}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{selectedPart.rating}</span>
            </div>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500">{selectedPart.reviews} avis</span>
            <span className="text-slate-400">·</span>
            <span className="badge bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              {selectedPart.inStock ? 'En stock' : 'Rupture'}
            </span>
          </div>
        </div>

        <div className="flex items-end gap-2">
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{formatPrice(selectedPart.price)}</div>
          {selectedPart.oldPrice && <div className="text-base text-slate-400 line-through">{formatPrice(selectedPart.oldPrice)}</div>}
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2">
          {[
            { icon: ShieldCheck, label: `Garantie ${selectedPart.warranty}` },
            { icon: Zap, label: 'Livraison 24h' },
            { icon: MapPin, label: selectedPart.supplierName },
          ].map((it) => {
            const Icon = it.icon;
            return (
              <div key={it.label} className="flex flex-col items-center gap-1 rounded-xl bg-slate-50 p-2 text-center dark:bg-slate-800/50">
                <Icon className="h-4 w-4 text-indigo-600" />
                <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 leading-tight">{it.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card p-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Compatibilité véhicules</h2>
        <div className="flex flex-wrap gap-1.5">
          {selectedPart.compatibleModels.map((m) => (
            <span key={m} className="badge bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
              {m}
            </span>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Description</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Pièce {selectedPart.name.toLowerCase()} de qualité premium compatible avec les véhicules {selectedPart.brand} sélectionnés. Testée et certifiée par nos experts. Installation recommandée par un professionnel agréé.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-slate-500">Référence</div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">{selectedPart.ref}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Stock disponible</div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">{selectedPart.stock} unités</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Garantie</div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">{selectedPart.warranty}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Fournisseur</div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">{selectedPart.supplierName}</div>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-20 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 p-3 backdrop-blur-xl md:bottom-0 dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl items-center gap-2">
          <button
            onClick={() => addToCart(selectedPart)}
            className="btn-secondary flex-1"
          >
            <Plus className="h-4 w-4" /> Panier
          </button>
          <button
            onClick={() => { addToCart(selectedPart); setClientPage('cart'); }}
            className="btn-primary flex-1"
          >
            Réserver maintenant
          </button>
        </div>
      </div>
    </div>
  );
}
