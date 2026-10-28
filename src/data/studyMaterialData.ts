export type StudySubject =
  | 'computer-science'
  | 'artificial-intelligence'
  | 'mathematics'
  | 'physics'
  | 'biology'
  | 'chemistry'
  | 'logical-reasoning';

export type StudyLevel = 'high-school' | 'undergraduate' | 'graduate' | 'general';

export interface StudyResource {
  id: string;
  title: string;
  subtitle: string;
  subject: StudySubject;
  subjectLabel: string;
  level: StudyLevel;
  levelLabel: string;
  language: string;
  estimatedPages: number;
  estimatedSizeKB: number;
  format: 'PDF Document' | 'Illustrated Guide & PDF' | 'Interactive Cheatsheet';
  description: string;
  keyTopics: string[];
  keyFormulasOrConcepts: string[];
  colorTheme: string;
  iconName: string;
}

export const STUDY_SUBJECTS: { id: StudySubject | 'all'; label: string; icon: string; count?: number }[] = [
  { id: 'all', label: 'All Subjects', icon: 'BookOpen' },
  { id: 'computer-science', label: 'Computer Science', icon: 'Code' },
  { id: 'artificial-intelligence', label: 'AI & Data Science', icon: 'Cpu' },
  { id: 'mathematics', label: 'Mathematics', icon: 'Calculator' },
  { id: 'physics', label: 'Physics', icon: 'Atom' },
  { id: 'chemistry', label: 'Chemistry', icon: 'FlaskConical' },
  { id: 'biology', label: 'Biology', icon: 'Dna' },
  { id: 'logical-reasoning', label: 'Logical Reasoning', icon: 'Brain' },
];

export const STUDY_LEVELS: { id: StudyLevel | 'all'; label: string }[] = [
  { id: 'all', label: 'All Levels' },
  { id: 'high-school', label: 'High School / O-Level' },
  { id: 'undergraduate', label: 'Undergraduate / College' },
  { id: 'graduate', label: 'Graduate / Advanced' },
  { id: 'general', label: 'General Reference' },
];

export const STUDY_RESOURCES: StudyResource[] = [
  {
    id: 'digital-image-processing-fundamentals',
    title: 'Digital Image Processing & Matrix Algorithms',
    subtitle: 'Spatial Filtering, Convolution Kernels, Fourier Transform & Pixel Manipulation',
    subject: 'computer-science',
    subjectLabel: 'Computer Science',
    level: 'undergraduate',
    levelLabel: 'Undergraduate / College',
    language: 'English',
    estimatedPages: 14,
    estimatedSizeKB: 320,
    format: 'Illustrated Guide & PDF',
    colorTheme: 'indigo',
    iconName: 'Code',
    description:
      'A comprehensive mathematical and algorithmic handbook covering RGB/RGBA raster representations, 2D discrete convolution masks (Sobel, Gaussian, Laplacian), spatial transformations, frequency domain discrete cosine transforms (DCT), and quantization matrices used in modern web compression.',
    keyTopics: [
      '2D Discrete Convolution & Filter Kernels (Blur, Sharpen, Edge Detection)',
      'Spatial Transformations & Bilinear vs Bicubic Interpolation',
      'Discrete Cosine Transform (DCT) & Lossy Compression Theory',
      'Color Spaces: RGB, CMYK, HSL, YCbCr & Alpha Compositing Mathematics',
      'Binary Morphology: Dilation, Erosion, Opening, and Closing',
    ],
    keyFormulasOrConcepts: [
      '2D Discrete Convolution: g(x,y) = sum_s sum_t f(s,t) * h(x-s, y-t)',
      'Gaussian Kernel: G(x,y) = (1 / (2*pi*sigma^2)) * exp(-(x^2+y^2)/(2*sigma^2))',
      'Luminance (Rec. 601): Y = 0.299R + 0.587G + 0.114B',
      'Alpha Blending (Porter-Duff): C_out = C_src * alpha_src + C_dst * (1 - alpha_src)',
    ],
  },
  {
    id: 'convolutional-neural-networks-vision',
    title: 'Computer Vision & Deep Convolutional Networks (CNN)',
    subtitle: 'Architecture Patterns, Feature Maps, Object Detection & Latent Diffusion Models',
    subject: 'artificial-intelligence',
    subjectLabel: 'AI & Data Science',
    level: 'undergraduate',
    levelLabel: 'Undergraduate / College',
    language: 'English',
    estimatedPages: 18,
    estimatedSizeKB: 410,
    format: 'Illustrated Guide & PDF',
    colorTheme: 'cyan',
    iconName: 'Cpu',
    description:
      'Theoretical foundations and architectural patterns of deep learning vision models. Covers convolutional layers, pooling operations, activation functions (ReLU, GELU), residual connections (ResNet), Vision Transformers (ViT), and modern diffusion models for image synthesis.',
    keyTopics: [
      'Convolutional Feature Extraction & Receptive Fields',
      'Batch Normalization, LayerNorm, and Gradient Stabilization',
      'Residual Networks (ResNet) & Skip Connection Mathematics',
      'Object Detection Frameworks: YOLO, Faster R-CNN, and IoU Metrics',
      'Latent Diffusion Models, Denoising Score Matching & Classifier-Free Guidance',
    ],
    keyFormulasOrConcepts: [
      'Output Dimension: W_out = floor((W_in - K + 2P)/S) + 1',
      'Intersection over Union (IoU): Area(A cap B) / Area(A cup B)',
      'Residual Skip Block: y = F(x, {W_i}) + x',
      'Cross-Entropy Loss: L = -sum_c y_c * log(p_c)',
    ],
  },
  {
    id: 'linear-algebra-for-graphics',
    title: 'Linear Algebra for Visual Computing & 3D Graphics',
    subtitle: 'Vectors, Matrices, Affine Transforms, Eigenvalues & Quaternions',
    subject: 'mathematics',
    subjectLabel: 'Mathematics',
    level: 'undergraduate',
    levelLabel: 'Undergraduate / College',
    language: 'English',
    estimatedPages: 16,
    estimatedSizeKB: 360,
    format: 'PDF Document',
    colorTheme: 'blue',
    iconName: 'Calculator',
    description:
      'The definitive reference for vectors, matrices, dot/cross products, coordinate frame transformations, homogeneous coordinates, perspective projection, and singular value decomposition (SVD) applied to digital image rendering and computational geometry.',
    keyTopics: [
      'Vector Spaces, Basis Vectors & Linear Independence',
      'Homogeneous Coordinates & 3x3 / 4x4 Affine Transformation Matrices',
      'Dot Product (Projection) and Cross Product (Normals)',
      'Eigenvalues, Eigenvectors & Principal Component Analysis (PCA)',
      'Singular Value Decomposition (SVD) for Image Compression',
    ],
    keyFormulasOrConcepts: [
      'Dot Product: u . v = |u||v| cos(theta) = u_x v_x + u_y v_y + u_z v_z',
      '2D Rotation Matrix: R(theta) = [[cos theta, -sin theta], [sin theta, cos theta]]',
      'Eigenvalue Equation: A v = lambda v iff det(A - lambda I) = 0',
      'SVD Matrix Factorization: A = U Sigma V^T',
    ],
  },
  {
    id: 'optics-and-wave-physics',
    title: 'Optics, Wave Propagation & Electromagnetism',
    subtitle: 'Refraction, Snell’s Law, Diffraction, Polarization & Chromatic Dispersion',
    subject: 'physics',
    subjectLabel: 'Physics',
    level: 'high-school',
    levelLabel: 'High School / O-Level',
    language: 'English',
    estimatedPages: 12,
    estimatedSizeKB: 290,
    format: 'Illustrated Guide & PDF',
    colorTheme: 'amber',
    iconName: 'Atom',
    description:
      'Rigorous visual guide to wave optics, electromagnetic radiation, photon energy, thin lens approximations, depth of field, diffraction limits, and light polarization principles essential for understanding digital camera sensors and photography.',
    keyTopics: [
      'Electromagnetic Spectrum & Visible Light Wavelengths (380nm - 750nm)',
      'Snell’s Law of Refraction & Total Internal Reflection',
      'Thin Lens Equation, Focal Length & Magnification',
      'Diffraction Gratings & Rayleigh Criterion for Angular Resolution',
      'Wave Polarization (Brewster’s Angle) & Anti-Reflective Coatings',
    ],
    keyFormulasOrConcepts: [
      'Snell’s Law: n_1 sin(theta_1) = n_2 sin(theta_2)',
      'Thin Lens Formula: 1/f = 1/d_o + 1/d_i',
      'Photon Energy: E = h f = (h c) / lambda',
      'Rayleigh Criterion: theta = 1.22 lambda / D',
    ],
  },
  {
    id: 'cellular-biology-microscopy',
    title: 'Cellular Biology, Ultrastructure & Optical Microscopy',
    subtitle: 'Organelles, Cell Membrane Dynamics, Fluorescence Staining & Electron Microscopy',
    subject: 'biology',
    subjectLabel: 'Biology',
    level: 'high-school',
    levelLabel: 'High School / O-Level',
    language: 'English',
    estimatedPages: 14,
    estimatedSizeKB: 340,
    format: 'Illustrated Guide & PDF',
    colorTheme: 'emerald',
    iconName: 'Dna',
    description:
      'An illustrated handbook covering prokaryotic and eukaryotic cellular structures, phospholipid bilayer transport, organelle functions, mitotic stages, and the physics of optical versus transmission/scanning electron microscopy (TEM/SEM).',
    keyTopics: [
      'Prokaryotic vs Eukaryotic Cell Architectures',
      'Membrane Transport: Passive Diffusion, Osmosis & Active Ion Pumps',
      'Cellular Respiration (Glycolysis, Krebs Cycle, Oxidative Phosphorylation)',
      'Mitosis & Meiosis Chromosomal Segregation Stages',
      'Confocal Laser Scanning & Fluorescence Microscopy Techniques',
    ],
    keyFormulasOrConcepts: [
      'Numerical Aperture: NA = n sin(alpha)',
      'Abbe Diffraction Resolution Limit: d = lambda / (2 NA)',
      'Surface-to-Volume Ratio: SA/V = 3/r (Spherical limit on cell volume)',
      'Aerobic Respiration Net: C_6H_{12}O_6 + 6O_2 -> 6CO_2 + 6H_2O + ~32 ATP',
    ],
  },
  {
    id: 'organic-chemistry-reaction-mechanisms',
    title: 'Organic Chemistry & Reaction Mechanisms Handbook',
    subtitle: 'Nucleophilic Substitution, Electrophilic Addition, Resonance & Spectroscopy',
    subject: 'chemistry',
    subjectLabel: 'Chemistry',
    level: 'undergraduate',
    levelLabel: 'Undergraduate / College',
    language: 'English',
    estimatedPages: 20,
    estimatedSizeKB: 450,
    format: 'PDF Document',
    colorTheme: 'rose',
    iconName: 'FlaskConical',
    description:
      'Comprehensive study notes on reaction energetics, curly-arrow electron-pushing mechanisms, SN1 vs SN2 kinetics, E1 vs E2 eliminations, Markovnikov addition, aromatic electrophilic substitution, and structural elucidation with NMR and IR spectroscopy.',
    keyTopics: [
      'Lewis Structures, Hybridization (sp, sp2, sp3) & Molecular Geometry',
      'Nucleophilic Substitution: SN1 (Carbocation) vs SN2 (Inversion of Stereochemistry)',
      'Elimination Mechanisms: E1 vs E2 Regioselectivity (Zaitsev vs Hofmann)',
      'Electrophilic Aromatic Substitution (Nitration, Halogenation, Friedel-Crafts)',
      'Spectroscopic Elucidation: Proton 1H-NMR Chemical Shifts & IR Absorption Bands',
    ],
    keyFormulasOrConcepts: [
      'SN2 Rate Law: Rate = k [Substrate][Nucleophile] (Bimolecular)',
      'SN1 Rate Law: Rate = k [Substrate] (Unimolecular rate-determining step)',
      'Gibbs Free Energy: Delta G^o = Delta H^o - T Delta S^o = -RT ln(K_eq)',
      'Beer-Lambert Law (Spectrophotometry): A = epsilon * b * c',
    ],
  },
  {
    id: 'analytical-reasoning-spatial-aptitude',
    title: 'Analytical Reasoning, Spatial Aptitude & Pattern Deductions',
    subtitle: 'Non-Verbal Pattern Recognition, Syllogisms, Matrix Logic & Critical Thinking',
    subject: 'logical-reasoning',
    subjectLabel: 'Logical Reasoning',
    level: 'general',
    levelLabel: 'General Reference',
    language: 'English',
    estimatedPages: 15,
    estimatedSizeKB: 310,
    format: 'Illustrated Guide & PDF',
    colorTheme: 'purple',
    iconName: 'Brain',
    description:
      'A structured masterclass in abstract reasoning, spatial rotation aptitude, diagrammatic puzzles, formal logical deductions, syllogisms, and sequential matrix recognition tested in civil service, international aptitude, and university competitive examinations.',
    keyTopics: [
      '2D & 3D Spatial Mental Rotation Rules & Folded Box Deductions',
      'Sequential Matrix Grids: Rule of Incremental Symmetry & Movement Vectors',
      'Categorical Syllogisms & Venn Diagram Verification Methods',
      'Deductive vs Inductive vs Abductive Reasoning Frameworks',
      'Conditionals, Contrapositives & Fallacy Detection (Affirming the Consequent)',
    ],
    keyFormulasOrConcepts: [
      'Conditional Equivalence: (P => Q) equiv (neg Q => neg P) [Contrapositive]',
      'De Morgan’s Laws: neg(P land Q) equiv (neg P lor neg Q)',
      'Modus Ponens: If P => Q and P is True, then Q is True',
      'Pattern Symmetry: Reflection across horizontal/vertical axis vs 90 deg Rotations',
    ],
  },
  {
    id: 'discrete-mathematics-graph-theory',
    title: 'Discrete Mathematics & Algorithmic Graph Theory',
    subtitle: 'Graph Traversal, Combinatorics, Boolean Algebra & Big-O Complexity',
    subject: 'mathematics',
    subjectLabel: 'Mathematics',
    level: 'undergraduate',
    levelLabel: 'Undergraduate / College',
    language: 'English',
    estimatedPages: 16,
    estimatedSizeKB: 370,
    format: 'PDF Document',
    colorTheme: 'blue',
    iconName: 'Calculator',
    description:
      'Rigorous reference for computer scientists and mathematicians. Covers propositional logic, mathematical induction, recurrence relations, graph theory (Dijkstra, Kruskal, Prim, Bellman-Ford), network flows, and asymptotic computational complexity.',
    keyTopics: [
      'Mathematical Induction & Strong Induction Proof Structures',
      'Asymptotic Notation: Big-O, Big-Omega, Big-Theta Formal Definitions',
      'Graph Representations: Adjacency Matrix vs Adjacency Lists',
      'Breadth-First Search (BFS) & Depth-First Search (DFS) Traversal Proofs',
      'Minimum Spanning Trees: Kruskal’s & Prim’s Greedy Algorithms',
    ],
    keyFormulasOrConcepts: [
      'Euler’s Planar Graph Formula: V - E + F = 2',
      'Handshaking Lemma: sum_{v in V} deg(v) = 2 |E|',
      'Binomial Theorem: (x+y)^n = sum_{k=0}^n binom{n}{k} x^{n-k} y^k',
      'Master Theorem: T(n) = a T(n/b) + f(n)',
    ],
  },
];
