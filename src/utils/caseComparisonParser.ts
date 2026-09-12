import { CaseComparisonResult, CaseComparisonStatus, QuestionComparisonFeedback } from '../types';

const VALID_STATUSES: Set<CaseComparisonStatus> = new Set([
  'correct',
  'partial',
  'missing',
  'incorrect'
]);

/**
 * Normalizes an unknown or malformed status string into a valid CaseComparisonStatus.
 */
export function normalizeStatus(rawStatus: unknown): CaseComparisonStatus {
  if (typeof rawStatus === 'string') {
    const trimmed = rawStatus.trim().toLowerCase() as CaseComparisonStatus;
    if (VALID_STATUSES.has(trimmed)) {
      return trimmed;
    }
  }
  return 'partial';
}

/**
 * Safely parses and normalizes the AI case comparison payload from /api/compare-case,
 * guaranteeing a structurally valid CaseComparisonResult even with malformed or missing fields.
 */
export function parseCaseComparisonResponse(
  rawResponse: unknown,
  expectedQuestionIds?: string[]
): CaseComparisonResult {
  let parsed: any = rawResponse;

  if (typeof rawResponse === 'string') {
    try {
      parsed = JSON.parse(rawResponse);
    } catch {
      parsed = {};
    }
  }

  if (!parsed || typeof parsed !== 'object') {
    parsed = {};
  }

  // 1. Overall Summary Validation
  const overallSummary =
    typeof parsed.overallSummary === 'string' && parsed.overallSummary.trim()
      ? parsed.overallSummary.trim()
      : 'Evaluation completed. Review the model answers below to compare key clinical points.';

  // 2. Per-Question Validation
  const perQuestionRaw = Array.isArray(parsed.perQuestion) ? parsed.perQuestion : [];
  const processedQuestions: QuestionComparisonFeedback[] = [];
  const seenQuestionIds = new Set<string>();

  perQuestionRaw.forEach((item: any, index: number) => {
    if (!item || typeof item !== 'object') return;

    const fallbackId = expectedQuestionIds?.[index] || `q${index + 1}`;
    const questionId =
      typeof item.questionId === 'string' && item.questionId.trim()
        ? item.questionId.trim()
        : fallbackId;

    const status = normalizeStatus(item.status);
    const feedback =
      typeof item.feedback === 'string' && item.feedback.trim()
        ? item.feedback.trim()
        : 'Review the authoritative model answer for comprehensive details.';

    const matchedPhrase =
      typeof item.matchedPhrase === 'string' && item.matchedPhrase.trim()
        ? item.matchedPhrase.trim()
        : undefined;

    const expectedPhrase =
      typeof item.expectedPhrase === 'string' && item.expectedPhrase.trim()
        ? item.expectedPhrase.trim()
        : undefined;

    processedQuestions.push({
      questionId,
      status,
      feedback,
      ...(matchedPhrase ? { matchedPhrase } : {}),
      ...(expectedPhrase ? { expectedPhrase } : {})
    });
    seenQuestionIds.add(questionId);
  });

  // 3. If expectedQuestionIds were passed and some were omitted in the AI response, backfill them gracefully
  if (expectedQuestionIds && expectedQuestionIds.length > 0) {
    expectedQuestionIds.forEach((expectedId) => {
      if (!seenQuestionIds.has(expectedId)) {
        processedQuestions.push({
          questionId: expectedId,
          status: 'missing',
          feedback: 'This question was not addressed in the response.'
        });
      }
    });
  }

  return {
    overallSummary,
    perQuestion: processedQuestions
  };
}
