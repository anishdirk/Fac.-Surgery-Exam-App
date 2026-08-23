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
  BookOpen
} from 'lucide-react';
import { Question } from '../types';
import { SoundEffects } from '../utils/audio';

interface QuizCardProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  hearts: number;
  infiniteHearts: boolean;
  combo: number;
  onAnswer: (selectedKey: string, isCorrect: boolean) => void;
  onExit: () => void;
  onOpenGlossary: () => void;
  showTranslationByDefault: boolean;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  questionIndex,
  totalQuestions,
  hearts,
  infiniteHearts,
  combo,
  onAnswer,
  onExit,
  onOpenGlossary,
  showTranslationByDefault
}) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showTranslation, setShowTranslation] = useState<boolean>(showTranslationByDefault);

  // Sync translation toggle if default changes
  useEffect(() => {
    setShowTranslation(showTranslationByDefault);
  }, [showTranslationByDefault]);

  // Reset state when new question loads
  useEffect(() => {
    setSelectedKey(null);
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

      if (keyMap[e.key]) {
        const targetOption = question.options.find(o => o.key.toLowerCase() === keyMap[e.key]);
        if (targetOption) {
          SoundEffects.playClick();
          setSelectedKey(targetOption.key);
        }
      } else if (e.key === 'Enter' && selectedKey) {
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitted, selectedKey, question]);

  const handleSubmit = () => {
    if (!selectedKey || isSubmitted) return;

    setIsSubmitted(true);
    const isCorrect = selectedKey.trim().toLowerCase() === question.correctKey.trim().toLowerCase();

    if (isCorrect) {
      if (combo >= 2) {
        SoundEffects.playCombo();
      } else {
        SoundEffects.playCorrect();
      }
    } else {
      SoundEffects.playIncorrect();
    }
  };

  const handleContinue = () => {
    if (!selectedKey) return;
    const isCorrect = selectedKey.trim().toLowerCase() === question.correctKey.trim().toLowerCase();
    onAnswer(selectedKey, isCorrect);
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
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Exit quiz"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Immersive Glowing Progress Bar */}
          <div className="flex-1 h-3.5 bg-slate-800 rounded-full overflow-hidden relative shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300 relative shadow-[0_0_12px_rgba(16,185,129,0.5)]"
              style={{ width: `${Math.max(5, ((questionIndex + 1) / totalQuestions) * 100)}%` }}
            >
              <div className="absolute top-0.5 right-1 w-2 h-1 bg-white/50 rounded-full" />
            </div>
          </div>

          {/* Combo Indicator */}
          {combo > 1 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 font-black text-xs">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{combo}</span>
            </div>
          )}

          {/* Hearts Indicator */}
          <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 font-extrabold text-sm">
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
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
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
            className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
            title="Open Medical Glossary"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

        </div>

        {/* Question Metadata Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 font-black text-xs tracking-wider">
            QUESTION {question.number} / {totalQuestions > 600 ? 620 : totalQuestions}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
            {question.topicId.toUpperCase()}
          </span>
          {question.page && (
            <span className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-400 font-medium text-xs">
              Page {question.page}
            </span>
          )}
        </div>

        {/* Russian Question Card */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#161A23] border border-slate-800 shadow-xl mb-4">
          <div className="text-white font-bold text-base sm:text-lg leading-relaxed tracking-tight whitespace-pre-line">
            {question.questionRu}
          </div>

          {/* English Translation (Instant Study Aid) */}
          {showTranslation && (question.questionEn || question.keywordsEn) && (
            <div className="mt-3 pt-3 border-t border-slate-800 text-sky-200 font-medium text-sm sm:text-base leading-relaxed bg-sky-950/30 border border-sky-500/20 p-3 rounded-2xl">
              <span className="text-[10px] font-black uppercase tracking-wider text-sky-400 block mb-0.5">
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

            let cardStyles = "bg-[#0F1218] border border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-[#161A23] shadow-xs";
            let badgeStyles = "bg-slate-800 border-slate-700 text-slate-400";

            if (!isSubmitted) {
              if (isSelected) {
                cardStyles = "bg-sky-500/15 border-2 border-sky-500 text-white shadow-[0_0_20px_rgba(14,165,233,0.2)]";
                badgeStyles = "bg-sky-500 border-sky-400 text-white shadow-[0_0_10px_rgba(14,165,233,0.4)]";
              }
            } else {
              if (isThisCorrect) {
                cardStyles = "bg-emerald-500/20 border-2 border-emerald-500 text-white shadow-[0_0_25px_rgba(16,185,129,0.3)]";
                badgeStyles = "bg-emerald-500 border-emerald-400 text-slate-950 font-black shadow-[0_0_15px_rgba(16,185,129,0.5)]";
              } else if (isThisWrong) {
                cardStyles = "bg-rose-500/20 border-2 border-rose-500 text-white shadow-[0_0_25px_rgba(244,63,94,0.3)]";
                badgeStyles = "bg-rose-500 border-rose-400 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)]";
              } else {
                cardStyles = "bg-[#0F1218]/40 border border-slate-800/60 text-slate-500 opacity-50";
                badgeStyles = "bg-slate-900 border-slate-800 text-slate-600";
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
                    <div className="text-xs sm:text-sm font-medium text-slate-400 mt-1">
                      {opt.textEn}
                    </div>
                  )}
                </div>

                {/* Keyboard shortcut indicator */}
                <div className="hidden sm:block text-[11px] font-bold text-slate-500 border border-slate-800 px-1.5 py-0.5 rounded-md self-center">
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
            ? 'bg-emerald-950/40 border-emerald-500/30 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 p-4 sm:p-6 rounded-b-3xl'
            : 'bg-rose-950/40 border-rose-500/30 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 p-4 sm:p-6 rounded-b-3xl'
          : 'bg-transparent border-slate-800'
      }`}>
        
        {/* State 1: Before Submission */}
        {!isSubmitted ? (
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs text-slate-400 font-medium hidden sm:block">
              Press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded font-bold text-slate-300">1-5</kbd> to select, <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded font-bold text-slate-300">Enter</kbd> to check
            </div>
            <button
              id="btn-quiz-check"
              disabled={!selectedKey}
              onClick={handleSubmit}
              className={`w-full sm:w-auto min-w-[180px] px-8 py-3.5 rounded-2xl font-black text-sm tracking-wide uppercase transition-all duration-150 active:scale-95 ${
                selectedKey
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.35)] cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              Check Answer
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
                <h4 className="text-lg font-black text-emerald-400 leading-tight">
                  Excellent! Правильно!
                </h4>
                <p className="text-xs font-bold text-emerald-300">
                  +10 XP {combo > 1 ? `• 🔥 Combo x${combo}` : ''}
                </p>
                {(question.explanationEn || question.explanation) && (
                  <p className="text-xs text-emerald-200 font-medium mt-0.5 line-clamp-2">
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
                <h4 className="text-lg font-black text-rose-400 leading-tight">
                  Correct Answer: ({question.correctKey.toUpperCase()})
                </h4>
                <p className="text-sm font-bold text-rose-200 mt-0.5">
                  {correctOption?.textRu}
                </p>
                {correctOption?.textEn && (
                  <p className="text-xs font-medium text-rose-300 mt-0.5">
                    {correctOption.textEn}
                  </p>
                )}
                {(question.explanationEn || question.explanation) && (
                  <p className="text-xs text-slate-300 font-medium mt-1">
                    💡 {question.explanationEn || question.explanation}
                  </p>
                )}
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
