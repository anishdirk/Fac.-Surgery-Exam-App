import React from 'react';
import { RotateCcw, Play, Trash2 } from 'lucide-react';
import { Question } from '../types';
import { SoundEffects } from '../utils/audio';

interface MistakesReviewModalProps {
  mistakes: number[];
  allQuestions: Question[];
  onStartReview: () => void;
  onClearMistakes: () => void;
  onClose: () => void;
}

export const MistakesReviewModal: React.FC<MistakesReviewModalProps> = ({
  mistakes,
  allQuestions,
  onStartReview,
  onClearMistakes,
  onClose: _onClose
}) => {
  const missedQuestions = allQuestions.filter(q => mistakes.includes(q.id));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#161A23] border border-rose-500/30 shadow-xl mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-extrabold text-xs uppercase tracking-wider mb-2">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Targeted Practice</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Mistakes Review ({mistakes.length})
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
            Questions you answered incorrectly are queued here. Answering correctly removes them.
          </p>
        </div>

        {mistakes.length > 0 && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                SoundEffects.playClick();
                onStartReview();
              }}
              className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-rose-500 hover:bg-rose-400 active:scale-95 text-white font-black text-sm uppercase tracking-wide shadow-[0_0_20px_rgba(244,63,94,0.35)] flex items-center justify-center gap-2 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Practice All {mistakes.length}</span>
            </button>

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
          </div>
        )}
      </div>

      {/* Questions list */}
      {mistakes.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#161A23] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-3xl mx-auto mb-3">
            ✨
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">No Mistakes in Queue!</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            You've mastered all attempted questions or haven't made any mistakes yet. Keep up the great streak!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {missedQuestions.map((q) => {
            const correctOpt = q.options.find(o => o.key.toLowerCase() === q.correctKey.toLowerCase());
            return (
              <div
                key={`mistake-${q.id}`}
                className="p-5 rounded-2xl bg-white dark:bg-[#161A23] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-black text-xs">
                      #{q.number}
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                      {q.topicId}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">
                    {q.questionRu}
                  </h4>
                  {q.questionEn && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                      {q.questionEn}
                    </p>
                  )}
                  <div className="mt-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg inline-block">
                    Correct: ({q.correctKey.toUpperCase()}) {correctOpt?.textRu}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
