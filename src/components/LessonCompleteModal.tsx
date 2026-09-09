import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Flame, 
  RotateCcw, 
  ArrowRight, 
  CheckCircle2, 
  Award,
  Trophy
} from 'lucide-react';
import { QuizSession } from '../types';
import { SoundEffects } from '../utils/audio';
import { Modal } from './Modal';

interface LessonCompleteModalProps {
  isOpen?: boolean;
  session: QuizSession;
  onContinue: () => void;
  onReviewMistakes: () => void;
  onRestart: () => void;
}

export const LessonCompleteModal: React.FC<LessonCompleteModalProps> = ({
  isOpen = true,
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
    <Modal isOpen={isOpen} onClose={onContinue} maxWidth="max-w-md" id="lesson-complete-modal">
      <div className="p-6 sm:p-8 text-center flex flex-col">
        {/* Surgical Medical Badge & Trophy */}
        <div className="relative mx-auto w-24 h-24 mb-4 shrink-0">
          <div className="w-24 h-24 rounded-shape-xl bg-tertiary-container border-2 border-outline-variant/30 flex items-center justify-center shadow-xs">
            <Trophy className="w-12 h-12 text-tertiary" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-primary text-on-primary p-2 rounded-shape-full shadow-md">
            <Sparkles className="w-4 h-4 fill-current text-on-primary" />
          </div>
        </div>

        <h2 className="text-headline-medium font-black text-on-surface tracking-tight">
          {accuracy >= 80 ? 'Lesson Mastered!' : 'Practice Finished!'}
        </h2>
        <p className="text-body-medium text-on-surface-variant font-medium mt-1">
          {accuracy >= 80 
            ? 'Superb clinical accuracy! You are mastering Russian surgical concepts.' 
            : 'Good effort! Review your mistakes to reinforce high-yield concepts.'}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 my-6">
          {/* Accuracy */}
          <div className="p-3.5 rounded-shape-lg bg-primary-container border border-outline-variant/30">
            <div className="flex items-center justify-center gap-1 text-primary font-black text-title-large">
              <Award className="w-5 h-5" />
              <span>{accuracy}%</span>
            </div>
            <span className="text-[11px] font-bold text-on-primary-container uppercase tracking-wider block mt-0.5">
              Accuracy
            </span>
          </div>

          {/* XP Gained */}
          <div className="p-3.5 rounded-shape-lg bg-secondary-container border border-outline-variant/30">
            <div className="flex items-center justify-center gap-1 text-secondary font-black text-title-large">
              <Sparkles className="w-5 h-5 fill-current" />
              <span>+{session.xpGained}</span>
            </div>
            <span className="text-[11px] font-bold text-on-secondary-container uppercase tracking-wider block mt-0.5">
              Total XP
            </span>
          </div>

          {/* Max Combo */}
          <div className="p-3.5 rounded-shape-lg bg-tertiary-container border border-outline-variant/30">
            <div className="flex items-center justify-center gap-1 text-tertiary font-black text-title-large">
              <Flame className="w-5 h-5 fill-current" />
              <span>{session.comboMax}</span>
            </div>
            <span className="text-[11px] font-bold text-on-tertiary-container uppercase tracking-wider block mt-0.5">
              Max Combo
            </span>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="flex items-center justify-around py-3 px-4 rounded-shape-lg bg-surface-container border border-outline-variant/30 text-body-small font-bold mb-6">
          <div className="flex items-center gap-1.5 text-primary">
            <CheckCircle2 className="w-4 h-4" />
            <span>{total}/{total} Mastered</span>
          </div>
          <div className="h-4 w-px bg-outline-variant/30" />
          {incorrectCount > 0 ? (
            <div className="flex items-center gap-1.5 text-tertiary">
              <RotateCcw className="w-4 h-4" />
              <span>{incorrectCount} Repeated & Solved</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-primary">
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
            className="w-full py-3.5 rounded-shape-full bg-primary hover:opacity-95 active:scale-95 text-on-primary font-black text-label-large uppercase tracking-wider shadow-xs transition-all flex items-center justify-center gap-2"
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
              className="w-full py-3 rounded-shape-full bg-error-container hover:opacity-90 text-on-error-container font-extrabold text-label-large border border-outline-variant/30 shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-error" />
              <span>Review {incorrectCount} Mistakes Now</span>
            </button>
          )}

          <button
            id="btn-complete-replay"
            onClick={() => {
              SoundEffects.playClick();
              onRestart();
            }}
            className="w-full py-2.5 rounded-shape-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest font-bold text-label-medium transition-colors"
          >
            Replay this lesson
          </button>
        </div>
      </div>
    </Modal>
  );
};
