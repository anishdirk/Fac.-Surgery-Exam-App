import React from 'react';
import { 
  Star, 
  Lock, 
  Check, 
  Trophy, 
  Play, 
  Shuffle,
  Sparkles,
  Stethoscope,
  Activity
} from 'lucide-react';
import { UserProgress } from '../types';
import { topics } from '../data/topics';
import { SoundEffects } from '../utils/audio';

interface DuolingoPathProps {
  progress: UserProgress;
  onStartLesson: (topicId: string, levelIndex: number) => void;
  onStartQuickShuffle: () => void;
  onOpenExam: () => void;
}

export const DuolingoPath: React.FC<DuolingoPathProps> = ({
  progress,
  onStartLesson,
  onStartQuickShuffle,
  onOpenExam,
}) => {
  // 62 sequential units corresponding to blocks of 10 questions
  const totalLevels = 62;
  
  const getTopicForLevel = (level: number) => {
    const questionNum = level * 10 - 5;
    const found = topics.find(t => questionNum >= t.questionRange[0] && questionNum <= t.questionRange[1]);
    return found || topics[0];
  };

  const completedQuestionsCount = Object.keys(progress.completedQuestions || {}).length;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-gradient-to-r dark:from-emerald-950/80 dark:via-[#161A23] dark:to-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 mb-8 shadow-sm dark:shadow-xl transition-all">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="max-w-md">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-400/30 text-xs font-black tracking-wider uppercase text-emerald-700 dark:text-emerald-400 mb-3">
              <Activity className="w-3.5 h-3.5" />
              <span>Surgical Board Mastery</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
              Surgical Exam Quest
            </h1>
            <p className="mt-1 text-slate-600 dark:text-slate-400 text-sm font-medium">
              620 Official Russian Surgical Questions organized into 62 bite-sized progressive levels.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                id="btn-path-quick-shuffle"
                onClick={() => {
                  SoundEffects.playClick();
                  onStartQuickShuffle();
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-sm shadow-sm dark:shadow-[0_0_20px_rgba(52,211,153,0.4)] transition-all flex items-center gap-2"
              >
                <Shuffle className="w-4 h-4 text-slate-950" />
                <span>Shuffle Practice (10 Qs)</span>
              </button>

              <button
                id="btn-path-exam-mode"
                onClick={() => {
                  SoundEffects.playClick();
                  onOpenExam();
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#0F1218] dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 font-bold text-sm shadow-sm active:scale-95 transition-all flex items-center gap-2"
              >
                <Trophy className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span>Simulate Exam</span>
              </button>
            </div>
          </div>

          {/* Progress Card */}
          <div className="w-full sm:w-auto min-w-[220px] p-4 rounded-2xl bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800 flex flex-col gap-2 shadow-sm dark:shadow-lg backdrop-blur-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Overall Completion</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{Math.round((completedQuestionsCount / 620) * 100)}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden border border-slate-200/60 dark:border-transparent">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 dark:from-emerald-500 dark:to-teal-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] dark:shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                style={{ width: `${Math.min(100, (completedQuestionsCount / 620) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
              <span>{completedQuestionsCount} / 620 Questions</span>
              <span className="text-sky-600 dark:text-sky-400 font-bold">{progress.totalXp || progress.xp || 0} XP</span>
            </div>
          </div>
        </div>

        {/* Surgical Stethoscope decoration watermark (replaced owl) */}
        <div className="absolute -right-6 -bottom-6 opacity-5 dark:opacity-10 pointer-events-none select-none text-emerald-600 dark:text-emerald-400">
          <Stethoscope className="w-44 h-44 -rotate-12" />
        </div>
      </div>

      {/* Winding Learning Path */}
      <div className="relative py-4 flex flex-col items-center">
        
        {/* Continuous background path line */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-3 bg-slate-300 dark:bg-slate-800 rounded-full -z-0" />

        {Array.from({ length: totalLevels }).map((_, idx) => {
          const levelNum = idx + 1;
          const topic = getTopicForLevel(levelNum);
          const isCompleted = (progress.completedLessons || []).includes(levelNum);
          const isCurrent = levelNum === 1 || (progress.completedLessons || []).includes(levelNum - 1);
          const isLocked = !isCompleted && !isCurrent;

          // Sinusoidal horizontal offset for the winding road
          const offsets = [0, 45, 75, 45, 0, -45, -75, -45];
          const xOffset = offsets[idx % offsets.length];

          // Check if this level begins a new topic module
          const isTopicHeader = idx === 0 || getTopicForLevel(levelNum).id !== getTopicForLevel(levelNum - 1).id;

          return (
            <React.Fragment key={`level-node-${levelNum}`}>
              
              {/* Topic Section Header Banner */}
              {isTopicHeader && (
                <div className="my-6 z-10 w-full max-w-md">
                  <div className={`p-4 rounded-2xl border shadow-lg flex items-center justify-between transition-all ${
                    isLocked 
                      ? 'bg-slate-100 dark:bg-[#0F1218]/90 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500' 
                      : 'bg-white dark:bg-[#161A23] border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_0_20px_rgba(0,0,0,0.4)]'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xl">
                        {topic.icon}
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          Unit {topic.order} • Questions {topic.questionRange[0]}–{topic.questionRange[1]}
                        </div>
                        <h3 className="font-extrabold text-sm sm:text-base leading-tight text-slate-900 dark:text-white">
                          {topic.titleEn}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{topic.titleRu}</p>
                      </div>
                    </div>
                    <div className="text-xs font-black text-slate-400 dark:text-slate-500">
                      {topic.count} Qs
                    </div>
                  </div>
                </div>
              )}

              {/* Node Button */}
              <div 
                className="my-3 z-10 relative flex flex-col items-center"
                style={{ transform: `translateX(${xOffset}px)` }}
              >
                <button
                  id={`duo-level-btn-${levelNum}`}
                  disabled={isLocked}
                  onClick={() => {
                    SoundEffects.playClick();
                    onStartLesson(topic.id, levelNum);
                  }}
                  className={`relative group w-16 h-16 rounded-3xl flex items-center justify-center font-black text-lg transition-all duration-200 active:scale-95 shadow-xl ${
                    isCompleted
                      ? 'bg-amber-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.35)] hover:bg-amber-400'
                      : isCurrent
                      ? 'bg-emerald-500 text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:bg-emerald-400 scale-110 ring-4 ring-emerald-500/30'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border border-slate-300 dark:border-slate-700 cursor-not-allowed'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-7 h-7 stroke-[3]" />
                  ) : isCurrent ? (
                    <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
                  ) : (
                    <Lock className="w-5 h-5 text-slate-400 dark:text-slate-600" />
                  )}

                  {/* Crown indicator for completed levels */}
                  {isCompleted && (
                    <div className="absolute -top-2 -right-1 bg-amber-400 text-slate-950 p-1 rounded-full shadow-md">
                      <Star className="w-3 h-3 fill-slate-950" />
                    </div>
                  )}

                  {/* Current animated badge */}
                  {isCurrent && !isCompleted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.6)] whitespace-nowrap">
                      START
                    </div>
                  )}
                </button>

                {/* Level Title Label */}
                <div className="mt-1 text-center select-none">
                  <span className={`text-[11px] font-extrabold ${isLocked ? 'text-slate-400 dark:text-slate-600' : 'text-slate-600 dark:text-slate-400'}`}>
                    Level {levelNum}
                  </span>
                </div>
              </div>

            </React.Fragment>
          );
        })}

        {/* Final Trophy */}
        <div className="my-10 z-10 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 border-4 border-amber-400 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(245,158,11,0.4)]">
            <Trophy className="w-10 h-10 text-slate-950" />
          </div>
          <span className="mt-2 font-black text-slate-900 dark:text-white text-sm">Surgical Exam Master</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">Complete all 62 levels (620 questions)</span>
        </div>

      </div>
    </div>
  );
};

