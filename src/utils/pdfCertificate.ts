import { jsPDF } from 'jspdf';
import { UserProgress, CaseProgress, Question, Topic } from '../types';
import { computeAnalytics } from './analytics';

export interface CertificateData {
  candidateName: string;
  completionPercent: number;
  overallAccuracy: number;
  streakDays: number;
  topicsMasteredCount: number;
  totalTopicsCount: number;
  casesReviewedCount: number;
  totalCasesCount: number;
  totalXp: number;
  examReadinessVerdict: string;
  dateStr: string;
}

export function calculateCertificateData(
  candidateName: string,
  progress: UserProgress,
  caseProgress: CaseProgress,
  allQuestions: Question[],
  topics: Topic[],
  totalCasesCount: number = 78
): CertificateData {
  const analytics = computeAnalytics(progress, allQuestions, topics);
  const masteredCount = analytics.topicSummaries.filter(t => t.status === 'mastered').length;
  const casesCount = (caseProgress.reviewedCaseIds || []).length;
  const streak = progress.streakDays || progress.streak || 1;
  const xp = progress.totalXp ?? progress.xp ?? 0;

  // Determine Exam Readiness Verdict
  let verdict = 'STUDY IN PROGRESS — TARGET 70%+ ACCURACY';
  if (analytics.overallAccuracy >= 80 && analytics.coveragePercent >= 50) {
    verdict = 'BOARD EXAM READY — HIGH READINESS BENCHMARK';
  } else if (analytics.overallAccuracy >= 70) {
    verdict = 'ON TRACK — SOLID CLINICAL COMPETENCE';
  } else if (analytics.totalAttempts >= 50) {
    verdict = 'DEVELOPING COMPETENCE — FOCUS ON WEAK TOPICS';
  }

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return {
    candidateName: candidateName.trim() || 'Surgical Candidate',
    completionPercent: analytics.coveragePercent,
    overallAccuracy: analytics.overallAccuracy,
    streakDays: streak,
    topicsMasteredCount: masteredCount,
    totalTopicsCount: topics.length,
    casesReviewedCount: casesCount,
    totalCasesCount,
    totalXp: xp,
    examReadinessVerdict: verdict,
    dateStr
  };
}

/**
 * Generates and downloads a clean, one-page surgical progress certificate PDF
 */
export function generateCertificatePdf(
  candidateName: string,
  progress: UserProgress,
  caseProgress: CaseProgress,
  allQuestions: Question[],
  topics: Topic[]
): void {
  const data = calculateCertificateData(
    candidateName,
    progress,
    caseProgress,
    allQuestions,
    topics
  );

  const analytics = computeAnalytics(progress, allQuestions, topics);

  // Create A4 portrait document (210mm x 297mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 18;

  // 1. Decorative Outer & Inner Border
  doc.setDrawColor(16, 185, 129); // Emerald
  doc.setLineWidth(1.2);
  doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2);

  doc.setDrawColor(203, 213, 225); // Slate light border
  doc.setLineWidth(0.4);
  doc.rect(margin + 2, margin + 2, pageWidth - (margin + 2) * 2, pageHeight - (margin + 2) * 2);

  // 2. Header Top Banner (Dark Navy Accent)
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(margin + 3, margin + 3, pageWidth - (margin + 3) * 2, 32, 'F');

  // Institution / Header Text
  doc.setTextColor(52, 211, 153); // Emerald accent
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('DUOMED SURGICAL ACADEMY • BOARD EXAM VERIFICATION', pageWidth / 2, margin + 12, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text('CERTIFICATE OF SURGICAL MASTERY & PROGRESS', pageWidth / 2, margin + 22, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Standard Russian Surgical Board Examination Curriculum (620 MCQs & 78 Clinical Cases)', pageWidth / 2, margin + 29, { align: 'center' });

  // 3. Candidate Section
  let y = margin + 46;
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('THIS OFFICIAL REPORT CERTIFIES THE RECORDED PERFORMANCE OF:', pageWidth / 2, y, { align: 'center' });

  y += 9;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(data.candidateName, pageWidth / 2, y, { align: 'center' });

  // Underline candidate name
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.8);
  const nameWidth = doc.getTextWidth(data.candidateName);
  doc.line(pageWidth / 2 - nameWidth / 2 - 4, y + 2, pageWidth / 2 + nameWidth / 2 + 4, y + 2);

  // 4. Performance Metrics Grid (2x3 or 4-box layout)
  y += 14;
  const boxW = 38;
  const boxH = 20;
  const startX = margin + 8;
  const gapX = 5;

  const kpis = [
    { label: 'CURRICULUM COVERAGE', val: `${data.completionPercent}%`, sub: 'of 620 Questions' },
    { label: 'OVERALL ACCURACY', val: `${data.overallAccuracy}%`, sub: 'Cumulative' },
    { label: 'STUDY STREAK', val: `${data.streakDays} Days`, sub: 'Daily Practice' },
    { label: 'MODULES MASTERED', val: `${data.topicsMasteredCount} / ${data.totalTopicsCount}`, sub: '>=85% Accuracy' }
  ];

  kpis.forEach((kpi, idx) => {
    const bx = startX + idx * (boxW + gapX);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(bx, y, boxW, boxH, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.label, bx + boxW / 2, y + 5, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(kpi.val, bx + boxW / 2, y + 12.5, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text(kpi.sub, bx + boxW / 2, y + 17.5, { align: 'center' });
  });

  // 5. Exam-Readiness Verdict Banner
  y += boxH + 8;
  doc.setFillColor(236, 253, 245); // Emerald-50
  doc.setDrawColor(52, 211, 153);
  doc.setLineWidth(0.6);
  doc.roundedRect(margin + 8, y, pageWidth - (margin + 8) * 2, 16, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(5, 150, 105);
  doc.text('CLINICAL BOARD READINESS ASSESSMENT:', pageWidth / 2, y + 6, { align: 'center' });

  doc.setFontSize(10.5);
  doc.setTextColor(6, 95, 70);
  doc.text(data.examReadinessVerdict, pageWidth / 2, y + 12, { align: 'center' });

  // 6. Detailed Topic Performance Matrix (2 columns of 8 topics)
  y += 22;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('SURGICAL MODULE ACCREDITATION BREAKDOWN', margin + 8, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Total Cases Reviewed: ${data.casesReviewedCount} / ${data.totalCasesCount} • Total XP: ${data.totalXp}`, pageWidth - margin - 8, y, { align: 'right' });

  y += 4;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(margin + 8, y, pageWidth - margin - 8, y);

  y += 5;
  const colWidth = (pageWidth - (margin + 8) * 2 - 6) / 2;
  const rowHeight = 7.2;

  analytics.topicSummaries.forEach((top, idx) => {
    const isCol2 = idx >= 8;
    const colX = isCol2 ? margin + 8 + colWidth + 6 : margin + 8;
    const rowY = y + (idx % 8) * rowHeight;

    // Alternating zebra row
    if ((idx % 8) % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(colX, rowY - 1, colWidth, rowHeight - 0.5, 'F');
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(30, 41, 59);
    // Truncate title if needed
    const shortTitle = top.titleEn.length > 28 ? top.titleEn.substring(0, 27) + '…' : top.titleEn;
    doc.text(shortTitle, colX + 2, rowY + 3.5);

    // Accuracy
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    if (top.totalAttempts === 0) {
      doc.setTextColor(148, 163, 184);
      doc.text('Not Tested', colX + colWidth - 2, rowY + 3.5, { align: 'right' });
    } else {
      if (top.accuracy >= 80) doc.setTextColor(5, 150, 105);
      else if (top.accuracy >= 65) doc.setTextColor(217, 119, 6);
      else doc.setTextColor(225, 29, 72);

      const statusText = top.status === 'mastered' ? 'Mastered' : `${top.accuracy}%`;
      doc.text(`${top.accuracy}% (${statusText})`, colX + colWidth - 2, rowY + 3.5, { align: 'right' });
    }
  });

  // 7. Footer Seal & Date
  const footerY = pageHeight - margin - 14;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(margin + 8, footerY, pageWidth - margin - 8, footerY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(`Official Record Issued: ${data.dateStr}`, margin + 8, footerY + 5);
  doc.text('DuoMed Surgery Master • Autonomous Client-Side Verification', pageWidth - margin - 8, footerY + 5, { align: 'right' });

  doc.setFontSize(6.5);
  doc.text('Complies with Russian Surgical Board Exam MCQ Syllabus & Clinical Simulation Protocol', pageWidth / 2, footerY + 9, { align: 'center' });

  // Save the PDF
  const sanitizedName = data.candidateName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  doc.save(`duomed_surgical_certificate_${sanitizedName}.pdf`);
}
