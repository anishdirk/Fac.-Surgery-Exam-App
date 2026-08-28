import React from 'react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Heart, 
  Languages, 
  RotateCcw,
  Smartphone,
  ChevronRight,
  Sun,
  Moon,
  Check
} from 'lucide-react';
import { UserProgress } from '../types';
import { SoundEffects } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  showTranslationByDefault: boolean;
  setShowTranslationByDefault: (val: boolean) => void;
  onToggleInfiniteHearts: () => void;
  onResetProgress: () => void;
  onOpenInstallGuide: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  progress,
  soundEnabled,
  setSoundEnabled,
  showTranslationByDefault,
  setShowTranslationByDefault,
  onToggleInfiniteHearts,
  onResetProgress,
  onOpenInstallGuide
}) => {
  const { theme, setTheme, isDark } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-[#0A0C10]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#161A23] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150 transition-colors">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-5">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            Study Preferences & Settings
          </h2>
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

        {/* Options */}
        <div className="space-y-3.5">
          
          {/* Visual Theme Selector (Surgical Theater vs Clinical Ward) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800">
            <div className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
              Surgical Visual Theme
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="btn-theme-dark-theater"
                onClick={() => {
                  SoundEffects.playClick();
                  setTheme('dark');
                }}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all text-left ${
                  isDark
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400 font-black shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-900/60 border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold hover:border-slate-400'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-[#0A0E17] border border-slate-700 flex items-center justify-center text-amber-400 shrink-0">
                  <Moon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs leading-tight text-slate-900 dark:text-white">Dark Theater</div>
                  <div className="text-[10px] text-slate-500">Night / OR Mode</div>
                </div>
                {isDark && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
              </button>

              <button
                type="button"
                id="btn-theme-light-ward"
                onClick={() => {
                  SoundEffects.playClick();
                  setTheme('light');
                }}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all text-left ${
                  !isDark
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 font-black shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-900/60 border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold hover:border-slate-400'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-amber-500 shrink-0">
                  <Sun className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs leading-tight text-slate-900 dark:text-white">Clinical Light</div>
                  <div className="text-[10px] text-slate-500">Day / Ward Mode</div>
                </div>
                {!isDark && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
              </button>
            </div>
          </div>

          {/* Sound Effects */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-sm font-extrabold text-slate-900 dark:text-white">Sound Effects</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Chimes, buzzers, and victory fanfare</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
            />
          </div>

          {/* Auto Show Translations */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Languages className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-slate-900 dark:text-white">English Assistance</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Always show English translation under Russian text</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={showTranslationByDefault}
              onChange={(e) => setShowTranslationByDefault(e.target.checked)}
              className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
            />
          </div>

          {/* Infinite Hearts Mode */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Heart className="w-5 h-5 fill-rose-400" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-slate-900 dark:text-white">Infinite Hearts</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Never get locked out when practicing</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={progress.infiniteHearts}
              onChange={onToggleInfiniteHearts}
              className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
            />
          </div>

          {/* Install Android / PWA App */}
          <div 
            onClick={() => {
              SoundEffects.playClick();
              onClose();
              onOpenInstallGuide();
            }}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-gradient-to-r dark:from-emerald-950/30 dark:to-[#0F1218] border border-emerald-500/30 hover:border-emerald-500/60 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Install Android App</span>
                  <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-black rounded">PWA</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">100% offline study on phone or tablet</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
          </div>

        </div>

        {/* Danger Zone / Reset */}
        <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to reset all your XP, completed lessons, and study progress?")) {
                onResetProgress();
                onClose();
              }
            }}
            className="w-full py-2.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Progress Data</span>
          </button>
        </div>

      </div>
    </div>
  );
};

