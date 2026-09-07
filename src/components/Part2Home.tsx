import React from 'react';
import { 
  Stethoscope, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  Lock,
  Layers,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { CaseProgress } from '../types';
import { allCases } from '../data/cases';
import { SoundEffects } from '../utils/audio';
import { PART_2_LABEL } from '../constants/navigation';

export interface Part2Format {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  count: number;
  countLabel: string;
  targetTab: 'cases';
  badgeText?: string;
  isAvailable: boolean;
  comingSoonText?: string;
}

interface Part2HomeProps {
  caseProgress: CaseProgress;
  onSelectFormat: (tab: 'cases') => void;
}

export const Part2Home: React.FC<Part2HomeProps> = ({
  caseProgress,
  onSelectFormat
}) => {
  const reviewedCount = (caseProgress.reviewedCaseIds || []).length;
  const totalCases = allCases.length;
  const casesPercent = Math.min(100, Math.round((reviewedCount / totalCases) * 100));

  // Extensible format card configuration
  const formatCards: Part2Format[] = [
    {
      id: 'cases',
      title: 'Clinical Cases',
      subtitle: 'Situational Vignettes & Management',
      description: 'Comprehensive multi-part surgical cases with AI-powered verbal answer evaluation, full differential diagnosis, and authoritative rubrics.',
      icon: <Stethoscope className="w-6 h-6 text-teal-500" />,
      count: totalCases,
      countLabel: `${totalCases} Cases`,
      targetTab: 'cases',
      badgeText: 'Available Now',
      isAvailable: true
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400 font-extrabold text-xs uppercase tracking-wider mb-2">
          <Layers className="w-3.5 h-3.5" />
          <span>{PART_2_LABEL} Examination Prep</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Advanced Clinical Formats
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
          Select an assessment format to practice structured surgical diagnosis, tactics, and case reasoning.
        </p>
      </div>

      {/* Grid of Format Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {formatCards.map((card) => {
          return (
            <div
              key={card.id}
              id={`format-card-${card.id}`}
              className="p-5 rounded-3xl bg-white dark:bg-[#161A23] border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg dark:hover:border-slate-700 hover:border-teal-400/60 dark:hover:bg-[#1E2533] transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Top badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {card.icon}
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-teal-700 dark:text-teal-300 bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 rounded-md">
                      {card.countLabel}
                    </span>
                    {card.badgeText && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">
                        {card.badgeText}
                      </div>
                    )}
                  </div>
                </div>

                {/* Titles */}
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 mt-0.5">
                  {card.subtitle}
                </p>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {card.description}
                </p>

                {/* Progress Bar for Clinical Cases */}
                {card.id === 'cases' && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                      <span>Reviewed Cases</span>
                      <span className="text-slate-700 dark:text-slate-300">{reviewedCount} / {totalCases} ({casesPercent}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          casesPercent === 100 
                            ? 'bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]' 
                            : 'bg-gradient-to-r from-teal-500 to-emerald-400 shadow-[0_0_8px_rgba(20,184,166,0.5)]'
                        }`}
                        style={{ width: `${casesPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                {card.isAvailable ? (
                  <button
                    id={`btn-open-format-${card.id}`}
                    onClick={() => {
                      SoundEffects.playClick();
                      onSelectFormat(card.targetTab);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 active:scale-95 text-slate-950 font-black text-xs shadow-[0_0_15px_rgba(20,184,166,0.3)] flex items-center justify-center gap-2 transition-all group-hover:shadow-[0_0_20px_rgba(20,184,166,0.4)]"
                  >
                    <span>Open {card.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold text-xs flex items-center justify-center gap-1.5 cursor-not-allowed">
                    <Lock className="w-3.5 h-3.5" />
                    <span>{card.comingSoonText || 'Coming Soon'}</span>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
