import React, { useState, useRef, useCallback } from 'react';
import {
  FileText,
  Code2,
  StickyNote as StickyIcon,
  Globe,
  FolderOpen,
  Calculator,
  Settings,
  Plus,
  Maximize2,
  Palette,
  LayoutGrid,
  Move,
  ExternalLink,
  Check
} from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { AppIcon } from '../Common/AppIcon';
import { DesktopStickyNote } from './DesktopStickyNote';

interface DesktopIconItem {
  id: string;
  title: string;
  icon: string;
  color?: string;
  action: () => void;
}

export const Desktop: React.FC = () => {
  const {
    openWindow,
    addStickyNote,
    stickyNotes,
    webApps,
    settings,
    updateSettings,
    updateDesktopIconPosition,
    resetDesktopIcons,
    closeAllFlyouts,
    toggleFullscreen,
    isFullscreen
  } = useOS();

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const [draggingIconId, setDraggingIconId] = useState<string | null>(null);

  const desktopRef = useRef<HTMLDivElement>(null);
  const isDark = settings.theme === 'dark';

  const dragStartRef = useRef<{ startX: number; startY: number; iconX: number; iconY: number; hasMoved: boolean }>({
    startX: 0,
    startY: 0,
    iconX: 0,
    iconY: 0,
    hasMoved: false,
  });

  // Base core apps icons
  const baseIcons: DesktopIconItem[] = [
    {
      id: 'app-text-editor',
      title: 'Editor di Testo',
      icon: 'FileText',
      color: '#0078d4',
      action: () => openWindow('text-editor'),
    },
    {
      id: 'app-code-editor',
      title: 'Code Studio',
      icon: 'Code2',
      color: '#10b981',
      action: () => openWindow('code-editor'),
    },
    {
      id: 'app-sticky-notes',
      title: 'Note Adesive',
      icon: 'StickyIcon',
      color: '#f59e0b',
      action: () => openWindow('sticky-notes'),
    },
    {
      id: 'app-web-manager',
      title: 'Le Mie Web App',
      icon: 'Globe',
      color: '#6366f1',
      action: () => openWindow('web-manager'),
    },
    {
      id: 'app-file-explorer',
      title: 'Gestione File',
      icon: 'FolderOpen',
      color: '#0284c7',
      action: () => openWindow('file-explorer'),
    },
    {
      id: 'app-calculator',
      title: 'Calcolatrice',
      icon: 'Calculator',
      color: '#0d9488',
      action: () => openWindow('calculator'),
    },
    {
      id: 'app-settings',
      title: 'Impostazioni',
      icon: 'Settings',
      color: '#64748b',
      action: () => openWindow('settings'),
    },
  ];

  // Pinned web apps
  const pinnedWebApps: DesktopIconItem[] = webApps
    .filter(app => app.isPinnedDesktop)
    .map(app => ({
      id: `web-${app.id}`,
      title: app.name,
      icon: app.icon,
      color: app.color,
      action: () => {
        if (app.openMode === 'tab') {
          window.open(app.url, '_blank', 'noopener,noreferrer');
        } else {
          openWindow('web-viewer', app.name, app.icon, { url: app.url, appName: app.name });
        }
      }
    }));

  const allDesktopIcons = [...baseIcons, ...pinnedWebApps];

  // Calculate default grid position for an icon if not customized
  const getDefaultPosition = (index: number) => {
    const iconWidth = settings.tabletMode ? 96 : 84;
    const iconHeight = settings.tabletMode ? 104 : 92;
    const rows = Math.max(3, Math.floor((window.innerHeight - 100) / iconHeight));
    const col = Math.floor(index / rows);
    const row = index % rows;

    const x = 20 + col * (iconWidth + 14);
    const y = 20 + row * (iconHeight + 14);
    return { x, y };
  };

  // Touch & Pointer Dragging for desktop icons
  const handlePointerDownIcon = (e: React.PointerEvent, item: DesktopIconItem, index: number) => {
    e.stopPropagation();
    closeAllFlyouts();
    setSelectedIconId(item.id);

    const pos = settings.desktopIconPositions?.[item.id] || getDefaultPosition(index);

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      iconX: pos.x,
      iconY: pos.y,
      hasMoved: false,
    };

    setDraggingIconId(item.id);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMoveIcon = (e: React.PointerEvent, itemId: string) => {
    if (draggingIconId !== itemId) return;

    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;

    // Movement threshold for touch tap vs drag (15px to prevent false drag on tap)
    if (Math.abs(deltaX) > 15 || Math.abs(deltaY) > 15) {
      dragStartRef.current.hasMoved = true;
    }

    if (dragStartRef.current.hasMoved) {
      const maxX = window.innerWidth - (settings.tabletMode ? 100 : 90);
      const maxY = window.innerHeight - (settings.tabletMode ? 140 : 120);

      const newX = Math.max(10, Math.min(dragStartRef.current.iconX + deltaX, maxX));
      const newY = Math.max(10, Math.min(dragStartRef.current.iconY + deltaY, maxY));

      updateDesktopIconPosition(itemId, { x: newX, y: newY });
    }
  };

  const handlePointerUpIcon = (e: React.PointerEvent, item: DesktopIconItem) => {
    if (draggingIconId === item.id) {
      const moved = dragStartRef.current.hasMoved;
      setDraggingIconId(null);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }

      // If user tapped without dragging, launch the app directly!
      if (!moved) {
        setSelectedIconId(null);
        item.action();
      }
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    closeAllFlyouts();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleDesktopClick = (e: React.MouseEvent) => {
    if (contextMenu) setContextMenu(null);
    if ((e.target as HTMLElement) === desktopRef.current) {
      setSelectedIconId(null);
      closeAllFlyouts();
    }
  };

  // Pinned sticky notes
  const pinnedStickyNotes = stickyNotes.filter(n => n.isPinnedToDesktop);

  return (
    <div
      ref={desktopRef}
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
      style={{
        background: settings.wallpaper,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      className="relative w-screen h-screen overflow-hidden select-none touch-none"
    >
      {/* Desktop Icons (Freely draggable across screen) */}
      {allDesktopIcons.map((item, index) => {
        const customPos = settings.desktopIconPositions?.[item.id];
        const pos = customPos || getDefaultPosition(index);
        const isSelected = selectedIconId === item.id;
        const isDragging = draggingIconId === item.id;

        return (
          <div
            key={item.id}
            onPointerDown={(e) => handlePointerDownIcon(e, item, index)}
            onPointerMove={(e) => handlePointerMoveIcon(e, item.id)}
            onPointerUp={(e) => handlePointerUpIcon(e, item)}
            onDoubleClick={(e) => {
              e.stopPropagation();
              item.action();
            }}
            style={{
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              zIndex: isDragging ? 30 : 1,
            }}
            className={`absolute flex flex-col items-center justify-center rounded-2xl cursor-grab active:cursor-grabbing transition-transform touch-none ${
              settings.tabletMode ? 'w-24 h-26 p-2' : 'w-20 h-22 p-1.5'
            } ${
              isDragging ? 'scale-110 shadow-2xl z-40' : ''
            } ${
              isSelected
                ? 'bg-white/25 backdrop-blur-md ring-2 ring-blue-400 shadow-lg'
                : 'hover:bg-white/15 hover:backdrop-blur-xs'
            }`}
          >
            {/* Icon Graphic */}
            <div
              className={`flex items-center justify-center rounded-2xl shadow-md transition-transform relative ${
                settings.tabletMode ? 'w-13 h-13' : 'w-11 h-11'
              }`}
              style={{ backgroundColor: item.color || '#0078d4' }}
            >
              <AppIcon
                name={item.icon}
                className={settings.tabletMode ? 'w-7 h-7 text-white' : 'w-6 h-6 text-white'}
              />

              {/* Touch Drag Indicator Dot */}
              <div
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-white/80 opacity-0 group-hover:opacity-100"
                title="Tocca e trascina per spostare"
              >
                <Move className="w-2.5 h-2.5" />
              </div>
            </div>

            {/* Label */}
            <span className="mt-1.5 text-[11px] font-semibold text-white text-center line-clamp-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] px-1 leading-tight select-none">
              {item.title}
            </span>

            {/* If Selected & SingleTapOpen is off, show touch "Apri" button */}
            {isSelected && !settings.singleTapOpen && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  item.action();
                }}
                className="mt-1 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold shadow-md animate-in fade-in"
              >
                Apri
              </button>
            )}
          </div>
        );
      })}



      {/* Pinned Sticky Notes on Wallpaper */}
      {pinnedStickyNotes.map(note => (
        <DesktopStickyNote key={note.id} note={note} />
      ))}

      {/* Desktop Context Menu */}
      {contextMenu && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            left: `${Math.min(contextMenu.x, window.innerWidth - 240)}px`,
            top: `${Math.min(contextMenu.y, window.innerHeight - 300)}px`,
            zIndex: 9999,
          }}
          className={`fixed w-60 p-2 rounded-2xl border shadow-2xl backdrop-blur-xl text-xs select-none ${
            isDark
              ? 'bg-slate-900/95 border-slate-700 text-slate-200'
              : 'bg-white/95 border-slate-200 text-slate-800'
          }`}
        >
          <button
            onClick={() => {
              openWindow('text-editor');
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-600 hover:text-white transition-colors text-left"
          >
            <FileText className="w-4 h-4 text-blue-400" />
            <span>Nuovo Documento</span>
          </button>

          <button
            onClick={() => {
              addStickyNote('yellow', 'Nuova Nota', '', false);
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-600 hover:text-white transition-colors text-left"
          >
            <StickyIcon className="w-4 h-4 text-amber-400" />
            <span>Nuova Nota Adesiva</span>
          </button>

          <button
            onClick={() => {
              openWindow('web-manager');
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-600 hover:text-white transition-colors text-left"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Aggiungi Web App</span>
          </button>

          <div className="my-1.5 border-t border-slate-500/20" />

          {/* Reset / Align Desktop Icons */}
          <button
            onClick={() => {
              resetDesktopIcons();
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-600 hover:text-white transition-colors text-left"
          >
            <LayoutGrid className="w-4 h-4 text-cyan-400" />
            <span>Allinea Icone Desktop</span>
          </button>

          {/* Toggle Single Tap to Open */}
          <button
            onClick={() => {
              updateSettings({ singleTapOpen: !settings.singleTapOpen });
              setContextMenu(null);
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-blue-600 hover:text-white transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <Check className={`w-4 h-4 ${settings.singleTapOpen ? 'text-emerald-400' : 'opacity-0'}`} />
              <span>Tocco singolo per aprire</span>
            </div>
            <span className="text-[10px] text-slate-400">{settings.singleTapOpen ? 'Attivo' : 'Doppio'}</span>
          </button>

          <button
            onClick={() => {
              toggleFullscreen();
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-600 hover:text-white transition-colors text-left"
          >
            <Maximize2 className="w-4 h-4 text-purple-400" />
            <span>{isFullscreen ? 'Esci da Schermo Intero' : 'Schermo Intero Tablet'}</span>
          </button>

          <button
            onClick={() => {
              openWindow('settings');
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-600 hover:text-white transition-colors text-left"
          >
            <Palette className="w-4 h-4 text-rose-400" />
            <span>Personalizza Sfondo</span>
          </button>
        </div>
      )}
    </div>
  );
};
