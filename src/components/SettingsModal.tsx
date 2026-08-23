import React from 'react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Heart, 
  Languages, 
  RotateCcw
} from 'lucide-react';
import { UserProgress } from '../types';
import { SoundEffects } from '../utils/audio';

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
  onResetProgress
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0C10]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#161A23] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-800 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <h2 className="text-lg font-black text-white">
            Study Preferences & Settings
          </h2>
          <button
            onClick={() => {
              SoundEffects.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-4">
          
          {/* Sound Effects */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0F1218] border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-sm font-extrabold text-white">Sound Effects</div>
                <div className="text-xs text-slate-400 font-medium">Chimes, buzzers, and victory fanfare</div>
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
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0F1218] border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                <Languages className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-white">English Assistance</div>
                <div className="text-xs text-slate-400 font-medium">Always show English translation under Russian text</div>
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
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0F1218] border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
                <Heart className="w-5 h-5 fill-rose-400" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-white">Infinite Hearts</div>
                <div className="text-xs text-slate-400 font-medium">Never get locked out when practicing</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={progress.infiniteHearts}
              onChange={onToggleInfiniteHearts}
              className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
            />
          </div>

        </div>

        {/* Danger Zone / Reset */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to reset all your XP, completed lessons, and study progress?")) {
                onResetProgress();
                onClose();
              }
            }}
            className="w-full py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Progress Data</span>
          </button>
        </div>

      </div>
    </div>
  );
};
