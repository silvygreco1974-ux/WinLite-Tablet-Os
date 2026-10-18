import React, { useState } from 'react';
import {
  FolderOpen,
  FileText,
  FileCode,
  Download,
  Trash2,
  Upload,
  Plus,
  Search,
  HardDrive,
  FolderInput,
  StickyNote,
  ExternalLink,
  CheckCircle2,
  MoreVertical
} from 'lucide-react';
import { useOS } from '../../../context/OSContext';
import { VirtualFile } from '../../../types/os';

const FOLDER_NAMES: Record<string, string> = {
  documents: 'Documenti',
  code: 'Codice',
  notes: 'Note',
  downloads: 'Download',
};

const AVAILABLE_FOLDERS = [
  { key: 'documents', label: 'Documenti', icon: FileText, color: 'text-blue-500' },
  { key: 'code', label: 'Codice', icon: FileCode, color: 'text-emerald-500' },
  { key: 'notes', label: 'Note', icon: StickyNote, color: 'text-amber-500' },
  { key: 'downloads', label: 'Download', icon: Download, color: 'text-purple-500' },
];

export const FileExplorerApp: React.FC = () => {
  const {
    files,
    addFile,
    moveFile,
    deleteFile,
    openWindow,
    exportAllBackup,
    importBackup,
    storageUsedKB,
    settings
  } = useOS();

  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [activeMenuFileId, setActiveMenuFileId] = useState<string | null>(null);

  // Modals
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<'document' | 'code'>('document');
  const [newFileFolder, setNewFileFolder] = useState<string>('documents');
  const [movingFile, setMovingFile] = useState<VirtualFile | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isDark = settings.theme === 'dark';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredFiles = files.filter(f => {
    const matchesFolder = selectedFolder === 'all' || f.folder === selectedFolder;
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.extension.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const selectedFile = files.find(f => f.id === selectedFileId);

  const handleOpenFile = (file: VirtualFile) => {
    if (file.type === 'document' || file.folder === 'documents') {
      openWindow('text-editor', file.name, 'FileText', { fileId: file.id });
    } else if (file.type === 'code' || file.folder === 'code') {
      openWindow('code-editor', file.name, 'Code', { fileId: file.id });
    } else {
      openWindow('text-editor', file.name, 'FileText', { fileId: file.id });
    }
  };

  const handleDownloadFile = (file: VirtualFile) => {
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name}.${file.extension}`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Scaricato "${file.name}.${file.extension}"`);
  };

  const handleMoveDirectly = (fileId: string, fileName: string, targetFolder: string) => {
    moveFile(fileId, targetFolder);
    const folderLabel = FOLDER_NAMES[targetFolder] || targetFolder;
    showToast(`Spostato "${fileName}" in "${folderLabel}"`);
    setMovingFile(null);
    setActiveMenuFileId(null);
  };

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    if (newFileType === 'document') {
      addFile(newFileName.trim(), '<p>Nuovo documento creato.</p>', 'document', 'txt', 'text', newFileFolder as any);
    } else {
      addFile(newFileName.trim(), '// Scrivi il tuo codice qui\nconsole.log("File creato!");\n', 'code', 'js', 'javascript', newFileFolder as any);
    }

    setNewFileName('');
    setShowNewFileModal(false);
    showToast(`File "${newFileName.trim()}" creato con successo`);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importBackup(content);
      if (success) {
        showToast('Backup importato con successo!');
      } else {
        showToast('Errore nel formato del backup.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div
      onClick={() => setActiveMenuFileId(null)}
      className={`flex flex-col h-full select-none ${isDark ? 'bg-[#1c212d] text-[#e2e8f0]' : 'bg-[#ffffff] text-[#1e293b]'}`}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-lg shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white p-1">✕</button>
        </div>
      )}

      {/* Windows 11 Clean Ribbon Toolbar */}
      <div className={`px-4 py-2.5 border-b flex flex-wrap items-center justify-between gap-2 text-sm shrink-0 ${
        isDark ? 'bg-[#242a38] border-[#364154]' : 'bg-[#f8fafc] border-[#e2e8f0] text-slate-900'
      }`}>
        {/* Left Actions */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Nuovo File */}
          <button
            onClick={() => setShowNewFileModal(true)}
            style={{ backgroundColor: settings.accentColor || '#0078d4' }}
            className="px-3.5 py-2 rounded-xl text-white font-bold flex items-center gap-1.5 transition-opacity hover:opacity-90 shadow-xs min-h-[38px]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Nuovo File</span>
          </button>

          <div className="h-5 w-px bg-slate-500/20 mx-1 hidden sm:block" />

          {/* Contextual Action Buttons for Selected File */}
          {selectedFile ? (
            <div
              style={{
                borderColor: settings.accentColor ? `${settings.accentColor}50` : undefined,
                backgroundColor: settings.accentColor ? `${settings.accentColor}18` : undefined
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-xl border"
            >
              <span
                style={{ color: settings.accentColor || '#0078d4' }}
                className="text-[11px] font-bold truncate max-w-[100px] hidden md:inline mr-1"
              >
                {selectedFile.name}
              </span>

              {/* Apri */}
              <button
                onClick={() => handleOpenFile(selectedFile)}
                style={{ backgroundColor: settings.accentColor || '#0078d4' }}
                className="px-2.5 py-1.5 rounded-lg text-white font-bold flex items-center gap-1 transition-opacity hover:opacity-90 min-h-[32px]"
                title="Apri file"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Apri</span>
              </button>

              {/* Sposta */}
              <button
                onClick={() => setMovingFile(selectedFile)}
                className={`px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors min-h-[32px] ${
                  isDark ? 'hover:bg-slate-700 text-slate-200' : 'hover:bg-slate-200 text-slate-700'
                }`}
                title="Sposta cartella"
              >
                <FolderInput className="w-3.5 h-3.5 text-emerald-500" />
                <span>Sposta</span>
              </button>

              {/* Scarica */}
              <button
                onClick={() => handleDownloadFile(selectedFile)}
                className={`p-1.5 rounded-lg transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center ${
                  isDark ? 'hover:bg-slate-700 text-slate-200' : 'hover:bg-slate-200 text-slate-700'
                }`}
                title="Scarica su tablet"
              >
                <Download className="w-3.5 h-3.5" />
              </button>

              {/* Elimina */}
              <button
                onClick={() => {
                  if (confirm(`Eliminare il file "${selectedFile.name}"?`)) {
                    deleteFile(selectedFile.id);
                    setSelectedFileId(null);
                    showToast(`File eliminato`);
                  }
                }}
                className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
                title="Elimina"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : null}

          {/* Backup & Import (Compact) */}
          <button
            onClick={exportAllBackup}
            className={`px-3 py-2 rounded-xl border flex items-center gap-1.5 transition-colors min-h-[38px] ${
              isDark ? 'border-slate-700 hover:bg-slate-700 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
            }`}
            title="Salva copia di backup"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Backup</span>
          </button>

          <label
            className={`px-3 py-2 rounded-xl border flex items-center gap-1.5 cursor-pointer transition-colors min-h-[38px] ${
              isDark ? 'border-slate-700 hover:bg-slate-700 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
            }`}
            title="Importa file di backup"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ripristina</span>
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>
        </div>

        {/* Right Search Bar */}
        <div className="relative min-w-[140px] max-w-xs flex-1 min-h-[38px] flex items-center">
          <Search className="w-3.5 h-3.5 absolute left-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca file..."
            className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border outline-none min-h-[36px] ${
              isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}
          />
        </div>
      </div>

      {/* Main Workspace (Sidebar + File Grid) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className={`w-48 sm:w-56 p-3.5 border-r flex flex-col shrink-0 text-sm ${
          isDark ? 'bg-[#202532] border-[#343e52]' : 'bg-[#f8fafc] border-[#e2e8f0]'
        }`}>
          <div className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-2.5 px-2">
            Cartelle
          </div>

          <div className="space-y-1.5">
            {/* Tutti i File */}
            <button
              onClick={() => setSelectedFolder('all')}
              style={{
                backgroundColor: selectedFolder === 'all' ? (settings.accentColor || '#0078d4') : undefined
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all min-h-[42px] ${
                selectedFolder === 'all'
                  ? 'text-white font-bold shadow-xs'
                  : isDark ? 'text-slate-300 hover:bg-[#28303f]' : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <HardDrive className="w-4 h-4 shrink-0" />
                <span className="font-semibold">Tutti i File</span>
              </div>
              <span className="text-xs opacity-75 font-mono">{files.length}</span>
            </button>

            {/* Folder buttons */}
            {AVAILABLE_FOLDERS.map(f => {
              const isSelected = selectedFolder === f.key;
              const count = files.filter(file => file.folder === f.key || (f.key === 'documents' && file.type === 'document') || (f.key === 'code' && file.type === 'code')).length;
              const IconComp = f.icon;

              return (
                <button
                  key={f.key}
                  onClick={() => setSelectedFolder(f.key)}
                  style={{
                    backgroundColor: isSelected ? (settings.accentColor || '#0078d4') : undefined
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all min-h-[42px] ${
                    isSelected
                      ? 'text-white font-bold shadow-xs'
                      : isDark ? 'text-slate-300 hover:bg-[#28303f]' : 'text-slate-700 hover:bg-slate-200/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComp className={`w-4 h-4 ${isSelected ? 'text-white' : f.color}`} />
                    <span className="font-semibold">{f.label}</span>
                  </div>
                  <span className="text-xs opacity-75 font-mono">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Storage Meter */}
          <div className="mt-auto pt-3 border-t border-slate-500/20 text-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="font-medium">Memoria</span>
              <span className="font-mono text-emerald-400 font-bold">{storageUsedKB} KB</span>
            </div>
            <div className="w-full h-2 bg-slate-700/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${Math.min(100, Math.max(3, storageUsedKB * 2))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Files Area */}
        <div
          onClick={() => setSelectedFileId(null)}
          className={`flex-1 p-4 md:p-6 overflow-auto ${isDark ? 'bg-[#181b24]' : 'bg-[#f4f6fa]'}`}
        >
          {filteredFiles.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <FolderOpen className="w-12 h-12 text-slate-500/40 mb-2" />
              <p className="text-base font-semibold">Nessun file presente</p>
              <p className="text-sm text-slate-500 mt-1 max-w-xs">
                Tocca "Nuovo File" in alto per creare un documento o codice.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {filteredFiles.map(file => {
                const isSelected = selectedFileId === file.id;
                const isMenuOpen = activeMenuFileId === file.id;

                return (
                  <div
                    key={file.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFileId(file.id);
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      handleOpenFile(file);
                    }}
                    style={{
                      borderColor: isSelected ? settings.accentColor : undefined,
                      boxShadow: isSelected ? `0 0 0 2px ${settings.accentColor}` : undefined
                    }}
                    className={`relative p-4 rounded-2xl border flex flex-col items-center text-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? isDark ? 'bg-[#242a38] text-white shadow-md' : 'bg-white text-slate-900 shadow-md'
                        : isDark
                        ? 'bg-[#242a38] border-[#364154] hover:border-slate-500 text-[#e2e8f0] shadow-xs'
                        : 'bg-white border-[#e2e8f0] hover:border-slate-300 shadow-sm text-slate-900'
                    }`}
                  >
                    {/* Top corner 3-dots Menu Button */}
                    <div className="absolute top-2 right-2 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFileId(file.id);
                          setActiveMenuFileId(isMenuOpen ? null : file.id);
                        }}
                        className={`p-1 rounded-lg transition-colors ${
                          isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-800'
                        }`}
                        title="Opzioni file"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu (Clean, clamped, non-overlapping) */}
                      {isMenuOpen && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className={`absolute right-0 top-7 w-40 p-1.5 rounded-xl border shadow-2xl backdrop-blur-xl text-xs z-50 animate-in fade-in zoom-in-95 ${
                            isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                          }`}
                        >
                          <button
                            onClick={() => {
                              handleOpenFile(file);
                              setActiveMenuFileId(null);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-left font-medium"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                            <span>Apri</span>
                          </button>

                          <button
                            onClick={() => {
                              setMovingFile(file);
                              setActiveMenuFileId(null);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-left font-medium"
                          >
                            <FolderInput className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Sposta in...</span>
                          </button>

                          <button
                            onClick={() => {
                              handleDownloadFile(file);
                              setActiveMenuFileId(null);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-left font-medium"
                          >
                            <Download className="w-3.5 h-3.5 text-purple-400" />
                            <span>Scarica</span>
                          </button>

                          <div className="my-1 border-t border-slate-500/20" />

                          <button
                            onClick={() => {
                              setActiveMenuFileId(null);
                              if (confirm(`Eliminare il file "${file.name}"?`)) {
                                deleteFile(file.id);
                                if (selectedFileId === file.id) setSelectedFileId(null);
                                showToast(`File eliminato`);
                              }
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-red-600 hover:text-white text-red-400 transition-colors text-left font-medium"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Elimina</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* File Icon */}
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center my-1">
                      {file.type === 'code' ? (
                        <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                          <FileCode className="w-7 h-7" />
                        </div>
                      ) : (
                        <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                          <FileText className="w-7 h-7" />
                        </div>
                      )}
                    </div>

                    {/* File Title & Info */}
                    <div className="w-full mt-2">
                      <h4 className="text-xs font-semibold truncate leading-tight px-1" title={file.name}>
                        {file.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1">
                        .{file.extension} · {Math.round(file.size / 1024 * 10) / 10} KB
                      </p>
                      <span className="inline-block mt-1 text-[9px] px-2 py-0.5 rounded-full bg-slate-500/15 text-slate-400 font-medium capitalize">
                        {FOLDER_NAMES[file.folder] || file.folder}
                      </span>
                    </div>

                    {/* Tap to open prompt on mobile/tablet */}
                    {isSelected && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenFile(file);
                        }}
                        className="mt-2.5 w-full py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold shadow-xs animate-in fade-in"
                      >
                        Tocca per aprire
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* SPOSTA FILE MODAL (Clean, centered modal) */}
      {movingFile && (
        <div
          onClick={() => setMovingFile(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-sm p-5 rounded-2xl border shadow-2xl ${
              isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 text-emerald-400">
              <FolderInput className="w-5 h-5 stroke-[2.5]" />
              <h3 className="text-base font-bold text-white">Sposta File</h3>
            </div>
            <p className="text-xs text-slate-300 mb-4">
              Scegli la cartella di destinazione per <strong>"{movingFile.name}"</strong>:
            </p>

            <div className="space-y-2 mb-4">
              {AVAILABLE_FOLDERS.map(f => {
                const isCurrent = movingFile.folder === f.key;
                const IconComponent = f.icon;
                return (
                  <button
                    key={f.key}
                    disabled={isCurrent}
                    onClick={() => handleMoveDirectly(movingFile.id, movingFile.name, f.key)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all min-h-[44px] ${
                      isCurrent
                        ? 'opacity-40 border-slate-700 bg-slate-700/20 cursor-not-allowed'
                        : isDark
                        ? 'bg-slate-700/60 border-slate-600 hover:bg-emerald-600 hover:border-emerald-500 hover:text-white'
                        : 'bg-slate-50 border-slate-200 hover:bg-emerald-50 hover:border-emerald-500 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComponent className={`w-4 h-4 ${f.color}`} />
                      <span>{f.label}</span>
                    </div>
                    {isCurrent ? (
                      <span className="text-[10px] text-slate-400 font-normal">Attuale</span>
                    ) : (
                      <span className="text-[10px] text-emerald-400">Sposta qui →</span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setMovingFile(null)}
              className="w-full py-2.5 text-xs font-bold rounded-xl border border-slate-500/40 hover:bg-slate-500/20"
            >
              Annulla
            </button>
          </div>
        </div>
      )}

      {/* Nuovo File Modal */}
      {showNewFileModal && (
        <div
          onClick={() => setShowNewFileModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-sm p-5 rounded-2xl border shadow-2xl ${
              isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <h3 className="text-base font-bold mb-3">Crea Nuovo File</h3>
            <form onSubmit={handleCreateFile} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">
                  Nome File
                </label>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="nome_documento..."
                  autoFocus
                  className={`w-full px-3 py-2 rounded-xl text-xs border outline-none min-h-[40px] ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">
                  Tipo
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewFileType('document')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors min-h-[40px] ${
                      newFileType === 'document'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : isDark ? 'border-slate-700 text-slate-300' : 'border-slate-300 text-slate-700'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Documento</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewFileType('code')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors min-h-[40px] ${
                      newFileType === 'code'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : isDark ? 'border-slate-700 text-slate-300' : 'border-slate-300 text-slate-700'
                    }`}
                  >
                    <FileCode className="w-4 h-4" />
                    <span>Codice</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">
                  Cartella
                </label>
                <select
                  value={newFileFolder}
                  onChange={(e) => setNewFileFolder(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs border outline-none min-h-[40px] font-semibold ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="documents">📁 Documenti</option>
                  <option value="code">💻 Codice</option>
                  <option value="notes">📝 Note</option>
                  <option value="downloads">⬇️ Download</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewFileModal(false)}
                  className="px-4 py-2 text-xs rounded-xl border border-slate-500/40 hover:bg-slate-500/20"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Crea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
