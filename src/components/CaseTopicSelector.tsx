import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
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

  const filterOptions: { id: 'all' | 'due' | 'mastered' | 'needs_review' | 'bookmarked'; label: string; count: number; icon?: React.ReactNode }[] = [
    { id: 'all', label: 'All', count: totalCasesCount },
    { id: 'due', label: 'Due', count: dueCasesCount, icon: <Clock className="w-3.5 h-3.5" /> },
    { id: 'mastered', label: 'Mastered', count: masteredCount, icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    { id: 'needs_review', label: 'Needs Review', count: needsReviewCount, icon: <AlertCircle className="w-3.5 h-3.5" /> },
    { id: 'bookmarked', label: 'Starred', count: bookmarkedCount, icon: <Bookmark className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-8 min-w-0">
      
      {/* Hero Header */}
      <div className="mb-8 min-w-0">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-shape-full bg-primary-container text-on-primary-container border border-outline-variant/30 font-extrabold text-label-small uppercase tracking-wider mb-2">
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Situational Surgery Cases</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-w-0">
          <div className="min-w-0">
            <h1 className="text-display-small font-black text-on-surface tracking-tight break-words">
              Clinical Case Challenges ({totalCasesCount})
            </h1>
            <p className="text-body-medium text-on-surface-variant font-medium mt-1 max-w-xl break-words">
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
                className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 rounded-shape-full bg-error text-on-error hover:opacity-95 font-black text-label-large shadow-xs active:scale-95 transition-all"
              >
                <Clock className="w-4 h-4 shrink-0" />
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
              className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-shape-full bg-secondary-container text-on-secondary-container hover:opacity-90 font-black text-label-large border border-outline-variant/30 shadow-xs active:scale-95 transition-all"
              title="Interleaved practice across differential diagnoses (Rohrer & Taylor 2021)"
            >
              <Shuffle className="w-4 h-4 shrink-0" />
              <span>Interleaved Review</span>
            </button>

            <button
              id="btn-practice-all-cases"
              onClick={() => {
                SoundEffects.playClick();
                onStartFilterSession(allCases, 'All 78 Clinical Cases');
              }}
              className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 rounded-shape-full bg-primary text-on-primary hover:opacity-95 font-black text-label-large shadow-xs active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-current shrink-0" />
              <span>Study All Cases</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress & Quick Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-3.5 mb-8">
        <div 
          onClick={() => {
            SoundEffects.playClick();
            setActiveFilter('due');
          }}
          className={`p-3.5 sm:p-4 rounded-shape-xl border cursor-pointer transition-all min-w-0 ${
            activeFilter === 'due' 
              ? 'bg-error-container text-on-error-container border-error/50 shadow-md ring-2 ring-error/40' 
              : 'bg-surface-container-high border-outline-variant/30 hover:border-error/40'
          }`}
        >
          <div className="flex items-center justify-between text-on-surface-variant text-label-small font-bold mb-1">
            <span className="truncate">Due Today</span>
            <Clock className="w-4 h-4 text-error shrink-0" />
          </div>
          <div className="text-headline-small font-black text-error">
            {dueCasesCount}
          </div>
          <span className="text-label-small text-on-surface-variant font-medium block truncate">SRS queue</span>
        </div>

        <div 
          onClick={() => {
            SoundEffects.playClick();
            setActiveFilter('all');
          }}
          className={`p-3.5 sm:p-4 rounded-shape-xl border cursor-pointer transition-all min-w-0 ${
            activeFilter === 'all' 
              ? 'bg-surface-container-highest border-primary/50 shadow-md ring-2 ring-primary/40' 
              : 'bg-surface-container-high border-outline-variant/30 hover:border-primary/40'
          }`}
        >
          <div className="flex items-center justify-between text-on-surface-variant text-label-small font-bold mb-1">
            <span className="truncate">Reviewed</span>
            <BookOpen className="w-4 h-4 text-primary shrink-0" />
          </div>
          <div className="text-headline-small font-black text-on-surface truncate">
            {reviewedCount} <span className="text-label-small text-on-surface-variant font-bold">/ {totalCasesCount}</span>
          </div>
          <div className="w-full h-1.5 bg-surface-container-highest rounded-shape-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-primary rounded-shape-full" 
              style={{ width: `${Math.round((reviewedCount / totalCasesCount) * 100)}%` }}
            />
          </div>
        </div>

        <div 
          onClick={() => {
            SoundEffects.playClick();
            setActiveFilter('mastered');
          }}
          className={`p-3.5 sm:p-4 rounded-shape-xl border cursor-pointer transition-all min-w-0 ${
            activeFilter === 'mastered' 
              ? 'bg-primary-container text-on-primary-container border-primary/50 shadow-md ring-2 ring-primary/40' 
              : 'bg-surface-container-high border-outline-variant/30 hover:border-primary/40'
          }`}
        >
          <div className="flex items-center justify-between text-on-surface-variant text-label-small font-bold mb-1">
            <span className="truncate">Mastered</span>
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
          </div>
          <div className="text-headline-small font-black text-primary">
            {masteredCount}
          </div>
          <span className="text-label-small text-on-surface-variant font-medium block truncate">Confident understanding</span>
        </div>

        <div 
          onClick={() => {
            SoundEffects.playClick();
            setActiveFilter('needs_review');
          }}
          className={`p-3.5 sm:p-4 rounded-shape-xl border cursor-pointer transition-all min-w-0 ${
            activeFilter === 'needs_review' 
              ? 'bg-tertiary-container text-on-tertiary-container border-tertiary/50 shadow-md ring-2 ring-tertiary/40' 
              : 'bg-surface-container-high border-outline-variant/30 hover:border-tertiary/40'
          }`}
        >
          <div className="flex items-center justify-between text-on-surface-variant text-label-small font-bold mb-1">
            <span className="truncate">Needs Review</span>
            <AlertCircle className="w-4 h-4 text-tertiary shrink-0" />
          </div>
          <div className="text-headline-small font-black text-tertiary">
            {needsReviewCount}
          </div>
          <span className="text-label-small text-on-surface-variant font-medium block truncate">Marked for repetition</span>
        </div>

        <div 
          onClick={() => {
            SoundEffects.playClick();
            setActiveFilter('bookmarked');
          }}
          className={`p-3.5 sm:p-4 rounded-shape-xl border cursor-pointer transition-all min-w-0 col-span-2 sm:col-span-1 ${
            activeFilter === 'bookmarked' 
              ? 'bg-secondary-container text-on-secondary-container border-secondary/50 shadow-md ring-2 ring-secondary/40' 
              : 'bg-surface-container-high border-outline-variant/30 hover:border-secondary/40'
          }`}
        >
          <div className="flex items-center justify-between text-on-surface-variant text-label-small font-bold mb-1">
            <span className="truncate">Bookmarked</span>
            <Bookmark className="w-4 h-4 text-secondary fill-secondary/20 shrink-0" />
          </div>
          <div className="text-headline-small font-black text-secondary">
            {bookmarkedCount}
          </div>
          <span className="text-label-small text-on-surface-variant font-medium block truncate">Saved for study</span>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6 w-full max-w-full min-w-0">
        <div className="relative flex-1 w-full min-w-0">
          <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="case-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cases by organ, symptoms (e.g. Murphy, dysphagia, hematemesis, S-curve)..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-outline-variant/30 rounded-shape-full text-body-medium text-on-surface placeholder:text-on-surface-variant focus:outline-hidden focus:border-primary/60 focus:ring-1 focus:ring-primary/40 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-label-small text-on-surface-variant hover:text-on-surface bg-surface-container-highest px-2 py-0.5 rounded-shape-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Chip Group */}
        <div 
          id="case-filter-chip-group"
          className="inline-flex items-center p-1 rounded-shape-full bg-surface-container border border-outline-variant/30 shadow-inner overflow-x-auto w-full sm:w-auto max-w-full min-w-0"
        >
          {filterOptions.map((opt) => {
            const isSelected = activeFilter === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  SoundEffects.playClick();
                  setActiveFilter(opt.id);
                }}
                className={`relative px-3.5 py-1.5 rounded-shape-full text-label-medium font-bold transition-colors z-10 whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'text-on-secondary-container font-black'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="case-filter-chip-pill"
                    className="absolute inset-0 rounded-shape-full bg-secondary-container border border-outline-variant/30 shadow-xs -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 28, mass: 0.8 }}
                  />
                )}
                {opt.icon}
                <span>{opt.label} ({opt.count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* When filtering or searching, show the case list directly */}
      {(searchQuery.trim() !== '' || activeFilter !== 'all') ? (
        <div className="space-y-3 mb-10">
          <div className="flex items-center justify-between text-label-small font-bold text-on-surface-variant mb-2">
            <span>Showing {filteredCases.length} clinical case{filteredCases.length === 1 ? '' : 's'}</span>
            {filteredCases.length > 0 && (
              <button
                onClick={() => onStartFilterSession(filteredCases, `Filtered Cases (${filteredCases.length})`)}
                className="text-primary hover:underline flex items-center gap-1 font-bold"
              >
                <span>Study this set</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {filteredCases.length === 0 ? (
            <div className="text-center py-12 bg-surface-container-high rounded-shape-xl border border-outline-variant/30 shadow-xs">
              <p className="text-title-medium font-bold text-on-surface">No cases matched your filter criteria.</p>
              <p className="text-body-small text-on-surface-variant mt-1">Try clearing your search query or selecting "All".</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
                className="mt-4 px-4 py-2 rounded-shape-full bg-surface-container-highest text-label-medium font-bold text-on-surface hover:bg-surface-container border border-outline-variant/30 transition-colors"
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
                    className="p-4 rounded-shape-xl bg-surface-container-high border border-outline-variant/30 hover:border-primary/50 hover:bg-surface-container cursor-pointer transition-all flex flex-col justify-between group shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 text-label-small font-black bg-primary-container text-on-primary-container border border-outline-variant/30 rounded-shape-xs">
                            Case #{c.id} (Problem #{c.number})
                          </span>
                          <span className="text-label-small text-on-surface-variant font-bold truncate max-w-[160px]">
                            {c.topicTitleEn}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {srsInfo && (
                            <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-shape-full border ${
                              srsInfo.isDue
                                ? 'text-error bg-error-container border-error/30'
                                : 'text-secondary bg-secondary-container border-secondary/30'
                            }`}>
                              <Clock className="w-2.5 h-2.5" />
                              <span>{srsInfo.label}</span>
                            </span>
                          )}
                          {(status === 'knew_it' || status === 'mastered') && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-on-primary-container bg-primary-container px-2 py-0.5 rounded-shape-full border border-outline-variant/30">
                              <CheckCircle2 className="w-3 h-3" /> Knew It
                            </span>
                          )}
                          {status === 'needs_review' && !srsInfo && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-on-tertiary-container bg-tertiary-container px-2 py-0.5 rounded-shape-full border border-outline-variant/30">
                              <AlertCircle className="w-3 h-3" /> Review
                            </span>
                          )}
                          {isBookmarked && (
                            <Bookmark className="w-3.5 h-3.5 text-secondary fill-secondary" />
                          )}
                        </div>
                      </div>

                      <p className="text-body-small text-on-surface font-medium line-clamp-3 leading-relaxed">
                        {c.stem}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-outline-variant/30 flex items-center justify-between text-label-small text-on-surface-variant font-bold">
                      <span>{c.questions.length} sub-questions</span>
                      <span className="text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1">
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
                className="p-5 rounded-shape-xl bg-surface-container-high border border-outline-variant/30 shadow-md hover:border-primary/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="w-12 h-12 rounded-shape-lg bg-primary-container/40 border border-outline-variant/30 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                      {t.icon}
                    </div>
                    <div className="text-right">
                      <span className="text-label-small font-black text-on-primary-container bg-primary-container border border-outline-variant/30 px-2 py-0.5 rounded-shape-xs">
                        {topicCases.length} cases
                      </span>
                      <div className="text-label-small text-on-surface-variant font-bold mt-0.5">
                        {masteredInTopic} mastered
                      </div>
                    </div>
                  </div>

                  {/* Titles */}
                  <h3 className="font-extrabold text-on-surface text-title-medium leading-snug group-hover:text-primary transition-colors">
                    {t.titleEn}
                  </h3>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-label-small font-bold text-on-surface-variant mb-1.5">
                      <span>Reviewed</span>
                      <span className="text-on-surface">{reviewedInTopic} / {topicCases.length} ({percent}%)</span>
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
                    id={`btn-study-topic-cases-${t.id}`}
                    onClick={() => {
                      SoundEffects.playClick();
                      onSelectTopic(t.id);
                    }}
                    className="flex-1 py-2.5 rounded-shape-full bg-primary hover:opacity-95 active:scale-98 text-on-primary font-black text-label-medium shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
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
