import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Layers, 
  Play, 
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { UserProgress } from '../types';
import { topics } from '../data/topics';
import { SoundEffects } from '../utils/audio';

interface TopicSelectorProps {
  progress: UserProgress;
  onSelectTopic: (topicId: string, count: number) => void;
  onBrowseTopic: (topicId: string) => void;
}

type TopicFilter = 'all' | 'in_progress' | 'mastered' | 'unstarted';

export const TopicSelector: React.FC<TopicSelectorProps> = ({
  progress,
  onSelectTopic,
  onBrowseTopic
}) => {
  const [activeFilter, setActiveFilter] = useState<TopicFilter>('all');
  const [batchSize, setBatchSize] = useState<number>(10);

  const batchOptions = [5, 10, 20];

  // Calculate stats for filters
  const topicStats = useMemo(() => {
    return topics.map(t => {
      const completedInTopic = Object.keys(progress.completedQuestions || {}).filter(qId => {
        const num = Number(qId);
        return num >= t.questionRange[0] && num <= t.questionRange[1];
      }).length;
      const percent = Math.min(100, Math.round((completedInTopic / t.count) * 100));
      const isMastered = percent >= 100;
      const isStarted = completedInTopic > 0;
      return {
        topic: t,
        completedInTopic,
        percent,
        status: isMastered ? 'mastered' : isStarted ? 'in_progress' : 'unstarted'
      };
    });
  }, [progress.completedQuestions]);

  const filteredTopics = useMemo(() => {
    if (activeFilter === 'all') return topicStats;
    return topicStats.filter(item => item.status === activeFilter);
  }, [topicStats, activeFilter]);

  const inProgressCount = topicStats.filter(t => t.status === 'in_progress').length;
  const masteredCount = topicStats.filter(t => t.status === 'mastered').length;
  const unstartedCount = topicStats.filter(t => t.status === 'unstarted').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-shape-full bg-primary-container text-on-primary-container border border-outline-variant/30 font-extrabold text-label-small uppercase tracking-wider mb-2">
          <Layers className="w-3.5 h-3.5" />
          <span>Surgical Curriculum</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-display-small font-black text-on-surface tracking-tight">
              16 Specialty Topics
            </h1>
            <p className="text-body-medium text-on-surface-variant font-medium mt-1 max-w-xl">
              Select any surgical discipline to practice focused multiple-choice questions with tailored drill lengths.
            </p>
          </div>

          {/* Practice Batch Size Segmented Button */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-label-small font-black uppercase tracking-wider text-on-surface-variant">
              Batch:
            </span>
            <div 
              id="batch-size-segmented-container"
              className="inline-flex items-center p-1 rounded-shape-full bg-surface-container border border-outline-variant/30 shadow-inner"
            >
              {batchOptions.map(size => {
                const isSelected = batchSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      SoundEffects.playClick();
                      setBatchSize(size);
                    }}
                    className={`relative px-3.5 py-1.5 rounded-shape-full text-label-medium font-black transition-colors z-10 ${
                      isSelected
                        ? 'text-on-secondary-container'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="batch-size-pill"
                        className="absolute inset-0 rounded-shape-full bg-secondary-container shadow-xs -z-10"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      />
                    )}
                    <span>{size} Qs</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Chip Group */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-1">
        <div 
          id="topic-filter-chip-group"
          className="inline-flex items-center p-1 rounded-shape-full bg-surface-container border border-outline-variant/30 shadow-inner"
        >
          <button
            type="button"
            onClick={() => {
              SoundEffects.playClick();
              setActiveFilter('all');
            }}
            className={`relative px-4 py-1.5 rounded-shape-full text-label-medium font-bold transition-colors z-10 whitespace-nowrap ${
              activeFilter === 'all'
                ? 'text-on-primary-container font-black'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {activeFilter === 'all' && (
              <motion.div
                layoutId="topic-filter-pill"
                className="absolute inset-0 rounded-shape-full bg-primary-container shadow-xs -z-10"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
              />
            )}
            <span>All Topics ({topics.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              SoundEffects.playClick();
              setActiveFilter('in_progress');
            }}
            className={`relative px-4 py-1.5 rounded-shape-full text-label-medium font-bold transition-colors z-10 flex items-center gap-1.5 whitespace-nowrap ${
              activeFilter === 'in_progress'
                ? 'text-on-primary-container font-black'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {activeFilter === 'in_progress' && (
              <motion.div
                layoutId="topic-filter-pill"
                className="absolute inset-0 rounded-shape-full bg-primary-container shadow-xs -z-10"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
              />
            )}
            <Clock className="w-3.5 h-3.5" />
            <span>In Progress ({inProgressCount})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              SoundEffects.playClick();
              setActiveFilter('mastered');
            }}
            className={`relative px-4 py-1.5 rounded-shape-full text-label-medium font-bold transition-colors z-10 flex items-center gap-1.5 whitespace-nowrap ${
              activeFilter === 'mastered'
                ? 'text-on-primary-container font-black'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {activeFilter === 'mastered' && (
              <motion.div
                layoutId="topic-filter-pill"
                className="absolute inset-0 rounded-shape-full bg-primary-container shadow-xs -z-10"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
              />
            )}
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mastered ({masteredCount})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              SoundEffects.playClick();
              setActiveFilter('unstarted');
            }}
            className={`relative px-4 py-1.5 rounded-shape-full text-label-medium font-bold transition-colors z-10 whitespace-nowrap ${
              activeFilter === 'unstarted'
                ? 'text-on-primary-container font-black'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {activeFilter === 'unstarted' && (
              <motion.div
                layoutId="topic-filter-pill"
                className="absolute inset-0 rounded-shape-full bg-primary-container shadow-xs -z-10"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
              />
            )}
            <span>Unstarted ({unstartedCount})</span>
          </button>
        </div>
      </div>

      {/* Grid of Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTopics.map(({ topic: t, completedInTopic, percent }) => {
          return (
            <div
              key={t.id}
              id={`topic-card-${t.id}`}
              className="p-5 rounded-shape-xl bg-surface-container-high border border-outline-variant/30 shadow-md hover:shadow-lg hover:border-primary/50 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Top badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-12 h-12 rounded-shape-lg bg-primary-container/40 border border-outline-variant/30 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                    {t.icon}
                  </div>
                  <div className="text-right">
                    <span className="text-label-small font-black text-on-surface bg-surface-container border border-outline-variant/30 px-2 py-0.5 rounded-shape-xs">
                      Q {t.questionRange[0]}–{t.questionRange[1]}
                    </span>
                    <div className="text-label-small text-on-surface-variant font-bold mt-0.5">
                      {t.count} questions
                    </div>
                  </div>
                </div>

                {/* Titles */}
                <h3 className="font-extrabold text-on-surface text-title-medium leading-snug group-hover:text-primary transition-colors">
                  {t.titleEn}
                </h3>
                <p className="text-body-small font-medium text-on-surface-variant mt-1 line-clamp-1">
                  {t.titleRu}
                </p>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-label-small font-bold text-on-surface-variant mb-1.5">
                    <span>Mastery</span>
                    <span className="text-on-surface">{completedInTopic} / {t.count} ({percent}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-surface-container-highest rounded-shape-full overflow-hidden">
                    <div
                      className={`h-full rounded-shape-full transition-all duration-500 ${
                        percent === 100 
                          ? 'bg-tertiary shadow-xs' 
                          : 'bg-primary shadow-xs'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 pt-4 border-t border-outline-variant/30 flex items-center gap-2">
                <button
                  id={`btn-topic-practice-${t.id}`}
                  onClick={() => {
                    SoundEffects.playClick();
                    onSelectTopic(t.id, batchSize);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-shape-full bg-primary hover:opacity-95 active:scale-95 text-on-primary font-black text-label-large shadow-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Practice {batchSize}</span>
                </button>

                <button
                  id={`btn-topic-browse-${t.id}`}
                  onClick={() => {
                    SoundEffects.playClick();
                    onBrowseTopic(t.id);
                  }}
                  className="p-2.5 rounded-shape-full border border-outline-variant/30 bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors"
                  title="Browse all questions in topic"
                  aria-label="Browse all questions in topic"
                >
                  <BookOpen className="w-4 h-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
