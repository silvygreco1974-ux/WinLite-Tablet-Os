import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Minus, Square, Copy, X, LayoutGrid, Crosshair } from 'lucide-react';
import { WindowState } from '../../types/os';
import { useOS } from '../../context/OSContext';
import { AppIcon } from '../Common/AppIcon';

interface WindowFrameProps {
  window: WindowState;
  children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({ window: win, children }) => {
  const {
    activeWindowId,
    bringToFront,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    updateWindowPosition,
    updateWindowSize,
    snapWindow,
    settings,
  } = useOS();

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [showSnapMenu, setShowSnapMenu] = useState(false);


  const centerWindow = () => {
    const newX = Math.max(20, Math.floor((window.innerWidth - win.size.width) / 2));
    const newY = Math.max(20, Math.floor((window.innerHeight - win.size.height - 48) / 2));
    updateWindowPosition(win.id, { x: newX, y: newY });
  };

  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: win.position.x,
    posY: win.position.y,
  });

  const resizeStartRef = useRef<{ startX: number; startY: number; width: number; height: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    width: win.size.width,
    height: win.size.height,
    posX: win.position.x,
    posY: win.position.y,
  });

  const isActive = activeWindowId === win.id;

  // Handle Dragging
  const handlePointerDownHeader = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    if (win.isMaximized) return;

    e.preventDefault();
    bringToFront(win.id);
    setIsDragging(true);
    const headerEl = e.currentTarget as HTMLElement;
    headerEl.setPointerCapture(e.pointerId);

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: win.position.x,
      posY: win.position.y,
    };
  };

  const handlePointerMoveHeader = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;

    const maxX = window.innerWidth - 60;
    const maxY = window.innerHeight - 80;

    const newX = Math.max(0, Math.min(dragStartRef.current.posX + deltaX, maxX));
    const newY = Math.max(0, Math.min(dragStartRef.current.posY + deltaY, maxY));

    updateWindowPosition(win.id, { x: newX, y: newY });
  }, [isDragging, updateWindowPosition, win.id]);

  const handlePointerUpHeader = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore if not captured
      }
    }
  };

  // Handle Resizing
  const handlePointerDownResize = (e: React.PointerEvent, direction: string) => {
    e.stopPropagation();
    if (win.isMaximized) return;

    bringToFront(win.id);
    setIsResizing(direction);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    resizeStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      width: win.size.width,
      height: win.size.height,
      posX: win.position.x,
      posY: win.position.y,
    };
  };

  const handlePointerMoveResize = useCallback((e: React.PointerEvent) => {
    if (!isResizing) return;

    const deltaX = e.clientX - resizeStartRef.current.startX;
    const deltaY = e.clientY - resizeStartRef.current.startY;
    const minW = 280;
    const minH = 200;

    let newW = resizeStartRef.current.width;
    let newH = resizeStartRef.current.height;
    let newX = resizeStartRef.current.posX;
    let newY = resizeStartRef.current.posY;

    if (isResizing.includes('e')) {
      newW = Math.max(minW, resizeStartRef.current.width + deltaX);
    }
    if (isResizing.includes('s')) {
      newH = Math.max(minH, resizeStartRef.current.height + deltaY);
    }
    if (isResizing.includes('w')) {
      const possibleW = resizeStartRef.current.width - deltaX;
      if (possibleW >= minW) {
        newW = possibleW;
        newX = resizeStartRef.current.posX + deltaX;
      }
    }
    if (isResizing.includes('n')) {
      const possibleH = resizeStartRef.current.height - deltaY;
      if (possibleH >= minH) {
        newH = possibleH;
        newY = resizeStartRef.current.posY + deltaY;
      }
    }

    updateWindowSize(win.id, { width: newW, height: newH });
    if (newX !== win.position.x || newY !== win.position.y) {
      updateWindowPosition(win.id, { x: newX, y: newY });
    }
  }, [isResizing, updateWindowPosition, updateWindowSize, win.id, win.position.x, win.position.y]);

  const handlePointerUpResize = (e: React.PointerEvent) => {
    if (isResizing) {
      setIsResizing(null);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  // Close snap menu on outside click
  useEffect(() => {
    const handleClickOutside = () => setShowSnapMenu(false);
    if (showSnapMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showSnapMenu]);

  if (win.isMinimized) {
    return null;
  }

  const isDark = settings.theme === 'dark';

  return (
    <div
      onClick={() => bringToFront(win.id)}
      style={{
        zIndex: win.zIndex,
        ...(win.isMaximized
          ? {
              left: 0,
              top: 0,
              width: '100vw',
              height: 'calc(100vh - 48px)', // above taskbar
            }
          : {
              left: `${win.position.x}px`,
              top: `${win.position.y}px`,
              width: `${win.size.width}px`,
              height: `${win.size.height}px`,
            }),
      }}
      className={`fixed flex flex-col transition-shadow duration-150 select-none ${
        win.isMaximized ? 'rounded-none' : 'rounded-xl shadow-2xl'
      } ${
        isDark
          ? 'bg-slate-900/95 text-slate-100 border border-slate-700/60'
          : 'bg-white/95 text-slate-800 border border-slate-300/80 shadow-slate-900/20'
      } ${
        isActive
          ? isDark
            ? 'ring-1 ring-blue-500/50 shadow-blue-500/10'
            : 'ring-1 ring-blue-500/40 shadow-blue-500/20'
          : 'opacity-95'
      }`}
    >
      {/* Title Bar */}
      <div
        onPointerDown={handlePointerDownHeader}
        onPointerMove={handlePointerMoveHeader}
        onPointerUp={handlePointerUpHeader}
        onDoubleClick={() => maximizeWindow(win.id)}
        className={`flex items-center justify-between px-3.5 border-b cursor-grab active:cursor-grabbing shrink-0 select-none touch-none ${
          settings.tabletMode ? 'h-12' : 'h-10'
        } ${
          win.isMaximized ? 'rounded-none' : 'rounded-t-xl'
        } ${
          isDark
            ? 'bg-slate-800/90 border-slate-700/60 text-slate-200'
            : 'bg-slate-100/95 border-slate-200 text-slate-700'
        }`}
      >
        {/* Left: Window Icon + Title */}
        <div className="flex items-center gap-2.5 overflow-hidden pointer-events-none">
          <AppIcon name={win.icon} className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="text-xs font-semibold tracking-tight truncate max-w-[180px] sm:max-w-xs">
            {win.title}
          </span>
        </div>

        {/* Center: Tablet Drag Handle Grip */}
        <div className="hidden sm:flex items-center justify-center flex-1 pointer-events-none opacity-40">
          <div className="w-12 h-1 bg-current rounded-full" />
        </div>

        {/* Right: Window Controls (Generous touch targets) */}
        <div className="flex items-center space-x-1 shrink-0 relative">
          {/* Snap layouts button */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSnapMenu((prev) => !prev);
              }}
              className={`p-2 rounded-xl transition-colors min-w-[38px] min-h-[38px] flex items-center justify-center ${
                isDark ? 'hover:bg-slate-700 text-slate-100 hover:text-white bg-slate-700/40' : 'hover:bg-slate-200 text-slate-800 bg-slate-200/50'
              }`}
              title="Layout e Spostamento"
              aria-label="Layout e Spostamento"
            >
              <LayoutGrid className="w-4 h-4 stroke-[2.2]" />
            </button>

            {/* Snap & Touch Move popup */}
            {showSnapMenu && (
              <div
                onClick={(e) => e.stopPropagation()}
                className={`absolute right-0 top-11 z-50 p-3 rounded-2xl shadow-2xl border flex flex-col gap-2.5 backdrop-blur-xl w-64 ${
                  isDark
                    ? 'bg-slate-800/95 border-slate-700 text-white'
                    : 'bg-white/95 border-slate-200 text-slate-800'
                }`}
              >
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Layout & Spostamento Rapido
                </div>

                {/* Snap layouts */}
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => {
                      snapWindow(win.id, 'left');
                      setShowSnapMenu(false);
                    }}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-blue-500/20 border border-slate-500/20 group"
                    title="Affianca a sinistra"
                  >
                    <div className="w-10 h-6 border border-slate-400 rounded flex overflow-hidden">
                      <div className="w-1/2 bg-blue-500/60 h-full border-r border-slate-400" />
                      <div className="w-1/2 h-full" />
                    </div>
                    <span className="text-[10px] text-slate-400 group-hover:text-blue-400 font-medium">Sinistra</span>
                  </button>

                  <button
                    onClick={() => {
                      snapWindow(win.id, 'right');
                      setShowSnapMenu(false);
                    }}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-blue-500/20 border border-slate-500/20 group"
                    title="Affianca a destra"
                  >
                    <div className="w-10 h-6 border border-slate-400 rounded flex overflow-hidden">
                      <div className="w-1/2 h-full border-r border-slate-400" />
                      <div className="w-1/2 bg-blue-500/60 h-full" />
                    </div>
                    <span className="text-[10px] text-slate-400 group-hover:text-blue-400 font-medium">Destra</span>
                  </button>

                  <button
                    onClick={() => {
                      snapWindow(win.id, 'top');
                      setShowSnapMenu(false);
                    }}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-blue-500/20 border border-slate-500/20 group"
                    title="Schermo intero"
                  >
                    <div className="w-10 h-6 border border-slate-400 rounded bg-blue-500/60" />
                    <span className="text-[10px] text-slate-400 group-hover:text-blue-400 font-medium">Schermo Intero</span>
                  </button>
                </div>

                {/* Centra Finestra button */}
                <div className="pt-2 border-t border-slate-500/20">
                  <button
                    onClick={() => {
                      centerWindow();
                      setShowSnapMenu(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-500/30 hover:bg-blue-600 hover:text-white transition-colors text-xs font-semibold"
                  >
                    <Crosshair className="w-3.5 h-3.5 text-blue-400" />
                    <span>Centra Finestra sullo Schermo</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Minimize */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(win.id);
            }}
            className={`p-2 rounded-xl transition-colors min-w-[38px] min-h-[38px] flex items-center justify-center ${
              isDark ? 'hover:bg-slate-700 text-slate-100 hover:text-white bg-slate-700/40' : 'hover:bg-slate-200 text-slate-800 bg-slate-200/50'
            }`}
            title="Riduci a icona"
            aria-label="Riduci a icona"
          >
            <Minus className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Maximize / Restore */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              maximizeWindow(win.id);
            }}
            className={`p-2 rounded-xl transition-colors min-w-[38px] min-h-[38px] flex items-center justify-center ${
              isDark ? 'hover:bg-slate-700 text-slate-100 hover:text-white bg-slate-700/40' : 'hover:bg-slate-200 text-slate-800 bg-slate-200/50'
            }`}
            title={win.isMaximized ? 'Ripristina' : 'Ingrandisci'}
            aria-label={win.isMaximized ? 'Ripristina' : 'Ingrandisci'}
          >
            {win.isMaximized ? (
              <Copy className="w-3.5 h-3.5 rotate-180 stroke-[2.5]" />
            ) : (
              <Square className="w-4 h-4 stroke-[2.5]" />
            )}
          </button>

          {/* Close */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(win.id);
            }}
            className="p-2 rounded-xl transition-colors hover:bg-red-600 text-white bg-red-500/20 hover:text-white border border-red-500/30 min-w-[38px] min-h-[38px] flex items-center justify-center"
            title="Chiudi"
            aria-label="Chiudi"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-auto relative select-text flex flex-col">
        {children}
      </div>

      {/* Resize Handles (only when not maximized) */}
      {!win.isMaximized && (
        <>
          {/* Edges - Enlarged for tablet finger touch */}
          <div
            onPointerDown={(e) => handlePointerDownResize(e, 'e')}
            onPointerMove={handlePointerMoveResize}
            onPointerUp={handlePointerUpResize}
            className="absolute top-0 -right-1 w-4 h-full cursor-e-resize touch-none"
          />
          <div
            onPointerDown={(e) => handlePointerDownResize(e, 's')}
            onPointerMove={handlePointerMoveResize}
            onPointerUp={handlePointerUpResize}
            className="absolute -bottom-1 left-0 w-full h-4 cursor-s-resize touch-none"
          />
          <div
            onPointerDown={(e) => handlePointerDownResize(e, 'w')}
            onPointerMove={handlePointerMoveResize}
            onPointerUp={handlePointerUpResize}
            className="absolute top-0 -left-1 w-4 h-full cursor-w-resize touch-none"
          />
          <div
            onPointerDown={(e) => handlePointerDownResize(e, 'n')}
            onPointerMove={handlePointerMoveResize}
            onPointerUp={handlePointerUpResize}
            className="absolute -top-1 left-0 w-full h-4 cursor-n-resize touch-none"
          />

          {/* Corners - Enlarged for easy finger touch */}
          <div
            onPointerDown={(e) => handlePointerDownResize(e, 'se')}
            onPointerMove={handlePointerMoveResize}
            onPointerUp={handlePointerUpResize}
            className="absolute -bottom-2 -right-2 w-6 h-6 cursor-se-resize touch-none"
          />
          <div
            onPointerDown={(e) => handlePointerDownResize(e, 'sw')}
            onPointerMove={handlePointerMoveResize}
            onPointerUp={handlePointerUpResize}
            className="absolute -bottom-2 -left-2 w-6 h-6 cursor-sw-resize touch-none"
          />
          <div
            onPointerDown={(e) => handlePointerDownResize(e, 'ne')}
            onPointerMove={handlePointerMoveResize}
            onPointerUp={handlePointerUpResize}
            className="absolute -top-2 -right-2 w-6 h-6 cursor-ne-resize touch-none"
          />
          <div
            onPointerDown={(e) => handlePointerDownResize(e, 'nw')}
            onPointerMove={handlePointerMoveResize}
            onPointerUp={handlePointerUpResize}
            className="absolute -top-2 -left-2 w-6 h-6 cursor-nw-resize touch-none"
          />
        </>
      )}
    </div>
  );
};
