import React, { useState, useEffect } from 'react';
import { 
  X, 
  Heart, 
  Flame, 
  Languages, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Sparkles, 
  RotateCcw,
  BookOpen,
  Gauge,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Question, ConfidenceLevel } from '../types';
import { SoundEffects } from '../utils/audio';

interface QuizCardProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  completedCount: number;
  isRepeat?: boolean;
  hearts: number;
  infiniteHearts: boolean;
  combo: number;
  onAnswer: (selectedKey: string, isCorrect: boolean, confidence: ConfidenceLevel) => void;
  onExit: () => void;
  onOpenGlossary: () => void;
  showTranslationByDefault: boolean;
  masteredInSession?: number;
  queuedForRetry?: number;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  questionIndex,
  totalQuestions,
  completedCount,
  isRepeat = false,
  hearts,
  infiniteHearts,
  combo,
  onAnswer,
  onExit,
  onOpenGlossary,
  showTranslationByDefault,
  masteredInSession,
  queuedForRetry
}) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<ConfidenceLevel | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showTranslation, setShowTranslation] = useState<boolean>(showTranslationByDefault);

  // Sync translation toggle if default changes
  useEffect(() => {
    setShowTranslation(showTranslationByDefault);
  }, [showTranslationByDefault]);

  // Reset state when new question loads
  useEffect(() => {
    setSelectedKey(null);
    setConfidence(null);
    setIsSubmitted(false);
  }, [question.id]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitted) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleContinue();
        }
        return;
      }

      // If an option is selected, allow confidence shortcuts (1, 2, 3 or L, M, H)
      if (selectedKey) {
        if (e.key === 'l' || e.key === 'L') {
          e.preventDefault();
          handleSubmit('low');
          return;
        }
        if (e.key === 'm' || e.key === 'M') {
          e.preventDefault();
          handleSubmit('medium');
          return;
        }
        if (e.key === 'h' || e.key === 'H') {
          e.preventDefault();
          handleSubmit('high');
          return;
        }
      }

      const keyMap: Record<string, string> = {
        '1': 'а',
        '2': 'б',
        '3': 'в',
        '4': 'г',
        '5': 'д',
        'a': 'а',
        'b': 'б',
        'c': 'в',
        'd': 'г',
        'e': 'д',
        'A': 'а',
        'B': 'б',
        'C': 'в',
        'D': 'г',
        'E': 'д',
      };

      if (!selectedKey && keyMap[e.key]) {
        const targetOption = question.options.find(o => o.key.toLowerCase() === keyMap[e.key]);
        if (targetOption) {
          SoundEffects.playClick();
          setSelectedKey(targetOption.key);
        }
      } else if (e.key === 'Enter' && selectedKey) {
        e.preventDefault();
        handleSubmit(confidence || 'medium');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitted, selectedKey, confidence, question]);

  const handleSubmit = (chosenConfidence: ConfidenceLevel = 'medium') => {
    if (!selectedKey || isSubmitted) return;

    setConfidence(chosenConfidence);
    const isCorrect = selectedKey.toLowerCase() === question.correctKey.toLowerCase();
    setIsSubmitted(true);

    if (isCorrect) {
      SoundEffects.playCorrect();
    } else {
      SoundEffects.playIncorrect();
    }
  };

  const handleContinue = () => {
    if (!selectedKey) return;
    const isCorrect = selectedKey.toLowerCase() === question.correctKey.toLowerCase();
    onAnswer(selectedKey, isCorrect, confidence || 'medium');
  };

  const isCorrectChoice = isSubmitted && selectedKey?.toLowerCase() === question.correctKey.toLowerCase();
  const isWrongChoice = isSubmitted && !isCorrectChoice;
  const correctOption = question.options.find(o => o.key.toLowerCase() === question.correctKey.toLowerCase());

  return (
    <div className="min-h-[85vh] flex flex-col justify-between max-w-3xl mx-auto px-4 py-4 sm:py-6">
      
      {/* Top Header / Progress bar */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-4 sm:mb-6">
          
          {/* Close button */}
          <button
            id="btn-quiz-exit"
            onClick={() => {
              SoundEffects.playClick();
              onExit();
            }}
            className="p-2 rounded-shape-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
            title="Exit quiz"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Immersive Glowing Progress Bar */}
          <div className="flex-1 h-3.5 bg-surface-container-highest rounded-shape-full overflow-hidden relative shadow-inner">
            <div 
              className="h-full bg-primary rounded-shape-full transition-all duration-300 relative shadow-xs"
              style={{ width: `${Math.min(100, Math.max(5, (completedCount / Math.max(1, totalQuestions)) * 100))}%` }}
            >
              <div className="absolute top-0.5 right-1 w-2 h-1 bg-white/40 rounded-shape-full" />
            </div>
          </div>

          {/* Combo Indicator */}
          {combo > 1 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-shape-full bg-tertiary-container border border-outline-variant/30 text-on-tertiary-container font-black text-label-small shadow-xs">
              <Flame className="w-4 h-4 fill-current text-on-tertiary-container" />
              <span>{combo}</span>
            </div>
          )}

          {/* Hearts Indicator */}
          <div className="flex items-center gap-1 px-3 py-1 rounded-shape-full bg-error-container border border-outline-variant/30 text-on-error-container font-extrabold text-label-medium shadow-xs">
            <Heart className="w-4 h-4 fill-current text-on-error-container" />
            <span>{infiniteHearts ? '∞' : hearts}</span>
          </div>

          {/* Translation Quick Toggle */}
          <button
            id="btn-quiz-toggle-lang"
            onClick={() => {
              SoundEffects.playClick();
              setShowTranslation(!showTranslation);
            }}
            className={`p-2 rounded-shape-full transition-all ${
              showTranslation
                ? 'bg-secondary-container text-on-secondary-container border border-outline-variant/40 shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }`}
            title="Toggle English Translation"
          >
            <Languages className="w-5 h-5" />
          </button>

          {/* Glossary helper */}
          <button
            id="btn-quiz-open-glossary"
            onClick={() => {
              SoundEffects.playClick();
              onOpenGlossary();
            }}
            className="p-2 rounded-shape-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
            title="Open Medical Glossary"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

        </div>

        {/* Successive Relearning Queue Status (Higham et al., Rawson & Dunlosky) */}
        {(masteredInSession !== undefined || queuedForRetry !== undefined) && (
          <div className="flex items-center justify-between text-label-small font-bold text-on-surface-variant mb-3 px-1">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              <span>{masteredInSession ?? 0} of {totalQuestions} mastered this session</span>
            </span>
            {(queuedForRetry ?? 0) > 0 ? (
              <span className="flex items-center gap-1.5 text-on-tertiary-container font-extrabold bg-tertiary-container px-2 py-0.5 rounded-shape-xs border border-outline-variant/30">
                <RotateCcw className="w-3 h-3" />
                <span>{queuedForRetry} queued for retry</span>
              </span>
            ) : (
              <span className="text-primary font-semibold">
                ✓ All items mastered this session
              </span>
            )}
          </div>
        )}

        {/* Repeat Question Badge */}
        {isRepeat && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-shape-full bg-tertiary-container border border-outline-variant/40 text-on-tertiary-container text-label-small font-bold mb-3 shadow-xs animate-in fade-in slide-in-from-top-1 duration-200">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Mistake Repeat • Answer correctly to master this level!</span>
          </div>
        )}

        {/* Question Metadata Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-2.5 py-0.5 rounded-shape-xs bg-surface-container-high border border-outline-variant/50 text-on-surface font-black text-label-small tracking-wider">
            QUESTION {question.number} / {totalQuestions > 600 ? 620 : totalQuestions}
          </span>
          <span className="px-2 py-0.5 rounded-shape-xs bg-primary-container border border-outline-variant/40 text-on-primary-container font-bold text-label-small">
            {question.topicId.toUpperCase()}
          </span>
          <span className="px-2 py-0.5 rounded-shape-xs bg-secondary-container border border-outline-variant/40 text-on-secondary-container font-bold text-label-small">
            {completedCount}/{totalQuestions} Mastered
          </span>
          {question.page && (
            <span className="px-2 py-0.5 rounded-shape-xs bg-surface-container border border-outline-variant/30 text-on-surface-variant font-medium text-label-small">
              Page {question.page}
            </span>
          )}
        </div>

        {/* Russian Question Card (Expressive shape-xl container) */}
        <div className="p-5 sm:p-6 rounded-shape-xl bg-surface-container-low border border-outline-variant/40 shadow-sm mb-4 transition-colors">
          <div className="text-on-surface font-bold text-title-large sm:text-headline-small leading-relaxed tracking-tight whitespace-pre-line">
            {question.questionRu}
          </div>

          {/* English Translation (Instant Study Aid - nested shape-md) */}
          {showTranslation && (question.questionEn || question.keywordsEn) && (
            <div className="mt-3 pt-3 border-t border-outline-variant/30 text-on-surface-variant font-medium text-body-medium sm:text-body-large leading-relaxed bg-surface-container border border-outline-variant/40 p-3 rounded-shape-md">
              <span className="text-label-small font-black uppercase tracking-wider text-secondary block mb-0.5">
                English Translation / Key Clinical Meaning:
              </span>
              {question.questionEn || question.keywordsEn?.join(', ')}
            </div>
          )}
        </div>

        {/* MCQ Answer Options (Expressive shape-lg containers with spring animated feedback) */}
        <div className="grid grid-cols-1 gap-3">
          {question.options.map((opt, idx) => {
            const isSelected = selectedKey?.toLowerCase() === opt.key.toLowerCase();
            const isThisCorrect = isSubmitted && opt.key.toLowerCase() === question.correctKey.toLowerCase();
            const isThisWrong = isSubmitted && isSelected && !isThisCorrect;

            let cardStyles = "bg-surface-container-lowest border border-outline-variant/50 text-on-surface hover:border-outline hover:bg-surface-container-low shadow-xs";
            let badgeStyles = "bg-surface-container-high border-outline-variant/60 text-on-surface-variant";

            if (!isSubmitted) {
              if (isSelected) {
                cardStyles = "bg-secondary-container/70 border-2 border-secondary text-on-secondary-container shadow-xs";
                badgeStyles = "bg-secondary border-secondary text-on-secondary font-black shadow-xs";
              }
            } else {
              if (isThisCorrect) {
                cardStyles = "bg-primary-container border-2 border-primary text-on-primary-container shadow-md";
                badgeStyles = "bg-primary border-primary text-on-primary font-black shadow-xs";
              } else if (isThisWrong) {
                cardStyles = "bg-error-container border-2 border-error text-on-error-container shadow-md";
                badgeStyles = "bg-error border-error text-on-error font-black shadow-xs";
              } else {
                cardStyles = "bg-surface-container-lowest/50 border border-outline-variant/30 text-on-surface-variant/50 opacity-50";
                badgeStyles = "bg-surface-container border-outline-variant/30 text-on-surface-variant/40";
              }
            }

            return (
              <motion.div
                key={`opt-${opt.key}`}
                id={`quiz-option-${opt.key}`}
                onClick={() => {
                  if (isSubmitted) return;
                  SoundEffects.playClick();
                  setSelectedKey(opt.key);
                }}
                whileHover={{ scale: isSubmitted ? 1 : 1.008 }}
                whileTap={{ scale: isSubmitted ? 1 : 0.992 }}
                animate={
                  isThisCorrect
                    ? { scale: [1, 1.025, 1], transition: { duration: 0.45, ease: [0.2, 0, 0, 1] } }
                    : isThisWrong
                    ? { x: [0, -8, 8, -5, 5, 0], transition: { duration: 0.4, ease: [0.2, 0, 0, 1] } }
                    : isSelected && !isSubmitted
                    ? { scale: 1.01 }
                    : { scale: 1 }
                }
                className={`p-4 rounded-shape-lg cursor-pointer transition-colors duration-300 ease-[cubic-bezier(0.2,0,0,1)] flex items-start gap-3.5 select-none ${cardStyles}`}
              >
                {/* Letter Badge (А, Б, В, Г, Д) - nested shape-sm */}
                <div className={`w-8 h-8 rounded-shape-sm border flex items-center justify-center font-black text-sm uppercase shrink-0 transition-colors duration-300 ease-[cubic-bezier(0.2,0,0,1)] shadow-xs ${badgeStyles}`}>
                  {opt.key}
                </div>

                {/* Option Text */}
                <div className="flex-1 pt-0.5">
                  <div className="font-bold text-body-large leading-snug">
                    {opt.textRu}
                  </div>
                  {showTranslation && opt.textEn && (
                    <div className="text-body-medium font-medium text-on-surface-variant mt-1">
                      {opt.textEn}
                    </div>
                  )}
                </div>

                {/* Keyboard shortcut indicator */}
                <div className="hidden sm:block text-[11px] font-bold text-on-surface-variant/70 border border-outline-variant/50 px-1.5 py-0.5 rounded-shape-xs self-center">
                  {idx + 1}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Sticky Bottom Action Drawer (Expressive rounded-b-shape-xl with spring feedback) */}
      <motion.div 
        layout
        className={`mt-6 pt-4 border-t transition-colors duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
          isSubmitted
            ? isCorrectChoice
              ? 'bg-primary-container/60 border-primary/40 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 p-4 sm:p-6 rounded-b-shape-xl shadow-lg'
              : 'bg-error-container/60 border-error/40 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 p-4 sm:p-6 rounded-b-shape-xl shadow-lg'
            : 'bg-transparent border-outline-variant/40'
        }`}
      >
        
        {/* State 1: Before Submission */}
        {!isSubmitted ? (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex-1">
              {selectedKey ? (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-label-small font-black uppercase tracking-wider text-on-surface flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-secondary" />
                    <span>Rate Confidence Before Reveal:</span>
                  </span>
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      id="btn-confidence-low"
                      onClick={() => handleSubmit('low')}
                      className="px-3 py-1.5 rounded-shape-full border border-outline-variant bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-label-small font-bold transition-all active:scale-95 flex items-center gap-1 shadow-xs"
                      title="Shortcut: L"
                    >
                      <span>Low (Guess)</span>
                      <kbd className="text-[10px] text-on-surface-variant font-mono hidden sm:inline">L</kbd>
                    </button>
                    <button
                      type="button"
                      id="btn-confidence-medium"
                      onClick={() => handleSubmit('medium')}
                      className="px-3 py-1.5 rounded-shape-full border border-secondary/40 bg-secondary-container hover:bg-secondary-container/80 text-on-secondary-container text-label-small font-bold transition-all active:scale-95 flex items-center gap-1 shadow-xs"
                      title="Shortcut: M"
                    >
                      <span>Medium</span>
                      <kbd className="text-[10px] text-on-secondary-container font-mono hidden sm:inline">M</kbd>
                    </button>
                    <button
                      type="button"
                      id="btn-confidence-high"
                      onClick={() => handleSubmit('high')}
                      className="px-3 py-1.5 rounded-shape-full border border-primary/40 bg-primary-container hover:bg-primary-container/80 text-on-primary-container text-label-small font-extrabold transition-all active:scale-95 flex items-center gap-1 shadow-xs"
                      title="Shortcut: H"
                    >
                      <span>High (Sure)</span>
                      <kbd className="text-[10px] text-on-primary-container font-mono hidden sm:inline">H</kbd>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-label-small text-on-surface-variant font-medium hidden sm:block">
                  Press <kbd className="px-1.5 py-0.5 bg-surface-container border border-outline-variant rounded-shape-xs font-bold text-on-surface">1-5</kbd> to select, then pick confidence to reveal
                </div>
              )}
            </div>

            <button
              id="btn-quiz-check"
              disabled={!selectedKey}
              onClick={() => handleSubmit(confidence || 'medium')}
              className={`w-full sm:w-auto min-w-[150px] px-6 py-3.5 rounded-shape-full font-black text-label-large tracking-wide uppercase transition-all duration-200 active:scale-95 ${
                selectedKey
                  ? 'bg-primary hover:opacity-95 text-on-primary shadow-xs cursor-pointer'
                  : 'bg-surface-container-highest text-on-surface-variant/40 border border-outline-variant/30 cursor-not-allowed'
              }`}
            >
              Reveal Answer
            </button>
          </div>
        ) : isCorrectChoice ? (
          /* State 2: Correct Answer Drawer */
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <motion.div 
                initial={{ scale: 0.6, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                className="w-12 h-12 rounded-shape-lg bg-primary text-on-primary flex items-center justify-center shadow-xs shrink-0"
              >
                <CheckCircle2 className="w-7 h-7 stroke-[3]" />
              </motion.div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-title-large font-black text-on-primary-container leading-tight">
                    Excellent! Правильно!
                  </h4>
                  {confidence === 'high' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-shape-xs bg-primary text-on-primary text-[10px] font-black uppercase tracking-wider">
                      <ShieldCheck className="w-3 h-3" /> Well Calibrated
                    </span>
                  ) : confidence === 'low' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-shape-xs bg-tertiary-container text-on-tertiary-container text-[10px] font-black uppercase tracking-wider">
                      <Sparkles className="w-3 h-3" /> Lucky Guess (Reinforcing)
                    </span>
                  ) : null}
                </div>
                <p className="text-label-medium font-bold text-on-primary-container/90 mt-0.5">
                  +10 XP {combo > 1 ? `• 🔥 Combo x${combo}` : ''}
                </p>
                {(question.explanationEn || question.explanation) && (
                  <p className="text-body-small text-on-primary-container/80 font-medium mt-0.5 line-clamp-2">
                    {question.explanationEn || question.explanation}
                  </p>
                )}
              </div>
            </div>

            <button
              id="btn-quiz-continue-correct"
              onClick={handleContinue}
              className="w-full sm:w-auto min-w-[180px] px-8 py-3.5 rounded-shape-full font-black text-label-large tracking-wide uppercase bg-primary hover:opacity-95 text-on-primary shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* State 3: Incorrect Answer Drawer */
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <motion.div 
                initial={{ scale: 0.6, rotate: 15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                className="w-12 h-12 rounded-shape-lg bg-error text-on-error flex items-center justify-center shadow-xs shrink-0 mt-0.5"
              >
                <XCircle className="w-7 h-7 stroke-[3]" />
              </motion.div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-title-large font-black text-on-error-container leading-tight">
                    Correct Answer: ({question.correctKey.toUpperCase()})
                  </h4>
                  {confidence === 'high' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-shape-xs bg-error text-on-error text-[11px] font-black uppercase tracking-wider animate-pulse">
                      <AlertTriangle className="w-3.5 h-3.5" /> Clinical Danger Signal
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-shape-xs bg-error-container text-on-error-container border border-outline-variant/30 text-[10px] font-bold">
                      Confidence: {confidence || 'medium'}
                    </span>
                  )}
                </div>

                {confidence === 'high' && (
                  <p className="text-label-small font-black text-on-error-container mt-1 bg-error-container/80 px-2.5 py-1 rounded-shape-sm border border-outline-variant/40">
                    High certainty on a wrong diagnosis. Flagged as highest priority for spaced review!
                  </p>
                )}

                <p className="text-body-medium font-bold text-on-surface mt-1">
                  {correctOption?.textRu}
                </p>
                {correctOption?.textEn && (
                  <p className="text-body-small font-medium text-on-surface-variant mt-0.5">
                    {correctOption.textEn}
                  </p>
                )}
                {(question.explanationEn || question.explanation) && (
                  <p className="text-body-small text-on-surface-variant font-medium mt-1">
                    💡 {question.explanationEn || question.explanation}
                  </p>
                )}
                <div className="flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-shape-sm bg-surface-container border border-outline-variant/40 text-on-surface-variant text-label-small font-bold w-fit">
                  <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                  <span>Will repeat at the end of this level until mastered</span>
                </div>
              </div>
            </div>

            <button
              id="btn-quiz-continue-wrong"
              onClick={handleContinue}
              className="w-full sm:w-auto min-w-[180px] px-8 py-3.5 rounded-shape-full font-black text-label-large tracking-wide uppercase bg-error hover:opacity-95 text-on-error shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Got It</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </motion.div>

    </div>
  );
};
