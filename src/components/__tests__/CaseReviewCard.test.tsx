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
});
