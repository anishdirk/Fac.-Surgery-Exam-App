import { describe, it, expect } from 'vitest';
import {
  calculateNextSrsState,
  isSrsDue,
  getSrsStatusInfo,
  formatDateKey,
  migrateUserProgress,
  migrateCaseProgress,
  CURRENT_DATA_VERSION,
  SRS_INTERVALS
} from '../spacedRepetition';

describe('Spaced Repetition Scheduler', () => {
  it('resets interval and consecutiveCorrect on incorrect answer', () => {
    const fixedNow = new Date('2026-09-08T12:00:00Z');
    const existing = {
      itemId: 42,
      questionId: 42,
      currentInterval: 14,
      interval: 14,
      consecutiveCorrect: 4,
      repetitions: 4,
      nextReviewDate: '2026-09-22',
      dueDate: '2026-09-22',
      lastReviewed: 123456
    };

    const nextState = calculateNextSrsState(42, false, existing, fixedNow);

    expect(nextState.itemId).toBe(42);
    expect(nextState.currentInterval).toBe(1);
    expect(nextState.consecutiveCorrect).toBe(0);
    expect(nextState.nextReviewDate).toBe('2026-09-08');
    // Backward compatibility
    expect(nextState.questionId).toBe(42);
    expect(nextState.interval).toBe(1);
    expect(nextState.repetitions).toBe(0);
    expect(nextState.dueDate).toBe('2026-09-08');
  });

  it('increments consecutiveCorrect and scales intervals: 1, 3, 7, 14, 28 days', () => {
    const fixedNow = new Date('2026-09-08T12:00:00Z');

    // 1st correct answer -> 1 day
    const step1 = calculateNextSrsState(10, true, undefined, fixedNow);
    expect(step1.consecutiveCorrect).toBe(1);
    expect(step1.currentInterval).toBe(1);
    expect(step1.nextReviewDate).toBe('2026-09-09');

    // 2nd correct answer -> 3 days
    const step2 = calculateNextSrsState(10, true, step1, new Date('2026-09-09T12:00:00Z'));
    expect(step2.consecutiveCorrect).toBe(2);
    expect(step2.currentInterval).toBe(3);
    expect(step2.nextReviewDate).toBe('2026-09-12');

    // 3rd correct answer -> 7 days
    const step3 = calculateNextSrsState(10, true, step2, new Date('2026-09-12T12:00:00Z'));
    expect(step3.consecutiveCorrect).toBe(3);
    expect(step3.currentInterval).toBe(7);
    expect(step3.nextReviewDate).toBe('2026-09-19');

    // 4th correct answer -> 14 days
    const step4 = calculateNextSrsState(10, true, step3, new Date('2026-09-19T12:00:00Z'));
    expect(step4.consecutiveCorrect).toBe(4);
    expect(step4.currentInterval).toBe(14);
    expect(step4.nextReviewDate).toBe('2026-10-03');

    // 5th correct answer -> 28 days (Vagha et al. 2025 citation)
    const step5 = calculateNextSrsState(10, true, step4, new Date('2026-10-03T12:00:00Z'));
    expect(step5.consecutiveCorrect).toBe(5);
    expect(step5.currentInterval).toBe(28);
    expect(step5.nextReviewDate).toBe('2026-10-31');
  });

  it('identifies due items correctly based on date comparison', () => {
    const today = '2026-09-08';

    // Due today
    expect(isSrsDue({ itemId: 1, currentInterval: 1, consecutiveCorrect: 0, nextReviewDate: '2026-09-08' }, today)).toBe(true);

    // Overdue from yesterday
    expect(isSrsDue({ itemId: 2, currentInterval: 1, consecutiveCorrect: 0, nextReviewDate: '2026-09-07' }, today)).toBe(true);

    // Future due date
    expect(isSrsDue({ itemId: 3, currentInterval: 3, consecutiveCorrect: 1, nextReviewDate: '2026-09-11' }, today)).toBe(false);

    // Undefined item (new in review queue)
    expect(isSrsDue(undefined, today)).toBe(true);
  });

  it('provides formatted status labels and intervals', () => {
    const today = '2026-09-08';

    const dueInfo = getSrsStatusInfo({ itemId: 1, currentInterval: 1, consecutiveCorrect: 1, nextReviewDate: '2026-09-08' }, today);
    expect(dueInfo.isDue).toBe(true);
    expect(dueInfo.label).toBe('Due Today');

    const futureInfo = getSrsStatusInfo({ itemId: 2, currentInterval: 7, consecutiveCorrect: 3, nextReviewDate: '2026-09-15' }, today);
    expect(futureInfo.isDue).toBe(false);
    expect(futureInfo.label).toBe('Due in 7d');
    expect(futureInfo.intervalDays).toBe(7);
  });

  it('migrates older user progress to schema version 2 cleanly', () => {
    const oldProgress = {
      hearts: 4,
      mistakes: [5, 12],
      spacedRepetition: {
        5: {
          questionId: 5,
          repetitions: 2,
          interval: 3,
          dueDate: '2026-09-10'
        }
      }
    };

    const migrated = migrateUserProgress(oldProgress, '2026-09-08');
    expect(migrated.schemaVersion).toBe(CURRENT_DATA_VERSION);
    expect(migrated.spacedRepetition?.[5]?.consecutiveCorrect).toBe(2);
    expect(migrated.spacedRepetition?.[5]?.currentInterval).toBe(3);
    expect(migrated.spacedRepetition?.[5]?.nextReviewDate).toBe('2026-09-10');
    // Mistake 12 was added to SRS queue due today
    expect(migrated.spacedRepetition?.[12]?.consecutiveCorrect).toBe(0);
    expect(migrated.spacedRepetition?.[12]?.currentInterval).toBe(1);
    expect(migrated.spacedRepetition?.[12]?.nextReviewDate).toBe('2026-09-08');
  });

  it('migrates older case progress to schema version 2 cleanly', () => {
    const oldCaseProgress = {
      reviewedCaseIds: [1, 2],
      caseSelfRating: {
        1: 'needs_review',
        2: 'mastered'
      },
      bookmarkedCaseIds: [1]
    };

    const migrated = migrateCaseProgress(oldCaseProgress, '2026-09-08');
    expect(migrated.schemaVersion).toBe(CURRENT_DATA_VERSION);
    // Case 1 marked needs_review is scheduled due today
    expect(migrated.caseSpacedRepetition?.[1]?.consecutiveCorrect).toBe(0);
    expect(migrated.caseSpacedRepetition?.[1]?.nextReviewDate).toBe('2026-09-08');
    // Case 2 marked mastered has an active schedule
    expect(migrated.caseSpacedRepetition?.[2]?.consecutiveCorrect).toBe(1);
    expect(migrated.caseSpacedRepetition?.[2]?.nextReviewDate).toBe('2026-09-09');
  });
});
