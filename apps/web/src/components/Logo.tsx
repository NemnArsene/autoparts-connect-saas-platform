interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizes = { sm: 28, md: 36, lg: 48, xl: 64 };
  const text = { sm: 'text-sm', md: 'text-base', lg: 'text-xl', xl: 'text-2xl' };
  const px = sizes[size];
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 shadow-lg shadow-indigo-500/30"
        style={{ width: px, height: px }}
      >
        {/* Gear + Connector icon — Autopart Connects identity */}
        <svg viewBox="0 0 24 24" className="text-white" width={px * 0.62} height={px * 0.62} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" fill="white" stroke="none" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
        <div className="absolute -inset-0.5 -z-10 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 opacity-30 blur" />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-extrabold tracking-tight text-slate-900 dark:text-white ${text[size]}`}>
            Autopart <span className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">Connects</span>
          </span>
          {size !== 'sm' && <span className="text-[10px] font-medium uppercase tracking-widest text-slate-500">Cameroun 🇨🇲 · Pièces Auto</span>}
        </div>
      )}
    </div>
  );
}
