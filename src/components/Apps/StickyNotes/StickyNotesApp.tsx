import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  CheckSquare,
  AlignLeft,
  Pin,
  Search,
  Sparkles
} from 'lucide-react';
import { useOS } from '../../../context/OSContext';
import { StickyNote } from '../../../types/os';

const COLOR_MAP: Record<StickyNote['color'], { bg: string; text: string; header: string; border: string }> = {
  yellow: { bg: 'bg-amber-100 dark:bg-amber-900/60', text: 'text-amber-950 dark:text-amber-100', header: 'bg-amber-200/70 dark:bg-amber-800/80', border: 'border-amber-300 dark:border-amber-700/60' },
  green: { bg: 'bg-emerald-100 dark:bg-emerald-900/60', text: 'text-emerald-950 dark:text-emerald-100', header: 'bg-emerald-200/70 dark:bg-emerald-800/80', border: 'border-emerald-300 dark:border-emerald-700/60' },
  blue: { bg: 'bg-sky-100 dark:bg-sky-900/60', text: 'text-sky-950 dark:text-sky-100', header: 'bg-sky-200/70 dark:bg-sky-800/80', border: 'border-sky-300 dark:border-sky-700/60' },
  purple: { bg: 'bg-purple-100 dark:bg-purple-900/60', text: 'text-purple-950 dark:text-purple-100', header: 'bg-purple-200/70 dark:bg-purple-800/80', border: 'border-purple-300 dark:border-purple-700/60' },
  pink: { bg: 'bg-rose-100 dark:bg-rose-900/60', text: 'text-rose-950 dark:text-rose-100', header: 'bg-rose-200/70 dark:bg-rose-800/80', border: 'border-rose-300 dark:border-rose-700/60' },
  dark: { bg: 'bg-slate-800', text: 'text-slate-100', header: 'bg-slate-700', border: 'border-slate-600' }
};

export const StickyNotesApp: React.FC = () => {
  const { stickyNotes, addStickyNote, updateStickyNote, deleteStickyNote, settings } = useOS();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState<StickyNote['color']>('yellow');
  const [newIsChecklist, setNewIsChecklist] = useState(false);

  const isDark = settings.theme === 'dark';

  const handleCreate = () => {
    addStickyNote(selectedColor, 'Nota ' + new Date().toLocaleDateString('it-IT'), '', newIsChecklist);
  };

  const filteredNotes = stickyNotes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.checklistItems.some(i => i.text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={`flex flex-col h-full ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      {/* Top Header / Creator */}
      <div className={`p-4 border-b flex flex-wrap items-center justify-between gap-3 ${
        isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca nelle note..."
              className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border outline-none transition-colors ${
                isDark ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>
        </div>

        {/* Color picker for new note & creation button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-black/10 dark:bg-white/10 p-1 rounded-lg">
            {(['yellow', 'green', 'blue', 'purple', 'pink', 'dark'] as const).map(c => (
              <button
                key={c}
                onClick={() => setSelectedColor(c)}
                className={`w-5 h-5 rounded-full transition-transform ${
                  c === 'yellow' ? 'bg-amber-300' :
                  c === 'green' ? 'bg-emerald-300' :
                  c === 'blue' ? 'bg-sky-300' :
                  c === 'purple' ? 'bg-purple-300' :
                  c === 'pink' ? 'bg-rose-300' : 'bg-slate-700'
                } ${selectedColor === c ? 'scale-125 ring-2 ring-blue-500' : 'hover:scale-110'}`}
                title={`Colore ${c}`}
              />
            ))}
          </div>

          {/* Toggle checklist mode */}
          <button
            onClick={() => setNewIsChecklist(prev => !prev)}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
              newIsChecklist
                ? 'bg-blue-600 text-white border-blue-600'
                : isDark ? 'border-slate-700 text-slate-300' : 'border-slate-300 text-slate-700'
            }`}
            title="Crea come elenco puntato / to-do"
          >
            {newIsChecklist ? <CheckSquare className="w-3.5 h-3.5" /> : <AlignLeft className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">To-Do</span>
          </button>

          <button
            onClick={handleCreate}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-amber-950 font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Nuova Nota</span>
          </button>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="flex-1 p-4 overflow-auto">
        {filteredNotes.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <Sparkles className="w-10 h-10 text-amber-400/60 mb-2" />
            <p className="text-sm font-medium">Nessuna nota trovata</p>
            <p className="text-xs text-slate-500 mt-1">Crea una nuova nota o to-do adesivo per il tuo tablet!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredNotes.map(note => {
              const theme = COLOR_MAP[note.color] || COLOR_MAP.yellow;
              return (
                <div
                  key={note.id}
                  className={`flex flex-col rounded-xl border shadow-md transition-shadow overflow-hidden ${theme.bg} ${theme.text} ${theme.border}`}
                  style={{ minHeight: '220px' }}
                >
                  {/* Note Header */}
                  <div className={`flex items-center justify-between px-3 py-2 ${theme.header} border-b border-black/5 dark:border-white/5`}>
                    <input
                      type="text"
                      value={note.title}
                      onChange={(e) => updateStickyNote(note.id, { title: e.target.value })}
                      className="font-semibold text-xs bg-transparent border-none outline-none truncate flex-1"
                      placeholder="Titolo nota..."
                    />

                    <div className="flex items-center gap-1 ml-2">
                      {/* Pin to desktop toggle */}
                      <button
                        onClick={() => updateStickyNote(note.id, { isPinnedToDesktop: !note.isPinnedToDesktop })}
                        className={`p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${
                          note.isPinnedToDesktop ? 'text-blue-600 dark:text-blue-400' : 'opacity-40 hover:opacity-100'
                        }`}
                        title={note.isPinnedToDesktop ? 'Fissata sul Desktop' : 'Fissa sul Desktop'}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>

                      {/* Switch note type (text / checklist) */}
                      <button
                        onClick={() => updateStickyNote(note.id, { isChecklist: !note.isChecklist })}
                        className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors opacity-60 hover:opacity-100"
                        title={note.isChecklist ? 'Passa a testo' : 'Passa a to-do list'}
                      >
                        {note.isChecklist ? <AlignLeft className="w-3.5 h-3.5" /> : <CheckSquare className="w-3.5 h-3.5" />}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => deleteStickyNote(note.id)}
                        className="p-1 rounded hover:bg-red-500 hover:text-white transition-colors opacity-60 hover:opacity-100"
                        title="Elimina nota"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Note Body */}
                  <div className="flex-1 p-3 flex flex-col overflow-auto text-xs">
                    {note.isChecklist ? (
                      <div className="space-y-2 flex-1">
                        {note.checklistItems.map(item => (
                          <div key={item.id} className="flex items-center gap-2 group">
                            <input
                              type="checkbox"
                              checked={item.done}
                              onChange={(e) => {
                                const newItems = note.checklistItems.map(i =>
                                  i.id === item.id ? { ...i, done: e.target.checked } : i
                                );
                                updateStickyNote(note.id, { checklistItems: newItems });
                              }}
                              className="w-3.5 h-3.5 rounded text-blue-600 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={item.text}
                              onChange={(e) => {
                                const newItems = note.checklistItems.map(i =>
                                  i.id === item.id ? { ...i, text: e.target.value } : i
                                );
                                updateStickyNote(note.id, { checklistItems: newItems });
                              }}
                              className={`flex-1 bg-transparent border-none outline-none text-xs ${
                                item.done ? 'line-through opacity-50' : ''
                              }`}
                            />
                            <button
                              onClick={() => {
                                const newItems = note.checklistItems.filter(i => i.id !== item.id);
                                updateStickyNote(note.id, { checklistItems: newItems });
                              }}
                              className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-xs px-1"
                              title="Rimuovi voce"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newItem = { id: `item-${Date.now()}`, text: '', done: false };
                            updateStickyNote(note.id, { checklistItems: [...note.checklistItems, newItem] });
                          }}
                          className="flex items-center gap-1.5 text-xs opacity-70 hover:opacity-100 py-1 font-medium"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Aggiungi elemento</span>
                        </button>
                      </div>
                    ) : (
                      <textarea
                        value={note.content}
                        onChange={(e) => updateStickyNote(note.id, { content: e.target.value })}
                        placeholder="Scrivi qui i tuoi appunti..."
                        className="w-full h-full bg-transparent border-none outline-none resize-none leading-relaxed text-xs placeholder:text-current placeholder:opacity-40"
                      />
                    )}
                  </div>

                  {/* Note Footer */}
                  <div className="px-3 py-1.5 flex items-center justify-between text-[10px] opacity-60 border-t border-black/5 dark:border-white/5">
                    <span>{new Date(note.updatedAt).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="flex items-center gap-1">
                      {note.isPinnedToDesktop && <span className="text-blue-500 font-semibold">Desktop</span>}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
