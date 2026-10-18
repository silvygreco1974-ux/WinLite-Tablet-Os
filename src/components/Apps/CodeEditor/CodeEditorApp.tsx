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
  Maximize2,
  Wand2,
  Palette
} from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-markup';
import { useOS } from '../../../context/OSContext';

interface CodeEditorAppProps {
  customData?: {
    fileId?: string;
  };
}

type EditorTheme = 'vscode-dark' | 'studio-light' | 'monokai';

export const CodeEditorApp: React.FC<CodeEditorAppProps> = ({ customData }) => {
  const { files, addFile, updateFile, settings } = useOS();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [currentFileId, setCurrentFileId] = useState<string | null>(customData?.fileId || null);
  const [fileName, setFileName] = useState('script.js');
  const [language, setLanguage] = useState<'javascript' | 'html' | 'css' | 'json' | 'python'>('javascript');
  const [editorTheme, setEditorTheme] = useState<EditorTheme>(settings.theme === 'light' ? 'studio-light' : 'vscode-dark');
  const [fontSize, setFontSize] = useState<number>(16);

  const [code, setCode] = useState<string>(
`// Benvenuto in Code Studio su tablet!
// Il codice ora è ad alto contrasto con colori vivaci per ogni token.

function calcolaFibonacci(n) {
  const sequenza = [0, 1];
  for (let i = 2; i < n; i++) {
    sequenza.push(sequenza[i - 1] + sequenza[i - 2]);
  }
  return sequenza;
}

const limite = 10;
const risultato = calcolaFibonacci(limite);

console.log("🚀 Risultato sequenza Fibonacci (primi 10 numeri):");
console.log(risultato);
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
  const currentAccent = settings.accentColor || '#0078d4';

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

  // Synchronize scrolling between textarea and pre highlight layer
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (preRef.current) {
      preRef.current.scrollTop = e.currentTarget.scrollTop;
      preRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

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
          logs.push({ type: 'info', text: '✓ Esecuzione completata con successo (nessun log emesso).', time: timestamp });
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
      logs.push({
        type: 'info',
        text: `File ${language.toUpperCase()} salvato e pronto. Anteprima live attiva per HTML/CSS/JS.`,
        time: timestamp
      });
      setConsoleLogs(logs);
    }
  }, [language, code, activeTab]);

  // Format code (Beautify)
  const formatCode = () => {
    if (language === 'json') {
      try {
        const parsed = JSON.parse(code);
        setCode(JSON.stringify(parsed, null, 2));
        setIsSaved(false);
      } catch {
        // ignore invalid json
      }
    } else {
      // Basic indentation cleanup
      const lines = code.split('\n');
      let indent = 0;
      const formatted = lines.map(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('}') || trimmed.startsWith(']') || trimmed.startsWith(')')) {
          indent = Math.max(0, indent - 1);
        }
        const currentIndent = '  '.repeat(indent);
        if (trimmed.endsWith('{') || trimmed.endsWith('[') || trimmed.endsWith('(')) {
          indent++;
        }
        return trimmed ? currentIndent + trimmed : '';
      }).join('\n');
      setCode(formatted);
      setIsSaved(false);
    }
  };

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

  const handleNew = () => {
    if (!isSaved && !confirm('Creare un nuovo file? Le modifiche non salvate andranno perse.')) {
      return;
    }
    setCurrentFileId(null);
    setFileName('script.js');
    setLanguage('javascript');
    setCode('// Nuovo script\nconsole.log("Ciao da tablet!");\n');
    setIsSaved(true);
    setConsoleLogs([]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    let ext = 'js';
    if (language === 'html') ext = 'html';
    else if (language === 'css') ext = 'css';
    else if (language === 'json') ext = 'json';
    else if (language === 'python') ext = 'py';

    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.includes('.') ? fileName : `${fileName}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const applyTemplate = (lang: typeof language, templateName: string, templateCode: string) => {
    setLanguage(lang);
    setFileName(templateName);
    setCode(templateCode);
    setIsSaved(false);
    setShowTemplatesModal(false);
    setConsoleLogs([]);
  };

  // Get highlighted HTML for Prism
  const getHighlightedHtml = () => {
    let prismLang = language as string;
    if (language === 'html') prismLang = 'markup';
    const grammar = Prism.languages[prismLang] || Prism.languages.javascript;
    try {
      return Prism.highlight(code, grammar, prismLang);
    } catch {
      return code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
  };

  const lineCount = code.split('\n').length;
  const codeFiles = files.filter(f => f.type === 'code' || f.folder === 'code');

  // Theme styling for editor surface
  const getEditorThemeStyles = () => {
    switch (editorTheme) {
      case 'studio-light':
        return {
          bg: '#FCFBF9', // Natural soft canvas
          gutterBg: '#F3EFE8',
          gutterBorder: '#E2DDD4',
          gutterColor: '#64748B',
          textColor: '#1E293B',
          caretColor: currentAccent,
        };
      case 'monokai':
        return {
          bg: '#272822',
          gutterBg: '#1e1f1c',
          gutterBorder: '#3e3d32',
          gutterColor: '#75715e',
          textColor: '#f8f8f2',
          caretColor: '#f92672',
        };
      case 'vscode-dark':
      default:
        return {
          bg: '#1E222B', // Warm dark slate, zero harsh pitch-black glare
          gutterBg: '#171A21',
          gutterBorder: '#2E3544',
          gutterColor: '#8392A5',
          textColor: '#E2E8F0',
          caretColor: '#38BDF8',
        };
    }
  };

  const themeStyles = getEditorThemeStyles();

  return (
    <div className={`flex flex-col h-full select-none ${isDark ? 'bg-[#1c212d] text-[#e2e8f0]' : 'bg-[#ffffff] text-[#1e293b]'}`}>
      {/* Top Action Ribbon */}
      <div className={`flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b text-sm shrink-0 ${
        isDark ? 'bg-[#242a38] border-[#364154]' : 'bg-[#f8fafc] border-[#e2e8f0] text-slate-900'
      }`}>
        {/* Left: File Name & Language Selector */}
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Code2 className="w-4 h-4 shrink-0" style={{ color: currentAccent }} />
          <input
            type="text"
            value={fileName}
            onChange={(e) => {
              setFileName(e.target.value);
              setIsSaved(false);
            }}
            placeholder="script.js"
            className={`font-bold font-mono bg-transparent border-b border-dashed border-transparent hover:border-slate-400 focus:outline-none px-1.5 py-0.5 rounded truncate max-w-xs transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          />

          <select
            value={language}
            onChange={(e) => {
              const newLang = e.target.value as any;
              setLanguage(newLang);
              if (!fileName.includes('.')) {
                setFileName(`file.${newLang === 'javascript' ? 'js' : newLang === 'python' ? 'py' : newLang}`);
              }
            }}
            className={`px-2 py-1 rounded-lg border text-xs font-semibold outline-none cursor-pointer ${
              isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <option value="javascript">JavaScript (JS)</option>
            <option value="html">HTML5 + CSS/JS</option>
            <option value="css">CSS3 Foglio Stile</option>
            <option value="json">JSON Dati</option>
            <option value="python">Python (Py)</option>
          </select>

          <span className="text-[11px] font-semibold opacity-70">
            {isSaved ? '· Salvato' : '· Modificato'}
          </span>
        </div>

        {/* Center/Right: Actions */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Esegui Button */}
          <button
            onClick={runCode}
            style={{ backgroundColor: currentAccent }}
            className="px-3 py-1.5 rounded-lg text-white font-bold flex items-center gap-1.5 transition-opacity hover:opacity-90 shadow-sm"
            title="Esegui il codice ed emetti logs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Esegui</span>
          </button>

          {/* Salva Button */}
          <button
            onClick={handleSave}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1 font-semibold transition-colors ${
              isDark ? 'border-slate-700 hover:bg-slate-700 text-slate-200' : 'border-slate-300 hover:bg-slate-300 text-slate-800'
            }`}
            title="Salva file di codice"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Salva</span>
          </button>

          <button
            onClick={handleNew}
            className={`p-1.5 px-2 rounded-lg transition-colors flex items-center gap-1 font-medium ${
              isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-300 text-slate-800'
            }`}
            title="Nuovo File"
          >
            <span className="hidden sm:inline">Nuovo</span>
          </button>

          <button
            onClick={() => setShowOpenModal(true)}
            className={`p-1.5 px-2 rounded-lg transition-colors flex items-center gap-1 font-medium ${
              isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-300 text-slate-800'
            }`}
            title="Apri file salvato"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Apri</span>
          </button>

          <button
            onClick={formatCode}
            className={`p-1.5 px-2 rounded-lg transition-colors flex items-center gap-1 font-medium ${
              isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-300 text-slate-800'
            }`}
            title="Formatta e indenta codice automaticamente"
          >
            <Wand2 className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden md:inline">Formatta</span>
          </button>

          <button
            onClick={() => setShowTemplatesModal(true)}
            className={`p-1.5 px-2 rounded-lg transition-colors flex items-center gap-1 font-medium ${
              isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-300 text-slate-800'
            }`}
            title="Modelli di codice pronti"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden md:inline">Template</span>
          </button>

          <div className="h-4 w-px bg-slate-500/20 mx-0.5" />

          {/* Theme Selector (Vivid Dark, Studio Light, Monokai) */}
          <div className="flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={editorTheme}
              onChange={(e) => setEditorTheme(e.target.value as EditorTheme)}
              className={`px-2 py-1 rounded-lg border text-xs font-semibold outline-none cursor-pointer ${
                isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
              title="Tema colori editor"
            >
              <option value="vscode-dark">🌙 VS Code Vivid (Scuro Contrasto)</option>
              <option value="studio-light">☀️ Studio Light (Chiaro Contrasto)</option>
              <option value="monokai">🎨 Monokai Neon</option>
            </select>
          </div>

          {/* Font Size Selector */}
          <select
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className={`px-2.5 py-1.5 rounded-xl border text-xs sm:text-sm font-mono outline-none cursor-pointer ${
              isDark ? 'bg-[#1c212d] border-[#364154] text-white' : 'bg-slate-50 border-[#e2e8f0] text-slate-900'
            }`}
            title="Dimensione font codice"
          >
            <option value={14}>14px (Compatto)</option>
            <option value={16}>16px (Predefinito)</option>
            <option value={18}>18px (Grande & Chiaro)</option>
            <option value={20}>20px (Molto Grande)</option>
            <option value={22}>22px (Maxi)</option>
          </select>

          {/* Copy & Download */}
          <button
            onClick={handleCopy}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-300 text-slate-800'
            }`}
            title="Copia codice"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleDownload}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-300 text-slate-800'
            }`}
            title="Scarica file sul dispositivo"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-slate-500/20 mx-0.5" />

          {/* Tabs: Codice / Diviso / Anteprima */}
          <div className={`flex rounded-xl p-0.5 border ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'
          }`}>
            <button
              onClick={() => setActiveTab('editor')}
              style={{
                backgroundColor: activeTab === 'editor' ? (isDark ? '#334155' : '#FFFFFF') : undefined,
                color: activeTab === 'editor' ? (isDark ? '#FFFFFF' : '#0F172A') : undefined
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors"
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
              style={{
                backgroundColor: activeTab === 'split' ? (isDark ? '#334155' : '#FFFFFF') : undefined,
                color: activeTab === 'split' ? (isDark ? '#FFFFFF' : '#0F172A') : undefined
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors"
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
              style={{
                backgroundColor: activeTab === 'preview' ? (isDark ? '#334155' : '#FFFFFF') : undefined,
                color: activeTab === 'preview' ? (isDark ? '#FFFFFF' : '#0F172A') : undefined
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors"
            >
              Anteprima
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace (Editor + Terminal / Preview) */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Code Editor Panel with High Contrast Syntax Highlighting */}
        {(activeTab === 'editor' || activeTab === 'split') && (
          <div className={`flex-1 flex flex-col min-w-0 ${activeTab === 'split' ? 'border-r border-slate-500/20' : ''}`}>
            <div
              className={`flex-1 flex overflow-hidden font-mono theme-${editorTheme}`}
              style={{ backgroundColor: themeStyles.bg }}
            >
              {/* Line Numbers Gutter */}
              <div
                style={{
                  backgroundColor: themeStyles.gutterBg,
                  borderColor: themeStyles.gutterBorder,
                  color: themeStyles.gutterColor,
                  fontSize: `${fontSize - 2}px`,
                  lineHeight: `${fontSize * 1.6}px`,
                }}
                className="w-12 py-3 px-1 text-right select-none shrink-0 font-mono border-r overflow-hidden"
              >
                {Array.from({ length: Math.max(lineCount, 20) }, (_, i) => (
                  <div key={i + 1}>
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Code Canvas Container with Synchronized Prism Syntax Layer */}
              <div className="flex-1 relative overflow-hidden">
                {/* Highlighted Prism Code Layer (Underneath) */}
                <pre
                  ref={preRef}
                  aria-hidden="true"
                  style={{
                    fontSize: `${fontSize}px`,
                    lineHeight: `${fontSize * 1.6}px`,
                    fontFamily: '"JetBrains Mono", Consolas, "Courier New", monospace',
                    tabSize: 2,
                  }}
                  className={`absolute inset-0 p-3 m-0 pointer-events-none select-none overflow-hidden whitespace-pre font-mono theme-${editorTheme}`}
                >
                  <code
                    className={`language-${language}`}
                    dangerouslySetInnerHTML={{ __html: getHighlightedHtml() + '\n' }}
                  />
                </pre>

                {/* Transparent Interactive Textarea (Foreground) */}
                <textarea
                  ref={textareaRef}
                  value={code}
                  onChange={handleCodeChange}
                  onKeyDown={handleKeyDown}
                  onScroll={handleScroll}
                  spellCheck={false}
                  placeholder="Scrivi qui il tuo codice..."
                  style={{
                    fontSize: `${fontSize}px`,
                    lineHeight: `${fontSize * 1.6}px`,
                    fontFamily: '"JetBrains Mono", Consolas, "Courier New", monospace',
                    caretColor: themeStyles.caretColor,
                    tabSize: 2,
                    WebkitTextFillColor: 'transparent', // Makes textarea text invisible so Prism shows through perfectly
                  }}
                  className="absolute inset-0 w-full h-full p-3 font-mono leading-relaxed resize-none outline-none border-none bg-transparent whitespace-pre overflow-auto select-text selection:bg-blue-500/30"
                />
              </div>
            </div>

            {/* Bottom Console Panel for Editor View */}
            <div className={`h-40 border-t flex flex-col shrink-0 ${
              isDark ? 'bg-[#181B22] border-[#2E3544]' : 'bg-[#F8FAFC] border-[#E2E8F0]'
            }`}>
              <div className="flex items-center justify-between px-3.5 py-2 border-b border-slate-500/15 text-xs font-mono">
                <div className="flex items-center gap-2 font-bold">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Terminale / Output Esecuzione</span>
                </div>
                <button
                  onClick={() => setConsoleLogs([])}
                  className="text-slate-400 hover:text-slate-200 transition-colors px-2 py-0.5 rounded hover:bg-slate-500/10"
                >
                  Pulisci
                </button>
              </div>
              <div className="flex-1 p-3 overflow-auto font-mono text-xs sm:text-sm space-y-1.5">
                {consoleLogs.length === 0 ? (
                  <div className="text-slate-500 italic py-2">
                    Nessun output ancora. Premi "Esegui" in alto per eseguire il codice o testare la logica.
                  </div>
                ) : (
                  consoleLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-2 ${
                        log.type === 'error'
                          ? 'text-red-400 font-bold'
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
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-100 border-b border-slate-300 text-xs text-slate-800">
              <div className="flex items-center gap-1.5 font-bold">
                <Eye className="w-3.5 h-3.5" style={{ color: currentAccent }} />
                <span>Sandbox Live Preview</span>
              </div>
              <button
                onClick={() => {
                  if (iframeRef.current) {
                    iframeRef.current.srcdoc = code;
                  }
                }}
                className="p-1 hover:bg-slate-200 rounded text-slate-700 transition-colors"
                title="Ricarica Anteprima"
              >
                <RotateCcw className="w-3.5 h-3.5" />
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
      <div className={`flex items-center justify-between px-3 py-1.5 border-t text-[11px] font-mono shrink-0 font-medium ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-200 border-slate-300 text-slate-700'
      }`}>
        <div className="flex items-center gap-3">
          <span>{lineCount} righe</span>
          <span>·</span>
          <span>{code.length} caratteri</span>
          <span>·</span>
          <span>Indice 2 Spazi</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="uppercase font-bold">{language}</span>
          <span>·</span>
          <span className="text-emerald-500 font-semibold">Live Sandbox Attivo</span>
        </div>
      </div>

      {/* Open Code Modal */}
      {showOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-md p-5 rounded-2xl border shadow-2xl ${
            isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
          }`}>
            <h3 className="text-base font-bold mb-3">Apri File di Codice</h3>
            <div className="max-h-60 overflow-y-auto space-y-1.5 mb-4">
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
                    className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-colors ${
                      isDark ? 'border-slate-700 hover:bg-slate-700' : 'border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Code2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-xs font-semibold truncate">{file.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono shrink-0">
                      .{file.extension} · {Math.round(file.size / 1024 * 10) / 10} KB
                    </span>
                  </button>
                ))
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowOpenModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-400/30 hover:bg-slate-500/10"
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
          <div className={`w-full max-w-lg p-5 rounded-2xl border shadow-2xl ${
            isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Template di Codice</span>
              </h3>
              <button onClick={() => setShowTemplatesModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 max-h-72 overflow-y-auto">
              <button
                onClick={() => applyTemplate(
                  'html',
                  'card_interattiva.html',
                  `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: system-ui, sans-serif;
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f172a, #1e293b);
      color: white;
    }
    .card {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 30px;
      border-radius: 24px;
      max-width: 320px;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    button {
      background: #0078d4;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 12px;
      font-weight: bold;
      cursor: pointer;
      margin-top: 15px;
    }
  </style>
</head>
<body>
  <div class="card">
    <h2>WinLite Web App</h2>
    <p>Creato direttamente nel tablet OS con anteprima immediata!</p>
    <button onclick="alert('Ciao dal pulsante!')">Cliccami!</button>
  </div>
</body>
</html>`
                )}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  isDark ? 'border-slate-700 hover:bg-slate-700' : 'border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-xs mb-1">🌐 Scheda HTML5 Glassmorphism</div>
                <div className="text-[11px] text-slate-400">Design moderno con CSS e animazioni</div>
              </button>

              <button
                onClick={() => applyTemplate(
                  'javascript',
                  'gestione_dati.js',
                  `// Array e funzioni di ordine superiore in JavaScript
const utenti = [
  { id: 1, nome: "Silvia", ruolo: "Admin", accessi: 42 },
  { id: 2, nome: "Marco", ruolo: "Developer", accessi: 19 },
  { id: 3, nome: "Elena", ruolo: "Designer", accessi: 31 }
];

const totaleAccessi = utenti.reduce((sum, u) => sum + u.accessi, 0);
console.log("Totale accessi:", totaleAccessi);

const attivi = utenti.filter(u => u.accessi > 20);
console.log("Utenti più attivi:", attivi);`
                )}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  isDark ? 'border-slate-700 hover:bg-slate-700' : 'border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-xs mb-1">⚡ Script Dati JavaScript</div>
                <div className="text-[11px] text-slate-400">Filter, map, reduce ed esecuzione console</div>
              </button>

              <button
                onClick={() => applyTemplate(
                  'json',
                  'configurazioni.json',
                  `{
  "nomeApp": "WinLite Tablet OS",
  "versione": "1.2.0",
  "touchOttimizzato": true,
  "impostazioni": {
    "tema": "fluente",
    "contrasto": "alto",
    "animazioni": true
  },
  "moduli": [
    "TextEditor",
    "CodeStudio",
    "FileExplorer"
  ]
}`
                )}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  isDark ? 'border-slate-700 hover:bg-slate-700' : 'border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-xs mb-1">📋 Schema Configurazione JSON</div>
                <div className="text-[11px] text-slate-400">Struttura dati validata</div>
              </button>

              <button
                onClick={() => applyTemplate(
                  'python',
                  'algoritmi.py',
                  `# Algoritmo di ordinamento rapido (Quicksort)
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

numeri = [64, 34, 25, 12, 22, 11, 90]
print("Array originale:", numeri)
print("Array ordinato:", quicksort(numeri))
`
                )}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  isDark ? 'border-slate-700 hover:bg-slate-700' : 'border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-xs mb-1">🐍 Algoritmo Python</div>
                <div className="text-[11px] text-slate-400">Sintassi Python colorata</div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
