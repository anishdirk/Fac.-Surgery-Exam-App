import React from 'react';
import { 
  Layers, 
  Play, 
  BookOpen
} from 'lucide-react';
import { UserProgress } from '../types';
import { topics } from '../data/topics';
import { SoundEffects } from '../utils/audio';

interface TopicSelectorProps {
  progress: UserProgress;
  onSelectTopic: (topicId: string, count: number) => void;
  onBrowseTopic: (topicId: string) => void;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({
  progress,
  onSelectTopic,
  onBrowseTopic
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 font-extrabold text-xs uppercase tracking-wider mb-2">
          <Layers className="w-3.5 h-3.5" />
          <span>Surgical Curriculum</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          16 Specialty Topics
        </h1>
        <p className="text-sm text-slate-400 font-medium mt-1">
          Select any surgical topic to practice focused multiple-choice questions.
        </p>
      </div>

      {/* Grid of 16 Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {topics.map((t) => {
          // Calculate completed questions for this topic
          const completedInTopic = Object.keys(progress.completedQuestions || {}).filter(qId => {
            const num = Number(qId);
            return num >= t.questionRange[0] && num <= t.questionRange[1];
          }).length;

          const percent = Math.min(100, Math.round((completedInTopic / t.count) * 100));

          return (
            <div
              key={t.id}
              id={`topic-card-${t.id}`}
              className="p-5 rounded-3xl bg-[#161A23] border border-slate-800 shadow-lg hover:border-slate-700 hover:bg-[#1E2533] transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Top badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                    {t.icon}
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-slate-300 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-md">
                      Q {t.questionRange[0]}–{t.questionRange[1]}
                    </span>
                    <div className="text-[11px] text-slate-400 font-bold mt-0.5">
                      {t.count} questions
                    </div>
                  </div>
                </div>

                {/* Titles */}
                <h3 className="font-extrabold text-white text-base leading-snug group-hover:text-emerald-400 transition-colors">
                  {t.titleEn}
                </h3>
                <p className="text-xs font-medium text-slate-400 mt-1 line-clamp-1">
                  {t.titleRu}
                </p>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-1.5">
                    <span>Mastery</span>
                    <span className="text-slate-300">{completedInTopic} / {t.count} ({percent}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percent === 100 
                          ? 'bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]' 
                          : 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-2">
                <button
                  id={`btn-topic-practice-${t.id}`}
                  onClick={() => {
                    SoundEffects.playClick();
                    onSelectTopic(t.id, 10);
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center gap-1.5 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Practice 10</span>
                </button>

                <button
                  id={`btn-topic-browse-${t.id}`}
                  onClick={() => {
                    SoundEffects.playClick();
                    onBrowseTopic(t.id);
                  }}
                  className="p-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Browse all questions in topic"
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
