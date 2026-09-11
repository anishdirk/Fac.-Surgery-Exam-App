import React from 'react';
import { 
  Flame, 
  Heart, 
  BookOpen, 
  Clock, 
  Sparkles, 
  HelpCircle,
  RotateCcw,
  Zap,
  Settings,
  Smartphone,
  Stethoscope,
  BarChart2,
  Shuffle
} from 'lucide-react';
import { motion } from 'motion/react';
import { UserProgress } from '../types';
import { SoundEffects } from '../utils/audio';
import { AppSection, McqTab, Part2Tab } from '../constants/navigation';
import { SectionSwitcher } from './SectionSwitcher';

interface NavbarProps {
  section: AppSection;
  setSection: (section: AppSection) => void;
  mcqTab: McqTab;
  setMcqTab: (tab: McqTab) => void;
  part2Tab: Part2Tab;
  setPart2Tab: (tab: Part2Tab) => void;
  progress: UserProgress;
  onQuickPractice: (count: number) => void;
  onOpenGlossary: () => void;
  onOpenSettings: () => void;
  onOpenInstallGuide: () => void;
  mistakesCount: number;
  hideMobileBottomNav?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  section,
  setSection,
  mcqTab,
  setMcqTab,
  part2Tab,
  setPart2Tab,
  progress,
  onQuickPractice,
  onOpenGlossary,
  onOpenSettings,
  onOpenInstallGuide,
  mistakesCount,
  hideMobileBottomNav = false
}) => {
  return (
    <>
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-outline-variant/40 transition-colors w-full max-w-full">
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 min-w-0">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-1.5 sm:gap-3 min-w-0">
            
            {/* Logo & Desktop Section Switcher Area */}
            <div className="flex items-center gap-3 sm:gap-5 shrink-0">
              <div 
                id="nav-logo"
                onClick={() => {
                  SoundEffects.playClick();
                  if (section === 'mcq') {
                    setMcqTab('learn');
                  } else {
                    setPart2Tab('cases');
                  }
                }}
                className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none"
              >
                {/* M3 Expressive Shape-lg Logo Container with Tonal Primary Palette */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-shape-lg bg-primary-container text-on-primary-container flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0 border border-outline-variant/40">
                  <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 text-on-primary-container stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-on-surface text-title-medium sm:text-title-large tracking-tight">SurgiMed</span>
                    <span className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] font-bold bg-primary-container/70 text-on-primary-container border border-outline-variant/50 rounded-shape-xs uppercase tracking-wider">RU-MED</span>
                  </div>
                  <p className="hidden sm:block text-label-small text-on-surface-variant font-medium -mt-0.5">Surgical Prep Suite</p>
                </div>
              </div>

              {/* Desktop-Only Section Switcher ("MCQs" / "Part 2") */}
              <div className="hidden md:block">
                <SectionSwitcher
                  section={section}
                  onSelectSection={setSection}
                />
              </div>
            </div>

            {/* Desktop Contextual Sub-Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5">
              {section === 'mcq' ? (
                /* MCQ Sub-Tabs with M3 Expressive Pill Tokens & Outlined/Filled Icons */
                <>
                  <button
                    id="nav-tab-learn"
                    onClick={() => {
                      SoundEffects.playClick();
                      setMcqTab('learn');
                    }}
                    className={`px-3.5 py-1.5 rounded-shape-full text-label-large flex items-center gap-1.5 transition-all ${
                      mcqTab === 'learn'
                        ? 'bg-primary-container text-on-primary-container border border-outline-variant/40 shadow-xs font-bold'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high font-medium'
                    }`}
                  >
                    <Zap 
                      className={`w-3.5 h-3.5 ${mcqTab === 'learn' ? 'text-on-primary-container stroke-[2.25]' : 'text-outline stroke-[1.75]'}`} 
                      fill={mcqTab === 'learn' ? 'currentColor' : 'none'}
                    />
                    <span>Path</span>
                  </button>

                  <button
                    id="nav-tab-bank"
                    onClick={() => {
                      SoundEffects.playClick();
                      setMcqTab('bank');
                    }}
                    className={`px-3.5 py-1.5 rounded-shape-full text-label-large flex items-center gap-1.5 transition-all ${
                      mcqTab === 'bank'
                        ? 'bg-secondary-container text-on-secondary-container border border-outline-variant/40 shadow-xs font-bold'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high font-medium'
                    }`}
                  >
                    <BookOpen 
                      className={`w-3.5 h-3.5 ${mcqTab === 'bank' ? 'text-on-secondary-container stroke-[2.25]' : 'text-outline stroke-[1.75]'}`} 
                    />
                    <span>Question Bank (620)</span>
                  </button>

                  <button
                    id="nav-tab-exam"
                    onClick={() => {
                      SoundEffects.playClick();
                      setMcqTab('exam');
                    }}
                    className={`px-3.5 py-1.5 rounded-shape-full text-label-large flex items-center gap-1.5 transition-all ${
                      mcqTab === 'exam'
                        ? 'bg-tertiary-container text-on-tertiary-container border border-outline-variant/40 shadow-xs font-bold'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high font-medium'
                    }`}
                  >
                    <Clock 
                      className={`w-3.5 h-3.5 ${mcqTab === 'exam' ? 'text-on-tertiary-container stroke-[2.25]' : 'text-outline stroke-[1.75]'}`} 
                    />
                    <span>Exam Mode</span>
                  </button>

                  {mistakesCount > 0 && (
                    <button
                      id="nav-tab-mistakes"
                      onClick={() => {
                        SoundEffects.playClick();
                        setMcqTab('mistakes');
                      }}
                      className={`px-3.5 py-1.5 rounded-shape-full text-label-large flex items-center gap-1.5 transition-all ${
                        mcqTab === 'mistakes'
                          ? 'bg-error-container text-on-error-container border border-outline-variant/40 shadow-xs font-bold'
                          : 'text-on-surface-variant hover:text-error hover:bg-error-container/20 font-medium'
                      }`}
                    >
                      <RotateCcw className={`w-3.5 h-3.5 ${mcqTab === 'mistakes' ? 'text-on-error-container stroke-[2.5]' : 'text-outline stroke-[1.75]'}`} />
                      <span>Mistakes</span>
                      <span className="px-1.5 py-0.2 bg-error text-on-error rounded-shape-full text-[10px] font-black shadow-xs">
                        {mistakesCount}
                      </span>
                    </button>
                  )}

                  <button
                    id="nav-tab-analytics"
                    onClick={() => {
                      SoundEffects.playClick();
                      setMcqTab('analytics');
                    }}
                    className={`px-3.5 py-1.5 rounded-shape-full text-label-large flex items-center gap-1.5 transition-all ${
                      mcqTab === 'analytics'
                        ? 'bg-primary-container text-on-primary-container border border-outline-variant/40 shadow-xs font-bold'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high font-medium'
                    }`}
                  >
                    <BarChart2 
                      className={`w-3.5 h-3.5 ${mcqTab === 'analytics' ? 'text-on-primary-container stroke-[2.25]' : 'text-outline stroke-[1.75]'}`} 
                    />
                    <span>Analytics</span>
                  </button>
                </>
              ) : (
                /* Part 2 Sub-Tabs */
                <button
                  id="nav-tab-part2-cases"
                  onClick={() => {
                    SoundEffects.playClick();
                    setPart2Tab('cases');
                  }}
                  className="px-4 py-1.5 rounded-shape-full text-label-large font-bold flex items-center gap-1.5 transition-all bg-primary-container text-on-primary-container border border-outline-variant/40 shadow-xs"
                >
                  <Stethoscope className="w-3.5 h-3.5 text-on-primary-container stroke-[2.25]" />
                  <span>Clinical Cases (78)</span>
                </button>
              )}
            </nav>

            {/* Gamification Counters & Cleaned Header Action Icons */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              
              {/* Streak Badge (Tonal Tertiary Role: Amber #F59E0B) */}
              <div 
                id="header-streak-badge"
                title="Daily Study Streak"
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-shape-full bg-tertiary-container border border-outline-variant/30 text-on-tertiary-container font-extrabold text-label-medium shadow-xs shrink-0"
              >
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-on-tertiary-container fill-current animate-pulse" />
                <span>{progress.streakDays || progress.streak || 1}</span>
              </div>

              {/* XP / Gems Badge (Tonal Secondary Role: Slate-Blue #5B7A9B) */}
              <div 
                id="header-xp-badge"
                title="Experience Points (XP)"
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-shape-full bg-secondary-container border border-outline-variant/30 text-on-secondary-container font-extrabold text-label-medium shadow-xs shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-on-secondary-container fill-current" />
                <span>{progress.totalXp || progress.xp || 0}</span>
                <span className="hidden sm:inline"> XP</span>
              </div>

              {/* Hearts Badge (Tonal Error Role: Red #DC2626) */}
              {section === 'mcq' && (
                <div 
                  id="header-hearts-badge"
                  title={progress.infiniteHearts ? "Infinite Hearts Mode Active" : `${progress.hearts}/5 Hearts`}
                  className="flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-shape-full bg-error-container border border-outline-variant/30 text-on-error-container font-extrabold text-label-medium shadow-xs shrink-0"
                >
                  <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-on-error-container fill-current" />
                  <span>{progress.infiniteHearts ? '∞' : progress.hearts}</span>
                </div>
              )}

              {/* Medical Glossary Helper Button */}
              <button
                id="btn-open-glossary"
                onClick={() => {
                  SoundEffects.playClick();
                  onOpenGlossary();
                }}
                title="Medical Sign Glossary & Eponyms"
                className="p-1.5 sm:p-2 rounded-shape-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors shrink-0"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              {/* Install Android / PWA App Button */}
              <button
                id="btn-nav-install"
                onClick={() => {
                  SoundEffects.playClick();
                  onOpenInstallGuide();
                }}
                title="Install Android App / PWA"
                className="p-1.5 sm:p-2 rounded-shape-full text-primary hover:text-on-primary-container hover:bg-primary-container/40 transition-colors shrink-0"
              >
                <Smartphone className="w-4 h-4" />
              </button>

              {/* Settings Button */}
              <button
                id="btn-open-settings"
                onClick={() => {
                  SoundEffects.playClick();
                  onOpenSettings();
                }}
                title="Study Preferences & Settings"
                className="p-1.5 sm:p-2 rounded-shape-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors shrink-0"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Quick Shuffle button (MCQ-Only, Desktop) */}
              {section === 'mcq' && (
                <button
                  id="btn-quick-shuffle"
                  onClick={() => {
                    SoundEffects.playClick();
                    onQuickPractice(10);
                  }}
                  className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-shape-full bg-primary hover:opacity-95 active:scale-95 text-on-primary font-bold text-label-large shadow-xs transition-all shrink-0"
                >
                  <Shuffle className="w-3.5 h-3.5 text-on-primary" />
                  <span>Shuffle 10</span>
                </button>
              )}

            </div>
          </div>
        </div>

        {/* Mobile Full-Width Centered Section Switcher Row (Under Logo, md:hidden) */}
        <div className="md:hidden px-2 sm:px-3.5 pb-2 pt-0.5 flex justify-center border-t border-outline-variant/30 bg-surface/90 w-full max-w-full min-w-0 overflow-hidden">
          <SectionSwitcher
            section={section}
            onSelectSection={setSection}
            className="w-full max-w-sm justify-center"
          />
        </div>
      </header>

      {/* Fixed Bottom Navigation Bar (Mobile Only: md:hidden) */}
      {!hideMobileBottomNav && section === 'mcq' && (
        <nav 
          id="mobile-bottom-nav"
          aria-label="Mobile Navigation"
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-container/95 backdrop-blur-lg border-t border-outline-variant/40 shadow-lg overflow-x-hidden w-full max-w-full"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="grid grid-cols-5 h-16 w-full max-w-full select-none items-center px-0.5 min-w-0">
            
            {/* 1. Path Tab */}
            <button
              id="mobile-tab-learn"
              type="button"
              onClick={() => {
                SoundEffects.playClick();
                setMcqTab('learn');
              }}
              className="relative flex flex-col items-center justify-center py-1 h-full select-none cursor-pointer focus:outline-none min-w-0 w-full"
            >
              <div className="relative flex flex-col items-center justify-center w-full max-w-[56px] sm:max-w-[64px] py-1 min-w-0 px-0.5">
                {mcqTab === 'learn' && (
                  <motion.div
                    layoutId="mobileNavActivePill"
                    className="absolute inset-0 rounded-shape-full bg-primary-container shadow-xs"
                    transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
                  />
                )}
                <div className="relative z-10 flex flex-col items-center gap-0.5 min-w-0 max-w-full">
                  <Zap 
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                      mcqTab === 'learn' 
                        ? 'text-on-primary-container scale-110 stroke-[2.25]' 
                        : 'text-on-surface-variant stroke-[1.75]'
                    }`}
                    fill={mcqTab === 'learn' ? 'currentColor' : 'none'}
                  />
                  <span 
                    className={`text-[11px] leading-tight transition-colors duration-200 truncate max-w-full text-center ${
                      mcqTab === 'learn' 
                        ? 'text-on-primary-container font-extrabold' 
                        : 'text-on-surface-variant font-medium'
                    }`}
                  >
                    Path
                  </span>
                </div>
              </div>
            </button>

            {/* 2. Question Bank Tab */}
            <button
              id="mobile-tab-bank"
              type="button"
              onClick={() => {
                SoundEffects.playClick();
                setMcqTab('bank');
              }}
              className="relative flex flex-col items-center justify-center py-1 h-full select-none cursor-pointer focus:outline-none min-w-0 w-full"
            >
              <div className="relative flex flex-col items-center justify-center w-full max-w-[56px] sm:max-w-[64px] py-1 min-w-0 px-0.5">
                {mcqTab === 'bank' && (
                  <motion.div
                    layoutId="mobileNavActivePill"
                    className="absolute inset-0 rounded-shape-full bg-primary-container shadow-xs"
                    transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
                  />
                )}
                <div className="relative z-10 flex flex-col items-center gap-0.5 min-w-0 max-w-full">
                  <BookOpen 
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                      mcqTab === 'bank' 
                        ? 'text-on-primary-container scale-110 stroke-[2.25]' 
                        : 'text-on-surface-variant stroke-[1.75]'
                    }`}
                  />
                  <span 
                    className={`text-[11px] leading-tight transition-colors duration-200 truncate max-w-full text-center ${
                      mcqTab === 'bank' 
                        ? 'text-on-primary-container font-extrabold' 
                        : 'text-on-surface-variant font-medium'
                    }`}
                  >
                    Bank
                  </span>
                </div>
              </div>
            </button>

            {/* 3. Exam Tab */}
            <button
              id="mobile-tab-exam"
              type="button"
              onClick={() => {
                SoundEffects.playClick();
                setMcqTab('exam');
              }}
              className="relative flex flex-col items-center justify-center py-1 h-full select-none cursor-pointer focus:outline-none min-w-0 w-full"
            >
              <div className="relative flex flex-col items-center justify-center w-full max-w-[56px] sm:max-w-[64px] py-1 min-w-0 px-0.5">
                {mcqTab === 'exam' && (
                  <motion.div
                    layoutId="mobileNavActivePill"
                    className="absolute inset-0 rounded-shape-full bg-primary-container shadow-xs"
                    transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
                  />
                )}
                <div className="relative z-10 flex flex-col items-center gap-0.5 min-w-0 max-w-full">
                  <Clock 
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                      mcqTab === 'exam' 
                        ? 'text-on-primary-container scale-110 stroke-[2.25]' 
                        : 'text-on-surface-variant stroke-[1.75]'
                    }`}
                  />
                  <span 
                    className={`text-[11px] leading-tight transition-colors duration-200 truncate max-w-full text-center ${
                      mcqTab === 'exam' 
                        ? 'text-on-primary-container font-extrabold' 
                        : 'text-on-surface-variant font-medium'
                    }`}
                  >
                    Exam
                  </span>
                </div>
              </div>
            </button>

            {/* 4. Mistakes Review Tab */}
            <button
              id="mobile-tab-mistakes"
              type="button"
              onClick={() => {
                SoundEffects.playClick();
                setMcqTab('mistakes');
              }}
              className="relative flex flex-col items-center justify-center py-1 h-full select-none cursor-pointer focus:outline-none min-w-0 w-full"
            >
              <div className="relative flex flex-col items-center justify-center w-full max-w-[56px] sm:max-w-[64px] py-1 min-w-0 px-0.5">
                {mcqTab === 'mistakes' && (
                  <motion.div
                    layoutId="mobileNavActivePill"
                    className="absolute inset-0 rounded-shape-full bg-primary-container shadow-xs"
                    transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
                  />
                )}
                <div className="relative z-10 flex flex-col items-center gap-0.5 min-w-0 max-w-full">
                  <div className="relative">
                    <RotateCcw 
                      className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                        mcqTab === 'mistakes' 
                          ? 'text-on-primary-container scale-110 stroke-[2.5]' 
                          : 'text-on-surface-variant stroke-[1.75]'
                      }`}
                    />
                    {mistakesCount > 0 && (
                      <span className="absolute -top-1 -right-1.5 px-1 min-w-[14px] h-3.5 bg-error text-on-error rounded-shape-full text-[9px] font-black flex items-center justify-center leading-none shadow-xs pointer-events-none">
                        {mistakesCount}
                      </span>
                    )}
                  </div>
                  <span 
                    className={`text-[11px] leading-tight transition-colors duration-200 truncate max-w-full text-center ${
                      mcqTab === 'mistakes' 
                        ? 'text-on-primary-container font-extrabold' 
                        : 'text-on-surface-variant font-medium'
                    }`}
                  >
                    Review
                  </span>
                </div>
              </div>
            </button>

            {/* 5. Analytics Tab */}
            <button
              id="mobile-tab-analytics"
              type="button"
              onClick={() => {
                SoundEffects.playClick();
                setMcqTab('analytics');
              }}
              className="relative flex flex-col items-center justify-center py-1 h-full select-none cursor-pointer focus:outline-none min-w-0 w-full"
            >
              <div className="relative flex flex-col items-center justify-center w-full max-w-[56px] sm:max-w-[64px] py-1 min-w-0 px-0.5">
                {mcqTab === 'analytics' && (
                  <motion.div
                    layoutId="mobileNavActivePill"
                    className="absolute inset-0 rounded-shape-full bg-primary-container shadow-xs"
                    transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
                  />
                )}
                <div className="relative z-10 flex flex-col items-center gap-0.5 min-w-0 max-w-full">
                  <BarChart2 
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                      mcqTab === 'analytics' 
                        ? 'text-on-primary-container scale-110 stroke-[2.25]' 
                        : 'text-on-surface-variant stroke-[1.75]'
                    }`}
                  />
                  <span 
                    className={`text-[11px] leading-tight transition-colors duration-200 truncate max-w-full text-center ${
                      mcqTab === 'analytics' 
                        ? 'text-on-primary-container font-extrabold' 
                        : 'text-on-surface-variant font-medium'
                    }`}
                  >
                    Trends
                  </span>
                </div>
              </div>
            </button>

          </div>
        </nav>
      )}
    </>
  );
};

