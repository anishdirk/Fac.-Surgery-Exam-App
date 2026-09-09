import { describe, it, expect } from 'vitest';
import {
  parseAndValidateImportData,
  EXPORT_SCHEMA_VERSION,
  ExportedProgressData
} from '../progressExportImport';

describe('Progress Export and Import Validation', () => {
  const validPayload: ExportedProgressData = {
    schemaVersion: 1,
    appId: 'russian-medical-mcq-duoprep',
    exportedAt: '2026-09-08T12:00:00.000Z',
    progress: {
      hearts: 4,
      maxHearts: 5,
      totalXp: 350,
      xp: 350,
      streakDays: 7,
      streak: 7,
      lastPracticeDate: '2026-09-08',
      completedLessons: [1, 2],
      completedQuestions: { 1: true, 2: true },
      mistakes: [3],
      bookmarkedQuestions: [1],
      starredIds: [1],
      infiniteHearts: false,
      soundEnabled: true,
      autoTranslate: true,
      history: {}
    },
    caseProgress: {
      reviewedCaseIds: [101],
      caseSelfRating: { 101: 'mastered' },
      bookmarkedCaseIds: [101]
    }
  };

  it('successfully validates a valid progress export object', () => {
    const result = parseAndValidateImportData(validPayload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.schemaVersion).toBe(EXPORT_SCHEMA_VERSION);
      expect(result.data.progress.totalXp).toBe(350);
      expect(result.data.progress.streakDays).toBe(7);
      expect(result.data.caseProgress.reviewedCaseIds).toEqual([101]);
      expect(result.data.caseProgress.caseSelfRating[101]).toBe('mastered');
    }
  });

  it('successfully parses a valid JSON string', () => {
    const jsonStr = JSON.stringify(validPayload);
    const result = parseAndValidateImportData(jsonStr);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.progress.completedLessons).toEqual([1, 2]);
    }
  });

  it('rejects corrupt or non-JSON strings', () => {
    const result = parseAndValidateImportData('{ this is not json');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('not valid JSON');
    }
  });

  it('rejects non-object primitives or arrays', () => {
    expect(parseAndValidateImportData(123).success).toBe(false);
    expect(parseAndValidateImportData([]).success).toBe(false);
    expect(parseAndValidateImportData(null).success).toBe(false);
  });

  it('rejects files missing schemaVersion', () => {
    const payloadWithoutVersion = { ...validPayload };
    delete (payloadWithoutVersion as any).schemaVersion;
    const result = parseAndValidateImportData(payloadWithoutVersion);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('schemaVersion');
    }
  });

  it('rejects incompatible future schema versions', () => {
    const futurePayload = { ...validPayload, schemaVersion: 999 };
    const result = parseAndValidateImportData(futurePayload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('Incompatible backup version');
    }
  });

  it('rejects payloads missing progress or caseProgress sections', () => {
    const noProgress = { ...validPayload, progress: undefined };
    expect(parseAndValidateImportData(noProgress).success).toBe(false);

    const noCaseProgress = { ...validPayload, caseProgress: undefined };
    expect(parseAndValidateImportData(noCaseProgress).success).toBe(false);
  });

  it('sanitizes missing subfields to reasonable defaults', () => {
    const minimalPayload = {
      schemaVersion: 1,
      appId: 'russian-medical-mcq-duoprep',
      exportedAt: '2026-09-08T12:00:00.000Z',
      progress: {
        totalXp: 120
      },
      caseProgress: {}
    };

    const result = parseAndValidateImportData(minimalPayload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.progress.hearts).toBe(5);
      expect(result.data.progress.completedLessons).toEqual([]);
      expect(result.data.caseProgress.reviewedCaseIds).toEqual([]);
      expect(result.data.caseProgress.bookmarkedCaseIds).toEqual([]);
    }
  });
});
