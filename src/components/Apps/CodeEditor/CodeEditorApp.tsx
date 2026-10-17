import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  RotateCcw,
  Save,
  Download,
  Copy,
  Check,
  FolderOpen,
  FileCode,
  Terminal,
  Eye,
  Code2,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { useOS } from '../../../context/OSContext';

interface CodeEditorAppProps {
  customData?: {
    fileId?: string;
  };
}

export const CodeEditorApp: React.FC<CodeEditorAppProps> = ({ customData }) => {
  const { files, addFile, updateFile, settings } = useOS();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [currentFileId, setCurrentFileId] = useState<string | null>(customData?.fileId || null);
  const [fileName, setFileName] = useState('script.js');
  const [language, setLanguage] = useState<'javascript' | 'html' | 'css' | 'json' | 'python'>('javascript');
  const [code, setCode] = useState<string>(
`// Benvenuto in Code Studio su tablet!
// Nessun compilatore pesante da installare: esegui direttamente qui.

function calcolaFibonacci(n) {
  const seq = [0, 1];
  for (let i = 2; i < n; i++) {
    seq.push(seq[i - 1] + seq[i - 2]);
  }
  return seq;
}

console.log("🚀 Risultato sequenza Fibonacci (primi 10 numeri):");
console.log(calcolaFibonacci(10));
console.log("✨ Data e ora:", new Date().toLocaleString('it-IT'));
`
  );

  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'split'>('editor');
  const [consoleLogs, setConsoleLogs] = useState<{ type: 'log' | 'error' | 'info'; text: string; time: string }[]>([]);
  const [isSaved, setIsSaved] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);

  const isDark = settings.theme === 'dark';

  // Load existing file if fileId provided
  useEffect(() => {
    if (currentFileId) {
      const file = files.find(f => f.id === currentFileId);
      if (file) {
        setFileName(file.name);
        setCode(file.content);
        if (file.language && ['javascript', 'html', 'css', 'json', 'python'].includes(file.language)) {
          setLanguage(file.language as any);
        } else if (file.extension === 'html') {
          setLanguage('html');
        } else if (file.extension === 'css') {
          setLanguage('css');
        } else if (file.extension === 'json') {
          setLanguage('json');
        } else if (file.extension === 'py') {
          setLanguage('python');
        }
        setIsSaved(true);
      }
    }
  }, [currentFileId, files]);

  // Tab key interception for indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      setIsSaved(false);

      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
    setIsSaved(false);
  };

  // Run code / execute sandbox
  const runCode = useCallback(() => {
    const timestamp = new Date().toLocaleTimeString('it-IT');
    const logs: { type: 'log' | 'error' | 'info'; text: string; time: string }[] = [];

    if (language === 'html' || code.includes('<html') || code.includes('<!DOCTYPE')) {
      if (activeTab === 'editor') {
        setActiveTab('preview');
      }
      if (iframeRef.current) {
        iframeRef.current.srcdoc = code;
      }
      logs.push({ type: 'info', text: '▶ Anteprima HTML caricata nel renderer sandbox.', time: timestamp });
      setConsoleLogs(logs);
      return;
    }

    if (language === 'javascript') {
      try {
        const customLogs: string[] = [];
        const sandboxConsole = {
          log: (...args: any[]) => {
            const msg = args.map(a => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' ');
            customLogs.push(msg);
            logs.push({ type: 'log', text: msg, time: new Date().toLocaleTimeString('it-IT') });
          },
          error: (...args: any[]) => {
            const msg = args.map(a => String(a)).join(' ');
            logs.push({ type: 'error', text: msg, time: new Date().toLocaleTimeString('it-IT') });
          },
          warn: (...args: any[]) => {
            const msg = args.map(a => String(a)).join(' ');
            logs.push({ type: 'info', text: msg, time: new Date().toLocaleTimeString('it-IT') });
          }
        };

        // Run JavaScript safely
        const runner = new Function('console', code);
        runner(sandboxConsole);
        if (logs.length === 0) {
          logs.push({ type: 'info', text: '✓ Esecuzione completata con successo (nessun console.log emesso).', time: timestamp });
        }
      } catch (err: any) {
        logs.push({ type: 'error', text: `Errore di sintassi / esecuzione: ${err?.message || String(err)}`, time: timestamp });
      }
      setConsoleLogs(logs);
    } else if (language === 'json') {
      try {
        JSON.parse(code);
        logs.push({ type: 'info', text: '✓ JSON valido al 100%! Nessun errore di sintassi.', time: timestamp });
      } catch (err: any) {
        logs.push({ type: 'error', text: `Errore JSON: ${err.message}`, time: timestamp });
      }
      setConsoleLogs(logs);
    } else {
      logs.push({ type: 'info', text: `✓ Visualizzazione per linguaggio ${language.toUpperCase()}. Usa l'anteprima o esporta il file.`, time: timestamp });
      setConsoleLogs(logs);
    }
  }, [code, language, activeTab]);

  // Run on first load
  useEffect(() => {
    runCode();
  }, []);

  const handleSave = () => {
    let ext = 'js';
    if (language === 'html') ext = 'html';
    else if (language === 'css') ext = 'css';
    else if (language === 'json') ext = 'json';
    else if (language === 'python') ext = 'py';

    if (currentFileId) {
      updateFile(currentFileId, code, fileName);
    } else {
      const newFile = addFile(fileName, code, 'code', ext, language, 'code');
      setCurrentFileId(newFile.id);
    }
    setIsSaved(true);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCode = () => {
    try {
      if (language === 'json') {
        const parsed = JSON.parse(code);
        setCode(JSON.stringify(parsed, null, 2));
        setIsSaved(false);
      }
    } catch {
      // ignore
    }
  };

  const applyTemplate = (tplLang: typeof language, tplName: string, tplCode: string) => {
    setLanguage(tplLang);
    setFileName(tplName);
    setCode(tplCode);
    setIsSaved(false);
    setShowTemplatesModal(false);
    if (tplLang === 'html') {
      setActiveTab('split');
    } else {
      setActiveTab('editor');
    }
  };

  const lineCount = code.split('\n').length;
  const codeFiles = files.filter(f => f.type === 'code' || f.folder === 'code');

  return (
    <div className={`flex flex-col h-full ${isDark ? 'bg-[#181d28] text-slate-100' : 'bg-white text-slate-800'}`}>
      {/* Top Code Bar */}
      <div className={`flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b text-xs ${
        isDark ? 'bg-[#131722] border-slate-700/80' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <FileCode className="w-4 h-4 text-emerald-500 shrink-0" />
          <input
            type="text"
            value={fileName}
            onChange={(e) => {
              setFileName(e.target.value);
              setIsSaved(false);
            }}
            placeholder="script.js"
            className={`font-mono text-xs bg-transparent border-b border-dashed border-transparent hover:border-emerald-400 focus:border-emerald-500 focus:outline-none px-1 py-0.5 rounded transition-colors ${
              isDark ? 'text-emerald-400' : 'text-emerald-700 font-semibold'
            }`}
          />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className={`px-2 py-1 rounded text-xs font-mono font-medium outline-none border ${
              isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
            }`}
          >
            <option value="javascript">JavaScript (JS)</option>
            <option value="html">HTML5 + CSS + JS</option>
            <option value="css">CSS3</option>
            <option value="json">JSON</option>
            <option value="python">Python</option>
          </select>
          <span className="text-[11px] text-slate-400">
            {isSaved ? '· Salvato' : '· Modificato'}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Run button */}
          <button
            onClick={runCode}
            className="p-1.5 px-3 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center gap-1.5 transition-colors shadow-sm"
            title="Esegui Codice / Avvia Sandbox"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="font-semibold">Esegui</span>
          </button>

          <button
            onClick={handleSave}
            className="p-1.5 px-2.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-1 transition-colors shadow-sm"
            title="Salva file nel tablet OS"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Salva</span>
          </button>

          <button
            onClick={() => setShowOpenModal(true)}
            className={`p-1.5 rounded transition-colors flex items-center gap-1 ${
              isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-700'
            }`}
            title="Apri file salvato"
          >
            <FolderOpen className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowTemplatesModal(true)}
            className={`p-1.5 rounded transition-colors flex items-center gap-1 ${
              isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-700'
            }`}
            title="Esempi & Template"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden md:inline">Esempi</span>
          </button>

          <button
            onClick={handleDownload}
            className={`p-1.5 rounded transition-colors ${
              isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-700'
            }`}
            title="Scarica file su tablet"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCopy}
            className={`p-1.5 rounded transition-colors ${
              isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-700'
            }`}
            title="Copia codice"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {language === 'json' && (
            <button
              onClick={formatCode}
              className={`p-1.5 rounded transition-colors ${
                isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-700'
              }`}
              title="Formatta JSON"
            >
              Formatta
            </button>
          )}

          {/* View Mode Switcher */}
          <div className={`flex items-center p-0.5 rounded border ml-1 ${
            isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-200/80 border-slate-300'
          }`}>
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                activeTab === 'editor'
                  ? isDark ? 'bg-slate-700 text-white shadow-xs' : 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Codice
            </button>
            <button
              onClick={() => {
                setActiveTab('split');
                if (iframeRef.current && (language === 'html' || code.includes('<html'))) {
                  iframeRef.current.srcdoc = code;
                }
              }}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                activeTab === 'split'
                  ? isDark ? 'bg-slate-700 text-white shadow-xs' : 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Diviso
            </button>
            <button
              onClick={() => {
                setActiveTab('preview');
                if (iframeRef.current && (language === 'html' || code.includes('<html'))) {
                  iframeRef.current.srcdoc = code;
                }
              }}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                activeTab === 'preview'
                  ? isDark ? 'bg-slate-700 text-white shadow-xs' : 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Anteprima
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace (Editor + Preview/Console) */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Code Editor Panel */}
        {(activeTab === 'editor' || activeTab === 'split') && (
          <div className={`flex-1 flex flex-col min-w-0 ${activeTab === 'split' ? 'border-r border-slate-700/60' : ''}`}>
            <div className="flex-1 flex overflow-hidden font-mono text-xs sm:text-sm">
              {/* Line Numbers */}
              <div className={`w-11 py-3 px-1 text-right select-none text-[11px] shrink-0 font-mono ${
                isDark ? 'bg-[#11141c] text-slate-600' : 'bg-slate-100 text-slate-400 border-r border-slate-200'
              }`}>
                {Array.from({ length: Math.max(lineCount, 15) }, (_, i) => (
                  <div key={i + 1} className="leading-6">
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Textarea */}
              <div className="flex-1 relative overflow-auto">
                <textarea
                  ref={textareaRef}
                  value={code}
                  onChange={handleCodeChange}
                  onKeyDown={handleKeyDown}
                  spellCheck={false}
                  placeholder="Scrivi qui il tuo codice..."
                  className={`w-full h-full p-3 font-mono text-xs sm:text-sm leading-6 resize-none outline-none border-none whitespace-pre ${
                    isDark ? 'bg-[#181d28] text-slate-200 placeholder-slate-600' : 'bg-white text-slate-900 placeholder-slate-400'
                  }`}
                  style={{ tabSize: 2 }}
                />
              </div>
            </div>

            {/* Bottom Console Panel for Editor View */}
            <div className={`h-36 border-t flex flex-col shrink-0 ${
              isDark ? 'bg-[#11141c] border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-700/40 text-[11px] font-mono">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Terminale / Console Output</span>
                </div>
                <button
                  onClick={() => setConsoleLogs([])}
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Pulisci
                </button>
              </div>
              <div className="flex-1 p-2 overflow-auto font-mono text-xs space-y-1">
                {consoleLogs.length === 0 ? (
                  <div className="text-slate-500 italic py-2">Nessun output ancora. Premi "Esegui" per eseguire il codice.</div>
                ) : (
                  consoleLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-2 ${
                        log.type === 'error'
                          ? 'text-red-400'
                          : log.type === 'info'
                          ? 'text-blue-400'
                          : isDark ? 'text-emerald-300' : 'text-emerald-700'
                      }`}
                    >
                      <span className="text-[10px] text-slate-500 shrink-0">[{log.time}]</span>
                      <pre className="font-mono whitespace-pre-wrap break-all flex-1">{log.text}</pre>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Live Preview Panel (Sandbox iframe for HTML/CSS/JS) */}
        {(activeTab === 'preview' || activeTab === 'split') && (
          <div className="flex-1 flex flex-col min-w-0 bg-white">
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-100 border-b border-slate-200 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 font-medium">
                <Eye className="w-3.5 h-3.5 text-blue-500" />
                <span>Sandbox Live Preview</span>
              </div>
              <button
                onClick={() => {
                  if (iframeRef.current) {
                    iframeRef.current.srcdoc = code;
                  }
                }}
                className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors"
                title="Ricarica Anteprima"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
            <iframe
              ref={iframeRef}
              title="Live Sandbox"
              sandbox="allow-scripts allow-modals"
              className="flex-1 w-full h-full border-none bg-white"
            />
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className={`flex items-center justify-between px-3 py-1 border-t text-[11px] font-mono ${
        isDark ? 'bg-[#11141c] border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
      }`}>
        <div className="flex items-center gap-3">
          <span>{lineCount} righe</span>
          <span>·</span>
          <span>{code.length} caratteri</span>
          <span>·</span>
          <span>Spazi: 2</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{language.toUpperCase()}</span>
          <span>·</span>
          <span className="text-emerald-500">Live Sandbox Ready</span>
        </div>
      </div>

      {/* Open Code Modal */}
      {showOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-md p-5 rounded-xl border shadow-2xl ${
            isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-base font-semibold mb-3">Apri File di Codice</h3>
            <div className="max-h-60 overflow-y-auto space-y-1 mb-4">
              {codeFiles.length === 0 ? (
                <p className="text-sm text-slate-400 py-3 text-center">Nessun file di codice salvato.</p>
              ) : (
                codeFiles.map(file => (
                  <button
                    key={file.id}
                    onClick={() => {
                      setCurrentFileId(file.id);
                      setShowOpenModal(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between transition-colors ${
                      isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Code2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-sm font-medium truncate">{file.name}</span>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">
                      .{file.extension} · {Math.round(file.size / 1024 * 10) / 10} KB
                    </span>
                  </button>
                ))
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowOpenModal(false)}
                className="px-4 py-2 text-xs font-medium rounded-lg border border-slate-500/40 hover:bg-slate-500/20"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Templates Modal */}
      {showTemplatesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-lg p-5 rounded-xl border shadow-2xl ${
            isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-base font-semibold mb-3">Template di Codice</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => applyTemplate(
                  'html',
                  'interactive_card.html',
                  `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: system-ui, sans-serif;
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0f172a;
      color: white;
    }
    .card {
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 30px;
      border-radius: 20px;
      max-width: 320px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      background: #3b82f6;
      border-radius: 20px;
      font-size: 11px;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 15px;
    }
    button {
      background: #10b981;
      border: none;
      color: white;
      font-weight: bold;
      padding: 12px 24px;
      border-radius: 10px;
      cursor: pointer;
      width: 100%;
      margin-top: 15px;
      transition: 0.2s;
    }
    button:hover { background: #059669; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">Tablet Studio</div>
    <h2>Progetto Web</h2>
    <p style="color: #94a3b8; font-size: 14px;">Modifica questo HTML ed esegui per vedere le modifiche all'istante.</p>
    <button onclick="alert('Ciao dal tuo codice!')">Fai un Click</button>
  </div>
</body>
</html>`
                )}
                className={`p-3 rounded-lg border text-left transition-all hover:border-emerald-500 ${
                  isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="font-semibold text-sm mb-1 text-emerald-400">🌐 HTML5 Glass Card</div>
                <div className="text-xs text-slate-400">Design moderno con CSS e interattività JavaScript.</div>
              </button>

              <button
                onClick={() => applyTemplate(
                  'javascript',
                  'gioco_indovina.js',
                  `// Gioco: Indovina il numero segreto
const numeroSegreto = Math.floor(Math.random() * 100) + 1;
console.log("🎮 Generato numero segreto tra 1 e 100!");

function indovina(tentativo) {
  if (tentativo === numeroSegreto) {
    console.log("🎉 COMPLIMENTI! Hai indovinato:", numeroSegreto);
  } else if (tentativo < numeroSegreto) {
    console.log("📈 Troppo basso! Il numero è maggiore di", tentativo);
  } else {
    console.log("📉 Troppo alto! Il numero è minore di", tentativo);
  }
}

// Simuliamo alcuni tentativi:
indovina(50);
indovina(75);
indovina(numeroSegreto);
`
                )}
                className={`p-3 rounded-lg border text-left transition-all hover:border-emerald-500 ${
                  isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="font-semibold text-sm mb-1 text-emerald-400">⚡ Mini Gioco JS</div>
                <div className="text-xs text-slate-400">Script JavaScript con logica ed esecuzione console.</div>
              </button>

              <button
                onClick={() => applyTemplate(
                  'json',
                  'config_app.json',
                  `{
  "nomeApp": "WinLite Tablet",
  "versione": "1.0.0",
  "lingua": "it-IT",
  "caratteristiche": [
    "Zero impatto su memoria disco",
    "Editor testo e codice integrati",
    "Sticky notes da desktop",
    "Web apps preferite personalizzate"
  ],
  "prestazioni": {
    "memoriaUsataKB": 52,
    "velocitaCaricamento": "Istantanea"
  }
}`
                )}
                className={`p-3 rounded-lg border text-left transition-all hover:border-emerald-500 ${
                  isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="font-semibold text-sm mb-1 text-emerald-400">⚙️ Configurazione JSON</div>
                <div className="text-xs text-slate-400">Struttura dati JSON con validazione e formattazione.</div>
              </button>

              <button
                onClick={() => applyTemplate(
                  'python',
                  'statistiche.py',
                  `# Script di analisi dati in Python
def calcola_statistiche(numeri):
    media = sum(numeri) / len(numeri)
    massimo = max(numeri)
    minimo = min(numeri)
    return {
        "conteggio": len(numeri),
        "media": media,
        "massimo": massimo,
        "minimo": minimo
    }

dati = [12, 45, 68, 23, 89, 44, 91, 15]
print("Statistiche dati:", calcola_statistiche(dati))
`
                )}
                className={`p-3 rounded-lg border text-left transition-all hover:border-emerald-500 ${
                  isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="font-semibold text-sm mb-1 text-emerald-400">🐍 Script Python</div>
                <div className="text-xs text-slate-400">Esempio di script Python per calcoli e algoritmi.</div>
              </button>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowTemplatesModal(false)}
                className="px-4 py-2 text-xs font-medium rounded-lg border border-slate-500/40 hover:bg-slate-500/20"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
