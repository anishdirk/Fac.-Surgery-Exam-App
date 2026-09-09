import { ConfidenceLevel } from '../types';

export interface CalibrationBucket {
  confidence: ConfidenceLevel;
  label: string;
  expectedAccuracy: number; // Percentage, e.g. 33, 65, 90
  count: number;
  correctCount: number;
  accuracy: number; // 0 to 100
  gap: number; // actual - expected
}

export interface CalibrationReport {
  totalRatedAttempts: number;
  buckets: Record<ConfidenceLevel, CalibrationBucket>;
  overallStatus: 'well_calibrated' | 'overconfident' | 'underconfident' | 'insufficient_data';
  brierScore: number; // Mean squared error between confidence probability and outcome (0 = perfect calibration)
  highConfidenceErrorsCount: number;
  highConfidenceErrorQuestionIds: number[];
  summaryMessageEn: string;
}

/**
 * Calculates metacognitive priority for spaced-repetition and review queues.
 * Based on Higham et al. & Koriat et al. (NIH metacognition literature):
 * A confidently-wrong answer is a clinical danger signal and receives the highest review priority.
 */
export function calculateMetacognitivePriority(
  isCorrect: boolean,
  confidence: ConfidenceLevel = 'medium',
  consecutiveCorrect: number = 0
): number {
  if (!isCorrect) {
    switch (confidence) {
      case 'high':
        // Clinical Danger Signal: Diagnosed wrongly with high certainty
        return 100;
      case 'medium':
        return 75;
      case 'low':
        return 50;
    }
  }

  // If correct:
  switch (confidence) {
    case 'low':
      // Fragile retrieval / lucky guess: needs prompt reinforcement
      return 40;
    case 'medium':
      return Math.max(10, 25 - consecutiveCorrect * 5);
    case 'high':
      // Solid knowledge: low priority for immediate re-test
      return Math.max(1, 10 - consecutiveCorrect * 3);
  }
}

/**
 * Sorts question IDs by metacognitive priority, putting high-confidence errors first.
 */
export function sortQuestionsByMetacognitivePriority(
  questionIds: number[],
  history: Record<number, { isCorrect: boolean; confidence?: ConfidenceLevel }>,
  spacedRepetition: Record<number, { consecutiveCorrect?: number }> = {}
): number[] {
  return [...questionIds].sort((a, b) => {
    const histA = history[a];
    const histB = history[b];
    const srsA = spacedRepetition[a];
    const srsB = spacedRepetition[b];

    const priorityA = histA
      ? calculateMetacognitivePriority(histA.isCorrect, histA.confidence || 'medium', srsA?.consecutiveCorrect || 0)
      : 50;
    const priorityB = histB
      ? calculateMetacognitivePriority(histB.isCorrect, histB.confidence || 'medium', srsB?.consecutiveCorrect || 0)
      : 50;

    return priorityB - priorityA;
  });
}

/**
 * Computes calibration metrics comparing subjective certainty against objective accuracy.
 */
export function computeCalibrationReport(
  attempts: Array<{ questionId?: number; isCorrect: boolean; confidence?: ConfidenceLevel }>
): CalibrationReport {
  const rated = attempts.filter(a => a.confidence !== undefined);

  const buckets: Record<ConfidenceLevel, CalibrationBucket> = {
    low: {
      confidence: 'low',
      label: 'Low (Unsure / Guess)',
      expectedAccuracy: 35,
      count: 0,
      correctCount: 0,
      accuracy: 0,
      gap: 0,
    },
    medium: {
      confidence: 'medium',
      label: 'Medium (Fairly Confident)',
      expectedAccuracy: 65,
      count: 0,
      correctCount: 0,
      accuracy: 0,
      gap: 0,
    },
    high: {
      confidence: 'high',
      label: 'High (Very Sure / Definite)',
      expectedAccuracy: 90,
      count: 0,
      correctCount: 0,
      accuracy: 0,
      gap: 0,
    },
  };

  const highConfErrorIds: number[] = [];
  let sumSquaredDiff = 0;

  for (const attempt of rated) {
    const conf = attempt.confidence!;
    buckets[conf].count += 1;
    if (attempt.isCorrect) {
      buckets[conf].correctCount += 1;
    } else if (conf === 'high') {
      if (attempt.questionId !== undefined && !highConfErrorIds.includes(attempt.questionId)) {
        highConfErrorIds.push(attempt.questionId);
      }
    }

    // Probability mapping for Brier score
    const subjectiveProb = conf === 'low' ? 0.35 : conf === 'medium' ? 0.65 : 0.90;
    const actualOutcome = attempt.isCorrect ? 1 : 0;
    sumSquaredDiff += Math.pow(subjectiveProb - actualOutcome, 2);
  }

  for (const key of ['low', 'medium', 'high'] as ConfidenceLevel[]) {
    const b = buckets[key];
    b.accuracy = b.count > 0 ? Math.round((b.correctCount / b.count) * 100) : 0;
    b.gap = b.count > 0 ? b.accuracy - b.expectedAccuracy : 0;
  }

  const brierScore = rated.length > 0 ? Number((sumSquaredDiff / rated.length).toFixed(3)) : 0;

  if (rated.length < 5) {
    return {
      totalRatedAttempts: rated.length,
      buckets,
      overallStatus: 'insufficient_data',
      brierScore,
      highConfidenceErrorsCount: highConfErrorIds.length,
      highConfidenceErrorQuestionIds: highConfErrorIds,
      summaryMessageEn: 'Complete at least 5 questions with confidence ratings to generate your metacognitive calibration curve.',
    };
  }

  const highBucket = buckets.high;
  let overallStatus: CalibrationReport['overallStatus'] = 'well_calibrated';
  let summaryMessageEn = 'Well-calibrated: Your subjective certainty closely matches actual diagnostic accuracy.';

  if (highBucket.count >= 3 && highBucket.accuracy < 70) {
    overallStatus = 'overconfident';
    summaryMessageEn = `Clinical Danger Signal: You were highly confident on missed questions (${highBucket.accuracy}% vs expected ${highBucket.expectedAccuracy}%). Review these priority items!`;
  } else if (buckets.low.count >= 3 && buckets.low.accuracy > 65) {
    overallStatus = 'underconfident';
    summaryMessageEn = `Conservative Calibrator: Your low-confidence guesses are frequently correct (${buckets.low.accuracy}% accuracy). Trust your surgical intuition!`;
  }

  return {
    totalRatedAttempts: rated.length,
    buckets,
    overallStatus,
    brierScore,
    highConfidenceErrorsCount: highConfErrorIds.length,
    highConfidenceErrorQuestionIds: highConfErrorIds,
    summaryMessageEn,
  };
}
