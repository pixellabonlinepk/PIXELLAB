export type StudySubjectSlug =
  | 'biology'
  | 'physics'
  | 'chemistry'
  | 'computer-science'
  | 'mathematics';

export interface SubjectInfo {
  slug: StudySubjectSlug;
  name: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  seoTitle: string;
  seoDescription: string;
  accent: {
    name: string;
    primary: string;
    border: string;
    bgSubtle: string;
    bgGradient: string;
    badge: string;
    text: string;
    button: string;
  };
  curriculumTopics: string[];
  features: string[];
}

export const SUBJECTS_DATA: SubjectInfo[] = [
  {
    slug: 'biology',
    name: 'Biology',
    tagline: 'Life Sciences, Cell Biology, Genetics & Physiology',
    shortDescription:
      'High-resolution biology notes, labeled anatomical diagrams, cellular mechanisms, and revision sheets.',
    fullDescription:
      'Explore structured Biology study material covering Cell Biology, Bioenergetics, Human Physiology, Genetics, Biotechnology, and Ecology. Designed to simplify biological concepts and support student revision.',
    seoTitle: 'Biology Notes | Free Study Material | PIXAL LAB',
    seoDescription:
      'Browse and download free Biology study notes, chapter summaries, diagrams, and revision guides on PIXAL LAB. 100% free with no sign-in required.',
    accent: {
      name: 'emerald',
      primary: '#10b981',
      border: 'border-emerald-500/30',
      bgSubtle: 'bg-emerald-500/10',
      bgGradient: 'from-emerald-500/15 via-teal-500/10 to-transparent',
      badge: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      text: 'text-emerald-600 dark:text-emerald-400',
      button: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20',
    },
    curriculumTopics: [
      'Cell Biology & Organelle Ultrastructures',
      'Enzymes & Biochemical Reaction Catalysis',
      'Bioenergetics (Photosynthesis & Respiration)',
      'Chromosomes, DNA Replication & Genetics',
      'Human Physiology & Organ Systems',
      'Ecology, Biogeochemical Cycles & Biodiversity',
    ],
    features: [
      'High-resolution labeled biological diagrams',
      'Quick revision tables for cell functions',
      'Step-by-step genetics problem guides',
      'Key definitions and concept summaries',
    ],
  },
  {
    slug: 'physics',
    name: 'Physics',
    tagline: 'Mechanics, Waves, Electromagnetism & Modern Physics',
    shortDescription:
      'Comprehensive physics notes, formula sheets, mathematical derivations, and numerical problem guides.',
    fullDescription:
      'Master fundamental and advanced physics principles. From Newtonian kinematics and rotational dynamics to wave optics, electromagnetic induction, thermodynamics, and modern quantum physics.',
    seoTitle: 'Physics Notes | Free Study Material | PIXAL LAB',
    seoDescription:
      'Browse and download free Physics study notes, formula sheets, derivations, and problem guides on PIXAL LAB. 100% free with no sign-in required.',
    accent: {
      name: 'sky',
      primary: '#0284c7',
      border: 'border-sky-500/30',
      bgSubtle: 'bg-sky-500/10',
      bgGradient: 'from-sky-500/15 via-blue-500/10 to-transparent',
      badge: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30',
      text: 'text-sky-600 dark:text-sky-400',
      button: 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-500/20',
    },
    curriculumTopics: [
      'Kinematics, Vectors & Laws of Motion',
      'Work, Energy, Power & Gravitational Fields',
      'Wave Motion, Sound & Geometrical Optics',
      'Electrostatics, Electric Current & Circuits',
      'Electromagnetism & Magnetic Induction',
      'Atomic Spectra, Radiation & Modern Physics',
    ],
    features: [
      'Complete formula cheat sheets with SI units',
      'Step-by-step mathematical derivation walkthroughs',
      'Solved numerical examples with diagrams',
      'Concept maps for quick pre-exam review',
    ],
  },
  {
    slug: 'chemistry',
    name: 'Chemistry',
    tagline: 'Organic, Inorganic & Physical Chemistry',
    shortDescription:
      'Clear chemistry study notes covering periodic trends, reaction mechanisms, chemical bonding, and thermodynamics.',
    fullDescription:
      'Explore in-depth study notes across Physical, Inorganic, and Organic Chemistry. Includes reaction mechanisms, periodic table trends, stoichiometry calculations, and chemical equilibrium concepts.',
    seoTitle: 'Chemistry Notes | Free Study Material | PIXAL LAB',
    seoDescription:
      'Browse and download free Chemistry study notes, reaction mechanisms, periodic trends, and equations on PIXAL LAB. 100% free with no sign-in required.',
    accent: {
      name: 'rose',
      primary: '#f43f5e',
      border: 'border-rose-500/30',
      bgSubtle: 'bg-rose-500/10',
      bgGradient: 'from-rose-500/15 via-pink-500/10 to-transparent',
      badge: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
      text: 'text-rose-600 dark:text-rose-400',
      button: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/20',
    },
    curriculumTopics: [
      'Atomic Structure, Orbitals & Quantum Numbers',
      'Periodic Table Trends & Chemical Bonding',
      'Stoichiometry, Solutions & Gas Laws',
      'Thermochemistry & Electrochemistry',
      'Hydrocarbons: Alkanes, Alkenes & Alkynes',
      'Organic Functional Groups & Reaction Mechanisms',
    ],
    features: [
      'Clear organic reaction mechanism pathways',
      'Periodic trends comparative summary tables',
      'Balanced equation and stoichiometry guides',
      'Common reagents and functional group charts',
    ],
  },
  {
    slug: 'computer-science',
    name: 'Computer Science',
    tagline: 'Algorithms, Data Structures, Programming & Systems',
    shortDescription:
      'Computer science study material, algorithm explanations, programming fundamentals, databases, and digital systems theory.',
    fullDescription:
      'Deep dive into essential computing topics. From foundational programming principles in C++, Python, and OOP to data structures, relational database systems (DBMS), Boolean algebra, and network architectures.',
    seoTitle: 'Computer Science Notes | Free Study Material | PIXAL LAB',
    seoDescription:
      'Browse and download free Computer Science study notes, programming concepts, algorithms, and systems theory on PIXAL LAB. 100% free with no sign-in required.',
    accent: {
      name: 'indigo',
      primary: '#6366f1',
      border: 'border-indigo-500/30',
      bgSubtle: 'bg-indigo-500/10',
      bgGradient: 'from-indigo-500/15 via-purple-500/10 to-transparent',
      badge: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
      text: 'text-indigo-600 dark:text-indigo-400',
      button: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20',
    },
    curriculumTopics: [
      'Computer Architecture & Binary Data Systems',
      'Boolean Algebra & Logic Gate Networks',
      'Structured Programming Concepts & Algorithms',
      'Arrays, Linked Lists, Stacks & Queues',
      'Relational Database Systems (DBMS) & SQL',
      'Computer Networks, Protocols & Security',
    ],
    features: [
      'Annotated code snippets in C++ and Python',
      'Big-O algorithmic complexity reference sheets',
      'Logic gate truth tables and circuit diagrams',
      'Database normalization and schema summaries',
    ],
  },
  {
    slug: 'mathematics',
    name: 'Mathematics',
    tagline: 'Algebra, Trigonometry, Calculus & Coordinate Geometry',
    shortDescription:
      'Rigorous mathematics notes, formula tables, step-by-step theorem proofs, and problem-solving guides.',
    fullDescription:
      'Strengthen your mathematical foundations with structured study materials. Covering Matrices and Determinants, Quadratic Equations, Trigonometric Identities, Analytic Geometry, Limits, Differentiation, and Integral Calculus.',
    seoTitle: 'Mathematics Notes | Free Study Material | PIXAL LAB',
    seoDescription:
      'Browse and download free Mathematics study notes, formula sheets, solved proofs, and exercise solutions on PIXAL LAB. 100% free with no sign-in required.',
    accent: {
      name: 'amber',
      primary: '#f59e0b',
      border: 'border-amber-500/30',
      bgSubtle: 'bg-amber-500/10',
      bgGradient: 'from-amber-500/15 via-yellow-500/10 to-transparent',
      badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
      text: 'text-amber-600 dark:text-amber-400',
      button: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-500/20',
    },
    curriculumTopics: [
      'Matrices, Determinants & Linear Systems',
      'Quadratic Equations, Sequences & Series',
      'Trigonometric Identities & Functions',
      'Coordinate Geometry, Lines & Conic Sections',
      'Calculus: Limits & Derivative Rules',
      'Integral Calculus, Antiderivatives & Area',
    ],
    features: [
      'Comprehensive formula sheets for Algebra & Calculus',
      'Step-by-step theorem proof breakdowns',
      'Key trigonometric identity reference charts',
      'Problem-solving templates with worked steps',
    ],
  },
];

/**
 * SUBJECT-ONLY STUDY NOTE RECORD ARCHITECTURE
 * 
 * All notes are organized exclusively by subject.
 * Each record associates a title and PDF location to its subject.
 * Note titles may contain document details (e.g. "Class 10 Biology Chapter 1 Notes")
 * without imposing class-based filtering or navigation constraints.
 */
export interface StudyNoteRecord {
  id: string;
  title: string;
  subject: StudySubjectSlug;
  description?: string;
  pdfUrl?: string; // Google Drive share URL or direct PDF URL
  driveFileId?: string; // Optional Google Drive file ID
  fileSize?: string;
  publishDate?: string;
}

/**
 * ACTIVE STUDY NOTES REPOSITORY
 * 
 * Real study notes will be added here once Google Drive PDF links are prepared.
 * Currently empty so zero fake notes or invented downloads are displayed.
 */
export const STUDY_NOTES: StudyNoteRecord[] = [];

/**
 * Helper to convert any Google Drive share link into an embeddable preview URL
 */
export function getDrivePreviewUrl(fileIdOrUrl: string): string {
  if (!fileIdOrUrl) return '';
  if (fileIdOrUrl.startsWith('http')) {
    const match = fileIdOrUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    try {
      const idParam = new URL(fileIdOrUrl).searchParams.get('id');
      if (idParam) {
        return `https://drive.google.com/file/d/${idParam}/preview`;
      }
    } catch {
      return fileIdOrUrl;
    }
    return fileIdOrUrl;
  }
  return `https://drive.google.com/file/d/${fileIdOrUrl}/preview`;
}

/**
 * Helper to convert any Google Drive share link into a direct download URL
 */
export function getDriveDownloadUrl(fileIdOrUrl: string): string {
  if (!fileIdOrUrl) return '';
  if (fileIdOrUrl.startsWith('http')) {
    const match = fileIdOrUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
    try {
      const idParam = new URL(fileIdOrUrl).searchParams.get('id');
      if (idParam) {
        return `https://drive.google.com/uc?export=download&id=${idParam}`;
      }
    } catch {
      return fileIdOrUrl;
    }
    return fileIdOrUrl;
  }
  return `https://drive.google.com/uc?export=download&id=${fileIdOrUrl}`;
}
