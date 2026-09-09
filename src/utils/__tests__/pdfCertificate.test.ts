import { describe, it, expect, vi } from 'vitest';
import { calculateCertificateData, generateCertificatePdf } from '../pdfCertificate';
import { UserProgress, CaseProgress, Question, Topic } from '../../types';

const mockQuestions: Question[] = [
  { id: 1, number: 1, questionRu: 'Q1', correctKey: 'а', topicId: 'appendicitis', options: [] },
  { id: 2, number: 2, questionRu: 'Q2', correctKey: 'б', topicId: 'hernias', options: [] }
];

const mockTopics: Topic[] = [
  { id: 'appendicitis', order: 1, titleEn: 'Acute Appendicitis', titleRu: 'Острый аппендицит', count: 1, questionRange: [1, 1], icon: 'Activity' },
  { id: 'hernias', order: 2, titleEn: 'Abdominal Hernias', titleRu: 'Грыжи живота', count: 1, questionRange: [2, 2], icon: 'Shield' }
];

describe('PDF Certificate Data & Generation', () => {
  it('correctly calculates certificate metrics and exam readiness verdict', () => {
    const progress: UserProgress = {
      hearts: 5,
      maxHearts: 5,
      totalXp: 250,
      xp: 250,
      streakDays: 14,
      streak: 14,
      lastPracticeDate: '2026-09-08',
      completedLessons: [],
      completedQuestions: {},
      mistakes: [],
      bookmarkedQuestions: [],
      starredIds: [],
      infiniteHearts: false,
      soundEnabled: true,
      autoTranslate: false,
      history: {},
      attemptHistory: [
        { questionId: 1, topicId: 'appendicitis', isCorrect: true, timestamp: 1000 },
        { questionId: 2, topicId: 'hernias', isCorrect: true, timestamp: 2000 }
      ]
    };

    const caseProgress: CaseProgress = {
      reviewedCaseIds: [1, 2],
      caseSelfRating: {},
      bookmarkedCaseIds: []
    };

    const certData = calculateCertificateData(
      'Dr. Elena Rostova',
      progress,
      caseProgress,
      mockQuestions,
      mockTopics,
      78
    );

    expect(certData.candidateName).toBe('Dr. Elena Rostova');
    expect(certData.completionPercent).toBe(100);
    expect(certData.overallAccuracy).toBe(100);
    expect(certData.streakDays).toBe(14);
    expect(certData.casesReviewedCount).toBe(2);
    expect(certData.totalXp).toBe(250);
    expect(certData.examReadinessVerdict).toContain('BOARD EXAM READY');
  });

  it('generates a PDF document and triggers save without crashing', () => {
    const progress: UserProgress = {
      hearts: 5,
      maxHearts: 5,
      totalXp: 0,
      xp: 0,
      streakDays: 1,
      streak: 1,
      lastPracticeDate: '2026-09-08',
      completedLessons: [],
      completedQuestions: {},
      mistakes: [],
      bookmarkedQuestions: [],
      starredIds: [],
      infiniteHearts: false,
      soundEnabled: true,
      autoTranslate: false,
      history: {}
    };

    const caseProgress: CaseProgress = {
      reviewedCaseIds: [],
      caseSelfRating: {},
      bookmarkedCaseIds: []
    };

    expect(() => {
      generateCertificatePdf(
        'Dr. Test',
        progress,
        caseProgress,
        mockQuestions,
        mockTopics
      );
    }).not.toThrow();
  });
});
