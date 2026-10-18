import React, { useState, useRef, useCallback } from 'react';
import { Plus, CheckSquare, AlignLeft, X } from 'lucide-react';
import { StickyNote } from '../../types/os';
import { useOS } from '../../context/OSContext';

interface DesktopStickyNoteProps {
  note: StickyNote;
}

const COLOR_MAP: Record<StickyNote['color'], { bg: string; text: string; header: string; border: string }> = {
  yellow: {
    bg: 'bg-[#fef9c3]',
    text: 'text-[#1c1917]',
    header: 'bg-[#fef08a]',
    border: 'border-[#facc15]'
  },
  green: {
    bg: 'bg-[#dcfce7]',
    text: 'text-[#052e16]',
    header: 'bg-[#bbf7d0]',
    border: 'border-[#86efac]'
  },
  blue: {
    bg: 'bg-[#e0f2fe]',
    text: 'text-[#082f49]',
    header: 'bg-[#bae6fd]',
    border: 'border-[#7dd3fc]'
  },
  purple: {
    bg: 'bg-[#f3e8ff]',
    text: 'text-[#3b0764]',
    header: 'bg-[#e9d5ff]',
    border: 'border-[#d8b4fe]'
  },
  pink: {
    bg: 'bg-[#ffe4e6]',
    text: 'text-[#4c0519]',
    header: 'bg-[#fecdd3]',
    border: 'border-[#fda4af]'
  },
  dark: {
    bg: 'bg-[#242c3d]',
    text: 'text-[#f8fafc]',
    header: 'bg-[#2f394e]',
    border: 'border-[#475569]'
  }
};

export const DesktopStickyNote: React.FC<DesktopStickyNoteProps> = ({ note }) => {
  const { updateStickyNote, deleteStickyNote, addStickyNote } = useOS();
  const [isDragging, setIsDragging] = useState(false);

  const noteWidth = Math.max(note.width || 340, 320);
  const noteHeight = Math.max(note.height || 280, 260);

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

    const newX = Math.max(10, Math.min(dragStartRef.current.posX + deltaX, window.innerWidth - noteWidth - 10));
    const newY = Math.max(10, Math.min(dragStartRef.current.posY + deltaY, window.innerHeight - noteHeight - 60));

    updateStickyNote(note.id, { x: newX, y: newY });
  }, [isDragging, noteHeight, note.id, noteWidth, updateStickyNote]);

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
        width: `${noteWidth}px`,
        minHeight: `${noteHeight}px`,
        zIndex: 5,
      }}
      className={`absolute flex flex-col rounded-2xl border-2 shadow-xl select-none transition-shadow ${theme.bg} ${theme.text} ${theme.border}`}
    >
      {/* Title / Drag Handle */}
      <div
        onPointerDown={handlePointerDownHeader}
        onPointerMove={handlePointerMoveHeader}
        onPointerUp={handlePointerUpHeader}
        className={`flex items-center justify-between px-3.5 py-2.5 ${theme.header} rounded-t-2xl cursor-grab active:cursor-grabbing border-b border-black/10 dark:border-white/10 touch-none`}
      >
        <button
          onClick={() => addStickyNote(note.color, 'Nuova Nota', '', note.isChecklist)}
          className="p-1.5 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors min-w-[34px] min-h-[34px] flex items-center justify-center shrink-0"
          title="Aggiungi nuova nota"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>

        <input
          type="text"
          value={note.title}
          onChange={(e) => updateStickyNote(note.id, { title: e.target.value })}
          className="font-bold text-sm sm:text-base bg-transparent border-none outline-none truncate text-center flex-1 mx-2"
          placeholder="Titolo nota..."
        />

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => updateStickyNote(note.id, { isChecklist: !note.isChecklist })}
            className="p-1.5 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            title={note.isChecklist ? 'Passa a testo' : 'Passa a to-do list'}
          >
            {note.isChecklist ? <AlignLeft className="w-4.5 h-4.5" /> : <CheckSquare className="w-4.5 h-4.5" />}
          </button>
          <button
            onClick={() => deleteStickyNote(note.id)}
            className="p-1.5 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
            title="Elimina nota"
          >
            <X className="w-4.5 h-4.5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Note Content */}
      <div className="flex-1 p-4 flex flex-col select-text text-sm sm:text-base">
        {note.isChecklist ? (
          <div className="space-y-2.5 flex-1 overflow-auto max-h-56">
            {note.checklistItems.map(item => (
              <div key={item.id} className="flex items-center gap-2.5 group">
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={(e) => {
                    const newItems = note.checklistItems.map(i =>
                      i.id === item.id ? { ...i, done: e.target.checked } : i
                    );
                    updateStickyNote(note.id, { checklistItems: newItems });
                  }}
                  className="w-4.5 h-4.5 rounded text-blue-600 cursor-pointer shrink-0 accent-blue-600"
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
                  className={`flex-1 bg-transparent border-none outline-none text-sm sm:text-base font-medium ${
                    item.done ? 'line-through opacity-60' : ''
                  }`}
                />
                <button
                  onClick={() => {
                    const newItems = note.checklistItems.filter(i => i.id !== item.id);
                    updateStickyNote(note.id, { checklistItems: newItems });
                  }}
                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-xs px-1 font-bold"
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
              className="flex items-center gap-1.5 text-xs sm:text-sm opacity-80 hover:opacity-100 py-1.5 font-bold"
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
            className="w-full flex-1 bg-transparent border-none outline-none resize-none leading-relaxed text-sm sm:text-base font-medium placeholder:text-current placeholder:opacity-50 min-h-[140px]"
          />
        )}
      </div>
    </div>
  );
};
