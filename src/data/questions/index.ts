import { Question } from '../../types';
import { chunk1Questions } from './chunk1';
import { chunk2Questions } from './chunk2';
import { chunk3Questions } from './chunk3';
import { chunk4Questions } from './chunk4';
import { chunk5Questions } from './chunk5';
import { chunk6Questions } from './chunk6';

export const allQuestions: Question[] = [
  ...chunk1Questions,
  ...chunk2Questions,
  ...chunk3Questions,
  ...chunk4Questions,
  ...chunk5Questions,
  ...chunk6Questions
];

export const getQuestionsByTopic = (topicId: string): Question[] => {
  return allQuestions.filter(q => q.topicId.toLowerCase() === topicId.toLowerCase());
};

export const getQuestionsForLesson = (lessonNumber: number, questionsPerLesson: number = 10): Question[] => {
  const startIndex = (lessonNumber - 1) * questionsPerLesson;
  return allQuestions.slice(startIndex, startIndex + questionsPerLesson);
};

export const getQuestionById = (id: number): Question | undefined => {
  return allQuestions.find(q => q.id === id);
};
