import React, { useState, useMemo } from 'react';
import { 
  Stethoscope, 
  Search, 
  Bookmark, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  Play, 
  Sparkles, 
  Filter,
  ArrowRight,
  Clock,
  Calendar,
  Shuffle
} from 'lucide-react';
import { ClinicalCase, CaseProgress } from '../types';
import { topics } from '../data/topics';
import { allCases } from '../data/cases';
import { SoundEffects } from '../utils/audio';
import { formatDateKey, isSrsDue, getSrsStatusInfo } from '../utils/spacedRepetition';
import { interleaveCases } from '../utils/interleavedPractice';

interface CaseTopicSelectorProps {
  caseProgress: CaseProgress;
  onSelectTopic: (topicId: string) => void;
  onSelectCase: (caseId: number) => void;
  onStartFilterSession: (cases: ClinicalCase[], title: string) => void;
}

export const CaseTopicSelector: React.FC<CaseTopicSelectorProps> = ({
  caseProgress,
  onSelectTopic,
  onSelectCase,
  onStartFilterSession
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'due' | 'needs_review' | 'mastered' | 'bookmarked'>('all');
  const todayKey = useMemo(() => formatDateKey(), []);

  const totalCasesCount = allCases.length;
  const masteredCount = Object.values(caseProgress.caseSelfRating || {}).filter(r => r === 'knew_it' || r === 'mastered').length;
  const needsReviewCount = Object.values(caseProgress.caseSelfRating || {}).filter(r => r === 'needs_review').length;
  const bookmarkedCount = (caseProgress.bookmarkedCaseIds || []).length;
  const reviewedCount = (caseProgress.reviewedCaseIds || []).length;

  // Identify cases due for review via per-case SRS schedule
  const dueCaseIds = useMemo(() => {
    return allCases.filter(c => {
      const srs = caseProgress.caseSpacedRepetition?.[c.id];
      if (srs) {
        return isSrsDue(srs, todayKey);
      }
      return caseProgress.caseSelfRating?.[c.id] === 'needs_review';
    }).map(c => c.id);
  }, [caseProgress.caseSpacedRepetition, caseProgress.caseSelfRating, todayKey]);

  const dueCasesCount = dueCaseIds.length;
  const dueCases = useMemo(() => allCases.filter(c => dueCaseIds.includes(c.id)), [dueCaseIds]);

  // Filter cases for search
  const filteredCases = allCases.filter(c => {
    const titleEn = c.topicTitleEn || '';
    const matchesSearch = searchQuery.trim() === '' || 
      titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.stem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `case ${c.id}`.includes(searchQuery.toLowerCase()) ||
      `case ${c.number}`.includes(searchQuery.toLowerCase()) ||
      `problem ${c.number}`.includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'due') {
      return dueCaseIds.includes(c.id);
    }
    if (activeFilter === 'mastered') {
      const rating = caseProgress.caseSelfRating?.[c.id];
      return rating === 'knew_it' || rating === 'mastered';
    }
    if (activeFilter === 'needs_review') {
      return caseProgress.caseSelfRating?.[c.id] === 'needs_review';
    }
    if (activeFilter === 'bookmarked') {
      return (caseProgress.bookmarkedCaseIds || []).includes(c.id);
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Hero Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-wider mb-2">
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Situational Surgery Cases</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Clinical Case Challenges ({totalCasesCount})
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
              Long-form situational problems with multi-part clinical vignettes, diagnostic rationale, and surgical management.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {dueCasesCount > 0 && (
              <button
                id="btn-practice-due-cases"
                onClick={() => {
                  SoundEffects.playClick();
                  onStartFilterSession(dueCases, `Due Clinical Cases (${dueCasesCount})`);
                }}
                className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-black text-sm shadow-[0_0_20px_rgba(244,63,94,0.35)] active:scale-95 transition-all"
              >
                <Clock className="w-4 h-4" />
                <span>Practice Due Cases ({dueCasesCount})</span>
              </button>
            )}

            <button
              id="btn-practice-interleaved-cases"
              onClick={() => {
                SoundEffects.playClick();
                const pool = dueCasesCount > 0 ? dueCases : allCases;
                const interleaved = interleaveCases(pool, { prioritizeConfused: true });
                onStartFilterSession(interleaved, `Interleaved Cases (${interleaved.length})`);
              }}
              className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm shadow-[0_0_20px_rgba(99,102,241,0.3)] active:scale-95 transition-all"
              title="Interleaved practice across differential diagnoses (Rohrer & Taylor 2021)"
            >
              <Shuffle className="w-4 h-4" />
              <span>Interleaved Review</span>
            </button>

            <button
              id="btn-practice-all-cases"
              onClick={() => {
                SoundEffects.playClick();
                onStartFilterSession(allCases, 'All 78 Clinical Cases');
              }}
              className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Study All Cases</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress & Quick Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 mb-8">
        <div 
          onClick={() => {
            SoundEffects.playClick();
            setActiveFilter('due');
          }}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            activeFilter === 'due' 
              ? 'bg-slate-100 dark:bg-slate-800/90 border-rose-500/50 shadow-md ring-1 ring-rose-500/30' 
              : 'bg-white dark:bg-[#161A23] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold mb-1">
            <span>Due Today</span>
            <Clock className="w-4 h-4 text-rose-500 dark:text-rose-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400">
            {dueCasesCount}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">SRS review queue</span>
        </div>
        <div 
          onClick={() => {
            SoundEffects.playClick();
            setActiveFilter('all');
          }}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            activeFilter === 'all' 
              ? 'bg-slate-100 dark:bg-slate-800/90 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30' 
              : 'bg-white dark:bg-[#161A23] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold mb-1">
            <span>Reviewed</span>
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {reviewedCount} <span className="text-xs text-slate-400 dark:text-slate-500 font-bold">/ {totalCasesCount}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full" 
              style={{ width: `${Math.round((reviewedCount / totalCasesCount) * 100)}%` }}
            />
          </div>
        </div>

        <div 
          onClick={() => {
            SoundEffects.playClick();
            setActiveFilter('mastered');
          }}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            activeFilter === 'mastered' 
              ? 'bg-slate-100 dark:bg-slate-800/90 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30' 
              : 'bg-white dark:bg-[#161A23] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold mb-1">
            <span>Mastered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {masteredCount}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Confident understanding</span>
        </div>

        <div 
          onClick={() => {
            SoundEffects.playClick();
            setActiveFilter('needs_review');
          }}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            activeFilter === 'needs_review' 
              ? 'bg-slate-100 dark:bg-slate-800/90 border-amber-500/50 shadow-md ring-1 ring-amber-500/30' 
              : 'bg-white dark:bg-[#161A23] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold mb-1">
            <span>Needs Review</span>
            <AlertCircle className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
            {needsReviewCount}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Marked for repetition</span>
        </div>

        <div 
          onClick={() => {
            SoundEffects.playClick();
            setActiveFilter('bookmarked');
          }}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            activeFilter === 'bookmarked' 
              ? 'bg-slate-100 dark:bg-slate-800/90 border-indigo-500/50 shadow-md ring-1 ring-indigo-500/30' 
              : 'bg-white dark:bg-[#161A23] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold mb-1">
            <span>Bookmarked</span>
            <Bookmark className="w-4 h-4 text-indigo-500 dark:text-indigo-400 fill-indigo-400/20" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {bookmarkedCount}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Saved for quick study</span>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="case-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cases by organ, symptoms (e.g. Murphy, dysphagia, hematemesis, S-curve)..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#161A23] border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-slate-800 text-white dark:bg-slate-700'
                : 'bg-white dark:bg-[#161A23] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 shadow-xs'
            }`}
          >
            All ({totalCasesCount})
          </button>
          <button
            onClick={() => setActiveFilter('due')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
              activeFilter === 'due'
                ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/40'
                : 'bg-white dark:bg-[#161A23] text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-800 shadow-xs'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Due ({dueCasesCount})
          </button>
          <button
            onClick={() => setActiveFilter('mastered')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
              activeFilter === 'mastered'
                ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40'
                : 'bg-white dark:bg-[#161A23] text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-800 shadow-xs'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Mastered ({masteredCount})
          </button>
          <button
            onClick={() => setActiveFilter('needs_review')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
              activeFilter === 'needs_review'
                ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40'
                : 'bg-white dark:bg-[#161A23] text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-800 shadow-xs'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            Needs Review ({needsReviewCount})
          </button>
          <button
            onClick={() => setActiveFilter('bookmarked')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
              activeFilter === 'bookmarked'
                ? 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/40'
                : 'bg-white dark:bg-[#161A23] text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-800 shadow-xs'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            Starred ({bookmarkedCount})
          </button>
        </div>
      </div>

      {/* When filtering or searching, show the case list directly */}
      {(searchQuery.trim() !== '' || activeFilter !== 'all') ? (
        <div className="space-y-3 mb-10">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
            <span>Showing {filteredCases.length} clinical case{filteredCases.length === 1 ? '' : 's'}</span>
            {filteredCases.length > 0 && (
              <button
                onClick={() => onStartFilterSession(filteredCases, `Filtered Cases (${filteredCases.length})`)}
                className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Study this set</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {filteredCases.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-[#161A23] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-base font-bold text-slate-700 dark:text-slate-300">No cases matched your filter criteria.</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try clearing your search query or selecting "All".</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredCases.map((c) => {
                const status = caseProgress.caseSelfRating?.[c.id];
                const isBookmarked = (caseProgress.bookmarkedCaseIds || []).includes(c.id);
                const caseSrs = caseProgress.caseSpacedRepetition?.[c.id];
                const srsInfo = caseSrs ? getSrsStatusInfo(caseSrs, todayKey) : null;

                return (
                  <div
                    key={c.id}
                    id={`case-card-${c.id}`}
                    onClick={() => {
                      SoundEffects.playClick();
                      onSelectCase(c.id);
                    }}
                    className="p-4 rounded-2xl bg-white dark:bg-[#161A23] border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-[#1E2533] cursor-pointer transition-all flex flex-col justify-between group shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 text-[11px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-md">
                            Case #{c.id} (Problem #{c.number})
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold truncate max-w-[160px]">
                            {c.topicTitleEn}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {srsInfo && (
                            <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              srsInfo.isDue
                                ? 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30'
                                : 'text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/30'
                            }`}>
                              <Clock className="w-2.5 h-2.5" />
                              <span>{srsInfo.label}</span>
                            </span>
                          )}
                          {(status === 'knew_it' || status === 'mastered') && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3" /> Knew It
                            </span>
                          )}
                          {status === 'needs_review' && !srsInfo && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                              <AlertCircle className="w-3 h-3" /> Review
                            </span>
                          )}
                          {isBookmarked && (
                            <Bookmark className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 fill-indigo-400" />
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium line-clamp-3 group-hover:text-slate-900 dark:group-hover:text-white leading-relaxed">
                        {c.stem}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-bold">
                      <span>{c.questions.length} sub-questions</span>
                      <span className="text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Review case →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Topic Modules Grid (Default View) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {topics.map((t) => {
            const topicCases = allCases.filter(c => c.topicId === t.id);
            if (topicCases.length === 0) return null;

            const reviewedInTopic = topicCases.filter(c => 
              (caseProgress.reviewedCaseIds || []).includes(c.id)
            ).length;

            const masteredInTopic = topicCases.filter(c => {
              const r = caseProgress.caseSelfRating?.[c.id];
              return r === 'knew_it' || r === 'mastered';
            }).length;

            const percent = Math.round((reviewedInTopic / topicCases.length) * 100);

            return (
              <div
                key={t.id}
                id={`case-topic-card-${t.id}`}
                className="p-5 rounded-3xl bg-white dark:bg-[#161A23] border border-slate-200 dark:border-slate-800 shadow-md hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-[#1E2533] transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                      {t.icon}
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                        {topicCases.length} cases
                      </span>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">
                        {masteredInTopic} mastered
                      </div>
                    </div>
                  </div>

                  {/* Titles */}
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {t.titleEn}
                  </h3>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                      <span>Reviewed</span>
                      <span className="text-slate-700 dark:text-slate-300">{reviewedInTopic} / {topicCases.length} ({percent}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
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
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    id={`btn-study-topic-cases-${t.id}`}
                    onClick={() => {
                      SoundEffects.playClick();
                      onSelectTopic(t.id);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Study {topicCases.length} Cases</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
