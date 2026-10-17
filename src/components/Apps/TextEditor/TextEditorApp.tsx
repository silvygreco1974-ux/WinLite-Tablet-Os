import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Save,
  Download,
  FolderOpen,
  Printer,
  FilePlus,
  Copy,
  Check,
  FileText,
  Sparkles
} from 'lucide-react';
import { useOS } from '../../../context/OSContext';

interface TextEditorAppProps {
  customData?: {
    fileId?: string;
  };
}

export const TextEditorApp: React.FC<TextEditorAppProps> = ({ customData }) => {
  const { files, addFile, updateFile, settings } = useOS();
  const editorRef = useRef<HTMLDivElement>(null);

  const [currentFileId, setCurrentFileId] = useState<string | null>(customData?.fileId || null);
  const [docTitle, setDocTitle] = useState('Nuovo Documento');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isSaved, setIsSaved] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);

  const isDark = settings.theme === 'dark';

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
      editorRef.current.innerHTML = '<p>Inizia a scrivere qui il tuo testo o appunti...</p>';
      updateCounts();
    }
  }, [currentFileId]);

  const updateCounts = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || '';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
    setCharCount(text.length);
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

  const docFiles = files.filter(f => f.type === 'document' || f.folder === 'documents');

  return (
    <div className={`flex flex-col h-full ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-800'}`}>
      {/* Top File Bar */}
      <div className={`flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b text-xs ${
        isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <FileText className="w-4 h-4 text-blue-500 shrink-0" />
          <input
            type="text"
            value={docTitle}
            onChange={(e) => {
              setDocTitle(e.target.value);
              setIsSaved(false);
            }}
            placeholder="Nome file..."
            className={`font-semibold bg-transparent border-b border-dashed border-transparent hover:border-blue-400 focus:border-blue-500 focus:outline-none px-1 py-0.5 rounded truncate max-w-xs transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          />
          <span className="text-[11px] text-slate-400">
            {isSaved ? '· Salvato' : '· Modificato'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleNew}
            className={`p-1.5 rounded transition-colors flex items-center gap-1 ${
              isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-200 text-slate-700'
            }`}
            title="Nuovo Documento"
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nuovo</span>
          </button>

          <button
            onClick={() => setShowOpenModal(true)}
            className={`p-1.5 rounded transition-colors flex items-center gap-1 ${
              isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-200 text-slate-700'
            }`}
            title="Apri Documento Salvato"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Apri</span>
          </button>

          <button
            onClick={handleSave}
            className="p-1.5 px-2.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-1 transition-colors shadow-sm"
            title="Salva nel tablet OS"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Salva</span>
          </button>

          <button
            onClick={() => setShowTemplatesModal(true)}
            className={`p-1.5 rounded transition-colors flex items-center gap-1 ${
              isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-200 text-slate-700'
            }`}
            title="Modelli predefiniti"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden md:inline">Modelli</span>
          </button>

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

          <button
            onClick={handleExportTxt}
            className={`p-1.5 rounded transition-colors ${
              isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-200 text-slate-700'
            }`}
            title="Scarica come .txt"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handlePrint}
            className={`p-1.5 rounded transition-colors ${
              isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-200 text-slate-700'
            }`}
            title="Stampa o Salva PDF"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCopy}
            className={`p-1.5 rounded transition-colors ${
              isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-200 text-slate-700'
            }`}
            title="Copia tutto il testo"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Formatting Toolbar */}
      <div className={`flex flex-wrap items-center gap-1 px-3 py-1.5 border-b text-xs ${
        isDark ? 'bg-slate-800/40 border-slate-700/80 text-slate-300' : 'bg-slate-100/70 border-slate-200 text-slate-700'
      }`}>
        <button
          onClick={() => execCmd('bold')}
          className={`p-1.5 rounded hover:bg-slate-500/20 active:bg-blue-500/30 transition-colors font-bold`}
          title="Grassetto (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => execCmd('italic')}
          className={`p-1.5 rounded hover:bg-slate-500/20 active:bg-blue-500/30 transition-colors italic`}
          title="Corsivo (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => execCmd('underline')}
          className={`p-1.5 rounded hover:bg-slate-500/20 active:bg-blue-500/30 transition-colors underline`}
          title="Sottolineato (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </button>
        <button
          onClick={() => execCmd('strikeThrough')}
          className={`p-1.5 rounded hover:bg-slate-500/20 active:bg-blue-500/30 transition-colors`}
          title="Barrato"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

        <button
          onClick={() => execCmd('formatBlock', '<h1>')}
          className="p-1.5 rounded hover:bg-slate-500/20 active:bg-blue-500/30 transition-colors"
          title="Titolo 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          onClick={() => execCmd('formatBlock', '<h2>')}
          className="p-1.5 rounded hover:bg-slate-500/20 active:bg-blue-500/30 transition-colors"
          title="Titolo 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

        <button
          onClick={() => execCmd('insertUnorderedList')}
          className="p-1.5 rounded hover:bg-slate-500/20 active:bg-blue-500/30 transition-colors"
          title="Elenco puntato"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => execCmd('insertOrderedList')}
          className="p-1.5 rounded hover:bg-slate-500/20 active:bg-blue-500/30 transition-colors"
          title="Elenco numerato"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

        <button
          onClick={() => execCmd('justifyLeft')}
          className="p-1.5 rounded hover:bg-slate-500/20 active:bg-blue-500/30 transition-colors"
          title="Allinea a sinistra"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => execCmd('justifyCenter')}
          className="p-1.5 rounded hover:bg-slate-500/20 active:bg-blue-500/30 transition-colors"
          title="Centra"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          onClick={() => execCmd('justifyRight')}
          className="p-1.5 rounded hover:bg-slate-500/20 active:bg-blue-500/30 transition-colors"
          title="Allinea a destra"
        >
          <AlignRight className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Body */}
      <div className="flex-1 p-4 md:p-6 overflow-auto bg-transparent">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          spellCheck
          className={`min-h-full max-w-3xl mx-auto p-4 sm:p-6 rounded-lg outline-none focus:outline-none transition-all leading-relaxed ${
            isDark
              ? 'bg-slate-800/50 text-slate-100 shadow-inner'
              : 'bg-white text-slate-900 border border-slate-200/60 shadow-sm'
          }`}
          style={{ minHeight: '340px' }}
        />
      </div>

      {/* Status Bar */}
      <div className={`flex items-center justify-between px-4 py-1.5 border-t text-[11px] ${
        isDark ? 'bg-slate-800/80 border-slate-700/60 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
      }`}>
        <div className="flex items-center gap-3">
          <span>{wordCount} parole</span>
          <span>·</span>
          <span>{charCount} caratteri</span>
          <span>·</span>
          <span>~{Math.max(1, Math.ceil(wordCount / 200))} min lettura</span>
        </div>
        <div className="flex items-center gap-2">
          <span>UTF-8</span>
          <span>·</span>
          <span>100% Zoom</span>
        </div>
      </div>

      {/* Open Document Modal */}
      {showOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-md p-5 rounded-xl border shadow-2xl ${
            isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-base font-semibold mb-3">Apri Documento</h3>
            <div className="max-h-60 overflow-y-auto space-y-1 mb-4">
              {docFiles.length === 0 ? (
                <p className="text-sm text-slate-400 py-3 text-center">Nessun documento salvato trovato.</p>
              ) : (
                docFiles.map(file => (
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
                      <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="text-sm font-medium truncate">{file.name}</span>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">
                      {Math.round(file.size / 1024 * 10) / 10} KB
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
            <h3 className="text-base font-semibold mb-3">Scegli un Modello</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => applyTemplate('Appunti di Studio', `<h2>📚 Appunti di Studio</h2><p><strong>Materia:</strong> </p><p><strong>Data:</strong> ${new Date().toLocaleDateString('it-IT')}</p><hr><h3>Concetti Chiave</h3><ul><li>Punto 1</li><li>Punto 2</li></ul><h3>Domande & Approfondimenti</h3><p>...</p>`)}
                className={`p-3 rounded-lg border text-left transition-all hover:border-blue-500 ${
                  isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="font-semibold text-sm mb-1">📚 Appunti di Studio</div>
                <div className="text-xs text-slate-400">Schema per riassunti, concetti chiave e domande.</div>
              </button>

              <button
                onClick={() => applyTemplate('Verbale Riunione', `<h2>📋 Verbale Riunione</h2><p><strong>Data:</strong> ${new Date().toLocaleDateString('it-IT')}</p><p><strong>Partecipanti:</strong> </p><hr><h3>Punti all'ordine del giorno</h3><ol><li>Discussione progetto</li><li>Decisioni operative</li></ol><h3>Azioni da compiere (Task)</h3><ul><li>[ ] Compito 1</li><li>[ ] Compito 2</li></ul>`)}
                className={`p-3 rounded-lg border text-left transition-all hover:border-blue-500 ${
                  isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="font-semibold text-sm mb-1">📋 Verbale Riunione</div>
                <div className="text-xs text-slate-400">Struttura per meeting con partecipanti e azioni.</div>
              </button>

              <button
                onClick={() => applyTemplate('Lista Obiettivi Settimanali', `<h2>🎯 Obiettivi della Settimana</h2><p>Focus principale: </p><hr><h3>Obiettivi Prioritari</h3><ul><li>Obiettivo 1</li><li>Obiettivo 2</li><li>Obiettivo 3</li></ul><h3>Note & Riflessioni</h3><p>...</p>`)}
                className={`p-3 rounded-lg border text-left transition-all hover:border-blue-500 ${
                  isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="font-semibold text-sm mb-1">🎯 Obiettivi Settimana</div>
                <div className="text-xs text-slate-400">Per organizzare la settimana con priorità chiare.</div>
              </button>

              <button
                onClick={() => applyTemplate('Lettera Formale', `<h2>Lettera Formale</h2><p>Mittente:<br>Nome e Cognome<br>Indirizzo</p><p>Destinatario:<br>Azienda / Ente</p><p>Data: ${new Date().toLocaleDateString('it-IT')}</p><p><strong>Oggetto: </strong></p><p>Gentile ...,</p><p>Con la presente desidero comunicare...</p><p>Cordiali saluti,<br>Firma</p>`)}
                className={`p-3 rounded-lg border text-left transition-all hover:border-blue-500 ${
                  isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="font-semibold text-sm mb-1">✉️ Lettera Formale</div>
                <div className="text-xs text-slate-400">Layout per comunicazioni formali e lettere.</div>
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
