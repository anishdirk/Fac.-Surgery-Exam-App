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
      <div className="relative overflow-hidden rounded-shape-xl bg-primary-container text-on-primary-container border border-outline-variant/40 p-6 sm:p-8 mb-8 shadow-sm transition-all">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="max-w-md">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-shape-full bg-surface/80 border border-outline-variant/30 text-label-small font-black tracking-wider uppercase text-on-surface mb-3 shadow-xs">
              <Activity className="w-3.5 h-3.5 text-primary" />
              <span>Surgical Board Mastery</span>
            </div>
            <h1 className="text-headline-medium sm:text-headline-large font-black tracking-tight leading-tight text-on-primary-container">
              Surgical Exam Quest
            </h1>
            <p className="mt-1 text-on-primary-container/80 text-body-medium font-medium">
              620 Official Russian Surgical Questions organized into 62 bite-sized progressive levels.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                id="btn-path-quick-shuffle"
                onClick={() => {
                  SoundEffects.playClick();
                  onStartQuickShuffle();
                }}
                className="px-5 py-2.5 rounded-shape-full bg-primary hover:opacity-95 active:scale-95 text-on-primary font-black text-label-large shadow-xs transition-all flex items-center gap-2"
              >
                <Shuffle className="w-4 h-4 text-on-primary" />
                <span>Shuffle Practice (10 Qs)</span>
              </button>

              <button
                id="btn-path-exam-mode"
                onClick={() => {
                  SoundEffects.playClick();
                  onOpenExam();
                }}
                className="px-5 py-2.5 rounded-shape-full bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/50 text-on-surface font-bold text-label-large shadow-xs active:scale-95 transition-all flex items-center gap-2"
              >
                <Trophy className="w-4 h-4 text-tertiary" />
                <span>Simulate Exam</span>
              </button>
            </div>
          </div>

          {/* Progress Card */}
          <div className="w-full sm:w-auto min-w-[220px] p-4 rounded-shape-lg bg-surface-container-lowest text-on-surface border border-outline-variant/40 flex flex-col gap-2 shadow-xs backdrop-blur-xs">
            <div className="flex items-center justify-between text-label-medium font-bold text-on-surface-variant">
              <span>Overall Completion</span>
              <span className="text-title-medium text-primary font-extrabold">{Math.round((completedQuestionsCount / 620) * 100)}%</span>
            </div>
            <div className="w-full h-3 rounded-shape-full bg-surface-container-highest overflow-hidden border border-outline-variant/30">
              <div 
                className="h-full bg-primary rounded-shape-full transition-all duration-500 shadow-xs"
                style={{ width: `${Math.min(100, (completedQuestionsCount / 620) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-body-small text-on-surface-variant font-medium mt-1">
              <span>{completedQuestionsCount} / 620 Questions</span>
              <span className="text-label-large text-secondary font-bold">{progress.totalXp || progress.xp || 0} XP</span>
            </div>
          </div>
        </div>

        {/* Surgical Stethoscope decoration watermark (replaced owl) */}
        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none select-none text-on-primary-container">
          <Stethoscope className="w-44 h-44 -rotate-12" />
        </div>
      </div>

      {/* Winding Learning Path */}
      <div className="relative py-4 flex flex-col items-center">
        
        {/* Continuous background path line */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-3 bg-surface-container-highest rounded-shape-full -z-0" />

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
                  <div className={`p-4 rounded-shape-lg border shadow-xs flex items-center justify-between transition-all ${
                    isLocked 
                      ? 'bg-surface-container-low border-outline-variant/40 text-on-surface-variant/40' 
                      : 'bg-surface-container border-outline-variant/60 text-on-surface'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-shape-sm bg-primary-container text-on-primary-container border border-outline-variant/30 flex items-center justify-center text-xl">
                        {topic.icon}
                      </div>
                      <div>
                        <div className="text-label-small font-black uppercase tracking-wider text-primary">
                          Unit {topic.order} • Questions {topic.questionRange[0]}–{topic.questionRange[1]}
                        </div>
                        <h3 className="font-extrabold text-title-medium leading-tight text-on-surface">
                          {topic.titleEn}
                        </h3>
                        <p className="text-body-small text-on-surface-variant line-clamp-1">{topic.titleRu}</p>
                      </div>
                    </div>
                    <div className="text-label-medium font-black text-on-surface-variant">
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
                  className={`relative group w-16 h-16 rounded-shape-full flex items-center justify-center font-black text-lg transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)] active:scale-95 ${
                    isCompleted
                      ? 'bg-primary-container text-on-primary-container border border-outline-variant/40 shadow-xs hover:bg-primary-container/80'
                      : isCurrent
                      ? 'bg-primary text-on-primary shadow-md hover:opacity-95 scale-105 ring-4 ring-primary/25'
                      : 'bg-surface-container-low/40 text-on-surface-variant/40 border-2 border-outline-variant/60 cursor-not-allowed shadow-none'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-7 h-7 stroke-[3] text-on-primary-container" />
                  ) : isCurrent ? (
                    <Play className="w-6 h-6 fill-on-primary text-on-primary ml-0.5" />
                  ) : (
                    <Lock className="w-5 h-5 text-on-surface-variant/40" />
                  )}

                  {/* Crown indicator for completed levels */}
                  {isCompleted && (
                    <div className="absolute -top-2 -right-1 bg-tertiary-container text-on-tertiary-container p-1 rounded-shape-full border border-outline-variant/30 shadow-xs">
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </div>
                  )}

                  {/* Current animated badge */}
                  {isCurrent && !isCompleted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-tertiary text-on-tertiary text-label-small font-black uppercase px-2.5 py-0.5 rounded-shape-full border border-outline-variant/30 shadow-xs whitespace-nowrap">
                      START
                    </div>
                  )}
                </button>

                {/* Level Title Label */}
                <div className="mt-1 text-center select-none">
                  <span className={`text-label-small font-extrabold ${
                    isLocked 
                      ? 'text-on-surface-variant/40' 
                      : isCurrent
                      ? 'text-primary'
                      : 'text-on-surface'
                  }`}>
                    Level {levelNum}
                  </span>
                </div>
              </div>

            </React.Fragment>
          );
        })}

        {/* Final Trophy */}
        <div className="my-10 z-10 flex flex-col items-center">
          <div className="w-20 h-20 rounded-shape-full bg-tertiary-container border-4 border-tertiary text-on-tertiary-container flex items-center justify-center text-4xl shadow-md">
            <Trophy className="w-10 h-10 text-on-tertiary-container" />
          </div>
          <span className="mt-2 font-black text-on-surface text-title-medium">Surgical Exam Master</span>
          <span className="text-body-small text-on-surface-variant">Complete all 62 levels (620 questions)</span>
        </div>

      </div>
    </div>
  );
};

