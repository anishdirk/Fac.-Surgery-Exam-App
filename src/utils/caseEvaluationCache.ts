import crypto from 'crypto';

export interface CachedEvaluation {
  result: any;
  timestamp: number;
}

export const DEFAULT_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
export const DEFAULT_COOLDOWN_SECONDS = 10;

/**
 * Normalizes answer text by trimming leading/trailing whitespace,
 * collapsing internal consecutive whitespace, and converting to lowercase.
 */
export function normalizeAnswerText(text: string): string {
  if (!text) return '';
  return text.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Normalizes case ID into a clean string representation.
 */
export function normalizeCaseId(caseId?: string | number | null): string {
  if (caseId === undefined || caseId === null) return 'unknown_case';
  return String(caseId).trim().toLowerCase();
}

/**
 * Generates a deterministic SHA-256 hash based on case ID and normalized answer text.
 */
export function generateCaseCacheKey(caseId: string | number | null | undefined, answerText: string): string {
  const normCase = normalizeCaseId(caseId);
  const normAnswer = normalizeAnswerText(answerText);
  return crypto
    .createHash('sha256')
    .update(`${normCase}:::${normAnswer}`)
    .digest('hex');
}

/**
 * In-memory evaluation cache with TTL expiration.
 */
export class CaseEvaluationCache {
  private cache = new Map<string, CachedEvaluation>();
  private ttlMs: number;

  constructor(ttlMs: number = DEFAULT_CACHE_TTL_MS) {
    this.ttlMs = ttlMs;
  }

  public get(caseId: string | number | null | undefined, answerText: string): any | null {
    const key = generateCaseCacheKey(caseId, answerText);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    const isExpired = Date.now() - entry.timestamp > this.ttlMs;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.result;
  }

  public set(caseId: string | number | null | undefined, answerText: string, result: any): void {
    const key = generateCaseCacheKey(caseId, answerText);
    this.cache.set(key, {
      result,
      timestamp: Date.now()
    });
  }

  public has(caseId: string | number | null | undefined, answerText: string): boolean {
    return this.get(caseId, answerText) !== null;
  }

  public size(): number {
    return this.cache.size;
  }

  public clear(): void {
    this.cache.clear();
  }
}

export interface CooldownCheckResult {
  allowed: boolean;
  waitSeconds?: number;
  message?: string;
}

/**
 * Lightweight per-user / per-session cooldown tracker.
 */
export class CaseSubmissionRateLimiter {
  private userLastSubmissions = new Map<string, number>();
  private defaultCooldownSeconds: number;

  constructor(defaultCooldownSeconds: number = DEFAULT_COOLDOWN_SECONDS) {
    this.defaultCooldownSeconds = defaultCooldownSeconds;
  }

  /**
   * Checks if the user is allowed to submit an evaluation for the specified case.
   */
  public check(
    userSessionId: string,
    caseId: string | number | null | undefined,
    cooldownSeconds: number = this.defaultCooldownSeconds,
    now: number = Date.now()
  ): CooldownCheckResult {
    const normUser = String(userSessionId || 'anonymous').trim();
    const normCase = normalizeCaseId(caseId);
    const trackingKey = `${normUser}:::${normCase}`;

    const lastTime = this.userLastSubmissions.get(trackingKey);
    const cooldownMs = cooldownSeconds * 1000;

    if (lastTime && now - lastTime < cooldownMs) {
      const remainingMs = cooldownMs - (now - lastTime);
      const waitSeconds = Math.max(1, Math.ceil(remainingMs / 1000));
      return {
        allowed: false,
        waitSeconds,
        message: `Please wait ${waitSeconds} second${waitSeconds === 1 ? '' : 's'} before resubmitting an answer for this case.`
      };
    }

    return {
      allowed: true
    };
  }

  /**
   * Records a new submission timestamp for the user and case.
   */
  public record(
    userSessionId: string,
    caseId: string | number | null | undefined,
    now: number = Date.now()
  ): void {
    const normUser = String(userSessionId || 'anonymous').trim();
    const normCase = normalizeCaseId(caseId);
    const trackingKey = `${normUser}:::${normCase}`;
    this.userLastSubmissions.set(trackingKey, now);
  }

  public reset(): void {
    this.userLastSubmissions.clear();
  }
}
