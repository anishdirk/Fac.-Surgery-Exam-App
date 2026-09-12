import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  MessageSquarePlus,
  WifiOff,
  Gauge,
  AlertTriangle,
  ShieldCheck,
  RotateCcw,
  Brain,
  ChevronDown,
  ChevronUp,
  Pencil,
  Clock
} from 'lucide-react';
import { 
  ClinicalCase, 
  CaseProgress, 
  CaseComparisonResult, 
  CaseComparisonStatus,
  ConfidenceLevel,
  CaseSubAnswer
} from '../types';
import { SoundEffects } from '../utils/audio';
import { ErrorBoundary } from './ErrorBoundary';
import { parseCaseComparisonResponse } from '../utils/caseComparisonParser';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { getCaseSessionRelearningStats } from '../utils/spacedRepetition';

interface CaseReviewCardProps {
  clinicalCase: ClinicalCase;
  sessionCases: ClinicalCase[];
  currentIndex: number;
  onNavigateIndex: (index: number) => void;
  caseProgress: CaseProgress;
  onUpdateSelfRating: (caseId: number, rating: 'knew_it' | 'needs_review' | 'mastered' | null) => void;
  onUpdateCaseConfidence?: (caseId: number, confidence: ConfidenceLevel) => void;
  onSaveCasePretest?: (caseId: number, text: string) => void;
  onSaveCaseElaboration?: (caseId: number, text: string) => void;
  onToggleBookmark: (caseId: number) => void;
  onExit: () => void;
  initialComparisonResult?: CaseComparisonResult | null;
  sessionTitle?: string;
  masteredInSession?: number;
  queuedForRetry?: number;
  totalUniqueCases?: number;
  isRepeat?: boolean;
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
  onUpdateCaseConfidence,
  onSaveCasePretest,
  onSaveCaseElaboration,
  onToggleBookmark,
  onExit,
  initialComparisonResult,
  sessionTitle = 'Clinical Cases',
  masteredInSession,
  queuedForRetry,
  totalUniqueCases,
  isRepeat
}) => {
  // Reveal states for answers: individual per sub-question or all
  const [revealedQuestions, setRevealedQuestions] = useState<Record<string, boolean>>({});

  // Per-sub-question user answer state (keyed by question ID)
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const userAnswersRef = useRef<Record<string, string>>({});
  userAnswersRef.current = userAnswers;

  // Active voice question tracking (which question is receiving dictation)
  const [activeVoiceQuestionId, setActiveVoiceQuestionId] = useState<string | null>(null);
  const activeVoiceQuestionIdRef = useRef<string | null>(null);
  activeVoiceQuestionIdRef.current = activeVoiceQuestionId;

  // Track focused question input
  const [focusedQuestionId, setFocusedQuestionId] = useState<string | null>(null);

  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const interimTranscriptRef = useRef<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [comparisonError, setComparisonError] = useState<string | null>(null);
  const [comparisonResult, setComparisonResult] = useState<CaseComparisonResult | null>(initialComparisonResult || null);
  const [confidence, setConfidence] = useState<ConfidenceLevel | null>(
    caseProgress.caseConfidence?.[clinicalCase.id] || null
  );

  const isOnline = useOnlineStatus();
  const recognitionRef = useRef<any>(null);
  const baseTextRef = useRef<string>('');

  const isSpeechSupported = !!getSpeechRecognitionClass();

  // Pretest (Initial Impression / Priming) State
  const savedPretestObj = caseProgress.casePretests?.[clinicalCase.id];
  const [pretestInput, setPretestInput] = useState<string>(savedPretestObj?.text || '');
  const [isPretestSaved, setIsPretestSaved] = useState<boolean>(!!savedPretestObj?.text);
  const [isPretestSkipped, setIsPretestSkipped] = useState<boolean>(false);
  const [isPretestExpanded, setIsPretestExpanded] = useState<boolean>(true);
  const [isEditingPretest, setIsEditingPretest] = useState<boolean>(false);

  // Elaboration ("Why is this the right answer?") State
  const savedElaborationObj = caseProgress.caseElaborations?.[clinicalCase.id];
  const [elaborationInput, setElaborationInput] = useState<string>(savedElaborationObj?.text || '');
  const [isElaborationSaved, setIsElaborationSaved] = useState<boolean>(!!savedElaborationObj?.text);
  const [isElaborationSkipped, setIsElaborationSkipped] = useState<boolean>(false);
  const [isElaborationExpanded, setIsElaborationExpanded] = useState<boolean>(true);
  const [isEditingElaboration, setIsEditingElaboration] = useState<boolean>(false);

  // Tracking refs to ensure "move on" auto-saving without stale closures
  const pretestInputRef = useRef(pretestInput);
  pretestInputRef.current = pretestInput;
  const isPretestSavedRef = useRef(isPretestSaved);
  isPretestSavedRef.current = isPretestSaved;

  const elaborationInputRef = useRef(elaborationInput);
  elaborationInputRef.current = elaborationInput;
  const isElaborationSavedRef = useRef(isElaborationSaved);
  isElaborationSavedRef.current = isElaborationSaved;

  const currentCaseIdRef = useRef(clinicalCase.id);

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return null;
    try {
      return new Date(timestamp).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return null;
    }
  };

  // Helper to flush / auto-save any entered reflections when moving on or switching cases
  const flushUnsavedReflections = (targetCaseId = clinicalCase.id) => {
    const enteredPretest = pretestInputRef.current.trim();
    if (enteredPretest && !isPretestSavedRef.current) {
      onSaveCasePretest?.(targetCaseId, enteredPretest);
      setIsPretestSaved(true);
    }
    const enteredElaboration = elaborationInputRef.current.trim();
    if (enteredElaboration && !isElaborationSavedRef.current) {
      onSaveCaseElaboration?.(targetCaseId, enteredElaboration);
      setIsElaborationSaved(true);
    }
  };

  // Reset states when case changes
  useEffect(() => {
    const prevCaseId = currentCaseIdRef.current;
    if (prevCaseId !== clinicalCase.id) {
      flushUnsavedReflections(prevCaseId);
      currentCaseIdRef.current = clinicalCase.id;
    }

    const nextPretest = caseProgress.casePretests?.[clinicalCase.id]?.text || '';
    setPretestInput(nextPretest);
    setIsPretestSaved(!!nextPretest);
    setIsPretestSkipped(false);
    setIsPretestExpanded(true);
    setIsEditingPretest(false);

    const nextElaboration = caseProgress.caseElaborations?.[clinicalCase.id]?.text || '';
    setElaborationInput(nextElaboration);
    setIsElaborationSaved(!!nextElaboration);
    setIsElaborationSkipped(false);
    setIsElaborationExpanded(true);
    setIsEditingElaboration(false);

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
    setActiveVoiceQuestionId(null);
    setSpeechError(null);
    setUserAnswers({});
    userAnswersRef.current = {};
    setFocusedQuestionId(null);
    setInterimTranscript('');
    interimTranscriptRef.current = '';
    baseTextRef.current = '';
    setComparisonError(null);
    setComparisonResult(initialComparisonResult || null);
    setRevealedQuestions({});
    setConfidence(caseProgress.caseConfidence?.[clinicalCase.id] || null);

    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [clinicalCase.id, caseProgress.caseConfidence, caseProgress.casePretests, caseProgress.caseElaborations]);

  const handleSelectConfidence = (level: ConfidenceLevel) => {
    SoundEffects.playClick();
    setConfidence(level);
    onUpdateCaseConfidence?.(clinicalCase.id, level);
  };

  const handleSavePretest = () => {
    const trimmed = pretestInput.trim();
    if (!trimmed) return;
    SoundEffects.playClick();
    onSaveCasePretest?.(clinicalCase.id, trimmed);
    setIsPretestSaved(true);
    setIsEditingPretest(false);
  };

  const handleSkipPretest = () => {
    SoundEffects.playClick();
    const trimmed = pretestInput.trim();
    if (trimmed) {
      onSaveCasePretest?.(clinicalCase.id, trimmed);
      setIsPretestSaved(true);
    }
    setIsPretestSkipped(true);
  };

  const handleSaveElaboration = () => {
    const trimmed = elaborationInput.trim();
    if (!trimmed) return;
    SoundEffects.playClick();
    onSaveCaseElaboration?.(clinicalCase.id, trimmed);
    setIsElaborationSaved(true);
    setIsEditingElaboration(false);
  };

  const handleSkipElaboration = () => {
    SoundEffects.playClick();
    const trimmed = elaborationInput.trim();
    if (trimmed) {
      onSaveCaseElaboration?.(clinicalCase.id, trimmed);
      setIsElaborationSaved(true);
    }
    setIsElaborationSkipped(true);
  };

  // Clean up speech recognition & save any pending text on unmount
  useEffect(() => {
    return () => {
      flushUnsavedReflections(currentCaseIdRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  const getQKey = (q: { id?: string; num?: number }, idx: number): string => {
    return q.id || String(q.num != null ? q.num : idx + 1);
  };

  const totalQuestions = clinicalCase.questions.length;
  const allRevealed = clinicalCase.questions.every((q, idx) => {
    const key = getQKey(q, idx);
    return !!revealedQuestions[key];
  });

  const toggleRevealAll = () => {
    SoundEffects.playClick();
    if (allRevealed) {
      setRevealedQuestions({});
    } else {
      const all: Record<string, boolean> = {};
      clinicalCase.questions.forEach((q, idx) => {
        const key = getQKey(q, idx);
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

  // Helper to commit interim speech into userAnswers for a specific question
  const commitInterimSpeech = (targetQId?: string | null) => {
    const qId = targetQId || activeVoiceQuestionIdRef.current;
    if (qId && interimTranscriptRef.current.trim()) {
      const pending = interimTranscriptRef.current.trim();
      setUserAnswers(prev => {
        const existing = prev[qId] || '';
        const sep = existing && !existing.endsWith(' ') ? ' ' : '';
        const updated = existing ? `${existing}${sep}${pending}` : pending;
        baseTextRef.current = updated;
        return { ...prev, [qId]: updated };
      });
      userAnswersRef.current[qId] = (userAnswersRef.current[qId] ? `${userAnswersRef.current[qId]} ` : '') + pending;
      interimTranscriptRef.current = '';
      setInterimTranscript('');
    }
  };

  // Toggle Speech Recognition for a specific sub-question
  const toggleSpeechRecognitionForQuestion = async (qId: string) => {
    const SpeechRecognition = getSpeechRecognitionClass();
    if (!SpeechRecognition) {
      setSpeechError(
        'Speech recognition is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari, or type your answer directly.'
      );
      return;
    }

    if (isListening) {
      SoundEffects.playClick();
      // If clicking stop on the currently active question:
      if (activeVoiceQuestionId === qId) {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch (e) {
            // ignore
          }
        }
        setIsListening(false);
        commitInterimSpeech(qId);
        setActiveVoiceQuestionId(null);
        return;
      }

      // If switching from another question to this question:
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
      commitInterimSpeech(activeVoiceQuestionId);
      setIsListening(false);
      setActiveVoiceQuestionId(null);
    }

    setSpeechError(null);
    setFocusedQuestionId(qId);

    // Request microphone permission if available via getUserMedia to trigger iframe/browser prompt smoothly
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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

      // Store current text of this question as base so incoming transcript appends nicely
      const currentText = (userAnswersRef.current[qId] || '').trim();
      baseTextRef.current = currentText;
      setInterimTranscript('');
      interimTranscriptRef.current = '';
      setActiveVoiceQuestionId(qId);
      activeVoiceQuestionIdRef.current = qId;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        const activeQ = activeVoiceQuestionIdRef.current;
        if (!activeQ) return;

        let sessionFinal = '';
        let currentInterim = '';

        for (let i = 0; i < event.results.length; ++i) {
          const res = event.results[i];
          const transcript = res[0].transcript;
          if (res.isFinal) {
            sessionFinal += transcript + ' ';
          } else {
            currentInterim += transcript;
          }
        }

        const base = baseTextRef.current;
        const separator = base && !base.endsWith(' ') ? ' ' : '';
        const trimmedFinal = sessionFinal.trim();
        const lockedInText = base
          ? (trimmedFinal ? `${base}${separator}${trimmedFinal}` : base)
          : trimmedFinal;

        // Lock confirmed/final text into userAnswers for this question
        setUserAnswers(prev => ({ ...prev, [activeQ]: lockedInText }));
        userAnswersRef.current[activeQ] = lockedInText;

        // Keep interim unfinalized speech in separate state for muted/italic rendering
        const trimmedInterim = currentInterim.trim();
        setInterimTranscript(trimmedInterim);
        interimTranscriptRef.current = trimmedInterim;
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
          commitInterimSpeech(activeVoiceQuestionIdRef.current);
          setActiveVoiceQuestionId(null);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        commitInterimSpeech(activeVoiceQuestionIdRef.current);
        setActiveVoiceQuestionId(null);
        baseTextRef.current = '';
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Error starting speech recognition:', err);
      setSpeechError('Failed to initialize speech recognition. Please type your answer directly.');
      setIsListening(false);
      setActiveVoiceQuestionId(null);
    }
  };

  // Default toggle for voice recognition (targets active or first question)
  const toggleSpeechRecognition = () => {
    const targetQId = activeVoiceQuestionId || focusedQuestionId || clinicalCase.questions[0]?.id || 'q1';
    toggleSpeechRecognitionForQuestion(targetQId);
  };

  const handleAnswerChange = (qId: string, value: string) => {
    setUserAnswers(prev => ({ ...prev, [qId]: value }));
    userAnswersRef.current[qId] = value;
    if (activeVoiceQuestionId === qId) {
      baseTextRef.current = value;
    }
  };

  const handleClearAnswer = (qId: string) => {
    if (isListening && activeVoiceQuestionId === qId) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsListening(false);
      setActiveVoiceQuestionId(null);
    }
    setUserAnswers(prev => ({ ...prev, [qId]: '' }));
    userAnswersRef.current[qId] = '';
    setInterimTranscript('');
    interimTranscriptRef.current = '';
    baseTextRef.current = '';
  };

  // Compare Answer to Model Answers via Server Gemini API
  const handleCompare = async () => {
    // If speech recognition is active, commit interim and stop
    if (isListening && activeVoiceQuestionId) {
      commitInterimSpeech(activeVoiceQuestionId);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      setActiveVoiceQuestionId(null);
    }

    const currentAnswers = userAnswersRef.current;
    const totalQuestions = clinicalCase.questions.length;
    const answeredCount = clinicalCase.questions.filter((q, idx) => {
      const qId = getQKey(q, idx);
      return (currentAnswers[qId] || '').trim().length > 0;
    }).length;

    if (answeredCount < totalQuestions || isComparing) {
      return;
    }

    // Auto-save pretest before comparison starts if user filled it in
    if (pretestInput.trim() && !isPretestSaved) {
      onSaveCasePretest?.(clinicalCase.id, pretestInput.trim());
      setIsPretestSaved(true);
    }

    if (!isOnline || (typeof navigator !== 'undefined' && !navigator.onLine)) {
      setComparisonError('You are currently offline. AI-graded case comparison requires an active internet connection to evaluate answers with Gemini. You can still reveal all model answers below and self-rate your diagnosis.');
      return;
    }

    setIsComparing(true);
    setComparisonError(null);
    SoundEffects.playClick();

    try {
      let sessionId = '';
      try {
        sessionId = sessionStorage.getItem('duomed_client_session_id') || '';
        if (!sessionId) {
          sessionId = 'sess_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
          sessionStorage.setItem('duomed_client_session_id', sessionId);
        }
      } catch {
        sessionId = 'sess_local';
      }

      // Build structured per-question answers array (CaseSubAnswer[])
      const userAnswersArray: CaseSubAnswer[] = clinicalCase.questions.map((q, idx) => {
        const qId = getQKey(q, idx);
        return {
          questionId: qId,
          num: q.num ?? (idx + 1),
          text: (currentAnswers[qId] || '').trim()
        };
      });

      // Build formatted combined answer for backward compatibility and narrative evaluation
      const combinedAnswer = userAnswersArray
        .map((ua, idx) => {
          const q = clinicalCase.questions[idx];
          const qText = q?.text ? ` (${q.text})` : '';
          return `[Question ID: "${ua.questionId}"]${qText}:\n${ua.text}`;
        })
        .join('\n\n');

      const payload = {
        caseId: clinicalCase.id,
        stem: clinicalCase.stem,
        questions: clinicalCase.questions.map((q, idx) => ({
          id: getQKey(q, idx),
          num: q.num ?? (idx + 1),
          text: q.text
        })),
        answers: clinicalCase.answers.map((a, idx) => ({
          questionId: a.questionId || getQKey(clinicalCase.questions[idx] || {}, idx),
          num: a.num ?? (idx + 1),
          text: a.text
        })),
        userAnswers: userAnswersArray,
        userAnswer: combinedAnswer
      };

      const response = await fetch('/api/compare-case', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-session-id': sessionId
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned ${response.status}`);
      }

      const rawData = await response.json();
      const expectedIds = clinicalCase.questions.map((q, idx) => getQKey(q, idx));
      const data: CaseComparisonResult = parseCaseComparisonResponse(rawData, expectedIds);
      setComparisonResult(data);
      SoundEffects.playCorrect();

      // Automatically reveal all sub-questions and their model answers so the user can compare
      const all: Record<string, boolean> = {};
      clinicalCase.questions.forEach((q, idx) => {
        const key = getQKey(q, idx);
        all[key] = true;
      });
      setRevealedQuestions(all);

      // Pre-select self-rating based on AI verdict if not currently rated or if unsatisfactory
      const currentRatingVal = caseProgress.caseSelfRating?.[clinicalCase.id];
      if (data.perQuestion) {
        const hasCriticalIssue = data.perQuestion.some(
          p => p.status === 'missing' || p.status === 'incorrect'
        );
        if (hasCriticalIssue) {
          onUpdateSelfRating(clinicalCase.id, 'needs_review');
        } else if (!currentRatingVal) {
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

  // Successive relearning queue stats for clinical cases
  const computedStats = useMemo(() => {
    return getCaseSessionRelearningStats(
      sessionCases,
      currentIndex,
      caseProgress.caseSelfRating,
      totalUniqueCases
    );
  }, [sessionCases, currentIndex, caseProgress.caseSelfRating, totalUniqueCases]);

  const effectiveMastered = masteredInSession ?? computedStats.masteredInSession;
  const effectiveQueuedForRetry = queuedForRetry ?? computedStats.queuedForRetry;
  const effectiveTotalCases = totalUniqueCases ?? computedStats.totalUniqueCases;
  const effectiveIsRepeat = isRepeat ?? computedStats.isRepeat;

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
            flushUnsavedReflections();
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
      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mb-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
          style={{ width: `${Math.round(((currentIndex + 1) / sessionCases.length) * 100)}%` }}
        />
      </div>

      {/* Successive Relearning Queue Indicator (Higham et al., Rawson & Dunlosky) */}
      <div 
        id="case-relearning-queue-status"
        className="flex items-center justify-between text-label-small font-bold text-on-surface-variant mb-4 px-1"
      >
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
          <span>{effectiveMastered} of {effectiveTotalCases} mastered this session</span>
        </span>
        {effectiveQueuedForRetry > 0 ? (
          <span 
            id="badge-cases-queued-for-retry"
            className="flex items-center gap-1.5 text-on-tertiary-container font-extrabold bg-tertiary-container px-2.5 py-0.5 rounded-shape-xs border border-outline-variant/30"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{effectiveQueuedForRetry} queued for retry</span>
          </span>
        ) : effectiveMastered === effectiveTotalCases ? (
          <span className="text-primary font-semibold">
            ✓ All cases mastered this session
          </span>
        ) : (
          <span className="text-primary/80 font-medium">
            ✓ Relearn queue clear
          </span>
        )}
      </div>

      {/* Repeat Case Badge (Successive Relearning Retry) */}
      {effectiveIsRepeat && (
        <div 
          id="badge-case-repeat"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-shape-full bg-tertiary-container border border-outline-variant/40 text-on-tertiary-container text-label-small font-bold mb-4 shadow-xs animate-in fade-in slide-in-from-top-1 duration-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Mistake Repeat • Successive Relearning (Attempt 2 of 2)</span>
        </div>
      )}

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

        {/* Pretest Step: Initial Impression (Priming / Retrieval Practice) */}
        <div id="case-pretest-section" className="mb-6">
          {isPretestSaved && !isEditingPretest ? (
            <div 
              id="case-pretest-saved-card"
              className="p-4 sm:p-5 rounded-2xl bg-emerald-50/50 dark:bg-[#11171F] border border-emerald-500/30 shadow-xs transition-all"
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Brain className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                      Your Initial Impression (Pretest)
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                      Priming Saved
                    </span>
                    {savedPretestObj?.timestamp && (
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimestamp(savedPretestObj.timestamp)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    id="btn-edit-case-pretest"
                    onClick={() => setIsEditingPretest(true)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    title="Edit initial impression"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button
                    type="button"
                    id="btn-toggle-pretest-view"
                    onClick={() => setIsPretestExpanded(prev => !prev)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                    title={isPretestExpanded ? "Collapse initial impression" : "Expand initial impression"}
                  >
                    {isPretestExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isPretestExpanded && (
                <div className="pt-2 animate-in fade-in duration-200">
                  <div className="p-3 rounded-xl bg-white dark:bg-[#0E121A] border border-emerald-500/20 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    {pretestInput || savedPretestObj?.text}
                  </div>
                  <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 italic">
                    Formulating an initial guess before review primes semantic networks and enhances retention (Richland et al., Kornell et al.).
                  </p>
                </div>
              )}
            </div>
          ) : isPretestSkipped && !isEditingPretest ? (
            <div 
              id="case-pretest-skipped-bar"
              className="p-3 rounded-xl bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400"
            >
              <div className="flex items-center gap-2">
                <Brain className="w-3.5 h-3.5 text-slate-400" />
                <span>Initial impression skipped</span>
              </div>
              <button
                type="button"
                id="btn-show-case-pretest"
                onClick={() => {
                  setIsPretestSkipped(false);
                  setIsEditingPretest(true);
                }}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                + Add Impression
              </button>
            </div>
          ) : (
            <div 
              id="case-pretest-input-card"
              className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50/50 via-slate-50 to-indigo-50/30 dark:from-[#141620] dark:via-[#11141E] dark:to-[#10131D] border border-amber-200/80 dark:border-amber-500/30 shadow-xs transition-all"
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Brain className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Initial Impression (Pretest Priming)</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                        Step 0 • Optional
                      </span>
                    </h4>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2.5">
                What's your initial impression before reviewing this case? Formulating an initial guess activates prior knowledge and boosts diagnostic retention.
              </p>

              <textarea
                id="textarea-case-pretest"
                rows={2}
                value={pretestInput}
                onChange={(e) => {
                  setPretestInput(e.target.value);
                  setIsPretestSaved(false);
                }}
                placeholder="What's your initial impression before reviewing this case? (e.g. Likely acute appendicitis with localized peritonitis; verify Rovsing sign, order ultrasound...)"
                className="w-full p-3 rounded-xl bg-white dark:bg-[#0E1118] border border-slate-300 dark:border-slate-700/80 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all resize-y leading-relaxed"
              />

              <div className="mt-2.5 flex items-center justify-between gap-3 flex-wrap">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Not graded • For retrieval priming only • Skippable anytime
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    id="btn-skip-case-pretest"
                    onClick={handleSkipPretest}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Skip to Case Review
                  </button>
                  <button
                    type="button"
                    id="btn-save-case-pretest"
                    disabled={!pretestInput.trim()}
                    onClick={handleSavePretest}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-xs cursor-pointer ${
                      !pretestInput.trim()
                        ? 'opacity-50 cursor-not-allowed bg-slate-200 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400 font-extrabold active:scale-95'
                    }`}
                  >
                    Save Impression
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step 1: Self-Answer Section (Voice & Typed Per Sub-Question) */}
        {(() => {
          const totalQuestions = clinicalCase.questions.length;
          const answeredQuestionsCount = clinicalCase.questions.filter((q, idx) => {
            const qId = getQKey(q, idx);
            const text = (userAnswers[qId] || '').trim();
            const hasInterim = isListening && activeVoiceQuestionId === qId && interimTranscriptRef.current.trim().length > 0;
            return text.length > 0 || hasInterim;
          }).length;
          const allQuestionsAnswered = totalQuestions > 0 && answeredQuestionsCount === totalQuestions;

          return (
            <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-50/60 via-slate-50 to-emerald-50/40 dark:from-[#131722] dark:via-[#11151E] dark:to-[#0F1722] border border-indigo-200/80 dark:border-indigo-500/30 shadow-sm transition-all">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <MessageSquarePlus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Your Clinical Answers</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                        {totalQuestions} Sub-Questions
                      </span>
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Answer each sub-question individually with your diagnostic reasoning and surgical tactics, then compare with the model answers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Speech Error Banner */}
              {speechError && (
                <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-300 flex items-start justify-between gap-3">
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

              {/* Continuous Scrollable List of Sub-Questions with Inputs */}
              <div className="space-y-4">
                {clinicalCase.questions.map((q, idx) => {
                  const qId = getQKey(q, idx);
                  const displayNumber = q.num ?? (idx + 1);
                  const isThisQuestionListening = isListening && activeVoiceQuestionId === qId;
                  const questionAns = userAnswers[qId] || '';
                  const trimmedAns = questionAns.trim();
                  const wordCount = trimmedAns.length > 0 ? trimmedAns.split(/\s+/).length : 0;
                  const charCount = questionAns.length;
                  const isAnswered = trimmedAns.length > 0 || (isThisQuestionListening && interimTranscript.trim().length > 0);

                  return (
                    <div
                      key={qId}
                      id={`case-question-input-card-${qId}`}
                      className={`p-4 rounded-xl border transition-all ${
                        isThisQuestionListening
                          ? 'bg-white dark:bg-[#0E111A] border-indigo-500 shadow-[0_0_0_2px_rgba(99,102,241,0.2)]'
                          : 'bg-white/80 dark:bg-[#0E1118]/80 border-slate-200 dark:border-slate-800/80 shadow-xs'
                      }`}
                    >
                      {/* Sub-Question Header */}
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <div className="flex items-start gap-2.5 flex-1">
                          <span className="w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {displayNumber}
                          </span>
                          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                            {q.text}
                          </p>
                        </div>

                        {/* Per-Question Voice Control */}
                        {isSpeechSupported && (
                          <button
                            id={`btn-voice-dictation-${qId}`}
                            type="button"
                            onClick={() => toggleSpeechRecognitionForQuestion(qId)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border shrink-0 ${
                              isThisQuestionListening
                                ? 'bg-rose-500 text-white border-rose-600 shadow-[0_0_10px_rgba(244,63,94,0.4)] animate-pulse'
                                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-xs'
                            }`}
                            title={isThisQuestionListening ? "Stop dictating" : `Dictate answer for question ${displayNumber}`}
                          >
                            {isThisQuestionListening ? (
                              <>
                                <MicOff className="w-3 h-3 text-white" />
                                <span>Stop</span>
                              </>
                            ) : (
                              <>
                                <Mic className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                                <span>Dictate</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Input / Live Voice Transcription */}
                      <div className="relative">
                        {isThisQuestionListening ? (
                          <div
                            id={`voice-transcription-display-${qId}`}
                            className="w-full min-h-[84px] p-3 rounded-lg bg-indigo-50/20 dark:bg-[#0B0E16] border border-indigo-500/60 text-xs sm:text-sm leading-relaxed overflow-y-auto max-h-48"
                          >
                            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-indigo-100 dark:border-indigo-950/60 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                                Dictating Q{displayNumber}...
                              </span>
                              <span className="text-[10px] text-slate-400">English (US)</span>
                            </div>

                            {questionAns || interimTranscript ? (
                              <div className="whitespace-pre-wrap break-words leading-relaxed">
                                <span className="text-slate-900 dark:text-slate-100 font-normal">
                                  {questionAns}
                                </span>
                                {questionAns && interimTranscript && !questionAns.endsWith(' ') ? ' ' : ''}
                                {interimTranscript && (
                                  <span className="text-slate-400 dark:text-slate-500 italic bg-indigo-50/60 dark:bg-indigo-950/40 px-1 py-0.5 rounded">
                                    {interimTranscript}
                                  </span>
                                )}
                                <span className="inline-block w-1.5 h-3.5 ml-1 bg-indigo-500 animate-pulse align-middle rounded-xs" />
                              </div>
                            ) : (
                              <div className="py-2 text-center text-slate-400 dark:text-slate-500 italic text-xs">
                                Listening... Speak your answer for Question {displayNumber}.
                              </div>
                            )}
                          </div>
                        ) : (
                          <textarea
                            id={`textarea-case-answer-${qId}`}
                            data-testid={`textarea-sub-answer-${qId}`}
                            data-case-answer-id={qId}
                            rows={3}
                            value={questionAns}
                            onFocus={() => setFocusedQuestionId(qId)}
                            onChange={(e) => handleAnswerChange(qId, e.target.value)}
                            placeholder={`Enter your answer for question ${displayNumber}...`}
                            className="w-full p-3 rounded-lg bg-white dark:bg-[#0B0E16] border border-slate-300 dark:border-slate-700/80 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all resize-y leading-relaxed"
                          />
                        )}

                        {questionAns.length > 0 && !isThisQuestionListening && (
                          <button
                            type="button"
                            onClick={() => handleClearAnswer(qId)}
                            className="absolute top-2 right-2 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title={`Clear answer for question ${displayNumber}`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Per-Question Footer: Word/Char Counter & Answered Status */}
                      <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-0.5">
                        <span>
                          {wordCount} {wordCount === 1 ? 'word' : 'words'} • {charCount} {charCount === 1 ? 'char' : 'chars'}
                        </span>
                        {isAnswered ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" />
                            Answered
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                            Required
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Offline Notice for AI Comparison */}
              {!isOnline && (
                <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2.5 animate-in fade-in duration-200">
                  <WifiOff className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <span className="font-bold">Offline Notice: </span>
                    <span>AI diagnostic grading requires an internet connection. You can still reveal the model answers below and self-rate your answers offline.</span>
                  </div>
                </div>
              )}

              {/* Error Message if API Call fails */}
              {comparisonError && (
                <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-800 dark:text-rose-300 flex items-start justify-between gap-3">
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

              {/* Bottom Action Row with Submit Button & Completion Counter */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-indigo-100 dark:border-indigo-950/60">
                <div data-testid="case-answer-progress" className="text-xs">
                  {allQuestionsAnswered ? (
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      All {totalQuestions} answered • Ready to compare
                    </span>
                  ) : (
                    <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                      {answeredQuestionsCount} of {totalQuestions} answered
                      <span className="text-amber-700 dark:text-amber-400 font-bold ml-1">
                        ({totalQuestions - answeredQuestionsCount} remaining)
                      </span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="btn-compare-case-answer"
                    data-testid="btn-submit-case-compare"
                    type="button"
                    disabled={!allQuestionsAnswered || isComparing || !isOnline}
                    onClick={handleCompare}
                    title={
                      !isOnline 
                        ? "AI comparison is unavailable offline" 
                        : !allQuestionsAnswered 
                        ? `Please answer all ${totalQuestions} sub-questions to compare`
                        : undefined
                    }
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all border shadow-sm ${
                      !allQuestionsAnswered || isComparing || !isOnline
                        ? 'opacity-60 cursor-not-allowed bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-500 border-slate-300 dark:border-slate-700'
                        : 'bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)] cursor-pointer'
                    }`}
                  >
                    {!isOnline ? (
                      <>
                        <WifiOff className="w-3.5 h-3.5 text-amber-500" />
                        <span>AI Offline (Internet Required)</span>
                      </>
                    ) : isComparing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Analyzing with Gemini...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                        <span>Compare to Model Answers</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          );
        })()}

        {/* AI Comparison Overall Summary Banner (if evaluated) */}
        {comparisonResult && (
          <ErrorBoundary
            fallbackTitle="AI Comparison Display Error"
            fallbackMessage="An unexpected error occurred while displaying the AI analysis. You can reset it and review the authoritative model answer directly."
            resetButtonText="Reset AI Comparison"
            onReset={() => setComparisonResult(null)}
          >
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
          </ErrorBoundary>
        )}

        {/* Step 3: Elaborative Reflection ("Why is this the right answer?") */}
        {/* Shown post AI-comparison OR if previously saved elaboration exists */}
        {(comparisonResult || savedElaborationObj?.text) && (
          <div id="case-elaboration-section" className="mb-6">
            {isElaborationSaved && !isEditingElaboration ? (
              <div 
                id="case-elaboration-saved-card"
                className="p-4 sm:p-5 rounded-2xl bg-indigo-50/50 dark:bg-[#121624] border border-indigo-500/30 shadow-xs transition-all"
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-black uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                        Why is this the right answer? (Your Reflection)
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
                        Elaboration Saved
                      </span>
                      {savedElaborationObj?.timestamp && (
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(savedElaborationObj.timestamp)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      id="btn-edit-case-elaboration"
                      onClick={() => setIsEditingElaboration(true)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      title="Edit clinical elaboration"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      type="button"
                      id="btn-toggle-elaboration-view"
                      onClick={() => setIsElaborationExpanded(prev => !prev)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                      title={isElaborationExpanded ? "Collapse elaboration" : "Expand elaboration"}
                    >
                      {isElaborationExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isElaborationExpanded && (
                  <div className="pt-2 animate-in fade-in duration-200">
                    <div className="p-3 rounded-xl bg-white dark:bg-[#0E111A] border border-indigo-500/20 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      {elaborationInput || savedElaborationObj?.text}
                    </div>
                    <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 italic">
                      Elaborative interrogation clarifies underlying pathophysiological mechanisms and deepens diagnostic mastery (Dunlosky et al.).
                    </p>
                  </div>
                )}
              </div>
            ) : isElaborationSkipped && !isEditingElaboration ? (
              <div 
                id="case-elaboration-skipped-bar"
                className="p-3 rounded-xl bg-slate-50 dark:bg-[#0F1218] border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                  <span>Elaboration reflection skipped</span>
                </div>
                <button
                  type="button"
                  id="btn-show-case-elaboration"
                  onClick={() => {
                    setIsElaborationSkipped(false);
                    setIsEditingElaboration(true);
                  }}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  + Add Reflection
                </button>
              </div>
            ) : (
              <div 
                id="case-elaboration-input-card"
                className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50/50 via-slate-50 to-purple-50/30 dark:from-[#131726] dark:via-[#111420] dark:to-[#161224] border border-indigo-200/80 dark:border-indigo-500/30 shadow-xs transition-all"
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Why is this the right answer? (Elaborative Reflection)</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
                          Optional Reflection
                        </span>
                      </h4>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2.5">
                  Explain the pathophysiological mechanisms or clinical rationale in your own words. Why is this diagnosis and management strategy correct?
                </p>

                <textarea
                  id="textarea-case-elaboration"
                  rows={3}
                  value={elaborationInput}
                  onChange={(e) => {
                    setElaborationInput(e.target.value);
                    setIsElaborationSaved(false);
                  }}
                  placeholder="In your own words: Why is this the right answer? (e.g. Luminal obstruction of the vermiform appendix leads to bacterial proliferation and mural ischemia, which is why immediate surgery is curative before transmural perforation occurs...)"
                  className="w-full p-3.5 rounded-xl bg-white dark:bg-[#0E1118] border border-slate-300 dark:border-slate-700/80 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all resize-y leading-relaxed"
                />

                <div className="mt-2.5 flex items-center justify-between gap-3 flex-wrap">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Optional step • You can continue to questions or ratings anytime
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      id="btn-skip-case-elaboration"
                      onClick={handleSkipElaboration}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Skip
                    </button>
                    <button
                      type="button"
                      id="btn-save-case-elaboration"
                      disabled={!elaborationInput.trim()}
                      onClick={handleSaveElaboration}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-xs cursor-pointer ${
                        !elaborationInput.trim()
                          ? 'opacity-50 cursor-not-allowed bg-slate-200 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500 font-extrabold active:scale-95 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                      }`}
                    >
                      Save Reflection
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sub-Questions Header & Global Controls */}
        {/* Diagnostic Confidence Check Before Revealing Answers */}
        <div className="mb-6 p-4 rounded-2xl bg-indigo-50/60 dark:bg-[#121622] border border-indigo-200/80 dark:border-indigo-800/60 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                <Gauge className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Diagnostic Confidence Check (Before Revealing Answers)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                How confident are you in your clinical formulation before inspecting model answers?
              </p>
            </div>

            <div className="inline-flex items-center gap-2">
              <button
                type="button"
                id="btn-case-confidence-low"
                onClick={() => handleSelectConfidence('low')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  confidence === 'low'
                    ? 'bg-slate-700 text-white border-slate-600 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                Low (Unsure)
              </button>
              <button
                type="button"
                id="btn-case-confidence-medium"
                onClick={() => handleSelectConfidence('medium')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  confidence === 'medium'
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                    : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60'
                }`}
              >
                Medium (Likely)
              </button>
              <button
                type="button"
                id="btn-case-confidence-high"
                onClick={() => handleSelectConfidence('high')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
                  confidence === 'high'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                }`}
              >
                High (Certain)
              </button>
            </div>
          </div>
        </div>

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
                  <ErrorBoundary
                    fallbackTitle="Feedback Error"
                    fallbackMessage="Could not display AI feedback for this question."
                    resetButtonText="Dismiss"
                  >
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800/80">
                      <div className="p-2.5 rounded-xl bg-white dark:bg-[#0D1017] border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div>
                            <span className="font-bold text-indigo-900 dark:text-indigo-300">AI Feedback: </span>
                            <span>{questionFeedback.feedback}</span>
                          </div>

                          {/* Compact phrase-level diff comparison for missing or incorrect points */}
                          {(questionFeedback.status === 'missing' || questionFeedback.status === 'incorrect') && questionFeedback.expectedPhrase && (
                            <div
                              data-testid={`phrase-diff-${questionFeedback.questionId}`}
                              className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap items-center gap-1.5 text-xs"
                            >
                              {questionFeedback.matchedPhrase && questionFeedback.matchedPhrase.trim() ? (
                                <>
                                  <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 line-through decoration-rose-400 dark:decoration-rose-600 opacity-85">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500/80 dark:text-rose-400/80 no-underline mr-0.5">Said:</span>
                                    "{questionFeedback.matchedPhrase.trim()}"
                                  </span>
                                  <span className="text-slate-400 dark:text-slate-600 font-bold mx-0.5">→</span>
                                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/30">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mr-0.5">Expected:</span>
                                    "{questionFeedback.expectedPhrase.trim()}"
                                  </span>
                                </>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-500/30 font-medium">
                                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 mr-0.5">Missing:</span>
                                  Expected "{questionFeedback.expectedPhrase.trim()}"
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </ErrorBoundary>
                )}

                {/* Model Answer Drawer */}
                {isRevealed && answer && (
                  <div className="mt-3.5 pt-3.5 border-t border-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-500/30 text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 leading-relaxed animate-in fade-in duration-200">
                    {/* Trainee's submitted answer if present */}
                    {userAnswers[questionKey] && (
                      <div className="mb-2.5 p-2.5 rounded-lg bg-white/70 dark:bg-[#0B0E16]/70 border border-emerald-500/20 text-xs text-slate-800 dark:text-slate-200">
                        <span className="font-bold text-slate-600 dark:text-slate-400">Your Submitted Answer: </span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">{userAnswers[questionKey]}</span>
                      </div>
                    )}
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
                  flushUnsavedReflections();
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
                  flushUnsavedReflections();
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

          {/* Clinical Danger Signal Warning */}
          {confidence === 'high' && currentRating === 'needs_review' && (
            <div className="mt-3 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5 font-bold animate-pulse">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>
                Clinical Danger Signal: You expressed High Certainty, but self-assessed this case as Needs Review. This high-confidence misconception will be prioritized for spaced relearning.
              </span>
            </div>
          )}
        </div>

      </div>

      {/* Bottom Navigation Toolbar */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#161A23] border border-slate-200 dark:border-slate-800 shadow-md">
        <button
          id="btn-prev-case"
          disabled={currentIndex === 0}
          onClick={() => {
            flushUnsavedReflections();
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
            flushUnsavedReflections();
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
