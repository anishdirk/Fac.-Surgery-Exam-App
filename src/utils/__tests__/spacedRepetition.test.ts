import { describe, it, expect } from 'vitest';
import {
  calculateNextSrsState,
  isSrsDue,
  getSrsStatusInfo,
  formatDateKey,
  migrateUserProgress,
  migrateCaseProgress,
  requeueCaseForSuccessiveRelearning,
  getCaseSessionRelearningStats,
  CURRENT_DATA_VERSION,
  SRS_INTERVALS
} from '../spacedRepetition';
import { ClinicalCase } from '../../types';

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

describe('Successive Relearning for Clinical Cases (Higham et al., Rawson & Dunlosky)', () => {
  const createMockCase = (id: number): ClinicalCase => ({
    id,
    number: id,
    topicId: 'appendicitis',
    stem: `Clinical stem for case ${id}`,
    questions: [{ id: `q${id}-1`, num: 1, text: `Question for case ${id}` }],
    answers: [{ questionId: `q${id}-1`, num: 1, text: `Answer for case ${id}` }]
  });

  it('re-queues a missed case 3-4 cases later when remaining cases > 3', () => {
    // 7 cases: C1 to C7
    const initialCases = [1, 2, 3, 4, 5, 6, 7].map(createMockCase);
    const currentIndex = 0; // Currently on Case 1
    const case1 = initialCases[0];

    const result = requeueCaseForSuccessiveRelearning(
      initialCases,
      currentIndex,
      case1,
      {},
      1
    );

    expect(result.requeued).toBe(true);
    expect(result.updatedRetryCounts[case1.id]).toBe(1);
    expect(result.updatedCases.length).toBe(8);

    // With remaining = 6 (> 3), offset is min(6, 4) = 4, insertIndex = 0 + 1 + 4 = 5
    // Order should be: [C1, C2, C3, C4, C5, C1 (retry), C6, C7]
    expect(result.updatedCases[0].id).toBe(1);
    expect(result.updatedCases[1].id).toBe(2);
    expect(result.updatedCases[2].id).toBe(3);
    expect(result.updatedCases[3].id).toBe(4);
    expect(result.updatedCases[4].id).toBe(5);
    expect(result.updatedCases[5].id).toBe(1); // Re-queued 4 cases later!
    expect(result.updatedCases[6].id).toBe(6);
    expect(result.updatedCases[7].id).toBe(7);
  });

  it('appends to the end when fewer than 4 cases remain (remaining <= 3)', () => {
    // 3 cases: C1, C2, C3. Remaining after C1 is 2 (<= 3).
    const initialCases = [1, 2, 3].map(createMockCase);
    const currentIndex = 0;
    const case1 = initialCases[0];

    const result = requeueCaseForSuccessiveRelearning(
      initialCases,
      currentIndex,
      case1,
      {},
      1
    );

    expect(result.requeued).toBe(true);
    expect(result.updatedCases.length).toBe(4);
    expect(result.updatedCases.map(c => c.id)).toEqual([1, 2, 3, 1]);

    // Single-case session: remaining after C1 is 0 (<= 3)
    const singleCaseList = [createMockCase(99)];
    const singleResult = requeueCaseForSuccessiveRelearning(
      singleCaseList,
      0,
      singleCaseList[0],
      {},
      1
    );
    expect(singleResult.requeued).toBe(true);
    expect(singleResult.updatedCases.map(c => c.id)).toEqual([99, 99]);
  });

  it('caps re-queues at 1 retry (max 2 attempts per case per session) preventing infinite loops', () => {
    const initialCases = [1, 2, 3, 4, 5].map(createMockCase);
    const case1 = initialCases[0];

    // First attempt: marked needs_review -> should re-queue
    const firstAttempt = requeueCaseForSuccessiveRelearning(
      initialCases,
      0,
      case1,
      {},
      1
    );
    expect(firstAttempt.requeued).toBe(true);
    expect(firstAttempt.updatedRetryCounts[1]).toBe(1);

    // Second attempt: user encounters the retry at index 5 and marks needs_review again
    const retryCases = firstAttempt.updatedCases;
    const secondAttempt = requeueCaseForSuccessiveRelearning(
      retryCases,
      5, // Currently at the retry index
      case1,
      firstAttempt.updatedRetryCounts, // retryCount is already 1
      1 // maxRetriesPerCase capped at 1
    );

    // Should NOT re-queue again; caps at 2 attempts per case
    expect(secondAttempt.requeued).toBe(false);
    expect(secondAttempt.updatedCases.length).toBe(retryCases.length);
    expect(secondAttempt.updatedRetryCounts[1]).toBe(1);
  });

  it('prevents duplicate queuing if the case is already scheduled in the remaining session', () => {
    // Case 1 is already scheduled at index 4
    const cases = [1, 2, 3, 4, 1, 5].map(createMockCase);
    const currentIndex = 0; // Currently on Case 1

    const result = requeueCaseForSuccessiveRelearning(
      cases,
      currentIndex,
      cases[0],
      {}, // retryCount is 0, but case is already queued ahead
      1
    );

    expect(result.requeued).toBe(false);
    expect(result.updatedCases.length).toBe(cases.length);
  });

  it('computes accurate session stats for mastered items, retries, and repeat badge', () => {
    // Session with 3 cases originally, where Case 1 was re-queued at the end
    const session = [
      createMockCase(1),
      createMockCase(2),
      createMockCase(3),
      createMockCase(1) // Re-queued retry at index 3
    ];

    // At index 0 (Case 1, first encounter, rated needs_review):
    const ratings: Record<number, 'knew_it' | 'needs_review' | 'mastered'> = {
      1: 'needs_review',
      2: 'knew_it'
    };

    const statsAtStart = getCaseSessionRelearningStats(
      session,
      0,
      ratings,
      3
    );

    expect(statsAtStart.totalUniqueCases).toBe(3);
    expect(statsAtStart.masteredInSession).toBe(1); // only Case 2 is mastered
    expect(statsAtStart.queuedForRetry).toBe(1); // Case 1 is waiting ahead at index 3
    expect(statsAtStart.isRepeat).toBe(false); // Index 0 is the first appearance

    // At index 3 (Case 1 retry):
    const statsAtRetry = getCaseSessionRelearningStats(
      session,
      3,
      ratings,
      3
    );

    expect(statsAtRetry.queuedForRetry).toBe(0); // None remaining ahead
    expect(statsAtRetry.isRepeat).toBe(true); // Index 3 is a repeat presentation!
  });
});

