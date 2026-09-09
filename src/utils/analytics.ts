import { UserProgress, Question, Topic } from '../types';

export interface AttemptRecord {
  questionId: number;
  topicId: string;
  isCorrect: boolean;
  timestamp: number;
}

export interface TrendPoint {
  index: number;
  date: string;
  label: string;
  accuracy: number; // 0 - 100
  totalAttempts: number;
  totalCorrect: number;
}

export interface TopicAccuracySummary {
  topicId: string;
  titleEn: string;
  titleRu: string;
  totalQuestions: number;
  attemptedUnique: number;
  totalAttempts: number;
  correctAttempts: number;
  accuracy: number; // 0 - 100
  coveragePercent: number; // 0 - 100
  status: 'mastered' | 'proficient' | 'needs-work' | 'unstarted';
  trend: 'improving' | 'stable' | 'declining' | 'neutral';
  trendPoints: TrendPoint[];
}

export interface OverallAnalytics {
  totalAttempts: number;
  totalCorrect: number;
  overallAccuracy: number;
  uniqueAttemptedCount: number;
  totalCurriculumQuestions: number;
  coveragePercent: number;
  strongestTopic: TopicAccuracySummary | null;
  weakestTopic: TopicAccuracySummary | null;
  overallTrend: TrendPoint[];
  topicSummaries: TopicAccuracySummary[];
}

/**
 * Normalizes all attempt records from progress.attemptHistory and progress.history
 */
export function extractChronologicalAttempts(
  progress: UserProgress,
  allQuestions: Question[]
): AttemptRecord[] {
  const questionMap = new Map<number, Question>();
  allQuestions.forEach(q => questionMap.set(q.id, q));

  const records: AttemptRecord[] = [];

  // 1. From logged attempt history
  if (Array.isArray(progress.attemptHistory) && progress.attemptHistory.length > 0) {
    records.push(...progress.attemptHistory);
  }

  // 2. From history map (ensures backward compatibility for older sessions)
  if (progress.history && typeof progress.history === 'object') {
    const loggedQuestionIds = new Set(records.map(r => r.questionId));
    Object.entries(progress.history).forEach(([qIdStr, hist]) => {
      const qId = Number(qIdStr);
      if (!loggedQuestionIds.has(qId) && hist && typeof hist.timestamp === 'number') {
        const q = questionMap.get(qId);
        records.push({
          questionId: qId,
          topicId: q?.topicId || 'general',
          isCorrect: Boolean(hist.isCorrect),
          timestamp: hist.timestamp
        });
      }
    });
  }

  // Sort chronologically
  return records.sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Computes progressive cumulative accuracy trend data points
 */
export function buildTrendPoints(records: AttemptRecord[]): TrendPoint[] {
  if (records.length === 0) return [];

  const points: TrendPoint[] = [];
  let cumAttempts = 0;
  let cumCorrect = 0;

  records.forEach((rec, idx) => {
    cumAttempts++;
    if (rec.isCorrect) {
      cumCorrect++;
    }

    // Capture checkpoints every few attempts or on final to keep charts clean
    const isCheckpoint = 
      idx === 0 || 
      idx === records.length - 1 || 
      (idx + 1) % Math.max(1, Math.floor(records.length / 25)) === 0;

    if (isCheckpoint) {
      const dateObj = new Date(rec.timestamp);
      const dateStr = dateObj.toISOString().split('T')[0];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthName = monthNames[dateObj.getMonth()] || '';
      const dayNum = dateObj.getDate();
      const label = `${monthName} ${dayNum} (#${idx + 1})`;

      points.push({
        index: idx + 1,
        date: dateStr,
        label,
        accuracy: Math.round((cumCorrect / cumAttempts) * 100),
        totalAttempts: cumAttempts,
        totalCorrect: cumCorrect
      });
    }
  });

  return points;
}

/**
 * Generates comprehensive analytics and per-topic trends
 */
export function computeAnalytics(
  progress: UserProgress,
  allQuestions: Question[],
  topics: Topic[]
): OverallAnalytics {
  const attempts = extractChronologicalAttempts(progress, allQuestions);
  const totalCurriculum = allQuestions.length || 620;

  const totalAttempts = attempts.length;
  const totalCorrect = attempts.filter(a => a.isCorrect).length;
  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  // Unique questions attempted
  const uniqueAttempted = new Set(attempts.map(a => a.questionId));
  const uniqueAttemptedCount = uniqueAttempted.size;
  const coveragePercent = Math.min(100, Math.round((uniqueAttemptedCount / totalCurriculum) * 100));

  const overallTrend = buildTrendPoints(attempts);

  // Per-topic breakdown
  const topicMap = new Map<string, AttemptRecord[]>();
  attempts.forEach(att => {
    const list = topicMap.get(att.topicId) || [];
    list.push(att);
    topicMap.set(att.topicId, list);
  });

  const topicSummaries: TopicAccuracySummary[] = topics.map(top => {
    const topAttempts = topicMap.get(top.id) || [];
    const tTotal = topAttempts.length;
    const tCorrect = topAttempts.filter(a => a.isCorrect).length;
    const tAcc = tTotal > 0 ? Math.round((tCorrect / tTotal) * 100) : 0;

    const tUnique = new Set(topAttempts.map(a => a.questionId)).size;
    const tCount = top.count || 40;
    const tCov = Math.min(100, Math.round((tUnique / tCount) * 100));

    let status: TopicAccuracySummary['status'] = 'unstarted';
    if (tTotal > 0) {
      if (tAcc >= 85) status = 'mastered';
      else if (tAcc >= 70) status = 'proficient';
      else status = 'needs-work';
    }

    // Trend calculation: compare first half vs second half if at least 4 attempts
    let trend: TopicAccuracySummary['trend'] = 'neutral';
    if (tTotal >= 4) {
      const mid = Math.floor(tTotal / 2);
      const firstHalf = topAttempts.slice(0, mid);
      const secondHalf = topAttempts.slice(mid);
      const firstAcc = (firstHalf.filter(a => a.isCorrect).length / firstHalf.length) * 100;
      const secondAcc = (secondHalf.filter(a => a.isCorrect).length / secondHalf.length) * 100;
      const diff = secondAcc - firstAcc;
      if (diff >= 5) trend = 'improving';
      else if (diff <= -5) trend = 'declining';
      else trend = 'stable';
    }

    return {
      topicId: top.id,
      titleEn: top.titleEn,
      titleRu: top.titleRu,
      totalQuestions: tCount,
      attemptedUnique: tUnique,
      totalAttempts: tTotal,
      correctAttempts: tCorrect,
      accuracy: tAcc,
      coveragePercent: tCov,
      status,
      trend,
      trendPoints: buildTrendPoints(topAttempts)
    };
  });

  // Calculate strongest & weakest with at least 3 attempts
  const testedTopics = topicSummaries.filter(t => t.totalAttempts >= 3);
  let strongestTopic: TopicAccuracySummary | null = null;
  let weakestTopic: TopicAccuracySummary | null = null;

  if (testedTopics.length > 0) {
    const sorted = [...testedTopics].sort((a, b) => b.accuracy - a.accuracy);
    strongestTopic = sorted[0];
    weakestTopic = sorted[sorted.length - 1];
  }

  return {
    totalAttempts,
    totalCorrect,
    overallAccuracy,
    uniqueAttemptedCount,
    totalCurriculumQuestions: totalCurriculum,
    coveragePercent,
    strongestTopic,
    weakestTopic,
    overallTrend,
    topicSummaries
  };
}
