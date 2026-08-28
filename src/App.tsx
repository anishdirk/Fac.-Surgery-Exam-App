import React, { useState, useEffect } from 'react';
import { allQuestions } from './data/questions';
import { topics } from './data/topics';
import { allCases, getCasesByTopic, getCaseById } from './data/cases';
import { Question, UserProgress, QuizSession, ClinicalCase, CaseProgress } from './types';
import { Navbar } from './components/Navbar';
import { DuolingoPath } from './components/DuolingoPath';
import { QuizCard } from './components/QuizCard';
import { TopicSelector } from './components/TopicSelector';
import { QuestionBank } from './components/QuestionBank';
import { ExamMode } from './components/ExamMode';
import { CaseTopicSelector } from './components/CaseTopicSelector';
import { CaseReviewCard } from './components/CaseReviewCard';
import { MistakesReviewModal } from './components/MistakesReviewModal';
import { LessonCompleteModal } from './components/LessonCompleteModal';
import { GlossaryModal } from './components/GlossaryModal';
import { SettingsModal } from './components/SettingsModal';
import { InstallAppBanner } from './components/InstallAppBanner';
import { InstallGuideModal } from './components/InstallGuideModal';
import { SoundEffects } from './utils/audio';

const STORAGE_KEY = 'duomed_ru_progress_v2';
const CASES_STORAGE_KEY = 'duomed_ru_cases_v1';

const defaultCaseProgress: CaseProgress = {
  reviewedCaseIds: [],
  caseSelfRating: {},
  bookmarkedCaseIds: []
};

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

  // 1b. Persistent Clinical Cases Progress State (Isolated from MCQs)
  const [caseProgress, setCaseProgress] = useState<CaseProgress>(() => {
    try {
      const saved = localStorage.getItem(CASES_STORAGE_KEY);
      if (saved) {
        return { ...defaultCaseProgress, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn("Failed to load case progress from localStorage", e);
    }
    return defaultCaseProgress;
  });

  useEffect(() => {
    try {
      localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(caseProgress));
    } catch (e) {
      console.warn("Failed to save case progress to localStorage", e);
    }
  }, [caseProgress]);

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
  const [currentTab, setCurrentTab] = useState<'learn' | 'topics' | 'cases' | 'bank' | 'exam' | 'mistakes'>('learn');
  const [activeSession, setActiveSession] = useState<QuizSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentCombo, setCurrentCombo] = useState<number>(0);

  // Active Case Session State (For reviewing a topic's or custom set's clinical cases)
  const [activeCaseSession, setActiveCaseSession] = useState<{
    cases: ClinicalCase[];
    currentIndex: number;
    title: string;
  } | null>(null);

  // Modals
  const [isLessonCompleteOpen, setIsLessonCompleteOpen] = useState<boolean>(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isInstallGuideOpen, setIsInstallGuideOpen] = useState<boolean>(false);

  // Handlers for Clinical Cases
  const handleSelectCaseTopic = (topicId: string) => {
    const topicCases = allCases.filter(c => c.topicId === topicId);
    const targetTopic = topics.find(t => t.id === topicId);
    if (topicCases.length === 0) return;

    // Mark the first case as reviewed
    const firstCase = topicCases[0];
    setCaseProgress(prev => ({
      ...prev,
      reviewedCaseIds: prev.reviewedCaseIds.includes(firstCase.id)
        ? prev.reviewedCaseIds
        : [...prev.reviewedCaseIds, firstCase.id]
    }));

    setActiveCaseSession({
      cases: topicCases,
      currentIndex: 0,
      title: targetTopic ? targetTopic.titleEn : 'Clinical Cases'
    });
  };

  const handleSelectSingleCase = (caseId: number) => {
    const targetCase = allCases.find(c => c.id === caseId);
    if (!targetCase) return;

    const topicCases = allCases.filter(c => c.topicId === targetCase.topicId);
    const indexInTopic = topicCases.findIndex(c => c.id === caseId);

    setCaseProgress(prev => ({
      ...prev,
      reviewedCaseIds: prev.reviewedCaseIds.includes(caseId)
        ? prev.reviewedCaseIds
        : [...prev.reviewedCaseIds, caseId]
    }));

    setActiveCaseSession({
      cases: topicCases.length > 0 ? topicCases : [targetCase],
      currentIndex: indexInTopic >= 0 ? indexInTopic : 0,
      title: targetCase.topicTitleEn
    });
  };

  const handleStartCustomCaseSession = (casesList: ClinicalCase[], title: string) => {
    if (casesList.length === 0) return;
    const firstCase = casesList[0];

    setCaseProgress(prev => ({
      ...prev,
      reviewedCaseIds: prev.reviewedCaseIds.includes(firstCase.id)
        ? prev.reviewedCaseIds
        : [...prev.reviewedCaseIds, firstCase.id]
    }));

    setActiveCaseSession({
      cases: casesList,
      currentIndex: 0,
      title
    });
  };

  const handleUpdateCaseSelfRating = (caseId: number, rating: 'knew_it' | 'needs_review' | 'mastered' | null) => {
    setCaseProgress(prev => {
      const nextRatings = { ...prev.caseSelfRating };
      if (rating === null) {
        delete nextRatings[caseId];
      } else {
        nextRatings[caseId] = rating;
      }
      return {
        ...prev,
        caseSelfRating: nextRatings,
        reviewedCaseIds: prev.reviewedCaseIds.includes(caseId)
          ? prev.reviewedCaseIds
          : [...prev.reviewedCaseIds, caseId]
      };
    });
  };

  const handleToggleCaseBookmark = (caseId: number) => {
    setCaseProgress(prev => {
      const exists = prev.bookmarkedCaseIds.includes(caseId);
      return {
        ...prev,
        bookmarkedCaseIds: exists
          ? prev.bookmarkedCaseIds.filter(id => id !== caseId)
          : [...prev.bookmarkedCaseIds, caseId]
      };
    });
  };

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

    const updatedCorrect = isCorrect && !activeSession.correctAnswers.includes(currentQ.id)
      ? [...activeSession.correctAnswers, currentQ.id] 
      : activeSession.correctAnswers;
    const updatedIncorrect = !isCorrect && !activeSession.incorrectAnswers.includes(currentQ.id)
      ? [...activeSession.incorrectAnswers, currentQ.id] 
      : activeSession.incorrectAnswers;

    // Repetition mastery rule:
    // If the answer is incorrect, repeat this question at the end of the session queue
    // until the user gets it correct!
    const updatedQuestions = !isCorrect
      ? [...activeSession.questions, currentQ]
      : activeSession.questions;

    const updatedSession: QuizSession = {
      ...activeSession,
      questions: updatedQuestions,
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
    if (currentQuestionIndex + 1 < updatedQuestions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Lesson finished! All questions in the queue (including repeats) are now mastered!
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0C10] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 transition-colors duration-150">
      
      {/* PWA Install Banner */}
      <InstallAppBanner onOpenGuide={() => setIsInstallGuideOpen(true)} />

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
        onOpenInstallGuide={() => setIsInstallGuideOpen(true)}
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
            completedCount={activeSession.correctAnswers.length}
            isRepeat={
              currentQuestionIndex >= activeSession.totalQuestions ||
              activeSession.questions.slice(0, currentQuestionIndex).some(q => q.id === activeSession.questions[currentQuestionIndex]?.id)
            }
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

            {currentTab === 'cases' && (
              activeCaseSession ? (
                <CaseReviewCard
                  clinicalCase={activeCaseSession.cases[activeCaseSession.currentIndex]}
                  sessionCases={activeCaseSession.cases}
                  currentIndex={activeCaseSession.currentIndex}
                  onNavigateIndex={(newIndex) => {
                    const nextCase = activeCaseSession.cases[newIndex];
                    if (nextCase) {
                      setCaseProgress(prev => ({
                        ...prev,
                        reviewedCaseIds: prev.reviewedCaseIds.includes(nextCase.id)
                          ? prev.reviewedCaseIds
                          : [...prev.reviewedCaseIds, nextCase.id]
                      }));
                    }
                    setActiveCaseSession(prev => prev ? { ...prev, currentIndex: newIndex } : null);
                  }}
                  caseProgress={caseProgress}
                  onUpdateSelfRating={handleUpdateCaseSelfRating}
                  onToggleBookmark={handleToggleCaseBookmark}
                  onExit={() => setActiveCaseSession(null)}
                  sessionTitle={activeCaseSession.title}
                />
              ) : (
                <CaseTopicSelector
                  caseProgress={caseProgress}
                  onSelectTopic={handleSelectCaseTopic}
                  onSelectCase={handleSelectSingleCase}
                  onStartFilterSession={handleStartCustomCaseSession}
                />
              )
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
        onOpenInstallGuide={() => setIsInstallGuideOpen(true)}
      />

      {/* Android & PWA Install Guide Modal */}
      <InstallGuideModal
        isOpen={isInstallGuideOpen}
        onClose={() => setIsInstallGuideOpen(false)}
        canDirectInstall={true}
      />

    </div>
  );
}
