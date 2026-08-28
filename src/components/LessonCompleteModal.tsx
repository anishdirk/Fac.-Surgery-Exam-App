import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Flame, 
  RotateCcw, 
  ArrowRight, 
  CheckCircle2, 
  Award,
  Trophy,
  Stethoscope
} from 'lucide-react';
import { QuizSession } from '../types';
import { SoundEffects } from '../utils/audio';

interface LessonCompleteModalProps {
  session: QuizSession;
  onContinue: () => void;
  onReviewMistakes: () => void;
  onRestart: () => void;
}

export const LessonCompleteModal: React.FC<LessonCompleteModalProps> = ({
  session,
  onContinue,
  onReviewMistakes,
  onRestart
}) => {
  const total = session.totalQuestions || 10;
  const incorrectCount = session.incorrectAnswers.length;
  const firstPassCorrect = Math.max(0, total - incorrectCount);
  const accuracy = Math.round((firstPassCorrect / total) * 100);

  useEffect(() => {
    // Play celebratory sound
    SoundEffects.playVictory();

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 300);
    } catch (e) {
      console.warn("Confetti failed to run", e);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-[#0A0C10]/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#161A23] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-center animate-in fade-in zoom-in-95 duration-200 transition-colors">
        
        {/* Surgical Medical Badge & Trophy */}
        <div className="relative mx-auto w-24 h-24 mb-4">
          <div className="w-24 h-24 rounded-3xl bg-amber-50 dark:bg-[#0F1218] border-2 border-amber-400/60 dark:border-amber-500/50 flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.25)]">
            <Trophy className="w-12 h-12 text-amber-500" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-2 rounded-full shadow-md">
            <Sparkles className="w-4 h-4 fill-slate-950 text-slate-950" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {accuracy >= 80 ? 'Lesson Mastered!' : 'Practice Finished!'}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
          {accuracy >= 80 
            ? 'Superb clinical accuracy! You are mastering Russian surgical concepts.' 
            : 'Good effort! Review your mistakes to reinforce high-yield concepts.'}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 my-6">
          
          {/* Accuracy */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
            <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 font-black text-xl">
              <Award className="w-5 h-5" />
              <span>{accuracy}%</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block mt-0.5">
              Accuracy
            </span>
          </div>

          {/* XP Gained */}
          <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/30">
            <div className="flex items-center justify-center gap-1 text-sky-600 dark:text-sky-400 font-black text-xl">
              <Sparkles className="w-5 h-5 fill-sky-400" />
              <span>+{session.xpGained}</span>
            </div>
            <span className="text-[11px] font-bold text-sky-700 dark:text-sky-300 uppercase tracking-wider block mt-0.5">
              Total XP
            </span>
          </div>

          {/* Max Combo */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
            <div className="flex items-center justify-center gap-1 text-amber-600 dark:text-amber-400 font-black text-xl">
              <Flame className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span>{session.comboMax}</span>
            </div>
            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider block mt-0.5">
              Max Combo
            </span>
          </div>

        </div>

        {/* Detailed Breakdown */}
        <div className="flex items-center justify-around py-3 px-4 rounded-2xl bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800 text-xs font-bold mb-6">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>{total}/{total} Mastered</span>
          </div>
          <div className="h-4 w-px bg-slate-300 dark:bg-slate-800" />
          {incorrectCount > 0 ? (
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <RotateCcw className="w-4 h-4" />
              <span>{incorrectCount} Repeated & Solved</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span>100% First Try!</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          
          <button
            id="btn-complete-continue"
            onClick={() => {
              SoundEffects.playClick();
              onContinue();
            }}
            className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all flex items-center justify-center gap-2"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {incorrectCount > 0 && (
            <button
              id="btn-complete-review-mistakes"
              onClick={() => {
                SoundEffects.playClick();
                onReviewMistakes();
              }}
              className="w-full py-3 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-700 dark:text-rose-300 font-extrabold text-sm border border-rose-500/40 shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-rose-500 dark:text-rose-400" />
              <span>Review {incorrectCount} Mistakes Now</span>
            </button>
          )}

          <button
            id="btn-complete-replay"
            onClick={() => {
              SoundEffects.playClick();
              onRestart();
            }}
            className="w-full py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition-colors"
          >
            Replay this lesson
          </button>

        </div>

      </div>
    </div>
  );
};
