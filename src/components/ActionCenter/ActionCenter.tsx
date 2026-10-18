import React, { useState } from 'react';
import {
  Wifi,
  Maximize2,
  Tablet,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Sliders,
  HardDrive,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { useOS } from '../../context/OSContext';

export const ActionCenter: React.FC = () => {
  const {
    settings,
    updateSettings,
    isFullscreen,
    toggleFullscreen,
    storageUsedKB,
  } = useOS();

  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [volume, setVolume] = useState(80);
  const [brightness, setBrightness] = useState(100);

  const isDark = settings.theme === 'dark';

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        zIndex: 9000,
        bottom: '60px',
        right: '12px',
      }}
      className={`fixed w-[92vw] sm:w-[380px] p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex flex-col gap-4 select-none ${
        isDark
          ? 'bg-[#1c212d]/98 border-[#343e52] text-[#e2e8f0] shadow-black/70'
          : 'bg-white/98 border-[#e2e8f0] text-[#1e293b] shadow-2xl shadow-slate-900/20'
      }`}
    >
      {/* Quick Settings Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Wi-Fi */}
        <button
          onClick={() => setWifiEnabled(prev => !prev)}
          style={{
            backgroundColor: wifiEnabled ? (settings.accentColor || '#0078d4') : undefined,
            borderColor: wifiEnabled ? (settings.accentColor || '#0078d4') : undefined,
          }}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
            wifiEnabled
              ? 'text-white shadow-xs'
              : isDark ? 'bg-[#28303f] border-[#364154] text-slate-300 hover:bg-[#343e52]' : 'bg-[#f8fafc] border-[#e2e8f0] text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Wifi className="w-5 h-5 mb-1.5" />
          <span className="text-xs font-semibold">Wi-Fi</span>
        </button>

        {/* Fullscreen (Tablet) */}
        <button
          onClick={toggleFullscreen}
          style={{
            backgroundColor: isFullscreen ? (settings.accentColor || '#0078d4') : undefined,
            borderColor: isFullscreen ? (settings.accentColor || '#0078d4') : undefined,
          }}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
            isFullscreen
              ? 'text-white shadow-xs'
              : isDark ? 'bg-[#28303f] border-[#364154] text-slate-300 hover:bg-[#343e52]' : 'bg-[#f8fafc] border-[#e2e8f0] text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Maximize2 className="w-5 h-5 mb-1.5" />
          <span className="text-xs font-semibold">{isFullscreen ? 'Normale' : 'Schermo Intero'}</span>
        </button>

        {/* Tablet Mode */}
        <button
          onClick={() => updateSettings({ tabletMode: !settings.tabletMode })}
          style={{
            backgroundColor: settings.tabletMode ? (settings.accentColor || '#0078d4') : undefined,
            borderColor: settings.tabletMode ? (settings.accentColor || '#0078d4') : undefined,
          }}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
            settings.tabletMode
              ? 'text-white shadow-xs'
              : isDark ? 'bg-[#28303f] border-[#364154] text-slate-300 hover:bg-[#343e52]' : 'bg-[#f8fafc] border-[#e2e8f0] text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Tablet className="w-5 h-5 mb-1.5" />
          <span className="text-xs font-semibold">Touch Tablet</span>
        </button>

        {/* Theme Dark / Light */}
        <button
          onClick={() => updateSettings({ theme: isDark ? 'light' : 'dark' })}
          style={{
            backgroundColor: !isDark ? (settings.accentColor || '#0078d4') : undefined,
            borderColor: !isDark ? (settings.accentColor || '#0078d4') : undefined,
          }}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
            isDark
              ? 'bg-[#28303f] border-[#364154] text-slate-200 hover:bg-[#343e52]'
              : 'text-white shadow-xs'
          }`}
        >
          {isDark ? <Moon className="w-5 h-5 mb-1.5 text-amber-300" /> : <Sun className="w-5 h-5 mb-1.5" />}
          <span className="text-xs font-semibold">{isDark ? 'Tema Scuro' : 'Tema Chiaro'}</span>
        </button>

        {/* Sound toggle */}
        <button
          onClick={() => setVolume(prev => prev > 0 ? 0 : 80)}
          style={{
            backgroundColor: volume > 0 ? (settings.accentColor || '#0078d4') : undefined,
            borderColor: volume > 0 ? (settings.accentColor || '#0078d4') : undefined,
          }}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
            volume > 0
              ? 'text-white shadow-xs'
              : isDark ? 'bg-[#28303f] border-[#364154] text-slate-400 hover:bg-[#343e52]' : 'bg-[#f8fafc] border-[#e2e8f0] text-slate-700 hover:bg-slate-100'
          }`}
        >
          {volume > 0 ? <Volume2 className="w-5 h-5 mb-1.5" /> : <VolumeX className="w-5 h-5 mb-1.5" />}
          <span className="text-xs font-semibold">{volume > 0 ? 'Audio Attivo' : 'Muto'}</span>
        </button>

        {/* Riavvia OS */}
        <button
          onClick={() => window.location.reload()}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
            isDark ? 'bg-[#28303f] border-[#364154] text-slate-300 hover:text-white hover:bg-[#343e52]' : 'bg-[#f8fafc] border-[#e2e8f0] text-slate-700 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <RotateCcw className="w-5 h-5 mb-1.5 text-amber-500" />
          <span className="text-xs font-semibold">Riavvia OS</span>
        </button>
      </div>

      {/* Sliders */}
      <div className="space-y-3 pt-2">
        {/* Volume Slider */}
        <div className="flex items-center gap-3">
          <Volume2 className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            style={{ accentColor: settings.accentColor || '#0078d4' }}
            className="w-full h-2 bg-slate-300 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
          <span className="text-xs font-mono font-medium text-slate-400 w-9 text-right">{volume}%</span>
        </div>

        {/* Brightness Slider */}
        <div className="flex items-center gap-3">
          <Sun className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="range"
            min="30"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            style={{ accentColor: settings.accentColor || '#0078d4' }}
            className="w-full h-2 bg-slate-300 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
          <span className="text-xs font-mono font-medium text-slate-400 w-9 text-right">{brightness}%</span>
        </div>
      </div>

      {/* Tablet Memory Status Card */}
      <div className={`p-3.5 rounded-xl border flex items-center justify-between text-sm ${
        isDark ? 'bg-[#242a38] border-[#343e52]' : 'bg-[#f8fafc] border-[#e2e8f0]'
      }`}>
        <div className="flex items-center gap-3">
          <HardDrive className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="font-semibold text-sm">Memoria Tablet Libera</div>
            <div className="text-xs text-slate-400 mt-0.5">
              Usati solo {storageUsedKB} KB su disco virtuale
            </div>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold">
          Ottimale
        </span>
      </div>
    </div>
  );
};
