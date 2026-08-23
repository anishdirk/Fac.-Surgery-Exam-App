import React, { useState, useEffect } from 'react';
import { allQuestions } from './data/questions';
import { topics } from './data/topics';
import { Question, UserProgress, QuizSession } from './types';
import { Navbar } from './components/Navbar';
import { DuolingoPath } from './components/DuolingoPath';
import { QuizCard } from './components/QuizCard';
import { TopicSelector } from './components/TopicSelector';
import { QuestionBank } from './components/QuestionBank';
import { ExamMode } from './components/ExamMode';
import { MistakesReviewModal } from './components/MistakesReviewModal';
import { LessonCompleteModal } from './components/LessonCompleteModal';
import { GlossaryModal } from './components/GlossaryModal';
import { SettingsModal } from './components/SettingsModal';
import { SoundEffects } from './utils/audio';

const STORAGE_KEY = 'duomed_ru_progress_v2';

const defaultProgress: UserProgress = {
  hearts: 5,
  maxHearts: 5,
  totalXp: 0,
  xp: 0,
  streakDays: 1,
  streak: 1,
  lastPracticeDate: new Date().toISOString().split('T')[0],
  completedLessons: [],
  completedQuestions: {},
  mistakes: [],
  bookmarkedQuestions: [],
  starredIds: [],
  infiniteHearts: false,
  soundEnabled: true,
  autoTranslate: false,
  history: {}
};

export default function App() {
  // 1. Persistent User Progress State
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...defaultProgress, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn("Failed to load progress from localStorage", e);
    }
    return defaultProgress;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.warn("Failed to save progress to localStorage", e);
    }
  }, [progress]);

  // Settings
  const [soundEnabled, setSoundEnabled] = useState<boolean>(progress.soundEnabled ?? true);
  const [showTranslationByDefault, setShowTranslationByDefault] = useState<boolean>(progress.autoTranslate ?? false);

  // Sync sound settings with audio utility
  useEffect(() => {
    SoundEffects.setEnabled(soundEnabled);
    setProgress(prev => ({ ...prev, soundEnabled }));
  }, [soundEnabled]);

  useEffect(() => {
    setProgress(prev => ({ ...prev, autoTranslate: showTranslationByDefault }));
  }, [showTranslationByDefault]);

  // Daily Streak check
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (progress.lastPracticeDate && progress.lastPracticeDate !== today) {
      const lastDate = new Date(progress.lastPracticeDate);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Maintained streak!
      } else if (diffDays > 1) {
        // Missed a day
        setProgress(prev => ({ ...prev, streakDays: 1, streak: 1 }));
      }
    }
  }, []);

  // 2. Navigation State
  const [currentTab, setCurrentTab] = useState<'learn' | 'topics' | 'bank' | 'exam' | 'mistakes'>('learn');
  const [activeSession, setActiveSession] = useState<QuizSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentCombo, setCurrentCombo] = useState<number>(0);

  // Modals
  const [isLessonCompleteOpen, setIsLessonCompleteOpen] = useState<boolean>(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // 3. Handlers for Starting Lessons

  // Start a specific level along the Duolingo Path (10 questions per level)
  const handleStartPathLevel = (topicId: string, levelIndex: number) => {
    const startNum = (levelIndex - 1) * 10 + 1;
    const endNum = Math.min(620, levelIndex * 10);
    const levelQuestions = allQuestions.filter(q => q.number >= startNum && q.number <= endNum);

    // Shuffle within the 10-question set
    const shuffled = [...levelQuestions].sort(() => 0.5 - Math.random());

    setActiveSession({
      questions: shuffled.length > 0 ? shuffled : allQuestions.slice(0, 10),
      totalQuestions: shuffled.length > 0 ? shuffled.length : 10,
      correctAnswers: [],
      incorrectAnswers: [],
      xpGained: 0,
      comboMax: 0,
      topicTitle: `Level ${levelIndex}`,
      lessonNumber: levelIndex
    });
    setCurrentQuestionIndex(0);
    setCurrentCombo(0);
    setIsLessonCompleteOpen(false);
  };

  // Quick practice (e.g. 10 random questions from entire 620 database)
  const handleQuickPractice = (count: number = 10) => {
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random()).slice(0, count);
    setActiveSession({
      questions: shuffled,
      totalQuestions: shuffled.length,
      correctAnswers: [],
      incorrectAnswers: [],
      xpGained: 0,
      comboMax: 0,
      topicTitle: `Quick Shuffle (${count} Qs)`
    });
    setCurrentQuestionIndex(0);
    setCurrentCombo(0);
    setIsLessonCompleteOpen(false);
  };

  // Practice specific topic
  const handleSelectTopicPractice = (topicId: string, count: number = 10) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;

    const topicQuestions = allQuestions.filter(
      q => q.number >= topic.questionRange[0] && q.number <= topic.questionRange[1]
    );
    const shuffled = [...topicQuestions].sort(() => 0.5 - Math.random()).slice(0, count);

    setActiveSession({
      questions: shuffled.length > 0 ? shuffled : topicQuestions.slice(0, count),
      totalQuestions: Math.min(count, topicQuestions.length),
      correctAnswers: [],
      incorrectAnswers: [],
      xpGained: 0,
      comboMax: 0,
      topicTitle: topic.titleEn
    });
    setCurrentQuestionIndex(0);
    setCurrentCombo(0);
    setIsLessonCompleteOpen(false);
  };

  // Practice custom subset from Question Bank
  const handlePracticeSubset = (subset: Question[], title: string) => {
    const shuffled = [...subset].sort(() => 0.5 - Math.random());
    setActiveSession({
      questions: shuffled,
      totalQuestions: shuffled.length,
      correctAnswers: [],
      incorrectAnswers: [],
      xpGained: 0,
      comboMax: 0,
      topicTitle: title
    });
    setCurrentQuestionIndex(0);
    setCurrentCombo(0);
    setIsLessonCompleteOpen(false);
  };

  // Practice Mistakes queue
  const handlePracticeMistakes = () => {
    const mistakeQuestions = allQuestions.filter(q => (progress.mistakes || []).includes(q.id));
    if (mistakeQuestions.length === 0) return;

    const shuffled = [...mistakeQuestions].sort(() => 0.5 - Math.random());
    setActiveSession({
      questions: shuffled,
      totalQuestions: shuffled.length,
      correctAnswers: [],
      incorrectAnswers: [],
      xpGained: 0,
      comboMax: 0,
      topicTitle: 'Mistakes Review'
    });
    setCurrentQuestionIndex(0);
    setCurrentCombo(0);
    setIsLessonCompleteOpen(false);
  };

  // 4. Answering Quiz Questions
  const handleAnswerQuestion = (selectedKey: string, isCorrect: boolean) => {
    if (!activeSession) return;
    const currentQ = activeSession.questions[currentQuestionIndex];

    const newCombo = isCorrect ? currentCombo + 1 : 0;
    setCurrentCombo(newCombo);
    const newMaxCombo = Math.max(activeSession.comboMax, newCombo);

    const xpForThis = isCorrect ? 10 + (newCombo > 2 ? 5 : 0) : 0;

    const updatedCorrect = isCorrect 
      ? [...activeSession.correctAnswers, currentQ.id] 
      : activeSession.correctAnswers;
    const updatedIncorrect = !isCorrect 
      ? [...activeSession.incorrectAnswers, currentQ.id] 
      : activeSession.incorrectAnswers;

    const updatedSession: QuizSession = {
      ...activeSession,
      correctAnswers: updatedCorrect,
      incorrectAnswers: updatedIncorrect,
      xpGained: activeSession.xpGained + xpForThis,
      comboMax: newMaxCombo
    };
    setActiveSession(updatedSession);

    // Update global user progress
    setProgress(prev => {
      const today = new Date().toISOString().split('T')[0];
      const nextHearts = (!isCorrect && !prev.infiniteHearts)
        ? Math.max(0, prev.hearts - 1)
        : prev.hearts;

      // Update mistakes queue: remove if answered correctly, add if incorrect
      const newMistakes = isCorrect
        ? (prev.mistakes || []).filter(id => id !== currentQ.id)
        : Array.from(new Set([...(prev.mistakes || []), currentQ.id]));

      // Mark completed question
      const newCompleted = isCorrect
        ? { ...(prev.completedQuestions || {}), [currentQ.id]: true }
        : (prev.completedQuestions || {});

      return {
        ...prev,
        hearts: nextHearts,
        totalXp: (prev.totalXp || prev.xp || 0) + xpForThis,
        xp: (prev.totalXp || prev.xp || 0) + xpForThis,
        streakDays: prev.lastPracticeDate === today ? (prev.streakDays || 1) : (prev.streakDays || 1) + 1,
        streak: prev.lastPracticeDate === today ? (prev.streak || 1) : (prev.streak || 1) + 1,
        lastPracticeDate: today,
        mistakes: newMistakes,
        completedQuestions: newCompleted,
        history: {
          ...(prev.history || {}),
          [currentQ.id]: {
            selectedKey,
            isCorrect,
            timestamp: Date.now()
          }
        }
      };
    });

    // Advance to next question or complete lesson
    if (currentQuestionIndex + 1 < activeSession.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Lesson finished!
      if (activeSession.lessonNumber) {
        setProgress(prev => ({
          ...prev,
          completedLessons: Array.from(new Set([...(prev.completedLessons || []), activeSession.lessonNumber!]))
        }));
      }
      setIsLessonCompleteOpen(true);
    }
  };

  // Toggle bookmarking questions
  const handleToggleBookmark = (questionId: number) => {
    setProgress(prev => {
      const currentList = prev.bookmarkedQuestions || [];
      const exists = currentList.includes(questionId);
      return {
        ...prev,
        bookmarkedQuestions: exists 
          ? currentList.filter(id => id !== questionId) 
          : [...currentList, questionId]
      };
    });
  };

  // Reset entire progress
  const handleResetProgress = () => {
    setProgress({
      ...defaultProgress,
      soundEnabled,
      autoTranslate: showTranslationByDefault
    });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("Storage clear error", e);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setActiveSession(null);
          setCurrentTab(tab);
        }}
        progress={progress}
        onQuickPractice={handleQuickPractice}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        showTranslationByDefault={showTranslationByDefault}
        setShowTranslationByDefault={setShowTranslationByDefault}
        mistakesCount={(progress.mistakes || []).length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* Active Quiz Session takes full focus */}
        {activeSession ? (
          <QuizCard
            question={activeSession.questions[currentQuestionIndex]}
            questionIndex={currentQuestionIndex}
            totalQuestions={activeSession.totalQuestions}
            hearts={progress.hearts}
            infiniteHearts={progress.infiniteHearts}
            combo={currentCombo}
            onAnswer={handleAnswerQuestion}
            onExit={() => setActiveSession(null)}
            onOpenGlossary={() => setIsGlossaryOpen(true)}
            showTranslationByDefault={showTranslationByDefault}
          />
        ) : (
          /* Tab Navigation Views */
          <>
            {currentTab === 'learn' && (
              <DuolingoPath
                progress={progress}
                onStartLesson={handleStartPathLevel}
                onStartQuickShuffle={() => handleQuickPractice(10)}
                onOpenExam={() => setCurrentTab('exam')}
              />
            )}

            {currentTab === 'topics' && (
              <TopicSelector
                progress={progress}
                onSelectTopic={handleSelectTopicPractice}
                onBrowseTopic={() => {
                  setCurrentTab('bank');
                }}
              />
            )}

            {currentTab === 'bank' && (
              <QuestionBank
                questions={allQuestions}
                progress={progress}
                onPracticeSubset={handlePracticeSubset}
                onToggleBookmark={handleToggleBookmark}
              />
            )}

            {currentTab === 'exam' && (
              <ExamMode
                allQuestions={allQuestions}
                onExit={() => setCurrentTab('learn')}
                onRecordResults={(correct, total, xpGained) => {
                  setProgress(prev => ({
                    ...prev,
                    totalXp: (prev.totalXp || prev.xp || 0) + xpGained,
                    xp: (prev.totalXp || prev.xp || 0) + xpGained,
                    streakDays: (prev.streakDays || 1) + 1,
                    streak: (prev.streak || 1) + 1
                  }));
                }}
              />
            )}

            {currentTab === 'mistakes' && (
              <MistakesReviewModal
                mistakes={progress.mistakes || []}
                allQuestions={allQuestions}
                onStartReview={handlePracticeMistakes}
                onClearMistakes={() => setProgress(prev => ({ ...prev, mistakes: [] }))}
                onClose={() => setCurrentTab('learn')}
              />
            )}
          </>
        )}
      </main>

      {/* Lesson Complete Dialog */}
      {isLessonCompleteOpen && activeSession && (
        <LessonCompleteModal
          session={activeSession}
          onContinue={() => {
            setIsLessonCompleteOpen(false);
            setActiveSession(null);
          }}
          onReviewMistakes={() => {
            setIsLessonCompleteOpen(false);
            handlePracticeMistakes();
          }}
          onRestart={() => {
            setIsLessonCompleteOpen(false);
            if (activeSession.lessonNumber) {
              handleStartPathLevel('general', activeSession.lessonNumber);
            } else {
              handleQuickPractice(activeSession.totalQuestions);
            }
          }}
        />
      )}

      {/* Medical Signs & Glossary Modal */}
      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        progress={progress}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        showTranslationByDefault={showTranslationByDefault}
        setShowTranslationByDefault={setShowTranslationByDefault}
        onToggleInfiniteHearts={() => setProgress(prev => ({ ...prev, infiniteHearts: !prev.infiniteHearts }))}
        onResetProgress={handleResetProgress}
      />

    </div>
  );
}
