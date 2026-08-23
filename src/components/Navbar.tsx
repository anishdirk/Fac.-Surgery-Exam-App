import React from 'react';
import { 
  Flame, 
  Heart, 
  BookOpen, 
  Layers, 
  Shuffle, 
  Clock, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Languages, 
  HelpCircle,
  RotateCcw,
  Zap,
  Settings
} from 'lucide-react';
import { UserProgress } from '../types';
import { SoundEffects } from '../utils/audio';

interface NavbarProps {
  currentTab: 'learn' | 'topics' | 'bank' | 'exam' | 'mistakes';
  setCurrentTab: (tab: 'learn' | 'topics' | 'bank' | 'exam' | 'mistakes') => void;
  progress: UserProgress;
  onQuickPractice: (count: number) => void;
  onOpenGlossary: () => void;
  onOpenSettings: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  showTranslationByDefault: boolean;
  setShowTranslationByDefault: (val: boolean) => void;
  mistakesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  progress,
  onQuickPractice,
  onOpenGlossary,
  onOpenSettings,
  soundEnabled,
  setSoundEnabled,
  showTranslationByDefault,
  setShowTranslationByDefault,
  mistakesCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0F1218]/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            id="nav-logo"
            onClick={() => setCurrentTab('learn')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:scale-105 transition-transform">
              <span className="text-2xl font-black">🦉</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-lg tracking-tight">DuoMed</span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md uppercase tracking-wider">RU-MED</span>
              </div>
              <p className="text-xs text-slate-400 font-medium -mt-0.5">620 Russian Surgical MCQs</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              id="nav-tab-learn"
              onClick={() => {
                SoundEffects.playClick();
                setCurrentTab('learn');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                currentTab === 'learn'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Learning Path</span>
            </button>

            <button
              id="nav-tab-topics"
              onClick={() => {
                SoundEffects.playClick();
                setCurrentTab('topics');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                currentTab === 'topics'
                  ? 'bg-sky-500/15 text-sky-400 border border-sky-500/40 shadow-[0_0_15px_rgba(14,165,233,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4 text-sky-400" />
              <span>16 Topics</span>
            </button>

            <button
              id="nav-tab-bank"
              onClick={() => {
                SoundEffects.playClick();
                setCurrentTab('bank');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                currentTab === 'bank'
                  ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Question Bank (620)</span>
            </button>

            <button
              id="nav-tab-exam"
              onClick={() => {
                SoundEffects.playClick();
                setCurrentTab('exam');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                currentTab === 'exam'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Exam Mode</span>
            </button>

            {mistakesCount > 0 && (
              <button
                id="nav-tab-mistakes"
                onClick={() => {
                  SoundEffects.playClick();
                  setCurrentTab('mistakes');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  currentTab === 'mistakes'
                    ? 'bg-rose-500/15 text-rose-400 border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                    : 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10'
                }`}
              >
                <RotateCcw className="w-4 h-4 text-rose-400" />
                <span>Mistakes</span>
                <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-black">
                  {mistakesCount}
                </span>
              </button>
            )}
          </nav>

          {/* Gamification Counters & Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Streak */}
            <div 
              id="header-streak-badge"
              title="Daily Study Streak"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold text-xs shadow-xs"
            >
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
              <span>{progress.streakDays || progress.streak || 1}</span>
            </div>

            {/* Gems / XP */}
            <div 
              id="header-xp-badge"
              title="Experience Points (XP)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 font-extrabold text-xs shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-sky-400 fill-sky-400" />
              <span>{progress.totalXp || progress.xp || 0} XP</span>
            </div>

            {/* Hearts */}
            <div 
              id="header-hearts-badge"
              title={progress.infiniteHearts ? "Infinite Hearts Mode Active" : `${progress.hearts}/5 Hearts`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-extrabold text-xs shadow-xs"
            >
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
              <span>{progress.infiniteHearts ? '∞' : progress.hearts}</span>
            </div>

            {/* Sound Toggle */}
            <button
              id="btn-toggle-sound"
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (next) SoundEffects.playClick();
              }}
              title={soundEnabled ? "Mute Sound Effects" : "Enable Sound Effects"}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Translation Assistant Toggle */}
            <button
              id="btn-toggle-translation"
              onClick={() => {
                SoundEffects.playClick();
                setShowTranslationByDefault(!showTranslationByDefault);
              }}
              title={showTranslationByDefault ? "Auto English Translation: ON" : "Auto English Translation: OFF"}
              className={`p-2 rounded-xl transition-colors ${
                showTranslationByDefault 
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-[0_0_10px_rgba(99,102,241,0.2)]' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Languages className="w-4 h-4" />
            </button>

            {/* Medical Glossary Helper */}
            <button
              id="btn-open-glossary"
              onClick={() => {
                SoundEffects.playClick();
                onOpenGlossary();
              }}
              title="Medical Sign Glossary & Eponyms"
              className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Settings */}
            <button
              id="btn-open-settings"
              onClick={() => {
                SoundEffects.playClick();
                onOpenSettings();
              }}
              title="Study Preferences & Settings"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Quick Shuffle button */}
            <button
              id="btn-quick-shuffle"
              onClick={() => {
                SoundEffects.playClick();
                onQuickPractice(10);
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Shuffle 10</span>
            </button>

          </div>
        </div>
      </div>
      
      {/* Mobile Sub-Navigation Bar */}
      <div className="flex md:hidden items-center justify-around px-2 py-2 border-t border-slate-800 bg-[#0F1218] text-xs font-bold">
        <button
          onClick={() => setCurrentTab('learn')}
          className={`px-2.5 py-1 rounded-lg ${currentTab === 'learn' ? 'text-emerald-400 bg-emerald-500/15' : 'text-slate-400'}`}
        >
          Path
        </button>
        <button
          onClick={() => setCurrentTab('topics')}
          className={`px-2.5 py-1 rounded-lg ${currentTab === 'topics' ? 'text-sky-400 bg-sky-500/15' : 'text-slate-400'}`}
        >
          Topics
        </button>
        <button
          onClick={() => setCurrentTab('bank')}
          className={`px-2.5 py-1 rounded-lg ${currentTab === 'bank' ? 'text-indigo-400 bg-indigo-500/15' : 'text-slate-400'}`}
        >
          Bank (620)
        </button>
        <button
          onClick={() => setCurrentTab('exam')}
          className={`px-2.5 py-1 rounded-lg ${currentTab === 'exam' ? 'text-amber-400 bg-amber-500/15' : 'text-slate-400'}`}
        >
          Exam
        </button>
        {mistakesCount > 0 && (
          <button
            onClick={() => setCurrentTab('mistakes')}
            className={`px-2.5 py-1 rounded-lg ${currentTab === 'mistakes' ? 'text-rose-400 bg-rose-500/15' : 'text-slate-400'}`}
          >
            Mistakes ({mistakesCount})
          </button>
        )}
      </div>
    </header>
  );
};
