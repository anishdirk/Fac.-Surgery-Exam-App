import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, HelpCircle, WifiOff } from 'lucide-react';
import { isStandalone, onInstallAvailabilityChange, promptPWAInstall } from '../utils/pwa';
import { SoundEffects } from '../utils/audio';

interface InstallAppBannerProps {
  onOpenGuide: () => void;
}

export const InstallAppBanner: React.FC<InstallAppBannerProps> = ({ onOpenGuide }) => {
  const [canInstall, setCanInstall] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [standalone, setStandalone] = useState(true);

  useEffect(() => {
    setStandalone(isStandalone());
    
    // Check if dismissed previously in session
    const dismissed = sessionStorage.getItem('duomed_pwa_banner_dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }

    const unsubscribe = onInstallAvailabilityChange((available) => {
      setCanInstall(available);
    });

    return () => unsubscribe();
  }, []);

  // If already installed standalone or user dismissed, don't show the banner
  if (standalone || isDismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    SoundEffects.playClick();
    if (canInstall) {
      const outcome = await promptPWAInstall();
      if (outcome === 'accepted') {
        SoundEffects.playVictory();
        setIsDismissed(true);
      } else if (outcome === 'manual') {
        onOpenGuide();
      }
    } else {
      onOpenGuide();
    }
  };

  const handleDismiss = () => {
    SoundEffects.playClick();
    setIsDismissed(true);
    sessionStorage.setItem('duomed_pwa_banner_dismissed', 'true');
  };

  return (
    <div 
      id="pwa-install-banner"
      className="bg-emerald-50 dark:bg-gradient-to-r dark:from-[#0F172A] dark:via-[#111C2D] dark:to-[#0D1F2D] border-b border-emerald-200 dark:border-emerald-500/30 px-3 sm:px-4 py-2.5 shadow-sm dark:shadow-lg transition-colors"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4">
        
        {/* Left info */}
        <div className="flex items-center gap-2.5 text-left w-full sm:w-auto">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black text-slate-900 dark:text-white tracking-wide">
                Install Surgical App for Mobile
              </span>
              <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 rounded text-[9px] font-bold flex items-center gap-0.5">
                <WifiOff className="w-2.5 h-2.5" /> 100% Offline
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate">
              Add to Home screen for full-screen mode & instant access to all 620 surgical MCQs & 78 cases
            </p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
          <button
            id="btn-banner-guide"
            onClick={() => {
              SoundEffects.playClick();
              onOpenGuide();
            }}
            className="px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-bold transition-colors flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Instructions</span>
          </button>

          <button
            id="btn-banner-install"
            onClick={handleInstallClick}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs shadow-[0_0_12px_rgba(16,185,129,0.35)] transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install App</span>
          </button>

          <button
            id="btn-banner-dismiss"
            onClick={handleDismiss}
            title="Dismiss banner"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
