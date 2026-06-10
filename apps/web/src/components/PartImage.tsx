import type { ReactNode } from 'react';

// =========================================================
// Composant "PartImage" — Génère des illustrations vectorielles
// distinctes par catégorie (au lieu de photos externes)
// =========================================================

interface Props {
  category: string;
  gradient: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const ICONS: Record<string, ReactNode> = {
  freinage: (
    <g stroke="white" strokeWidth="2" fill="none" strokeLinecap="round">
      <circle cx="50" cy="50" r="26" />
      <circle cx="50" cy="50" r="16" />
      <circle cx="50" cy="50" r="6" fill="white" />
      <path d="M50 24 L50 18 M50 82 L50 76 M24 50 L18 50 M82 50 L76 50" strokeWidth="3" />
    </g>
  ),
  moteur: (
    <g stroke="white" strokeWidth="2" fill="none" strokeLinecap="round">
      <rect x="22" y="30" width="56" height="40" rx="3" />
      <path d="M22 40 L18 40 L18 60 L22 60" />
      <path d="M78 40 L82 40 L82 60 L78 60" />
      <line x1="32" y1="30" x2="32" y2="22" />
      <line x1="42" y1="30" x2="42" y2="20" />
      <line x1="52" y1="30" x2="52" y2="22" />
      <line x1="62" y1="30" x2="62" y2="20" />
      <line x1="68" y1="30" x2="68" y2="22" />
      <circle cx="50" cy="50" r="6" fill="white" />
    </g>
  ),
  suspension: (
    <g stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round">
      <path d="M40 20 Q40 35 50 50 Q60 65 60 80" />
      <path d="M40 20 Q40 35 50 50 Q60 65 60 80" strokeDasharray="3,2" />
      <line x1="32" y1="20" x2="68" y2="20" strokeWidth="4" />
      <line x1="32" y1="80" x2="68" y2="80" strokeWidth="4" />
      <circle cx="50" cy="30" r="2" fill="white" />
      <circle cx="50" cy="70" r="2" fill="white" />
    </g>
  ),
  filtration: (
    <g stroke="white" strokeWidth="2" fill="none" strokeLinecap="round">
      <path d="M30 30 L70 30 L65 70 L35 70 Z" />
      <line x1="35" y1="40" x2="65" y2="40" />
      <line x1="36" y1="50" x2="64" y2="50" />
      <line x1="37" y1="60" x2="63" y2="60" />
    </g>
  ),
  electricite: (
    <g stroke="white" strokeWidth="2.5" fill="white" strokeLinecap="round" strokeLinejoin="round">
      <path d="M52 18 L30 52 L46 52 L42 82 L66 46 L50 46 Z" />
    </g>
  ),
  transmission: (
    <g stroke="white" strokeWidth="2" fill="none" strokeLinecap="round">
      <circle cx="50" cy="50" r="20" />
      <circle cx="50" cy="50" r="12" />
      <line x1="50" y1="30" x2="50" y2="38" strokeWidth="3" />
      <line x1="50" y1="62" x2="50" y2="70" strokeWidth="3" />
      <line x1="30" y1="50" x2="38" y2="50" strokeWidth="3" />
      <line x1="62" y1="50" x2="70" y2="50" strokeWidth="3" />
      <line x1="36" y1="36" x2="42" y2="42" strokeWidth="3" />
      <line x1="58" y1="58" x2="64" y2="64" strokeWidth="3" />
      <line x1="64" y1="36" x2="58" y2="42" strokeWidth="3" />
      <line x1="36" y1="64" x2="42" y2="58" strokeWidth="3" />
    </g>
  ),
  carrosserie: (
    <g stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 60 L20 50 L30 45 L70 45 L80 50 L85 60 L85 70 L15 70 Z" />
      <circle cx="28" cy="70" r="6" />
      <circle cx="72" cy="70" r="6" />
      <circle cx="28" cy="70" r="2" fill="white" />
      <circle cx="72" cy="70" r="2" fill="white" />
    </g>
  ),
  pneumatiques: (
    <g stroke="white" strokeWidth="2" fill="none">
      <circle cx="50" cy="50" r="26" />
      <circle cx="50" cy="50" r="14" />
      <circle cx="50" cy="50" r="4" fill="white" />
      <line x1="50" y1="24" x2="50" y2="36" strokeWidth="2.5" />
      <line x1="50" y1="64" x2="50" y2="76" strokeWidth="2.5" />
      <line x1="24" y1="50" x2="36" y2="50" strokeWidth="2.5" />
      <line x1="64" y1="50" x2="76" y2="50" strokeWidth="2.5" />
      <line x1="32" y1="32" x2="40" y2="40" strokeWidth="2.5" />
      <line x1="60" y1="60" x2="68" y2="68" strokeWidth="2.5" />
      <line x1="68" y1="32" x2="60" y2="40" strokeWidth="2.5" />
      <line x1="40" y1="60" x2="32" y2="68" strokeWidth="2.5" />
    </g>
  ),
  eclairage: (
    <g stroke="white" strokeWidth="2" fill="none" strokeLinecap="round">
      <path d="M30 35 L62 35 L68 55 L62 70 L30 70 Z" />
      <circle cx="44" cy="52" r="6" fill="white" />
      <line x1="48" y1="52" x2="60" y2="52" strokeWidth="3" />
    </g>
  ),
  refroidissement: (
    <g stroke="white" strokeWidth="2" fill="none" strokeLinecap="round">
      <path d="M30 30 L30 70 M40 30 L40 70 M50 30 L50 70 M60 30 L60 70 M70 30 L70 70" />
      <line x1="22" y1="30" x2="78" y2="30" strokeWidth="3" />
      <line x1="22" y1="70" x2="78" y2="70" strokeWidth="3" />
      <path d="M30 20 L34 26 L40 20 L44 26 L50 20 L54 26 L60 20 L64 26 L70 20" strokeWidth="2.5" />
    </g>
  ),
  echappement: (
    <g stroke="white" strokeWidth="2" fill="none" strokeLinecap="round">
      <ellipse cx="40" cy="50" rx="14" ry="20" />
      <ellipse cx="40" cy="50" rx="6" ry="12" fill="white" />
      <line x1="54" y1="50" x2="80" y2="50" strokeWidth="6" />
      <line x1="80" y1="50" x2="78" y2="46" strokeWidth="3" />
      <line x1="80" y1="50" x2="78" y2="54" strokeWidth="3" />
    </g>
  ),
  lubrification: (
    <g stroke="white" strokeWidth="2" fill="none" strokeLinecap="round">
      <path d="M50 20 L50 35 L40 40 L40 75 Q40 80 50 80 Q60 80 60 75 L60 40 L50 35 Z" fill="white" fillOpacity="0.15" />
      <path d="M44 55 Q50 52 56 55 Q50 58 44 55" fill="white" />
      <path d="M44 65 Q50 62 56 65 Q50 68 44 65" fill="white" />
    </g>
  ),
};

export function PartImage({ category, gradient, size = 'md', className = '' }: Props) {
  const sizes = { sm: 80, md: 120, lg: 180, xl: 260 };
  const px = sizes[size];
  const style: { width: number; height: number } = { width: px, height: px };

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-xl bg-gradient-to-br ${gradient} ${className}`}
      style={style}
    >
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, white 0%, transparent 50%)' }} />
      <svg viewBox="0 0 100 100" className="relative h-full w-full p-3">
        {ICONS[category] || ICONS.moteur}
      </svg>
    </div>
  );
}

export function BrandLogo({ letter, gradient }: { letter: string; gradient?: string }) {
  return (
    <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${gradient || 'from-indigo-500 to-violet-600'} text-sm font-bold text-white shadow-sm`}>
      {letter}
    </div>
  );
}
