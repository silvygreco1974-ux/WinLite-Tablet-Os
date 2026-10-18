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
  yellow: {
    bg: 'bg-[#fef9c3] dark:bg-[#593d18]',
    text: 'text-[#1c1917] dark:text-[#fef3c7]',
    header: 'bg-[#fef08a] dark:bg-[#784719]',
    border: 'border-[#facc15] dark:border-[#a16207]'
  },
  green: {
    bg: 'bg-[#dcfce7] dark:bg-[#143d2c]',
    text: 'text-[#052e16] dark:text-[#d1fae5]',
    header: 'bg-[#bbf7d0] dark:bg-[#1b4d37]',
    border: 'border-[#86efac] dark:border-[#047857]'
  },
  blue: {
    bg: 'bg-[#e0f2fe] dark:bg-[#13374d]',
    text: 'text-[#082f49] dark:text-[#e0f2fe]',
    header: 'bg-[#bae6fd] dark:bg-[#1a4a68]',
    border: 'border-[#7dd3fc] dark:border-[#0284c7]'
  },
  purple: {
    bg: 'bg-[#f3e8ff] dark:bg-[#381e4d]',
    text: 'text-[#3b0764] dark:text-[#f5d0fe]',
    header: 'bg-[#e9d5ff] dark:bg-[#4b2568]',
    border: 'border-[#d8b4fe] dark:border-[#7e22ce]'
  },
  pink: {
    bg: 'bg-[#ffe4e6] dark:bg-[#451825]',
    text: 'text-[#4c0519] dark:text-[#ffe4e6]',
    header: 'bg-[#fecdd3] dark:bg-[#5e1e31]',
    border: 'border-[#fda4af] dark:border-[#be123c]'
  },
  dark: {
    bg: 'bg-[#293242]',
    text: 'text-[#f8fafc]',
    header: 'bg-[#343e52]',
    border: 'border-[#475569]'
  }
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
    <div className={`flex flex-col h-full select-none ${isDark ? 'bg-[#1b212d] text-[#f1f5f9]' : 'bg-[#f5f2ea] text-[#0f172a]'}`}>
      {/* Top Header / Creator */}
      <div className={`p-4 sm:p-5 border-b flex flex-wrap items-center justify-between gap-4 ${
        isDark ? 'bg-[#222938] border-[#364254]' : 'bg-[#fcfbfa] border-[#ded7cc]'
      }`}>
        <div className="flex items-center gap-3 flex-1 min-w-[220px]">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca nelle note..."
              className={`w-full pl-10 pr-4 py-2.5 text-base rounded-xl border outline-none transition-colors font-medium ${
                isDark ? 'bg-[#181d28] border-[#364254] text-white placeholder-slate-400' : 'bg-white border-[#ded7cc] text-[#0f172a] placeholder-slate-500'
              }`}
            />
          </div>
        </div>

        {/* Color picker for new note & creation button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-black/10 dark:bg-white/10 p-1.5 rounded-xl">
            {(['yellow', 'green', 'blue', 'purple', 'pink', 'dark'] as const).map(c => (
              <button
                key={c}
                onClick={() => setSelectedColor(c)}
                className={`w-6 h-6 rounded-full transition-transform ${
                  c === 'yellow' ? 'bg-amber-300' :
                  c === 'green' ? 'bg-emerald-300' :
                  c === 'blue' ? 'bg-sky-300' :
                  c === 'purple' ? 'bg-purple-300' :
                  c === 'pink' ? 'bg-rose-300' : 'bg-slate-700'
                } ${selectedColor === c ? 'scale-125 ring-2 ring-blue-500 ring-offset-1' : 'hover:scale-110'}`}
                title={`Colore ${c}`}
              />
            ))}
          </div>

          {/* Toggle checklist mode */}
          <button
            onClick={() => setNewIsChecklist(prev => !prev)}
            className={`px-3 py-2 rounded-xl border text-sm font-semibold flex items-center gap-2 transition-colors ${
              newIsChecklist
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : isDark ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-300 text-slate-800 bg-white hover:bg-slate-100'
            }`}
            title="Crea come elenco puntato / to-do"
          >
            {newIsChecklist ? <CheckSquare className="w-4 h-4" /> : <AlignLeft className="w-4 h-4" />}
            <span>To-Do</span>
          </button>

          <button
            onClick={handleCreate}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-amber-950 font-bold text-sm flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>Nuova Nota</span>
          </button>
        </div>
      </div>

      {/* Notes Grid: spacious, comfortable width and height */}
      <div className="flex-1 p-5 sm:p-6 overflow-auto">
        {filteredNotes.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
            <Sparkles className="w-12 h-12 text-amber-500 mb-3" />
            <p className="text-base font-bold text-slate-700 dark:text-slate-300">Nessuna nota trovata</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-sm">
              Crea una nuova nota o to-do adesivo per il tuo tablet toccando "Nuova Nota".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {filteredNotes.map(note => {
              const theme = COLOR_MAP[note.color] || COLOR_MAP.yellow;
              return (
                <div
                  key={note.id}
                  className={`flex flex-col rounded-2xl border-2 shadow-lg transition-all overflow-hidden ${theme.bg} ${theme.text} ${theme.border}`}
                  style={{ minHeight: '300px' }}
                >
                  {/* Note Header */}
                  <div className={`flex items-center justify-between px-4 py-3 ${theme.header} border-b border-black/10 dark:border-white/10`}>
                    <input
                      type="text"
                      value={note.title}
                      onChange={(e) => updateStickyNote(note.id, { title: e.target.value })}
                      className="font-bold text-base sm:text-lg bg-transparent border-none outline-none truncate flex-1 leading-snug"
                      placeholder="Titolo nota..."
                    />

                    <div className="flex items-center gap-1.5 ml-3 shrink-0">
                      {/* Pin to desktop toggle */}
                      <button
                        onClick={() => updateStickyNote(note.id, { isPinnedToDesktop: !note.isPinnedToDesktop })}
                        className={`p-2 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${
                          note.isPinnedToDesktop ? 'text-blue-600 dark:text-blue-400 font-bold' : 'opacity-60 hover:opacity-100'
                        }`}
                        title={note.isPinnedToDesktop ? 'Fissata sul Desktop' : 'Fissa sul Desktop'}
                      >
                        <Pin className="w-5 h-5" />
                      </button>

                      {/* Switch note type (text / checklist) */}
                      <button
                        onClick={() => updateStickyNote(note.id, { isChecklist: !note.isChecklist })}
                        className="p-2 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors opacity-75 hover:opacity-100"
                        title={note.isChecklist ? 'Passa a testo libero' : 'Passa a lista to-do'}
                      >
                        {note.isChecklist ? <AlignLeft className="w-5 h-5" /> : <CheckSquare className="w-5 h-5" />}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => deleteStickyNote(note.id)}
                        className="p-2 rounded-xl hover:bg-red-500 hover:text-white transition-colors opacity-75 hover:opacity-100"
                        title="Elimina nota"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Note Body */}
                  <div className="flex-1 p-4 sm:p-5 flex flex-col overflow-auto text-base leading-relaxed">
                    {note.isChecklist ? (
                      <div className="space-y-3 flex-1">
                        {note.checklistItems.map(item => (
                          <div key={item.id} className="flex items-center gap-3 group">
                            <input
                              type="checkbox"
                              checked={item.done}
                              onChange={(e) => {
                                const newItems = note.checklistItems.map(i =>
                                  i.id === item.id ? { ...i, done: e.target.checked } : i
                                );
                                updateStickyNote(note.id, { checklistItems: newItems });
                              }}
                              className="w-5 h-5 rounded text-blue-600 cursor-pointer shrink-0 accent-blue-600"
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
                              className={`flex-1 bg-transparent border-none outline-none text-base font-medium ${
                                item.done ? 'line-through opacity-60' : ''
                              }`}
                            />
                            <button
                              onClick={() => {
                                const newItems = note.checklistItems.filter(i => i.id !== item.id);
                                updateStickyNote(note.id, { checklistItems: newItems });
                              }}
                              className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-sm px-2 font-bold transition-opacity"
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
                          className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 py-2 font-bold transition-opacity"
                        >
                          <Plus className="w-4 h-4 stroke-[2.5]" />
                          <span>Aggiungi elemento</span>
                        </button>
                      </div>
                    ) : (
                      <textarea
                        value={note.content}
                        onChange={(e) => updateStickyNote(note.id, { content: e.target.value })}
                        placeholder="Scrivi qui i tuoi appunti..."
                        className="w-full flex-1 bg-transparent border-none outline-none resize-none leading-relaxed text-base font-medium placeholder:text-current placeholder:opacity-50 min-h-[160px]"
                      />
                    )}
                  </div>

                  {/* Note Footer */}
                  <div className="px-4 py-2.5 flex items-center justify-between text-xs font-semibold opacity-75 border-t border-black/10 dark:border-white/10">
                    <span>{new Date(note.updatedAt).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="flex items-center gap-1.5">
                      {note.isPinnedToDesktop && <span className="text-blue-600 dark:text-blue-400 font-bold">★ Fissata su Desktop</span>}
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
