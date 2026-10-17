import React, { useState, useEffect } from 'react';
import {
  Search,
  Wifi,
  Volume2,
  Battery,
  Maximize2,
  SlidersHorizontal,
  ChevronUp
} from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { AppIcon } from '../Common/AppIcon';
import { AppType } from '../../types/os';

export const Taskbar: React.FC = () => {
  const {
    windows,
    activeWindowId,
    bringToFront,
    minimizeWindow,
    openWindow,
    isStartMenuOpen,
    setIsStartMenuOpen,
    isActionCenterOpen,
    setIsActionCenterOpen,
    isCalendarOpen,
    setIsCalendarOpen,
    closeAllFlyouts,
    webApps,
    settings,
    isFullscreen,
    toggleFullscreen
  } = useOS();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

  const isDark = settings.theme === 'dark';

  // Live Clock update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Battery API if available
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      }).catch(() => {});
    }
  }, []);

  const handleTaskbarItemClick = (winId: string, isMin: boolean) => {
    if (activeWindowId === winId && !isMin) {
      minimizeWindow(winId);
    } else {
      bringToFront(winId);
    }
  };

  const handlePinnedAppClick = (appType: AppType, customData?: Record<string, any>) => {
    // If a window of this type is already open, focus it
    const openWin = windows.find(w => w.appType === appType);
    if (openWin) {
      if (openWin.isMinimized || activeWindowId !== openWin.id) {
        bringToFront(openWin.id);
      } else {
        minimizeWindow(openWin.id);
      }
    } else {
      openWindow(appType, undefined, undefined, customData);
    }
  };

  // Pinned core apps
  const pinnedCoreApps: { type: AppType; title: string; icon: string; color: string }[] = [
    { type: 'text-editor', title: 'Editor di Testo', icon: 'FileText', color: '#0078d4' },
    { type: 'code-editor', title: 'Code Studio', icon: 'Code2', color: '#10b981' },
    { type: 'sticky-notes', title: 'Note Adesive', icon: 'StickyNote', color: '#f59e0b' },
    { type: 'web-manager', title: 'Le Mie Web App', icon: 'Globe', color: '#6366f1' },
    { type: 'file-explorer', title: 'Gestione File', icon: 'FolderOpen', color: '#0284c7' },
  ];

  // Pinned web apps
  const pinnedWebApps = webApps.filter(a => a.isPinnedTaskbar);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{ zIndex: 8500 }}
      className={`fixed bottom-0 left-0 right-0 h-12 flex items-center justify-between px-2 sm:px-3 border-t select-none backdrop-blur-xl ${
        isDark
          ? 'bg-slate-900/85 border-slate-700/60 text-slate-100'
          : 'bg-white/85 border-slate-200/80 text-slate-800 shadow-md'
      }`}
    >
      {/* Left: Quick Tablet Status / Spacer */}
      <div className="flex items-center gap-1 sm:w-28 shrink-0">
        <button
          onClick={() => {
            const next = !isStartMenuOpen;
            closeAllFlyouts();
            setIsStartMenuOpen(next);
          }}
          className={`flex items-center justify-center p-2 rounded-xl transition-all ${
            isStartMenuOpen
              ? 'bg-blue-600/20 text-blue-500 scale-95'
              : isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-200/70'
          }`}
          title="Start"
          aria-label="Start"
        >
          {/* Windows 11 4-square logo */}
          <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
            <div className="bg-[#0078d4] rounded-[1px]" />
            <div className="bg-[#0078d4] rounded-[1px]" />
            <div className="bg-[#0078d4] rounded-[1px]" />
            <div className="bg-[#0078d4] rounded-[1px]" />
          </div>
        </button>

        {/* Search button on taskbar */}
        <button
          onClick={() => {
            closeAllFlyouts();
            setIsStartMenuOpen(true);
          }}
          className={`p-2 rounded-xl transition-colors hidden sm:flex items-center text-slate-400 ${
            isDark ? 'hover:bg-slate-800 hover:text-slate-200' : 'hover:bg-slate-200 hover:text-slate-800'
          }`}
          title="Cerca"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Center: Running & Pinned Apps Icons */}
      <div className="flex-1 flex items-center justify-center gap-1 overflow-x-auto px-2 max-w-2xl">
        {/* Pinned Core Apps */}
        {pinnedCoreApps.map(app => {
          const runningWin = windows.find(w => w.appType === app.type);
          const isRunning = !!runningWin;
          const isActive = runningWin && activeWindowId === runningWin.id && !runningWin.isMinimized;

          return (
            <button
              key={app.type}
              onClick={() => handlePinnedAppClick(app.type)}
              className={`relative flex items-center justify-center rounded-xl p-2 transition-all ${
                isActive
                  ? isDark ? 'bg-slate-800 shadow-sm' : 'bg-slate-200 shadow-sm'
                  : isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-200/60'
              }`}
              title={app.title}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-xs"
                style={{ backgroundColor: app.color }}
              >
                <AppIcon name={app.icon} className="w-4 h-4 text-white" />
              </div>

              {/* Running Pill Indicator */}
              {isRunning && (
                <div
                  className={`absolute bottom-0.5 rounded-full transition-all ${
                    isActive
                      ? 'w-4 h-1 bg-blue-500'
                      : 'w-1.5 h-1 bg-slate-400'
                  }`}
                />
              )}
            </button>
          );
        })}

        {/* Pinned Custom Web Apps */}
        {pinnedWebApps.map(app => {
          const runningWin = windows.find(w => w.customData?.url === app.url);
          const isRunning = !!runningWin;
          const isActive = runningWin && activeWindowId === runningWin.id && !runningWin.isMinimized;

          return (
            <button
              key={app.id}
              onClick={() => {
                if (app.openMode === 'tab') {
                  window.open(app.url, '_blank', 'noopener,noreferrer');
                } else if (runningWin) {
                  handleTaskbarItemClick(runningWin.id, runningWin.isMinimized);
                } else {
                  openWindow('web-viewer', app.name, app.icon, { url: app.url, appName: app.name });
                }
              }}
              className={`relative flex items-center justify-center rounded-xl p-2 transition-all ${
                isActive
                  ? isDark ? 'bg-slate-800 shadow-sm' : 'bg-slate-200 shadow-sm'
                  : isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-200/60'
              }`}
              title={app.name}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-xs"
                style={{ backgroundColor: app.color }}
              >
                <AppIcon name={app.icon} className="w-4 h-4 text-white" />
              </div>

              {isRunning && (
                <div
                  className={`absolute bottom-0.5 rounded-full transition-all ${
                    isActive ? 'w-4 h-1 bg-blue-500' : 'w-1.5 h-1 bg-slate-400'
                  }`}
                />
              )}
            </button>
          );
        })}

        {/* Additional Open Windows not already in pinned */}
        {windows
          .filter(w => !pinnedCoreApps.some(p => p.type === w.appType) && !pinnedWebApps.some(p => p.url === w.customData?.url))
          .map(win => {
            const isActive = activeWindowId === win.id && !win.isMinimized;
            return (
              <button
                key={win.id}
                onClick={() => handleTaskbarItemClick(win.id, win.isMinimized)}
                className={`relative flex items-center justify-center rounded-xl p-2 transition-all ${
                  isActive
                    ? isDark ? 'bg-slate-800 shadow-sm' : 'bg-slate-200 shadow-sm'
                    : isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-200/60'
                }`}
                title={win.title}
              >
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
                  <AppIcon name={win.icon} className="w-4 h-4 text-white" />
                </div>
                <div
                  className={`absolute bottom-0.5 rounded-full transition-all ${
                    isActive ? 'w-4 h-1 bg-blue-500' : 'w-1.5 h-1 bg-slate-400'
                  }`}
                />
              </button>
            );
          })}
      </div>

      {/* Right: System Tray */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Fullscreen Button for Tablet */}
        <button
          onClick={toggleFullscreen}
          className={`p-2 rounded-xl transition-colors flex items-center gap-1 ${
            isFullscreen
              ? 'text-blue-500 bg-blue-500/10'
              : isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-700'
          }`}
          title={isFullscreen ? 'Riduci da schermo intero' : 'Schermo Intero per Tablet'}
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Action Center Trigger (Wi-Fi, Audio, Battery) */}
        <button
          onClick={() => {
            const next = !isActionCenterOpen;
            closeAllFlyouts();
            setIsActionCenterOpen(next);
          }}
          className={`flex items-center gap-1.5 px-2 py-1.5 rounded-xl transition-all ${
            isActionCenterOpen
              ? 'bg-blue-600/20 text-blue-500'
              : isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-700'
          }`}
          title="Centro Notifiche & Impostazioni Rapide"
        >
          <Wifi className="w-3.5 h-3.5" />
          <Volume2 className="w-3.5 h-3.5" />
          <Battery className="w-3.5 h-3.5" />
          {batteryLevel !== null && (
            <span className="text-[10px] font-mono hidden md:inline">{batteryLevel}%</span>
          )}
        </button>

        {/* Clock & Calendar Trigger */}
        <button
          onClick={() => {
            const next = !isCalendarOpen;
            closeAllFlyouts();
            setIsCalendarOpen(next);
          }}
          className={`flex flex-col items-end px-2 py-1 rounded-xl transition-all text-right leading-tight ${
            isCalendarOpen
              ? 'bg-blue-600/20 text-blue-500'
              : isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-200 text-slate-800'
          }`}
          title="Orologio e Calendario"
        >
          <span className="text-xs font-mono font-medium">
            {currentTime.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
            {currentTime.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </span>
        </button>

        {/* Show Desktop Peek Bar on extreme right */}
        <div
          onClick={() => {
            closeAllFlyouts();
            windows.forEach(w => {
              if (!w.isMinimized) minimizeWindow(w.id);
            });
          }}
          className="w-1.5 h-8 border-l border-slate-500/20 hover:bg-white/20 cursor-pointer ml-1 transition-colors"
          title="Mostra Desktop"
        />
      </div>
    </div>
  );
};
