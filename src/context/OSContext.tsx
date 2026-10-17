import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AppType, CustomWebApp, StickyNote, SystemSettings, VirtualFile, WindowState } from '../types/os';
import { INITIAL_FILES, INITIAL_SETTINGS, INITIAL_STICKY_NOTES, INITIAL_WEB_APPS } from '../data/defaults';

interface OSContextType {
  windows: WindowState[];
  activeWindowId: string | null;
  openWindow: (appType: AppType, title?: string, icon?: string, customData?: Record<string, any>, initialSize?: { width: number; height: number }) => string;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  bringToFront: (id: string) => void;
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;
  snapWindow: (id: string, direction: 'left' | 'right' | 'top' | 'restore') => void;
  
  // UI states
  isStartMenuOpen: boolean;
  setIsStartMenuOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  isActionCenterOpen: boolean;
  setIsActionCenterOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  isCalendarOpen: boolean;
  setIsCalendarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  closeAllFlyouts: () => void;

  // Sticky notes
  stickyNotes: StickyNote[];
  addStickyNote: (color?: StickyNote['color'], title?: string, content?: string, isChecklist?: boolean) => StickyNote;
  updateStickyNote: (id: string, updates: Partial<StickyNote>) => void;
  deleteStickyNote: (id: string) => void;

  // Virtual Files
  files: VirtualFile[];
  addFile: (name: string, content: string, type: VirtualFile['type'], extension: string, language?: string, folder?: VirtualFile['folder']) => VirtualFile;
  updateFile: (id: string, content: string, name?: string) => void;
  moveFile: (id: string, targetFolder: string) => void;
  deleteFile: (id: string) => void;
  getFile: (id: string) => VirtualFile | undefined;
  exportAllBackup: () => void;
  importBackup: (jsonData: string) => boolean;

  // Custom Web Apps
  webApps: CustomWebApp[];
  addWebApp: (app: Omit<CustomWebApp, 'id' | 'addedAt'>) => CustomWebApp;
  updateWebApp: (id: string, updates: Partial<CustomWebApp>) => void;
  deleteWebApp: (id: string) => void;

  // Settings & Desktop layout
  settings: SystemSettings;
  updateSettings: (updates: Partial<SystemSettings>) => void;
  updateDesktopIconPosition: (iconId: string, position: { x: number; y: number }) => void;
  resetDesktopIcons: () => void;

  // Device & Storage
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  storageUsedKB: number;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  SETTINGS: 'winlite_settings_v1',
  WEB_APPS: 'winlite_web_apps_v1',
  STICKY_NOTES: 'winlite_sticky_notes_v1',
  FILES: 'winlite_files_v1',
};

export const OSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [maxZIndex, setMaxZIndex] = useState<number>(10);

  // Flyouts
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isActionCenterOpen, setIsActionCenterOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Persistence
  const [settings, setSettings] = useState<SystemSettings>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS);
      return saved ? { ...INITIAL_SETTINGS, ...JSON.parse(saved) } : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [webApps, setWebApps] = useState<CustomWebApp[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.WEB_APPS);
      return saved ? JSON.parse(saved) : INITIAL_WEB_APPS;
    } catch {
      return INITIAL_WEB_APPS;
    }
  });

  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.STICKY_NOTES);
      return saved ? JSON.parse(saved) : INITIAL_STICKY_NOTES;
    } catch {
      return INITIAL_STICKY_NOTES;
    }
  });

  const [files, setFiles] = useState<VirtualFile[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.FILES);
      return saved ? JSON.parse(saved) : INITIAL_FILES;
    } catch {
      return INITIAL_FILES;
    }
  });

  // Calculate storage space in KB
  const [storageUsedKB, setStorageUsedKB] = useState(0);

  const calculateStorage = useCallback(() => {
    try {
      let totalBytes = 0;
      for (const key of Object.values(LOCAL_STORAGE_KEYS)) {
        const val = localStorage.getItem(key);
        if (val) totalBytes += val.length * 2;
      }
      setStorageUsedKB(Math.round((totalBytes / 1024) * 10) / 10);
    } catch {
      setStorageUsedKB(0);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      calculateStorage();
    } catch (e) {
      console.error(e);
    }
  }, [settings, calculateStorage]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.WEB_APPS, JSON.stringify(webApps));
      calculateStorage();
    } catch (e) {
      console.error(e);
    }
  }, [webApps, calculateStorage]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.STICKY_NOTES, JSON.stringify(stickyNotes));
      calculateStorage();
    } catch (e) {
      console.error(e);
    }
  }, [stickyNotes, calculateStorage]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.FILES, JSON.stringify(files));
      calculateStorage();
    } catch (e) {
      console.error(e);
    }
  }, [files, calculateStorage]);

  // Fullscreen event listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const closeAllFlyouts = useCallback(() => {
    setIsStartMenuOpen(false);
    setIsActionCenterOpen(false);
    setIsCalendarOpen(false);
  }, []);

  const bringToFront = useCallback((id: string) => {
    setMaxZIndex(prev => {
      const nextZ = prev + 1;
      setWindows(curr => curr.map(w => w.id === id ? { ...w, zIndex: nextZ, isMinimized: false } : w));
      return nextZ;
    });
    setActiveWindowId(id);
  }, []);

  // Window default sizes & icons
  const getAppDefaults = (appType: AppType): { title: string; icon: string; width: number; height: number } => {
    const isMobileViewport = window.innerWidth < 768;
    const baseW = isMobileViewport ? Math.max(window.innerWidth - 20, 320) : Math.min(window.innerWidth * 0.72, 860);
    const baseH = isMobileViewport ? Math.max(window.innerHeight - 100, 420) : Math.min(window.innerHeight * 0.75, 620);

    switch (appType) {
      case 'text-editor':
        return { title: 'Editor di Testo', icon: 'FileText', width: baseW, height: baseH };
      case 'code-editor':
        return { title: 'Code Studio', icon: 'Code', width: Math.min(window.innerWidth * 0.8, 980), height: Math.min(window.innerHeight * 0.8, 680) };
      case 'sticky-notes':
        return { title: 'Note Adesive', icon: 'StickyNote', width: 440, height: 500 };
      case 'web-manager':
        return { title: 'Le Mie Web App', icon: 'Globe', width: Math.min(window.innerWidth * 0.7, 820), height: 580 };
      case 'web-viewer':
        return { title: 'Browser Web', icon: 'Compass', width: Math.min(window.innerWidth * 0.82, 1024), height: Math.min(window.innerHeight * 0.82, 700) };
      case 'file-explorer':
        return { title: 'Gestione File', icon: 'FolderOpen', width: Math.min(window.innerWidth * 0.7, 780), height: 520 };
      case 'calculator':
        return { title: 'Calcolatrice', icon: 'Calculator', width: 340, height: 490 };
      case 'settings':
        return { title: 'Impostazioni', icon: 'Settings', width: Math.min(window.innerWidth * 0.65, 750), height: 560 };
      default:
        return { title: 'Applicazione', icon: 'AppWindow', width: 600, height: 450 };
    }
  };

  const openWindow = useCallback((
    appType: AppType, 
    customTitle?: string, 
    customIcon?: string, 
    customData?: Record<string, any>, 
    initialSize?: { width: number; height: number }
  ) => {
    closeAllFlyouts();

    // If single-instance app already open (like settings or calculator), bring it to front
    if (['settings', 'calculator', 'file-explorer', 'sticky-notes', 'web-manager'].includes(appType)) {
      const existing = windows.find(w => w.appType === appType);
      if (existing) {
        bringToFront(existing.id);
        return existing.id;
      }
    }

    const defaults = getAppDefaults(appType);
    const width = initialSize?.width || defaults.width;
    const height = initialSize?.height || defaults.height;

    // Stagger window position
    const offsetX = 40 + (windows.length % 6) * 30;
    const offsetY = 40 + (windows.length % 6) * 30;
    const x = Math.max(10, Math.min(offsetX, window.innerWidth - width - 20));
    const y = Math.max(10, Math.min(offsetY, window.innerHeight - height - 80));

    const newWindowId = `win-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const nextZ = maxZIndex + 1;
    setMaxZIndex(nextZ);

    const newWindow: WindowState = {
      id: newWindowId,
      title: customTitle || defaults.title,
      icon: customIcon || defaults.icon,
      appType,
      isMinimized: false,
      isMaximized: window.innerWidth < 640, // Auto maximize on very small screens
      position: { x, y },
      size: { width, height },
      zIndex: nextZ,
      customData,
    };

    setWindows(curr => [...curr, newWindow]);
    setActiveWindowId(newWindowId);
    return newWindowId;
  }, [windows, maxZIndex, closeAllFlyouts, bringToFront]);

  const closeWindow = useCallback((id: string) => {
    setWindows(curr => {
      const remaining = curr.filter(w => w.id !== id);
      if (activeWindowId === id) {
        const topWindow = remaining
          .filter(w => !w.isMinimized)
          .sort((a, b) => b.zIndex - a.zIndex)[0];
        setActiveWindowId(topWindow ? topWindow.id : null);
      }
      return remaining;
    });
  }, [activeWindowId]);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(curr => curr.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  }, [activeWindowId]);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(curr => curr.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized, isMinimized: false } : w));
    bringToFront(id);
  }, [bringToFront]);

  const updateWindowPosition = useCallback((id: string, position: { x: number; y: number }) => {
    setWindows(curr => curr.map(w => w.id === id ? { ...w, position, isMaximized: false } : w));
  }, []);

  const updateWindowSize = useCallback((id: string, size: { width: number; height: number }) => {
    setWindows(curr => curr.map(w => w.id === id ? { ...w, size, isMaximized: false } : w));
  }, []);

  const snapWindow = useCallback((id: string, direction: 'left' | 'right' | 'top' | 'restore') => {
    const taskbarHeight = 48;
    const screenW = window.innerWidth;
    const screenH = window.innerHeight - taskbarHeight;

    if (direction === 'top') {
      setWindows(curr => curr.map(w => w.id === id ? { ...w, isMaximized: true, isMinimized: false } : w));
    } else if (direction === 'left') {
      setWindows(curr => curr.map(w => w.id === id ? {
        ...w,
        isMaximized: false,
        isMinimized: false,
        position: { x: 0, y: 0 },
        size: { width: Math.floor(screenW / 2), height: screenH }
      } : w));
    } else if (direction === 'right') {
      setWindows(curr => curr.map(w => w.id === id ? {
        ...w,
        isMaximized: false,
        isMinimized: false,
        position: { x: Math.floor(screenW / 2), y: 0 },
        size: { width: Math.floor(screenW / 2), height: screenH }
      } : w));
    } else {
      setWindows(curr => curr.map(w => w.id === id ? { ...w, isMaximized: false } : w));
    }
    bringToFront(id);
  }, [bringToFront]);

  // Sticky notes operations
  const addStickyNote = useCallback((
    color: StickyNote['color'] = 'yellow', 
    title = 'Nuova Nota', 
    content = '', 
    isChecklist = false
  ) => {
    const newNote: StickyNote = {
      id: `sticky-${Date.now()}`,
      title,
      content,
      color,
      x: 60 + Math.random() * 100,
      y: 80 + Math.random() * 100,
      width: 260,
      height: 220,
      isPinnedToDesktop: true,
      isChecklist,
      checklistItems: isChecklist ? [{ id: 'chk-1', text: 'Nuova voce', done: false }] : [],
      updatedAt: new Date().toISOString()
    };
    setStickyNotes(curr => [newNote, ...curr]);
    return newNote;
  }, []);

  const updateStickyNote = useCallback((id: string, updates: Partial<StickyNote>) => {
    setStickyNotes(curr => curr.map(note => note.id === id ? { ...note, ...updates, updatedAt: new Date().toISOString() } : note));
  }, []);

  const deleteStickyNote = useCallback((id: string) => {
    setStickyNotes(curr => curr.filter(note => note.id !== id));
  }, []);

  // Virtual Files operations
  const addFile = useCallback((
    name: string,
    content: string,
    type: VirtualFile['type'],
    extension: string,
    language = 'text',
    folder: VirtualFile['folder'] = 'documents'
  ) => {
    const size = new Blob([content]).size;
    const newFile: VirtualFile = {
      id: `file-${Date.now()}`,
      name,
      content,
      type,
      extension,
      language,
      folder,
      size,
      updatedAt: new Date().toISOString()
    };
    setFiles(curr => [newFile, ...curr]);
    return newFile;
  }, []);

  const updateFile = useCallback((id: string, content: string, name?: string) => {
    const size = new Blob([content]).size;
    setFiles(curr => curr.map(f => f.id === id ? {
      ...f,
      content,
      name: name ?? f.name,
      size,
      updatedAt: new Date().toISOString()
    } : f));
  }, []);

  const moveFile = useCallback((id: string, targetFolder: string) => {
    setFiles(curr => curr.map(f => f.id === id ? {
      ...f,
      folder: targetFolder,
      updatedAt: new Date().toISOString()
    } : f));
  }, []);

  const deleteFile = useCallback((id: string) => {
    setFiles(curr => curr.filter(f => f.id !== id));
  }, []);

  const getFile = useCallback((id: string) => {
    return files.find(f => f.id === id);
  }, [files]);

  const exportAllBackup = useCallback(() => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings,
      webApps,
      stickyNotes,
      files
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `winlite_tablet_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [settings, webApps, stickyNotes, files]);

  const importBackup = useCallback((jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);
      if (data.settings) setSettings(data.settings);
      if (Array.isArray(data.webApps)) setWebApps(data.webApps);
      if (Array.isArray(data.stickyNotes)) setStickyNotes(data.stickyNotes);
      if (Array.isArray(data.files)) setFiles(data.files);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }, []);

  // Custom Web Apps operations
  const addWebApp = useCallback((app: Omit<CustomWebApp, 'id' | 'addedAt'>) => {
    const newApp: CustomWebApp = {
      ...app,
      id: `webapp-${Date.now()}`,
      addedAt: new Date().toISOString()
    };
    setWebApps(curr => [...curr, newApp]);
    return newApp;
  }, []);

  const updateWebApp = useCallback((id: string, updates: Partial<CustomWebApp>) => {
    setWebApps(curr => curr.map(app => app.id === id ? { ...app, ...updates } : app));
  }, []);

  const deleteWebApp = useCallback((id: string) => {
    setWebApps(curr => curr.filter(app => app.id !== id));
  }, []);

  // Settings
  const updateSettings = useCallback((updates: Partial<SystemSettings>) => {
    setSettings(curr => ({ ...curr, ...updates }));
  }, []);

  const updateDesktopIconPosition = useCallback((iconId: string, position: { x: number; y: number }) => {
    setSettings(curr => ({
      ...curr,
      desktopIconPositions: {
        ...(curr.desktopIconPositions || {}),
        [iconId]: position,
      }
    }));
  }, []);

  const resetDesktopIcons = useCallback(() => {
    setSettings(curr => ({
      ...curr,
      desktopIconPositions: {},
    }));
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn('Fullscreen error:', err);
    }
  }, []);

  return (
    <OSContext.Provider
      value={{
        windows,
        activeWindowId,
        openWindow,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        bringToFront,
        updateWindowPosition,
        updateWindowSize,
        snapWindow,
        isStartMenuOpen,
        setIsStartMenuOpen,
        isActionCenterOpen,
        setIsActionCenterOpen,
        isCalendarOpen,
        setIsCalendarOpen,
        closeAllFlyouts,
        stickyNotes,
        addStickyNote,
        updateStickyNote,
        deleteStickyNote,
        files,
        addFile,
        updateFile,
        moveFile,
        deleteFile,
        getFile,
        exportAllBackup,
        importBackup,
        webApps,
        addWebApp,
        updateWebApp,
        deleteWebApp,
        settings,
        updateSettings,
        updateDesktopIconPosition,
        resetDesktopIcons,
        isFullscreen,
        toggleFullscreen,
        storageUsedKB,
      }}
    >
      {children}
    </OSContext.Provider>
  );
};

export const useOS = () => {
  const context = useContext(OSContext);
  if (!context) {
    throw new Error('useOS must be used within an OSProvider');
  }
  return context;
};
