import React from 'react';
import { 
  Flame, 
  Heart, 
  BookOpen, 
  Layers, 
  Shuffle, 
  Clock, 
  Sparkles, 
  HelpCircle,
  RotateCcw,
  Zap,
  Settings,
  Smartphone,
  Stethoscope,
  FileText,
  BarChart2
} from 'lucide-react';
import { UserProgress } from '../types';
import { SoundEffects } from '../utils/audio';
import { AppSection, McqTab, Part2Tab, PART_2_LABEL } from '../constants/navigation';
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
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0F1218]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-3">
            
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
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.35)] group-hover:scale-105 transition-transform shrink-0">
                  <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base tracking-tight">SurgiMed</span>
                    <span className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-md uppercase tracking-wider">RU-MED</span>
                  </div>
                  <p className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400 font-medium -mt-0.5">Surgical Prep Suite</p>
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
            <nav className="hidden md:flex items-center gap-1">
              {section === 'mcq' ? (
                /* MCQ Sub-Tabs */
                <>
                  <button
                    id="nav-tab-learn"
                    onClick={() => {
                      SoundEffects.playClick();
                      setMcqTab('learn');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      mcqTab === 'learn'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                    <span>Path</span>
                  </button>

                  <button
                    id="nav-tab-bank"
                    onClick={() => {
                      SoundEffects.playClick();
                      setMcqTab('bank');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      mcqTab === 'bank'
                        ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                    <span>Question Bank (620)</span>
                  </button>

                  <button
                    id="nav-tab-exam"
                    onClick={() => {
                      SoundEffects.playClick();
                      setMcqTab('exam');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      mcqTab === 'exam'
                        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                    <span>Exam Mode</span>
                  </button>

                  {mistakesCount > 0 && (
                    <button
                      id="nav-tab-mistakes"
                      onClick={() => {
                        SoundEffects.playClick();
                        setMcqTab('mistakes');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        mcqTab === 'mistakes'
                          ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                          : 'text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10'
                      }`}
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                      <span>Mistakes</span>
                      <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-black">
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
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      mcqTab === 'analytics'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <BarChart2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
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
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all bg-teal-500/15 text-teal-600 dark:text-teal-300 border border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.15)]"
                >
                  <Stethoscope className="w-3.5 h-3.5 text-teal-500 dark:text-teal-400" />
                  <span>Clinical Cases (78)</span>
                </button>
              )}
            </nav>

            {/* Gamification Counters & Cleaned Header Action Icons */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              
              {/* Streak (Compact on Mobile: icon + number) */}
              <div 
                id="header-streak-badge"
                title="Daily Study Streak"
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-extrabold text-xs shadow-xs shrink-0"
              >
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 dark:text-amber-400 fill-amber-400 animate-pulse" />
                <span>{progress.streakDays || progress.streak || 1}</span>
              </div>

              {/* Gems / XP (Compact on Mobile: icon + number only, drop "XP") */}
              <div 
                id="header-xp-badge"
                title="Experience Points (XP)"
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-400 font-extrabold text-xs shadow-xs shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-500 dark:text-sky-400 fill-sky-400" />
                <span>{progress.totalXp || progress.xp || 0}</span>
                <span className="hidden sm:inline"> XP</span>
              </div>

              {/* Hearts (MCQ-Only Mechanic — compact on Mobile) */}
              {section === 'mcq' && (
                <div 
                  id="header-hearts-badge"
                  title={progress.infiniteHearts ? "Infinite Hearts Mode Active" : `${progress.hearts}/5 Hearts`}
                  className="flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-extrabold text-xs shadow-xs shrink-0"
                >
                  <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500 dark:text-rose-400 fill-rose-400" />
                  <span>{progress.infiniteHearts ? '∞' : progress.hearts}</span>
                </div>
              )}

              {/* Medical Glossary Helper */}
              <button
                id="btn-open-glossary"
                onClick={() => {
                  SoundEffects.playClick();
                  onOpenGlossary();
                }}
                title="Medical Sign Glossary & Eponyms"
                className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors shrink-0"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              {/* Install Android / PWA App */}
              <button
                id="btn-nav-install"
                onClick={() => {
                  SoundEffects.playClick();
                  onOpenInstallGuide();
                }}
                title="Install Android App / PWA"
                className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors shrink-0"
              >
                <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </button>

              {/* Settings (contains Theme, Sound, Translation, Infinite Hearts, Reset) */}
              <button
                id="btn-open-settings"
                onClick={() => {
                  SoundEffects.playClick();
                  onOpenSettings();
                }}
                title="Study Preferences & Settings"
                className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
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
                  className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all shrink-0"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Shuffle 10</span>
                </button>
              )}

            </div>
          </div>
        </div>

        {/* Mobile Full-Width Centered Section Switcher Row (Under Logo, md:hidden) */}
        <div className="md:hidden px-3.5 pb-2 pt-0.5 flex justify-center border-t border-slate-100 dark:border-slate-800/60 bg-white/95 dark:bg-[#0F1218]/95">
          <SectionSwitcher
            section={section}
            onSelectSection={setSection}
            className="w-full max-w-sm justify-center"
          />
        </div>
      </header>

      {/* Fixed Bottom Tab Bar (Mobile Only: md:hidden) */}
      {/* 2. Mobile Fixed Bottom Navigation Bar (MCQ Navigation) */}
      {!hideMobileBottomNav && section === 'mcq' && (
        <nav 
          id="mobile-bottom-nav"
          aria-label="Mobile Navigation"
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#0F1218]/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.5)]"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="grid grid-cols-5 h-14 w-full select-none">
            {/* 1. Path */}
            <button
              id="mobile-tab-learn"
              type="button"
              onClick={() => {
                SoundEffects.playClick();
                setMcqTab('learn');
              }}
              className={`relative flex flex-col items-center justify-center py-1 gap-0.5 transition-colors ${
                mcqTab === 'learn'
                  ? 'text-emerald-600 dark:text-emerald-400 font-black'
                  : 'text-slate-500 dark:text-slate-400 font-semibold hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {mcqTab === 'learn' && (
                <span className="absolute top-0 inset-x-3 h-0.5 bg-emerald-500 rounded-full" />
              )}
              <Zap className={`w-4 h-4 ${mcqTab === 'learn' ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px] leading-tight tracking-tight">Path</span>
            </button>

            {/* 2. Question Bank */}
            <button
              id="mobile-tab-bank"
              type="button"
              onClick={() => {
                SoundEffects.playClick();
                setMcqTab('bank');
              }}
              className={`relative flex flex-col items-center justify-center py-1 gap-0.5 transition-colors ${
                mcqTab === 'bank'
                  ? 'text-indigo-600 dark:text-indigo-400 font-black'
                  : 'text-slate-500 dark:text-slate-400 font-semibold hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {mcqTab === 'bank' && (
                <span className="absolute top-0 inset-x-3 h-0.5 bg-indigo-500 rounded-full" />
              )}
              <BookOpen className={`w-4 h-4 ${mcqTab === 'bank' ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px] leading-tight tracking-tight">Bank</span>
            </button>

            {/* 3. Exam */}
            <button
              id="mobile-tab-exam"
              type="button"
              onClick={() => {
                SoundEffects.playClick();
                setMcqTab('exam');
              }}
              className={`relative flex flex-col items-center justify-center py-1 gap-0.5 transition-colors ${
                mcqTab === 'exam'
                  ? 'text-amber-600 dark:text-amber-400 font-black'
                  : 'text-slate-500 dark:text-slate-400 font-semibold hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {mcqTab === 'exam' && (
                <span className="absolute top-0 inset-x-3 h-0.5 bg-amber-500 rounded-full" />
              )}
              <Clock className={`w-4 h-4 ${mcqTab === 'exam' ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px] leading-tight tracking-tight">Exam</span>
            </button>

            {/* 4. Mistakes */}
            <button
              id="mobile-tab-mistakes"
              type="button"
              onClick={() => {
                SoundEffects.playClick();
                setMcqTab('mistakes');
              }}
              className={`relative flex flex-col items-center justify-center py-1 gap-0.5 transition-colors ${
                mcqTab === 'mistakes'
                  ? 'text-rose-600 dark:text-rose-400 font-black'
                  : 'text-slate-500 dark:text-slate-400 font-semibold hover:text-rose-600 dark:hover:text-rose-400'
              }`}
            >
              {mcqTab === 'mistakes' && (
                <span className="absolute top-0 inset-x-3 h-0.5 bg-rose-500 rounded-full" />
              )}
              <div className="relative">
                <RotateCcw className={`w-4 h-4 ${mcqTab === 'mistakes' ? 'stroke-[2.5]' : ''}`} />
                {mistakesCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1 min-w-[14px] h-3.5 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center leading-none">
                    {mistakesCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] leading-tight tracking-tight">Review</span>
            </button>

            {/* 5. Analytics */}
            <button
              id="mobile-tab-analytics"
              type="button"
              onClick={() => {
                SoundEffects.playClick();
                setMcqTab('analytics');
              }}
              className={`relative flex flex-col items-center justify-center py-1 gap-0.5 transition-colors ${
                mcqTab === 'analytics'
                  ? 'text-emerald-600 dark:text-emerald-400 font-black'
                  : 'text-slate-500 dark:text-slate-400 font-semibold hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {mcqTab === 'analytics' && (
                <span className="absolute top-0 inset-x-3 h-0.5 bg-emerald-500 rounded-full" />
              )}
              <BarChart2 className={`w-4 h-4 ${mcqTab === 'analytics' ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px] leading-tight tracking-tight">Trends</span>
            </button>
          </div>
        </nav>
      )}
    </>
  );
};
