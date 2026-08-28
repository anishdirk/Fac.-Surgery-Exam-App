import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Bookmark, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Stethoscope, 
  Sparkles, 
  HelpCircle,
  Mic,
  MicOff,
  Loader2,
  RefreshCw,
  XCircle,
  MessageSquarePlus
} from 'lucide-react';
import { 
  ClinicalCase, 
  CaseProgress, 
  CaseComparisonResult, 
  CaseComparisonStatus 
} from '../types';
import { SoundEffects } from '../utils/audio';

interface CaseReviewCardProps {
  clinicalCase: ClinicalCase;
  sessionCases: ClinicalCase[];
  currentIndex: number;
  onNavigateIndex: (index: number) => void;
  caseProgress: CaseProgress;
  onUpdateSelfRating: (caseId: number, rating: 'knew_it' | 'needs_review' | 'mastered' | null) => void;
  onToggleBookmark: (caseId: number) => void;
  onExit: () => void;
  sessionTitle?: string;
}

// Check speech recognition support
const getSpeechRecognitionClass = () => {
  if (typeof window === 'undefined') return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
};

export const CaseReviewCard: React.FC<CaseReviewCardProps> = ({
  clinicalCase,
  sessionCases,
  currentIndex,
  onNavigateIndex,
  caseProgress,
  onUpdateSelfRating,
  onToggleBookmark,
  onExit,
  sessionTitle = 'Clinical Cases'
}) => {
  // Reveal states for answers: individual per sub-question or all
  const [revealedQuestions, setRevealedQuestions] = useState<Record<string, boolean>>({});

  // User free-form answer state
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [comparisonError, setComparisonError] = useState<string | null>(null);
  const [comparisonResult, setComparisonResult] = useState<CaseComparisonResult | null>(null);

  const recognitionRef = useRef<any>(null);
  const baseTextRef = useRef<string>('');

  const isSpeechSupported = !!getSpeechRecognitionClass();

  // Reset states when case changes
  useEffect(() => {
    // Stop any ongoing speech recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
    setSpeechError(null);
    setUserAnswer('');
    baseTextRef.current = '';
    setComparisonError(null);
    setComparisonResult(null);
    setRevealedQuestions({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [clinicalCase.id]);

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  const totalQuestions = clinicalCase.questions.length;
  const allRevealed = clinicalCase.questions.every((q, idx) => {
    const key = q.id || String(q.num || idx + 1);
    return !!revealedQuestions[key];
  });

  const toggleRevealAll = () => {
    SoundEffects.playClick();
    if (allRevealed) {
      setRevealedQuestions({});
    } else {
      const all: Record<string, boolean> = {};
      clinicalCase.questions.forEach((q, idx) => {
        const key = q.id || String(q.num || idx + 1);
        all[key] = true;
      });
      setRevealedQuestions(all);
    }
  };

  const toggleRevealSingle = (key: string) => {
    SoundEffects.playClick();
    setRevealedQuestions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Toggle Speech Recognition (hardcoded en-US with full error feedback)
  const toggleSpeechRecognition = async () => {
    const SpeechRecognition = getSpeechRecognitionClass();
    if (!SpeechRecognition) {
      setSpeechError(
        'Speech recognition is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari, or type your answer directly.'
      );
      return;
    }

    if (isListening) {
      SoundEffects.playClick();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
      setIsListening(false);
      return;
    }

    setSpeechError(null);

    // Request microphone permission if available via getUserMedia to trigger iframe/browser prompt smoothly
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Release tracks immediately as SpeechRecognition will manage its own audio capture
        stream.getTracks().forEach(track => track.stop());
      } catch (micErr: any) {
        console.warn('Microphone permission request failed:', micErr);
        if (micErr.name === 'NotAllowedError' || micErr.name === 'PermissionDeniedError') {
          setSpeechError(
            'Microphone access was denied. Please allow microphone permissions in your browser address bar or settings.'
          );
          return;
        }
      }
    }

    try {
      SoundEffects.playClick();
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      // Store current text as base so incoming transcript appends nicely
      baseTextRef.current = userAnswer.trim();

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        const base = baseTextRef.current;
        const separator = base && !base.endsWith(' ') ? ' ' : '';
        const speechContent = (finalTranscript + interimTranscript).trim();
        const combined = base ? `${base}${separator}${speechContent}` : speechContent;
        setUserAnswer(combined);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission was blocked. Please enable microphone access in your browser or open in a new tab.');
        } else if (event.error === 'service-not-allowed') {
          setSpeechError('Speech recognition service is not allowed in this iframe. Try opening the app in a new window or typing your answer.');
        } else if (event.error === 'audio-capture') {
          setSpeechError('No microphone was detected. Please verify your audio input device.');
        } else if (event.error === 'network') {
          setSpeechError('Network error connecting to speech recognition server.');
        } else if (event.error !== 'no-speech') {
          setSpeechError(`Voice recognition issue (${event.error}). You can type your answer directly.`);
        }

        if (event.error !== 'no-speech') {
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        baseTextRef.current = '';
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Error starting speech recognition:', err);
      setIsListening(false);
      setSpeechError(
        'Could not start speech recognition. You can type your answer into the box.'
      );
    }
  };

  // Submit Answer to Gemini Comparison API
  const handleCompare = async () => {
    if (!userAnswer.trim() || isComparing) return;

    // Stop speech recognition if listening
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      setIsListening(false);
    }

    setIsComparing(true);
    setComparisonError(null);
    SoundEffects.playClick();

    try {
      const payload = {
        stem: clinicalCase.stem,
        questions: clinicalCase.questions.map((q, idx) => ({
          id: q.id || `q${idx + 1}`,
          text: q.text
        })),
        answers: clinicalCase.answers.map((a, idx) => ({
          questionId: a.questionId || (clinicalCase.questions[idx]?.id || `q${idx + 1}`),
          text: a.text
        })),
        userAnswer: userAnswer.trim()
      };

      const response = await fetch('/api/compare-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned ${response.status}`);
      }

      const data: CaseComparisonResult = await response.json();
      setComparisonResult(data);
      SoundEffects.playCorrect();

      // Automatically reveal all sub-questions and their model answers so the user can compare
      const all: Record<string, boolean> = {};
      clinicalCase.questions.forEach((q, idx) => {
        const key = q.id || String(q.num || idx + 1);
        all[key] = true;
      });
      setRevealedQuestions(all);

      // Pre-select self-rating based on AI verdict if not currently rated
      const currentRatingVal = caseProgress.caseSelfRating?.[clinicalCase.id];
      if (!currentRatingVal && data.perQuestion) {
        const hasCriticalIssue = data.perQuestion.some(
          p => p.status === 'missing' || p.status === 'incorrect'
        );
        if (hasCriticalIssue) {
          onUpdateSelfRating(clinicalCase.id, 'needs_review');
        } else {
          onUpdateSelfRating(clinicalCase.id, 'knew_it');
        }
      }
    } catch (err: any) {
      console.error('Case comparison error:', err);
      setComparisonError(
        err.message || 'Failed to analyze answer. You can still reveal and study the model answers directly.'
      );
    } finally {
      setIsComparing(false);
    }
  };

  const currentRating = caseProgress.caseSelfRating?.[clinicalCase.id];
  const isKnewItOrMastered = currentRating === 'knew_it' || currentRating === 'mastered';
  const isBookmarked = (caseProgress.bookmarkedCaseIds || []).includes(clinicalCase.id);

  // Status Badge Component
  const renderStatusBadge = (status: CaseComparisonStatus) => {
    switch (status) {
      case 'correct':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5" /> Correct
          </span>
        );
      case 'partial':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-xs">
            <AlertCircle className="w-3.5 h-3.5" /> Partial
          </span>
        );
      case 'missing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 shadow-xs">
            <HelpCircle className="w-3.5 h-3.5" /> Missing
          </span>
        );
      case 'incorrect':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 shadow-xs">
            <XCircle className="w-3.5 h-3.5" /> Incorrect
          </span>
        );
      default:
        return null;
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight' && currentIndex < sessionCases.length - 1) {
        onNavigateIndex(currentIndex + 1);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onNavigateIndex(currentIndex - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, sessionCases.length, onNavigateIndex]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          id="btn-case-back"
          onClick={() => {
            SoundEffects.playClick();
            onExit();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-bold transition-colors border border-slate-200 dark:border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Topics</span>
        </button>

        {/* Center Progress */}
        <div className="text-center">
          <div className="text-xs font-black text-slate-500 dark:text-slate-400">
            {sessionTitle}
          </div>
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            Case {currentIndex + 1} of {sessionCases.length}
          </div>
        </div>

        {/* Right Actions: Bookmark & Russian toggle */}
        <div className="flex items-center gap-2">
          <button
            id="btn-case-bookmark"
            onClick={() => {
              SoundEffects.playClick();
              onToggleBookmark(clinicalCase.id);
            }}
            title={isBookmarked ? "Remove Bookmark" : "Bookmark Case"}
            className={`p-2 rounded-xl border transition-all ${
              isBookmarked
                ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.3)]'
                : 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-indigo-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
          style={{ width: `${Math.round(((currentIndex + 1) / sessionCases.length) * 100)}%` }}
        />
      </div>

      {/* Main Case Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#161A23] border border-slate-200 dark:border-slate-800 shadow-xl mb-6">
        
        {/* Case Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 text-xs font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-xl shadow-xs">
              Case #{clinicalCase.id} (Problem #{clinicalCase.number})
            </span>
            <span className="px-3 py-1 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl">
              {clinicalCase.topicTitleEn}
            </span>
          </div>
        </div>

        {/* Patient Case Vignette (Stem) */}
        <div className="mb-6 p-5 rounded-2xl bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2.5">
            <Stethoscope className="w-4 h-4" />
            <span>Clinical Vignette</span>
          </div>
          
          <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
            {clinicalCase.stem}
          </p>
        </div>

        {/* Step 1: Self-Answer Section (Voice & Typed) */}
        <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-50/60 via-slate-50 to-emerald-50/40 dark:from-[#131722] dark:via-[#11151E] dark:to-[#0F1722] border border-indigo-200/80 dark:border-indigo-500/30 shadow-sm transition-all">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <MessageSquarePlus className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Your Clinical Answer</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                    Voice or Typed
                  </span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Talk through your complete diagnostic reasoning and surgical tactics, then compare with the model answers.
                </p>
              </div>
            </div>

            {/* Voice Control */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                id="btn-voice-dictation"
                type="button"
                onClick={toggleSpeechRecognition}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  isListening
                    ? 'bg-rose-500 text-white border-rose-600 shadow-[0_0_12px_rgba(244,63,94,0.4)] animate-pulse'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 shadow-xs'
                }`}
                title={isListening ? "Stop listening" : "Start dictating in English"}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-3.5 h-3.5 text-white" />
                    <span>Stop Dictating</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Dictate</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Speech Error Banner */}
          {speechError && (
            <div className="mb-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-300 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>{speechError}</span>
              </div>
              <button
                type="button"
                onClick={() => setSpeechError(null)}
                className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 font-bold text-xs"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Textarea Input */}
          <div className="relative">
            <textarea
              id="textarea-user-case-answer"
              rows={4}
              value={userAnswer}
              onChange={(e) => {
                setUserAnswer(e.target.value);
                baseTextRef.current = e.target.value;
              }}
              placeholder="State your preliminary diagnosis, key physical findings, required lab/imaging tests, differential diagnoses, and surgical tactics... (One combined answer in English)"
              className="w-full p-3.5 rounded-xl bg-white dark:bg-[#0E1118] border border-slate-300 dark:border-slate-700/80 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all resize-y leading-relaxed"
            />
            {userAnswer.length > 0 && !isListening && (
              <button
                type="button"
                onClick={() => {
                  setUserAnswer('');
                  baseTextRef.current = '';
                }}
                className="absolute top-2.5 right-2.5 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Clear answer"
              >
                <XCircle className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Error Message if API Call fails */}
          {comparisonError && (
            <div className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-800 dark:text-rose-300 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Evaluation note: </span>
                  <span>{comparisonError}</span>
                </div>
              </div>
              <button
                onClick={handleCompare}
                className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 transition-colors shrink-0 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retry</span>
              </button>
            </div>
          )}

          {/* Action Row */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              {isListening ? (
                <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  Recording voice stream in English... Editable anytime.
                </span>
              ) : (
                <span>
                  {userAnswer.trim().length > 0 
                    ? `${userAnswer.trim().split(/\s+/).length} words • ${userAnswer.length} chars` 
                    : 'Tip: You can type, dictate, or mix both.'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-compare-case-answer"
                type="button"
                disabled={!userAnswer.trim() || isComparing}
                onClick={handleCompare}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all border shadow-sm ${
                  !userAnswer.trim() || isComparing
                    ? 'opacity-50 cursor-not-allowed bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border-slate-300 dark:border-slate-700'
                    : 'bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                }`}
              >
                {isComparing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                    <span>Compare to Model Answer</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* AI Comparison Overall Summary Banner (if evaluated) */}
        {comparisonResult && (
          <div className="mb-6 p-5 rounded-2xl bg-indigo-50/70 dark:bg-[#131826] border border-indigo-200 dark:border-indigo-500/40 shadow-md animate-in fade-in duration-300">
            <div className="flex items-center justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h4 className="text-xs font-black uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                  AI Clinical Evaluation & Synthesis
                </h4>
              </div>

              {/* Status tally pill */}
              <div className="flex items-center gap-1.5 text-xs font-bold">
                {comparisonResult.perQuestion && (
                  <span className="px-2 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700/60">
                    {comparisonResult.perQuestion.filter(p => p.status === 'correct').length}/{comparisonResult.perQuestion.length} Correct
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {comparisonResult.overallSummary}
            </p>
          </div>
        )}

        {/* Sub-Questions Header & Global Controls */}
        <div className="flex items-center justify-between gap-3 mb-4 pt-2">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
            Clinical Questions ({totalQuestions})
          </h2>

          <div className="flex items-center gap-2">
            <button
              id="btn-reveal-all-answers"
              onClick={toggleRevealAll}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all"
            >
              {allRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{allRevealed ? 'Hide All Answers' : 'Reveal All Answers'}</span>
            </button>
          </div>
        </div>

        {/* List of Sub-Questions with Answers & AI Feedback */}
        <div className="space-y-4">
          {clinicalCase.questions.map((q, idx) => {
            const questionKey = q.id || String(q.num || idx + 1);
            const isRevealed = !!revealedQuestions[questionKey];
            const answer = clinicalCase.answers.find(a => 
              (a.questionId && a.questionId === q.id) || 
              (a.num && a.num === q.num) ||
              (clinicalCase.answers.indexOf(a) === idx)
            );
            const displayNumber = q.num || idx + 1;

            // Find matching perQuestion AI feedback if available
            const questionFeedback = comparisonResult?.perQuestion?.find(
              (p) => p.questionId === (q.id || `q${idx + 1}`) || p.questionId === questionKey || p.questionId === String(displayNumber)
            );

            return (
              <div
                key={questionKey}
                id={`sub-question-${questionKey}`}
                className={`p-4 rounded-2xl border transition-all ${
                  questionFeedback
                    ? questionFeedback.status === 'correct'
                      ? 'bg-emerald-50/40 dark:bg-[#11171F] border-emerald-500/40 shadow-xs'
                      : questionFeedback.status === 'partial'
                      ? 'bg-amber-50/40 dark:bg-[#171614] border-amber-500/40 shadow-xs'
                      : questionFeedback.status === 'incorrect'
                      ? 'bg-rose-50/40 dark:bg-[#181316] border-rose-500/40 shadow-xs'
                      : 'bg-slate-50/80 dark:bg-[#141822] border-slate-300 dark:border-slate-700 shadow-xs'
                    : isRevealed
                    ? 'bg-emerald-50/50 dark:bg-[#121620] border-emerald-500/40 shadow-sm'
                    : 'bg-slate-50 dark:bg-[#141822] border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Question Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {displayNumber}
                    </span>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                          {q.text}
                        </p>
                        {questionFeedback && renderStatusBadge(questionFeedback.status)}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleRevealSingle(questionKey)}
                    className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                      isRevealed
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-300 dark:hover:bg-slate-700'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                    }`}
                  >
                    {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{isRevealed ? 'Hide Model' : 'Model Answer'}</span>
                  </button>
                </div>

                {/* AI Specific Question Feedback Callout (if evaluated) */}
                {questionFeedback && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800/80">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-[#0D1017] border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-indigo-900 dark:text-indigo-300">AI Feedback: </span>
                        <span>{questionFeedback.feedback}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Model Answer Drawer */}
                {isRevealed && answer && (
                  <div className="mt-3.5 pt-3.5 border-t border-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-500/30 text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 leading-relaxed animate-in fade-in duration-200">
                    <div className="flex items-center gap-1.5 text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Authoritative Model Answer:</span>
                    </div>
                    <p className="font-medium text-emerald-900 dark:text-emerald-100">
                      {answer.text}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Self-Assessment & Rating Section */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Self-Assessment Rating
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Rate your clinical confidence for this problem (user has final say)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-rate-needs-review"
                onClick={() => {
                  SoundEffects.playClick();
                  onUpdateSelfRating(clinicalCase.id, currentRating === 'needs_review' ? null : 'needs_review');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                  currentRating === 'needs_review'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                    : 'bg-slate-100 dark:bg-[#141822] text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-50 dark:hover:bg-amber-500/10'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                <span>Needs Review</span>
              </button>

              <button
                id="btn-rate-knew-it"
                onClick={() => {
                  SoundEffects.playCorrect();
                  onUpdateSelfRating(clinicalCase.id, isKnewItOrMastered ? null : 'knew_it');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                  isKnewItOrMastered
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                    : 'bg-slate-100 dark:bg-[#141822] text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Got It</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Navigation Toolbar */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#161A23] border border-slate-200 dark:border-slate-800 shadow-md">
        <button
          id="btn-prev-case"
          disabled={currentIndex === 0}
          onClick={() => {
            SoundEffects.playClick();
            onNavigateIndex(currentIndex - 1);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all border ${
            currentIndex === 0
              ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600'
              : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 active:scale-95'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous Case</span>
        </button>

        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 hidden sm:inline">
          Use left / right arrow keys to navigate
        </span>

        <button
          id="btn-next-case"
          disabled={currentIndex === sessionCases.length - 1}
          onClick={() => {
            SoundEffects.playClick();
            onNavigateIndex(currentIndex + 1);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs transition-all border ${
            currentIndex === sessionCases.length - 1
              ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600'
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-emerald-400 shadow-md active:scale-95'
          }`}
        >
          <span>Next Case</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
