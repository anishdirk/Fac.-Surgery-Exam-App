import React, { useState } from 'react';
import { WifiOff, ChevronDown, ChevronUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [isExpanded, setIsExpanded] = useState(false);

  // If online, don't render the offline banner
  if (isOnline) {
    return null;
  }

  return (
    <aside
      id="pwa-offline-indicator"
      aria-label="Offline Mode Status"
      className="fixed bottom-16 sm:bottom-4 left-3 right-3 sm:left-auto sm:right-4 z-40 max-w-sm sm:max-w-md animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <div className="bg-amber-50 dark:bg-[#1A160F] border border-amber-300 dark:border-amber-800/80 rounded-2xl shadow-xl p-3 text-amber-950 dark:text-amber-200 backdrop-blur-md transition-all">
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <div className="flex items-center gap-1.5 font-bold text-xs">
              <WifiOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Offline Mode Active</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-amber-100 flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-amber-100/80 dark:bg-amber-900/40 transition-colors"
          >
            <span>{isExpanded ? 'Hide info' : 'Details'}</span>
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        <p className="mt-1.5 text-xs text-amber-900/90 dark:text-amber-300/90 leading-relaxed">
          Full offline study enabled. You can practice all 620 surgical MCQs and 78 clinical cases without internet.
        </p>

        {isExpanded && (
          <div className="mt-2.5 pt-2 border-t border-amber-200/80 dark:border-amber-800/60 space-y-1.5 text-[11px] leading-normal animate-in fade-in duration-150">
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Precached & Ready:</strong> All 16 surgical topics, exam simulator, and case questions remain 100% accessible.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span><strong>AI Case Comparison:</strong> The Gemini diagnostic comparison requires an internet connection to grade freeform answers. You can still reveal model answers and self-grade.</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
