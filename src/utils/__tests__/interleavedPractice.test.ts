import { describe, it, expect } from 'vitest';
import {
  interleaveQuestions,
  interleaveCases,
  getTopicIdForQuestion,
  isConfusedTopic
} from '../interleavedPractice';
import { Question, ClinicalCase } from '../../types';

describe('Interleaved Practice Scheduler (Rohrer & Taylor 2021)', () => {
  it('correctly maps question numbers to surgical topics', () => {
    // Q1-48 is appendicitis
    expect(getTopicIdForQuestion(1)).toBe('appendicitis');
    expect(getTopicIdForQuestion(48)).toBe('appendicitis');
    // Q49-96 is hernias
    expect(getTopicIdForQuestion(49)).toBe('hernias');
    // Q97-144 is biliary
    expect(getTopicIdForQuestion(100)).toBe('biliary');
    // Q193-240 is pancreatitis
    expect(getTopicIdForQuestion(200)).toBe('pancreatitis');
  });

  it('identifies confused clinical topic clusters', () => {
    expect(isConfusedTopic('appendicitis')).toBe(true);
    expect(isConfusedTopic('hernias')).toBe(true);
    expect(isConfusedTopic('pancreatitis')).toBe(true);
    expect(isConfusedTopic('arterial')).toBe(true);
    expect(isConfusedTopic('venous')).toBe(true);
    expect(isConfusedTopic('non_existent_topic')).toBe(false);
  });

  it('interleaves questions across different topics so consecutive questions are not from the same topic', () => {
    const mockQuestions: Question[] = [
      // 3 Appendicitis questions
      { id: 1, number: 5, topicId: 'appendicitis', questionRu: 'App 1', options: [{ key: 'а', textRu: '1' }], correctKey: 'а' },
      { id: 2, number: 10, topicId: 'appendicitis', questionRu: 'App 2', options: [{ key: 'а', textRu: '1' }], correctKey: 'а' },
      { id: 3, number: 15, topicId: 'appendicitis', questionRu: 'App 3', options: [{ key: 'а', textRu: '1' }], correctKey: 'а' },
      // 3 Hernia questions
      { id: 4, number: 50, topicId: 'hernias', questionRu: 'Hernia 1', options: [{ key: 'а', textRu: '1' }], correctKey: 'а' },
      { id: 5, number: 55, topicId: 'hernias', questionRu: 'Hernia 2', options: [{ key: 'а', textRu: '1' }], correctKey: 'а' },
      { id: 6, number: 60, topicId: 'hernias', questionRu: 'Hernia 3', options: [{ key: 'а', textRu: '1' }], correctKey: 'а' },
      // 2 Biliary questions
      { id: 7, number: 105, topicId: 'biliary', questionRu: 'Biliary 1', options: [{ key: 'а', textRu: '1' }], correctKey: 'а' },
      { id: 8, number: 110, topicId: 'biliary', questionRu: 'Biliary 2', options: [{ key: 'а', textRu: '1' }], correctKey: 'а' }
    ];

    const interleaved = interleaveQuestions(mockQuestions);
    expect(interleaved.length).toBe(mockQuestions.length);

    // Verify round-robin: first 3 questions must belong to 3 different topics!
    const first3Topics = interleaved.slice(0, 3).map(q => getTopicIdForQuestion(q.number));
    const uniqueTopics = new Set(first3Topics);
    expect(uniqueTopics.size).toBe(3);
    expect(uniqueTopics.has('appendicitis')).toBe(true);
    expect(uniqueTopics.has('hernias')).toBe(true);
    expect(uniqueTopics.has('biliary')).toBe(true);
  });

  it('interleaves clinical cases across topics', () => {
    const mockCases: ClinicalCase[] = [
      { id: 1, number: 1, topicId: 'appendicitis', topicTitleEn: 'App', stem: 'Vignette 1', questions: [], answers: [] },
      { id: 2, number: 2, topicId: 'appendicitis', topicTitleEn: 'App', stem: 'Vignette 2', questions: [], answers: [] },
      { id: 3, number: 1, topicId: 'hernias', topicTitleEn: 'Hernia', stem: 'Vignette 3', questions: [], answers: [] },
      { id: 4, number: 1, topicId: 'pancreatitis', topicTitleEn: 'Panc', stem: 'Vignette 4', questions: [], answers: [] }
    ];

    const interleaved = interleaveCases(mockCases);
    expect(interleaved.length).toBe(4);
    // Consecutive items should not repeat the same topic when alternatives exist
    expect(interleaved[0].topicId).not.toBe(interleaved[1].topicId);
  });
});
