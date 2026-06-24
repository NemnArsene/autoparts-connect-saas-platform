import { useEffect, useState } from 'react';
import { X, Smartphone, LayoutDashboard, ChevronRight, Wifi, Bell, Download } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Logo } from './Logo';

// =========================================================
// Onboarding modal — premier lancement
// Explique les 2 applications et le concept PWA + Offline
// =========================================================
export function Onboarding() {
  const { setClientPage, setAdminPage } = useApp();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem('apc-onboarded')) {
      setTimeout(() => setOpen(true), 400);
    }
  }, []);

  const close = () => {
    localStorage.setItem('apc-onboarded', '1');
    setOpen(false);
  };

  if (!open) return null;

  const slides = [
    {
      icon: <Logo size="xl" showText={false} />,
      title: 'Bienvenue sur AutoParts Connect',
      desc: 'La première plateforme qui vous permet de trouver et réserver une pièce automobile en moins de 30 secondes.',
      cta: 'Découvrir',
    },
    {
      icon: <Smartphone className="h-12 w-12 text-indigo-600" />,
      title: 'Application Client (PWA)',
      desc: 'Recherchez, comparez et réservez vos pièces depuis votre smartphone. Fonctionne même hors-ligne grâce à l\'IndexedDB.',
      cta: 'Voir le client',
    },
    {
      icon: <LayoutDashboard className="h-12 w-12 text-slate-800" />,
      title: 'Backoffice Administration',
      desc: 'Pilotez l\'ensemble de la plateforme : utilisateurs, fournisseurs, stocks, statistiques,  et CMS.',
      cta: 'Voir l\'admin',
    },
    {
      icon: <Wifi className="h-12 w-12 text-emerald-600" />,
      title: 'PWA · Offline · Push',
      desc: 'Catalogue accessible hors-ligne, synchronisation automatique, notifications push, installable sur Android & iOS.',
      cta: 'Commencer',
    },
  ];

  const slide = slides[step];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-slide-up dark:bg-slate-900">
        <button onClick={close} className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300">
          <X className="h-4 w-4" />
        </button>

        {/* Decorative gradient */}
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 blur-2xl" />
        <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20 blur-2xl" />

        <div className="relative p-6">
          <div className="mb-5 flex flex-col items-center text-center">
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-500/10 dark:to-violet-500/10">
              {slide.icon}
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{slide.title}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-sm">{slide.desc}</p>
          </div>

          {/* PWA features highlights */}
          {step === 0 && (
            <div className="mb-5 grid grid-cols-3 gap-2">
              {[
                { icon: Wifi, label: 'Offline' },
                { icon: Bell, label: 'Push' },
                { icon: Download, label: 'Installable' },
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.label} className="flex flex-col items-center gap-1 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                    <Icon className="h-4 w-4 text-indigo-600" />
                    <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">{f.label}</span>
                  </div>
                );
              })}
            </div>
          )}

          {step === slides.length - 1 && (
            <div className="mb-5 space-y-2">
              <button
                onClick={() => { close(); setClientPage('home'); }}
                className="flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-4 text-white shadow-lg shadow-indigo-500/30 transition hover:shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <Smartphone className="h-6 w-6" />
                  <div className="text-left">
                    <div className="font-bold">Lancer la PWA Client</div>
                    <div className="text-[10px] opacity-80">Mobile · Tablet · Web</div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => { close(); setAdminPage('dashboard'); }}
                className="flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 p-4 text-white shadow-lg transition hover:shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="h-6 w-6" />
                  <div className="text-left">
                    <div className="font-bold">Ouvrir le Backoffice</div>
                    <div className="text-[10px] opacity-80">Dashboard · Analytics · Gestion</div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5" />
              </button>
              <p className="text-center text-[10px] text-slate-500 pt-2">
                Vous pourrez basculer à tout moment avec le bouton en bas à droite
              </p>
            </div>
          )}

          {step < slides.length - 1 && (
            <>
              <div className="mb-4 flex justify-center gap-1.5">
                {slides.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-indigo-600' : 'w-1.5 bg-slate-300 dark:bg-slate-700'}`} />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <button onClick={close} className="text-xs font-semibold text-slate-500">Passer</button>
                <button onClick={() => setStep((s) => s + 1)} className="btn-primary">
                  {slide.cta} <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </>
          )}

          {step === slides.length - 1 && (
            <button onClick={close} className="mt-1 w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-700">
              Fermer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// PWA install banner (simulated)
export function PWAInstallBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('apc-pwa-hint')) {
      setTimeout(() => setShow(true), 1500);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-24 left-4 right-20 z-30 max-w-sm md:left-auto md:right-24 md:bottom-6">
      <div className="card p-3 shadow-2xl shadow-indigo-500/20 ring-1 ring-indigo-500/20 animate-slide-up">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
            <Download className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-slate-900 dark:text-white">Installer l'app</div>
            <p className="text-[11px] text-slate-500">Ajoutez AutoParts Connect à votre écran d'accueil pour un accès rapide et hors-ligne.</p>
          </div>
          <button onClick={() => { setShow(false); localStorage.setItem('apc-pwa-hint', '1'); }} className="text-slate-400 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-2 flex gap-1">
          <button onClick={() => { setShow(false); localStorage.setItem('apc-pwa-hint', '1'); }} className="btn-ghost flex-1 text-xs">Plus tard</button>
          <button onClick={() => { setShow(false); localStorage.setItem('apc-pwa-hint', '1'); }} className="btn-primary flex-1 text-xs">Installer</button>
        </div>
      </div>
    </div>
  );
}
