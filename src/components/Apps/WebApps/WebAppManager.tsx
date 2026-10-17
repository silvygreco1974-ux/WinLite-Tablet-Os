import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  ExternalLink,
  Globe,
  Pin,
  Check,
  Search,
  Sparkles,
  Bookmark,
  AppWindow,
  Monitor
} from 'lucide-react';
import { useOS } from '../../../context/OSContext';
import { CustomWebApp } from '../../../types/os';
import { AppIcon } from '../../Common/AppIcon';

const PRESET_CATALOG: Omit<CustomWebApp, 'id' | 'addedAt'>[] = [
  {
    name: 'Photopea (Editor Immagini)',
    url: 'https://www.photopea.com',
    icon: 'PenTool',
    color: '#00bcd4',
    category: 'Lavoro',
    openMode: 'window',
    isPinnedDesktop: true,
    isPinnedTaskbar: false,
  },
  {
    name: 'Excalidraw (Lavagna)',
    url: 'https://excalidraw.com',
    icon: 'PenTool',
    color: '#6965db',
    category: 'Lavoro',
    openMode: 'window',
    isPinnedDesktop: true,
    isPinnedTaskbar: true,
  },
  {
    name: 'Pomofocus (Timer Studio)',
    url: 'https://pomofocus.io',
    icon: 'Activity',
    color: '#d95550',
    category: 'Studio',
    openMode: 'window',
    isPinnedDesktop: false,
    isPinnedTaskbar: false,
  },
  {
    name: 'DevDocs (Documentazione)',
    url: 'https://devdocs.io',
    icon: 'Code2',
    color: '#388e3c',
    category: 'Studio',
    openMode: 'window',
    isPinnedDesktop: false,
    isPinnedTaskbar: false,
  },
  {
    name: 'Radio Garden (Radio Mondo)',
    url: 'https://radio.garden',
    icon: 'Music',
    color: '#009688',
    category: 'Svago',
    openMode: 'window',
    isPinnedDesktop: false,
    isPinnedTaskbar: false,
  },
  {
    name: 'Canva Web',
    url: 'https://www.canva.com',
    icon: 'Layout',
    color: '#00c4cc',
    category: 'Lavoro',
    openMode: 'tab',
    isPinnedDesktop: true,
    isPinnedTaskbar: false,
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com',
    icon: 'Video',
    color: '#ff0000',
    category: 'Svago',
    openMode: 'tab',
    isPinnedDesktop: true,
    isPinnedTaskbar: false,
  },
  {
    name: 'Reddit',
    url: 'https://www.reddit.com',
    icon: 'MessageSquare',
    color: '#ff4500',
    category: 'Social',
    openMode: 'tab',
    isPinnedDesktop: false,
    isPinnedTaskbar: false,
  }
];

const AVAILABLE_ICONS = [
  'Globe', 'BookOpen', 'Code2', 'PenTool', 'Music', 'Video',
  'MessageSquare', 'Layout', 'Sparkles', 'Activity', 'Bookmark', 'Search'
];

const AVAILABLE_COLORS = [
  '#0078d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'
];

export const WebAppManager: React.FC = () => {
  const { webApps, addWebApp, updateWebApp, deleteWebApp, openWindow, settings } = useOS();

  const [activeTab, setActiveTab] = useState<'my-apps' | 'add' | 'catalog'>('my-apps');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State for new Web App
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('Globe');
  const [color, setColor] = useState('#0078d4');
  const [category, setCategory] = useState<CustomWebApp['category']>('Utilità');
  const [openMode, setOpenMode] = useState<CustomWebApp['openMode']>('window');
  const [isPinnedDesktop, setIsPinnedDesktop] = useState(true);
  const [isPinnedTaskbar, setIsPinnedTaskbar] = useState(false);
  const [formError, setFormError] = useState('');
  const [addedSuccess, setAddedSuccess] = useState(false);

  const isDark = settings.theme === 'dark';

  const handleLaunchApp = (app: CustomWebApp) => {
    if (app.openMode === 'tab') {
      window.open(app.url, '_blank', 'noopener,noreferrer');
    } else {
      openWindow('web-viewer', app.name, app.icon, { url: app.url, appName: app.name });
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Inserisci un nome per la tua applicazione.');
      return;
    }
    if (!url.trim()) {
      setFormError('Inserisci l\'indirizzo web (URL).');
      return;
    }

    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    addWebApp({
      name: name.trim(),
      url: finalUrl,
      icon,
      color,
      category,
      openMode,
      isPinnedDesktop,
      isPinnedTaskbar,
    });

    // Reset form
    setName('');
    setUrl('');
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      setActiveTab('my-apps');
    }, 1200);
  };

  const handleInstallPreset = (preset: Omit<CustomWebApp, 'id' | 'addedAt'>) => {
    addWebApp(preset);
  };

  const filteredApps = webApps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`flex flex-col h-full ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      {/* Top Navigation Bar & Action Buttons */}
      <div className={`px-4 py-3 border-b flex flex-wrap items-center justify-between gap-3 ${
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'
      }`}>
        {/* Navigation Tabs - High Contrast, Large Touch Targets */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tab 1: Le Mie Web App */}
          <button
            onClick={() => setActiveTab('my-apps')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all min-h-[42px] border ${
              activeTab === 'my-apps'
                ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                : isDark
                ? 'bg-slate-700/80 border-slate-600 text-slate-100 hover:bg-slate-700 hover:text-white'
                : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Globe className="w-4 h-4 text-blue-400" />
            <span>Le Mie Web App ({webApps.length})</span>
          </button>

          {/* Tab 2: Aggiungi Link / App (Prominent Button) */}
          <button
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all min-h-[42px] border ${
              activeTab === 'add'
                ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                : isDark
                ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30'
                : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Aggiungi Nuova App</span>
          </button>

          {/* Tab 3: Catalogo Suggeriti */}
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all min-h-[42px] border ${
              activeTab === 'catalog'
                ? 'bg-amber-600 border-amber-500 text-white shadow-md'
                : isDark
                ? 'bg-slate-700/80 border-slate-600 text-slate-100 hover:bg-slate-700 hover:text-white'
                : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Catalogo Suggeriti</span>
          </button>
        </div>

        {activeTab === 'my-apps' && (
          <div className="relative flex-1 max-w-xs min-h-[42px] flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca tra le tue app..."
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border outline-none min-h-[40px] font-medium ${
                isDark ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        {/* Tab 1: My Installed Web Apps */}
        {activeTab === 'my-apps' && (
          <div>
            {filteredApps.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Globe className="w-14 h-14 text-slate-500/50 mx-auto mb-3" />
                <h4 className="text-base font-bold text-white mb-1">Nessuna Web App presente</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
                  Aggiungi i tuoi siti e web app preferiti (Notion, Google Drive, Canva, YouTube, ecc.) per usarli direttamente dal tuo tablet senza occupare spazio su disco!
                </p>
                <button
                  onClick={() => setActiveTab('add')}
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 mx-auto min-h-[44px]"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Aggiungi la tua prima Web App</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredApps.map(app => (
                  <div
                    key={app.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      isDark
                        ? 'bg-slate-800/90 border-slate-700 hover:border-blue-500 hover:bg-slate-800 shadow-md'
                        : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-lg'
                    }`}
                  >
                    <div>
                      {/* App Header with Icon and Quick Controls */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md"
                          style={{ backgroundColor: app.color }}
                        >
                          <AppIcon name={app.icon} className="w-6 h-6 text-white" />
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap justify-end">
                          {/* Desktop Pin Toggle */}
                          <button
                            onClick={() => updateWebApp(app.id, { isPinnedDesktop: !app.isPinnedDesktop })}
                            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-colors flex items-center gap-1 min-h-[34px] ${
                              app.isPinnedDesktop
                                ? 'bg-blue-600 border-blue-500 text-white shadow-xs'
                                : isDark ? 'border-slate-700 bg-slate-900 text-slate-400 hover:text-white' : 'border-slate-300 bg-slate-100 text-slate-600'
                            }`}
                            title={app.isPinnedDesktop ? 'Attivo sul Desktop' : 'Mostra sul Desktop'}
                          >
                            <Monitor className="w-3.5 h-3.5" />
                            <span>Desktop</span>
                          </button>

                          {/* Taskbar Pin Toggle */}
                          <button
                            onClick={() => updateWebApp(app.id, { isPinnedTaskbar: !app.isPinnedTaskbar })}
                            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-colors flex items-center gap-1 min-h-[34px] ${
                              app.isPinnedTaskbar
                                ? 'bg-blue-600 border-blue-500 text-white shadow-xs'
                                : isDark ? 'border-slate-700 bg-slate-900 text-slate-400 hover:text-white' : 'border-slate-300 bg-slate-100 text-slate-600'
                            }`}
                            title={app.isPinnedTaskbar ? 'Fissata sulla barra' : 'Fissa sulla barra'}
                          >
                            <Pin className="w-3.5 h-3.5" />
                            <span>Barra</span>
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              if (confirm(`Eliminare la web app "${app.name}"?`)) {
                                deleteWebApp(app.id);
                              }
                            }}
                            className="p-1.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 transition-colors min-h-[34px] min-w-[34px] flex items-center justify-center"
                            title="Elimina"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="font-bold text-sm truncate">{app.name}</h4>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{app.url}</p>

                      <div className="flex items-center gap-2 mt-2.5">
                        <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-500/15 text-slate-300 font-bold">
                          {app.category}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {app.openMode === 'window' ? '🪟 Finestra OS' : '🌐 Nuova Scheda'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-500/15">
                      <button
                        onClick={() => handleLaunchApp(app)}
                        className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md min-h-[42px]"
                      >
                        {app.openMode === 'window' ? <AppWindow className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                        <span>Avvia Applicazione</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Add Custom Web App Form */}
        {activeTab === 'add' && (
          <div className="max-w-xl mx-auto">
            <div className={`p-6 rounded-2xl border shadow-lg ${
              isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <h3 className="text-base font-bold mb-1 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-500" />
                <span>Aggiungi una Nuova Web App o Link Esterno</span>
              </h3>
              <p className="text-xs text-slate-400 mb-5">
                Salva qualsiasi sito web sul tuo tablet OS come se fosse un'applicazione nativa.
              </p>

              {formError && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  {formError}
                </div>
              )}

              {addedSuccess && (
                <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Web App aggiunta con successo al tuo sistema!</span>
                </div>
              )}

              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-300">
                    Nome dell'Applicazione *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="es. Notion, ChatGPT, YouTube, Canva..."
                    className={`w-full px-3 py-2 rounded-lg text-xs border outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-300">
                    Indirizzo Web (URL) *
                  </label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                    className={`w-full px-3 py-2 rounded-lg text-xs border outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-300">
                      Categoria
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className={`w-full px-3 py-2 rounded-lg text-xs border outline-none ${
                        isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value="Utilità">Utilità</option>
                      <option value="Lavoro">Lavoro</option>
                      <option value="Studio">Studio</option>
                      <option value="Svago">Svago</option>
                      <option value="Social">Social</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-300">
                      Modalità di Apertura
                    </label>
                    <select
                      value={openMode}
                      onChange={(e) => setOpenMode(e.target.value as any)}
                      className={`w-full px-3 py-2 rounded-lg text-xs border outline-none ${
                        isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value="window">Finestra Desktop (In-OS)</option>
                      <option value="tab">Nuova Scheda Browser</option>
                    </select>
                  </div>
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-slate-300">
                    Scegli Icona
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_ICONS.map(ic => (
                      <button
                        type="button"
                        key={ic}
                        onClick={() => setIcon(ic)}
                        className={`p-2 rounded-lg border transition-all ${
                          icon === ic
                            ? 'bg-blue-600 border-blue-500 text-white ring-2 ring-blue-400'
                            : isDark ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'
                        }`}
                      >
                        <AppIcon name={ic} className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-slate-300">
                    Colore di sfondo dell'icona
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_COLORS.map(c => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-6 h-6 rounded-full transition-transform ${
                          color === c ? 'scale-125 ring-2 ring-white shadow-md' : 'hover:scale-110'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                {/* Pin options */}
                <div className="pt-2 flex flex-col sm:flex-row gap-4 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPinnedDesktop}
                      onChange={(e) => setIsPinnedDesktop(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Mostra sul Desktop</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPinnedTaskbar}
                      onChange={(e) => setIsPinnedTaskbar(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Fissa sulla Barra delle Applicazioni</span>
                  </label>
                </div>

                {/* Submit */}
                <div className="pt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('my-apps')}
                    className="px-4 py-2 text-xs rounded-lg border border-slate-500/40 hover:bg-slate-500/20"
                  >
                    Annulla
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors"
                  >
                    Aggiungi Web App
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tab 3: Curated Catalog of Web Apps */}
        {activeTab === 'catalog' && (
          <div>
            <div className="mb-4">
              <h3 className="text-base font-bold">Web App consigliate per Tablet</h3>
              <p className="text-xs text-slate-400">
                Strumenti leggeri e gratuiti che funzionano magnificamente nel browser senza occupare la memoria del dispositivo.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {PRESET_CATALOG.map((preset, idx) => {
                const isAlreadyAdded = webApps.some(a => a.name === preset.name);
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border flex flex-col justify-between ${
                      isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div>
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-2 shadow-xs"
                        style={{ backgroundColor: preset.color }}
                      >
                        <AppIcon name={preset.icon} className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-semibold text-sm truncate">{preset.name}</h4>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{preset.url}</p>
                      <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-400">
                        {preset.category}
                      </span>
                    </div>

                    <button
                      disabled={isAlreadyAdded}
                      onClick={() => handleInstallPreset(preset)}
                      className={`mt-4 py-1.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                        isAlreadyAdded
                          ? 'bg-slate-500/20 text-slate-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                      }`}
                    >
                      {isAlreadyAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Già Aggiunta</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Aggiungi al Desktop</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
