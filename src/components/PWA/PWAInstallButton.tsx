import React, { useState } from 'react';
import { Download, Smartphone, X, Check, Laptop } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'taskbar' | 'button' | 'settings' | 'startmenu';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'button',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showGenericGuide, setShowGenericGuide] = useState(false);

  // If already running inside standalone PWA mode, hide install button
  if (isInstalled) {
    if (variant === 'settings') {
      return (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <Check className="w-4 h-4" />
          <span>WinLite è già installato come Progressive Web App (PWA) sul dispositivo!</span>
        </div>
      );
    }
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      setShowGenericGuide(true);
    }
  };

  return (
    <>
      {variant === 'taskbar' ? (
        <button
          onClick={handleInstallClick}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600 border border-blue-500/40 text-blue-200 hover:text-white transition-all text-xs font-semibold min-h-[34px] shadow-xs ${className}`}
          title="Installa WinLite sul Tablet (PWA)"
        >
          <Download className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden md:inline">Installa PWA</span>
        </button>
      ) : variant === 'startmenu' ? (
        <button
          onClick={handleInstallClick}
          className={`w-full flex items-center justify-between p-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-400 hover:text-blue-300 transition-colors text-xs font-semibold ${className}`}
        >
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-4 h-4 text-blue-400" />
            <span>Installa WinLite sul Tablet (PWA)</span>
          </div>
          <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-md font-bold">
            Installa
          </span>
        </button>
      ) : variant === 'settings' ? (
        <div className="p-4 rounded-2xl border border-blue-500/30 bg-blue-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
              <Laptop className="w-4 h-4" />
              <span>Installa WinLite come App (PWA)</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Aggiungi l'OS alla schermata home del tablet per usarlo a schermo intero senza barre del browser e anche offline!
            </p>
          </div>
          <button
            onClick={handleInstallClick}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shrink-0 shadow-md min-h-[40px]"
          >
            <Download className="w-4 h-4" />
            <span>Installa Ora</span>
          </button>
        </div>
      ) : (
        <button
          onClick={handleInstallClick}
          className={`flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition ${className}`}
        >
          <Download className="w-4 h-4" />
          <span>Installa App</span>
        </button>
      )}

      {/* iOS Safari Guide Modal */}
      {showIOSGuide && (
        <div
          onClick={() => setShowIOSGuide(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 p-6 text-white shadow-2xl animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-blue-400 flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                <span>Installa su iPad / iPhone</span>
              </h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Su iPad e dispositivi Apple con Safari, segui questi 2 semplici passaggi:
            </p>
            <ol className="space-y-2.5 text-xs text-slate-200 mb-5 bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 text-[11px]">1</span>
                <span>Tocca il pulsante <strong>Condividi</strong> (icona quadrato con freccia in alto) nella barra di Safari.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 text-[11px]">2</span>
                <span>Scorri in basso e tocca <strong>"Aggiungi alla schermata Home"</strong>.</span>
              </li>
            </ol>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-600"
            >
              Ho capito
            </button>
          </div>
        </div>
      )}

      {/* Chrome / Generic Guide Modal */}
      {showGenericGuide && (
        <div
          onClick={() => setShowGenericGuide(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 p-6 text-white shadow-2xl animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-blue-400 flex items-center gap-2">
                <Download className="w-5 h-5" />
                <span>Installa sul tuo Tablet</span>
              </h3>
              <button
                onClick={() => setShowGenericGuide(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Puoi installare WinLite direttamente dalla barra del browser Chrome/Edge:
            </p>
            <div className="space-y-2 text-xs text-slate-200 mb-5 bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
              <p>
                1. Tocca i tre puntini <strong>⋮</strong> in alto a destra nel browser.
              </p>
              <p>
                2. Seleziona <strong>"Installa app"</strong> o <strong>"Aggiungi a schermata Home"</strong>.
              </p>
            </div>
            <button
              onClick={() => setShowGenericGuide(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-600"
            >
              Chiudi
            </button>
          </div>
        </div>
      )}
    </>
  );
};
