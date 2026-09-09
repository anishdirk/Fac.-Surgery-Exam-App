import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, FileText } from 'lucide-react';
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
      className={`inline-flex items-center p-1 rounded-shape-full bg-surface-container border border-outline-variant/30 shadow-inner select-none ${className}`}
    >
      <button
        id="section-switcher-mcq"
        type="button"
        onClick={() => handleSwitch('mcq')}
        className={`relative flex-1 justify-center px-3.5 sm:px-5 py-2 rounded-shape-full text-label-medium sm:text-label-large font-black flex items-center gap-2 transition-colors z-10 ${
          section === 'mcq'
            ? 'text-on-primary-container'
            : 'text-on-surface-variant hover:text-on-surface'
        }`}
      >
        {section === 'mcq' && (
          <motion.div
            layoutId="section-switcher-active"
            className="absolute inset-0 rounded-shape-full bg-primary-container shadow-xs -z-10"
            transition={{ type: "spring", stiffness: 450, damping: 32 }}
          />
        )}
        <Sparkles className={`w-4 h-4 transition-colors ${section === 'mcq' ? 'text-primary fill-primary/20' : 'text-on-surface-variant'}`} />
        <span>{MCQ_SECTION_LABEL}</span>
      </button>

      <button
        id="section-switcher-part2"
        type="button"
        onClick={() => handleSwitch('part2')}
        className={`relative flex-1 justify-center px-3.5 sm:px-5 py-2 rounded-shape-full text-label-medium sm:text-label-large font-black flex items-center gap-2 transition-colors z-10 ${
          section === 'part2'
            ? 'text-on-primary-container'
            : 'text-on-surface-variant hover:text-on-surface'
        }`}
      >
        {section === 'part2' && (
          <motion.div
            layoutId="section-switcher-active"
            className="absolute inset-0 rounded-shape-full bg-primary-container shadow-xs -z-10"
            transition={{ type: "spring", stiffness: 450, damping: 32 }}
          />
        )}
        <FileText className={`w-4 h-4 transition-colors ${section === 'part2' ? 'text-primary fill-primary/20' : 'text-on-surface-variant'}`} />
        <span>{PART_2_LABEL}</span>
      </button>
    </div>
  );
};
