import { Question, ClinicalCase } from '../types';
import { topics } from '../data/topics';

/**
 * Peer-reviewed citation:
 * Interleaved practice (50–125% retention gain over blocked practice):
 * Rohrer & Taylor, npj Science of Learning 2021.
 * 
 * Commonly confused clinical topic clusters in general surgery & emergency medicine:
 * In blocked practice, students identify diagnoses trivially by topic context.
 * In interleaved practice, students must continuously discriminate between
 * competing etiologies (e.g. acute appendicitis vs cholecystitis vs bowel obstruction).
 */
export const CONFUSED_TOPIC_CLUSTERS: Record<string, string[]> = {
  acute_abdomen: [
    'appendicitis',
    'hernias',
    'biliary',
    'obstruction',
    'pancreatitis',
    'ulcer',
    'peritonitis'
  ],
  vascular: [
    'arterial',
    'venous'
  ],
  thoracic: [
    'thoracic_suppuration',
    'pleural',
    'lung_cancer'
  ],
  upper_gi_endocrine: [
    'esophagus',
    'gastric_cancer',
    'thyroid'
  ]
};

/**
 * Resolves which topic ID a question belongs to based on its question number
 */
export function getTopicIdForQuestion(questionNumber: number): string {
  const match = topics.find(
    t => questionNumber >= t.questionRange[0] && questionNumber <= t.questionRange[1]
  );
  return match ? match.id : 'unknown';
}

/**
 * Checks if a topic belongs to a high-confusion cluster (e.g. Acute Abdomen)
 */
export function isConfusedTopic(topicId: string): boolean {
  return Object.values(CONFUSED_TOPIC_CLUSTERS).some(cluster => cluster.includes(topicId));
}

/**
 * Interleaves questions across topics to eliminate blocked-practice biases.
 * 
 * Algorithm:
 * 1. Groups questions by topic.
 * 2. If prioritizeConfused is enabled, topics in the Acute Abdomen & Vascular clusters
 *    are ordered first in each interleaved rotation.
 * 3. Rotates round-robin across distinct topic buckets so that consecutive questions
 *    always test different surgical/medical domains.
 */
export function interleaveQuestions(
  questions: Question[],
  options?: { prioritizeConfused?: boolean; count?: number }
): Question[] {
  if (questions.length <= 1) return [...questions];

  const prioritizeConfused = options?.prioritizeConfused ?? true;

  // Group by topic
  const topicMap = new Map<string, Question[]>();
  for (const q of questions) {
    const topicId = getTopicIdForQuestion(q.number);
    if (!topicMap.has(topicId)) {
      topicMap.set(topicId, []);
    }
    topicMap.get(topicId)!.push(q);
  }

  // Shuffle within each bucket for internal freshness
  topicMap.forEach((qList) => {
    qList.sort(() => 0.5 - Math.random());
  });

  // Sort topic buckets: high-confusion topics prioritized first
  const sortedTopics = Array.from(topicMap.keys()).sort((a, b) => {
    if (prioritizeConfused) {
      const aConfused = isConfusedTopic(a);
      const bConfused = isConfusedTopic(b);
      if (aConfused && !bConfused) return -1;
      if (!aConfused && bConfused) return 1;
    }
    return 0;
  });

  const result: Question[] = [];
  let remainingCount = questions.length;

  // Round-robin cycle across topics
  while (remainingCount > 0) {
    let pickedInCycle = 0;
    for (const topicId of sortedTopics) {
      const list = topicMap.get(topicId);
      if (list && list.length > 0) {
        result.push(list.shift()!);
        remainingCount--;
        pickedInCycle++;
      }
    }
    if (pickedInCycle === 0) break;
  }

  if (options?.count && options.count > 0) {
    return result.slice(0, options.count);
  }

  return result;
}

/**
 * Interleaves clinical cases across topics to eliminate blocked-practice biases.
 */
export function interleaveCases(
  cases: ClinicalCase[],
  options?: { prioritizeConfused?: boolean; count?: number }
): ClinicalCase[] {
  if (cases.length <= 1) return [...cases];

  const prioritizeConfused = options?.prioritizeConfused ?? true;

  // Group by topicId
  const topicMap = new Map<string, ClinicalCase[]>();
  for (const c of cases) {
    const topicId = c.topicId || 'general';
    if (!topicMap.has(topicId)) {
      topicMap.set(topicId, []);
    }
    topicMap.get(topicId)!.push(c);
  }

  // Shuffle within buckets
  topicMap.forEach((cList) => {
    cList.sort(() => 0.5 - Math.random());
  });

  // Prioritize confused topics (Acute Abdomen etc.)
  const sortedTopics = Array.from(topicMap.keys()).sort((a, b) => {
    if (prioritizeConfused) {
      const aConfused = isConfusedTopic(a);
      const bConfused = isConfusedTopic(b);
      if (aConfused && !bConfused) return -1;
      if (!aConfused && bConfused) return 1;
    }
    return 0;
  });

  const result: ClinicalCase[] = [];
  let remainingCount = cases.length;

  while (remainingCount > 0) {
    let pickedInCycle = 0;
    for (const topicId of sortedTopics) {
      const list = topicMap.get(topicId);
      if (list && list.length > 0) {
        result.push(list.shift()!);
        remainingCount--;
        pickedInCycle++;
      }
    }
    if (pickedInCycle === 0) break;
  }

  if (options?.count && options.count > 0) {
    return result.slice(0, options.count);
  }

  return result;
}
