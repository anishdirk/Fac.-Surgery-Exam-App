import React, { useState, useMemo } from 'react';
import { 
  Search, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  Star, 
  Play, 
  ChevronDown, 
  ChevronUp, 
  Languages
} from 'lucide-react';
import { Question, UserProgress } from '../types';
import { topics } from '../data/topics';
import { SoundEffects } from '../utils/audio';

interface QuestionBankProps {
  questions: Question[];
  progress: UserProgress;
  onPracticeSubset: (selectedQuestions: Question[], title: string) => void;
  onToggleBookmark: (questionId: number) => void;
}

export const QuestionBank: React.FC<QuestionBankProps> = ({
  questions,
  progress,
  onPracticeSubset,
  onToggleBookmark
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'mistakes' | 'bookmarked' | 'unattempted' | 'completed'>('all');
  const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(null);
  const [showEnglishTranslations, setShowEnglishTranslations] = useState<boolean>(true);

  // Filter questions based on topic, query, and status
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      // Topic filter
      if (selectedTopicId !== 'all' && q.topicId !== selectedTopicId) {
        return false;
      }

      // Status filter
      if (selectedStatusFilter === 'mistakes' && !(progress.mistakes || []).includes(q.id)) {
        return false;
      }
      if (selectedStatusFilter === 'bookmarked' && !(progress.bookmarkedQuestions || []).includes(q.id)) {
        return false;
      }
      if (selectedStatusFilter === 'unattempted' && ((progress.completedQuestions || {})[q.id] || (progress.mistakes || []).includes(q.id))) {
        return false;
      }
      if (selectedStatusFilter === 'completed' && !(progress.completedQuestions || {})[q.id]) {
        return false;
      }

      // Search query (number, Russian text, English text, options)
      if (searchQuery.trim()) {
        const qNum = searchQuery.trim();
        if (!isNaN(Number(qNum)) && q.number === Number(qNum)) {
          return true;
        }

        const queryLower = searchQuery.toLowerCase();
        const matchesRu = q.questionRu.toLowerCase().includes(queryLower);
        const matchesEn = q.questionEn?.toLowerCase().includes(queryLower);
        const matchesOptions = q.options.some(o => 
          o.textRu.toLowerCase().includes(queryLower) || 
          o.textEn?.toLowerCase().includes(queryLower)
        );

        return matchesRu || matchesEn || matchesOptions;
      }

      return true;
    });
  }, [questions, selectedTopicId, selectedStatusFilter, searchQuery, progress]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Question Bank
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 font-extrabold text-xs">
              620 Questions
            </span>
          </div>
          <p className="text-sm text-slate-400 font-medium mt-1">
            Browse, search, and practice Russian medical MCQs with instant English translations.
          </p>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-3">
          <button
            id="btn-bank-toggle-trans"
            onClick={() => {
              SoundEffects.playClick();
              setShowEnglishTranslations(!showEnglishTranslations);
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              showEnglishTranslations
                ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
                : 'bg-[#161A23] border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{showEnglishTranslations ? 'Translations ON' : 'Translations OFF'}</span>
          </button>

          {filteredQuestions.length > 0 && (
            <button
              id="btn-bank-practice-filtered"
              onClick={() => {
                SoundEffects.playClick();
                onPracticeSubset(
                  filteredQuestions.slice(0, 30), 
                  `Practice ${selectedTopicId !== 'all' ? selectedTopicId.toUpperCase() : 'Bank'} (${Math.min(30, filteredQuestions.length)} Qs)`
                );
              }}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-1.5 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Practice Filtered ({Math.min(30, filteredQuestions.length)})</span>
            </button>
          )}
        </div>
      </div>

      {/* Controls Bar: Search & Status Filters */}
      <div className="p-4 rounded-2xl bg-[#161A23] border border-slate-800 shadow-xl mb-6 space-y-4">
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="bank-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by question # (e.g. 42), Russian sign, or English word..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0F1218] border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium placeholder-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(['all', 'mistakes', 'bookmarked', 'completed', 'unattempted'] as const).map(filterKey => (
              <button
                key={filterKey}
                onClick={() => {
                  SoundEffects.playClick();
                  setSelectedStatusFilter(filterKey);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-extrabold capitalize whitespace-nowrap transition-all ${
                  selectedStatusFilter === filterKey
                    ? 'bg-slate-100 text-slate-950 shadow-xs'
                    : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {filterKey === 'mistakes' ? `Mistakes (${(progress.mistakes || []).length})` : filterKey}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Horizontal Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
          <button
            onClick={() => {
              SoundEffects.playClick();
              setSelectedTopicId('all');
            }}
            className={`px-3 py-1.5 rounded-xl font-extrabold whitespace-nowrap transition-all ${
              selectedTopicId === 'all'
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            All Topics (16)
          </button>

          {topics.map(t => (
            <button
              key={t.id}
              onClick={() => {
                SoundEffects.playClick();
                setSelectedTopicId(t.id);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedTopicId === t.id
                  ? 'bg-emerald-500 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                  : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.titleEn}</span>
              <span className="opacity-70">({t.count})</span>
            </button>
          ))}
        </div>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-3 px-1">
        <span>Showing {filteredQuestions.length} Questions</span>
        <span>Click any card to expand choices</span>
      </div>

      {/* Questions List */}
      {filteredQuestions.length === 0 ? (
        <div className="p-12 text-center bg-[#161A23] rounded-3xl border border-slate-800 shadow-xl">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No questions match your filter</h3>
          <p className="text-xs text-slate-400 mt-1">Try clearing your search query or choosing another topic.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedTopicId('all');
              setSelectedStatusFilter('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-xs hover:bg-slate-700"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQuestions.map((q) => {
            const isExpanded = expandedQuestionId === q.id;
            const isBookmarked = (progress.bookmarkedQuestions || []).includes(q.id);
            const isMistake = (progress.mistakes || []).includes(q.id);
            const isCompleted = !!(progress.completedQuestions || {})[q.id];
            const correctOption = q.options.find(o => o.key.toLowerCase() === q.correctKey.toLowerCase());

            return (
              <div
                key={`bank-q-${q.id}`}
                id={`bank-card-${q.id}`}
                className={`p-4 sm:p-5 rounded-2xl bg-[#161A23] border transition-all ${
                  isMistake
                    ? 'border-rose-500/40 hover:border-rose-500/60'
                    : isCompleted
                    ? 'border-emerald-500/40 hover:border-emerald-500/60'
                    : 'border-slate-800 hover:border-slate-700'
                } shadow-md`}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 font-black text-xs">
                      #{q.number}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/80 text-slate-400 font-bold text-[11px] uppercase">
                      {q.topicId}
                    </span>
                    {q.page && (
                      <span className="text-[11px] text-slate-500 font-medium">
                        Page {q.page}
                      </span>
                    )}

                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3 h-3" /> Solved
                      </span>
                    )}
                    {isMistake && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded-md">
                        <XCircle className="w-3 h-3" /> Missed
                      </span>
                    )}
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      SoundEffects.playClick();
                      onToggleBookmark(q.id);
                    }}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isBookmarked
                        ? 'text-amber-400 bg-amber-500/15 border border-amber-500/30'
                        : 'text-slate-500 hover:text-amber-400 hover:bg-slate-800'
                    }`}
                    title={isBookmarked ? "Remove bookmark" : "Bookmark for study"}
                  >
                    <Star className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                  </button>
                </div>

                {/* Russian Question Body */}
                <div 
                  onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                  className="cursor-pointer mt-2"
                >
                  <p className="font-bold text-white text-sm sm:text-base leading-snug">
                    {q.questionRu}
                  </p>

                  {/* English Translation */}
                  {showEnglishTranslations && (q.questionEn || q.keywordsEn) && (
                    <p className="text-xs sm:text-sm font-medium text-sky-200 mt-1.5 bg-sky-950/30 border border-sky-500/20 p-2 rounded-lg">
                      {q.questionEn || q.keywordsEn?.join(', ')}
                    </p>
                  )}
                </div>

                {/* Highlighted Correct Answer Preview (When collapsed) */}
                {!isExpanded && (
                  <div 
                    onClick={() => setExpandedQuestionId(q.id)}
                    className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        Answer: {q.correctKey.toUpperCase()}
                      </span>
                      <span className="font-medium text-slate-300 truncate max-w-xs sm:max-w-md">
                        {correctOption?.textRu}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 hover:underline">
                      <span>View Options</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </span>
                  </div>
                )}

                {/* Expanded Full Options List */}
                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                    <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                      Answer Choices:
                    </div>
                    {q.options.map((opt) => {
                      const isCorrect = opt.key.toLowerCase() === q.correctKey.toLowerCase();
                      return (
                        <div
                          key={`bank-opt-${q.id}-${opt.key}`}
                          className={`p-3 rounded-xl border flex items-start gap-3 text-xs sm:text-sm ${
                            isCorrect
                              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200 font-bold shadow-xs'
                              : 'bg-[#0F1218] border-slate-800 text-slate-300'
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-black uppercase shrink-0 text-xs ${
                            isCorrect ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 border border-slate-700 text-slate-400'
                          }`}>
                            {opt.key}
                          </span>
                          <div className="flex-1">
                            <div>{opt.textRu}</div>
                            {showEnglishTranslations && opt.textEn && (
                              <div className="text-xs font-medium text-slate-400 mt-0.5">
                                {opt.textEn}
                              </div>
                            )}
                          </div>
                          {isCorrect && (
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold rounded-md uppercase">
                              Correct Answer
                            </span>
                          )}
                        </div>
                      );
                    })}

                    {(q.explanationEn || q.explanation) && (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium mt-2">
                        💡 <strong className="font-bold">Medical Note:</strong> {q.explanationEn || q.explanation}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => {
                          SoundEffects.playClick();
                          onPracticeSubset([q], `Question #${q.number}`);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                      >
                        <Play className="w-3.5 h-3.5 fill-slate-950" />
                        <span>Practice this question</span>
                      </button>

                      <button
                        onClick={() => setExpandedQuestionId(null)}
                        className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        <span>Collapse</span>
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
