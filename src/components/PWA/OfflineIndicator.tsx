import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 rounded-xl bg-amber-600/95 border border-amber-500/80 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xl backdrop-blur-md animate-in slide-in-from-top-2">
      <WifiOff className="w-4 h-4 text-amber-200" />
      <span>Modalità Offline — I tuoi file e le app dell'OS funzionano regolarmente!</span>
    </div>
  );
};
