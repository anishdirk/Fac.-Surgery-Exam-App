import { describe, it, expect } from 'vitest';
import {
  calculateMetacognitivePriority,
  sortQuestionsByMetacognitivePriority,
  computeCalibrationReport
} from '../calibration';

describe('Metacognitive Calibration Engine (Higham et al., Koriat et al.)', () => {
  it('gives highest priority to high-confidence errors (clinical danger signal)', () => {
    const highConfError = calculateMetacognitivePriority(false, 'high');
    const medConfError = calculateMetacognitivePriority(false, 'medium');
    const lowConfError = calculateMetacognitivePriority(false, 'low');
    const lowConfCorrect = calculateMetacognitivePriority(true, 'low');
    const highConfCorrect = calculateMetacognitivePriority(true, 'high', 3);

    expect(highConfError).toBe(100);
    expect(medConfError).toBe(75);
    expect(lowConfError).toBe(50);
    expect(lowConfCorrect).toBe(40);
    expect(highConfCorrect).toBeLessThan(10);

    expect(highConfError).toBeGreaterThan(medConfError);
    expect(medConfError).toBeGreaterThan(lowConfError);
    expect(lowConfError).toBeGreaterThan(lowConfCorrect);
  });

  it('sorts review queue prioritizing confident misdiagnoses first', () => {
    const questionIds = [10, 20, 30, 40];
    const history = {
      10: { isCorrect: true, confidence: 'high' as const },
      20: { isCorrect: false, confidence: 'high' as const }, // Should be 1st
      30: { isCorrect: false, confidence: 'low' as const },
      40: { isCorrect: false, confidence: 'medium' as const }
    };

    const sorted = sortQuestionsByMetacognitivePriority(questionIds, history);
    expect(sorted[0]).toBe(20); // High confidence error is #1
    expect(sorted[1]).toBe(40); // Medium confidence error is #2
    expect(sorted[2]).toBe(30); // Low confidence error is #3
    expect(sorted[3]).toBe(10); // High confidence correct is last
  });

  it('computes calibration report and identifies overconfidence vs underconfidence', () => {
    // Overconfidence scenario: answered with high confidence but wrong 3 times
    const overconfidentAttempts = [
      { questionId: 1, isCorrect: false, confidence: 'high' as const },
      { questionId: 2, isCorrect: false, confidence: 'high' as const },
      { questionId: 3, isCorrect: false, confidence: 'high' as const },
      { questionId: 4, isCorrect: true, confidence: 'medium' as const },
      { questionId: 5, isCorrect: true, confidence: 'low' as const },
      { questionId: 6, isCorrect: true, confidence: 'low' as const },
    ];

    const report = computeCalibrationReport(overconfidentAttempts);
    expect(report.overallStatus).toBe('overconfident');
    expect(report.highConfidenceErrorsCount).toBe(3);
    expect(report.highConfidenceErrorQuestionIds).toEqual([1, 2, 3]);
    expect(report.buckets.high.accuracy).toBe(0);
  });

  it('handles insufficient data gracefully', () => {
    const report = computeCalibrationReport([
      { questionId: 1, isCorrect: true, confidence: 'high' as const }
    ]);
    expect(report.overallStatus).toBe('insufficient_data');
  });
});
