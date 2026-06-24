import { useState } from 'react';
import type { ReactNode } from 'react';

// =========================================================
// PartImage — Images dynamiques via Unsplash Source (gratuit)
// Style catalogue autodoc.com : isolé, fond blanc, studio
// =========================================================

interface Props {
  category: string;
  gradient: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  partName?: string;
}

// Mots-clés précis par catégorie → style catalogue professionnel
const CATEGORY_KEYWORDS: Record<string, string> = {
  freinage:        'brake+disc+rotor+isolated+white',
  moteur:          'car+engine+block+isolated+white+background',
  suspension:      'shock+absorber+strut+isolated+white',
  filtration:      'car+oil+filter+air+filter+isolated+white',
  electricite:     'car+alternator+isolated+white+background',
  transmission:    'clutch+disc+gearbox+isolated+white',
  carrosserie:     'car+bumper+panel+isolated+white+background',
  pneumatiques:    'car+tire+wheel+rim+isolated+white',
  eclairage:       'car+headlight+lamp+isolated+white+background',
  refroidissement: 'car+radiator+isolated+white+background',
  echappement:     'car+exhaust+muffler+isolated+white',
  lubrification:   'motor+oil+bottle+isolated+white+background',
};

// Icônes vectorielles de secours
const FALLBACK_ICONS: Record<string, ReactNode> = {
  freinage: (
    <g stroke="white" strokeWidth="2" fill="none" strokeLinecap="round">
      <circle cx="50" cy="50" r="26" /><circle cx="50" cy="50" r="16" />
      <circle cx="50" cy="50" r="6" fill="white" />
      <path d="M50 24 L50 18 M50 82 L50 76 M24 50 L18 50 M82 50 L76 50" strokeWidth="3" />
    </g>
  ),
  moteur: (
    <g stroke="white" strokeWidth="2" fill="none" strokeLinecap="round">
      <rect x="22" y="30" width="56" height="40" rx="3" />
      <path d="M22 40 L18 40 L18 60 L22 60" /><path d="M78 40 L82 40 L82 60 L78 60" />
      <line x1="32" y1="30" x2="32" y2="22" /><line x1="42" y1="30" x2="42" y2="20" />
      <line x1="52" y1="30" x2="52" y2="22" /><line x1="62" y1="30" x2="62" y2="20" />
      <circle cx="50" cy="50" r="6" fill="white" />
    </g>
  ),
  suspension: (
    <g stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round">
      <path d="M40 20 Q40 35 50 50 Q60 65 60 80" />
      <line x1="32" y1="20" x2="68" y2="20" strokeWidth="4" />
      <line x1="32" y1="80" x2="68" y2="80" strokeWidth="4" />
      <circle cx="50" cy="30" r="2" fill="white" /><circle cx="50" cy="70" r="2" fill="white" />
    </g>
  ),
  filtration: (
    <g stroke="white" strokeWidth="2" fill="none" strokeLinecap="round">
      <path d="M30 30 L70 30 L65 70 L35 70 Z" />
      <line x1="35" y1="40" x2="65" y2="40" /><line x1="36" y1="50" x2="64" y2="50" />
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
      <circle cx="50" cy="50" r="20" /><circle cx="50" cy="50" r="12" />
      <line x1="50" y1="30" x2="50" y2="38" strokeWidth="3" />
      <line x1="50" y1="62" x2="50" y2="70" strokeWidth="3" />
      <line x1="30" y1="50" x2="38" y2="50" strokeWidth="3" />
      <line x1="62" y1="50" x2="70" y2="50" strokeWidth="3" />
    </g>
  ),
  carrosserie: (
    <g stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 60 L20 50 L30 45 L70 45 L80 50 L85 60 L85 70 L15 70 Z" />
      <circle cx="28" cy="70" r="6" /><circle cx="72" cy="70" r="6" />
      <circle cx="28" cy="70" r="2" fill="white" /><circle cx="72" cy="70" r="2" fill="white" />
    </g>
  ),
  pneumatiques: (
    <g stroke="white" strokeWidth="2" fill="none">
      <circle cx="50" cy="50" r="26" /><circle cx="50" cy="50" r="14" />
      <circle cx="50" cy="50" r="4" fill="white" />
      <line x1="50" y1="24" x2="50" y2="36" strokeWidth="2.5" />
      <line x1="50" y1="64" x2="50" y2="76" strokeWidth="2.5" />
      <line x1="24" y1="50" x2="36" y2="50" strokeWidth="2.5" />
      <line x1="64" y1="50" x2="76" y2="50" strokeWidth="2.5" />
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
    </g>
  ),
  echappement: (
    <g stroke="white" strokeWidth="2" fill="none" strokeLinecap="round">
      <ellipse cx="40" cy="50" rx="14" ry="20" />
      <ellipse cx="40" cy="50" rx="6" ry="12" fill="white" />
      <line x1="54" y1="50" x2="80" y2="50" strokeWidth="6" />
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

const DYNAMIC_CATEGORY_IMAGES: Record<string, string> = {
  freinage:        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341',
  moteur:          'https://images.unsplash.com/photo-1486006920555-c77dce18193b',
  suspension:      'https://images.unsplash.com/photo-1616788494707-ec28f08d05a1',
  filtration:      'https://images.unsplash.com/photo-1486006920555-c77dce18193b',
  electricite:     'https://images.unsplash.com/photo-1552656967-7a0991a13906',
  transmission:    'https://images.unsplash.com/photo-1562620644-65ab4779728f',
  carrosserie:     'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf',
  pneumatiques:    'https://images.unsplash.com/photo-1552656967-7a0991a13906',
  eclairage:       'https://images.unsplash.com/photo-1606577924006-27d39b132ae2',
  refroidissement: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c',
  echappement:     'https://images.unsplash.com/photo-1506015391300-4802db74de2e',
  lubrification:   'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e',
};

function buildImageUrl(category: string, size: 'sm' | 'md' | 'lg' | 'xl'): string {
  const sizes: Record<string, string> = { sm: '200', md: '300', lg: '400', xl: '600' };
  const widthHeight = sizes[size] || '300';
  const baseUrl = DYNAMIC_CATEGORY_IMAGES[category] || 'https://images.unsplash.com/photo-1562620644-65ab4779728f';
  return `${baseUrl}?w=${widthHeight}&h=${widthHeight}&fit=crop&q=80`;
}

export function PartImage({ category, gradient, size = 'md', className = '', partName }: Props) {
  const sizes: Record<string, number> = { sm: 80, md: 120, lg: 180, xl: 260 };
  const px = sizes[size];
  const [imgFailed, setImgFailed] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-xl bg-white ${className}`}
      style={{ width: px, height: px, border: '1px solid #f1f5f9' }}
    >
      {/* Placeholder animé pendant le chargement */}
      {!imgLoaded && !imgFailed && (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} animate-pulse flex items-center justify-center`}>
          <svg viewBox="0 0 100 100" className="h-2/3 w-2/3 opacity-40">
            {FALLBACK_ICONS[category] || FALLBACK_ICONS.moteur}
          </svg>
        </div>
      )}

      {/* Image Unsplash */}
      {!imgFailed && (
        <img
          src={buildImageUrl(category, size)}
          alt={partName || category}
          className={`h-full w-full object-contain transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ background: 'white' }}
          onLoad={() => setImgLoaded(true)}
          onError={() => { setImgFailed(true); setImgLoaded(true); }}
          loading="lazy"
        />
      )}

      {/* Fallback SVG si Unsplash échoue */}
      {imgFailed && (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, white 0%, transparent 50%)' }} />
          <svg viewBox="0 0 100 100" className="relative h-full w-full p-3">
            {FALLBACK_ICONS[category] || FALLBACK_ICONS.moteur}
          </svg>
        </div>
      )}
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
