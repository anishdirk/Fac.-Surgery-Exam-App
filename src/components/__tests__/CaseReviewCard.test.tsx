import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import { CaseReviewCard } from '../CaseReviewCard';
import { ClinicalCase, CaseProgress, CaseComparisonResult } from '../../types';

// Mock audio sound effects
vi.mock('../../utils/audio', () => ({
  SoundEffects: {
    playClick: vi.fn(),
    playCorrect: vi.fn(),
    playMistake: vi.fn(),
    playComplete: vi.fn(),
    playToggle: vi.fn(),
  }
}));

const mockCase: ClinicalCase = {
  id: 101,
  number: 1,
  topicId: 'appendicitis',
  topicTitleEn: 'Acute Appendicitis',
  stem: 'A 24-year-old male presents with acute lower right quadrant abdominal pain and nausea.',
  questions: [
    { num: 1, text: 'What is the most likely diagnosis?' },
    { num: 2, text: 'What is the next best step in management?' }
  ],
  answers: [
    { num: 1, text: 'Acute Appendicitis' },
    { num: 2, text: 'Laparoscopic appendectomy after fluid resuscitation' }
  ]
};

const mockNextCase: ClinicalCase = {
  id: 102,
  number: 2,
  topicId: 'cholecystitis',
  topicTitleEn: 'Acute Cholecystitis',
  stem: 'A 45-year-old female presents with postprandial right upper quadrant pain and fever.',
  questions: [
    { num: 1, text: 'What sign is elicited during palpation of the RUQ?' }
  ],
  answers: [
    { num: 1, text: 'Murphy sign' }
  ]
};

const defaultProgress: CaseProgress = {
  reviewedCaseIds: [],
  caseSelfRating: {},
  bookmarkedCaseIds: [],
  casePretests: {},
  caseElaborations: {},
  caseConfidence: {}
};

const mockComparisonResult: CaseComparisonResult = {
  overallSummary: 'Accurate clinical formulation with appropriate tactical management.',
  perQuestion: [
    { questionId: '1', status: 'correct', feedback: 'Correct diagnosis identified' }
  ]
};

describe('CaseReviewCard Pretest and Elaboration UI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders pretest prompt and calls onSaveCasePretest on submit button click', () => {
    const handleSaveCasePretest = vi.fn();
    const handleSaveCaseElaboration = vi.fn();

    render(
      <CaseReviewCard
        clinicalCase={mockCase}
        sessionCases={[mockCase, mockNextCase]}
        currentIndex={0}
        onNavigateIndex={vi.fn()}
        caseProgress={defaultProgress}
        onUpdateSelfRating={vi.fn()}
        onSaveCasePretest={handleSaveCasePretest}
        onSaveCaseElaboration={handleSaveCaseElaboration}
        onToggleBookmark={vi.fn()}
        onExit={vi.fn()}
      />
    );

    // Verify pretest heading and textarea exist
    const pretestTextarea = screen.getByPlaceholderText(/What's your initial impression before reviewing this case\?/i);
    expect(pretestTextarea).toBeDefined();

    // Type initial diagnostic impression
    fireEvent.change(pretestTextarea, { target: { value: 'Likely acute appendicitis with localized peritoneal signs' } });

    // Click "Save Impression"
    const savePretestBtn = screen.getByRole('button', { name: /Save Impression/i });
    expect(savePretestBtn).toBeDefined();
    fireEvent.click(savePretestBtn);

    // Verify onSaveCasePretest called with case id and entered text
    expect(handleSaveCasePretest).toHaveBeenCalledTimes(1);
    expect(handleSaveCasePretest).toHaveBeenCalledWith(101, 'Likely acute appendicitis with localized peritoneal signs');

    // Verify the saved impression is displayed
    expect(screen.getByText(/Your Initial Impression \(Pretest\)/i)).toBeDefined();
    expect(screen.getByText(/Likely acute appendicitis with localized peritoneal signs/i)).toBeDefined();
  });

  it('automatically flushes / saves pretest when moving on to next case', () => {
    const handleSaveCasePretest = vi.fn();
    const handleNavigateIndex = vi.fn();

    render(
      <CaseReviewCard
        clinicalCase={mockCase}
        sessionCases={[mockCase, mockNextCase]}
        currentIndex={0}
        onNavigateIndex={handleNavigateIndex}
        caseProgress={defaultProgress}
        onUpdateSelfRating={vi.fn()}
        onSaveCasePretest={handleSaveCasePretest}
        onToggleBookmark={vi.fn()}
        onExit={vi.fn()}
      />
    );

    const pretestTextarea = screen.getByPlaceholderText(/What's your initial impression before reviewing this case\?/i);
    fireEvent.change(pretestTextarea, { target: { value: 'Bowel obstruction vs appendicitis' } });

    // User clicks Next Case without manually pressing Save Impression
    const nextCaseBtn = screen.getByRole('button', { name: /Next Case/i });
    fireEvent.click(nextCaseBtn);

    expect(handleSaveCasePretest).toHaveBeenCalledTimes(1);
    expect(handleSaveCasePretest).toHaveBeenCalledWith(101, 'Bowel obstruction vs appendicitis');
    expect(handleNavigateIndex).toHaveBeenCalledWith(1);
  });

  it('allows user to skip the pretest without blocking review progress', () => {
    const handleSaveCasePretest = vi.fn();

    render(
      <CaseReviewCard
        clinicalCase={mockCase}
        sessionCases={[mockCase, mockNextCase]}
        currentIndex={0}
        onNavigateIndex={vi.fn()}
        caseProgress={defaultProgress}
        onUpdateSelfRating={vi.fn()}
        onSaveCasePretest={handleSaveCasePretest}
        onToggleBookmark={vi.fn()}
        onExit={vi.fn()}
      />
    );

    const skipBtn = screen.getByRole('button', { name: /Skip to Case Review/i });
    expect(skipBtn).toBeDefined();
    fireEvent.click(skipBtn);

    // Pretest is collapsed into skipped bar
    expect(screen.getByText(/Initial impression skipped/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /\+ Add Impression/i })).toBeDefined();

    // Verify no save was triggered with empty text
    expect(handleSaveCasePretest).not.toHaveBeenCalled();

    // Other case features remain interactive and unblocked
    expect(screen.getByText(/Your Clinical Answer/i)).toBeDefined();
  });

  it('renders elaboration prompt post-comparison and calls onSaveCaseElaboration when submitted', () => {
    const handleSaveCaseElaboration = vi.fn();

    render(
      <CaseReviewCard
        clinicalCase={mockCase}
        sessionCases={[mockCase, mockNextCase]}
        currentIndex={0}
        onNavigateIndex={vi.fn()}
        caseProgress={defaultProgress}
        onUpdateSelfRating={vi.fn()}
        onSaveCaseElaboration={handleSaveCaseElaboration}
        onToggleBookmark={vi.fn()}
        onExit={vi.fn()}
        initialComparisonResult={mockComparisonResult}
      />
    );

    const elaborationTextarea = screen.getByPlaceholderText(/Why is this the right answer\?/i);
    expect(elaborationTextarea).toBeDefined();

    fireEvent.change(elaborationTextarea, {
      target: { value: 'Early surgical intervention prevents bacterial transmural necrosis and perforation.' }
    });

    const saveElabBtn = screen.getByRole('button', { name: /Save Reflection/i });
    expect(saveElabBtn).toBeDefined();
    fireEvent.click(saveElabBtn);

    expect(handleSaveCaseElaboration).toHaveBeenCalledTimes(1);
    expect(handleSaveCaseElaboration).toHaveBeenCalledWith(
      101,
      'Early surgical intervention prevents bacterial transmural necrosis and perforation.'
    );
  });

  it('renders previously saved pretest and elaboration on case revisit with toggle/edit options', () => {
    const progressWithSavedData: CaseProgress = {
      ...defaultProgress,
      casePretests: {
        101: {
          text: 'Suspected perforated appendix prior to review',
          timestamp: Date.now() - 3600000
        }
      },
      caseElaborations: {
        101: {
          text: 'Pathophysiology involves fecalith obstruction followed by mucosal ischemia.',
          timestamp: Date.now() - 1800000
        }
      }
    };

    render(
      <CaseReviewCard
        clinicalCase={mockCase}
        sessionCases={[mockCase, mockNextCase]}
        currentIndex={0}
        onNavigateIndex={vi.fn()}
        caseProgress={progressWithSavedData}
        onUpdateSelfRating={vi.fn()}
        onToggleBookmark={vi.fn()}
        onExit={vi.fn()}
      />
    );

    // Check pretest display
    expect(screen.getByText(/Your Initial Impression \(Pretest\)/i)).toBeDefined();
    expect(screen.getByText(/Suspected perforated appendix prior to review/i)).toBeDefined();
    expect(screen.getByTitle(/Edit initial impression/i)).toBeDefined();

    // Check elaboration display
    expect(screen.getByText(/Why is this the right answer\? \(Your Reflection\)/i)).toBeDefined();
    expect(screen.getByText(/Pathophysiology involves fecalith obstruction followed by mucosal ischemia\./i)).toBeDefined();
    expect(screen.getByTitle(/Edit clinical elaboration/i)).toBeDefined();

    // Verify toggle collapse works
    const togglePretestBtn = screen.getByTitle(/Collapse initial impression/i);
    fireEvent.click(togglePretestBtn);
    expect(screen.queryByText(/Suspected perforated appendix prior to review/i)).toBeNull();
  });

  it('renders phrase-level diff for incorrect question with matched and expected phrases', () => {
    const resultWithDiff: CaseComparisonResult = {
      overallSummary: 'Good clinical effort.',
      perQuestion: [
        {
          questionId: '1',
          status: 'incorrect',
          feedback: 'Incorrect surgical timing selected.',
          matchedPhrase: 'wait for 48 hours of observation',
          expectedPhrase: 'immediate emergency appendectomy'
        }
      ]
    };

    render(
      <CaseReviewCard
        clinicalCase={mockCase}
        sessionCases={[mockCase, mockNextCase]}
        currentIndex={0}
        onNavigateIndex={vi.fn()}
        caseProgress={defaultProgress}
        onUpdateSelfRating={vi.fn()}
        onToggleBookmark={vi.fn()}
        onExit={vi.fn()}
        initialComparisonResult={resultWithDiff}
      />
    );

    // Verify AI Feedback text is present
    expect(screen.getByText(/Incorrect surgical timing selected\./i)).toBeDefined();

    // Verify phrase diff container exists
    const diffContainer = screen.getByTestId('phrase-diff-1');
    expect(diffContainer).toBeDefined();

    // Verify student's phrase with "Said:"
    expect(screen.getByText(/Said:/i)).toBeDefined();
    expect(screen.getByText(/"wait for 48 hours of observation"/i)).toBeDefined();

    // Verify expected phrase with "Expected:"
    expect(screen.getByText(/Expected:/i)).toBeDefined();
    expect(screen.getByText(/"immediate emergency appendectomy"/i)).toBeDefined();
  });

  it('renders missing detail badge without strikethrough when matchedPhrase is empty', () => {
    const resultWithMissingOnly: CaseComparisonResult = {
      overallSummary: 'Omitted key clinical point.',
      perQuestion: [
        {
          questionId: '1',
          status: 'missing',
          feedback: 'Did not specify antibiotic prophylaxis.',
          expectedPhrase: 'single dose cephalosporin pre-op'
        }
      ]
    };

    render(
      <CaseReviewCard
        clinicalCase={mockCase}
        sessionCases={[mockCase, mockNextCase]}
        currentIndex={0}
        onNavigateIndex={vi.fn()}
        caseProgress={defaultProgress}
        onUpdateSelfRating={vi.fn()}
        onToggleBookmark={vi.fn()}
        onExit={vi.fn()}
        initialComparisonResult={resultWithMissingOnly}
      />
    );

    // Verify AI Feedback text is present
    expect(screen.getByText(/Did not specify antibiotic prophylaxis\./i)).toBeDefined();

    // Verify diff container exists
    const diffContainer = screen.getByTestId('phrase-diff-1');
    expect(diffContainer).toBeDefined();

    // Should NOT have "Said:" since student didn't say anything relevant
    expect(screen.queryByText(/Said:/i)).toBeNull();

    // Should have "Missing:" and the expected phrase
    expect(screen.getByText(/Missing:/i)).toBeDefined();
    expect(screen.getByText(/Expected "single dose cephalosporin pre-op"/i)).toBeDefined();
  });

  it('renders gracefully without crashing when matchedPhrase and expectedPhrase are omitted (backward compatibility)', () => {
    const legacyResult: CaseComparisonResult = {
      overallSummary: 'Legacy cached result without phrase breakdown.',
      perQuestion: [
        {
          questionId: '1',
          status: 'incorrect',
          feedback: 'Consider alternative diagnosis.'
          // matchedPhrase and expectedPhrase undefined
        }
      ]
    };

    render(
      <CaseReviewCard
        clinicalCase={mockCase}
        sessionCases={[mockCase, mockNextCase]}
        currentIndex={0}
        onNavigateIndex={vi.fn()}
        caseProgress={defaultProgress}
        onUpdateSelfRating={vi.fn()}
        onToggleBookmark={vi.fn()}
        onExit={vi.fn()}
        initialComparisonResult={legacyResult}
      />
    );

    // AI feedback renders properly
    expect(screen.getByText(/Consider alternative diagnosis\./i)).toBeDefined();

    // No diff container rendered when expectedPhrase is absent
    expect(screen.queryByTestId('phrase-diff-1')).toBeNull();
  });

  it('renders an individual answer input for each sub-question with progress tracking', () => {
    render(
      <CaseReviewCard
        clinicalCase={mockCase}
        sessionCases={[mockCase, mockNextCase]}
        currentIndex={0}
        onNavigateIndex={vi.fn()}
        caseProgress={defaultProgress}
        onUpdateSelfRating={vi.fn()}
        onToggleBookmark={vi.fn()}
        onExit={vi.fn()}
      />
    );

    // Verify sub-question text is displayed
    expect(screen.getAllByText('What is the most likely diagnosis?').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('What is the next best step in management?').length).toBeGreaterThanOrEqual(1);

    // Verify individual textareas for each sub-question exist
    const q1Input = screen.getByTestId('textarea-sub-answer-1') as HTMLTextAreaElement;
    const q2Input = screen.getByTestId('textarea-sub-answer-2') as HTMLTextAreaElement;
    expect(q1Input).toBeDefined();
    expect(q2Input).toBeDefined();

    // Verify progress counter starts at 0 of 2 answered
    expect(screen.getByText(/0 of 2 answered/i)).toBeDefined();

    // Fill in first question
    fireEvent.change(q1Input, { target: { value: 'Acute Appendicitis' } });
    expect(q1Input.value).toBe('Acute Appendicitis');
    expect(screen.getByText(/1 of 2 answered/i)).toBeDefined();

    // Submit button is disabled because not all sub-questions are answered
    const submitBtn = screen.getByTestId('btn-submit-case-compare');
    expect(submitBtn.hasAttribute('disabled')).toBe(true);

    // Fill in second question
    fireEvent.change(q2Input, { target: { value: 'Laparoscopic appendectomy' } });
    expect(q2Input.value).toBe('Laparoscopic appendectomy');
    expect(screen.getByText(/All 2 answered/i)).toBeDefined();

    // Submit button is now enabled
    expect(submitBtn.hasAttribute('disabled')).toBe(false);
  });

  it('submits structured userAnswers array to /api/compare-case when evaluating', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        overallSummary: 'Good performance.',
        perQuestion: [
          { questionId: '1', status: 'correct', feedback: 'Correct diagnosis' },
          { questionId: '2', status: 'correct', feedback: 'Correct management' }
        ]
      })
    });
    global.fetch = fetchMock;

    render(
      <CaseReviewCard
        clinicalCase={mockCase}
        sessionCases={[mockCase, mockNextCase]}
        currentIndex={0}
        onNavigateIndex={vi.fn()}
        caseProgress={defaultProgress}
        onUpdateSelfRating={vi.fn()}
        onToggleBookmark={vi.fn()}
        onExit={vi.fn()}
      />
    );

    const q1Input = screen.getByTestId('textarea-sub-answer-1');
    const q2Input = screen.getByTestId('textarea-sub-answer-2');

    fireEvent.change(q1Input, { target: { value: 'Acute Appendicitis' } });
    fireEvent.change(q2Input, { target: { value: 'Emergency laparoscopy' } });

    const submitBtn = screen.getByTestId('btn-submit-case-compare');
    fireEvent.click(submitBtn);

    expect(fetchMock).toHaveBeenCalledWith('/api/compare-case', expect.objectContaining({
      method: 'POST',
      body: expect.stringContaining('"userAnswers"')
    }));

    const requestBody = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(requestBody.userAnswers).toEqual([
      { questionId: '1', num: 1, text: 'Acute Appendicitis' },
      { questionId: '2', num: 2, text: 'Emergency laparoscopy' }
    ]);
  });
});
