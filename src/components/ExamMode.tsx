import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clock, 
  Trophy, 
  Play, 
  RotateCcw, 
  Award, 
  AlertTriangle, 
  Languages, 
  ChevronRight, 
  ChevronLeft,
  BookOpen
} from 'lucide-react';
import { Question } from '../types';
import { SoundEffects } from '../utils/audio';

interface ExamModeProps {
  allQuestions: Question[];
  onExit: () => void;
  onRecordResults: (correctCount: number, totalCount: number, xpGained: number) => void;
}

export const ExamMode: React.FC<ExamModeProps> = ({
  allQuestions,
  onExit,
  onRecordResults
}) => {
  // Config state
  const [examQuestionCount, setExamQuestionCount] = useState<number>(30);
  const [examDurationMinutes, setExamDurationMinutes] = useState<number>(30);
  const [isExamActive, setIsExamActive] = useState<boolean>(false);
  const [isExamFinished, setIsExamFinished] = useState<boolean>(false);

  // Active exam state
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({}); // questionId -> selectedKey
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(0);
  const [showTranslations, setShowTranslations] = useState<boolean>(false);

  // Start Exam
  const startExam = (count: number, minutes: number) => {
    // Pick random subset from all 620 questions
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    setExamQuestions(selected);
    setCurrentIndex(0);
    setUserAnswers({});
    setTimeLeftSeconds(minutes * 60);
    setIsExamActive(true);
    setIsExamFinished(false);
    SoundEffects.playClick();
  };

  // Timer countdown
  useEffect(() => {
    if (!isExamActive || isExamFinished) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExamActive, isExamFinished]);

  const finishExam = () => {
    setIsExamFinished(true);
    setIsExamActive(false);
    SoundEffects.playVictory();

    // Calculate score
    let correct = 0;
    examQuestions.forEach(q => {
      if (userAnswers[q.id]?.toLowerCase() === q.correctKey.toLowerCase()) {
        correct++;
      }
    });

    const xpEarned = correct * 15;
    onRecordResults(correct, examQuestions.length, xpEarned);
  };

  // Results calculation
  const stats = useMemo(() => {
    if (!isExamFinished) return { correct: 0, total: 0, percentage: 0 };
    let correct = 0;
    examQuestions.forEach(q => {
      if (userAnswers[q.id]?.toLowerCase() === q.correctKey.toLowerCase()) {
        correct++;
      }
    });
    return {
      correct,
      total: examQuestions.length,
      percentage: Math.round((correct / examQuestions.length) * 100)
    };
  }, [isExamFinished, examQuestions, userAnswers]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // 1. SETUP SCREEN
  if (!isExamActive && !isExamFinished) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#161A23] border border-slate-200 dark:border-slate-800 shadow-xl">
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 dark:text-amber-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                Surgical Board Exam Simulator
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Test your knowledge under timed exam conditions from all 620 official questions.
              </p>
            </div>
          </div>

          <div className="space-y-6 my-6">
            {/* Question count selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Number of Questions:
              </label>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {[15, 30, 50, 100].map(count => (
                  <button
                    key={count}
                    onClick={() => setExamQuestionCount(count)}
                    className={`py-2.5 sm:py-3 px-2 sm:px-3 rounded-2xl font-black text-xs sm:text-sm text-center transition-all ${
                      examQuestionCount === count
                        ? 'bg-amber-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.35)]'
                        : 'bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {count} Questions
                  </button>
                ))}
              </div>
            </div>

            {/* Time limit selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Time Limit:
              </label>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {[15, 30, 45, 60].map(mins => (
                  <button
                    key={mins}
                    onClick={() => setExamDurationMinutes(mins)}
                    className={`py-2.5 sm:py-3 px-2 sm:px-3 rounded-2xl font-black text-xs sm:text-sm text-center transition-all ${
                      examDurationMinutes === mins
                        ? 'bg-amber-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.35)]'
                        : 'bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {mins} Minutes
                  </button>
                ))}
              </div>
            </div>

            {/* Information notice */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
              <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span>Simulation Rules:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-slate-500 dark:text-slate-400">
                <li>Instant answers and explanations are hidden until exam completion.</li>
                <li>You can jump between questions and change answers freely during the exam.</li>
                <li>Passing threshold is 70% accuracy (official Russian medical standard).</li>
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={onExit}
              className="px-5 py-3 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-sm"
            >
              Cancel
            </button>

            <button
              id="btn-start-exam-now"
              onClick={() => startExam(examQuestionCount, examDurationMinutes)}
              className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm uppercase tracking-wide shadow-[0_0_25px_rgba(245,158,11,0.35)] transition-all active:scale-95 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Begin Exam Simulator</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // 2. ACTIVE EXAM RUNNER
  if (isExamActive) {
    const currentQ = examQuestions[currentIndex];
    const answeredCount = Object.keys(userAnswers).length;
    const isUrgent = timeLeftSeconds < 180; // under 3 minutes

    return (
      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
        
        {/* Top Sticky Bar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#161A23] border border-slate-200 dark:border-slate-800 shadow-md mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-sm text-slate-900 dark:text-white">
              Question {currentIndex + 1} of {examQuestions.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ({answeredCount} answered)
            </span>
          </div>

          {/* Countdown Clock */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono font-black text-sm ${
            isUrgent 
              ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/50 animate-pulse' 
              : 'bg-slate-100 dark:bg-[#0F1218] text-amber-600 dark:text-amber-400 border border-slate-200 dark:border-slate-700'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeLeftSeconds)}</span>
          </div>

          {/* Quick controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTranslations(!showTranslations)}
              className={`p-2 rounded-xl text-xs font-bold border transition-colors ${
                showTranslations 
                  ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-600 dark:text-indigo-300' 
                  : 'bg-slate-100 dark:bg-[#0F1218] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Toggle English Translation"
            >
              <Languages className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to finish and submit the exam?")) {
                  finishExam();
                }
              }}
              className="px-4 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500 text-rose-600 hover:text-white dark:text-rose-300 border border-rose-500/40 font-bold text-xs transition-colors"
            >
              Finish & Grade
            </button>
          </div>
        </div>

        {/* Question Palette (Grid of mini numbers to jump directly) */}
        <div className="p-3 rounded-2xl bg-white dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800 mb-4 overflow-x-auto flex items-center gap-1.5 scrollbar-thin">
          {examQuestions.map((q, idx) => {
            const hasAnswered = !!userAnswers[q.id];
            const isSelected = idx === currentIndex;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-7 h-7 rounded-lg text-xs font-extrabold shrink-0 transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                    : hasAnswered
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Active Question Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#161A23] border border-slate-200 dark:border-slate-800 shadow-md mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-black text-xs">
              Original #{currentQ.number}
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase">
              {currentQ.topicId}
            </span>
          </div>

          <p className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg leading-relaxed">
            {currentQ.questionRu}
          </p>

          {showTranslations && (currentQ.questionEn || currentQ.keywordsEn) && (
            <p className="text-sm font-medium text-sky-900 dark:text-sky-200 mt-2 bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-500/20 p-2.5 rounded-xl">
              {currentQ.questionEn || currentQ.keywordsEn?.join(', ')}
            </p>
          )}

          {/* Options */}
          <div className="space-y-3 mt-6">
            {currentQ.options.map(opt => {
              const isSelected = userAnswers[currentQ.id]?.toLowerCase() === opt.key.toLowerCase();

              return (
                <div
                  key={opt.key}
                  onClick={() => {
                    SoundEffects.playClick();
                    setUserAnswers({
                      ...userAnswers,
                      [currentQ.id]: opt.key
                    });
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 select-none ${
                    isSelected
                      ? 'bg-amber-500/15 border-2 border-amber-500 text-slate-900 dark:text-white shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                      : 'bg-slate-50 dark:bg-[#0F1218] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#1E2533]'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-sm uppercase shrink-0 ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}>
                    {opt.key}
                  </span>

                  <div className="flex-1 font-bold text-sm sm:text-base pt-0.5">
                    <div>{opt.textRu}</div>
                    {showTranslations && opt.textEn && (
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                        {opt.textEn}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation bottom footer */}
        <div className="flex items-center justify-between gap-4">
          <button
            disabled={currentIndex === 0}
            onClick={() => {
              SoundEffects.playClick();
              setCurrentIndex(prev => prev - 1);
            }}
            className="px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161A23] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentIndex < examQuestions.length - 1 ? (
            <button
              onClick={() => {
                SoundEffects.playClick();
                setCurrentIndex(prev => prev + 1);
              }}
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center gap-1.5"
            >
              <span>Next Question</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => finishExam()}
              className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              Submit Exam
            </button>
          )}
        </div>

      </div>
    );
  }

  // 3. FINAL RESULTS SCREEN
  const isPass = stats.percentage >= 70;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#161A23] border border-slate-200 dark:border-slate-800 shadow-xl text-center mb-8">
        
        <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-md bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-700">
          {isPass ? '🎓' : '📚'}
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          {isPass ? 'Exam Passed!' : 'Exam Completed'}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
          {isPass 
            ? 'Outstanding performance! You passed the Russian surgical board simulation.' 
            : 'Good effort! Review the questions you missed below to boost your score.'}
        </p>

        {/* Score cards */}
        <div className="grid grid-cols-3 gap-4 my-6 max-w-lg mx-auto">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800">
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.percentage}%</div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-0.5">Score</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800">
            <div className="text-2xl font-black text-sky-600 dark:text-sky-400">{stats.correct} / {stats.total}</div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-0.5">Correct</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800">
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">+{stats.correct * 15}</div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-0.5">XP Gained</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => startExam(examQuestionCount, examDurationMinutes)}
            className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wide shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Exam</span>
          </button>

          <button
            onClick={onExit}
            className="px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            Return to Learning Path
          </button>
        </div>

      </div>

      {/* Question Breakdown List */}
      <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">Detailed Question Review</h3>
      <div className="space-y-3">
        {examQuestions.map((q, idx) => {
          const userKey = userAnswers[q.id];
          const isCorrect = userKey?.toLowerCase() === q.correctKey.toLowerCase();
          const correctOpt = q.options.find(o => o.key.toLowerCase() === q.correctKey.toLowerCase());
          const userOpt = q.options.find(o => o.key.toLowerCase() === userKey?.toLowerCase());

          return (
            <div
              key={q.id}
              className={`p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161A23] border ${
                isCorrect ? 'border-emerald-500/40' : 'border-rose-500/40'
              } shadow-sm`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                  Question #{idx + 1} (Official #{q.number})
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-black uppercase ${
                  isCorrect 
                    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30' 
                    : 'bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/30'
                }`}>
                  {isCorrect ? 'Correct (+15 XP)' : 'Incorrect'}
                </span>
              </div>

              <p className="font-bold text-slate-900 dark:text-white text-sm">
                {q.questionRu}
              </p>

              <div className="mt-3 text-xs space-y-1">
                <div className="text-slate-600 dark:text-slate-400">
                  Your Answer: <span className={isCorrect ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-rose-600 dark:text-rose-400 font-bold'}>
                    ({userKey ? userKey.toUpperCase() : 'Unanswered'}) {userOpt?.textRu || '—'}
                  </span>
                </div>
                {!isCorrect && (
                  <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                    Correct Answer: ({q.correctKey.toUpperCase()}) {correctOpt?.textRu}
                  </div>
                )}
                {(q.explanationEn || q.explanation) && (
                  <div className="text-slate-600 dark:text-slate-400 mt-1">
                    💡 {q.explanationEn || q.explanation}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
