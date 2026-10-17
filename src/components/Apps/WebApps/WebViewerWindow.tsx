import React, { useState } from 'react';
import {
  RotateCcw,
  ExternalLink,
  Copy,
  Check,
  ShieldAlert,
  Globe,
  Home,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { useOS } from '../../../context/OSContext';

interface WebViewerWindowProps {
  customData?: {
    url?: string;
    appName?: string;
  };
}

export const WebViewerWindow: React.FC<WebViewerWindowProps> = ({ customData }) => {
  const initialUrl = customData?.url || 'https://it.wikipedia.org';
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const [inputUrl, setInputUrl] = useState(initialUrl);
  const [iframeKey, setIframeKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showIframeNotice, setShowIframeNotice] = useState(true);
  const { settings } = useOS();

  const isDark = settings.theme === 'dark';

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let url = inputUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    setCurrentUrl(url);
    setInputUrl(url);
    setIframeKey(prev => prev + 1);
  };

  const handleRefresh = () => {
    setIframeKey(prev => prev + 1);
  };

  const handleOpenExternal = () => {
    window.open(currentUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex flex-col h-full ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-800'}`}>
      {/* Browser Navigation Bar */}
      <div className={`flex items-center gap-2 px-3 py-2 border-b text-xs ${
        isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-200'
      }`}>
        <button
          onClick={() => {
            setCurrentUrl(initialUrl);
            setInputUrl(initialUrl);
            setIframeKey(prev => prev + 1);
          }}
          className={`p-1.5 rounded transition-colors ${
            isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-200 text-slate-700'
          }`}
          title="Pagina iniziale"
        >
          <Home className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleRefresh}
          className={`p-1.5 rounded transition-colors ${
            isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-200 text-slate-700'
          }`}
          title="Ricarica"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* URL Input */}
        <form onSubmit={handleNavigate} className="flex-1 flex items-center">
          <div className={`flex items-center gap-2 w-full px-2.5 py-1 rounded-lg border text-xs ${
            isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
          }`}>
            <Globe className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Inserisci indirizzo web (https://...)"
              className="w-full bg-transparent border-none outline-none text-xs truncate"
            />
          </div>
        </form>

        {/* Action Controls */}
        <button
          onClick={handleCopy}
          className={`p-1.5 rounded transition-colors ${
            isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-200 text-slate-700'
          }`}
          title="Copia indirizzo"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={handleOpenExternal}
          className="p-1.5 px-2.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-1 transition-colors text-xs shadow-xs"
          title="Apri in una nuova scheda del browser del tablet"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Nuova Scheda</span>
        </button>
      </div>

      {/* Notice bar for external websites CSP / iframe limitations */}
      {showIframeNotice && (
        <div className="bg-blue-500/10 border-b border-blue-500/20 px-3 py-1.5 text-[11px] text-blue-400 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-blue-400" />
            <span className="truncate">
              Alcuni siti esterni (es. Google, YouTube) limitano la visualizzazione in riquadro. Usa "Nuova Scheda" se la pagina rimane vuota.
            </span>
          </div>
          <button
            onClick={() => setShowIframeNotice(false)}
            className="text-blue-400/70 hover:text-blue-400 text-xs ml-2 px-1 font-semibold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Web Page Viewport */}
      <div className="flex-1 w-full h-full relative bg-white">
        <iframe
          key={iframeKey}
          src={currentUrl}
          title={customData?.appName || 'Web Viewer'}
          className="w-full h-full border-none"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
};
