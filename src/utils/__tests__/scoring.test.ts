import { describe, it, expect } from 'vitest';
import {
  calculateXpGained,
  calculateNextHearts,
  calculateNextStreak
} from '../scoring';

describe('Scoring Logic', () => {
  it('awards 10 base XP and increments combo for correct answers below combo 3', () => {
    const result = calculateXpGained(true, 0);
    expect(result.xpGained).toBe(10);
    expect(result.newCombo).toBe(1);

    const result2 = calculateXpGained(true, 1);
    expect(result2.xpGained).toBe(10);
    expect(result2.newCombo).toBe(2);
  });

  it('awards 15 XP (10 base + 5 bonus) for combos of 3 or higher', () => {
    const result = calculateXpGained(true, 2);
    expect(result.xpGained).toBe(15);
    expect(result.newCombo).toBe(3);

    const resultHigh = calculateXpGained(true, 5);
    expect(resultHigh.xpGained).toBe(15);
    expect(resultHigh.newCombo).toBe(6);
  });

  it('awards 0 XP and resets combo to 0 for incorrect answers', () => {
    const result = calculateXpGained(false, 4);
    expect(result.xpGained).toBe(0);
    expect(result.newCombo).toBe(0);
  });
});

describe('Hearts Logic', () => {
  it('deducts one heart on incorrect answer when infinite hearts is disabled', () => {
    expect(calculateNextHearts(5, false, false)).toBe(4);
    expect(calculateNextHearts(1, false, false)).toBe(0);
    expect(calculateNextHearts(0, false, false)).toBe(0);
  });

  it('does not deduct hearts on correct answers', () => {
    expect(calculateNextHearts(5, true, false)).toBe(5);
    expect(calculateNextHearts(3, true, false)).toBe(3);
  });

  it('preserves hearts on incorrect answers when infinite hearts is enabled', () => {
    expect(calculateNextHearts(5, false, true)).toBe(5);
    expect(calculateNextHearts(2, false, true)).toBe(2);
  });
});

describe('Streak Logic', () => {
  it('initializes streak to at least 1 when no prior practice date exists', () => {
    const today = new Date('2026-09-07T12:00:00Z');
    const result = calculateNextStreak(0, undefined, today);
    expect(result.nextStreak).toBe(1);
    expect(result.todayString).toBe('2026-09-07');
  });

  it('keeps current streak when practicing again on the same day', () => {
    const today = new Date('2026-09-07T12:00:00Z');
    const result = calculateNextStreak(5, '2026-09-07', today);
    expect(result.nextStreak).toBe(5);
    expect(result.todayString).toBe('2026-09-07');
  });

  it('increments streak by 1 when practicing on the consecutive day (yesterday)', () => {
    const today = new Date('2026-09-07T12:00:00Z');
    const result = calculateNextStreak(5, '2026-09-06', today);
    expect(result.nextStreak).toBe(6);
    expect(result.todayString).toBe('2026-09-07');
  });

  it('resets streak to 1 when a day is skipped', () => {
    const today = new Date('2026-09-07T12:00:00Z');
    const result = calculateNextStreak(10, '2026-09-04', today);
    expect(result.nextStreak).toBe(1);
    expect(result.todayString).toBe('2026-09-07');
  });
});
