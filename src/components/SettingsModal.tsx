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
import { Modal } from './Modal';

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
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md" id="settings-modal">
      <div className="p-6 flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30 mb-5 shrink-0">
          <h2 className="text-title-large font-black text-on-surface">
            Study Preferences & Settings
          </h2>
          <button
            onClick={() => {
              SoundEffects.playClick();
              onClose();
            }}
            className="p-2 rounded-shape-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Banner */}
        {statusMessage && (
          <div className={`mb-4 p-3.5 rounded-shape-md flex items-start gap-2.5 text-body-small font-semibold shrink-0 ${
            statusMessage.type === 'success'
              ? 'bg-primary-container text-on-primary-container border border-outline-variant/30'
              : 'bg-error-container text-on-error-container border border-outline-variant/30'
          }`}>
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
            )}
            <div className="flex-1 leading-relaxed">{statusMessage.text}</div>
          </div>
        )}

        {/* Options */}
        <div className="space-y-3.5">
          {/* Visual Theme Selector (Surgical Theater vs Clinical Ward) */}
          <div className="p-3.5 rounded-shape-md bg-surface-container border border-outline-variant/30">
            <div className="text-label-small font-black uppercase tracking-wider text-on-surface-variant mb-2.5">
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
                className={`p-2.5 rounded-shape-md border flex items-center gap-2.5 transition-all text-left ${
                  isDark
                    ? 'bg-primary-container border-outline-variant/40 text-on-primary-container font-black shadow-xs'
                    : 'bg-surface-container-high border-outline-variant/30 text-on-surface-variant font-bold hover:border-outline-variant'
                }`}
              >
                <div className="w-7 h-7 rounded-shape-xs bg-surface-container-lowest border border-outline-variant/40 flex items-center justify-center text-tertiary shrink-0">
                  <Moon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-body-small font-bold leading-tight text-on-surface">Dark Theater</div>
                  <div className="text-[10px] text-on-surface-variant">Night / OR Mode</div>
                </div>
                {isDark && <Check className="w-4 h-4 text-primary shrink-0" />}
              </button>

              <button
                type="button"
                id="btn-theme-light-ward"
                onClick={() => {
                  SoundEffects.playClick();
                  setTheme('light');
                }}
                className={`p-2.5 rounded-shape-md border flex items-center gap-2.5 transition-all text-left ${
                  !isDark
                    ? 'bg-primary-container border-outline-variant/40 text-on-primary-container font-black shadow-xs'
                    : 'bg-surface-container-high border-outline-variant/30 text-on-surface-variant font-bold hover:border-outline-variant'
                }`}
              >
                <div className="w-7 h-7 rounded-shape-xs bg-surface-container-lowest border border-outline-variant/40 flex items-center justify-center text-tertiary shrink-0">
                  <Sun className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-body-small font-bold leading-tight text-on-surface">Clinical Light</div>
                  <div className="text-[10px] text-on-surface-variant">Day / Ward Mode</div>
                </div>
                {!isDark && <Check className="w-4 h-4 text-primary shrink-0" />}
              </button>
            </div>
          </div>

          {/* Sound Effects */}
          <div className="flex items-center justify-between p-3.5 rounded-shape-md bg-surface-container border border-outline-variant/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-shape-md bg-primary-container border border-outline-variant/30 text-primary flex items-center justify-center shrink-0">
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-title-small font-extrabold text-on-surface">Sound Effects</div>
                <div className="text-body-small text-on-surface-variant font-medium">Chimes, buzzers, and victory fanfare</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="w-5 h-5 accent-primary rounded cursor-pointer"
            />
          </div>

          {/* Auto Show Translations */}
          <div className="flex items-center justify-between p-3.5 rounded-shape-md bg-surface-container border border-outline-variant/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-shape-md bg-secondary-container border border-outline-variant/30 text-secondary flex items-center justify-center shrink-0">
                <Languages className="w-5 h-5" />
              </div>
              <div>
                <div className="text-title-small font-extrabold text-on-surface">English Assistance</div>
                <div className="text-body-small text-on-surface-variant font-medium">Always show English translation under Russian text</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={showTranslationByDefault}
              onChange={(e) => setShowTranslationByDefault(e.target.checked)}
              className="w-5 h-5 accent-primary rounded cursor-pointer"
            />
          </div>

          {/* Infinite Hearts Mode */}
          <div className="flex items-center justify-between p-3.5 rounded-shape-md bg-surface-container border border-outline-variant/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-shape-md bg-error-container border border-outline-variant/30 text-error flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="text-title-small font-extrabold text-on-surface">Infinite Hearts</div>
                <div className="text-body-small text-on-surface-variant font-medium">Never get locked out when practicing</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={progress.infiniteHearts}
              onChange={onToggleInfiniteHearts}
              className="w-5 h-5 accent-primary rounded cursor-pointer"
            />
          </div>

          {/* Install Android / PWA App */}
          <div 
            onClick={() => {
              SoundEffects.playClick();
              onClose();
              onOpenInstallGuide();
            }}
            className="flex items-center justify-between p-3.5 rounded-shape-md bg-surface-container border border-outline-variant/30 hover:border-primary/40 hover:bg-surface-container-high cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-shape-md bg-primary-container border border-outline-variant/30 text-primary flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="text-title-small font-extrabold text-on-surface flex items-center gap-1.5">
                  <span>Install Android App</span>
                  <span className="px-1.5 py-0.2 bg-primary-container text-on-primary-container border border-outline-variant/30 text-[10px] font-black rounded-shape-xs uppercase">PWA</span>
                </div>
                <div className="text-body-small text-on-surface-variant font-medium">100% offline study on phone or tablet</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
          </div>

          {/* Certificate of Progress (PDF) */}
          <div className="p-3.5 rounded-shape-md bg-surface-container border border-outline-variant/30">
            <div className="flex items-center justify-between mb-2">
              <div className="text-label-small font-black uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-primary" />
                <span>Board Progress Certificate</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-shape-xs bg-primary-container text-on-primary-container border border-outline-variant/30">
                PDF
              </span>
            </div>
            <p className="text-body-small text-on-surface-variant font-medium mb-3 leading-relaxed">
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
              className="w-full py-2.5 px-4 rounded-shape-full bg-primary hover:opacity-95 text-on-primary font-black text-label-large uppercase tracking-wide flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <Download className="w-4 h-4 fill-current" />
              <span>Generate Certificate (PDF)</span>
            </button>
          </div>

          {/* Backup & Transfer Progress */}
          <div className="p-3.5 rounded-shape-md bg-surface-container border border-outline-variant/30">
            <div className="flex items-center justify-between mb-2">
              <div className="text-label-small font-black uppercase tracking-wider text-on-surface-variant">
                Data Backup & Transfer
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-shape-xs bg-surface-container-highest text-on-surface-variant">
                JSON v1
              </span>
            </div>
            <p className="text-body-small text-on-surface-variant font-medium mb-3 leading-relaxed">
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
                className="py-2.5 px-3 rounded-shape-full bg-secondary-container hover:opacity-90 border border-outline-variant/30 text-on-secondary-container font-bold text-label-large flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Export Progress</span>
              </button>

              <button
                type="button"
                id="btn-import-progress"
                onClick={handleTriggerImport}
                className="py-2.5 px-3 rounded-shape-full bg-surface-container-highest hover:bg-surface-container-highest/80 border border-outline-variant/30 text-on-surface font-bold text-label-large flex items-center justify-center gap-1.5 transition-colors shadow-xs"
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
        <div className="mt-6 pt-5 border-t border-outline-variant/30 shrink-0">
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to reset all your XP, completed lessons, and study progress?")) {
                onResetProgress();
                onClose();
              }
            }}
            className="w-full py-2.5 rounded-shape-full text-error hover:bg-error-container/40 font-bold text-label-large transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Progress Data</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

