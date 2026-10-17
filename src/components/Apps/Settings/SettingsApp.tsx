import React, { useState } from 'react';
import {
  Palette,
  Tablet,
  HardDrive,
  Download,
  RotateCcw,
  Sparkles,
  Check,
  Moon,
  Sun,
  Maximize2
} from 'lucide-react';
import { useOS } from '../../../context/OSContext';
import { DEFAULT_WALLPAPERS } from '../../../data/defaults';
import { PWAInstallButton } from '../../PWA/PWAInstallButton';

const ACCENT_COLORS = [
  { name: 'Windows Blu', value: '#0078d4' },
  { name: 'Smeraldo Nordico', value: '#059669' },
  { name: 'Viola Reale', value: '#7c3aed' },
  { name: 'Arancio Tramonto', value: '#ea580c' },
  { name: 'Rosa Magenta', value: '#db2777' },
  { name: 'Ciano Cyber', value: '#0891b2' }
];

export const SettingsApp: React.FC = () => {
  const { settings, updateSettings, storageUsedKB, exportAllBackup, toggleFullscreen, isFullscreen } = useOS();
  const [activeSection, setActiveSection] = useState<'personalization' | 'tablet' | 'storage'>('personalization');
  const [customWallpaperUrl, setCustomWallpaperUrl] = useState('');
  const [resetConfirm, setResetConfirm] = useState(false);

  const isDark = settings.theme === 'dark';

  const handleApplyCustomWallpaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (customWallpaperUrl.trim()) {
      updateSettings({ wallpaper: `url(${customWallpaperUrl.trim()}) center/cover no-repeat` });
      setCustomWallpaperUrl('');
    }
  };

  const handleClearData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className={`flex flex-col h-full ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      <div className="flex-1 flex overflow-hidden">
        {/* Settings Navigation Sidebar */}
        <div className={`w-48 sm:w-56 p-3 border-r flex flex-col shrink-0 text-xs ${
          isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-white border-slate-200'
        }`}>
          <div className="font-bold text-sm mb-3 px-2 flex items-center gap-2">
            <span>Impostazioni</span>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => setActiveSection('personalization')}
              className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-colors ${
                activeSection === 'personalization'
                  ? 'bg-blue-600 text-white font-medium shadow-xs'
                  : isDark ? 'text-slate-300 hover:bg-slate-700/50' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Personalizzazione</span>
            </button>

            <button
              onClick={() => setActiveSection('tablet')}
              className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-colors ${
                activeSection === 'tablet'
                  ? 'bg-blue-600 text-white font-medium shadow-xs'
                  : isDark ? 'text-slate-300 hover:bg-slate-700/50' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Tablet className="w-4 h-4" />
              <span>Esperienza Tablet</span>
            </button>

            <button
              onClick={() => setActiveSection('storage')}
              className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-colors ${
                activeSection === 'storage'
                  ? 'bg-blue-600 text-white font-medium shadow-xs'
                  : isDark ? 'text-slate-300 hover:bg-slate-700/50' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <HardDrive className="w-4 h-4" />
              <span>Memoria & Dati</span>
            </button>
          </div>

          <div className="mt-auto p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-400">
            <div className="font-semibold mb-0.5">WinLite OS v1.0</div>
            <div>Progettato per tablet con memoria ridotta.</div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-5 overflow-auto">
          {/* SECTION 1: Personalization */}
          {activeSection === 'personalization' && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h3 className="text-base font-bold mb-1">Personalizzazione Desktop</h3>
                <p className="text-xs text-slate-400">Cambia lo sfondo del desktop, il tema chiaro/scuro e il colore di accento.</p>
              </div>

              {/* Theme Selector */}
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200'}`}>
                <h4 className="text-xs font-semibold mb-2">Tema di Sistema</h4>
                <div className="grid grid-cols-2 gap-3 max-w-sm">
                  <button
                    onClick={() => updateSettings({ theme: 'dark' })}
                    className={`p-3 rounded-lg border flex items-center justify-center gap-2 text-xs font-medium transition-all ${
                      settings.theme === 'dark'
                        ? 'border-blue-500 bg-blue-500/10 text-blue-400 ring-2 ring-blue-500/30'
                        : isDark ? 'border-slate-700 bg-slate-900 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                    <span>Tema Scuro (Fluent)</span>
                  </button>

                  <button
                    onClick={() => updateSettings({ theme: 'light' })}
                    className={`p-3 rounded-lg border flex items-center justify-center gap-2 text-xs font-medium transition-all ${
                      settings.theme === 'light'
                        ? 'border-blue-500 bg-blue-500/10 text-blue-600 ring-2 ring-blue-500/30'
                        : isDark ? 'border-slate-700 bg-slate-900 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                    <span>Tema Chiaro</span>
                  </button>
                </div>
              </div>

              {/* Accent Color */}
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200'}`}>
                <h4 className="text-xs font-semibold mb-2">Colore di Accento</h4>
                <div className="flex flex-wrap gap-2.5">
                  {ACCENT_COLORS.map(acc => (
                    <button
                      key={acc.value}
                      onClick={() => updateSettings({ accentColor: acc.value })}
                      className="group flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-500/20 hover:border-slate-400 transition-all text-xs"
                    >
                      <span
                        className="w-4 h-4 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: acc.value }}
                      >
                        {settings.accentColor === acc.value && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </span>
                      <span>{acc.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Wallpapers Grid */}
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200'}`}>
                <h4 className="text-xs font-semibold mb-2">Sfondi Desktop Predefiniti</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {DEFAULT_WALLPAPERS.map(wp => (
                    <button
                      key={wp.id}
                      onClick={() => updateSettings({ wallpaper: wp.url })}
                      className={`h-24 rounded-xl border overflow-hidden p-2 flex flex-col justify-end text-left relative transition-all group ${
                        settings.wallpaper === wp.url ? 'ring-2 ring-blue-500 border-transparent shadow-md' : 'border-slate-500/30 hover:scale-[1.02]'
                      }`}
                      style={{ background: wp.previewUrl }}
                    >
                      <div className="bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] text-white font-medium truncate max-w-full">
                        {wp.name}
                      </div>
                      {settings.wallpaper === wp.url && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Custom Wallpaper URL */}
                <form onSubmit={handleApplyCustomWallpaper} className="mt-4 pt-3 border-t border-slate-500/10">
                  <label className="block text-xs font-semibold mb-1 text-slate-300">
                    O inserisci l'indirizzo di un'immagine online:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={customWallpaperUrl}
                      onChange={(e) => setCustomWallpaperUrl(e.target.value)}
                      placeholder="https://example.com/wallpaper.jpg"
                      className={`flex-1 px-3 py-1.5 text-xs rounded-lg border outline-none ${
                        isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      Imposta
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* SECTION 2: Tablet Experience */}
          {activeSection === 'tablet' && (
            <div className="max-w-2xl space-y-4">
              <div>
                <h3 className="text-base font-bold mb-1">Esperienza Tablet & Touch</h3>
                <p className="text-xs text-slate-400">Ottimizzazioni per schermi touch e dispositivi portatili.</p>
              </div>

              {/* PWA Install Banner */}
              <PWAInstallButton variant="settings" />

              <div className={`p-4 rounded-xl border space-y-4 ${isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold">Modalità Tablet Touch</h4>
                    <p className="text-[11px] text-slate-400">Aumenta le dimensioni delle icone sul desktop e i pulsanti della barra applicazioni per facilitare il tocco con le dita.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.tabletMode}
                    onChange={(e) => updateSettings({ tabletMode: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                  />
                </div>

                <div className="pt-3 border-t border-slate-500/10 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold">Tocco Singolo per Aprire le App</h4>
                    <p className="text-[11px] text-slate-400">Consente di aprire app e file con un solo tocco sul tablet, senza dover fare doppio tocco rapido.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.singleTapOpen}
                    onChange={(e) => updateSettings({ singleTapOpen: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                  />
                </div>

                <div className="pt-3 border-t border-slate-500/10 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold">Allineamento Icone Desktop</h4>
                    <p className="text-[11px] text-slate-400">Se hai spostato le icone e vuoi ripristinarle nella griglia ordinata iniziale.</p>
                  </div>
                  <button
                    onClick={() => updateSettings({ desktopIconPositions: {} })}
                    className="px-3 py-1.5 border border-slate-500/30 hover:bg-slate-500/10 rounded-lg text-xs font-medium transition-colors"
                  >
                    Allinea a Griglia
                  </button>
                </div>

                <div className="pt-3 border-t border-slate-500/10 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold">Schermo Intero (Fullscreen)</h4>
                    <p className="text-[11px] text-slate-400">Nasconde le barre del browser del tablet per un'esperienza nativa come un vero computer Windows.</p>
                  </div>
                  <button
                    onClick={toggleFullscreen}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>{isFullscreen ? 'Esci da Schermo Intero' : 'Attiva Schermo Intero'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: Storage & Data */}
          {activeSection === 'storage' && (
            <div className="max-w-2xl space-y-4">
              <div>
                <h3 className="text-base font-bold mb-1">Memoria & Archiviazione del Tablet</h3>
                <p className="text-xs text-slate-400">Tutti i dati risiedono localmente nel tuo browser. Nessun file pesante viene salvato sulla memoria fisica del tablet.</p>
              </div>

              <div className={`p-5 rounded-xl border space-y-4 ${isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">Spazio utilizzato da WinLite OS</div>
                    <div className="text-2xl font-bold font-mono text-emerald-400 mt-0.5">
                      {storageUsedKB} KB
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">
                    Consumo Memoria: Ultra Basso
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  A differenza delle app tradizionali che richiedono centinaia di megabyte (MB) o gigabyte (GB) di spazio, questo ambiente occupa solo pochi kilobyte (KB) nel browser, lasciando libera tutta la memoria del tuo tablet per altre attività!
                </p>

                <div className="pt-3 border-t border-slate-500/10 flex flex-wrap gap-2">
                  <button
                    onClick={exportAllBackup}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Scarica Backup di Sicurezza (JSON)</span>
                  </button>

                  <button
                    onClick={() => setResetConfirm(true)}
                    className="px-4 py-2 border border-red-500/40 hover:bg-red-500/10 text-red-400 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Ripristina Dati Iniziali</span>
                  </button>
                </div>

                {resetConfirm && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300">
                    <p className="font-semibold mb-2">Sei sicuro di voler cancellare tutti i documenti e le note salvate?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleClearData}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-medium"
                      >
                        Sì, cancella tutto
                      </button>
                      <button
                        onClick={() => setResetConfirm(false)}
                        className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded"
                      >
                        Annulla
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
