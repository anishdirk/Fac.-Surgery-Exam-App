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
import { Modal } from './Modal';

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
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg" id="install-guide-modal">
      <div className="p-6 overflow-y-auto max-h-[85vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-outline-variant/30 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-shape-md bg-primary-container border border-outline-variant/30 text-on-primary-container flex items-center justify-center shadow-xs">
              <Smartphone className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-title-large font-black text-on-surface">Install Surgical PWA</h2>
                <span className="px-2 py-0.5 text-label-small font-extrabold bg-primary-container text-on-primary-container border border-outline-variant/30 rounded-shape-xs uppercase">PWA</span>
              </div>
              <p className="text-body-small text-on-surface-variant font-medium">Native Mobile Experience & 100% Offline</p>
            </div>
          </div>
          <button
            onClick={() => {
              SoundEffects.playClick();
              onClose();
            }}
            className="p-2 rounded-shape-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors"
            aria-label="Close guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-3 gap-2 mb-6 text-center">
          <div className="p-3 rounded-shape-md bg-surface-container border border-outline-variant/30 flex flex-col items-center">
            <WifiOff className="w-5 h-5 text-primary mb-1.5" />
            <span className="text-label-medium font-black text-on-surface">100% Offline</span>
            <span className="text-[10px] text-on-surface-variant">Zero data required</span>
          </div>
          <div className="p-3 rounded-shape-md bg-surface-container border border-outline-variant/30 flex flex-col items-center">
            <Zap className="w-5 h-5 text-tertiary mb-1.5" />
            <span className="text-label-medium font-black text-on-surface">Full Screen</span>
            <span className="text-[10px] text-on-surface-variant">No browser bars</span>
          </div>
          <div className="p-3 rounded-shape-md bg-surface-container border border-outline-variant/30 flex flex-col items-center">
            <ShieldCheck className="w-5 h-5 text-secondary mb-1.5" />
            <span className="text-label-medium font-black text-on-surface">Instant Launch</span>
            <span className="text-[10px] text-on-surface-variant">Home screen icon</span>
          </div>
        </div>

        {/* Quick Action Button if Direct Install available */}
        {canDirectInstall && !alreadyInstalled && (
          <div className="mb-6 p-4 rounded-shape-lg bg-primary-container text-on-primary-container border border-outline-variant/40">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="text-title-small font-extrabold text-on-primary-container">One-Click Install Ready</h4>
                <p className="text-body-small text-on-primary-container/80 mt-0.5">Click below to trigger the native installation prompt</p>
              </div>
              <button
                onClick={handleDirectInstall}
                disabled={installing}
                className="px-5 py-2.5 rounded-shape-full bg-primary hover:opacity-95 active:scale-95 text-on-primary font-black text-label-large shadow-xs transition-all flex items-center gap-1.5 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>{installing ? 'Opening...' : 'Install Now'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Platform Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-surface-container rounded-shape-full border border-outline-variant/40 mb-5 text-label-medium font-extrabold">
          <button
            onClick={() => {
              SoundEffects.playClick();
              setActiveTab('android');
            }}
            className={`flex-1 py-2 rounded-shape-full transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'android'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android</span>
          </button>

          <button
            onClick={() => {
              SoundEffects.playClick();
              setActiveTab('ios');
            }}
            className={`flex-1 py-2 rounded-shape-full transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'ios'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
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
            className={`flex-1 py-2 rounded-shape-full transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'desktop'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
        </div>

        {/* Step-by-Step Instructions */}
        {activeTab === 'android' && (
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-shape-md bg-surface-container border border-outline-variant/30">
              <span className="w-6 h-6 rounded-shape-full bg-primary-container text-on-primary-container font-black text-label-small flex items-center justify-center shrink-0 mt-0.5">1</span>
              <div>
                <p className="text-body-small font-bold text-on-surface">Open in Google Chrome or Samsung Internet</p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">Make sure you visit this URL directly on your Android browser.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-shape-md bg-surface-container border border-outline-variant/30">
              <span className="w-6 h-6 rounded-shape-full bg-primary-container text-on-primary-container font-black text-label-small flex items-center justify-center shrink-0 mt-0.5">2</span>
              <div>
                <p className="text-body-small font-bold text-on-surface flex items-center gap-1.5">
                  Tap the menu icon <MoreVertical className="w-3.5 h-3.5 text-on-surface-variant inline" /> (three dots)
                </p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">Located at the top right of Google Chrome or bottom right of Samsung Internet.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-shape-md bg-surface-container border border-outline-variant/30">
              <span className="w-6 h-6 rounded-shape-full bg-primary-container text-on-primary-container font-black text-label-small flex items-center justify-center shrink-0 mt-0.5">3</span>
              <div>
                <p className="text-body-small font-bold text-on-surface flex items-center gap-1.5">
                  Select <span className="text-primary font-black">"Install App"</span> or <span className="text-primary font-black">"Add to Home screen"</span>
                </p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">Android will configure the surgical web app package and place the app icon directly on your home screen and app drawer.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-shape-md bg-primary-container/40 border border-outline-variant/40">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-body-small font-bold text-on-surface">Ready for Offline Study</p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">Launch anytime from your home screen. You can practice all 620 surgical MCQs and clinical situational tasks even in Airplane Mode!</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ios' && (
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-shape-md bg-surface-container border border-outline-variant/30">
              <span className="w-6 h-6 rounded-shape-full bg-primary-container text-on-primary-container font-black text-label-small flex items-center justify-center shrink-0 mt-0.5">1</span>
              <div>
                <p className="text-body-small font-bold text-on-surface">Open in Apple Safari</p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">iOS requires using Safari to add web apps to the home screen.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-shape-md bg-surface-container border border-outline-variant/30">
              <span className="w-6 h-6 rounded-shape-full bg-primary-container text-on-primary-container font-black text-label-small flex items-center justify-center shrink-0 mt-0.5">2</span>
              <div>
                <p className="text-body-small font-bold text-on-surface flex items-center gap-1.5">
                  Tap the <Share className="w-3.5 h-3.5 text-primary inline" /> Share button
                </p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">Located at the bottom toolbar in Safari.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-shape-md bg-surface-container border border-outline-variant/30">
              <span className="w-6 h-6 rounded-shape-full bg-primary-container text-on-primary-container font-black text-label-small flex items-center justify-center shrink-0 mt-0.5">3</span>
              <div>
                <p className="text-body-small font-bold text-on-surface">
                  Scroll down and tap <span className="text-primary font-black">"Add to Home Screen"</span>
                </p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">Confirm by tapping <strong>Add</strong> in the top right.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'desktop' && (
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-shape-md bg-surface-container border border-outline-variant/30">
              <span className="w-6 h-6 rounded-shape-full bg-primary-container text-on-primary-container font-black text-label-small flex items-center justify-center shrink-0 mt-0.5">1</span>
              <div>
                <p className="text-body-small font-bold text-on-surface">Look for the Install icon in the URL bar</p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">In Google Chrome, Brave, or Microsoft Edge, an "Install" icon appears in the address bar.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-shape-md bg-surface-container border border-outline-variant/30">
              <span className="w-6 h-6 rounded-shape-full bg-primary-container text-on-primary-container font-black text-label-small flex items-center justify-center shrink-0 mt-0.5">2</span>
              <div>
                <p className="text-body-small font-bold text-on-surface">Click "Install App"</p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">The app will run in its own standalone desktop window with keyboard shortcuts.</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-outline-variant/30 flex items-center justify-between text-body-small text-on-surface-variant">
          <span className="text-label-medium">Version: <strong>1.0.0 (PWA Offline)</strong></span>
          <button
            onClick={() => {
              SoundEffects.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-shape-full bg-surface-container-highest text-on-surface hover:bg-surface-container-highest/80 font-bold text-label-large transition-colors shadow-xs"
          >
            Close
          </button>
        </div>

      </div>
    </Modal>
  );
};
