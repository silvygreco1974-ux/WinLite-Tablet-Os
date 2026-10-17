import React, { useState } from 'react';
import {
  Search,
  FileText,
  Code2,
  StickyNote,
  Globe,
  FolderOpen,
  Calculator,
  Settings,
  Maximize2,
  RotateCcw,
  User,
  ExternalLink,
  ChevronRight,
  HardDrive
} from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { AppIcon } from '../Common/AppIcon';
import { AppType } from '../../types/os';
import { PWAInstallButton } from '../PWA/PWAInstallButton';

export const StartMenu: React.FC = () => {
  const {
    openWindow,
    setIsStartMenuOpen,
    webApps,
    files,
    settings,
    storageUsedKB,
    toggleFullscreen,
    isFullscreen
  } = useOS();

  const [searchQuery, setSearchQuery] = useState('');
  const isDark = settings.theme === 'dark';

  const coreApps: { type: AppType; title: string; icon: string; color: string; desc: string }[] = [
    { type: 'text-editor', title: 'Editor di Testo', icon: 'FileText', color: '#0078d4', desc: 'WordPad per appunti e testi' },
    { type: 'code-editor', title: 'Code Studio', icon: 'Code2', color: '#10b981', desc: 'Editor HTML, JS, CSS, Python' },
    { type: 'sticky-notes', title: 'Note Adesive', icon: 'StickyNote', color: '#f59e0b', desc: 'Post-it e to-do list' },
    { type: 'web-manager', title: 'Le Mie Web App', icon: 'Globe', color: '#6366f1', desc: 'Aggiungi e gestisci link esterni' },
    { type: 'file-explorer', title: 'Gestione File', icon: 'FolderOpen', color: '#0284c7', desc: 'Archivio virtuale del tablet' },
    { type: 'calculator', title: 'Calcolatrice', icon: 'Calculator', color: '#0d9488', desc: 'Calcoli rapidi' },
    { type: 'settings', title: 'Impostazioni', icon: 'Settings', color: '#64748b', desc: 'Sfondo, tema e opzioni' },
  ];

  const handleLaunchCoreApp = (appType: AppType) => {
    openWindow(appType);
    setIsStartMenuOpen(false);
  };

  const handleLaunchWebApp = (url: string, name: string, icon: string, mode: 'window' | 'tab') => {
    if (mode === 'tab') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      openWindow('web-viewer', name, icon, { url, appName: name });
    }
    setIsStartMenuOpen(false);
  };

  const handleOpenFile = (fileId: string, type: string, name: string) => {
    if (type === 'code') {
      openWindow('code-editor', name, 'Code', { fileId });
    } else {
      openWindow('text-editor', name, 'FileText', { fileId });
    }
    setIsStartMenuOpen(false);
  };

  // Search filtering
  const filteredCore = coreApps.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.desc.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredWeb = webApps.filter(w => w.name.toLowerCase().includes(searchQuery.toLowerCase()) || w.url.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        zIndex: 9000,
        bottom: '56px',
      }}
      className={`fixed left-1/2 -translate-x-1/2 w-[95vw] sm:w-[580px] h-[540px] rounded-2xl border shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden select-none transition-all duration-200 ${
        isDark
          ? 'bg-slate-900/90 border-slate-700/80 text-white shadow-black/60'
          : 'bg-white/95 border-slate-200/90 text-slate-800 shadow-slate-900/30'
      }`}
    >
      {/* Search Header */}
      <div className="p-4 pb-3 border-b border-slate-500/10">
        <div className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border transition-colors ${
          isDark
            ? 'bg-slate-800/80 border-slate-700 text-white focus-within:border-blue-500'
            : 'bg-slate-100 border-slate-200 text-slate-900 focus-within:border-blue-500'
        }`}>
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca app, impostazioni, web app o file..."
            autoFocus
            className="w-full bg-transparent border-none outline-none text-xs placeholder:text-slate-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-xs text-slate-400 hover:text-white">
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Start Menu Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-5">
        {searchQuery ? (
          /* Search Results */
          <div className="space-y-4">
            {filteredCore.length > 0 && (
              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Applicazioni di Sistema
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredCore.map(app => (
                    <button
                      key={app.type}
                      onClick={() => handleLaunchCoreApp(app.type)}
                      className={`flex items-center gap-3 p-2 rounded-xl text-left transition-colors ${
                        isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: app.color }}>
                        <AppIcon name={app.icon} className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-semibold">{app.title}</div>
                        <div className="text-[10px] text-slate-400 truncate">{app.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {filteredWeb.length > 0 && (
              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Web App Personalizzate
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredWeb.map(app => (
                    <button
                      key={app.id}
                      onClick={() => handleLaunchWebApp(app.url, app.name, app.icon, app.openMode)}
                      className={`flex items-center gap-3 p-2 rounded-xl text-left transition-colors ${
                        isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: app.color }}>
                        <AppIcon name={app.icon} className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-semibold">{app.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{app.url}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {filteredFiles.length > 0 && (
              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  File Virtuali
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredFiles.map(file => (
                    <button
                      key={file.id}
                      onClick={() => handleOpenFile(file.id, file.type, file.name)}
                      className={`flex items-center gap-3 p-2 rounded-xl text-left transition-colors ${
                        isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        {file.type === 'code' ? <Code2 className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-semibold truncate">{file.name}</div>
                        <div className="text-[10px] text-slate-400">.{file.extension} · {Math.round(file.size / 1024 * 10) / 10} KB</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {filteredCore.length === 0 && filteredWeb.length === 0 && filteredFiles.length === 0 && (
              <div className="text-center py-10 text-slate-400 text-xs">
                Nessun risultato corrispondente a "{searchQuery}"
              </div>
            )}
          </div>
        ) : (
          /* Normal Start Menu Grid */
          <>
            {/* Pinned Core Apps */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                <span>Applicazioni Principali</span>
                <span className="text-[10px] font-normal lowercase">fissate in alto</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {coreApps.map(app => (
                  <button
                    key={app.type}
                    onClick={() => handleLaunchCoreApp(app.type)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl transition-all group ${
                      isDark ? 'hover:bg-slate-800/80' : 'hover:bg-slate-100'
                    }`}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: app.color }}
                    >
                      <AppIcon name={app.icon} className="w-5 h-5 text-white" />
                    </div>
                    <span className="mt-1.5 text-[11px] font-medium text-center line-clamp-1">
                      {app.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Web Apps Row */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                <span>Le Mie Web App ({webApps.length})</span>
                <button
                  onClick={() => {
                    openWindow('web-manager');
                    setIsStartMenuOpen(false);
                  }}
                  className="text-[11px] text-blue-500 hover:underline flex items-center gap-0.5 lowercase font-normal"
                >
                  <span>gestisci</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {webApps.slice(0, 6).map(app => (
                  <button
                    key={app.id}
                    onClick={() => handleLaunchWebApp(app.url, app.name, app.icon, app.openMode)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-left border transition-all ${
                      isDark ? 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0"
                      style={{ backgroundColor: app.color }}
                    >
                      <AppIcon name={app.icon} className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-medium truncate">{app.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{app.category}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Files */}
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Documenti Recenti
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {files.slice(0, 4).map(file => (
                  <button
                    key={file.id}
                    onClick={() => handleOpenFile(file.id, file.type, file.name)}
                    className={`flex items-center gap-2.5 p-2 rounded-lg text-left transition-colors ${
                      isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                    }`}
                  >
                    <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-500 shrink-0">
                      {file.type === 'code' ? <Code2 className="w-3.5 h-3.5 text-emerald-500" /> : <FileText className="w-3.5 h-3.5" />}
                    </div>
                    <div className="truncate flex-1">
                      <div className="text-xs font-medium truncate">{file.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(file.updatedAt).toLocaleDateString('it-IT')} · {Math.round(file.size / 1024 * 10) / 10} KB
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* PWA Install Banner inside Start Menu */}
        <div className="mt-4 pt-3 border-t border-slate-500/15">
          <PWAInstallButton variant="startmenu" />
        </div>
      </div>

      {/* Footer Profile & Actions */}
      <div className={`p-3 px-4 border-t flex items-center justify-between text-xs ${
        isDark ? 'bg-slate-800/70 border-slate-700/80' : 'bg-slate-100 border-slate-200'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-xs leading-none">Utente Tablet</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
              <HardDrive className="w-3 h-3" />
              <span>Memoria: {storageUsedKB} KB usati</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleFullscreen}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-200 text-slate-700'
            }`}
            title={isFullscreen ? 'Esci da schermo intero' : 'Attiva schermo intero per tablet'}
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => window.location.reload()}
            className={`p-1.5 rounded-lg transition-colors hover:text-amber-400 ${
              isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-200 text-slate-700'
            }`}
            title="Riavvia WinLite OS"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
