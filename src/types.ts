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

export interface UserProgress {
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
  history: Record<number, {
    selectedKey: string;
    isCorrect: boolean;
    timestamp: number;
  }>;
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
