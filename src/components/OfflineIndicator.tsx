import { useState, useEffect, useCallback } from 'react';
import { WifiOff, MapPin, AlertTriangle, X } from 'lucide-react';

interface OfflineIndicatorProps {
  children: React.ReactNode;
}

export default function OfflineIndicator({ children }: OfflineIndicatorProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineToast, setShowOfflineToast] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check initial state
    const initialOnline = navigator.onLine;
    setIsOnline(initialOnline);
    if (!initialOnline) {
      setShowOfflineToast(true);
    }

    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineToast(false);
      setDismissed(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      // Only show toast if not previously dismissed
      if (!dismissed) {
        setShowOfflineToast(true);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dismissed]);

  // Auto-hide online status after 3 seconds
  useEffect(() => {
    if (isOnline && showOfflineToast) {
      const timer = setTimeout(() => setShowOfflineToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, showOfflineToast]);

  const handleDismiss = useCallback(() => {
    setShowOfflineToast(false);
    setDismissed(true);
  }, []);

  // Reset dismissed state when coming back online
  useEffect(() => {
    if (isOnline) {
      setDismissed(false);
    }
  }, [isOnline]);

  return (
    <>
      {children}
      
      {/* Offline Toast Notification */}
      {showOfflineToast && !isOnline && (
        <div 
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up"
          style={{ pointerEvents: 'auto' }}
        >
          <div className="bg-slate-900/95 backdrop-blur-sm text-white px-4 py-3 rounded-lg shadow-2xl border border-amber-500/30 max-w-md">
            <div className="flex items-center gap-3">
              <div className="bg-amber-500/20 p-2 rounded-full flex-shrink-0">
                <WifiOff className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">🌲 You are now offline</p>
                <p className="text-xs text-slate-300 mt-0.5 truncate">
                  Navigation and Emergency Kit remain active
                </p>
              </div>
              <button 
                type="button"
                onClick={handleDismiss}
                className="text-slate-400 hover:text-white hover:bg-slate-700 transition-all p-1.5 rounded-md flex-shrink-0"
                aria-label="Close notification"
                style={{ pointerEvents: 'auto', cursor: 'pointer' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Offline Features Indicator */}
            <div className="mt-2 pt-2 border-t border-slate-700 flex gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-red-400" />
                <span>Emergency Phrases</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Online Status Pill (subtle) */}
      {isOnline && showOfflineToast && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-green-600/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full shadow-lg text-sm flex items-center gap-2">
            <WifiOff className="w-4 h-4" />
            <span>Back online</span>
          </div>
        </div>
      )}

      {/* Connection Status Badge in corner */}
      <div className="fixed top-4 right-4 z-40">
        {!isOnline && (
          <div className="bg-slate-900/80 backdrop-blur-sm text-amber-400 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 border border-amber-500/30">
            <WifiOff className="w-3 h-3" />
            <span>OFFLINE</span>
          </div>
        )}
      </div>
    </>
  );
}
