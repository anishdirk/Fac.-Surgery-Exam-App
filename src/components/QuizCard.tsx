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
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Exit quiz"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Immersive Glowing Progress Bar */}
          <div className="flex-1 h-3.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300 relative shadow-[0_0_12px_rgba(16,185,129,0.5)]"
              style={{ width: `${Math.min(100, Math.max(5, (completedCount / Math.max(1, totalQuestions)) * 100))}%` }}
            >
              <div className="absolute top-0.5 right-1 w-2 h-1 bg-white/50 rounded-full" />
            </div>
          </div>

          {/* Combo Indicator */}
          {combo > 1 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-black text-xs">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{combo}</span>
            </div>
          )}

          {/* Hearts Indicator */}
          <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-extrabold text-sm">
            <Heart className="w-4 h-4 fill-rose-400 text-rose-400" />
            <span>{infiniteHearts ? '∞' : hearts}</span>
          </div>

          {/* Translation Quick Toggle */}
          <button
            id="btn-quiz-toggle-lang"
            onClick={() => {
              SoundEffects.playClick();
              setShowTranslation(!showTranslation);
            }}
            className={`p-2 rounded-xl transition-all ${
              showTranslation
                ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/40 shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                : 'text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
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
            className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors"
            title="Open Medical Glossary"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

        </div>

        {/* Successive Relearning Queue Status (Higham et al., Rawson & Dunlosky) */}
        {(masteredInSession !== undefined || queuedForRetry !== undefined) && (
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 px-1">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{masteredInSession ?? 0} of {totalQuestions} mastered this session</span>
            </span>
            {(queuedForRetry ?? 0) > 0 ? (
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-extrabold bg-amber-500/10 dark:bg-amber-500/20 px-2 py-0.5 rounded-lg border border-amber-500/30">
                <RotateCcw className="w-3 h-3" />
                <span>{queuedForRetry} queued for retry</span>
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                ✓ All items mastered this session
              </span>
            )}
          </div>
        )}

        {/* Repeat Question Badge */}
        {isRepeat && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold mb-3 shadow-[0_0_12px_rgba(245,158,11,0.15)] animate-in fade-in slide-in-from-top-1 duration-200">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Mistake Repeat • Answer correctly to master this level!</span>
          </div>
        )}

        {/* Question Metadata Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-black text-xs tracking-wider">
            QUESTION {question.number} / {totalQuestions > 600 ? 620 : totalQuestions}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
            {question.topicId.toUpperCase()}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-sky-500/15 border border-sky-500/30 text-sky-700 dark:text-sky-400 font-bold text-xs">
            {completedCount}/{totalQuestions} Mastered
          </span>
          {question.page && (
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 font-medium text-xs">
              Page {question.page}
            </span>
          )}
        </div>

        {/* Russian Question Card */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#161A23] border border-slate-200 dark:border-slate-800 shadow-xl mb-4 transition-colors">
          <div className="text-slate-900 dark:text-white font-bold text-base sm:text-lg leading-relaxed tracking-tight whitespace-pre-line">
            {question.questionRu}
          </div>

          {/* English Translation (Instant Study Aid) */}
          {showTranslation && (question.questionEn || question.keywordsEn) && (
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-sky-900 dark:text-sky-200 font-medium text-sm sm:text-base leading-relaxed bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-500/20 p-3 rounded-2xl">
              <span className="text-[10px] font-black uppercase tracking-wider text-sky-600 dark:text-sky-400 block mb-0.5">
                English Translation / Key Clinical Meaning:
              </span>
              {question.questionEn || question.keywordsEn?.join(', ')}
            </div>
          )}
        </div>

        {/* MCQ Answer Options */}
        <div className="grid grid-cols-1 gap-3">
          {question.options.map((opt, idx) => {
            const isSelected = selectedKey?.toLowerCase() === opt.key.toLowerCase();
            const isThisCorrect = isSubmitted && opt.key.toLowerCase() === question.correctKey.toLowerCase();
            const isThisWrong = isSubmitted && isSelected && !isThisCorrect;

            let cardStyles = "bg-white dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-[#161A23] shadow-xs";
            let badgeStyles = "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400";

            if (!isSubmitted) {
              if (isSelected) {
                cardStyles = "bg-sky-50 dark:bg-sky-500/15 border-2 border-sky-500 text-slate-900 dark:text-white shadow-[0_0_20px_rgba(14,165,233,0.2)]";
                badgeStyles = "bg-sky-500 border-sky-400 text-white shadow-[0_0_10px_rgba(14,165,233,0.4)]";
              }
            } else {
              if (isThisCorrect) {
                cardStyles = "bg-emerald-50 dark:bg-emerald-500/20 border-2 border-emerald-500 text-slate-900 dark:text-white shadow-[0_0_25px_rgba(16,185,129,0.3)]";
                badgeStyles = "bg-emerald-500 border-emerald-400 text-slate-950 font-black shadow-[0_0_15px_rgba(16,185,129,0.5)]";
              } else if (isThisWrong) {
                cardStyles = "bg-rose-50 dark:bg-rose-500/20 border-2 border-rose-500 text-slate-900 dark:text-white shadow-[0_0_25px_rgba(244,63,94,0.3)]";
                badgeStyles = "bg-rose-500 border-rose-400 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)]";
              } else {
                cardStyles = "bg-slate-50 dark:bg-[#0F1218]/40 border border-slate-200 dark:border-slate-800/60 text-slate-400 dark:text-slate-500 opacity-50";
                badgeStyles = "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600";
              }
            }

            return (
              <div
                key={`opt-${opt.key}`}
                id={`quiz-option-${opt.key}`}
                onClick={() => {
                  if (isSubmitted) return;
                  SoundEffects.playClick();
                  setSelectedKey(opt.key);
                }}
                className={`p-4 rounded-2xl cursor-pointer transition-all duration-150 active:scale-[0.99] flex items-start gap-3.5 select-none ${cardStyles}`}
              >
                {/* Letter Badge (А, Б, В, Г, Д) */}
                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center font-black text-sm uppercase shrink-0 transition-colors shadow-xs ${badgeStyles}`}>
                  {opt.key}
                </div>

                {/* Option Text */}
                <div className="flex-1 pt-0.5">
                  <div className="font-bold text-sm sm:text-base leading-snug">
                    {opt.textRu}
                  </div>
                  {showTranslation && opt.textEn && (
                    <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                      {opt.textEn}
                    </div>
                  )}
                </div>

                {/* Keyboard shortcut indicator */}
                <div className="hidden sm:block text-[11px] font-bold text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800 px-1.5 py-0.5 rounded-md self-center">
                  {idx + 1}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Sticky Bottom Action Drawer */}
      <div className={`mt-6 pt-4 border-t transition-all ${
        isSubmitted
          ? isCorrectChoice
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/30 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 p-4 sm:p-6 rounded-b-3xl'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-500/30 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 p-4 sm:p-6 rounded-b-3xl'
          : 'bg-transparent border-slate-200 dark:border-slate-800'
      }`}>
        
        {/* State 1: Before Submission */}
        {!isSubmitted ? (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex-1">
              {selectedKey ? (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Rate Confidence Before Reveal:</span>
                  </span>
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      id="btn-confidence-low"
                      onClick={() => handleSubmit('low')}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all active:scale-95 flex items-center gap-1 shadow-xs"
                      title="Shortcut: L"
                    >
                      <span>Low (Guess)</span>
                      <kbd className="text-[10px] text-slate-400 font-mono hidden sm:inline">L</kbd>
                    </button>
                    <button
                      type="button"
                      id="btn-confidence-medium"
                      onClick={() => handleSubmit('medium')}
                      className="px-3 py-1.5 rounded-xl border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold transition-all active:scale-95 flex items-center gap-1 shadow-xs"
                      title="Shortcut: M"
                    >
                      <span>Medium</span>
                      <kbd className="text-[10px] text-blue-400 font-mono hidden sm:inline">M</kbd>
                    </button>
                    <button
                      type="button"
                      id="btn-confidence-high"
                      onClick={() => handleSubmit('high')}
                      className="px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold transition-all active:scale-95 flex items-center gap-1 shadow-xs"
                      title="Shortcut: H"
                    >
                      <span>High (Sure)</span>
                      <kbd className="text-[10px] text-emerald-500 font-mono hidden sm:inline">H</kbd>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                  Press <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded font-bold text-slate-700 dark:text-slate-300">1-5</kbd> to select, then pick confidence to reveal
                </div>
              )}
            </div>

            <button
              id="btn-quiz-check"
              disabled={!selectedKey}
              onClick={() => handleSubmit(confidence || 'medium')}
              className={`w-full sm:w-auto min-w-[150px] px-6 py-3.5 rounded-2xl font-black text-sm tracking-wide uppercase transition-all duration-150 active:scale-95 ${
                selectedKey
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.35)] cursor-pointer'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-300 dark:border-slate-700 cursor-not-allowed'
              }`}
            >
              Reveal Answer
            </button>
          </div>
        ) : isCorrectChoice ? (
          /* State 2: Correct Answer Drawer */
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] shrink-0">
                <CheckCircle2 className="w-7 h-7 stroke-[3]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-black text-emerald-700 dark:text-emerald-400 leading-tight">
                    Excellent! Правильно!
                  </h4>
                  {confidence === 'high' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 text-[10px] font-black uppercase tracking-wider">
                      <ShieldCheck className="w-3 h-3" /> Well Calibrated
                    </span>
                  ) : confidence === 'low' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-200 text-[10px] font-black uppercase tracking-wider">
                      <Sparkles className="w-3 h-3" /> Lucky Guess (Reinforcing)
                    </span>
                  ) : null}
                </div>
                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 mt-0.5">
                  +10 XP {combo > 1 ? `• 🔥 Combo x${combo}` : ''}
                </p>
                {(question.explanationEn || question.explanation) && (
                  <p className="text-xs text-emerald-900 dark:text-emerald-200 font-medium mt-0.5 line-clamp-2">
                    {question.explanationEn || question.explanation}
                  </p>
                )}
              </div>
            </div>

            <button
              id="btn-quiz-continue-correct"
              onClick={handleContinue}
              className="w-full sm:w-auto min-w-[180px] px-8 py-3.5 rounded-2xl font-black text-sm tracking-wide uppercase bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* State 3: Incorrect Answer Drawer */
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.4)] shrink-0 mt-0.5">
                <XCircle className="w-7 h-7 stroke-[3]" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-lg font-black text-rose-600 dark:text-rose-400 leading-tight">
                    Correct Answer: ({question.correctKey.toUpperCase()})
                  </h4>
                  {confidence === 'high' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-rose-600 text-white text-[11px] font-black uppercase tracking-wider animate-pulse">
                      <AlertTriangle className="w-3.5 h-3.5" /> Clinical Danger Signal
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-200 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 text-[10px] font-bold">
                      Confidence: {confidence || 'medium'}
                    </span>
                  )}
                </div>

                {confidence === 'high' && (
                  <p className="text-xs font-black text-rose-600 dark:text-rose-300 mt-1 bg-rose-500/15 px-2.5 py-1 rounded-lg border border-rose-500/30">
                    High certainty on a wrong diagnosis. Flagged as highest priority for spaced review!
                  </p>
                )}

                <p className="text-sm font-bold text-rose-800 dark:text-rose-200 mt-1">
                  {correctOption?.textRu}
                </p>
                {correctOption?.textEn && (
                  <p className="text-xs font-medium text-rose-700 dark:text-rose-300 mt-0.5">
                    {correctOption.textEn}
                  </p>
                )}
                {(question.explanationEn || question.explanation) && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
                    💡 {question.explanationEn || question.explanation}
                  </p>
                )}
                <div className="flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-500/20 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-200 text-xs font-bold w-fit">
                  <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                  <span>Will repeat at the end of this level until mastered</span>
                </div>
              </div>
            </div>

            <button
              id="btn-quiz-continue-wrong"
              onClick={handleContinue}
              className="w-full sm:w-auto min-w-[180px] px-8 py-3.5 rounded-2xl font-black text-sm tracking-wide uppercase bg-rose-500 hover:bg-rose-400 text-white shadow-[0_0_25px_rgba(244,63,94,0.35)] transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Got It</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
