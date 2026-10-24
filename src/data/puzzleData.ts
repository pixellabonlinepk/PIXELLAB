export interface PuzzleImage {
  id: string;
  title: string;
  category: 'landmarks' | 'nature' | 'illustrations' | 'cultural';
  categoryLabel: string;
  location: string;
  description: string;
  src: string;
  fallbackSvg: string;
}

export interface PuzzleLevel {
  level: number;
  title: string;
  subtitle: string;
  gridSize: number; // 3 = 3x3, 4 = 4x4, 5 = 5x5
  scrambleSteps: number;
  recommendedImageId: string;
  badge: string;
}

// Procedural vector illustration fallbacks ensure 100% offline reliability
const createLandmarkFallbackSvg = (title: string, color1: string, color2: string, iconType: string) => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${color1}"/>
          <stop offset="100%" stop-color="${color2}"/>
        </linearGradient>
        <linearGradient id="glowGrad" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0.02"/>
        </linearGradient>
      </defs>
      <rect width="800" height="800" fill="url(#bgGrad)"/>
      <circle cx="400" cy="300" r="220" fill="url(#glowGrad)"/>
      <rect x="150" y="550" width="500" height="150" rx="20" fill="#ffffff" fill-opacity="0.1"/>
      <path d="M 400 150 L 520 540 L 280 540 Z" fill="#ffffff" fill-opacity="0.15"/>
      <circle cx="400" cy="150" r="16" fill="#38bdf8"/>
      <text x="400" y="630" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="34" fill="#ffffff" text-anchor="middle" letter-spacing="1">${title}</text>
      <text x="400" y="675" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="18" fill="#93c5fd" text-anchor="middle" letter-spacing="2">PIXAL LAB · PICTURE PUZZLE</text>
    </svg>
  `)}`;
};

export const PUZZLE_IMAGES: PuzzleImage[] = [
  // --- Category A: Famous World Landmarks ---
  {
    id: 'eiffel-tower',
    title: 'Eiffel Tower at Twilight',
    category: 'landmarks',
    categoryLabel: 'Famous Landmarks',
    location: 'Paris, France',
    description: 'The world-famous iron lattice tower illuminated against a warm Paris dusk sky.',
    src: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80',
    fallbackSvg: createLandmarkFallbackSvg('EIFFEL TOWER', '#1e1b4b', '#312e81', 'tower'),
  },
  {
    id: 'taj-mahal',
    title: 'Taj Mahal at Sunrise',
    category: 'landmarks',
    categoryLabel: 'Famous Landmarks',
    location: 'Agra, India',
    description: 'Iconic ivory-white marble mausoleum on the southern bank of the Yamuna River.',
    src: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
    fallbackSvg: createLandmarkFallbackSvg('TAJ MAHAL', '#0c4a6e', '#164e63', 'dome'),
  },
  {
    id: 'burj-khalifa',
    title: 'Burj Khalifa & Modern Skyline',
    category: 'landmarks',
    categoryLabel: 'Famous Landmarks',
    location: 'Dubai, UAE',
    description: 'The monumental 828-meter skyscraper soaring above Dubai downtown fountains.',
    src: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    fallbackSvg: createLandmarkFallbackSvg('BURJ KHALIFA', '#0f172a', '#1e293b', 'spire'),
  },
  {
    id: 'big-ben',
    title: 'Big Ben & Westminster',
    category: 'landmarks',
    categoryLabel: 'Famous Landmarks',
    location: 'London, United Kingdom',
    description: 'The historic Great Bell and Palace of Westminster reflecting on the River Thames.',
    src: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=800&q=80',
    fallbackSvg: createLandmarkFallbackSvg('BIG BEN', '#311042', '#180b2b', 'clock'),
  },
  {
    id: 'statue-of-liberty',
    title: 'Statue of Liberty',
    category: 'landmarks',
    categoryLabel: 'Famous Landmarks',
    location: 'New York Harbor, USA',
    description: 'Symbol of freedom and friendship standing tall in New York Bay.',
    src: 'https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?auto=format&fit=crop&w=800&q=80',
    fallbackSvg: createLandmarkFallbackSvg('STATUE OF LIBERTY', '#064e3b', '#065f46', 'torch'),
  },

  // --- Category B: Beautiful Places & Nature ---
  {
    id: 'alpine-lake',
    title: 'Emerald Mountain Lake',
    category: 'nature',
    categoryLabel: 'Nature & Places',
    location: 'Canadian Rockies',
    description: 'Crystal turquoise glacial waters surrounded by pine forests and snowy summits.',
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    fallbackSvg: createLandmarkFallbackSvg('ALPINE LAKE', '#0f766e', '#115e59', 'mountain'),
  },
  {
    id: 'tropical-beach',
    title: 'Turquoise Tropical Bay',
    category: 'nature',
    categoryLabel: 'Nature & Places',
    location: 'Polynesian Atoll',
    description: 'Pristine white sand shorelines meeting crystal waters and tropical coconut palms.',
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    fallbackSvg: createLandmarkFallbackSvg('TROPICAL BEACH', '#0284c7', '#0369a1', 'palms'),
  },
  {
    id: 'forest-waterfall',
    title: 'Cascading Forest Waterfall',
    category: 'nature',
    categoryLabel: 'Nature & Places',
    location: 'Temperate Rainforest',
    description: 'Lush mossy cliffs where clear spring waters cascade into a tranquil forest pool.',
    src: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80',
    fallbackSvg: createLandmarkFallbackSvg('FOREST FALLS', '#047857', '#065f46', 'water'),
  },
  {
    id: 'coastal-sunset',
    title: 'Golden Horizon Sunset',
    category: 'nature',
    categoryLabel: 'Nature & Places',
    location: 'Pacific Coastal Cliffs',
    description: 'Dramatic sunset glow casting golden reflections across rolling ocean waves.',
    src: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=800&q=80',
    fallbackSvg: createLandmarkFallbackSvg('GOLDEN SUNSET', '#c2410c', '#9a3412', 'sun'),
  },

  // --- Category C: Cartoon-Style Illustrations ---
  {
    id: 'enchanted-village',
    title: 'Whimsical Fantasy Village',
    category: 'illustrations',
    categoryLabel: 'Cartoon & Art',
    location: 'Fantasy Realm',
    description: 'Colorful cozy houses, cobble bridges, and lantern-lit whimsical streets.',
    src: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    fallbackSvg: createLandmarkFallbackSvg('FAIRY VILLAGE', '#7e22ce', '#6b21a8', 'cottage'),
  },
  {
    id: 'cosmic-astronaut',
    title: 'Cosmic Star Explorer',
    category: 'illustrations',
    categoryLabel: 'Cartoon & Art',
    location: 'Starlight Nebula',
    description: 'Vibrant illustrated adventurer exploring alien galaxies and celestial starlight.',
    src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    fallbackSvg: createLandmarkFallbackSvg('COSMIC EXPLORER', '#4338ca', '#3730a3', 'rocket'),
  },
  {
    id: 'friendly-creatures',
    title: 'Magical Woodland Grove',
    category: 'illustrations',
    categoryLabel: 'Cartoon & Art',
    location: 'Enchanted Glade',
    description: 'Playful illustrated forest wildlife gathering under magical glow flowers.',
    src: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    fallbackSvg: createLandmarkFallbackSvg('WOODLAND GLADE', '#be185d', '#9d174d', 'creatures'),
  },

  // --- Category D: Local & Cultural Places (Pakistan & Regional) ---
  {
    id: 'faisal-mosque',
    title: 'Faisal Mosque & Margalla Hills',
    category: 'cultural',
    categoryLabel: 'Heritage & Culture',
    location: 'Islamabad, Pakistan',
    description: 'Masterpiece of modern Islamic architecture shaped like a Bedouin tent against the Margalla Hills.',
    src: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80',
    fallbackSvg: createLandmarkFallbackSvg('FAISAL MOSQUE', '#1e3a8a', '#1e40af', 'mosque'),
  },
  {
    id: 'badshahi-mosque',
    title: 'Badshahi Mosque Heritage',
    category: 'cultural',
    categoryLabel: 'Heritage & Culture',
    location: 'Lahore, Pakistan',
    description: 'Magnificent Mughal red sandstone courtyard and white marble domes built in 1673.',
    src: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=800&q=80',
    fallbackSvg: createLandmarkFallbackSvg('BADSHAHI MOSQUE', '#831843', '#701a75', 'minarets'),
  },
  {
    id: 'hunza-valley',
    title: 'Hunza Valley & Rakaposhi',
    category: 'cultural',
    categoryLabel: 'Heritage & Culture',
    location: 'Gilgit-Baltistan, Pakistan',
    description: 'Terraced orchards and ancient fortresses framed by towering snow-capped Karakoram peaks.',
    src: 'https://images.unsplash.com/photo-1594917178712-c2e7f858004f?auto=format&fit=crop&w=800&q=80',
    fallbackSvg: createLandmarkFallbackSvg('HUNZA VALLEY', '#0369a1', '#075985', 'peaks'),
  },
];

export const PUZZLE_LEVELS: PuzzleLevel[] = [
  {
    level: 1,
    title: 'Level 1: Tropical Paradise',
    subtitle: '2 × 2 Grid · Very Easy Beginner Start',
    gridSize: 2,
    scrambleSteps: 3,
    recommendedImageId: 'tropical-beach',
    badge: 'Very Easy',
  },
  {
    level: 2,
    title: 'Level 2: Parisian Sunset',
    subtitle: '3 × 3 Grid · Gentle Walk in Paris',
    gridSize: 3,
    scrambleSteps: 16,
    recommendedImageId: 'eiffel-tower',
    badge: 'Easy',
  },
  {
    level: 3,
    title: 'Level 3: Alpine Serenity',
    subtitle: '3 × 3 Grid · Emerald Mountain Waters',
    gridSize: 3,
    scrambleSteps: 26,
    recommendedImageId: 'alpine-lake',
    badge: 'Easy',
  },
  {
    level: 4,
    title: 'Level 4: Capital Wonder',
    subtitle: '3 × 3 Grid · Faisal Mosque Majesty',
    gridSize: 3,
    scrambleSteps: 38,
    recommendedImageId: 'faisal-mosque',
    badge: 'Moderately Easy',
  },
  {
    level: 5,
    title: 'Level 5: Whimsical Realm',
    subtitle: '3 × 3 Grid · Enchanted Fairy Village',
    gridSize: 3,
    scrambleSteps: 50,
    recommendedImageId: 'enchanted-village',
    badge: 'Casual',
  },
  {
    level: 6,
    title: 'Level 6: Mughal Marble',
    subtitle: '4 × 4 Grid · Taj Mahal Sunrise',
    gridSize: 4,
    scrambleSteps: 70,
    recommendedImageId: 'taj-mahal',
    badge: 'Intermediate',
  },
  {
    level: 7,
    title: 'Level 7: Badshahi Courtyard',
    subtitle: '4 × 4 Grid · Historical Mughal Heritage',
    gridSize: 4,
    scrambleSteps: 90,
    recommendedImageId: 'badshahi-mosque',
    badge: 'Intermediate',
  },
  {
    level: 8,
    title: 'Level 8: Cosmic Odyssey',
    subtitle: '4 × 4 Grid · Star Explorer Adventure',
    gridSize: 4,
    scrambleSteps: 110,
    recommendedImageId: 'cosmic-astronaut',
    badge: 'Advanced',
  },
  {
    level: 9,
    title: 'Level 9: Karakoram Peaks',
    subtitle: '4 × 4 Grid · High Hunza Valley',
    gridSize: 4,
    scrambleSteps: 130,
    recommendedImageId: 'hunza-valley',
    badge: 'Expert',
  },
  {
    level: 10,
    title: 'Level 10: Pinnacle of Dubai',
    subtitle: '5 × 5 Grid · Grand Master Challenge',
    gridSize: 5,
    scrambleSteps: 160,
    recommendedImageId: 'burj-khalifa',
    badge: 'Master',
  },
];

export const PUZZLE_CATEGORIES = [
  { id: 'all', label: 'All Pictures' },
  { id: 'landmarks', label: 'Landmarks' },
  { id: 'nature', label: 'Nature' },
  { id: 'illustrations', label: 'Cartoon Art' },
  { id: 'cultural', label: 'Cultural & Local' },
] as const;
