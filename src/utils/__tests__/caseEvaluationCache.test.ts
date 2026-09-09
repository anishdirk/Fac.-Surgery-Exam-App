import { describe, it, expect, beforeEach } from 'vitest';
import {
  normalizeAnswerText,
  generateCaseCacheKey,
  CaseEvaluationCache,
  CaseSubmissionRateLimiter
} from '../caseEvaluationCache';

describe('Case Evaluation Cache and Rate Limiter', () => {
  describe('normalizeAnswerText & generateCaseCacheKey', () => {
    it('normalizes casing and irregular whitespace', () => {
      const input1 = '  Acute   Appendicitis  with local  peritonitis. \n';
      const input2 = 'acute appendicitis with local peritonitis.';
      expect(normalizeAnswerText(input1)).toBe(input2);
    });

    it('generates identical hash keys for matching normalized answers regardless of whitespace/casing', () => {
      const key1 = generateCaseCacheKey(12, '  Laparoscopic   Cholecystectomy ');
      const key2 = generateCaseCacheKey('12', 'laparoscopic cholecystectomy');
      expect(key1).toBe(key2);
    });

    it('generates different hash keys for different cases or answers', () => {
      const key1 = generateCaseCacheKey(1, 'Answer A');
      const key2 = generateCaseCacheKey(2, 'Answer A');
      const key3 = generateCaseCacheKey(1, 'Answer B');
      expect(key1).not.toBe(key2);
      expect(key1).not.toBe(key3);
    });
  });

  describe('CaseEvaluationCache', () => {
    let cache: CaseEvaluationCache;

    beforeEach(() => {
      cache = new CaseEvaluationCache(1000); // 1-second TTL for testing
    });

    it('stores and retrieves cached evaluation results', () => {
      const mockResult = {
        perQuestion: [{ questionId: 'q1', status: 'correct', feedback: 'Great job' }],
        overallSummary: 'Accurate clinical diagnosis.'
      };

      cache.set(101, 'Acute Cholecystitis', mockResult);

      expect(cache.has(101, 'acute cholecystitis')).toBe(true);
      const retrieved = cache.get(101, '  ACUTE   cholecystitis ');
      expect(retrieved).toEqual(mockResult);
    });

    it('returns null on cache miss', () => {
      expect(cache.get(999, 'Non-existent answer')).toBeNull();
    });

    it('expires entries once TTL is exceeded', async () => {
      const shortTtlCache = new CaseEvaluationCache(50); // 50ms TTL
      shortTtlCache.set(202, 'Pancreatitis', { score: 100 });

      expect(shortTtlCache.get(202, 'Pancreatitis')).toEqual({ score: 100 });

      await new Promise(resolve => setTimeout(resolve, 60));

      expect(shortTtlCache.get(202, 'Pancreatitis')).toBeNull();
    });
  });

  describe('CaseSubmissionRateLimiter', () => {
    let rateLimiter: CaseSubmissionRateLimiter;

    beforeEach(() => {
      rateLimiter = new CaseSubmissionRateLimiter(10); // 10 seconds cooldown
    });

    it('allows initial submission', () => {
      const check = rateLimiter.check('session_user_1', 1);
      expect(check.allowed).toBe(true);
    });

    it('blocks immediate resubmission within cooldown window', () => {
      const now = 1000000;
      rateLimiter.record('session_user_1', 1, now);

      // Check 3 seconds later (still within 10s cooldown)
      const check = rateLimiter.check('session_user_1', 1, 10, now + 3000);
      expect(check.allowed).toBe(false);
      expect(check.waitSeconds).toBe(7);
      expect(check.message).toContain('Please wait 7 seconds');
    });

    it('allows submission after cooldown window expires', () => {
      const now = 1000000;
      rateLimiter.record('session_user_1', 1, now);

      // Check 11 seconds later
      const check = rateLimiter.check('session_user_1', 1, 10, now + 11000);
      expect(check.allowed).toBe(true);
    });

    it('tracks cooldowns independently across different cases for the same user', () => {
      const now = 1000000;
      rateLimiter.record('session_user_1', 'case_1', now);

      // Submitting case_2 is immediately allowed
      const checkCase2 = rateLimiter.check('session_user_1', 'case_2', 10, now + 1000);
      expect(checkCase2.allowed).toBe(true);
    });

    it('tracks cooldowns independently across different users for the same case', () => {
      const now = 1000000;
      rateLimiter.record('session_user_1', 5, now);

      // User 2 submitting case 5 is immediately allowed
      const checkUser2 = rateLimiter.check('session_user_2', 5, 10, now + 1000);
      expect(checkUser2.allowed).toBe(true);
    });
  });
});
