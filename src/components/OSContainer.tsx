import React, { useEffect } from 'react';
import { useOS } from '../context/OSContext';
import { Desktop } from './Desktop/Desktop';
import { Taskbar } from './Taskbar/Taskbar';
import { StartMenu } from './StartMenu/StartMenu';
import { ActionCenter } from './ActionCenter/ActionCenter';
import { CalendarFlyout } from './CalendarFlyout/CalendarFlyout';
import { WindowFrame } from './Window/WindowFrame';
import { TextEditorApp } from './Apps/TextEditor/TextEditorApp';
import { CodeEditorApp } from './Apps/CodeEditor/CodeEditorApp';
import { StickyNotesApp } from './Apps/StickyNotes/StickyNotesApp';
import { WebAppManager } from './Apps/WebApps/WebAppManager';
import { WebViewerWindow } from './Apps/WebApps/WebViewerWindow';
import { FileExplorerApp } from './Apps/FileExplorer/FileExplorerApp';
import { CalculatorApp } from './Apps/Calculator/CalculatorApp';
import { SettingsApp } from './Apps/Settings/SettingsApp';
import { OfflineIndicator } from './PWA/OfflineIndicator';
import { WindowState } from '../types/os';

export const OSContainer: React.FC = () => {
  const {
    windows,
    isStartMenuOpen,
    isActionCenterOpen,
    isCalendarOpen,
    closeAllFlyouts,
    settings,
  } = useOS();

  // Close flyouts on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAllFlyouts();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeAllFlyouts]);

  // Dynamically apply accent color to CSS variables across the app
  useEffect(() => {
    const color = settings.accentColor || '#0078d4';
    const root = document.documentElement;

    // Convert hex to rgb
    let r = 0, g = 120, b = 212;
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      if (hex.length === 6) {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
      } else if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
      }
    }

    root.style.setProperty('--accent-color', color);
    root.style.setProperty('--accent-color-rgb', `${r}, ${g}, ${b}`);
    root.style.setProperty('--accent-color-10', `rgba(${r}, ${g}, ${b}, 0.12)`);
    root.style.setProperty('--accent-color-20', `rgba(${r}, ${g}, ${b}, 0.22)`);
    root.style.setProperty('--accent-color-30', `rgba(${r}, ${g}, ${b}, 0.35)`);
    root.style.setProperty('--accent-color-50', `rgba(${r}, ${g}, ${b}, 0.55)`);
    root.style.setProperty('--accent-color-80', `rgba(${r}, ${g}, ${b}, 0.85)`);
  }, [settings.accentColor]);

  const renderWindowContent = (win: WindowState) => {
    switch (win.appType) {
      case 'text-editor':
        return <TextEditorApp customData={win.customData} />;
      case 'code-editor':
        return <CodeEditorApp customData={win.customData} />;
      case 'sticky-notes':
        return <StickyNotesApp />;
      case 'web-manager':
        return <WebAppManager />;
      case 'web-viewer':
        return <WebViewerWindow customData={win.customData} />;
      case 'file-explorer':
        return <FileExplorerApp />;
      case 'calculator':
        return <CalculatorApp />;
      case 'settings':
        return <SettingsApp />;
      default:
        return (
          <div className="p-6 text-center text-slate-400">
            Applicazione non trovata.
          </div>
        );
    }
  };

  // Apply font size scale to root
  useEffect(() => {
    const scale = settings.fontSizeScale || 'large';
    document.documentElement.setAttribute('data-font-size', scale);
  }, [settings.fontSizeScale]);

  return (
    <div
      onClick={closeAllFlyouts}
      data-font-size={settings.fontSizeScale || 'large'}
      className={`relative w-screen h-screen overflow-hidden select-none font-sans ${
        settings.theme === 'dark' ? 'dark' : ''
      }`}
    >
      {/* Desktop Background & Icons */}
      <Desktop />

      {/* Windows Stack */}
      {windows.map(win => (
        <WindowFrame key={win.id} window={win}>
          {renderWindowContent(win)}
        </WindowFrame>
      ))}

      {/* Start Menu */}
      {isStartMenuOpen && <StartMenu />}

      {/* Action Center / Quick Settings */}
      {isActionCenterOpen && <ActionCenter />}

      {/* Calendar Flyout */}
      {isCalendarOpen && <CalendarFlyout />}

      {/* Offline Mode Banner */}
      <OfflineIndicator />

      {/* Windows Taskbar */}
      <Taskbar />
    </div>
  );
};
