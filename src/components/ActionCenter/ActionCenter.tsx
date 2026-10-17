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
        bottom: '56px',
        right: '12px',
      }}
      className={`fixed w-[92vw] sm:w-[360px] p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex flex-col gap-4 select-none ${
        isDark
          ? 'bg-slate-900/90 border-slate-700/80 text-white shadow-black/60'
          : 'bg-white/95 border-slate-200/90 text-slate-800 shadow-slate-900/30'
      }`}
    >
      {/* Quick Settings Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Wi-Fi */}
        <button
          onClick={() => setWifiEnabled(prev => !prev)}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
            wifiEnabled
              ? 'bg-blue-600 border-blue-500 text-white shadow-xs'
              : isDark ? 'bg-slate-800/80 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}
        >
          <Wifi className="w-5 h-5 mb-1" />
          <span className="text-[11px] font-medium">Wi-Fi</span>
        </button>

        {/* Fullscreen (Tablet) */}
        <button
          onClick={toggleFullscreen}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
            isFullscreen
              ? 'bg-blue-600 border-blue-500 text-white shadow-xs'
              : isDark ? 'bg-slate-800/80 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}
        >
          <Maximize2 className="w-5 h-5 mb-1" />
          <span className="text-[11px] font-medium">{isFullscreen ? 'Normale' : 'Schermo Intero'}</span>
        </button>

        {/* Tablet Mode */}
        <button
          onClick={() => updateSettings({ tabletMode: !settings.tabletMode })}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
            settings.tabletMode
              ? 'bg-blue-600 border-blue-500 text-white shadow-xs'
              : isDark ? 'bg-slate-800/80 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}
        >
          <Tablet className="w-5 h-5 mb-1" />
          <span className="text-[11px] font-medium">Touch Tablet</span>
        </button>

        {/* Theme Dark / Light */}
        <button
          onClick={() => updateSettings({ theme: isDark ? 'light' : 'dark' })}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
            isDark
              ? 'bg-slate-800/80 border-slate-700 text-blue-400'
              : 'bg-blue-600 border-blue-500 text-white shadow-xs'
          }`}
        >
          {isDark ? <Moon className="w-5 h-5 mb-1" /> : <Sun className="w-5 h-5 mb-1" />}
          <span className="text-[11px] font-medium">{isDark ? 'Tema Scuro' : 'Tema Chiaro'}</span>
        </button>

        {/* Sound toggle */}
        <button
          onClick={() => setVolume(prev => prev > 0 ? 0 : 80)}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
            volume > 0
              ? 'bg-blue-600 border-blue-500 text-white shadow-xs'
              : isDark ? 'bg-slate-800/80 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}
        >
          {volume > 0 ? <Volume2 className="w-5 h-5 mb-1" /> : <VolumeX className="w-5 h-5 mb-1" />}
          <span className="text-[11px] font-medium">{volume > 0 ? 'Audio Attivo' : 'Muto'}</span>
        </button>

        {/* Riavvia OS */}
        <button
          onClick={() => window.location.reload()}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
            isDark ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
          }`}
        >
          <RotateCcw className="w-5 h-5 mb-1" />
          <span className="text-[11px] font-medium">Riavvia OS</span>
        </button>
      </div>

      {/* Sliders */}
      <div className="space-y-3 pt-1">
        {/* Volume Slider */}
        <div className="flex items-center gap-3">
          <Volume2 className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full accent-blue-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
          />
          <span className="text-[11px] font-mono text-slate-400 w-8 text-right">{volume}%</span>
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
            className="w-full accent-blue-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
          />
          <span className="text-[11px] font-mono text-slate-400 w-8 text-right">{brightness}%</span>
        </div>
      </div>

      {/* Tablet Memory Status Card */}
      <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
        isDark ? 'bg-slate-800/50 border-slate-700/60' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-2.5">
          <HardDrive className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <div className="font-semibold text-xs">Memoria Tablet Libera</div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Usati solo {storageUsedKB} KB su disco virtuale
            </div>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold">
          Ottimale
        </span>
      </div>
    </div>
  );
};
