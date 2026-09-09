import React, { useState, useEffect } from 'react';
import { 
  X, 
  Award, 
  Download, 
  FileText, 
  CheckCircle2, 
  Calendar, 
  Flame, 
  Target, 
  Layers,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { UserProgress, CaseProgress, Question, Topic } from '../types';
import { SoundEffects } from '../utils/audio';
import { calculateCertificateData, generateCertificatePdf } from '../utils/pdfCertificate';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  caseProgress: CaseProgress;
  allQuestions: Question[];
  topics: Topic[];
}

const CANDIDATE_NAME_KEY = 'duomed_candidate_name';

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  progress,
  caseProgress,
  allQuestions,
  topics
}) => {
  const [candidateName, setCandidateName] = useState<string>(() => {
    return localStorage.getItem(CANDIDATE_NAME_KEY) || 'Dr. Medical Candidate';
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (candidateName.trim()) {
      localStorage.setItem(CANDIDATE_NAME_KEY, candidateName.trim());
    }
  }, [candidateName]);

  if (!isOpen) return null;

  const certData = calculateCertificateData(
    candidateName,
    progress,
    caseProgress,
    allQuestions,
    topics
  );

  const handleDownload = () => {
    setIsGenerating(true);
    SoundEffects.playClick();
    try {
      generateCertificatePdf(
        candidateName,
        progress,
        caseProgress,
        allQuestions,
        topics
      );
    } catch (err) {
      console.error('Failed to generate certificate PDF:', err);
    } finally {
      setTimeout(() => setIsGenerating(false), 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="certificate-modal-title"
        className="w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#161A23] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 id="certificate-modal-title" className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                  Export Board Certificate
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Official one-page surgical progress summary (PDF)
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                SoundEffects.playClick();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Candidate Name Input */}
          <div className="mt-5 p-4 rounded-2xl bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Candidate Name (appears on Certificate)
            </label>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="e.g. Dr. Alex Taylor, MD"
              maxLength={40}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161A23] text-slate-900 dark:text-white font-bold text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
              You can edit your name or title before downloading.
            </span>
          </div>

          {/* Certificate Live Preview Box */}
          <div className="mt-4 p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 text-white border-2 border-emerald-500/40 shadow-inner relative overflow-hidden">
            {/* Background seal decoration */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />

            <div className="text-center pb-3 border-b border-slate-800">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block mb-0.5">
                RUSSIAN MEDICAL LICENSING SYLLABUS
              </span>
              <h4 className="text-sm font-black text-white uppercase tracking-tight">
                Certificate of Surgical Mastery
              </h4>
              <p className="text-base font-extrabold text-emerald-300 mt-1.5">
                {certData.candidateName}
              </p>
            </div>

            {/* Key Metrics Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3 text-center">
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Coverage</span>
                <span className="text-sm font-black text-emerald-400">{certData.completionPercent}%</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Accuracy</span>
                <span className="text-sm font-black text-emerald-400">{certData.overallAccuracy}%</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Streak</span>
                <span className="text-sm font-black text-amber-400">{certData.streakDays}d</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Mastered</span>
                <span className="text-sm font-black text-indigo-400">{certData.topicsMasteredCount}/{certData.totalTopicsCount}</span>
              </div>
            </div>

            {/* Verdict Badge */}
            <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-center">
              <span className="text-[9px] font-bold text-emerald-300 uppercase tracking-wider block">
                Readiness Assessment
              </span>
              <span className="text-xs font-black text-emerald-200">
                {certData.examReadinessVerdict}
              </span>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-800/80">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-500" />
                {certData.dateStr}
              </span>
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <ShieldCheck className="w-3 h-3" />
                Client-Side Verified
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={() => {
              SoundEffects.playClick();
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition-colors"
          >
            Cancel
          </button>

          <button
            id="btn-download-pdf-certificate"
            onClick={handleDownload}
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wide shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4 fill-slate-950" />
            <span>{isGenerating ? 'Generating PDF...' : 'Download Certificate (PDF)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
