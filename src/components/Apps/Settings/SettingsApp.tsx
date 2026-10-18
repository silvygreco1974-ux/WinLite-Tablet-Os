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
  Maximize2,
  Pipette,
  Type,
  Eye
} from 'lucide-react';
import { useOS } from '../../../context/OSContext';
import { DEFAULT_WALLPAPERS } from '../../../data/defaults';
import { PWAInstallButton } from '../../PWA/PWAInstallButton';
import { FontSizeScale } from '../../../types/os';

const ACCENT_COLORS = [
  { name: 'Windows Blu', value: '#0078d4' },
  { name: 'Cobalto Elettrico', value: '#2563eb' },
  { name: 'Smeraldo Nordico', value: '#059669' },
  { name: 'Menta Marina', value: '#0d9488' },
  { name: 'Viola Fluido', value: '#7c3aed' },
  { name: 'Iris Notturno', value: '#4f46e5' },
  { name: 'Rosa Magenta', value: '#db2777' },
  { name: 'Rosso Rubino', value: '#dc2626' },
  { name: 'Arancio Tramonto', value: '#ea580c' },
  { name: 'Ambra Dorata', value: '#d97706' },
  { name: 'Ciano Cyber', value: '#0891b2' },
  { name: 'Grigio Grafite', value: '#475569' }
];

export const SettingsApp: React.FC = () => {
  const { settings, updateSettings, storageUsedKB, exportAllBackup, toggleFullscreen, isFullscreen } = useOS();
  const [activeSection, setActiveSection] = useState<'personalization' | 'typography' | 'tablet' | 'storage'>('typography');
  const [customWallpaperUrl, setCustomWallpaperUrl] = useState('');
  const [customAccentInput, setCustomAccentInput] = useState(settings.accentColor || '#0078d4');
  const [resetConfirm, setResetConfirm] = useState(false);

  const isDark = settings.theme === 'dark';
  const currentAccent = settings.accentColor || '#0078d4';
  const currentScale: FontSizeScale = settings.fontSizeScale || 'large';

  const handleApplyCustomWallpaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (customWallpaperUrl.trim()) {
      updateSettings({ wallpaper: `url(${customWallpaperUrl.trim()}) center/cover no-repeat` });
      setCustomWallpaperUrl('');
    }
  };

  const handleApplyCustomAccent = (colorHex: string) => {
    setCustomAccentInput(colorHex);
    updateSettings({ accentColor: colorHex });
  };

  const handleClearData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className={`flex flex-col h-full select-none ${isDark ? 'bg-[#1c212d] text-[#e2e8f0]' : 'bg-[#ffffff] text-[#1e293b]'}`}>
      <div className="flex-1 flex overflow-hidden">
        {/* Settings Navigation Sidebar */}
        <div className={`w-52 sm:w-60 p-3.5 border-r flex flex-col shrink-0 text-sm ${
          isDark ? 'bg-[#242a38]/70 border-[#343e52]' : 'bg-[#f8fafc] border-[#e2e8f0] text-slate-800'
        }`}>
          <div className="font-bold text-base mb-4 px-2 flex items-center gap-2">
            <span>Impostazioni</span>
          </div>

          <div className="space-y-1.5">
            {/* Comfort Visivo & Font */}
            <button
              onClick={() => setActiveSection('typography')}
              style={{
                backgroundColor: activeSection === 'typography' ? currentAccent : undefined
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors font-medium min-h-[42px] ${
                activeSection === 'typography'
                  ? 'text-white shadow-sm'
                  : isDark ? 'text-slate-300 hover:bg-[#343e52]/60' : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <Eye className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Comfort Visivo & Font</span>
            </button>

            {/* Personalizzazione Desktop */}
            <button
              onClick={() => setActiveSection('personalization')}
              style={{
                backgroundColor: activeSection === 'personalization' ? currentAccent : undefined
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors font-medium min-h-[42px] ${
                activeSection === 'personalization'
                  ? 'text-white shadow-sm'
                  : isDark ? 'text-slate-300 hover:bg-[#343e52]/60' : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <Palette className="w-4 h-4 shrink-0" />
              <span>Personalizzazione</span>
            </button>

            {/* Esperienza Tablet */}
            <button
              onClick={() => setActiveSection('tablet')}
              style={{
                backgroundColor: activeSection === 'tablet' ? currentAccent : undefined
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors font-medium min-h-[42px] ${
                activeSection === 'tablet'
                  ? 'text-white shadow-sm'
                  : isDark ? 'text-slate-300 hover:bg-[#343e52]/60' : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <Tablet className="w-4 h-4 shrink-0" />
              <span>Esperienza Tablet</span>
            </button>

            {/* Memoria & Dati */}
            <button
              onClick={() => setActiveSection('storage')}
              style={{
                backgroundColor: activeSection === 'storage' ? currentAccent : undefined
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors font-medium min-h-[42px] ${
                activeSection === 'storage'
                  ? 'text-white shadow-sm'
                  : isDark ? 'text-slate-300 hover:bg-[#343e52]/60' : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <HardDrive className="w-4 h-4 shrink-0" />
              <span>Memoria & Dati</span>
            </button>
          </div>

          <div
            className="mt-auto p-3 rounded-xl border text-xs"
            style={{
              backgroundColor: isDark ? 'rgba(0,0,0,0.25)' : '#ffffff',
              borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
            }}
          >
            <div className="font-bold mb-0.5" style={{ color: currentAccent }}>WinLite Tablet OS</div>
            <div className={isDark ? 'text-slate-400' : 'text-slate-500'}>Ottimizzato per il riposo visivo e l'uso touch.</div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-5 md:p-7 overflow-auto">
          {/* SECTION: Typography & Visual Comfort */}
          {activeSection === 'typography' && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-1">Comfort Visivo & Dimensione Caratteri</h3>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Personalizza la dimensione dei font e il contrasto visivo per proteggere gli occhi e leggere comodamente senza sforzo.
                </p>
              </div>

              {/* Font Size Scaling Options */}
              <div className={`p-5 rounded-2xl border shadow-sm ${isDark ? 'bg-[#242a38] border-[#364154]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}>
                <h4 className="text-xs font-bold mb-3 uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  <span>Dimensione Caratteri di Sistema</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  {/* Normal (15px) */}
                  <button
                    onClick={() => updateSettings({ fontSizeScale: 'normal' })}
                    style={{
                      borderColor: currentScale === 'normal' ? currentAccent : undefined,
                      boxShadow: currentScale === 'normal' ? `0 0 0 2px ${currentAccent}` : undefined
                    }}
                    className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      currentScale === 'normal'
                        ? isDark ? 'bg-[#2f374a] text-white' : 'bg-white text-slate-900 shadow-sm'
                        : isDark ? 'border-[#364154] bg-[#1c212d] text-slate-300 hover:border-slate-500' : 'border-[#e2e8f0] bg-white text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <span className="text-sm font-semibold">Normale</span>
                    <span className="text-xs text-slate-400">15px · Compatto</span>
                  </button>

                  {/* Large (16.5px) */}
                  <button
                    onClick={() => updateSettings({ fontSizeScale: 'large' })}
                    style={{
                      borderColor: currentScale === 'large' ? currentAccent : undefined,
                      boxShadow: currentScale === 'large' ? `0 0 0 2px ${currentAccent}` : undefined
                    }}
                    className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all relative ${
                      currentScale === 'large'
                        ? isDark ? 'bg-[#2f374a] text-white' : 'bg-white text-slate-900 shadow-sm'
                        : isDark ? 'border-[#364154] bg-[#1c212d] text-slate-300 hover:border-slate-500' : 'border-[#e2e8f0] bg-white text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <span className="text-base font-bold">Grande</span>
                    <span className="text-xs text-emerald-500 font-medium">Consigliato</span>
                  </button>

                  {/* Huge (18.5px) */}
                  <button
                    onClick={() => updateSettings({ fontSizeScale: 'huge' })}
                    style={{
                      borderColor: currentScale === 'huge' ? currentAccent : undefined,
                      boxShadow: currentScale === 'huge' ? `0 0 0 2px ${currentAccent}` : undefined
                    }}
                    className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      currentScale === 'huge'
                        ? isDark ? 'bg-[#2f374a] text-white' : 'bg-white text-slate-900 shadow-sm'
                        : isDark ? 'border-[#364154] bg-[#1c212d] text-slate-300 hover:border-slate-500' : 'border-[#e2e8f0] bg-white text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <span className="text-lg font-bold">Molto Grande</span>
                    <span className="text-xs text-slate-400">18.5px · Massimo Riposo</span>
                  </button>
                </div>

                {/* Live Preview Box */}
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#1c212d] border-[#364154]' : 'bg-white border-[#e2e8f0]'}`}>
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">
                    Anteprima Leggibilità Testo
                  </div>
                  <h5 className="font-bold text-base mb-1">
                    WinLite Tablet OS con Antiriflesso
                  </h5>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Questo testo di esempio mostra la chiarezza dei caratteri, la spaziatura rilassata e l'assenza di contrasti accecanti. I tuoi occhi possono leggere a lungo senza affaticamento.
                  </p>
                </div>
              </div>

              {/* Eye Comfort Features Guide */}
              <div className={`p-5 rounded-2xl border space-y-3.5 shadow-sm ${isDark ? 'bg-[#242a38] border-[#364154]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Perché questo design è pensato per occhi umani
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-normal">
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#1c212d] border-[#364154]' : 'bg-white border-[#e2e8f0]'}`}>
                    <div className="font-bold text-sm mb-1 text-blue-400">Zero Bianco Accecante</div>
                    <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                      Nel tema scuro il testo usa tonalità ardesia morbide e delicate (#e2e8f0), evitando il bagliore tagliente del bianco puro al 100%.
                    </p>
                  </div>

                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#1c212d] border-[#364154]' : 'bg-white border-[#e2e8f0]'}`}>
                    <div className="font-bold text-sm mb-1 text-emerald-400">Zero Grigio Smorto</div>
                    <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                      Nel tema chiaro le superfici sono avorio e porcellana luminosa, con testo in inchiostro scuro ad alto contrasto per la massima nitidezza.
                    </p>
                  </div>

                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#1c212d] border-[#364154]' : 'bg-white border-[#e2e8f0]'}`}>
                    <div className="font-bold text-sm mb-1 text-amber-400">Editor con Carta Naturale</div>
                    <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                      Nell'Editor di Testo il foglio è Bianco Naturale antiriflesso (#FAF8F5) e offre stili Seppia e Verde Salvia da riposo.
                    </p>
                  </div>

                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#1c212d] border-[#364154]' : 'bg-white border-[#e2e8f0]'}`}>
                    <div className="font-bold text-sm mb-1 text-purple-400">Codice Colorato e Vivace</div>
                    <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                      In Code Studio la sintassi è evidenziata con colori vivaci (verde smeraldo, viola, oro, arancio) per distinguere ogni elemento all'istante.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 1: Personalization */}
          {activeSection === 'personalization' && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-1">Personalizzazione Desktop & Colori</h3>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Cambia lo sfondo del desktop, il tema chiaro/scuro e il colore di accento di sistema.
                </p>
              </div>

              {/* Theme Selector */}
              <div className={`p-5 rounded-2xl border shadow-sm ${isDark ? 'bg-[#242a38] border-[#364154]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}>
                <h4 className="text-xs font-bold mb-3 uppercase tracking-wider text-slate-400">Tema di Sistema</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
                  <button
                    onClick={() => updateSettings({ theme: 'dark' })}
                    style={{
                      borderColor: settings.theme === 'dark' ? currentAccent : undefined,
                      boxShadow: settings.theme === 'dark' ? `0 0 0 2px ${currentAccent}` : undefined
                    }}
                    className={`p-4 rounded-xl border flex items-center justify-center gap-2.5 text-sm font-semibold transition-all ${
                      settings.theme === 'dark'
                        ? 'bg-[#2f374a] text-white shadow-sm'
                        : isDark ? 'border-[#364154] bg-[#1c212d] text-slate-300' : 'border-[#e2e8f0] bg-white text-slate-700'
                    }`}
                  >
                    <Moon className="w-5 h-5 text-amber-300" />
                    <span>Scuro Riposo Occhi (Morbido)</span>
                  </button>

                  <button
                    onClick={() => updateSettings({ theme: 'light' })}
                    style={{
                      borderColor: settings.theme === 'light' ? currentAccent : undefined,
                      boxShadow: settings.theme === 'light' ? `0 0 0 2px ${currentAccent}` : undefined
                    }}
                    className={`p-4 rounded-xl border flex items-center justify-center gap-2.5 text-sm font-semibold transition-all ${
                      settings.theme === 'light'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : isDark ? 'border-[#364154] bg-[#1c212d] text-slate-300' : 'border-[#e2e8f0] bg-white text-slate-700'
                    }`}
                  >
                    <Sun className="w-5 h-5 text-amber-500" />
                    <span>Chiaro Naturale (Luminoso)</span>
                  </button>
                </div>
              </div>

              {/* Accent Color Section */}
              <div className={`p-5 rounded-2xl border shadow-sm ${isDark ? 'bg-[#242a38] border-[#364154]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Colore di Accento</h4>
                    <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Applicato istantaneamente a finestre, pulsanti, barre e indicatori del sistema.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full shadow-xs" style={{ backgroundColor: currentAccent }} />
                    <span className="font-mono text-xs font-semibold uppercase">{currentAccent}</span>
                  </div>
                </div>

                {/* Preset Colors Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
                  {ACCENT_COLORS.map(acc => {
                    const isSelected = currentAccent.toLowerCase() === acc.value.toLowerCase();
                    return (
                      <button
                        key={acc.value}
                        onClick={() => handleApplyCustomAccent(acc.value)}
                        style={{
                          borderColor: isSelected ? acc.value : undefined,
                          backgroundColor: isSelected ? (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)') : undefined
                        }}
                        className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all text-xs text-left ${
                          isSelected
                            ? 'font-bold ring-2'
                            : isDark ? 'border-[#364154] hover:border-slate-500 bg-[#1c212d]' : 'border-[#e2e8f0] hover:border-slate-400 bg-white'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs"
                          style={{ backgroundColor: acc.value }}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </span>
                        <span className="truncate">{acc.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Color Picker */}
                <div className="pt-3 border-t border-slate-500/20 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Pipette className="w-4 h-4 text-slate-400" />
                    <span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Scegli un colore personalizzato:
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customAccentInput}
                      onChange={(e) => handleApplyCustomAccent(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                      title="Selettore colore"
                    />
                    <input
                      type="text"
                      value={customAccentInput}
                      onChange={(e) => handleApplyCustomAccent(e.target.value)}
                      placeholder="#0078d4"
                      className={`w-24 px-2 py-1 rounded-lg border text-xs font-mono outline-none ${
                        isDark ? 'bg-[#1c212d] border-[#364154] text-white' : 'bg-white border-[#e2e8f0] text-slate-900'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Wallpapers Grid */}
              <div className={`p-5 rounded-2xl border shadow-sm ${isDark ? 'bg-[#242a38] border-[#364154]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}>
                <h4 className="text-xs font-bold mb-2 uppercase tracking-wider text-slate-400">Sfondi Desktop</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {DEFAULT_WALLPAPERS.map(wp => (
                    <button
                      key={wp.id}
                      onClick={() => updateSettings({ wallpaper: wp.url })}
                      className={`h-24 rounded-xl border overflow-hidden p-2 flex flex-col justify-end text-left relative transition-all group ${
                        settings.wallpaper === wp.url ? 'ring-2 border-transparent shadow-md scale-[1.02]' : 'border-slate-400/30 hover:scale-[1.02]'
                      }`}
                      style={{
                        background: wp.previewUrl,
                        borderColor: settings.wallpaper === wp.url ? currentAccent : undefined
                      }}
                    >
                      <div className="bg-black/65 backdrop-blur-xs px-2 py-0.5 rounded text-[11px] text-white font-medium truncate max-w-full">
                        {wp.name}
                      </div>
                      {settings.wallpaper === wp.url && (
                        <div
                          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-white shadow-xs"
                          style={{ backgroundColor: currentAccent }}
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Custom Wallpaper URL */}
                <form onSubmit={handleApplyCustomWallpaper} className="mt-4 pt-3 border-t border-slate-500/20">
                  <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    O imposta un'immagine online tramite URL:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={customWallpaperUrl}
                      onChange={(e) => setCustomWallpaperUrl(e.target.value)}
                      placeholder="https://example.com/wallpaper.jpg"
                      className={`flex-1 px-3 py-2 text-xs rounded-xl border outline-none ${
                        isDark ? 'bg-[#1c212d] border-[#364154] text-white' : 'bg-white border-[#e2e8f0] text-slate-900'
                      }`}
                    />
                    <button
                      type="submit"
                      style={{ backgroundColor: currentAccent }}
                      className="px-4 py-2 hover:opacity-90 text-white rounded-xl text-xs font-bold transition-opacity"
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
                <h3 className="text-lg font-bold mb-1">Esperienza Tablet & Touch</h3>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Ottimizzazioni per schermi touch e dispositivi portatili.
                </p>
              </div>

              {/* PWA Install Banner */}
              <PWAInstallButton variant="settings" />

              <div className={`p-5 rounded-2xl border space-y-4 shadow-sm ${isDark ? 'bg-[#242a38] border-[#364154]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold">Modalità Tablet Touch</h4>
                    <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Aumenta le dimensioni delle icone sul desktop e i pulsanti della barra applicazioni per facilitare il tocco con le dita.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.tabletMode}
                    onChange={(e) => updateSettings({ tabletMode: e.target.checked })}
                    style={{ accentColor: currentAccent }}
                    className="w-5 h-5 rounded cursor-pointer"
                  />
                </div>

                <div className="border-t border-slate-500/20 pt-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold">Apertura con Singolo Tocco</h4>
                    <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Se attivo, un singolo tocco su un'icona del desktop avvia direttamente l'app senza richiedere doppio tocco.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.singleTapOpen}
                    onChange={(e) => updateSettings({ singleTapOpen: e.target.checked })}
                    style={{ accentColor: currentAccent }}
                    className="w-5 h-5 rounded cursor-pointer"
                  />
                </div>

                <div className="border-t border-slate-500/20 pt-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold">Schermo Intero Tablet</h4>
                    <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Nasconde la barra del browser per massimizzare lo spazio di lavoro.
                    </p>
                  </div>
                  <button
                    onClick={toggleFullscreen}
                    style={{ backgroundColor: isFullscreen ? currentAccent : undefined }}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      isFullscreen
                        ? 'text-white'
                        : isDark ? 'border-[#364154] bg-[#1c212d] text-slate-300' : 'border-[#e2e8f0] bg-white text-slate-700'
                    }`}
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>{isFullscreen ? 'Attivo' : 'Attiva Schermo Intero'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: Storage & Data */}
          {activeSection === 'storage' && (
            <div className="max-w-2xl space-y-4">
              <div>
                <h3 className="text-lg font-bold mb-1">Memoria & Backup Dati</h3>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Stato dell'archiviazione locale e opzioni di salvataggio.
                </p>
              </div>

              <div className={`p-5 rounded-2xl border space-y-4 shadow-sm ${isDark ? 'bg-[#242a38] border-[#364154]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold">Spazio Utilizzato nel Browser</h4>
                    <div className="text-2xl font-mono font-bold mt-1" style={{ color: currentAccent }}>
                      {storageUsedKB} KB
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20">
                    Consumo Memoria: Ultra Basso
                  </span>
                </div>

                <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  A differenza delle app tradizionali che richiedono centinaia di megabyte (MB) o gigabyte (GB) di spazio, questo ambiente occupa solo pochi kilobyte (KB) nel browser, lasciando libera tutta la memoria del tuo tablet per altre attività!
                </p>

                <div className="pt-3 border-t border-slate-500/20 flex flex-wrap gap-2.5">
                  <button
                    onClick={exportAllBackup}
                    style={{ backgroundColor: currentAccent }}
                    className="px-4 py-2 hover:opacity-90 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-opacity shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Scarica Backup di Sicurezza (JSON)</span>
                  </button>

                  <button
                    onClick={() => setResetConfirm(true)}
                    className="px-4 py-2 border border-red-500/40 hover:bg-red-500/10 text-red-500 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Ripristina Dati Iniziali</span>
                  </button>
                </div>

                {resetConfirm && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                    <p className="font-semibold mb-2">Sei sicuro di voler cancellare tutti i documenti e le note salvate?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleClearData}
                        className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold"
                      >
                        Sì, cancella tutto
                      </button>
                      <button
                        onClick={() => setResetConfirm(false)}
                        className={`px-3.5 py-1.5 rounded-lg font-medium ${
                          isDark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                        }`}
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
