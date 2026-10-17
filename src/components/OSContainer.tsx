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

  return (
    <div
      onClick={closeAllFlyouts}
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

      {/* Windows Taskbar */}
      <Taskbar />
    </div>
  );
};
