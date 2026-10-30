import { jsPDF } from 'jspdf';
import { StudyNoteRecord, SUBJECTS_DATA } from '../data/studyMaterialData';

/**
 * Generates an authentic, beautifully styled reference PDF document
 * for a study note record directly in the browser memory using jsPDF.
 */
export function generateStudyNotePdf(note: StudyNoteRecord): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  // Find subject meta
  const subjectInfo = SUBJECTS_DATA.find((s) => s.slug === note.subject);
  const subjectName = subjectInfo ? subjectInfo.name : note.subject.toUpperCase();

  // --- TOP BRAND HEADER BAR ---
  doc.setFillColor(30, 41, 59); // Slate-800
  doc.rect(0, 0, pageWidth, 12, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('PIXAL LAB — FREE STUDY MATERIAL & EDUCATIONAL LIBRARY', margin, 8);
  doc.setFont('helvetica', 'normal');
  doc.text('https://www.pixallab.online/study-material', pageWidth - margin, 8, { align: 'right' });

  cursorY = 22;

  // --- SUBJECT & BADGES ---
  doc.setFillColor(79, 70, 229); // Indigo 600
  doc.roundedRect(margin, cursorY, 45, 6, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text(subjectName.toUpperCase(), margin + 22.5, cursorY + 4.2, { align: 'center' });

  doc.setFillColor(241, 245, 249); // Slate 100
  doc.roundedRect(margin + 49, cursorY, 50, 6, 2, 2, 'F');
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'bold');
  doc.text('ACADEMIC NOTES', margin + 49 + 25, cursorY + 4.2, { align: 'center' });

  cursorY += 12;

  // --- TITLE ---
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  const titleLines = doc.splitTextToSize(note.title, contentWidth);
  doc.text(titleLines, margin, cursorY);
  cursorY += titleLines.length * 7 + 2;

  // --- METADATA STRIP ---
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text(`Subject: ${subjectName}`, margin, cursorY);
  doc.text(`Format: Official Reference PDF`, margin + 65, cursorY);
  doc.text(`100% Free Open Access`, pageWidth - margin, cursorY, { align: 'right' });

  cursorY += 4;
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 8;

  // --- DESCRIPTION / SYLLABUS NOTES ---
  if (note.description) {
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('1. Chapter Overview & Study Notes', margin, cursorY);
    cursorY += 6;

    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    const descLines = doc.splitTextToSize(note.description, contentWidth);
    doc.text(descLines, margin, cursorY);
    cursorY += descLines.length * 4.8 + 8;
  }

  // --- FOOTER BRAND GUARANTEE ---
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'PIXAL LAB Open Education Initiative — Free curriculum study materials with zero subscriptions.',
    margin,
    285
  );

  doc.save(`${note.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-pixallab.pdf`);
}
