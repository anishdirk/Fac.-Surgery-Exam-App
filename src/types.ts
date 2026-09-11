export interface Option {
  key: string; // 'а', 'б', 'в', 'г', 'д'
  textRu: string;
  textEn?: string;
}

export interface Question {
  id: number;
  number: number;
  questionRu: string;
  questionEn?: string;
  options: Option[];
  correctKey: string; // 'а', 'б', 'в', 'г', 'д'
  topicId: string;
  page?: number;
  keywordsEn?: string[];
  explanationEn?: string;
  explanation?: string;
}

export interface Topic {
  id: string;
  order: number;
  titleEn: string;
  titleRu: string;
  questionRange: [number, number];
  count: number;
  icon: string;
  descriptionEn?: string;
  nameEn?: string;
  nameRu?: string;
  range?: [number, number];
}

export type ConfidenceLevel = 'low' | 'medium' | 'high';

export interface SpacedRepetitionItem {
  itemId: number;
  consecutiveCorrect: number; // consecutive-correct count (1, 2, 3...)
  nextReviewDate: string; // ISO 'YYYY-MM-DD'
  currentInterval: number; // in days: 1, 3, 7, 14, 28...
  lastReviewed?: number; // Epoch timestamp ms
  confidence?: ConfidenceLevel;
  // Backward compatibility aliases:
  questionId?: number;
  interval?: number;
  repetitions?: number;
  dueDate?: string;
  easeFactor?: number;
}

export interface UserProgress {
  schemaVersion?: number;
  hearts: number;
  maxHearts: number;
  totalXp: number;
  xp: number;
  streakDays: number;
  streak: number;
  lastPracticeDate: string;
  completedLessons: number[];
  completedQuestions: Record<number, boolean>;
  mistakes: number[];
  bookmarkedQuestions: number[];
  starredIds: number[];
  infiniteHearts: boolean;
  soundEnabled: boolean;
  autoTranslate: boolean;
  theme?: 'dark' | 'light';
  history: Record<number, {
    selectedKey: string;
    isCorrect: boolean;
    timestamp: number;
    confidence?: 'low' | 'medium' | 'high';
  }>;
  attemptHistory?: Array<{
    questionId: number;
    topicId: string;
    isCorrect: boolean;
    timestamp: number;
    confidence?: 'low' | 'medium' | 'high';
  }>;
  spacedRepetition?: Record<number, SpacedRepetitionItem>;
}

export interface QuizSession {
  questions: Question[];
  totalQuestions: number;
  correctAnswers: number[];
  incorrectAnswers: number[];
  xpGained: number;
  comboMax: number;
  topicTitle?: string;
  lessonNumber?: number;
}

// ============================================================
// Clinical Cases (Long-form situational problems)
// Kept as separate interfaces from Question/UserProgress so
// situational-task data never mixes with the MCQ bank.
// ============================================================

export interface CaseSubQuestion {
  id?: string;      // local id within the case, e.g. 'q1'
  num?: number;     // optional numeric index within case
  text: string;
}

export interface CaseSubAnswer {
  questionId?: string; // matches CaseSubQuestion.id
  num?: number;        // optional numeric index within case
  text: string;
}

export interface ClinicalCase {
  id: number;                // unique across ALL cases (own numbering space, separate from Question.id)
  number: number;            // case number within its topic, matches source "ЗАДАЧА №"
  topicId: string;           // links to Topic.id in topics.ts (reuses your existing 16 topics)
  topicTitleEn?: string;
  crossTopicIds?: string[];  // optional secondary topics, e.g. an appendicitis case that also covers peritonitis
  stem: string;              // the patient vignette
  questions: CaseSubQuestion[];
  answers: CaseSubAnswer[];
}

export interface CaseSession {
  cases: ClinicalCase[];
  currentIndex: number;
  title: string;
  initialTotalCases?: number;
  retryCountPerCase?: Record<number, number>;
}

// Separate progress tracking — self-assessed, not right/wrong,
// so it never touches hearts/XP/mistakes from the MCQ system.
export interface CaseProgress {
  schemaVersion?: number;
  reviewedCaseIds: number[];
  caseSelfRating: Record<number, 'knew_it' | 'needs_review' | 'mastered'>;
  bookmarkedCaseIds: number[];
  caseSpacedRepetition?: Record<number, SpacedRepetitionItem>;
  casePretests?: Record<number, { text: string; timestamp: number }>;
  caseElaborations?: Record<number, { text: string; timestamp: number }>;
  caseConfidence?: Record<number, ConfidenceLevel>;
  caseAttempts?: Array<{
    caseId: number;
    confidence: ConfidenceLevel;
    rating: 'knew_it' | 'needs_review' | 'mastered';
    isCorrect?: boolean;
    timestamp: number;
  }>;
}

export type CaseComparisonStatus = 'correct' | 'partial' | 'missing' | 'incorrect';

export interface QuestionComparisonFeedback {
  questionId: string;
  status: CaseComparisonStatus;
  feedback: string;
}

export interface CaseComparisonResult {
  perQuestion: QuestionComparisonFeedback[];
  overallSummary: string;
}

