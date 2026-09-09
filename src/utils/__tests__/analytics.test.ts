import { describe, it, expect } from 'vitest';
import {
  extractChronologicalAttempts,
  buildTrendPoints,
  computeAnalytics
} from '../analytics';
import { UserProgress, Question, Topic } from '../../types';

const mockQuestions: Question[] = [
  { id: 1, number: 1, questionRu: 'Q1', correctKey: 'а', topicId: 'appendicitis', options: [] },
  { id: 2, number: 2, questionRu: 'Q2', correctKey: 'б', topicId: 'appendicitis', options: [] },
  { id: 3, number: 3, questionRu: 'Q3', correctKey: 'в', topicId: 'hernias', options: [] },
  { id: 4, number: 4, questionRu: 'Q4', correctKey: 'г', topicId: 'hernias', options: [] }
];

const mockTopics: Topic[] = [
  { id: 'appendicitis', order: 1, titleEn: 'Acute Appendicitis', titleRu: 'Острый аппендицит', count: 2, questionRange: [1, 2], icon: 'Activity' },
  { id: 'hernias', order: 2, titleEn: 'Abdominal Hernias', titleRu: 'Грыжи живота', count: 2, questionRange: [3, 4], icon: 'Shield' }
];

describe('Analytics Calculations', () => {
  it('extracts chronological attempts from both attemptHistory and legacy history', () => {
    const progress: UserProgress = {
      hearts: 5,
      maxHearts: 5,
      totalXp: 100,
      xp: 100,
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
      history: {
        1: { selectedKey: 'а', isCorrect: true, timestamp: 1000 },
        2: { selectedKey: 'в', isCorrect: false, timestamp: 2000 }
      },
      attemptHistory: [
        { questionId: 3, topicId: 'hernias', isCorrect: true, timestamp: 3000 }
      ]
    };

    const attempts = extractChronologicalAttempts(progress, mockQuestions);
    expect(attempts.length).toBe(3);
    expect(attempts[0].questionId).toBe(1);
    expect(attempts[1].questionId).toBe(2);
    expect(attempts[2].questionId).toBe(3);
    expect(attempts[0].isCorrect).toBe(true);
    expect(attempts[1].isCorrect).toBe(false);
  });

  it('builds progressive cumulative trend points', () => {
    const attempts = [
      { questionId: 1, topicId: 'appendicitis', isCorrect: true, timestamp: 1000 },
      { questionId: 2, topicId: 'appendicitis', isCorrect: false, timestamp: 2000 },
      { questionId: 3, topicId: 'hernias', isCorrect: true, timestamp: 3000 }
    ];

    const points = buildTrendPoints(attempts);
    expect(points.length).toBeGreaterThan(0);
    // Final point accuracy: 2 / 3 = 67%
    const finalPoint = points[points.length - 1];
    expect(finalPoint.accuracy).toBe(67);
    expect(finalPoint.totalAttempts).toBe(3);
  });

  it('computes overall analytics and topic summaries correctly', () => {
    const progress: UserProgress = {
      hearts: 5,
      maxHearts: 5,
      totalXp: 100,
      xp: 100,
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
      history: {},
      attemptHistory: [
        { questionId: 1, topicId: 'appendicitis', isCorrect: true, timestamp: 1000 },
        { questionId: 1, topicId: 'appendicitis', isCorrect: true, timestamp: 2000 },
        { questionId: 2, topicId: 'appendicitis', isCorrect: true, timestamp: 3000 },
        { questionId: 3, topicId: 'hernias', isCorrect: false, timestamp: 4000 },
        { questionId: 4, topicId: 'hernias', isCorrect: false, timestamp: 5000 },
        { questionId: 3, topicId: 'hernias', isCorrect: true, timestamp: 6000 }
      ]
    };

    const analytics = computeAnalytics(progress, mockQuestions, mockTopics);

    expect(analytics.totalAttempts).toBe(6);
    expect(analytics.totalCorrect).toBe(4);
    expect(analytics.overallAccuracy).toBe(67);
    expect(analytics.uniqueAttemptedCount).toBe(4);

    // Appendicitis: 3 attempts, 3 correct = 100%
    const appSummary = analytics.topicSummaries.find(t => t.topicId === 'appendicitis');
    expect(appSummary?.accuracy).toBe(100);
    expect(appSummary?.status).toBe('mastered');

    // Hernias: 3 attempts, 1 correct = 33%
    const herniaSummary = analytics.topicSummaries.find(t => t.topicId === 'hernias');
    expect(herniaSummary?.accuracy).toBe(33);
    expect(herniaSummary?.status).toBe('needs-work');

    expect(analytics.strongestTopic?.topicId).toBe('appendicitis');
    expect(analytics.weakestTopic?.topicId).toBe('hernias');
  });
});
