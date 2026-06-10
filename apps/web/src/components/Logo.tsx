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
        <svg viewBox="0 0 24 24" className="text-white" width={px * 0.6} height={px * 0.6} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" fill="white" />
          <path d="M12 1v6" />
          <path d="M12 17v6" />
          <path d="M4.22 4.22l4.24 4.24" />
          <path d="M15.54 15.54l4.24 4.24" />
          <path d="M1 12h6" />
          <path d="M17 12h6" />
          <path d="M4.22 19.78l4.24-4.24" />
          <path d="M15.54 8.46l4.24-4.24" />
        </svg>
        <div className="absolute -inset-0.5 -z-10 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 opacity-30 blur" />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-extrabold tracking-tight text-slate-900 dark:text-white ${text[size]}`}>
            AutoParts <span className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">Connect</span>
          </span>
          {size !== 'sm' && <span className="text-[10px] font-medium uppercase tracking-widest text-slate-500">Pièces & Services</span>}
        </div>
      )}
    </div>
  );
}
