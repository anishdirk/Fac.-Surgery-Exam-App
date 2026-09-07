import React from 'react';
import { Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { MCQ_SECTION_LABEL, PART_2_LABEL, AppSection } from '../constants/navigation';
import { SoundEffects } from '../utils/audio';

interface SectionSwitcherProps {
  section: AppSection;
  onSelectSection: (section: AppSection) => void;
  className?: string;
}

export const SectionSwitcher: React.FC<SectionSwitcherProps> = ({
  section,
  onSelectSection,
  className = ''
}) => {
  const handleSwitch = (newSection: AppSection) => {
    if (newSection !== section) {
      SoundEffects.playClick();
      onSelectSection(newSection);
    }
  };

  return (
    <div 
      id="section-switcher-container"
      className={`inline-flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-[#121620] border border-slate-200 dark:border-slate-800 shadow-inner select-none ${className}`}
    >
      <button
        id="section-switcher-mcq"
        type="button"
        onClick={() => handleSwitch('mcq')}
        className={`relative flex-1 justify-center px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-all duration-200 ${
          section === 'mcq'
            ? 'bg-white dark:bg-[#1E2534] text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200/80 dark:border-slate-700/80'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Sparkles className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${section === 'mcq' ? 'text-emerald-500 fill-emerald-500/20' : 'text-slate-400'}`} />
        <span>{MCQ_SECTION_LABEL}</span>
      </button>

      <button
        id="section-switcher-part2"
        type="button"
        onClick={() => handleSwitch('part2')}
        className={`relative flex-1 justify-center px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-all duration-200 ${
          section === 'part2'
            ? 'bg-white dark:bg-[#1E2534] text-teal-600 dark:text-teal-400 shadow-sm border border-slate-200/80 dark:border-slate-700/80'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <FileText className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${section === 'part2' ? 'text-teal-500 fill-teal-500/20' : 'text-slate-400'}`} />
        <span>{PART_2_LABEL}</span>
      </button>
    </div>
  );
};
