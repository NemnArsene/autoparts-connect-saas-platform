import { useState } from 'react';
import { Package, Bell, ShoppingCart, X, Check, Tag, Clock, Plus, Minus, ArrowRight, CreditCard, Smartphone, Wallet, User as UserIcon, Car as CarIcon, Heart, HelpCircle, Edit3, Camera, Phone, Mail, MapPin, Eye } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { formatPrice, relativeDate, RESERVATIONS, NOTIFICATIONS, VEHICLES, PARTS } from '../../data/seed';
import { StatusBadge } from '../../components/Shared';
import { PartImage } from '../../components/PartImage';

// ===================== RESERVATIONS =====================
export function ReservationsPage() {
  const { myReservations, setClientPage, setSelectedPart } = useApp();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tab, setTab] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');

  const list = tab === 'all' ? myReservations : myReservations.filter((r) => r.status === tab);

  if (myReservations.length === 0) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="card p-8 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-500/10 dark:to-violet-500/10">
            <Package className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Aucune réservation</h2>
          <p className="mt-1 text-sm text-slate-500">Vos réservations apparaîtront ici.</p>
          <button onClick={() => setClientPage('search')} className="btn-primary mt-4">
            Parcourir le catalogue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex gap-1 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'Toutes' },
          { id: 'pending', label: 'En attente' },
          { id: 'confirmed', label: 'Confirmées' },
          { id: 'completed', label: 'Terminées' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              tab === t.id ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {list.map((r) => (
          <div
            key={r.id}
            onClick={() => {
              const part = PARTS.find((p) => p.id === r.partId);
              if (part) { setSelectedPart(part); setClientPage('part-detail'); }
            }}
            className="card flex cursor-pointer gap-3 p-3 transition hover:shadow-md"
          >
            <PartImage category={PARTS.find((p) => p.id === r.partId)?.category || 'moteur'} gradient={r.partImage} size="sm" className="!h-20 !w-20" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="line-clamp-1 text-sm font-bold text-slate-900 dark:text-white">{r.partName}</h3>
                <StatusBadge status={r.status} />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{r.supplierName}</p>
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">Réf</div>
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{r.reference}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">Total</div>
                  <div className="text-sm font-extrabold text-indigo-600">{formatPrice(r.totalPrice)}</div>
                </div>
              </div>
              <div className="mt-1.5 text-[10px] text-slate-400">Réservé {relativeDate(r.createdAt)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===================== NOTIFICATIONS =====================
export function NotificationsPage() {
  const { notifRead, markNotifRead } = useApp();
  const [items, setItems] = useState(NOTIFICATIONS);

  const markAll = () => {
    setItems(items.map((i) => ({ ...i, read: true })));
  };

  const iconFor = (type: string) => {
    if (type === 'reservation') return <Check className="h-4 w-4" />;
    if (type === 'promo') return <Tag className="h-4 w-4" />;
    if (type === 'stock') return <Package className="h-4 w-4" />;
    return <Bell className="h-4 w-4" />;
  };

  const colorFor = (type: string) => {
    if (type === 'reservation') return 'from-emerald-500 to-teal-600';
    if (type === 'promo') return 'from-rose-500 to-pink-600';
    if (type === 'stock') return 'from-sky-500 to-blue-600';
    return 'from-amber-500 to-orange-600';
  };

  return (
    <div className="space-y-2 animate-fade-in">
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-slate-500">{items.filter((i) => !i.read).length} non lues</p>
        <button onClick={markAll} className="text-xs font-semibold text-indigo-600">Tout marquer comme lu</button>
      </div>
      {items.map((n) => {
        const isRead = notifRead.includes(n.id) || n.read;
        return (
          <div
            key={n.id}
            onClick={() => markNotifRead(n.id)}
            className={`card relative flex cursor-pointer gap-3 p-3 transition hover:shadow-md ${!isRead ? 'ring-2 ring-indigo-500/30' : ''}`}
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${colorFor(n.type)} text-white shadow-md`}>
              {iconFor(n.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{n.title}</h3>
                {!isRead && <span className="h-2 w-2 rounded-full bg-rose-500" />}
              </div>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{n.message}</p>
              <p className="mt-1 text-[10px] text-slate-400">{n.time}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ===================== CART =====================
export function CartPage() {
  const { cart, updateQty, removeFromCart, clearCart, setClientPage } = useApp();
  const total = cart.reduce((s, i) => s + i.part.price * i.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="card p-8 text-center animate-fade-in">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-500/10 dark:to-orange-500/10">
          <ShoppingCart className="h-8 w-8 text-amber-600" />
        </div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Panier vide</h2>
        <p className="mt-1 text-sm text-slate-500">Ajoutez des pièces depuis le catalogue.</p>
        <button onClick={() => setClientPage('search')} className="btn-primary mt-4">
          Parcourir le catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-fade-in pb-32">
      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-slate-500">{cart.length} article{cart.length > 1 ? 's' : ''}</p>
        <button onClick={clearCart} className="text-xs font-semibold text-rose-600">Vider</button>
      </div>

      <div className="space-y-2">
        {cart.map((it) => (
          <div key={it.part.id} className="card flex gap-3 p-3">
            <PartImage category={it.part.category} gradient={it.part.image} size="sm" className="!h-20 !w-20" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="line-clamp-2 text-sm font-bold text-slate-900 dark:text-white">{it.part.name}</h3>
                <button onClick={() => removeFromCart(it.part.id)} className="text-slate-400 hover:text-rose-500">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-slate-500">{it.part.brand} · Réf {it.part.ref}</p>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700">
                  <button onClick={() => updateQty(it.part.id, it.quantity - 1)} className="px-2 py-1 text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"><Minus className="h-3 w-3" /></button>
                  <span className="w-8 text-center text-xs font-bold">{it.quantity}</span>
                  <button onClick={() => updateQty(it.part.id, it.quantity + 1)} className="px-2 py-1 text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"><Plus className="h-3 w-3" /></button>
                </div>
                <div className="text-sm font-extrabold text-indigo-600">{formatPrice(it.part.price * it.quantity)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-4 space-y-2">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Récapitulatif</h3>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Sous-total</span>
          <span className="font-semibold">{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Frais de service</span>
          <span className="font-semibold text-emerald-600">Gratuit</span>
        </div>
        <div className="border-t border-slate-200 pt-2 dark:border-slate-800 flex justify-between">
          <span className="font-bold">Total</span>
          <span className="text-lg font-extrabold text-indigo-600">{formatPrice(total)}</span>
        </div>
      </div>

      <div className="fixed bottom-20 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 p-3 backdrop-blur-xl md:bottom-0 dark:border-slate-800 dark:bg-slate-950/95">
        <button
          onClick={() => setClientPage('checkout')}
          className="btn-primary w-full"
        >
          Passer à la réservation <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ===================== CHECKOUT =====================
export function CheckoutPage() {
  const { cart, addReservation, clearCart, setClientPage, user } = useApp();
  const total = cart.reduce((s, i) => s + i.part.price * i.quantity, 0);
  const [method, setMethod] = useState<'mobile' | 'card' | 'cash'>('mobile');
  const [confirmed, setConfirmed] = useState(false);

  const confirm = () => {
    cart.forEach((it) => {
      const ref = `APC-${10000 + Math.floor(Math.random() * 90000)}`;
      addReservation({
        id: `res-${Date.now()}-${it.part.id}`,
        userId: 'usr-self',
        partId: it.part.id,
        partName: it.part.name,
        partImage: it.part.image,
        supplierName: it.part.supplierName,
        quantity: it.quantity,
        totalPrice: it.part.price * it.quantity,
        status: 'pending',
        createdAt: new Date().toISOString(),
        pickupDate: new Date(Date.now() + 3 * 86400000).toISOString(),
        reference: ref,
      });
    });
    setConfirmed(true);
    setTimeout(() => { clearCart(); setClientPage('reservations'); }, 2200);
  };

  if (confirmed) {
    return (
      <div className="card flex flex-col items-center justify-center p-10 text-center animate-fade-in">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-lg">
          <Check className="h-10 w-10" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Réservation confirmée !</h2>
        <p className="mt-1 text-sm text-slate-500">Vous recevrez une notification dès que votre pièce sera prête.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in pb-32">
      <div className="card p-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Récapitulatif</h2>
        <div className="space-y-2">
          {cart.map((it) => (
            <div key={it.part.id} className="flex justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300">{it.part.name} × {it.quantity}</span>
              <span className="font-semibold">{formatPrice(it.part.price * it.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 border-t border-slate-200 pt-3 dark:border-slate-800 flex justify-between">
          <span className="font-bold">Total</span>
          <span className="text-lg font-extrabold text-indigo-600">{formatPrice(total)}</span>
        </div>
      </div>

      <div className="card p-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Mode de paiement</h2>
        <div className="space-y-2">
          {[
            { id: 'mobile', label: 'Mobile Money', desc: 'Orange, MTN, Moov, Wave', icon: Smartphone },
            { id: 'card', label: 'Carte bancaire', desc: 'Visa, Mastercard', icon: CreditCard },
            { id: 'cash', label: 'Paiement à la livraison', desc: 'Espèces à la réception', icon: Wallet },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => setMethod(m.id as any)}
                className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                  method === m.id
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
                }`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${method === m.id ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800'}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">{m.label}</div>
                  <div className="text-[11px] text-slate-500">{m.desc}</div>
                </div>
                <div className={`h-5 w-5 rounded-full border-2 ${method === m.id ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'} flex items-center justify-center`}>
                  {method === m.id && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="card p-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Informations de contact</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <UserIcon className="h-4 w-4 text-slate-400" />
            <span className="text-slate-700 dark:text-slate-300">{user?.name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-slate-400" />
            <span className="text-slate-700 dark:text-slate-300">{user?.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-slate-400" />
            <span className="text-slate-700 dark:text-slate-300">{user?.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-slate-400" />
            <span className="text-slate-700 dark:text-slate-300">Abidjan, Côte d'Ivoire</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-20 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 p-3 backdrop-blur-xl md:bottom-0 dark:border-slate-800 dark:bg-slate-950/95">
        <button onClick={confirm} className="btn-primary w-full">
          Confirmer la réservation · {formatPrice(total)}
        </button>
      </div>
    </div>
  );
}

// ===================== PROFILE =====================
export function ProfilePage() {
  const { user, setClientPage } = useApp();
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="card p-5 text-center">
        <div className="relative mx-auto">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-2xl font-extrabold text-white shadow-lg">
            {user?.avatar}
          </div>
          <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md dark:bg-slate-800">
            <Camera className="h-4 w-4 text-slate-600 dark:text-slate-300" />
          </button>
        </div>
        <h2 className="mt-3 text-lg font-extrabold text-slate-900 dark:text-white">{user?.name}</h2>
        <p className="text-xs text-slate-500">{user?.email}</p>
        <button className="btn-secondary mt-3">
          <Edit3 className="h-3.5 w-3.5" /> Modifier le profil
        </button>
      </div>

      <div className="card divide-y divide-slate-200 dark:divide-slate-800">
        {[
          { icon: CarIcon, label: 'Mes véhicules', page: 'vehicles', count: 3 },
          { icon: Package, label: 'Mes réservations', page: 'reservations', count: 12 },
          { icon: Heart, label: 'Mes favoris', page: 'favorites', count: 8 },
          { icon: Clock, label: 'Historique', page: 'history', count: 24 },
        ].map((it) => {
          const Icon = it.icon;
          return (
            <button
              key={it.label}
              onClick={() => setClientPage(it.page as any)}
              className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                <Icon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
              </div>
              <span className="flex-1 text-sm font-semibold text-slate-900 dark:text-white">{it.label}</span>
              <span className="badge bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">{it.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ===================== VEHICLES =====================
export function VehiclesPage() {
  const vehicles = VEHICLES.slice(0, 6);
  return (
    <div className="space-y-3 animate-fade-in">
      <button className="btn-primary w-full">
        <Plus className="h-4 w-4" /> Ajouter un véhicule
      </button>
      <div className="grid gap-3 md:grid-cols-2">
        {vehicles.map((v) => (
          <div key={v.id} className="card p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{v.brand} {v.model}</h3>
                <p className="text-xs text-slate-500">{v.year} · {v.color}</p>
                <p className="mt-1 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">{v.plate}</p>
              </div>
              {v.id === vehicles[0].id && (
                <span className="badge bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">Actif</span>
              )}
            </div>
            <div className="mt-3 flex gap-1">
              <button className="btn-ghost flex-1 text-xs"><Edit3 className="h-3 w-3" /> Modifier</button>
              <button className="btn-ghost flex-1 text-xs"><Eye className="h-3 w-3" /> Détails</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===================== FAVORITES =====================
export function FavoritesPage() {
  const { favorites, setSelectedPart, setClientPage, toggleFavorite, addToCart } = useApp();
  const favParts = PARTS.filter((p) => favorites.includes(p.id)).slice(0, 12);
  if (favParts.length === 0) {
    return (
      <div className="card p-8 text-center animate-fade-in">
        <Heart className="mx-auto h-12 w-12 text-rose-400" />
        <h2 className="mt-3 text-base font-bold text-slate-900 dark:text-white">Aucun favori</h2>
        <p className="text-sm text-slate-500">Ajoutez des pièces à vos favoris depuis le catalogue.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 animate-fade-in">
      {favParts.map((p) => (
        <div key={p.id} className="card relative p-3">
          <button onClick={() => toggleFavorite(p.id)} className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 text-white">
            <Heart className="h-3.5 w-3.5 fill-current" />
          </button>
          <div onClick={() => { setSelectedPart(p); setClientPage('part-detail'); }} className="cursor-pointer">
            <PartImage category={p.category} gradient={p.image} size="sm" className="!h-24 !w-full rounded-lg" />
            <h3 className="mt-2 line-clamp-2 text-xs font-bold text-slate-900 dark:text-white">{p.name}</h3>
            <p className="mt-0.5 text-[10px] text-slate-500">{p.brand}</p>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-sm font-extrabold text-indigo-600">{formatPrice(p.price)}</span>
              <button onClick={(e) => { e.stopPropagation(); addToCart(p); }} className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white">
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ===================== HISTORY =====================
export function HistoryPage() {
  const items = RESERVATIONS.slice(0, 15);
  return (
    <div className="space-y-2 animate-fade-in">
      {items.map((r) => (
        <div key={r.id} className="card flex items-center gap-3 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
            <Package className="h-5 w-5 text-slate-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="line-clamp-1 text-sm font-bold text-slate-900 dark:text-white">{r.partName}</h3>
            <p className="text-[11px] text-slate-500">{r.supplierName} · {relativeDate(r.createdAt)}</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{formatPrice(r.totalPrice)}</div>
            <StatusBadge status={r.status} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ===================== SETTINGS =====================
export function SettingsPage() {
  const { dark, toggleDark } = useApp();
  return (
    <div className="space-y-3 animate-fade-in">
      <div className="card divide-y divide-slate-200 dark:divide-slate-800">
        {[
          { label: 'Mode sombre', type: 'switch', value: dark, onChange: toggleDark },
          { label: 'Notifications push', type: 'switch', value: true, onChange: () => {} },
          { label: 'Notifications email', type: 'switch', value: true, onChange: () => {} },
          { label: 'Notifications SMS', type: 'switch', value: false, onChange: () => {} },
        ].map((it) => (
          <div key={it.label} className="flex items-center justify-between p-4">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{it.label}</span>
            <button
              onClick={it.onChange}
              className={`relative h-6 w-11 rounded-full transition ${it.value ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${it.value ? 'left-5' : 'left-0.5'}`} />
            </button>
          </div>
        ))}
      </div>
      <div className="card divide-y divide-slate-200 dark:divide-slate-800">
        <button className="flex w-full items-center justify-between p-4 text-left">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Langue</span>
          <span className="text-sm text-slate-500">Français</span>
        </button>
        <button className="flex w-full items-center justify-between p-4 text-left">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Devise</span>
          <span className="text-sm text-slate-500">XOF (FCFA)</span>
        </button>
        <button className="flex w-full items-center justify-between p-4 text-left">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Politique de confidentialité</span>
          <span className="text-sm text-slate-500">→</span>
        </button>
      </div>
    </div>
  );
}

// ===================== SUPPORT =====================
export function SupportPage() {
  return (
    <div className="space-y-3 animate-fade-in">
      <div className="card bg-gradient-to-br from-indigo-600 to-violet-600 p-5 text-white">
        <h2 className="text-lg font-extrabold">Besoin d'aide ?</h2>
        <p className="mt-1 text-sm opacity-90">Notre équipe est disponible 24/7</p>
      </div>
      <div className="card divide-y divide-slate-200 dark:divide-slate-800">
        {[
          { icon: Phone, label: 'Appeler le support', desc: '+225 27 22 49 30 00' },
          { icon: Mail, label: 'Email', desc: 'support@autoparts-connect.ci' },
          { icon: HelpCircle, label: 'Centre d\'aide', desc: 'FAQ et guides' },
          { icon: Bell, label: 'Signaler un problème', desc: 'Formulaire de contact' },
        ].map((it) => {
          const Icon = it.icon;
          return (
            <button key={it.label} className="flex w-full items-center gap-3 p-4 text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                <Icon className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-slate-900 dark:text-white">{it.label}</div>
                <div className="text-xs text-slate-500">{it.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
