import React, { useState, useEffect } from 'react';
import { allQuestions } from './data/questions';
import { topics } from './data/topics';
import { allCases, getCasesByTopic, getCaseById } from './data/cases';
import { Question, UserProgress, QuizSession, ClinicalCase, CaseProgress, ConfidenceLevel } from './types';
import { Navbar } from './components/Navbar';
import { DuolingoPath } from './components/DuolingoPath';
import { QuizCard } from './components/QuizCard';
import { QuestionBank } from './components/QuestionBank';
import { ExamMode } from './components/ExamMode';
import { CaseTopicSelector } from './components/CaseTopicSelector';
import { CaseReviewCard } from './components/CaseReviewCard';
import { MistakesReviewModal } from './components/MistakesReviewModal';
import { AnalyticsView } from './components/AnalyticsView';
import { LessonCompleteModal } from './components/LessonCompleteModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GlossaryModal } from './components/GlossaryModal';
import { SettingsModal } from './components/SettingsModal';
import { CertificateModal } from './components/CertificateModal';
import { InstallAppBanner } from './components/InstallAppBanner';
import { InstallGuideModal } from './components/InstallGuideModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { SoundEffects } from './utils/audio';
import { calculateXpGained, calculateNextHearts, calculateNextStreak } from './utils/scoring';
import { exportProgressToFile, ExportedProgressData } from './utils/progressExportImport';
import { calculateNextSrsState, formatDateKey, migrateUserProgress, migrateCaseProgress } from './utils/spacedRepetition';
import { AppSection, McqTab, Part2Tab } from './constants/navigation';

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
  history: {},
  spacedRepetition: {}
};

export default function App() {
  // 1. Persistent User Progress State
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return migrateUserProgress(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Failed to load progress from localStorage", e);
    }
    return migrateUserProgress(defaultProgress);
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
        return migrateCaseProgress(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Failed to load case progress from localStorage", e);
    }
    return migrateCaseProgress(defaultCaseProgress);
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

  // 2. Two-Level Navigation State (MCQ and Part 2)
  const [section, setSection] = useState<AppSection>('mcq');
  const [mcqTab, setMcqTab] = useState<McqTab>('learn');
  const [part2Tab, setPart2Tab] = useState<Part2Tab>('cases');
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
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);

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

  const handleUpdateCaseConfidence = (caseId: number, confidence: ConfidenceLevel) => {
    setCaseProgress(prev => ({
      ...prev,
      caseConfidence: {
        ...(prev.caseConfidence || {}),
        [caseId]: confidence
      }
    }));
  };

  const handleUpdateCaseSelfRating = (caseId: number, rating: 'knew_it' | 'needs_review' | 'mastered' | null) => {
    setCaseProgress(prev => {
      const nextRatings = { ...prev.caseSelfRating };
      const nextCaseSrs = { ...(prev.caseSpacedRepetition || {}) };
      let nextAttempts = prev.caseAttempts || [];

      if (rating === null) {
        delete nextRatings[caseId];
      } else {
        nextRatings[caseId] = rating;
        const isCorrect = rating === 'knew_it' || rating === 'mastered';
        const currentSrs = prev.caseSpacedRepetition?.[caseId];
        const nextSrs = calculateNextSrsState(caseId, isCorrect, currentSrs);
        const caseConf = prev.caseConfidence?.[caseId] || 'medium';
        nextSrs.confidence = caseConf;
        nextCaseSrs[caseId] = nextSrs;

        const newAttempt = {
          caseId,
          rating,
          isCorrect,
          confidence: caseConf,
          timestamp: Date.now()
        };
        nextAttempts = [...nextAttempts, newAttempt].slice(-500);
      }

      return {
        ...prev,
        caseSelfRating: nextRatings,
        caseSpacedRepetition: nextCaseSrs,
        caseAttempts: nextAttempts,
        reviewedCaseIds: prev.reviewedCaseIds.includes(caseId)
          ? prev.reviewedCaseIds
          : [...prev.reviewedCaseIds, caseId]
      };
    });

    // Successive Relearning for Clinical Cases (Higham et al., Rawson & Dunlosky):
    // Re-serve missed / needs_review cases 2-3 items later in the current session
    if (rating === 'needs_review') {
      setActiveCaseSession(prev => {
        if (!prev) return null;
        const currentCase = prev.cases[prev.currentIndex];
        if (!currentCase) return prev;
        const remaining = prev.cases.length - (prev.currentIndex + 1);
        const updatedCases = [...prev.cases];
        if (remaining <= 2) {
          updatedCases.push(currentCase);
        } else {
          const offset = Math.min(remaining, 3);
          const insertIndex = prev.currentIndex + 1 + offset;
          updatedCases.splice(insertIndex, 0, currentCase);
        }
        return {
          ...prev,
          cases: updatedCases
        };
      });
    }
  };

  const handleSaveCasePretest = (caseId: number, text: string) => {
    setCaseProgress(prev => ({
      ...prev,
      casePretests: {
        ...(prev.casePretests || {}),
        [caseId]: { text, timestamp: Date.now() }
      }
    }));
  };

  const handleSaveCaseElaboration = (caseId: number, text: string) => {
    setCaseProgress(prev => ({
      ...prev,
      caseElaborations: {
        ...(prev.caseElaborations || {}),
        [caseId]: { text, timestamp: Date.now() }
      }
    }));
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

  // Practice Mistakes or Spaced-Repetition queue
  const handlePracticeMistakes = (
    customIds?: number[], 
    title: string = 'Spaced-Repetition Review',
    isInterleaved: boolean = false
  ) => {
    const targetIds = customIds && customIds.length > 0 ? customIds : (progress.mistakes || []);
    let questionsList: Question[] = [];
    if (isInterleaved) {
      const qMap = new Map(allQuestions.map(q => [q.id, q]));
      questionsList = targetIds.map(id => qMap.get(id)!).filter(Boolean);
    } else {
      const filtered = allQuestions.filter(q => targetIds.includes(q.id));
      questionsList = [...filtered].sort(() => 0.5 - Math.random());
    }
    if (questionsList.length === 0) return;

    setActiveSession({
      questions: questionsList,
      totalQuestions: questionsList.length,
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

  // 4. Answering Quiz Questions
  const handleAnswerQuestion = (selectedKey: string, isCorrect: boolean, confidence: ConfidenceLevel = 'medium') => {
    if (!activeSession) return;
    const currentQ = activeSession.questions[currentQuestionIndex];

    const { xpGained: xpForThis, newCombo } = calculateXpGained(isCorrect, currentCombo);
    setCurrentCombo(newCombo);
    const newMaxCombo = Math.max(activeSession.comboMax, newCombo);

    const updatedCorrect = isCorrect && !activeSession.correctAnswers.includes(currentQ.id)
      ? [...activeSession.correctAnswers, currentQ.id] 
      : activeSession.correctAnswers;
    const updatedIncorrect = !isCorrect && !activeSession.incorrectAnswers.includes(currentQ.id)
      ? [...activeSession.incorrectAnswers, currentQ.id] 
      : activeSession.incorrectAnswers;

    // Successive relearning rule (Higham et al., Rawson & Dunlosky):
    // Re-queue missed question 3-4 questions later in the same session
    // (or at the end if fewer questions remain). The session ends only when all items are cleared!
    let updatedQuestions = [...activeSession.questions];
    if (!isCorrect) {
      const remaining = updatedQuestions.length - (currentQuestionIndex + 1);
      if (remaining <= 3) {
        updatedQuestions.push(currentQ);
      } else {
        const offset = Math.min(remaining, 4);
        const insertIndex = currentQuestionIndex + 1 + offset;
        updatedQuestions.splice(insertIndex, 0, currentQ);
      }
    }

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
      const nextHearts = calculateNextHearts(prev.hearts, isCorrect, prev.infiniteHearts);
      const { nextStreak, todayString } = calculateNextStreak(
        prev.streakDays || prev.streak || 1,
        prev.lastPracticeDate
      );

      // Update mistakes queue: remove if answered correctly, add if incorrect
      const newMistakes = isCorrect
        ? (prev.mistakes || []).filter(id => id !== currentQ.id)
        : Array.from(new Set([...(prev.mistakes || []), currentQ.id]));

      // Update Spaced-Repetition item (SM-2 progression)
      const currentSrs = prev.spacedRepetition?.[currentQ.id];
      const nextSrs = calculateNextSrsState(currentQ.id, isCorrect, currentSrs);
      nextSrs.confidence = confidence;
      const newSpacedRepetition = {
        ...(prev.spacedRepetition || {}),
        [currentQ.id]: nextSrs
      };

      // Record chronological attempt for trend analytics & calibration
      const newAttempt = {
        questionId: currentQ.id,
        topicId: currentQ.topicId,
        isCorrect,
        confidence,
        timestamp: Date.now()
      };
      const newAttemptHistory = [...(prev.attemptHistory || []), newAttempt].slice(-1000);

      // Mark completed question
      const newCompleted = isCorrect
        ? { ...(prev.completedQuestions || {}), [currentQ.id]: true }
        : (prev.completedQuestions || {});

      return {
        ...prev,
        hearts: nextHearts,
        totalXp: (prev.totalXp || prev.xp || 0) + xpForThis,
        xp: (prev.totalXp || prev.xp || 0) + xpForThis,
        streakDays: nextStreak,
        streak: nextStreak,
        lastPracticeDate: todayString,
        mistakes: newMistakes,
        spacedRepetition: newSpacedRepetition,
        attemptHistory: newAttemptHistory,
        completedQuestions: newCompleted,
        history: {
          ...(prev.history || {}),
          [currentQ.id]: {
            selectedKey,
            isCorrect,
            confidence,
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

  // Export current progress to versioned JSON file
  const handleExportProgress = () => {
    exportProgressToFile(progress, caseProgress);
  };

  // Restore progress from validated backup file
  const handleImportProgress = (data: ExportedProgressData) => {
    setProgress(data.progress);
    setCaseProgress(data.caseProgress);
    if (typeof data.progress.soundEnabled === 'boolean') {
      setSoundEnabled(data.progress.soundEnabled);
    }
    if (typeof data.progress.autoTranslate === 'boolean') {
      setShowTranslationByDefault(data.progress.autoTranslate);
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.progress));
      localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(data.caseProgress));
    } catch (e) {
      console.warn("Storage sync error during import", e);
    }
    SoundEffects.playCorrect();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0C10] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 transition-colors duration-150">
      
      {/* PWA Install Banner */}
      <InstallAppBanner onOpenGuide={() => setIsInstallGuideOpen(true)} />

      {/* Top Navigation */}
      <Navbar
        section={section}
        setSection={(newSec) => {
          setActiveSession(null);
          setSection(newSec);
          if (newSec === 'mcq') {
            setMcqTab('learn');
          } else {
            setPart2Tab('cases');
          }
        }}
        mcqTab={mcqTab}
        setMcqTab={(tab) => {
          setActiveSession(null);
          setMcqTab(tab);
        }}
        part2Tab={part2Tab}
        setPart2Tab={(tab) => {
          setActiveSession(null);
          setPart2Tab(tab);
        }}
        progress={progress}
        onQuickPractice={handleQuickPractice}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenInstallGuide={() => setIsInstallGuideOpen(true)}
        mistakesCount={(() => {
          const today = formatDateKey();
          const srs = progress.spacedRepetition || {};
          const mistakes = progress.mistakes || [];
          const due = mistakes.filter(id => !srs[id] || srs[id].dueDate <= today).length;
          return due > 0 ? due : mistakes.length;
        })()}
        hideMobileBottomNav={Boolean(activeSession || activeCaseSession)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-24 md:pb-12">
        {/* Active Quiz Session takes full focus */}
        {activeSession ? (
          <ErrorBoundary
            fallbackTitle="Question Render Error"
            fallbackMessage="An unexpected error occurred while loading this question. Return to your study path without losing your recorded progress."
            resetButtonText="Return to Study Path"
            onReset={() => setActiveSession(null)}
          >
            <QuizCard
              question={activeSession.questions[currentQuestionIndex]}
              questionIndex={currentQuestionIndex}
              totalQuestions={activeSession.totalQuestions}
              completedCount={activeSession.correctAnswers.length}
              masteredInSession={activeSession.correctAnswers.length}
              queuedForRetry={Math.max(0, activeSession.totalQuestions - activeSession.correctAnswers.length)}
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
          </ErrorBoundary>
        ) : section === 'mcq' ? (
          /* MCQ Section Views */
          <>
            {mcqTab === 'learn' && (
              <DuolingoPath
                progress={progress}
                onStartLesson={handleStartPathLevel}
                onStartQuickShuffle={() => handleQuickPractice(10)}
                onOpenExam={() => setMcqTab('exam')}
              />
            )}

            {mcqTab === 'bank' && (
              <QuestionBank
                questions={allQuestions}
                progress={progress}
                onPracticeSubset={handlePracticeSubset}
                onToggleBookmark={handleToggleBookmark}
              />
            )}

            {mcqTab === 'exam' && (
              <ErrorBoundary
                fallbackTitle="Exam Mode Error"
                fallbackMessage="An unexpected error occurred while rendering the exam simulation. You can return to the study path."
                resetButtonText="Return to Study Path"
                onReset={() => setMcqTab('learn')}
              >
                <ExamMode
                  allQuestions={allQuestions}
                  onExit={() => setMcqTab('learn')}
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
              </ErrorBoundary>
            )}

            {mcqTab === 'mistakes' && (
              <MistakesReviewModal
                mistakes={progress.mistakes || []}
                bookmarkedQuestions={progress.bookmarkedQuestions || []}
                spacedRepetition={progress.spacedRepetition || {}}
                history={progress.history || {}}
                allQuestions={allQuestions}
                onStartReview={handlePracticeMistakes}
                onClearMistakes={() => setProgress(prev => ({ ...prev, mistakes: [] }))}
                onClose={() => setMcqTab('learn')}
              />
            )}

            {mcqTab === 'analytics' && (
              <AnalyticsView
                progress={progress}
                allQuestions={allQuestions}
                topics={topics}
                onStartTopicPractice={(topicId) => {
                  const topicQuestions = allQuestions.filter(q => q.topicId === topicId);
                  const topic = topics.find(t => t.id === topicId);
                  handlePracticeSubset(topicQuestions, topic?.titleEn || 'Topic Practice');
                }}
                onQuickPractice={handleQuickPractice}
                onOpenCertificate={() => setIsCertificateOpen(true)}
              />
            )}
          </>
        ) : (
          /* Part 2 Section Views */
          <>
            {part2Tab === 'cases' && (
              activeCaseSession ? (
                <ErrorBoundary
                  fallbackTitle="Clinical Case Error"
                  fallbackMessage="An unexpected error occurred while loading this case. Return to the clinical cases catalog."
                  resetButtonText="Return to Case Catalog"
                  onReset={() => setActiveCaseSession(null)}
                >
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
                    onUpdateCaseConfidence={handleUpdateCaseConfidence}
                    onSaveCasePretest={handleSaveCasePretest}
                    onSaveCaseElaboration={handleSaveCaseElaboration}
                    onToggleBookmark={handleToggleCaseBookmark}
                    onExit={() => setActiveCaseSession(null)}
                    sessionTitle={activeCaseSession.title}
                  />
                </ErrorBoundary>
              ) : (
                <CaseTopicSelector
                  caseProgress={caseProgress}
                  onSelectTopic={handleSelectCaseTopic}
                  onSelectCase={handleSelectSingleCase}
                  onStartFilterSession={handleStartCustomCaseSession}
                />
              )
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
        caseProgress={caseProgress}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        showTranslationByDefault={showTranslationByDefault}
        setShowTranslationByDefault={setShowTranslationByDefault}
        onToggleInfiniteHearts={() => setProgress(prev => ({ ...prev, infiniteHearts: !prev.infiniteHearts }))}
        onResetProgress={handleResetProgress}
        onOpenInstallGuide={() => setIsInstallGuideOpen(true)}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        onExportProgress={handleExportProgress}
        onImportProgress={handleImportProgress}
      />

      {/* Surgical Board Progress Certificate Modal */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        progress={progress}
        caseProgress={caseProgress}
        allQuestions={allQuestions}
        topics={topics}
      />

      {/* Android & PWA Install Guide Modal */}
      <InstallGuideModal
        isOpen={isInstallGuideOpen}
        onClose={() => setIsInstallGuideOpen(false)}
        canDirectInstall={true}
      />

      {/* Offline Status Indicator */}
      <OfflineIndicator />

    </div>
  );
}
