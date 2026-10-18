import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Save,
  Download,
  FolderOpen,
  Printer,
  FilePlus,
  Copy,
  Check,
  FileText,
  Sparkles,
  Search,
  Calendar,
  Minus,
  Quote,
  Palette,
  ZoomIn,
  ZoomOut,
  Highlighter,
  CheckSquare
} from 'lucide-react';
import { useOS } from '../../../context/OSContext';

interface TextEditorAppProps {
  customData?: {
    fileId?: string;
  };
}

type PaperStyle = 'natural' | 'pure' | 'sepia' | 'sage' | 'blue' | 'lined' | 'dark';

export const TextEditorApp: React.FC<TextEditorAppProps> = ({ customData }) => {
  const { files, addFile, updateFile, settings } = useOS();
  const editorRef = useRef<HTMLDivElement>(null);

  const [currentFileId, setCurrentFileId] = useState<string | null>(customData?.fileId || null);
  const [docTitle, setDocTitle] = useState('Nuovo Documento');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [paragraphCount, setParagraphCount] = useState(1);
  const [isSaved, setIsSaved] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  // Additional options
  const [paperStyle, setPaperStyle] = useState<PaperStyle>('natural'); // Default to natural white!
  const [fontFamily, setFontFamily] = useState<string>('sans');
  const [fontSize, setFontSize] = useState<string>('16px');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMatches, setSearchMatches] = useState(0);

  const isDark = settings.theme === 'dark';
  const currentAccent = settings.accentColor || '#0078d4';

  // Load existing file if fileId provided
  useEffect(() => {
    if (currentFileId) {
      const file = files.find(f => f.id === currentFileId);
      if (file && editorRef.current) {
        setDocTitle(file.name);
        editorRef.current.innerHTML = file.content;
        updateCounts();
        setIsSaved(true);
      }
    }
  }, [currentFileId, files]);

  // If no file loaded and editor empty, start with clean state
  useEffect(() => {
    if (!currentFileId && editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = '<p>Inizia a scrivere qui il tuo testo, appunti o articolo...</p>';
      updateCounts();
    }
  }, [currentFileId]);

  const updateCounts = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || '';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0).length || 1;
    setWordCount(words);
    setCharCount(text.length);
    setParagraphCount(paragraphs);
  };

  const handleInput = () => {
    setIsSaved(false);
    updateCounts();
  };

  const execCmd = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
    handleInput();
  };

  const handleSave = useCallback(() => {
    if (!editorRef.current) return;
    const content = editorRef.current.innerHTML;

    if (currentFileId) {
      updateFile(currentFileId, content, docTitle);
    } else {
      const newFile = addFile(docTitle, content, 'document', 'html', 'html', 'documents');
      setCurrentFileId(newFile.id);
    }
    setIsSaved(true);
  }, [currentFileId, docTitle, updateFile, addFile]);

  const handleNew = () => {
    if (!isSaved && !confirm('Vuoi creare un nuovo documento? Le modifiche non salvate andranno perse.')) {
      return;
    }
    setCurrentFileId(null);
    setDocTitle('Documento ' + new Date().toLocaleDateString('it-IT'));
    if (editorRef.current) {
      editorRef.current.innerHTML = '<p><br></p>';
      editorRef.current.focus();
    }
    setIsSaved(true);
    updateCounts();
  };

  const handleInsertDate = () => {
    const now = new Date();
    const formatted = now.toLocaleDateString('it-IT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    execCmd('insertHTML', `<strong>${formatted}</strong> - `);
  };

  const handleInsertDivider = () => {
    execCmd('insertHorizontalRule');
  };

  const handleHighlight = (color: string) => {
    execCmd('hiliteColor', color);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim() || !editorRef.current) {
      setSearchMatches(0);
      return;
    }
    const text = editorRef.current.innerText || '';
    const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = text.match(regex);
    setSearchMatches(matches ? matches.length : 0);
  };

  const handleExportTxt = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docTitle.trim() || 'documento'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportMarkdown = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText;
    const blob = new Blob([`# ${docTitle}\n\n${text}`], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docTitle.trim() || 'documento'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportHtml = () => {
    if (!editorRef.current) return;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${docTitle}</title></head><body>${editorRef.current.innerHTML}</body></html>`;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docTitle.trim() || 'documento'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    if (!editorRef.current) return;
    navigator.clipboard.writeText(editorRef.current.innerText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyTemplate = (title: string, htmlContent: string) => {
    setDocTitle(title);
    if (editorRef.current) {
      editorRef.current.innerHTML = htmlContent;
    }
    setIsSaved(false);
    updateCounts();
    setShowTemplatesModal(false);
  };

  // Paper styling configuration for human eye comfort
  const getPaperStyles = () => {
    switch (paperStyle) {
      case 'natural': // Natural White (Warm natural paper `#FAF8F5`, soft ink text `#1E293B`)
        return {
          backgroundColor: '#FAF8F5',
          color: '#1E293B',
          borderColor: '#E2E8F0',
          boxShadow: '0 8px 30px -4px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
        };
      case 'sepia': // Warm Sepia / Amber Book
        return {
          backgroundColor: '#F8F3E8',
          color: '#34261B',
          borderColor: '#E7DCBE',
          boxShadow: '0 8px 30px -4px rgba(80, 50, 20, 0.08)',
        };
      case 'sage': // Relaxing Sage Green (clinically proven to reduce eye strain)
        return {
          backgroundColor: '#F1F6F2',
          color: '#1A2F22',
          borderColor: '#D4E2D7',
          boxShadow: '0 8px 30px -4px rgba(20, 60, 30, 0.07)',
        };
      case 'blue': // Soft Airmail Blue
        return {
          backgroundColor: '#F1F5FA',
          color: '#16283F',
          borderColor: '#D5DFED',
          boxShadow: '0 8px 30px -4px rgba(20, 40, 80, 0.07)',
        };
      case 'pure': // Pure White
        return {
          backgroundColor: '#FFFFFF',
          color: '#0F172A',
          borderColor: '#CBD5E1',
          boxShadow: '0 8px 30px -4px rgba(0, 0, 0, 0.1)',
        };
      case 'lined': // Notebook lined paper
        return {
          backgroundColor: '#FAF8F5',
          color: '#1E293B',
          backgroundImage: 'repeating-linear-gradient(transparent, transparent 29px, #e2e8f0 30px)',
          lineHeight: '30px',
          borderColor: '#E2E8F0',
          boxShadow: '0 8px 30px -4px rgba(0, 0, 0, 0.08)',
        };
      case 'dark': // Soft Dimmed Night Mode (not harsh pitch black)
        return {
          backgroundColor: '#222734',
          color: '#E2E8F0',
          borderColor: '#374254',
          boxShadow: '0 8px 30px -4px rgba(0, 0, 0, 0.5)',
        };
    }
  };

  const getFontFamilyStyle = () => {
    switch (fontFamily) {
      case 'serif':
        return 'Georgia, Cambria, "Times New Roman", serif';
      case 'mono':
        return '"JetBrains Mono", Consolas, "Courier New", monospace';
      case 'cursive':
        return '"Segoe Script", "Brush Script MT", cursive';
      case 'sans':
      default:
        return '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif';
    }
  };

  const docFiles = files.filter(f => f.type === 'document' || f.folder === 'documents');

  return (
    <div className={`flex flex-col h-full select-none ${isDark ? 'bg-[#1c212d] text-[#e2e8f0]' : 'bg-[#ffffff] text-[#1e293b]'}`}>
      {/* Top File Bar */}
      <div className={`flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b text-sm shrink-0 ${
        isDark ? 'bg-[#242a38] border-[#364154]' : 'bg-[#f8fafc] border-[#e2e8f0] text-slate-900'
      }`}>
        <div className="flex items-center gap-2.5 flex-1 min-w-[200px]">
          <FileText className="w-4 h-4 shrink-0" style={{ color: currentAccent }} />
          <input
            type="text"
            value={docTitle}
            onChange={(e) => {
              setDocTitle(e.target.value);
              setIsSaved(false);
            }}
            placeholder="Nome documento..."
            className={`font-bold bg-transparent border-b border-dashed border-transparent hover:border-slate-400 focus:outline-none px-1.5 py-0.5 rounded truncate max-w-xs transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          />
          <span className="text-[11px] font-semibold opacity-70">
            {isSaved ? '· Salvato' : '· Modificato'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 flex-wrap">
          <button
            onClick={handleNew}
            className={`p-1.5 px-2 rounded-lg transition-colors flex items-center gap-1 font-medium ${
              isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-300 text-slate-800'
            }`}
            title="Nuovo Documento"
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nuovo</span>
          </button>

          <button
            onClick={() => setShowOpenModal(true)}
            className={`p-1.5 px-2 rounded-lg transition-colors flex items-center gap-1 font-medium ${
              isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-300 text-slate-800'
            }`}
            title="Apri Documento Salvato"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Apri</span>
          </button>

          <button
            onClick={handleSave}
            style={{ backgroundColor: currentAccent }}
            className="p-1.5 px-3 rounded-lg text-white font-bold flex items-center gap-1.5 transition-opacity hover:opacity-90 shadow-xs"
            title="Salva documento (Ctrl+S)"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Salva</span>
          </button>

          <button
            onClick={() => setShowTemplatesModal(true)}
            className={`p-1.5 px-2 rounded-lg transition-colors flex items-center gap-1 font-medium ${
              isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-300 text-slate-800'
            }`}
            title="Modelli predefiniti"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden md:inline">Modelli</span>
          </button>

          <div className="h-4 w-px bg-slate-500/20 mx-1" />

          {/* Search Toggle */}
          <button
            onClick={() => setIsSearchOpen(prev => !prev)}
            style={{
              backgroundColor: isSearchOpen ? `${currentAccent}25` : undefined,
              color: isSearchOpen ? currentAccent : undefined
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-300 text-slate-800'
            }`}
            title="Cerca nel documento"
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          {/* Export Txt & Markdown */}
          <button
            onClick={handleExportTxt}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-300 text-slate-800'
            }`}
            title="Scarica come file di testo (.txt)"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handlePrint}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-300 text-slate-800'
            }`}
            title="Stampa o Salva PDF"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCopy}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-300 text-slate-800'
            }`}
            title="Copia tutto il testo"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Floating Search Bar if opened */}
      {isSearchOpen && (
        <div className={`px-4 py-2 border-b flex items-center justify-between gap-3 text-xs shrink-0 animate-in fade-in ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'
        }`}>
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Cerca parole nel testo..."
              autoFocus
              className={`w-full px-2.5 py-1 rounded-lg border outline-none text-xs ${
                isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-slate-400">
              {searchMatches} {searchMatches === 1 ? 'risultato' : 'risultati'}
            </span>
            <button
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery('');
              }}
              className="text-slate-400 hover:text-slate-200 text-xs px-2 py-0.5 rounded hover:bg-slate-500/20"
            >
              Chiudi
            </button>
          </div>
        </div>
      )}

      {/* Formatting & Options Toolbar */}
      <div className={`flex flex-wrap items-center gap-1.5 px-3 py-2 border-b text-xs sm:text-sm shrink-0 ${
        isDark ? 'bg-[#242a38]/80 border-[#364154] text-slate-200' : 'bg-[#ffffff] border-[#e2e8f0] text-slate-800'
      }`}>
        {/* Paper Style Selector */}
        <div className="flex items-center gap-1 mr-1">
          <Palette className="w-4 h-4 text-slate-400" />
          <select
            value={paperStyle}
            onChange={(e) => setPaperStyle(e.target.value as PaperStyle)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs sm:text-sm font-semibold outline-none cursor-pointer ${
              isDark ? 'bg-[#1c212d] border-[#364154] text-white' : 'bg-slate-50 border-[#e2e8f0] text-slate-900'
            }`}
            title="Stile e Colore Foglio (Comfort Visivo)"
          >
            <option value="natural">📄 Bianco Naturale (Riposo Occhi)</option>
            <option value="sepia">📜 Avorio / Pergamena Calda</option>
            <option value="sage">🌿 Verde Salvia Relax</option>
            <option value="blue">✉️ Celeste Carta Lettere</option>
            <option value="pure">⚪ Bianco Lino Puro</option>
            <option value="lined">📝 Carta a Righe</option>
            <option value="dark">🌙 Notturno Morbido</option>
          </select>
        </div>

        {/* Font Family Selector */}
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          className={`px-2.5 py-1.5 rounded-xl border text-xs sm:text-sm font-medium outline-none cursor-pointer ${
            isDark ? 'bg-[#1c212d] border-[#364154] text-white' : 'bg-slate-50 border-[#e2e8f0] text-slate-900'
          }`}
          title="Carattere tipografico"
        >
          <option value="sans">Carattere Moderno (Sans)</option>
          <option value="serif">Libro Classico (Serif)</option>
          <option value="mono">Monospazio (Codice)</option>
          <option value="cursive">Manoscritto / Corsivo</option>
        </select>

        {/* Font Size Selector */}
        <select
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
          className={`px-2.5 py-1.5 rounded-xl border text-xs sm:text-sm font-medium outline-none cursor-pointer ${
            isDark ? 'bg-[#1c212d] border-[#364154] text-white' : 'bg-slate-50 border-[#e2e8f0] text-slate-900'
          }`}
          title="Dimensione testo"
        >
          <option value="14px">14px (Compatto)</option>
          <option value="16px">16px (Predefinito)</option>
          <option value="18px">18px (Grande & Chiaro)</option>
          <option value="20px">20px (Molto Grande)</option>
          <option value="24px">24px (Titolo)</option>
          <option value="28px">28px (Maxi)</option>
        </select>

        <div className="h-4 w-px bg-slate-500/20 mx-1" />

        {/* Text Styling: Bold, Italic, Underline, Strike */}
        <button
          onClick={() => execCmd('bold')}
          className={`p-1.5 rounded-lg hover:bg-slate-500/20 active:scale-95 transition-all font-bold`}
          title="Grassetto (Ctrl+B)"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => execCmd('italic')}
          className={`p-1.5 rounded-lg hover:bg-slate-500/20 active:scale-95 transition-all italic`}
          title="Corsivo (Ctrl+I)"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => execCmd('underline')}
          className={`p-1.5 rounded-lg hover:bg-slate-500/20 active:scale-95 transition-all underline`}
          title="Sottolineato (Ctrl+U)"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => execCmd('strikeThrough')}
          className={`p-1.5 rounded-lg hover:bg-slate-500/20 active:scale-95 transition-all`}
          title="Barrato"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>

        {/* Highlighter colors */}
        <div className="flex items-center gap-0.5 ml-1">
          <button
            onClick={() => handleHighlight('#fef08a')}
            className="w-4 h-4 rounded-full bg-yellow-300 border border-black/20 hover:scale-110 transition-transform"
            title="Evidenzia Giallo"
          />
          <button
            onClick={() => handleHighlight('#bbf7d0')}
            className="w-4 h-4 rounded-full bg-emerald-300 border border-black/20 hover:scale-110 transition-transform"
            title="Evidenzia Verde"
          />
          <button
            onClick={() => handleHighlight('#bfdbfe')}
            className="w-4 h-4 rounded-full bg-blue-300 border border-black/20 hover:scale-110 transition-transform"
            title="Evidenzia Celeste"
          />
          <button
            onClick={() => handleHighlight('#fbcfe8')}
            className="w-4 h-4 rounded-full bg-pink-300 border border-black/20 hover:scale-110 transition-transform"
            title="Evidenzia Rosa"
          />
        </div>

        <div className="h-4 w-px bg-slate-500/20 mx-1" />

        {/* Headings */}
        <button
          onClick={() => execCmd('formatBlock', '<h1>')}
          className="p-1.5 rounded-lg hover:bg-slate-500/20 transition-colors"
          title="Titolo 1 (H1)"
        >
          <Heading1 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => execCmd('formatBlock', '<h2>')}
          className="p-1.5 rounded-lg hover:bg-slate-500/20 transition-colors"
          title="Titolo 2 (H2)"
        >
          <Heading2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => execCmd('formatBlock', '<h3>')}
          className="p-1.5 rounded-lg hover:bg-slate-500/20 transition-colors"
          title="Titolo 3 (H3)"
        >
          <Heading3 className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-slate-500/20 mx-1" />

        {/* Lists & Quotes */}
        <button
          onClick={() => execCmd('insertUnorderedList')}
          className="p-1.5 rounded-lg hover:bg-slate-500/20 transition-colors"
          title="Elenco puntato"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => execCmd('insertOrderedList')}
          className="p-1.5 rounded-lg hover:bg-slate-500/20 transition-colors"
          title="Elenco numerato"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => execCmd('formatBlock', '<blockquote>')}
          className="p-1.5 rounded-lg hover:bg-slate-500/20 transition-colors"
          title="Citazione"
        >
          <Quote className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-slate-500/20 mx-1" />

        {/* Alignment */}
        <button
          onClick={() => execCmd('justifyLeft')}
          className="p-1.5 rounded-lg hover:bg-slate-500/20 transition-colors"
          title="Allinea a sinistra"
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => execCmd('justifyCenter')}
          className="p-1.5 rounded-lg hover:bg-slate-500/20 transition-colors"
          title="Centra"
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => execCmd('justifyRight')}
          className="p-1.5 rounded-lg hover:bg-slate-500/20 transition-colors"
          title="Allinea a destra"
        >
          <AlignRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => execCmd('justifyFull')}
          className="p-1.5 rounded-lg hover:bg-slate-500/20 transition-colors"
          title="Giustifica"
        >
          <AlignJustify className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-slate-500/20 mx-1" />

        {/* Insert Date & Divider */}
        <button
          onClick={handleInsertDate}
          className={`p-1.5 px-2 rounded-lg transition-colors flex items-center gap-1 font-medium ${
            isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-200'
          }`}
          title="Inserisci data e ora corrente"
        >
          <Calendar className="w-3.5 h-3.5 text-blue-500" />
          <span className="hidden lg:inline text-[11px]">Data</span>
        </button>

        <button
          onClick={handleInsertDivider}
          className={`p-1.5 px-2 rounded-lg transition-colors flex items-center gap-1 font-medium ${
            isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-200'
          }`}
          title="Inserisci linea divisoria"
        >
          <Minus className="w-3.5 h-3.5" />
          <span className="hidden lg:inline text-[11px]">Linea</span>
        </button>
      </div>

      {/* Editor Document Area (Warm Natural White Sheet Canvas) */}
      <div className={`flex-1 p-3 sm:p-7 overflow-auto flex justify-center ${
        isDark ? 'bg-[#151922]' : 'bg-[#eef1f5]'
      }`}>
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          spellCheck
          style={{
            ...getPaperStyles(),
            fontFamily: getFontFamilyStyle(),
            fontSize: fontSize,
            transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined,
            transformOrigin: 'top center',
          }}
          className="w-full max-w-3xl min-h-[500px] p-6 sm:p-10 rounded-2xl border outline-none focus:outline-none transition-all leading-relaxed select-text"
        />
      </div>

      {/* Status Bar with Stats & Zoom */}
      <div className={`flex items-center justify-between px-4 py-2.5 border-t text-xs shrink-0 font-medium ${
        isDark ? 'bg-[#1c212d] border-[#343e52] text-slate-400' : 'bg-[#f8fafc] border-[#e2e8f0] text-slate-700'
      }`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowStatsModal(true)}
            className="hover:underline flex items-center gap-1.5"
            title="Dettagli statistiche documento"
          >
            <span>{wordCount} parole</span>
            <span>·</span>
            <span>{charCount} caratteri</span>
            <span>·</span>
            <span>{paragraphCount} paragrafi</span>
          </button>
          <span>·</span>
          <span>~{Math.max(1, Math.ceil(wordCount / 200))} min lettura</span>
        </div>

        {/* Zoom Controls & Format */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline font-mono opacity-80">UTF-8</span>
          <span className="hidden sm:inline">·</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoomLevel(prev => Math.max(70, prev - 10))}
              className="p-1 rounded hover:bg-slate-500/20"
              title="Riduci zoom"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono w-10 text-center">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(150, prev + 10))}
              className="p-1 rounded hover:bg-slate-500/20"
              title="Aumenta zoom"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Open Document Modal */}
      {showOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-md p-5 rounded-2xl border shadow-2xl ${
            isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
          }`}>
            <h3 className="text-base font-bold mb-3">Apri Documento Salvato</h3>
            <div className="max-h-60 overflow-y-auto space-y-1.5 mb-4">
              {docFiles.length === 0 ? (
                <p className="text-sm text-slate-400 py-4 text-center">Nessun documento salvato trovato.</p>
              ) : (
                docFiles.map(file => (
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
                      <FileText className="w-4 h-4 shrink-0" style={{ color: currentAccent }} />
                      <span className="text-xs font-semibold truncate">{file.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono shrink-0">
                      {Math.round(file.size / 1024 * 10) / 10} KB
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
                <span>Modelli Predefiniti</span>
              </h3>
              <button onClick={() => setShowTemplatesModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto mb-4">
              <button
                onClick={() => applyTemplate('Verbale Riunione', '<h2>Verbale di Riunione</h2><p><strong>Data:</strong> ' + new Date().toLocaleDateString('it-IT') + '</p><p><strong>Partecipanti:</strong> </p><h3>Ordine del Giorno</h3><ul><li>Punto 1</li><li>Punto 2</li></ul><h3>Decisioni Prese</h3><p>...</p>')}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  isDark ? 'border-slate-700 hover:bg-slate-700' : 'border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-xs mb-1">📋 Verbale Riunione</div>
                <div className="text-[11px] text-slate-400">Ordine del giorno e decisioni</div>
              </button>

              <button
                onClick={() => applyTemplate('Lista di Attività', '<h2>To-Do List del Giorno</h2><p><strong>Obiettivi prioritari:</strong></p><ul><li>[ ] Completare progetto</li><li>[ ] Revisione file</li><li>[ ] Chiamata di controllo</li></ul>')}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  isDark ? 'border-slate-700 hover:bg-slate-700' : 'border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-xs mb-1">✅ Lista Attività</div>
                <div className="text-[11px] text-slate-400">Elenco puntato con compiti</div>
              </button>

              <button
                onClick={() => applyTemplate('Lettera Formale', '<p>Luogo, ' + new Date().toLocaleDateString('it-IT') + '</p><br><p><strong>Spett.le Azienda / Destinatario,</strong></p><p>Con la presente desidero sottoporre alla Vostra cortese attenzione...</p><br><p>In attesa di un Vostro gentile riscontro, porgo cordiali saluti.</p><br><p><em>Firma</em></p>')}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  isDark ? 'border-slate-700 hover:bg-slate-700' : 'border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-xs mb-1">✉️ Lettera Formale</div>
                <div className="text-[11px] text-slate-400">Impostazione formale con data e firma</div>
              </button>

              <button
                onClick={() => applyTemplate('Articolo & Appunti', '<h1>Titolo Articolo</h1><p><em>Sottotitolo descrittivo</em></p><hr><p>Introduzione all\'argomento con testo scorrevole...</p><h2>Approfondimento</h2><p>Dettagli ed evidenze...</p><blockquote>"Una citazione importante."</blockquote>')}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  isDark ? 'border-slate-700 hover:bg-slate-700' : 'border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-xs mb-1">✍️ Articolo o Saggio</div>
                <div className="text-[11px] text-slate-400">Titoli, citazioni e sezioni</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Modal */}
      {showStatsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-sm p-5 rounded-2xl border shadow-2xl ${
            isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
          }`}>
            <h3 className="text-base font-bold mb-3">Statistiche Documento</h3>
            <div className="space-y-2 text-xs mb-4">
              <div className="flex justify-between py-1 border-b border-slate-500/20">
                <span className="text-slate-400">Parole:</span>
                <span className="font-bold font-mono">{wordCount}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-500/20">
                <span className="text-slate-400">Caratteri:</span>
                <span className="font-bold font-mono">{charCount}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-500/20">
                <span className="text-slate-400">Paragrafi:</span>
                <span className="font-bold font-mono">{paragraphCount}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-500/20">
                <span className="text-slate-400">Tempo stimato di lettura:</span>
                <span className="font-bold font-mono">~{Math.max(1, Math.ceil(wordCount / 200))} min</span>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowStatsModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-400/30 hover:bg-slate-500/10"
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
