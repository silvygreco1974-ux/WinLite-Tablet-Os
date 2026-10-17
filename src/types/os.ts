export type AppType = 
  | 'text-editor'
  | 'code-editor'
  | 'sticky-notes'
  | 'web-manager'
  | 'web-viewer'
  | 'file-explorer'
  | 'calculator'
  | 'settings';

export interface WindowState {
  id: string;
  title: string;
  icon: string;
  appType: AppType;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  customData?: Record<string, any>;
}

export interface StickyItem {
  id: string;
  text: string;
  done: boolean;
}

export interface StickyNote {
  id: string;
  title: string;
  content: string;
  color: 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'dark';
  x: number;
  y: number;
  width: number;
  height: number;
  isPinnedToDesktop: boolean;
  isChecklist: boolean;
  checklistItems: StickyItem[];
  updatedAt: string;
}

export interface VirtualFile {
  id: string;
  name: string;
  type: 'document' | 'code' | 'note' | 'web-link';
  extension: string;
  content: string;
  language?: string;
  folder: 'documents' | 'code' | 'notes' | 'downloads' | string;
  size: number;
  updatedAt: string;
}

export interface CustomWebApp {
  id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
  category: 'Lavoro' | 'Studio' | 'Svago' | 'Utilità' | 'Social';
  openMode: 'window' | 'tab';
  isPinnedDesktop: boolean;
  isPinnedTaskbar: boolean;
  addedAt: string;
}

export interface WallpaperOption {
  id: string;
  name: string;
  url: string;
  previewUrl: string;
  type: 'dark' | 'light' | 'abstract';
}

export interface SystemSettings {
  wallpaper: string;
  theme: 'dark' | 'light';
  accentColor: string;
  tabletMode: boolean;
  singleTapOpen: boolean;
  soundEnabled: boolean;
  desktopIconPositions: Record<string, { x: number; y: number }>;
}
