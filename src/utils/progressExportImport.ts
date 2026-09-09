import { UserProgress, CaseProgress } from '../types';
import { migrateUserProgress, migrateCaseProgress, CURRENT_DATA_VERSION } from './spacedRepetition';

export const EXPORT_SCHEMA_VERSION = 2;
export const APP_ID = 'russian-medical-mcq-duoprep';

export interface ExportedProgressData {
  schemaVersion: number;
  appId: string;
  exportedAt: string;
  progress: UserProgress;
  caseProgress: CaseProgress;
}

export type ValidationResult =
  | { success: true; data: ExportedProgressData; error?: never }
  | { success: false; error: string; data?: never };

/**
 * Serializes user progress and case progress into a formatted JSON blob
 * and triggers a browser file download.
 */
export function exportProgressToFile(
  progress: UserProgress,
  caseProgress: CaseProgress,
  currentDate: Date = new Date()
): void {
  const exportPayload: ExportedProgressData = {
    schemaVersion: EXPORT_SCHEMA_VERSION,
    appId: APP_ID,
    exportedAt: currentDate.toISOString(),
    progress,
    caseProgress
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const dateString = currentDate.toISOString().split('T')[0];
  const filename = `surgery-exam-progress-${dateString}.json`;

  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);

  // Clean up object URL after a short delay
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Validates whether the given raw data or JSON string meets the ExportedProgressData schema.
 * Rejects invalid JSON, incompatible schema versions, or missing required fields.
 */
export function parseAndValidateImportData(raw: unknown): ValidationResult {
  let parsed: any = raw;

  if (typeof raw === 'string') {
    try {
      parsed = JSON.parse(raw);
    } catch {
      return {
        success: false,
        error: 'Invalid file format: The selected file is not valid JSON.'
      };
    }
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return {
      success: false,
      error: 'Invalid file contents: Backup data must be a JSON object.'
    };
  }

  // Schema version check
  if (typeof parsed.schemaVersion !== 'number') {
    return {
      success: false,
      error: 'Missing schema version: The file lacks a valid "schemaVersion" field.'
    };
  }

  if (parsed.schemaVersion > EXPORT_SCHEMA_VERSION) {
    return {
      success: false,
      error: `Incompatible backup version (${parsed.schemaVersion}). This app supports backup versions up to ${EXPORT_SCHEMA_VERSION}. Please update the application.`
    };
  }

  if (parsed.schemaVersion < 1) {
    return {
      success: false,
      error: `Unsupported backup version (${parsed.schemaVersion}). Must be version 1 or higher.`
    };
  }

  // Validate MCQ progress section
  if (!parsed.progress || typeof parsed.progress !== 'object' || Array.isArray(parsed.progress)) {
    return {
      success: false,
      error: 'Missing study progress: The file does not contain a valid "progress" section.'
    };
  }

  // Validate Clinical Cases progress section
  if (!parsed.caseProgress || typeof parsed.caseProgress !== 'object' || Array.isArray(parsed.caseProgress)) {
    return {
      success: false,
      error: 'Missing clinical cases progress: The file does not contain a valid "caseProgress" section.'
    };
  }

  // Sanitize and migrate progress to current version
  const sanitizedProgress = migrateUserProgress(parsed.progress);
  const sanitizedCaseProgress = migrateCaseProgress(parsed.caseProgress);

  return {
    success: true,
    data: {
      schemaVersion: CURRENT_DATA_VERSION,
      appId: typeof parsed.appId === 'string' ? parsed.appId : APP_ID,
      exportedAt: typeof parsed.exportedAt === 'string' ? parsed.exportedAt : new Date().toISOString(),
      progress: sanitizedProgress,
      caseProgress: sanitizedCaseProgress
    }
  };
}
