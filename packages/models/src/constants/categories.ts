// ============================================================
// CATEGORIES CONSTANT
// Platform-agnostic — no DOM, no React
// ============================================================

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  color: string; // Tailwind gradient classes (web) or color token key (mobile)
}

export const CATEGORIES: Category[] = [
  { id: 'freinage',       name: 'Freinage',         icon: '🛑', count: 482, color: 'from-rose-500 to-red-600' },
  { id: 'moteur',         name: 'Moteur',            icon: '⚙️', count: 612, color: 'from-amber-500 to-orange-600' },
  { id: 'suspension',     name: 'Suspension',        icon: '🔧', count: 341, color: 'from-violet-500 to-purple-600' },
  { id: 'filtration',     name: 'Filtration',        icon: '💨', count: 298, color: 'from-sky-500 to-blue-600' },
  { id: 'electricite',    name: 'Électricité',       icon: '⚡', count: 524, color: 'from-yellow-500 to-amber-600' },
  { id: 'transmission',   name: 'Transmission',      icon: '🔄', count: 287, color: 'from-emerald-500 to-teal-600' },
  { id: 'carrosserie',    name: 'Carrosserie',       icon: '🚗', count: 412, color: 'from-pink-500 to-rose-600' },
  { id: 'pneumatiques',   name: 'Pneumatiques',      icon: '⭕', count: 198, color: 'from-slate-500 to-gray-700' },
  { id: 'eclairage',      name: 'Éclairage',         icon: '💡', count: 234, color: 'from-indigo-500 to-blue-700' },
  { id: 'refroidissement',name: 'Refroidissement',   icon: '❄️', count: 189, color: 'from-cyan-500 to-sky-600' },
  { id: 'echappement',    name: 'Échappement',       icon: '💨', count: 156, color: 'from-stone-500 to-zinc-700' },
  { id: 'lubrification',  name: 'Lubrification',     icon: '🛢️', count: 167, color: 'from-amber-600 to-yellow-700' },
];
