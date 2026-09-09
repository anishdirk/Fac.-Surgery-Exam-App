import React, { useRef, useState } from 'react';
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
  Check,
  Download,
  Upload,
  AlertCircle,
  CheckCircle2,
  Award
} from 'lucide-react';
import { UserProgress, CaseProgress } from '../types';
import { SoundEffects } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';
import { 
  ExportedProgressData, 
  parseAndValidateImportData 
} from '../utils/progressExportImport';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  caseProgress: CaseProgress;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  showTranslationByDefault: boolean;
  setShowTranslationByDefault: (val: boolean) => void;
  onToggleInfiniteHearts: () => void;
  onResetProgress: () => void;
  onOpenInstallGuide: () => void;
  onOpenCertificate: () => void;
  onExportProgress: () => void;
  onImportProgress: (data: ExportedProgressData) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  progress,
  caseProgress,
  soundEnabled,
  setSoundEnabled,
  showTranslationByDefault,
  setShowTranslationByDefault,
  onToggleInfiniteHearts,
  onResetProgress,
  onOpenInstallGuide,
  onOpenCertificate,
  onExportProgress,
  onImportProgress
}) => {
  const { theme, setTheme, isDark } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleTriggerImport = () => {
    setStatusMessage(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const rawContent = event.target?.result;
        if (typeof rawContent !== 'string') {
          setStatusMessage({ type: 'error', text: 'Failed to read the selected backup file.' });
          return;
        }

        const validation = parseAndValidateImportData(rawContent);
        if (validation.success === false) {
          setStatusMessage({ type: 'error', text: validation.error });
          return;
        }

        const imported = validation.data;
        const exportDate = new Date(imported.exportedAt).toLocaleDateString();
        const xp = imported.progress.totalXp ?? imported.progress.xp ?? 0;
        const streak = imported.progress.streakDays ?? imported.progress.streak ?? 1;

        const confirmMsg = `Restore study backup from ${exportDate}?\n` +
          `• Total XP: ${xp}\n` +
          `• Streak: ${streak} days\n` +
          `• Reviewed Cases: ${imported.caseProgress.reviewedCaseIds?.length || 0}\n\n` +
          `Warning: This will overwrite your current progress on this device.`;

        if (window.confirm(confirmMsg)) {
          onImportProgress(imported);
          setStatusMessage({ type: 'success', text: 'Study progress successfully restored!' });
        }
      } catch (err: any) {
        setStatusMessage({ type: 'error', text: err?.message || 'Failed to process the backup file.' });
      } finally {
        // Reset file input so re-selecting the same file fires onChange again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };

    reader.onerror = () => {
      setStatusMessage({ type: 'error', text: 'Error reading file from disk.' });
    };

    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-[#0A0C10]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#161A23] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150 transition-colors max-h-[90vh] overflow-y-auto">
        
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

        {/* Feedback Banner */}
        {statusMessage && (
          <div className={`mb-4 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs font-semibold animate-in fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60'
              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800/60'
          }`}>
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 leading-relaxed">{statusMessage.text}</div>
          </div>
        )}

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

          {/* Certificate of Progress (PDF) */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-[#0F1218] border border-emerald-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>Board Progress Certificate</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                PDF
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-3 leading-relaxed">
              Generate an official, printable 1-page summary with your candidate name, overall accuracy, topics mastered, and exam readiness verdict.
            </p>
            <button
              type="button"
              id="btn-open-certificate"
              onClick={() => {
                SoundEffects.playClick();
                onClose();
                onOpenCertificate();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wide flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <Download className="w-4 h-4 fill-slate-950" />
              <span>Generate Certificate (PDF)</span>
            </button>
          </div>

          {/* Backup & Transfer Progress */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Data Backup & Transfer
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                JSON v1
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-3 leading-relaxed">
              Save your streaks, clinical cases, and XP to a JSON file, or restore progress to a new browser or device.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="btn-export-progress"
                onClick={() => {
                  SoundEffects.playClick();
                  onExportProgress();
                  setStatusMessage({ type: 'success', text: 'Backup downloaded to your device!' });
                }}
                className="py-2.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Progress</span>
              </button>

              <button
                type="button"
                id="btn-import-progress"
                onClick={handleTriggerImport}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Import Progress</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
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

