import { describe, it, expect } from 'vitest';
import {
  parseCaseComparisonResponse,
  normalizeStatus
} from '../caseComparisonParser';

describe('Case Comparison Response Parsing', () => {
  it('correctly maps valid API JSON response into CaseComparisonResult', () => {
    const rawPayload = {
      overallSummary: 'Good demonstration of clinical reasoning for acute appendicitis.',
      perQuestion: [
        {
          questionId: 'q1',
          status: 'correct',
          feedback: 'Correctly identified acute phlegmonous appendicitis.'
        },
        {
          questionId: 'q2',
          status: 'partial',
          feedback: 'Mentioned ultrasound but omitted diagnostic laparoscopy.'
        }
      ]
    };

    const result = parseCaseComparisonResponse(rawPayload);
    expect(result.overallSummary).toBe('Good demonstration of clinical reasoning for acute appendicitis.');
    expect(result.perQuestion).toHaveLength(2);
    expect(result.perQuestion[0]).toEqual({
      questionId: 'q1',
      status: 'correct',
      feedback: 'Correctly identified acute phlegmonous appendicitis.'
    });
    expect(result.perQuestion[1].status).toBe('partial');
  });

  it('safely parses JSON strings', () => {
    const jsonString = JSON.stringify({
      overallSummary: 'Well structured answer.',
      perQuestion: [
        {
          questionId: 'q1',
          status: 'correct',
          feedback: 'All surgical steps described accurately.'
        }
      ]
    });

    const result = parseCaseComparisonResponse(jsonString);
    expect(result.overallSummary).toBe('Well structured answer.');
    expect(result.perQuestion[0].questionId).toBe('q1');
  });

  it('normalizes status strings and provides safe fallback for unknown statuses', () => {
    expect(normalizeStatus('CORRECT')).toBe('correct');
    expect(normalizeStatus('partial')).toBe('partial');
    expect(normalizeStatus('INCORRECT')).toBe('incorrect');
    expect(normalizeStatus('missing')).toBe('missing');
    expect(normalizeStatus('bogus_status')).toBe('partial');
    expect(normalizeStatus(null)).toBe('partial');
    expect(normalizeStatus(undefined)).toBe('partial');
  });

  it('handles completely malformed or non-JSON payloads without throwing', () => {
    const corruptInputs = [
      '{ invalid json corrupt',
      null,
      undefined,
      12345,
      [],
      {}
    ];

    corruptInputs.forEach((input) => {
      const result = parseCaseComparisonResponse(input, ['q1', 'q2']);
      expect(result).toBeDefined();
      expect(typeof result.overallSummary).toBe('string');
      expect(result.overallSummary.length).toBeGreaterThan(0);
      expect(result.perQuestion).toHaveLength(2);
      expect(result.perQuestion[0].questionId).toBe('q1');
      expect(result.perQuestion[1].questionId).toBe('q2');
      expect(result.perQuestion[0].status).toBe('missing');
    });
  });

  it('backfills expected questions omitted by the AI model', () => {
    const partialPayload = {
      overallSummary: 'Brief response.',
      perQuestion: [
        {
          questionId: 'q1',
          status: 'correct',
          feedback: 'Good diagnosis.'
        }
      ]
    };

    const expectedIds = ['q1', 'q2', 'q3'];
    const result = parseCaseComparisonResponse(partialPayload, expectedIds);

    expect(result.perQuestion).toHaveLength(3);
    expect(result.perQuestion[0].status).toBe('correct');
    expect(result.perQuestion[1].questionId).toBe('q2');
    expect(result.perQuestion[1].status).toBe('missing');
    expect(result.perQuestion[2].questionId).toBe('q3');
    expect(result.perQuestion[2].status).toBe('missing');
  });

  it('supplies fallback values for items with missing fields', () => {
    const payloadWithHoles = {
      overallSummary: '',
      perQuestion: [
        {
          // missing questionId, status, feedback
        }
      ]
    };

    const result = parseCaseComparisonResponse(payloadWithHoles, ['case_q1']);
    expect(result.overallSummary).toContain('Evaluation completed');
    expect(result.perQuestion[0].questionId).toBe('case_q1');
    expect(result.perQuestion[0].status).toBe('partial');
    expect(typeof result.perQuestion[0].feedback).toBe('string');
    expect(result.perQuestion[0].feedback.length).toBeGreaterThan(0);
  });

  it('correctly parses matchedPhrase and expectedPhrase when present in the response', () => {
    const payloadWithPhrases = {
      overallSummary: 'Good performance with minor omissions.',
      perQuestion: [
        {
          questionId: 'q1',
          status: 'incorrect',
          feedback: 'Recommended observation instead of urgent surgical intervention.',
          matchedPhrase: 'observation with oral analgesia',
          expectedPhrase: 'urgent appendectomy'
        },
        {
          questionId: 'q2',
          status: 'missing',
          feedback: 'Did not specify abdominal incision.',
          matchedPhrase: '',
          expectedPhrase: 'right lower quadrant McBurney incision'
        },
        {
          questionId: 'q3',
          status: 'correct',
          feedback: 'Correct diagnostic test chosen.'
          // matchedPhrase and expectedPhrase omitted for backward compatibility
        }
      ]
    };

    const result = parseCaseComparisonResponse(payloadWithPhrases);
    expect(result.perQuestion).toHaveLength(3);

    // Incorrect with both phrases
    expect(result.perQuestion[0].matchedPhrase).toBe('observation with oral analgesia');
    expect(result.perQuestion[0].expectedPhrase).toBe('urgent appendectomy');

    // Missing with empty matchedPhrase (should be omitted or undefined) and non-empty expectedPhrase
    expect(result.perQuestion[1].matchedPhrase).toBeUndefined();
    expect(result.perQuestion[1].expectedPhrase).toBe('right lower quadrant McBurney incision');

    // Backward compatibility: omitted phrases remain undefined without breaking
    expect(result.perQuestion[2].matchedPhrase).toBeUndefined();
    expect(result.perQuestion[2].expectedPhrase).toBeUndefined();
  });
});
