import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  AlertTriangle,
  Play,
  Filter,
  BarChart3,
  Award,
  BookOpen,
  Target,
  Gauge,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { UserProgress, Question, Topic } from '../types';
import { computeAnalytics, TopicAccuracySummary } from '../utils/analytics';
import { computeCalibrationReport } from '../utils/calibration';
import { SoundEffects } from '../utils/audio';

interface AnalyticsViewProps {
  progress: UserProgress;
  allQuestions: Question[];
  topics: Topic[];
  onStartTopicPractice: (topicId: string) => void;
  onQuickPractice: (count: number) => void;
  onOpenCertificate: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  progress,
  allQuestions,
  topics,
  onStartTopicPractice,
  onQuickPractice,
  onOpenCertificate
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>('all');

  const analytics = useMemo(() => {
    return computeAnalytics(progress, allQuestions, topics);
  }, [progress, allQuestions, topics]);

  const calibration = useMemo(() => {
    const attemptsArray = Object.entries(progress.history || {}).map(([qId, item]) => ({
      questionId: Number(qId),
      isCorrect: item.isCorrect,
      confidence: item.confidence,
    }));
    return computeCalibrationReport(attemptsArray);
  }, [progress.history]);

  // Selected chart data (either overall or filtered by specific topic)
  const activeTopicSummary = useMemo(() => {
    if (selectedTopicId === 'all') return null;
    return analytics.topicSummaries.find(t => t.topicId === selectedTopicId) || null;
  }, [selectedTopicId, analytics.topicSummaries]);

  const chartData = useMemo(() => {
    if (activeTopicSummary) {
      return activeTopicSummary.trendPoints;
    }
    return analytics.overallTrend;
  }, [activeTopicSummary, analytics.overallTrend]);

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-8 min-w-0">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#161A23] border border-slate-200 dark:border-slate-800 shadow-xl mb-8 min-w-0">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 min-w-0">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-wider mb-2">
              <BarChart3 className="w-3.5 h-3.5 shrink-0" />
              <span>Performance Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight break-words">
              Accuracy & Topic Trends
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1 max-w-xl break-words">
              Real-time analytics computed directly from your answer history. Track retention growth, identify weak surgical topics, and prepare for board readiness.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => {
                SoundEffects.playClick();
                onOpenCertificate();
              }}
              className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-emerald-500 active:scale-95 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm tracking-wide shadow-xs flex items-center gap-2 transition-all"
            >
              <Award className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Export Certificate (PDF)</span>
            </button>

            <button
              onClick={() => {
                SoundEffects.playClick();
                onQuickPractice(10);
              }}
              className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wide shadow-sm dark:shadow-[0_0_20px_rgba(52,211,153,0.3)] flex items-center gap-2 transition-all"
            >
              <Play className="w-4 h-4 fill-slate-950 shrink-0" />
              <span>Practice (10 Qs)</span>
            </button>
          </div>
        </div>

        {/* 4 Metric KPI Badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
          {/* 1. Overall Accuracy */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800/80 min-w-0">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1 truncate">
              Overall Accuracy
            </span>
            <div className="flex items-baseline gap-2 flex-wrap min-w-0">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {analytics.overallAccuracy}%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold truncate">
                ({analytics.totalCorrect}/{analytics.totalAttempts})
              </span>
            </div>
          </div>

          {/* 2. Coverage */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800/80 min-w-0">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1 truncate">
              Curriculum Coverage
            </span>
            <div className="flex items-baseline gap-2 flex-wrap min-w-0">
              <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
                {analytics.coveragePercent}%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold truncate">
                ({analytics.uniqueAttemptedCount}/{analytics.totalCurriculumQuestions})
              </span>
            </div>
          </div>

          {/* 3. Strongest Topic */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800/80 min-w-0">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1 truncate">
              Strongest Topic
            </span>
            {analytics.strongestTopic ? (
              <div className="min-w-0">
                <span className="text-sm font-extrabold text-slate-900 dark:text-white truncate block">
                  {analytics.strongestTopic.titleEn}
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 truncate block">
                  {analytics.strongestTopic.accuracy}% Accuracy
                </span>
              </div>
            ) : (
              <span className="text-xs text-slate-400 dark:text-slate-500">Need more attempts</span>
            )}
          </div>

          {/* 4. Focus Weakest Topic */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800/80 min-w-0">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1 truncate">
              Needs Practice
            </span>
            {analytics.weakestTopic && analytics.weakestTopic.topicId !== analytics.strongestTopic?.topicId ? (
              <div className="min-w-0">
                <span className="text-sm font-extrabold text-slate-900 dark:text-white truncate block">
                  {analytics.weakestTopic.titleEn}
                </span>
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 truncate block">
                  {analytics.weakestTopic.accuracy}% Accuracy
                </span>
              </div>
            ) : (
              <span className="text-xs text-slate-400 dark:text-slate-500">None flagged</span>
            )}
          </div>
        </div>
      </div>

      {/* Metacognitive Calibration Dashboard (Higham et al. / Koriat et al.) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#161A23] border border-slate-200 dark:border-slate-800 shadow-xl mb-8 min-w-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-indigo-500 shrink-0" />
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight break-words">
                Metacognitive Calibration
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 break-words">
              NIH Metacognition Model (Higham et al., Koriat et al.): Aligning subjective diagnostic confidence with objective accuracy
            </p>
          </div>

          <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border min-w-0 max-w-full whitespace-normal break-words shrink-0 self-start sm:self-auto text-center ${
            calibration.overallStatus === 'well_calibrated'
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
              : calibration.overallStatus === 'overconfident'
              ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
              : calibration.overallStatus === 'underconfident'
              ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
          }`}>
            {calibration.overallStatus === 'well_calibrated' && '✓ Well-Calibrated'}
            {calibration.overallStatus === 'overconfident' && '⚠️ Overconfident (Clinical Caution)'}
            {calibration.overallStatus === 'underconfident' && '💡 Underconfident'}
            {calibration.overallStatus === 'insufficient_data' && 'Needs More Confidence Ratings'}
          </span>
        </div>

        {/* Narrative Insight */}
        <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-[#111522] border border-indigo-200/80 dark:border-indigo-900/40 mb-6">
          <p className="text-sm font-semibold text-indigo-950 dark:text-indigo-200 leading-relaxed">
            {calibration.summaryMessageEn}
          </p>
        </div>

        {/* 3 Calibration Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* High Confidence */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-black uppercase text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>High Confidence</span>
              </span>
              <span className="text-xs font-bold text-slate-500">
                {calibration.buckets.high.count} rated
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {calibration.buckets.high.accuracy}%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
              <span>{calibration.buckets.high.correctCount} Confirmed Mastery</span>
              <span className="text-rose-500 font-bold">{calibration.buckets.high.count - calibration.buckets.high.correctCount} Misconceptions</span>
            </div>
          </div>

          {/* Medium Confidence */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-black uppercase text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                <Target className="w-4 h-4" />
                <span>Medium Confidence</span>
              </span>
              <span className="text-xs font-bold text-slate-500">
                {calibration.buckets.medium.count} rated
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {calibration.buckets.medium.accuracy}%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
              <span>{calibration.buckets.medium.correctCount} Correct</span>
              <span>{calibration.buckets.medium.count - calibration.buckets.medium.correctCount} Incorrect</span>
            </div>
          </div>

          {/* Low Confidence */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                <span>Low (Guessing)</span>
              </span>
              <span className="text-xs font-bold text-slate-500">
                {calibration.buckets.low.count} rated
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {calibration.buckets.low.accuracy}%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
              <span className="text-amber-600 dark:text-amber-400">{calibration.buckets.low.correctCount} Lucky Guesses</span>
              <span>{calibration.buckets.low.count - calibration.buckets.low.correctCount} Known Gaps</span>
            </div>
          </div>
        </div>

        {/* Confident Misconceptions Alert Banner */}
        {calibration.highConfidenceErrorsCount > 0 && (
          <div className="mt-4 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3 text-xs text-rose-800 dark:text-rose-200">
            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-black">Clinical Safety Alert: </span>
              <span>
                You have {calibration.highConfidenceErrorsCount} high-confidence misconceptions recorded. High diagnostic certainty paired with an incorrect answer is prioritized at the top of your Spaced Repetition queue to eliminate dangerous clinical assumptions.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Interactive Chart Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#161A23] border border-slate-200 dark:border-slate-800 shadow-xl mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Accuracy Trend Over Time
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {selectedTopicId === 'all'
                ? 'Cumulative performance progression across all surgical modules'
                : `Targeted performance curve for: ${activeTopicSummary?.titleEn}`}
            </p>
          </div>

          {/* Topic Filter Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedTopicId}
              onChange={(e) => {
                SoundEffects.playClick();
                setSelectedTopicId(e.target.value);
              }}
              className="px-3 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0F1218] text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Topics (Overall Trend)</option>
              {analytics.topicSummaries.map(t => (
                <option key={t.topicId} value={t.topicId}>
                  {t.titleEn} ({t.totalAttempts > 0 ? `${t.accuracy}%` : 'Unattempted'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Chart Rendering */}
        {chartData.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl mx-auto mb-3 text-slate-400">
              📈
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No Attempt Data Yet for This Selection
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
              Complete questions or practice quizzes to see your accuracy trend lines update in real time.
            </p>
            <button
              onClick={() => {
                SoundEffects.playClick();
                if (selectedTopicId !== 'all') {
                  onStartTopicPractice(selectedTopicId);
                } else {
                  onQuickPractice(10);
                }
              }}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold"
            >
              Start Practice Session
            </button>
          </div>
        ) : (
          <div className="h-64 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="accuracyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.15} />
                <XAxis
                  dataKey="label"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1', opacity: 0.3 }}
                />
                <YAxis
                  domain={[0, 100]}
                  unit="%"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1', opacity: 0.3 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 rounded-xl bg-slate-900 text-white text-xs shadow-xl border border-slate-700">
                          <p className="font-extrabold text-emerald-400">{data.accuracy}% Accuracy</p>
                          <p className="text-slate-300 font-medium mt-0.5">
                            {data.totalCorrect} / {data.totalAttempts} correct answers
                          </p>
                          <p className="text-slate-400 text-[10px] mt-1">{data.label}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#accuracyGrad)"
                  dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 6, fill: '#10b981' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Per-Topic Breakdown Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Surgical Modules Performance
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Breakdown of accuracy, mastery status, and learning trends for all 16 topics
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {analytics.topicSummaries.map((topSummary) => {
            return (
              <div
                key={`topic-card-${topSummary.topicId}`}
                className="p-5 rounded-2xl bg-white dark:bg-[#161A23] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all min-w-0"
              >
                <div className="min-w-0">
                  {/* Status & Trend Header */}
                  <div className="flex items-center justify-between gap-2 mb-2 flex-wrap min-w-0">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {topSummary.totalQuestions} Questions
                    </span>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Trend Badge */}
                      {topSummary.trend === 'improving' && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black">
                          <TrendingUp className="w-3 h-3" />
                          <span>Improving</span>
                        </span>
                      )}
                      {topSummary.trend === 'declining' && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-black">
                          <TrendingDown className="w-3 h-3" />
                          <span>Needs Work</span>
                        </span>
                      )}
                      {topSummary.trend === 'stable' && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-black">
                          <Minus className="w-3 h-3" />
                          <span>Stable</span>
                        </span>
                      )}

                      {/* Status Tag */}
                      {topSummary.status === 'mastered' && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase">
                          Mastered
                        </span>
                      )}
                      {topSummary.status === 'proficient' && (
                        <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-700 dark:text-teal-300 text-[10px] font-black uppercase">
                          Proficient
                        </span>
                      )}
                      {topSummary.status === 'needs-work' && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase">
                          Review
                        </span>
                      )}
                      {topSummary.status === 'unstarted' && (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] font-bold">
                          Unstarted
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base leading-snug">
                    {topSummary.titleEn}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                    {topSummary.titleRu}
                  </p>

                  {/* Metrics Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Accuracy</span>
                      <span className={`font-black ${
                        topSummary.accuracy >= 80
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : topSummary.accuracy >= 65
                          ? 'text-amber-600 dark:text-amber-400'
                          : topSummary.totalAttempts === 0
                          ? 'text-slate-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {topSummary.totalAttempts > 0 ? `${topSummary.accuracy}%` : '—'}
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          topSummary.accuracy >= 80
                            ? 'bg-emerald-500'
                            : topSummary.accuracy >= 65
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${topSummary.accuracy}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                      <span>{topSummary.attemptedUnique} / {topSummary.totalQuestions} covered</span>
                      <span>{topSummary.correctAttempts} / {topSummary.totalAttempts} correct</span>
                    </div>
                  </div>
                </div>

                {/* Practice Button */}
                <div className="mt-4 pt-2">
                  <button
                    onClick={() => {
                      SoundEffects.playClick();
                      onStartTopicPractice(topSummary.topicId);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-500/15 dark:hover:text-emerald-400 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Practice Topic</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
