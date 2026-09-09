/**
 * Core scoring, combo, heart deduction, and streak calculation utilities.
 */

export interface XpResult {
  xpGained: number;
  newCombo: number;
}

export interface StreakResult {
  nextStreak: number;
  todayString: string;
}

/**
 * Calculates XP earned and updated combo for an answered question.
 * Correct answer awards 10 XP base, plus a 5 XP bonus for streaks of 3 or more (newCombo > 2).
 * Incorrect answer awards 0 XP and resets combo to 0.
 */
export function calculateXpGained(isCorrect: boolean, currentCombo: number): XpResult {
  if (!isCorrect) {
    return {
      xpGained: 0,
      newCombo: 0
    };
  }

  const newCombo = currentCombo + 1;
  const xpGained = 10 + (newCombo > 2 ? 5 : 0);

  return {
    xpGained,
    newCombo
  };
}

/**
 * Calculates remaining hearts after an answer attempt.
 * If incorrect and infinite hearts is off, decrements hearts by 1 down to a minimum of 0.
 */
export function calculateNextHearts(
  currentHearts: number,
  isCorrect: boolean,
  infiniteHearts: boolean = false
): number {
  if (!isCorrect && !infiniteHearts) {
    return Math.max(0, currentHearts - 1);
  }
  return currentHearts;
}

/**
 * Calculates updated streak days based on the last practice date.
 * - Same day practice: keeps existing streak.
 * - Consecutive day practice (yesterday): increments streak by 1.
 * - Broken streak (> 1 day gap or no previous practice): resets streak to 1.
 */
export function calculateNextStreak(
  currentStreak: number,
  lastPracticeDate?: string,
  now: Date = new Date()
): StreakResult {
  const todayString = now.toISOString().split('T')[0];

  if (!lastPracticeDate) {
    return {
      nextStreak: Math.max(1, currentStreak || 1),
      todayString
    };
  }

  if (lastPracticeDate === todayString) {
    return {
      nextStreak: Math.max(1, currentStreak || 1),
      todayString
    };
  }

  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const yesterdayString = yesterday.toISOString().split('T')[0];

  if (lastPracticeDate === yesterdayString) {
    return {
      nextStreak: (currentStreak || 0) + 1,
      todayString
    };
  }

  // Broken streak
  return {
    nextStreak: 1,
    todayString
  };
}
