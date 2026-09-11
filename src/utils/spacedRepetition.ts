import { SpacedRepetitionItem, UserProgress, CaseProgress, ClinicalCase } from '../types';

/**
 * Expanding intervals in days: 1, 3, 7, 14, 28 days
 * Citation: Vagha et al., Frontiers Medicine 2025
 */
export const SRS_INTERVALS = [1, 3, 7, 14, 28] as const;
export const CURRENT_DATA_VERSION = 2;

/**
 * Format a Date object as YYYY-MM-DD (local time or UTC consistent)
 */
export function formatDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Calculates next Spaced Repetition (SRS) state following expanding intervals:
 * 1, 3, 7, 14, 28 days scaling with consecutive-correct count.
 * - Correct answer: increments consecutiveCorrect and expands the review interval.
 * - Incorrect answer: resets consecutiveCorrect to 0, sets interval back to 1 day, and marks due today.
 */
export function calculateNextSrsState(
  itemId: number,
  isCorrect: boolean,
  current?: SpacedRepetitionItem,
  now: Date = new Date(),
  confidence?: 'low' | 'medium' | 'high'
): SpacedRepetitionItem {
  const nowMs = now.getTime();
  const todayKey = formatDateKey(now);

  if (!isCorrect) {
    return {
      itemId,
      questionId: itemId,
      currentInterval: 1,
      interval: 1,
      consecutiveCorrect: 0,
      repetitions: 0,
      nextReviewDate: todayKey,
      dueDate: todayKey,
      lastReviewed: nowMs,
      confidence
    };
  }

  const currentReps = current ? (current.consecutiveCorrect ?? current.repetitions ?? 0) : 0;
  const nextReps = currentReps + 1;

  // Determine interval based on repetitions step (1, 3, 7, 14, 28 days)
  let intervalDays: number;
  if (nextReps === 1) {
    intervalDays = SRS_INTERVALS[0]; // 1 day
  } else if (nextReps === 2) {
    intervalDays = SRS_INTERVALS[1]; // 3 days
  } else if (nextReps === 3) {
    intervalDays = SRS_INTERVALS[2]; // 7 days
  } else if (nextReps === 4) {
    intervalDays = SRS_INTERVALS[3]; // 14 days
  } else if (nextReps === 5) {
    intervalDays = SRS_INTERVALS[4]; // 28 days
  } else {
    // Scaling beyond 28 days
    intervalDays = Math.min(180, Math.round(28 * Math.pow(1.5, nextReps - 5)));
  }

  // Calculate target due date
  const targetDate = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);
  const dueDateKey = formatDateKey(targetDate);

  return {
    itemId,
    questionId: itemId,
    currentInterval: intervalDays,
    interval: intervalDays,
    consecutiveCorrect: nextReps,
    repetitions: nextReps,
    nextReviewDate: dueDateKey,
    dueDate: dueDateKey,
    lastReviewed: nowMs,
    confidence
  };
}

/**
 * Checks if an item is due on or before today
 */
export function isSrsDue(
  item: SpacedRepetitionItem | undefined,
  todayKey: string = formatDateKey()
): boolean {
  if (!item) return true; // Items without an SRS record are considered due
  const dueDate = item.nextReviewDate || item.dueDate;
  if (!dueDate) return true;
  return dueDate <= todayKey;
}

/**
 * Returns human-readable label and relative status for an SRS item
 */
export function getSrsStatusInfo(
  item: SpacedRepetitionItem | undefined,
  todayKey: string = formatDateKey()
): {
  isDue: boolean;
  label: string;
  boxLevel: number;
  intervalDays: number;
  dueDate: string;
} {
  if (!item) {
    return {
      isDue: true,
      label: 'Due for Review',
      boxLevel: 1,
      intervalDays: 1,
      dueDate: todayKey
    };
  }

  const dueDate = item.nextReviewDate || item.dueDate || todayKey;
  const isDue = dueDate <= todayKey;
  const consecutive = item.consecutiveCorrect ?? item.repetitions ?? 0;
  const boxLevel = Math.min(5, Math.max(1, consecutive));
  const intervalDays = item.currentInterval ?? item.interval ?? 1;

  let label: string;
  if (isDue) {
    label = 'Due Today';
  } else {
    const [tY, tM, tD] = todayKey.split('-').map(Number);
    const [dY, dM, dD] = dueDate.split('-').map(Number);
    const todayEpoch = new Date(tY, tM - 1, tD).getTime();
    const dueEpoch = new Date(dY, dM - 1, dD).getTime();
    const diffDays = Math.max(1, Math.round((dueEpoch - todayEpoch) / (1000 * 60 * 60 * 24)));
    label = `Due in ${diffDays}d`;
  }

  return {
    isDue,
    label,
    boxLevel,
    intervalDays,
    dueDate
  };
}

/**
 * Migrates a UserProgress object to current schema version (version 2).
 * Ensures all SRS items have standard fields and existing mistakes have scheduled items.
 */
export function migrateUserProgress(
  raw: any,
  todayKey: string = formatDateKey()
): UserProgress {
  if (!raw || typeof raw !== 'object') {
    return {
      schemaVersion: CURRENT_DATA_VERSION,
      hearts: 5,
      maxHearts: 5,
      totalXp: 0,
      xp: 0,
      streakDays: 1,
      streak: 1,
      lastPracticeDate: todayKey,
      completedLessons: [],
      completedQuestions: {},
      mistakes: [],
      bookmarkedQuestions: [],
      starredIds: [],
      infiniteHearts: false,
      soundEnabled: true,
      autoTranslate: false,
      history: {},
      attemptHistory: [],
      spacedRepetition: {}
    };
  }

  const existingSrs = (raw.spacedRepetition && typeof raw.spacedRepetition === 'object')
    ? { ...raw.spacedRepetition }
    : {};

  const migratedSrs: Record<number, SpacedRepetitionItem> = {};

  // Standardize existing SRS items
  Object.keys(existingSrs).forEach(key => {
    const id = Number(key);
    const it = existingSrs[key];
    if (it && typeof it === 'object') {
      const consecutive = it.consecutiveCorrect ?? it.repetitions ?? 0;
      const intervalVal = it.currentInterval ?? it.interval ?? (consecutive > 0 ? SRS_INTERVALS[Math.min(SRS_INTERVALS.length - 1, consecutive - 1)] : 1);
      const dueDateVal = it.nextReviewDate || it.dueDate || todayKey;

      migratedSrs[id] = {
        itemId: it.itemId ?? id,
        questionId: it.questionId ?? id,
        consecutiveCorrect: consecutive,
        repetitions: consecutive,
        currentInterval: intervalVal,
        interval: intervalVal,
        nextReviewDate: dueDateVal,
        dueDate: dueDateVal,
        lastReviewed: it.lastReviewed || Date.now(),
        confidence: it.confidence
      };
    }
  });

  // Ensure any existing mistake has an entry marked due today
  const mistakesList = Array.isArray(raw.mistakes) ? raw.mistakes : [];
  mistakesList.forEach((id: number) => {
    if (!migratedSrs[id]) {
      migratedSrs[id] = {
        itemId: id,
        questionId: id,
        consecutiveCorrect: 0,
        repetitions: 0,
        currentInterval: 1,
        interval: 1,
        nextReviewDate: todayKey,
        dueDate: todayKey,
        lastReviewed: Date.now()
      };
    }
  });

  return {
    ...raw,
    schemaVersion: CURRENT_DATA_VERSION,
    hearts: typeof raw.hearts === 'number' ? raw.hearts : 5,
    maxHearts: typeof raw.maxHearts === 'number' ? raw.maxHearts : 5,
    totalXp: typeof raw.totalXp === 'number' ? raw.totalXp : (raw.xp || 0),
    xp: typeof raw.xp === 'number' ? raw.xp : (raw.totalXp || 0),
    streakDays: typeof raw.streakDays === 'number' ? raw.streakDays : (raw.streak || 1),
    streak: typeof raw.streak === 'number' ? raw.streak : (raw.streakDays || 1),
    lastPracticeDate: typeof raw.lastPracticeDate === 'string' ? raw.lastPracticeDate : todayKey,
    completedLessons: Array.isArray(raw.completedLessons) ? raw.completedLessons : [],
    completedQuestions: (raw.completedQuestions && typeof raw.completedQuestions === 'object') ? raw.completedQuestions : {},
    mistakes: mistakesList,
    bookmarkedQuestions: Array.isArray(raw.bookmarkedQuestions) ? raw.bookmarkedQuestions : (Array.isArray(raw.starredIds) ? raw.starredIds : []),
    starredIds: Array.isArray(raw.starredIds) ? raw.starredIds : [],
    infiniteHearts: Boolean(raw.infiniteHearts),
    soundEnabled: raw.soundEnabled !== false,
    autoTranslate: Boolean(raw.autoTranslate),
    history: (raw.history && typeof raw.history === 'object') ? raw.history : {},
    attemptHistory: Array.isArray(raw.attemptHistory) ? raw.attemptHistory : [],
    spacedRepetition: migratedSrs
  };
}

/**
 * Migrates a CaseProgress object to current schema version (version 2).
 * Establishes per-case spaced repetition schedule for every case.
 */
export function migrateCaseProgress(
  raw: any,
  todayKey: string = formatDateKey()
): CaseProgress {
  if (!raw || typeof raw !== 'object') {
    return {
      schemaVersion: CURRENT_DATA_VERSION,
      reviewedCaseIds: [],
      caseSelfRating: {},
      bookmarkedCaseIds: [],
      caseSpacedRepetition: {},
      casePretests: {},
      caseElaborations: {}
    };
  }

  const existingRatings = (raw.caseSelfRating && typeof raw.caseSelfRating === 'object')
    ? raw.caseSelfRating
    : {};

  const existingCaseSrs = (raw.caseSpacedRepetition && typeof raw.caseSpacedRepetition === 'object')
    ? { ...raw.caseSpacedRepetition }
    : {};

  const migratedCaseSrs: Record<number, SpacedRepetitionItem> = {};

  // Standardize existing case SRS
  Object.keys(existingCaseSrs).forEach(key => {
    const id = Number(key);
    const it = existingCaseSrs[key];
    if (it && typeof it === 'object') {
      const consecutive = it.consecutiveCorrect ?? it.repetitions ?? 0;
      const intervalVal = it.currentInterval ?? it.interval ?? (consecutive > 0 ? SRS_INTERVALS[Math.min(SRS_INTERVALS.length - 1, consecutive - 1)] : 1);
      const dueDateVal = it.nextReviewDate || it.dueDate || todayKey;

      migratedCaseSrs[id] = {
        itemId: it.itemId ?? id,
        consecutiveCorrect: consecutive,
        repetitions: consecutive,
        currentInterval: intervalVal,
        interval: intervalVal,
        nextReviewDate: dueDateVal,
        dueDate: dueDateVal,
        lastReviewed: it.lastReviewed || Date.now()
      };
    }
  });

  // Schedule any case with a self-rating if missing from case SRS
  Object.keys(existingRatings).forEach(key => {
    const caseId = Number(key);
    if (!migratedCaseSrs[caseId]) {
      const rating = existingRatings[caseId];
      if (rating === 'needs_review') {
        migratedCaseSrs[caseId] = {
          itemId: caseId,
          consecutiveCorrect: 0,
          repetitions: 0,
          currentInterval: 1,
          interval: 1,
          nextReviewDate: todayKey,
          dueDate: todayKey,
          lastReviewed: Date.now()
        };
      } else if (rating === 'knew_it' || rating === 'mastered') {
        const [tY, tM, tD] = todayKey.split('-').map(Number);
        const targetDate = new Date(tY, tM - 1, tD + 1);
        const dueKey = formatDateKey(targetDate);
        migratedCaseSrs[caseId] = {
          itemId: caseId,
          consecutiveCorrect: 1,
          repetitions: 1,
          currentInterval: 1,
          interval: 1,
          nextReviewDate: dueKey,
          dueDate: dueKey,
          lastReviewed: Date.now()
        };
      }
    }
  });

  return {
    ...raw,
    schemaVersion: CURRENT_DATA_VERSION,
    reviewedCaseIds: Array.isArray(raw.reviewedCaseIds) ? raw.reviewedCaseIds : [],
    caseSelfRating: existingRatings,
    bookmarkedCaseIds: Array.isArray(raw.bookmarkedCaseIds) ? raw.bookmarkedCaseIds : [],
    caseSpacedRepetition: migratedCaseSrs,
    casePretests: raw.casePretests || {},
    caseElaborations: raw.caseElaborations || {}
  };
}

/**
 * Successive Relearning re-queue rule for clinical cases (Higham et al., Rawson & Dunlosky).
 * When a case is marked as "needs_review" (or graded as unsatisfactory by AI),
 * re-inserts that case 3-4 cases later in the session (or at the end if fewer than 4 remain),
 * mirroring the exact re-queue logic used for MCQs.
 * Capped at 1 re-queue per case within a session (2 attempts maximum),
 * preventing infinite retry loops.
 */
export function requeueCaseForSuccessiveRelearning(
  currentCases: ClinicalCase[],
  currentIndex: number,
  caseToRequeue: ClinicalCase,
  retryCountPerCase: Record<number, number> = {},
  maxRetriesPerCase: number = 1
): {
  updatedCases: ClinicalCase[];
  requeued: boolean;
  updatedRetryCounts: Record<number, number>;
} {
  const caseId = caseToRequeue.id;
  const currentRetries = retryCountPerCase[caseId] || 0;

  // Enforce retry cap: max 1 re-queue (2 attempts total per session)
  if (currentRetries >= maxRetriesPerCase) {
    return {
      updatedCases: currentCases,
      requeued: false,
      updatedRetryCounts: retryCountPerCase
    };
  }

  // Prevent duplicate queuing if the case is already queued ahead in the remaining session
  const alreadyQueuedAhead = currentCases
    .slice(currentIndex + 1)
    .some(c => c.id === caseId);

  if (alreadyQueuedAhead) {
    return {
      updatedCases: currentCases,
      requeued: false,
      updatedRetryCounts: retryCountPerCase
    };
  }

  const updatedCases = [...currentCases];
  const remaining = updatedCases.length - (currentIndex + 1);

  if (remaining <= 3) {
    updatedCases.push(caseToRequeue);
  } else {
    const offset = Math.min(remaining, 4);
    const insertIndex = currentIndex + 1 + offset;
    updatedCases.splice(insertIndex, 0, caseToRequeue);
  }

  return {
    updatedCases,
    requeued: true,
    updatedRetryCounts: {
      ...retryCountPerCase,
      [caseId]: currentRetries + 1
    }
  };
}

/**
 * Calculates session stats for successive relearning in clinical cases:
 * - uniqueSessionCaseIds: array of unique case IDs in the session
 * - totalUniqueCases: initial total unique cases in the session
 * - masteredInSession: number of unique cases in this session rated 'knew_it' or 'mastered'
 * - queuedForRetry: number of re-queued cases pending in the remaining session queue
 * - isRepeat: whether current case is a repeat presentation
 */
export function getCaseSessionRelearningStats(
  sessionCases: ClinicalCase[],
  currentIndex: number,
  caseSelfRating: Record<number, 'knew_it' | 'needs_review' | 'mastered' | undefined | null>,
  initialTotalCases?: number
): {
  uniqueSessionCaseIds: number[];
  totalUniqueCases: number;
  masteredInSession: number;
  queuedForRetry: number;
  isRepeat: boolean;
} {
  const currentCase = sessionCases[currentIndex];
  const uniqueSessionCaseIds = Array.from(new Set(sessionCases.map(c => c.id)));
  const totalUniqueCases = initialTotalCases ?? uniqueSessionCaseIds.length;

  const masteredInSession = uniqueSessionCaseIds.filter(id => {
    const rating = caseSelfRating[id];
    return rating === 'knew_it' || rating === 'mastered';
  }).length;

  // Count re-queued cases waiting in the queue ahead of current index
  const remainingCases = sessionCases.slice(currentIndex + 1);
  const queuedForRetry = remainingCases.filter((c, idx) => {
    const absoluteIndex = currentIndex + 1 + idx;
    return sessionCases.slice(0, absoluteIndex).some(prev => prev.id === c.id);
  }).length;

  const isRepeat = currentIndex > 0 && currentCase
    ? sessionCases.slice(0, currentIndex).some(c => c.id === currentCase.id)
    : false;

  return {
    uniqueSessionCaseIds,
    totalUniqueCases,
    masteredInSession,
    queuedForRetry,
    isRepeat
  };
}

