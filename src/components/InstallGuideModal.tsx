import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Download, 
  CheckCircle2, 
  Share, 
  MoreVertical, 
  WifiOff, 
  Zap, 
  ShieldCheck,
  Globe
} from 'lucide-react';
import { isAndroid, isIOS, promptPWAInstall, isStandalone } from '../utils/pwa';
import { SoundEffects } from '../utils/audio';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  canDirectInstall?: boolean;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({
  isOpen,
  onClose,
  canDirectInstall = false
}) => {
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'desktop'>(() => {
    if (isIOS()) return 'ios';
    if (isAndroid()) return 'android';
    return 'android';
  });

  const [installing, setInstalling] = useState(false);
  const alreadyInstalled = isStandalone();

  if (!isOpen) return null;

  const handleDirectInstall = async () => {
    SoundEffects.playClick();
    setInstalling(true);
    const res = await promptPWAInstall();
    setInstalling(false);
    if (res === 'accepted') {
      SoundEffects.playVictory();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-[#0A0C10]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#161A23] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto transition-colors">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.25)]">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Install Surgical PWA</h2>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 rounded-md uppercase">PWA</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Native Mobile Experience & 100% Offline</p>
            </div>
          </div>
          <button
            onClick={() => {
              SoundEffects.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-3 gap-2 mb-6 text-center">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800/80 flex flex-col items-center">
            <WifiOff className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-1.5" />
            <span className="text-xs font-black text-slate-800 dark:text-slate-200">100% Offline</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Zero data required</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800/80 flex flex-col items-center">
            <Zap className="w-5 h-5 text-amber-500 mb-1.5" />
            <span className="text-xs font-black text-slate-800 dark:text-slate-200">Full Screen</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">No browser bars</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800/80 flex flex-col items-center">
            <ShieldCheck className="w-5 h-5 text-sky-500 mb-1.5" />
            <span className="text-xs font-black text-slate-800 dark:text-slate-200">Instant Launch</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Home screen icon</span>
          </div>
        </div>

        {/* Quick Action Button if Direct Install available */}
        {canDirectInstall && !alreadyInstalled && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-gradient-to-br dark:from-emerald-950/50 dark:to-teal-950/30 border border-emerald-500/40">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">One-Click Install Ready</h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300/80 mt-0.5">Click below to trigger the native installation prompt</p>
              </div>
              <button
                onClick={handleDirectInstall}
                disabled={installing}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all flex items-center gap-1.5 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>{installing ? 'Opening...' : 'Install Now'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Platform Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#0F1218] rounded-xl border border-slate-200 dark:border-slate-800 mb-5 text-xs font-extrabold">
          <button
            onClick={() => {
              SoundEffects.playClick();
              setActiveTab('android');
            }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'android'
                ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/40 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android (Chrome)</span>
          </button>

          <button
            onClick={() => {
              SoundEffects.playClick();
              setActiveTab('ios');
            }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'ios'
                ? 'bg-sky-500/20 text-sky-700 dark:text-sky-400 border border-sky-500/40 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Share className="w-3.5 h-3.5" />
            <span>iOS (Safari)</span>
          </button>

          <button
            onClick={() => {
              SoundEffects.playClick();
              setActiveTab('desktop');
            }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'desktop'
                ? 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border border-indigo-500/40 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
        </div>

        {/* Step-by-Step Instructions */}
        {activeTab === 'android' && (
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Open in Google Chrome or Samsung Internet</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Make sure you visit this URL directly on your Android browser.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  Tap the menu icon <MoreVertical className="w-3.5 h-3.5 text-slate-400 inline" /> (three dots)
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Located at the top right of Google Chrome or bottom right of Samsung Internet.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  Select <span className="text-emerald-600 dark:text-emerald-400 font-black">"Install App"</span> or <span className="text-emerald-600 dark:text-emerald-400 font-black">"Add to Home screen"</span>
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Android will configure the surgical web app package and place the app icon directly on your home screen and app drawer.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Ready for Offline Study</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Launch anytime from your home screen. You can practice all 620 surgical MCQs and clinical situational tasks even in Airplane Mode!</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ios' && (
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800">
              <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-700 dark:text-sky-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Open in Apple Safari</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">iOS requires using Safari to add web apps to the home screen.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800">
              <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-700 dark:text-sky-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  Tap the <Share className="w-3.5 h-3.5 text-sky-500 inline" /> Share button
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Located at the bottom toolbar in Safari.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800">
              <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-700 dark:text-sky-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Scroll down and tap <span className="text-sky-600 dark:text-sky-400 font-black">"Add to Home Screen"</span>
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Confirm by tapping <strong>Add</strong> in the top right.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'desktop' && (
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Look for the Install icon in the URL bar</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">In Google Chrome, Brave, or Microsoft Edge, an "Install" icon appears in the address bar.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Click "Install App"</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">The app will run in its own standalone desktop window with keyboard shortcuts.</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Version: <strong>1.0.0 (PWA Offline)</strong></span>
          <button
            onClick={() => {
              SoundEffects.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
