import React, { useState, useMemo } from 'react';
import { RotateCcw, Play, Trash2, Calendar, Clock, Bookmark, Layers, CheckCircle2, ArrowRight, Shuffle, Sparkles, AlertTriangle } from 'lucide-react';
import { Question, SpacedRepetitionItem, UserProgress } from '../types';
import { SoundEffects } from '../utils/audio';
import { formatDateKey, getSrsStatusInfo, isSrsDue } from '../utils/spacedRepetition';
import { interleaveQuestions } from '../utils/interleavedPractice';
import { sortQuestionsByMetacognitivePriority } from '../utils/calibration';

interface MistakesReviewModalProps {
  mistakes: number[];
  bookmarkedQuestions?: number[];
  spacedRepetition?: Record<number, SpacedRepetitionItem>;
  history?: UserProgress['history'];
  allQuestions: Question[];
  onStartReview: (questionIds?: number[], title?: string, isInterleaved?: boolean) => void;
  onClearMistakes: () => void;
  onClose?: () => void;
}

type ViewFilter = 'due' | 'all-mistakes' | 'bookmarks';
type PracticeMode = 'interleaved' | 'blocked';

export const MistakesReviewModal: React.FC<MistakesReviewModalProps> = ({
  mistakes,
  bookmarkedQuestions = [],
  spacedRepetition = {},
  history = {},
  allQuestions,
  onStartReview,
  onClearMistakes,
  onClose: _onClose
}) => {
  const [activeTab, setActiveTab] = useState<ViewFilter>('due');
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('interleaved');
  const todayKey = useMemo(() => formatDateKey(), []);

  // Combined pool of candidate review questions (mistakes + bookmarks + any existing SRS scheduled items)
  const candidateIds = useMemo(() => {
    const set = new Set<number>([
      ...mistakes,
      ...bookmarkedQuestions,
      ...Object.keys(spacedRepetition).map(Number)
    ]);
    return Array.from(set);
  }, [mistakes, bookmarkedQuestions, spacedRepetition]);

  // Questions that are due on or before today
  const dueQuestionIds = useMemo(() => {
    return candidateIds.filter(id => {
      const srsItem = spacedRepetition[id];
      if (!srsItem) {
        // If it's in mistakes, it defaults to due today
        return mistakes.includes(id);
      }
      return isSrsDue(srsItem, todayKey);
    });
  }, [candidateIds, spacedRepetition, mistakes, todayKey]);

  // Filter questions depending on selected tab
  const displayedQuestionIds = useMemo(() => {
    if (activeTab === 'due') {
      return dueQuestionIds;
    }
    if (activeTab === 'bookmarks') {
      return bookmarkedQuestions;
    }
    return mistakes;
  }, [activeTab, dueQuestionIds, bookmarkedQuestions, mistakes]);

  const displayedQuestions = useMemo(() => {
    const prioritizedIds = sortQuestionsByMetacognitivePriority(displayedQuestionIds, history, spacedRepetition);
    const qMap = new Map(allQuestions.map(q => [q.id, q]));
    return prioritizedIds.map(id => qMap.get(id)!).filter(Boolean);
  }, [allQuestions, displayedQuestionIds, history, spacedRepetition]);

  const handleStartReview = (idsToReview: number[], baseTitle: string) => {
    SoundEffects.playClick();
    const idSet = new Set(idsToReview);
    const subsetQuestions = allQuestions.filter(q => idSet.has(q.id));

    if (practiceMode === 'interleaved') {
      const interleaved = interleaveQuestions(subsetQuestions, { prioritizeConfused: true });
      const orderedIds = interleaved.map(q => q.id);
      onStartReview(orderedIds, `${baseTitle} (Interleaved)`, true);
    } else {
      // Prioritize high-confidence misconceptions first even in blocked mode
      const prioritizedIds = sortQuestionsByMetacognitivePriority(idsToReview, history, spacedRepetition);
      onStartReview(prioritizedIds, `${baseTitle} (Prioritized)`, false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#161A23] border border-rose-500/30 shadow-xl mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-extrabold text-xs uppercase tracking-wider mb-2">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Spaced-Repetition Scheduler</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Retention & Mistakes Review
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1 max-w-xl">
              SM-2 Leitner spaced-repetition surfaces items ready for memory reinforcement. Correct answers expand intervals (1d → 3d → 7d → 14d → 28d); incorrect answers reset for rapid recall.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {dueQuestionIds.length > 0 && (
              <button
                id="btn-practice-due-interleaved"
                onClick={() => handleStartReview(dueQuestionIds, 'Due Spaced Review')}
                className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 active:scale-95 text-white font-black text-sm uppercase tracking-wide shadow-[0_0_20px_rgba(244,63,94,0.35)] flex items-center justify-center gap-2 transition-all"
              >
                {practiceMode === 'interleaved' ? <Shuffle className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                <span>Practice Due ({dueQuestionIds.length})</span>
              </button>
            )}

            {mistakes.length > 0 && (
              <button
                id="btn-practice-all-mistakes"
                onClick={() => handleStartReview(mistakes, 'All Mistakes Review')}
                className="flex-1 sm:flex-none px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-[#0F1218] hover:bg-slate-200 dark:hover:bg-slate-800 active:scale-95 text-slate-800 dark:text-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition-all"
                title="Practice entire mistakes list"
              >
                <span>Practice All ({mistakes.length})</span>
              </button>
            )}

            {mistakes.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm("Clear all mistakes from queue?")) {
                    onClearMistakes();
                  }
                }}
                className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#0F1218] text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                title="Clear mistakes list"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Practice Mode Selector & Citation */}
        <div className="mb-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Review Ordering:
            </span>
            <div className="inline-flex p-1 rounded-xl bg-slate-200 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700">
              <button
                type="button"
                id="btn-mode-interleaved"
                onClick={() => {
                  SoundEffects.playClick();
                  setPracticeMode('interleaved');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  practiceMode === 'interleaved'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Shuffle className="w-3 h-3" />
                <span>Interleaved (Mixed)</span>
              </button>
              <button
                type="button"
                id="btn-mode-blocked"
                onClick={() => {
                  SoundEffects.playClick();
                  setPracticeMode('blocked');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  practiceMode === 'blocked'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>Blocked (By Topic)</span>
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>
              {practiceMode === 'interleaved'
                ? 'Interleaved: +50–125% retention (Rohrer & Taylor 2021). Mixes Acute Abdomen & surgical differentials.'
                : 'Blocked: Groups questions sequentially by anatomical chapter.'}
            </span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-800/80">
          <button
            onClick={() => setActiveTab('due')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'due'
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Due Today</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
              activeTab === 'due' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              {dueQuestionIds.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('all-mistakes')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'all-mistakes'
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>All Mistakes</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
              activeTab === 'all-mistakes' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              {mistakes.length}
            </span>
          </button>

          {bookmarkedQuestions.length > 0 && (
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                activeTab === 'bookmarks'
                  ? 'bg-rose-500 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Bookmarked</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeTab === 'bookmarks' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                {bookmarkedQuestions.length}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Questions list */}
      {displayedQuestions.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#161A23] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-3xl mx-auto mb-3">
            ✨
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            {activeTab === 'due' ? 'No Reviews Due Today!' : 'No Questions in this Queue!'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {activeTab === 'due'
              ? 'All spaced-repetition items are mastered or scheduled for future dates. Great job staying on track!'
              : 'You have no questions currently queued in this category.'}
          </p>
          {activeTab === 'due' && mistakes.length > 0 && (
            <button
              onClick={() => setActiveTab('all-mistakes')}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all inline-flex items-center gap-1.5"
            >
              <span>View All {mistakes.length} Saved Mistakes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {displayedQuestions.map((q) => {
            const correctOpt = q.options.find(o => o.key.toLowerCase() === q.correctKey.toLowerCase());
            const srsItem = spacedRepetition[q.id];
            const srsInfo = getSrsStatusInfo(srsItem, todayKey);

            return (
              <div
                key={`srs-question-${q.id}`}
                className="p-5 rounded-2xl bg-white dark:bg-[#161A23] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-black text-xs">
                      #{q.number}
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                      {q.topicId}
                    </span>

                    {/* SRS Status Pill */}
                    {srsInfo.isDue ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-[11px] font-bold">
                        <Clock className="w-3 h-3" />
                        <span>Due Today</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-400 text-[11px] font-bold">
                        <Calendar className="w-3 h-3" />
                        <span>{srsInfo.label} (Interval: {srsInfo.intervalDays}d)</span>
                      </span>
                    )}

                    {srsItem && (srsItem.consecutiveCorrect ?? srsItem.repetitions ?? 0) > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Box {srsInfo.boxLevel} ({srsItem.consecutiveCorrect ?? srsItem.repetitions} streak)</span>
                      </span>
                    )}

                    {/* Metacognitive Confidence Alert */}
                    {history[q.id]?.confidence === 'high' && !history[q.id]?.isCorrect && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider animate-pulse shadow-xs">
                        <AlertTriangle className="w-3 h-3" />
                        <span>High-Confidence Error</span>
                      </span>
                    )}
                    {history[q.id]?.confidence === 'low' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                        <span>Low Confidence Guess</span>
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">
                    {q.questionRu}
                  </h4>
                  {q.questionEn && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                      {q.questionEn}
                    </p>
                  )}
                  <div className="mt-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg inline-block">
                    Correct: ({q.correctKey.toUpperCase()}) {correctOpt?.textRu}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleStartReview([q.id], `Question #${q.number} Review`)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-800 dark:hover:bg-rose-500/15 dark:hover:text-rose-400 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Play className="w-3 h-3" />
                    <span>Practice</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
