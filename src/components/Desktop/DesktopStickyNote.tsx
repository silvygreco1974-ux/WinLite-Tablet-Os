import React, { useState, useRef, useCallback } from 'react';
import { Plus, Trash2, CheckSquare, AlignLeft, X } from 'lucide-react';
import { StickyNote } from '../../types/os';
import { useOS } from '../../context/OSContext';

interface DesktopStickyNoteProps {
  note: StickyNote;
}

const COLOR_MAP: Record<StickyNote['color'], { bg: string; text: string; header: string; border: string }> = {
  yellow: { bg: 'bg-amber-100/95 dark:bg-amber-900/90', text: 'text-amber-950 dark:text-amber-100', header: 'bg-amber-200/90 dark:bg-amber-800/90', border: 'border-amber-300/80 dark:border-amber-700/80' },
  green: { bg: 'bg-emerald-100/95 dark:bg-emerald-900/90', text: 'text-emerald-950 dark:text-emerald-100', header: 'bg-emerald-200/90 dark:bg-emerald-800/90', border: 'border-emerald-300/80 dark:border-emerald-700/80' },
  blue: { bg: 'bg-sky-100/95 dark:bg-sky-900/90', text: 'text-sky-950 dark:text-sky-100', header: 'bg-sky-200/90 dark:bg-sky-800/90', border: 'border-sky-300/80 dark:border-sky-700/80' },
  purple: { bg: 'bg-purple-100/95 dark:bg-purple-900/90', text: 'text-purple-950 dark:text-purple-100', header: 'bg-purple-200/90 dark:bg-purple-800/90', border: 'border-purple-300/80 dark:border-purple-700/80' },
  pink: { bg: 'bg-rose-100/95 dark:bg-rose-900/90', text: 'text-rose-950 dark:text-rose-100', header: 'bg-rose-200/90 dark:bg-rose-800/90', border: 'border-rose-300/80 dark:border-rose-700/80' },
  dark: { bg: 'bg-slate-800/95', text: 'text-slate-100', header: 'bg-slate-700/90', border: 'border-slate-600' }
};

export const DesktopStickyNote: React.FC<DesktopStickyNoteProps> = ({ note }) => {
  const { updateStickyNote, deleteStickyNote, addStickyNote } = useOS();
  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: note.x,
    posY: note.y,
  });

  const handlePointerDownHeader = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) return;
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: note.x,
      posY: note.y,
    };
  };

  const handlePointerMoveHeader = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;

    const newX = Math.max(10, Math.min(dragStartRef.current.posX + deltaX, window.innerWidth - note.width - 10));
    const newY = Math.max(10, Math.min(dragStartRef.current.posY + deltaY, window.innerHeight - note.height - 60));

    updateStickyNote(note.id, { x: newX, y: newY });
  }, [isDragging, note.height, note.id, note.width, updateStickyNote]);

  const handlePointerUpHeader = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  const theme = COLOR_MAP[note.color] || COLOR_MAP.yellow;

  return (
    <div
      style={{
        left: `${note.x}px`,
        top: `${note.y}px`,
        width: `${note.width}px`,
        minHeight: `${note.height}px`,
        zIndex: 5, // Under open windows (which start at 10+), but on top of desktop wallpaper
      }}
      className={`absolute flex flex-col rounded-xl border shadow-lg backdrop-blur-xs select-none transition-shadow ${theme.bg} ${theme.text} ${theme.border}`}
    >
      {/* Title / Drag Handle */}
      <div
        onPointerDown={handlePointerDownHeader}
        onPointerMove={handlePointerMoveHeader}
        onPointerUp={handlePointerUpHeader}
        className={`flex items-center justify-between px-3 py-2 ${theme.header} rounded-t-xl cursor-grab active:cursor-grabbing border-b border-black/5 dark:border-white/5 touch-none`}
      >
        <button
          onClick={() => addStickyNote(note.color, 'Nuova Nota', '', note.isChecklist)}
          className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
          title="Aggiungi nuova nota"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </button>

        <input
          type="text"
          value={note.title}
          onChange={(e) => updateStickyNote(note.id, { title: e.target.value })}
          className="font-semibold text-xs bg-transparent border-none outline-none truncate text-center flex-1 mx-2"
          placeholder="Titolo..."
        />

        <div className="flex items-center gap-0.5">
          <button
            onClick={() => updateStickyNote(note.id, { isChecklist: !note.isChecklist })}
            className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            title={note.isChecklist ? 'Passa a testo' : 'Passa a to-do list'}
          >
            {note.isChecklist ? <AlignLeft className="w-3 h-3" /> : <CheckSquare className="w-3 h-3" />}
          </button>
          <button
            onClick={() => deleteStickyNote(note.id)}
            className="p-1 rounded hover:bg-red-500 hover:text-white transition-colors"
            title="Elimina nota"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Note Content */}
      <div className="flex-1 p-3 flex flex-col select-text text-xs">
        {note.isChecklist ? (
          <div className="space-y-1.5 flex-1 overflow-auto max-h-48">
            {note.checklistItems.map(item => (
              <div key={item.id} className="flex items-center gap-1.5 group">
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={(e) => {
                    const newItems = note.checklistItems.map(i =>
                      i.id === item.id ? { ...i, done: e.target.checked } : i
                    );
                    updateStickyNote(note.id, { checklistItems: newItems });
                  }}
                  className="w-3.5 h-3.5 rounded text-blue-600 cursor-pointer shrink-0"
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
              className="flex items-center gap-1 text-[11px] opacity-70 hover:opacity-100 py-1 font-medium"
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
            className="w-full flex-1 bg-transparent border-none outline-none resize-none leading-relaxed text-xs placeholder:text-current placeholder:opacity-40 min-h-[100px]"
          />
        )}
      </div>
    </div>
  );
};
