import { jsPDF } from 'jspdf';
import { StudyResource } from '../data/studyMaterialData';

/**
 * Generates an authentic, beautifully styled multi-page PDF document
 * for any study resource directly in the browser memory using jsPDF.
 */
export function generateStudyResourcePdf(resource: StudyResource): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  // --- TOP BRAND HEADER BAR ---
  doc.setFillColor(30, 41, 59); // Slate-800
  doc.rect(0, 0, pageWidth, 12, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('PIXAL LAB — FREE STUDY MATERIAL & EDUCATIONAL LIBRARY', margin, 8);
  doc.setFont('helvetica', 'normal');
  doc.text('https://www.pixallab.online/', pageWidth - margin, 8, { align: 'right' });

  cursorY = 22;

  // --- SUBJECT & LEVEL BADGES ---
  doc.setFillColor(79, 70, 229); // Indigo 600
  doc.roundedRect(margin, cursorY, 48, 6, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text(resource.subjectLabel.toUpperCase(), margin + 24, cursorY + 4.2, { align: 'center' });

  doc.setFillColor(241, 245, 249); // Slate 100
  doc.roundedRect(margin + 52, cursorY, 54, 6, 2, 2, 'F');
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'bold');
  doc.text(resource.levelLabel.toUpperCase(), margin + 52 + 27, cursorY + 4.2, { align: 'center' });

  cursorY += 12;

  // --- TITLE ---
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  const titleLines = doc.splitTextToSize(resource.title, contentWidth);
  doc.text(titleLines, margin, cursorY);
  cursorY += titleLines.length * 7 + 2;

  // --- SUBTITLE ---
  doc.setTextColor(71, 85, 105); // Slate-600
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  const subtitleLines = doc.splitTextToSize(resource.subtitle, contentWidth);
  doc.text(subtitleLines, margin, cursorY);
  cursorY += subtitleLines.length * 5 + 4;

  // --- METADATA STRIP ---
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text(`Language: ${resource.language}`, margin, cursorY);
  doc.text(`Estimated Pages: ${resource.estimatedPages}`, margin + 50, cursorY);
  doc.text(`Format: Official Reference PDF`, margin + 100, cursorY);
  doc.text(`Access: 100% Free Open Access`, pageWidth - margin, cursorY, { align: 'right' });

  cursorY += 4;
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 8;

  // --- SECTION 1: OVERVIEW & CURRICULUM DESCRIPTION ---
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('1. Overview & Conceptual Foundations', margin, cursorY);
  cursorY += 6;

  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  const descLines = doc.splitTextToSize(resource.description, contentWidth);
  doc.text(descLines, margin, cursorY);
  cursorY += descLines.length * 4.8 + 8;

  // --- SECTION 2: CORE TOPICS & SYLLABUS CHECKLIST ---
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('2. Core Syllabus & Learning Outcomes', margin, cursorY);
  cursorY += 6;

  resource.keyTopics.forEach((topic, idx) => {
    doc.setFillColor(79, 70, 229);
    doc.circle(margin + 2, cursorY - 1, 1.2, 'F');
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(`Topic 2.${idx + 1}: `, margin + 6, cursorY);

    doc.setFont('helvetica', 'normal');
    const topicText = doc.splitTextToSize(topic, contentWidth - 26);
    doc.text(topicText, margin + 26, cursorY);
    cursorY += topicText.length * 4.5 + 2.5;
  });

  cursorY += 6;

  // Check if we need to add a second page for formulas and advanced notes
  if (cursorY > pageHeight - 75) {
    // Add page number to page 1
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Page 1 of 2 · PIXAL LAB Open Education Initiative', pageWidth / 2, pageHeight - 8, { align: 'center' });

    doc.addPage();
    cursorY = margin;

    // Mini header on page 2
    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, pageWidth, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text(`PIXAL LAB — ${resource.title}`, margin, 6.5);
    doc.text('https://www.pixallab.online/study-material', pageWidth - margin, 6.5, { align: 'right' });
    cursorY = 18;
  }

  // --- SECTION 3: KEY EQUATIONS & MATHEMATICAL THEOREMS BOX ---
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('3. Essential Formulas, Theorems & Governing Equations', margin, cursorY);
  cursorY += 6;

  // Box background
  const boxTop = cursorY;
  doc.setFillColor(248, 250, 252); // Slate-50
  doc.setDrawColor(203, 213, 225); // Slate-300
  doc.roundedRect(margin, boxTop, contentWidth, 42, 2, 2, 'FD');

  cursorY += 6;
  resource.keyFormulasOrConcepts.forEach((formula, i) => {
    doc.setFont('courier', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 58, 138); // Blue 900
    doc.text(`[${i + 1}]`, margin + 4, cursorY);

    const fLines = doc.splitTextToSize(formula, contentWidth - 18);
    doc.text(fLines, margin + 14, cursorY);
    cursorY += fLines.length * 4.2 + 2;
  });

  cursorY = boxTop + 48;

  // --- SECTION 4: PRACTICAL LAB & PROBLEM SOLVING ---
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('4. Recommended Application & Independent Study Notes', margin, cursorY);
  cursorY += 6;

  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const studyNotes = [
    '• Verify each theorem step-by-step through computational models or hand calculations.',
    '• Contrast discrete approximations with continuous theoretical counterparts.',
    '• Test real-world edge cases (e.g. boundary conditions, numeric stability, noise thresholds).',
    '• For digital imaging and algorithm experiments, practice directly with in-browser tools on PIXAL LAB.',
  ];
  studyNotes.forEach((line) => {
    doc.text(line, margin, cursorY);
    cursorY += 5;
  });

  cursorY += 8;

  // --- VERIFICATION & COPYRIGHT NOTICE ---
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, cursorY, contentWidth, 18, 2, 2, 'F');
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(
    'Notice: This study document is part of the PIXAL LAB Free Open Education Library. Distributed without cost for students,',
    margin + 4,
    cursorY + 5
  );
  doc.text(
    'educators, and researchers worldwide. No subscription, sign-in, or payment is ever required.',
    margin + 4,
    cursorY + 9.5
  );
  doc.text(
    'Official Portal: https://www.pixallab.online/study-material · Updated: 2026',
    margin + 4,
    cursorY + 14
  );

  // --- PAGE NUMBER ON FINAL PAGE ---
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.text(`Page ${p} of ${totalPages} · PIXAL LAB Open Education Initiative`, pageWidth / 2, pageHeight - 8, {
      align: 'center',
    });
  }

  // Trigger browser download
  const cleanFilename = `pixallab-${resource.id}-study-notes.pdf`;
  doc.save(cleanFilename);
}
