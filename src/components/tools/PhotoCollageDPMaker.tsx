import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  ArrowLeft,
  Upload,
  Download,
  Copy,
  RotateCcw,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid,
  Sliders,
  Sparkles,
  Users,
  LayoutGrid,
  Image as ImageIcon,
  Palette,
  Type,
  Shield,
  Layers,
  Check,
  Plus,
  Trash2,
  Shuffle,
  Circle,
  Square,
  Heart,
  Star,
  Hexagon,
  Eye,
  EyeOff,
  Move,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Crown,
  Wand2,
  RefreshCw,
  Camera,
  BoxSelect,
  Smile,
  SlidersHorizontal,
} from 'lucide-react';
import { ToolMetadata } from '../../types';
import { SAMPLE_AVATARS, SampleAvatarItem } from '../../utils/collageSampleData';
import { formatBytes, downloadBlob } from '../../utils/imageProcessing';

// Direct photographic samples for the Before & After Showcase Banner
import portraitYoungWoman from '../../assets/images/portrait_young_woman_1791695480567.jpg';
import portraitYoungMan from '../../assets/images/portrait_young_man_1791695520543.jpg';
import portraitAdultWoman from '../../assets/images/portrait_adult_woman_1791695506600.jpg';
import portraitWomanRedBlazer from '../../assets/images/portrait_woman_red_blazer_1791695816563.jpg';
import cartoonYoungMan from '../../assets/images/cartoon_young_man_1791695763624.jpg';
import faceBeautyCloseup from '../../assets/images/face_beauty_closeup_1791695871827.jpg';
import faceRetouchSmooth from '../../assets/images/face_retouch_smooth_1791695933370.jpg';

interface PhotoCollageDPMakerProps {
  tool: ToolMetadata;
  onBack: () => void;
  onSelectRelatedTool: (id: string) => void;
}

// Slot shape types
export type SlotShape =
  | 'circle'
  | 'square'
  | 'rounded'
  | 'hexagon'
  | 'star'
  | 'heart'
  | 'octagon'
  | 'diamond'
  | 'shield';

// Per-slot photo item
export interface CollageSlot {
  id: string;
  photoUrl: string;
  photoName: string;
  imgElement?: HTMLImageElement;
  x: number; // center X %
  y: number; // center Y %
  width: number; // %
  height: number; // %
  rotation: number; // deg
  zoom: number; // 0.5 to 3.0
  panX: number; // px offset
  panY: number; // px offset
  photoRotation: number; // deg
  shape: SlotShape;
  borderWidth: number; // px
  borderColor: string;
  borderGlowColor: string;
  shadowBlur: number;
  shadowColor: string;
  brightness: number; // 50 to 150
  contrast: number; // 50 to 150
  saturation: number; // 0 to 200
  filterPreset: 'normal' | 'grayscale' | 'sepia' | 'warm' | 'cool' | 'vintage';
  visible?: boolean;
}

// Text overlay
export interface TextLayer {
  id: string;
  text: string;
  x: number; // %
  y: number; // %
  fontSize: number; // px
  fontFamily: string;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  rotation: number;
  isBold: boolean;
  isItalic: boolean;
  isUnderline?: boolean;
  shadow: boolean;
  letterSpacing?: number;
  badgeBgColor?: string;
  curveText?: boolean;
  arcDirection?: 'up' | 'down' | 'circle';
  curveRadius?: number;
}

// Center Emblem / Badge configuration
export interface CenterEmblemConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  shape: 'circle' | 'shield' | 'star' | 'diamond' | 'hexagon';
  size: number; // % of canvas
  bgColor: string;
  textColor: string;
  borderColor: string;
  borderWidth: number;
  glowColor: string;
  iconEmoji: string;
}

// Curved Circular Border Text
export interface CurvedBorderTextConfig {
  enabled: boolean;
  text: string;
  radiusPercent: number; // %
  fontSize: number; // px
  color: string;
  fontFamily: string;
  startAngleDeg: number;
  letterSpacing: number;
  glowColor: string;
  arcDirection?: 'up' | 'down' | 'circle';
}

// Canvas Presets
export interface CanvasPreset {
  id: string;
  name: string;
  category: 'social' | 'wallpaper' | 'classic';
  width: number;
  height: number;
  ratioLabel: string;
  description: string;
}

export const CANVAS_PRESETS: CanvasPreset[] = [
  {
    id: 'whatsapp-dp',
    name: 'WhatsApp DP',
    category: 'social',
    width: 1000,
    height: 1000,
    ratioLabel: '1:1',
    description: 'Perfect 1:1 circular profile avatar for WhatsApp groups & chats',
  },
  {
    id: 'insta-dp',
    name: 'Instagram Profile',
    category: 'social',
    width: 1080,
    height: 1080,
    ratioLabel: '1:1',
    description: 'Crisp 1080p square profile picture optimized for mobile IG',
  },
  {
    id: 'discord-dp',
    name: 'Discord Avatar',
    category: 'social',
    width: 1024,
    height: 1024,
    ratioLabel: '1:1',
    description: 'High-res server icon or squad avatar for Discord servers',
  },
  {
    id: 'insta-story',
    name: 'Instagram Story',
    category: 'social',
    width: 1080,
    height: 1920,
    ratioLabel: '9:16',
    description: 'Full vertical story & reels format with aesthetic margins',
  },
  {
    id: 'phone-wallpaper',
    name: 'Phone Wallpaper',
    category: 'wallpaper',
    width: 1170,
    height: 2532,
    ratioLabel: '9:19.5',
    description: 'Retina OLED smartphone lockscreen & home wallpaper',
  },
  {
    id: 'desktop-wallpaper',
    name: 'Desktop Wallpaper',
    category: 'wallpaper',
    width: 1920,
    height: 1080,
    ratioLabel: '16:9',
    description: '1080p Full HD widescreen wallpaper for monitors and laptops',
  },
  {
    id: 'square-collage',
    name: 'Square Collage',
    category: 'classic',
    width: 1200,
    height: 1200,
    ratioLabel: '1:1',
    description: 'High-res square photo print & social media multi-grid',
  },
];

// Layout Presets
export interface LayoutDefinition {
  id: string;
  name: string;
  category: 'group-dp' | 'grid' | 'mosaic';
  description: string;
  slotsCount: number;
  defaultShape: SlotShape;
  getSlots: (sampleUrls: string[]) => Omit<CollageSlot, 'imgElement'>[];
}

export const LAYOUT_DEFINITIONS: LayoutDefinition[] = [
  {
    id: 'dp-circle-6',
    name: '6-Person Squad Ring',
    category: 'group-dp',
    description: '6 circular member avatars in an orbiting ring around center emblem',
    slotsCount: 6,
    defaultShape: 'circle',
    getSlots: (sampleUrls) => {
      const radius = 32;
      const size = 26;
      return Array.from({ length: 6 }).map((_, i) => {
        const angle = (i * (360 / 6) - 90) * (Math.PI / 180);
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
        const url = sampleUrls[i % sampleUrls.length];
        return {
          id: `slot-${i + 1}`,
          photoUrl: url,
          photoName: `Member ${i + 1}`,
          x,
          y,
          width: size,
          height: size,
          rotation: 0,
          zoom: 1,
          panX: 0,
          panY: 0,
          photoRotation: 0,
          shape: 'circle',
          borderWidth: 4,
          borderColor: '#38bdf8',
          borderGlowColor: 'rgba(56, 189, 248, 0.4)',
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          brightness: 100,
          contrast: 100,
          saturation: 100,
          filterPreset: 'normal',
          visible: true,
        };
      });
    },
  },
  {
    id: 'dp-circle-8',
    name: '8-Person Group Ring',
    category: 'group-dp',
    description: '8 circular squad avatars in an outer perimeter ring',
    slotsCount: 8,
    defaultShape: 'circle',
    getSlots: (sampleUrls) => {
      const radius = 34;
      const size = 21;
      return Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * (360 / 8) - 90) * (Math.PI / 180);
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
        const url = sampleUrls[i % sampleUrls.length];
        return {
          id: `slot-${i + 1}`,
          photoUrl: url,
          photoName: `Member ${i + 1}`,
          x,
          y,
          width: size,
          height: size,
          rotation: 0,
          zoom: 1,
          panX: 0,
          panY: 0,
          photoRotation: 0,
          shape: 'circle',
          borderWidth: 3,
          borderColor: '#818cf8',
          borderGlowColor: 'rgba(129, 140, 248, 0.4)',
          shadowBlur: 8,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          brightness: 100,
          contrast: 100,
          saturation: 100,
          filterPreset: 'normal',
          visible: true,
        };
      });
    },
  },
  {
    id: 'dp-circle-4',
    name: '4-Person Quad Squad',
    category: 'group-dp',
    description: '4 bold avatars positioned in four circular quadrants',
    slotsCount: 4,
    defaultShape: 'circle',
    getSlots: (sampleUrls) => {
      const radius = 27;
      const size = 36;
      return Array.from({ length: 4 }).map((_, i) => {
        const angle = (i * 90 - 45) * (Math.PI / 180);
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
        const url = sampleUrls[i % sampleUrls.length];
        return {
          id: `slot-${i + 1}`,
          photoUrl: url,
          photoName: `Friend ${i + 1}`,
          x,
          y,
          width: size,
          height: size,
          rotation: 0,
          zoom: 1,
          panX: 0,
          panY: 0,
          photoRotation: 0,
          shape: 'circle',
          borderWidth: 5,
          borderColor: '#06b6d4',
          borderGlowColor: 'rgba(6, 182, 212, 0.45)',
          shadowBlur: 12,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          brightness: 100,
          contrast: 100,
          saturation: 100,
          filterPreset: 'normal',
          visible: true,
        };
      });
    },
  },
  {
    id: 'dp-circle-2',
    name: '2-Person Duo DP',
    category: 'group-dp',
    description: '2 overlapping large circular avatars for couples and best friends',
    slotsCount: 2,
    defaultShape: 'circle',
    getSlots: (sampleUrls) => [
      {
        id: 'slot-1',
        photoUrl: sampleUrls[0],
        photoName: 'Person 1',
        x: 37,
        y: 50,
        width: 48,
        height: 48,
        rotation: 0,
        zoom: 1,
        panX: 0,
        panY: 0,
        photoRotation: 0,
        shape: 'circle',
        borderWidth: 6,
        borderColor: '#ec4899',
        borderGlowColor: 'rgba(236, 72, 153, 0.4)',
        shadowBlur: 14,
        shadowColor: 'rgba(0, 0, 0, 0.7)',
        brightness: 100,
        contrast: 100,
        saturation: 100,
        filterPreset: 'normal',
        visible: true,
      },
      {
        id: 'slot-2',
        photoUrl: sampleUrls[1 % sampleUrls.length],
        photoName: 'Person 2',
        x: 63,
        y: 50,
        width: 48,
        height: 48,
        rotation: 0,
        zoom: 1,
        panX: 0,
        panY: 0,
        photoRotation: 0,
        shape: 'circle',
        borderWidth: 6,
        borderColor: '#a855f7',
        borderGlowColor: 'rgba(168, 85, 247, 0.4)',
        shadowBlur: 14,
        shadowColor: 'rgba(0, 0, 0, 0.7)',
        brightness: 100,
        contrast: 100,
        saturation: 100,
        filterPreset: 'normal',
        visible: true,
      },
    ],
  },
  {
    id: 'dp-circle-7',
    name: '7-Person Leader + Ring',
    category: 'group-dp',
    description: '1 center captain avatar surrounded by 6 orbiting team members',
    slotsCount: 7,
    defaultShape: 'circle',
    getSlots: (sampleUrls) => {
      const radius = 33;
      const ringSize = 22;
      const centerSize = 28;
      const slots: Omit<CollageSlot, 'imgElement'>[] = [
        {
          id: 'slot-center',
          photoUrl: sampleUrls[3 % sampleUrls.length],
          photoName: 'Leader / Captain',
          x: 50,
          y: 50,
          width: centerSize,
          height: centerSize,
          rotation: 0,
          zoom: 1,
          panX: 0,
          panY: 0,
          photoRotation: 0,
          shape: 'circle',
          borderWidth: 5,
          borderColor: '#fbbf24',
          borderGlowColor: 'rgba(251, 191, 36, 0.5)',
          shadowBlur: 16,
          shadowColor: 'rgba(0, 0, 0, 0.8)',
          brightness: 100,
          contrast: 100,
          saturation: 100,
          filterPreset: 'normal',
          visible: true,
        },
      ];
      for (let i = 0; i < 6; i++) {
        const angle = (i * 60 - 90) * (Math.PI / 180);
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
        slots.push({
          id: `slot-ring-${i + 1}`,
          photoUrl: sampleUrls[i % sampleUrls.length],
          photoName: `Member ${i + 1}`,
          x,
          y,
          width: ringSize,
          height: ringSize,
          rotation: 0,
          zoom: 1,
          panX: 0,
          panY: 0,
          photoRotation: 0,
          shape: 'circle',
          borderWidth: 3,
          borderColor: '#38bdf8',
          borderGlowColor: 'rgba(56, 189, 248, 0.35)',
          shadowBlur: 8,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          brightness: 100,
          contrast: 100,
          saturation: 100,
          filterPreset: 'normal',
          visible: true,
        });
      }
      return slots;
    },
  },
  {
    id: 'grid-2x2',
    name: 'Classic 2×2 Grid',
    category: 'grid',
    description: '4 equal quadrants with clean border spacing and rounded corners',
    slotsCount: 4,
    defaultShape: 'rounded',
    getSlots: (sampleUrls) => [
      {
        id: 'slot-1',
        photoUrl: sampleUrls[0],
        photoName: 'Photo 1',
        x: 27,
        y: 27,
        width: 44,
        height: 44,
        rotation: 0,
        zoom: 1,
        panX: 0,
        panY: 0,
        photoRotation: 0,
        shape: 'rounded',
        borderWidth: 0,
        borderColor: '#ffffff',
        borderGlowColor: '',
        shadowBlur: 10,
        shadowColor: 'rgba(0,0,0,0.5)',
        brightness: 100,
        contrast: 100,
        saturation: 100,
        filterPreset: 'normal',
        visible: true,
      },
      {
        id: 'slot-2',
        photoUrl: sampleUrls[1 % sampleUrls.length],
        photoName: 'Photo 2',
        x: 73,
        y: 27,
        width: 44,
        height: 44,
        rotation: 0,
        zoom: 1,
        panX: 0,
        panY: 0,
        photoRotation: 0,
        shape: 'rounded',
        borderWidth: 0,
        borderColor: '#ffffff',
        borderGlowColor: '',
        shadowBlur: 10,
        shadowColor: 'rgba(0,0,0,0.5)',
        brightness: 100,
        contrast: 100,
        saturation: 100,
        filterPreset: 'normal',
        visible: true,
      },
      {
        id: 'slot-3',
        photoUrl: sampleUrls[2 % sampleUrls.length],
        photoName: 'Photo 3',
        x: 27,
        y: 73,
        width: 44,
        height: 44,
        rotation: 0,
        zoom: 1,
        panX: 0,
        panY: 0,
        photoRotation: 0,
        shape: 'rounded',
        borderWidth: 0,
        borderColor: '#ffffff',
        borderGlowColor: '',
        shadowBlur: 10,
        shadowColor: 'rgba(0,0,0,0.5)',
        brightness: 100,
        contrast: 100,
        saturation: 100,
        filterPreset: 'normal',
        visible: true,
      },
      {
        id: 'slot-4',
        photoUrl: sampleUrls[3 % sampleUrls.length],
        photoName: 'Photo 4',
        x: 73,
        y: 73,
        width: 44,
        height: 44,
        rotation: 0,
        zoom: 1,
        panX: 0,
        panY: 0,
        photoRotation: 0,
        shape: 'rounded',
        borderWidth: 0,
        borderColor: '#ffffff',
        borderGlowColor: '',
        shadowBlur: 10,
        shadowColor: 'rgba(0,0,0,0.5)',
        brightness: 100,
        contrast: 100,
        saturation: 100,
        filterPreset: 'normal',
        visible: true,
      },
    ],
  },
  {
    id: 'grid-3x3',
    name: 'Instagram 3×3 (9-Grid)',
    category: 'grid',
    description: '9 square photo tiles arranged in a classic Instagram photo wall',
    slotsCount: 9,
    defaultShape: 'rounded',
    getSlots: (sampleUrls) => {
      const slots: Omit<CollageSlot, 'imgElement'>[] = [];
      const cols = 3;
      const rows = 3;
      const size = 28;
      const step = 31;
      const start = 19;
      let count = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          count++;
          slots.push({
            id: `slot-${count}`,
            photoUrl: sampleUrls[(count - 1) % sampleUrls.length],
            photoName: `Tile ${count}`,
            x: start + c * step,
            y: start + r * step,
            width: size,
            height: size,
            rotation: 0,
            zoom: 1,
            panX: 0,
            panY: 0,
            photoRotation: 0,
            shape: 'rounded',
            borderWidth: 0,
            borderColor: '#ffffff',
            borderGlowColor: '',
            shadowBlur: 8,
            shadowColor: 'rgba(0,0,0,0.5)',
            brightness: 100,
            contrast: 100,
            saturation: 100,
            filterPreset: 'normal',
            visible: true,
          });
        }
      }
      return slots;
    },
  },
];

// Curated Background Gradients
export const BACKGROUND_PRESETS = [
  {
    id: 'midnight-navy',
    name: 'Midnight Electric',
    type: 'gradient' as const,
    css: 'linear-gradient(135deg, #090d16 0%, #1e1b4b 50%, #0369a1 100%)',
    colors: ['#090d16', '#1e1b4b', '#0369a1'],
  },
  {
    id: 'cyber-violet',
    name: 'Cyber Violet Glow',
    type: 'gradient' as const,
    css: 'linear-gradient(135deg, #090314 0%, #4c1d95 50%, #ec4899 100%)',
    colors: ['#090314', '#4c1d95', '#ec4899'],
  },
  {
    id: 'sunset-amber',
    name: 'Sunset Horizon',
    type: 'gradient' as const,
    css: 'linear-gradient(135deg, #2e1065 0%, #be185d 50%, #f59e0b 100%)',
    colors: ['#2e1065', '#be185d', '#f59e0b'],
  },
  {
    id: 'emerald-aurora',
    name: 'Emerald Aurora',
    type: 'gradient' as const,
    css: 'linear-gradient(135deg, #022c22 0%, #0d9488 50%, #38bdf8 100%)',
    colors: ['#022c22', '#0d9488', '#38bdf8'],
  },
  {
    id: 'dark-onyx',
    name: 'Minimal Deep Onyx',
    type: 'gradient' as const,
    css: 'linear-gradient(135deg, #030712 0%, #0f172a 50%, #1e293b 100%)',
    colors: ['#030712', '#0f172a', '#1e293b'],
  },
  {
    id: 'clean-white',
    name: 'Studio Soft Light',
    type: 'gradient' as const,
    css: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
    colors: ['#f8fafc', '#e2e8f0', '#cbd5e1'],
  },
];

export const PhotoCollageDPMaker: React.FC<PhotoCollageDPMakerProps> = ({
  tool,
  onBack,
  onSelectRelatedTool,
}) => {
  const { theme } = useTheme();

  // Primary Canvas & Preview references
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Before & After Example Showcase Banner visibility (collapsible)
  const [showShowcaseBanner, setShowShowcaseBanner] = useState<boolean>(true);

  // Left sidebar active tab
  const [activeTab, setActiveTab] = useState<
    'photos' | 'layouts' | 'templates' | 'canvas' | 'background' | 'emblem' | 'text' | 'stickers' | 'shapes' | 'frames'
  >('photos');

  // Right sidebar active tab (matching reference image: Style, Text, Adjust, Effects)
  const [rightTab, setRightTab] = useState<'style' | 'text' | 'adjust' | 'effects'>('style');

  // Selected Preset Canvas size
  const [selectedPreset, setSelectedPreset] = useState<CanvasPreset>(CANVAS_PRESETS[0]);
  const [customWidth, setCustomWidth] = useState<number>(1000);
  const [customHeight, setCustomHeight] = useState<number>(1000);

  // Layout selection
  const [selectedLayoutId, setSelectedLayoutId] = useState<string>('dp-circle-6');

  // Slots
  const sampleUrls = SAMPLE_AVATARS.map((a) => a.url);
  const initialLayout = LAYOUT_DEFINITIONS.find((l) => l.id === 'dp-circle-6') || LAYOUT_DEFINITIONS[0];
  const [slots, setSlots] = useState<CollageSlot[]>(() =>
    initialLayout.getSlots(sampleUrls).map((s) => ({ ...s, visible: true }))
  );

  // Selected slot index for fine-tuning
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number>(0);

  // Loaded Image Elements cache
  const imageElementsRef = useRef<Map<string, HTMLImageElement>>(new Map());

  // Background state
  const [bgType, setBgType] = useState<'gradient' | 'solid' | 'blurPhoto' | 'transparent'>('gradient');
  const [selectedGradient, setSelectedGradient] = useState<string>(BACKGROUND_PRESETS[0].id);
  const [solidBgColor, setSolidBgColor] = useState<string>('#090d16');
  const [bgPattern, setBgPattern] = useState<'none' | 'dots' | 'grid' | 'mesh'>('none');

  // Center Emblem state
  const [emblem, setEmblem] = useState<CenterEmblemConfig>({
    enabled: true,
    title: 'SQUAD',
    subtitle: 'EST. 2026',
    shape: 'circle',
    size: 22,
    bgColor: '#0f172a',
    textColor: '#ffffff',
    borderColor: '#38bdf8',
    borderWidth: 3,
    glowColor: 'rgba(56, 189, 248, 0.5)',
    iconEmoji: '👑',
  });

  // Curved Outer Border Text
  const [curvedText, setCurvedText] = useState<CurvedBorderTextConfig>({
    enabled: true,
    text: 'Friends Forever',
    radiusPercent: 47,
    fontSize: 22,
    color: '#ffffff',
    fontFamily: 'serif',
    startAngleDeg: -90,
    letterSpacing: 3,
    glowColor: 'rgba(56, 189, 248, 0.7)',
    arcDirection: 'up',
  });

  // Text Layers
  const [textLayers, setTextLayers] = useState<TextLayer[]>([
    {
      id: 'text-main',
      text: 'Friends Forever',
      x: 50,
      y: 90,
      fontSize: 28,
      fontFamily: 'serif',
      color: '#ffffff',
      strokeColor: '#090d16',
      strokeWidth: 3,
      rotation: 0,
      isBold: true,
      isItalic: true,
      isUnderline: false,
      shadow: true,
      letterSpacing: 2,
      curveText: false,
      curveRadius: 120,
    },
  ]);
  const [selectedTextIndex, setSelectedTextIndex] = useState<number>(0);

  // Viewport & Canvas Controls
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showSafeGuide, setShowSafeGuide] = useState<boolean>(true);
  const [showGridLines, setShowGridLines] = useState<boolean>(false);

  // Export Settings
  const [exportFormat, setExportFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png');
  const [exportMultiplier, setExportMultiplier] = useState<1 | 2>(2);
  const [jpegQuality, setJpegQuality] = useState<number>(0.92);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [clipboardCopied, setClipboardCopied] = useState<boolean>(false);

  // Undo / Redo History
  interface HistorySnapshot {
    slots: CollageSlot[];
    selectedLayoutId: string;
    emblem: CenterEmblemConfig;
    curvedText: CurvedBorderTextConfig;
    textLayers: TextLayer[];
    bgType: 'gradient' | 'solid' | 'blurPhoto' | 'transparent';
    selectedGradient: string;
    solidBgColor: string;
  }
  const [history, setHistory] = useState<HistorySnapshot[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const pushHistory = useCallback(() => {
    const snapshot: HistorySnapshot = {
      slots: JSON.parse(JSON.stringify(slots)),
      selectedLayoutId,
      emblem: { ...emblem },
      curvedText: { ...curvedText },
      textLayers: JSON.parse(JSON.stringify(textLayers)),
      bgType,
      selectedGradient,
      solidBgColor,
    };
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), snapshot]);
    setHistoryIndex((prev) => prev + 1);
  }, [slots, selectedLayoutId, emblem, curvedText, textLayers, bgType, selectedGradient, solidBgColor, historyIndex]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setSlots(prev.slots);
      setSelectedLayoutId(prev.selectedLayoutId);
      setEmblem(prev.emblem);
      setCurvedText(prev.curvedText);
      setTextLayers(prev.textLayers);
      setBgType(prev.bgType);
      setSelectedGradient(prev.selectedGradient);
      setSolidBgColor(prev.solidBgColor);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setSlots(next.slots);
      setSelectedLayoutId(next.selectedLayoutId);
      setEmblem(next.emblem);
      setCurvedText(next.curvedText);
      setTextLayers(next.textLayers);
      setBgType(next.bgType);
      setSelectedGradient(next.selectedGradient);
      setSolidBgColor(next.solidBgColor);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const preloadImage = useCallback((url: string): Promise<HTMLImageElement> => {
    if (imageElementsRef.current.has(url)) {
      return Promise.resolve(imageElementsRef.current.get(url)!);
    }
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        imageElementsRef.current.set(url, img);
        resolve(img);
      };
      img.onerror = () => {
        resolve(img);
      };
      img.src = url;
    });
  }, []);

  useEffect(() => {
    slots.forEach((s) => {
      if (s.photoUrl) {
        preloadImage(s.photoUrl).then(() => {
          renderCanvas();
        });
      }
    });
  }, [slots, preloadImage]);

  const applyLayout = (layoutId: string) => {
    const layout = LAYOUT_DEFINITIONS.find((l) => l.id === layoutId);
    if (!layout) return;

    setSelectedLayoutId(layoutId);
    const currentPhotos = slots.map((s) => s.photoUrl).filter(Boolean);
    const pool = currentPhotos.length > 0 ? currentPhotos : sampleUrls;

    const newSlots = layout.getSlots(pool).map((s, idx) => ({
      ...s,
      photoUrl: pool[idx % pool.length],
      visible: true,
    }));

    setSlots(newSlots);
    setSelectedSlotIndex(0);

    if (layout.category === 'group-dp') {
      setEmblem((prev) => ({ ...prev, enabled: true }));
      setCurvedText((prev) => ({ ...prev, enabled: true }));
    } else {
      setEmblem((prev) => ({ ...prev, enabled: false }));
      setCurvedText((prev) => ({ ...prev, enabled: false }));
    }

    pushHistory();
  };

  const applyPreset = (preset: CanvasPreset) => {
    setSelectedPreset(preset);
    setCustomWidth(preset.width);
    setCustomHeight(preset.height);
  };

  const drawShapePath = (
    ctx: CanvasRenderingContext2D,
    shape: SlotShape,
    cx: number,
    cy: number,
    w: number,
    h: number,
    cornerRadius = 16
  ) => {
    ctx.beginPath();
    const halfW = w / 2;
    const halfH = h / 2;

    switch (shape) {
      case 'circle': {
        const r = Math.min(halfW, halfH);
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        break;
      }
      case 'square': {
        ctx.rect(cx - halfW, cy - halfH, w, h);
        break;
      }
      case 'rounded': {
        const radius = Math.min(cornerRadius, halfW, halfH);
        ctx.roundRect(cx - halfW, cy - halfH, w, h, radius);
        break;
      }
      case 'hexagon': {
        const r = Math.min(halfW, halfH);
        for (let i = 0; i < 6; i++) {
          const angle = (i * 60 - 30) * (Math.PI / 180);
          const px = cx + r * Math.cos(angle);
          const py = cy + r * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        break;
      }
      case 'octagon': {
        const r = Math.min(halfW, halfH);
        for (let i = 0; i < 8; i++) {
          const angle = (i * 45 - 22.5) * (Math.PI / 180);
          const px = cx + r * Math.cos(angle);
          const py = cy + r * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        break;
      }
      case 'diamond': {
        ctx.moveTo(cx, cy - halfH);
        ctx.lineTo(cx + halfW, cy);
        ctx.lineTo(cx, cy + halfH);
        ctx.lineTo(cx - halfW, cy);
        ctx.closePath();
        break;
      }
      case 'star': {
        const outerR = Math.min(halfW, halfH);
        const innerR = outerR * 0.45;
        const points = 5;
        for (let i = 0; i < points * 2; i++) {
          const r = i % 2 === 0 ? outerR : innerR;
          const angle = (i * (180 / points) - 90) * (Math.PI / 180);
          const px = cx + r * Math.cos(angle);
          const py = cy + r * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        break;
      }
      case 'heart': {
        const s = Math.min(w, h) / 100;
        ctx.moveTo(cx, cy + 30 * s);
        ctx.bezierCurveTo(cx - 50 * s, cy - 20 * s, cx - 50 * s, cy - 60 * s, cx, cy - 30 * s);
        ctx.bezierCurveTo(cx + 50 * s, cy - 60 * s, cx + 50 * s, cy - 20 * s, cx, cy + 30 * s);
        ctx.closePath();
        break;
      }
      case 'shield': {
        ctx.moveTo(cx - halfW, cy - halfH);
        ctx.lineTo(cx + halfW, cy - halfH);
        ctx.lineTo(cx + halfW, cy + halfH * 0.3);
        ctx.bezierCurveTo(cx + halfW, cy + halfH * 0.8, cx, cy + halfH, cx, cy + halfH);
        ctx.bezierCurveTo(cx, cy + halfH, cx - halfW, cy + halfH * 0.8, cx - halfW, cy + halfH * 0.3);
        ctx.closePath();
        break;
      }
      default:
        ctx.arc(cx, cy, Math.min(halfW, halfH), 0, Math.PI * 2);
    }
  };

  const drawCurvedText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    centerX: number,
    centerY: number,
    radius: number,
    startAngleRad: number,
    fontSize: number,
    color: string,
    glowColor: string
  ) => {
    ctx.save();
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (glowColor) {
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 10;
    }

    const chars = text.split('');
    const charAngles: number[] = [];
    let totalArc = 0;

    for (let i = 0; i < chars.length; i++) {
      const charWidth = ctx.measureText(chars[i]).width + 4;
      const charArc = charWidth / radius;
      charAngles.push(charArc);
      totalArc += charArc;
    }

    let currentAngle = startAngleRad - totalArc / 2;
    for (let i = 0; i < chars.length; i++) {
      const charArc = charAngles[i];
      const angle = currentAngle + charArc / 2;

      ctx.save();
      ctx.translate(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
      ctx.rotate(angle + Math.PI / 2);
      ctx.fillText(chars[i], 0, 0);
      ctx.restore();

      currentAngle += charArc;
    }

    ctx.restore();
  };

  const renderCanvas = useCallback(
    (targetCanvas?: HTMLCanvasElement, multiplier = 1) => {
      const canvas = targetCanvas || canvasRef.current;
      if (!canvas) return;

      const baseWidth = customWidth;
      const baseHeight = customHeight;
      const width = baseWidth * multiplier;
      const height = baseHeight * multiplier;

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.save();
      ctx.scale(multiplier, multiplier);

      // 1. Background
      if (bgType === 'transparent') {
        ctx.clearRect(0, 0, baseWidth, baseHeight);
      } else if (bgType === 'solid') {
        ctx.fillStyle = solidBgColor;
        ctx.fillRect(0, 0, baseWidth, baseHeight);
      } else if (bgType === 'gradient') {
        const activeGrad = BACKGROUND_PRESETS.find((g) => g.id === selectedGradient) || BACKGROUND_PRESETS[0];
        const grad = ctx.createLinearGradient(0, 0, baseWidth, baseHeight);
        grad.addColorStop(0, activeGrad.colors[0]);
        if (activeGrad.colors[1]) grad.addColorStop(0.5, activeGrad.colors[1]);
        if (activeGrad.colors[2]) grad.addColorStop(1, activeGrad.colors[2]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, baseWidth, baseHeight);
      } else if (bgType === 'blurPhoto') {
        const blurSourceUrl = slots[0]?.photoUrl;
        const img = blurSourceUrl ? imageElementsRef.current.get(blurSourceUrl) : null;
        if (img && img.complete) {
          ctx.save();
          ctx.filter = 'blur(45px) brightness(0.65)';
          ctx.drawImage(img, -40, -40, baseWidth + 80, baseHeight + 80);
          ctx.restore();
        } else {
          ctx.fillStyle = '#090d16';
          ctx.fillRect(0, 0, baseWidth, baseHeight);
        }
      }

      // Pattern texture
      if (bgPattern === 'dots' && bgType !== 'transparent') {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        for (let x = 15; x < baseWidth; x += 30) {
          for (let y = 15; y < baseHeight; y += 30) {
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
      } else if (bgPattern === 'grid' && bgType !== 'transparent') {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 1;
        for (let x = 0; x < baseWidth; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, baseHeight);
          ctx.stroke();
        }
        for (let y = 0; y < baseHeight; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(baseWidth, y);
          ctx.stroke();
        }
        ctx.restore();
      }

      // 2. Photo Slots
      slots.forEach((slot, index) => {
        if (slot.visible === false) return;

        const cx = (slot.x / 100) * baseWidth;
        const cy = (slot.y / 100) * baseHeight;
        const w = (slot.width / 100) * baseWidth;
        const h = (slot.height / 100) * baseHeight;

        ctx.save();

        if (slot.shadowBlur > 0) {
          ctx.save();
          ctx.shadowColor = slot.shadowColor;
          ctx.shadowBlur = slot.shadowBlur;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 4;
          ctx.fillStyle = '#000000';
          drawShapePath(ctx, slot.shape, cx, cy, w, h);
          ctx.fill();
          ctx.restore();
        }

        ctx.save();
        drawShapePath(ctx, slot.shape, cx, cy, w, h);
        ctx.clip();

        const img = slot.photoUrl ? imageElementsRef.current.get(slot.photoUrl) : null;
        if (img && img.complete) {
          ctx.save();
          let filterStr = `brightness(${slot.brightness}%) contrast(${slot.contrast}%) saturate(${slot.saturation}%)`;
          if (slot.filterPreset === 'grayscale') filterStr += ' grayscale(100%)';
          else if (slot.filterPreset === 'sepia') filterStr += ' sepia(90%)';
          else if (slot.filterPreset === 'warm') filterStr += ' sepia(35%) hue-rotate(-20deg)';
          else if (slot.filterPreset === 'cool') filterStr += ' hue-rotate(30deg) saturate(120%)';
          else if (slot.filterPreset === 'vintage') filterStr += ' sepia(40%) contrast(120%) brightness(90%)';

          ctx.filter = filterStr;

          ctx.translate(cx + slot.panX, cy + slot.panY);
          if (slot.photoRotation !== 0) {
            ctx.rotate((slot.photoRotation * Math.PI) / 180);
          }

          const imgAspect = img.width / img.height;
          const slotAspect = w / h;
          let drawW = w;
          let drawH = h;
          if (imgAspect > slotAspect) {
            drawH = h * slot.zoom;
            drawW = drawH * imgAspect;
          } else {
            drawW = w * slot.zoom;
            drawH = drawW / imgAspect;
          }

          ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
          ctx.restore();
        } else {
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
          ctx.fillStyle = '#64748b';
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`Slot ${index + 1}`, cx, cy);
        }

        ctx.restore(); // end clip

        if (slot.borderWidth > 0) {
          ctx.save();
          if (slot.borderGlowColor) {
            ctx.shadowColor = slot.borderGlowColor;
            ctx.shadowBlur = slot.borderWidth * 2.5;
          }
          ctx.strokeStyle = slot.borderColor;
          ctx.lineWidth = slot.borderWidth;
          drawShapePath(ctx, slot.shape, cx, cy, w, h);
          ctx.stroke();
          ctx.restore();
        }

        if (index === selectedSlotIndex && !targetCanvas) {
          ctx.save();
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.5;
          ctx.setLineDash([5, 4]);
          drawShapePath(ctx, slot.shape, cx, cy, w + 10, h + 10);
          ctx.stroke();
          ctx.restore();
        }

        ctx.restore();
      });

      // 3. Center Emblem / Badge
      if (emblem.enabled) {
        ctx.save();
        const ecx = baseWidth / 2;
        const ecy = baseHeight / 2;
        const eSize = (emblem.size / 100) * Math.min(baseWidth, baseHeight);

        if (emblem.glowColor) {
          ctx.shadowColor = emblem.glowColor;
          ctx.shadowBlur = 18;
        }

        ctx.fillStyle = emblem.bgColor;
        ctx.strokeStyle = emblem.borderColor;
        ctx.lineWidth = emblem.borderWidth;

        drawShapePath(ctx, emblem.shape, ecx, ecy, eSize, eSize);
        ctx.fill();
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (emblem.iconEmoji) {
          ctx.font = `${Math.round(eSize * 0.28)}px sans-serif`;
          ctx.fillText(emblem.iconEmoji, ecx, ecy - eSize * 0.16);
        }

        ctx.fillStyle = emblem.textColor;
        ctx.font = `bold ${Math.round(eSize * 0.16)}px sans-serif`;
        ctx.fillText(emblem.title, ecx, ecy + (emblem.subtitle ? eSize * 0.08 : eSize * 0.12));

        if (emblem.subtitle) {
          ctx.fillStyle = emblem.borderColor;
          ctx.font = `600 ${Math.round(eSize * 0.1)}px sans-serif`;
          ctx.fillText(emblem.subtitle, ecx, ecy + eSize * 0.24);
        }

        ctx.restore();
      }

      // 4. Curved Circular Text
      if (curvedText.enabled && curvedText.text.trim()) {
        const radius = (curvedText.radiusPercent / 100) * (Math.min(baseWidth, baseHeight) / 2);
        drawCurvedText(
          ctx,
          curvedText.text,
          baseWidth / 2,
          baseHeight / 2,
          radius,
          (curvedText.startAngleDeg * Math.PI) / 180,
          curvedText.fontSize,
          curvedText.color,
          curvedText.glowColor
        );
      }

      // 5. Floating Text Layers
      textLayers.forEach((layer) => {
        ctx.save();
        const tx = (layer.x / 100) * baseWidth;
        const ty = (layer.y / 100) * baseHeight;

        ctx.translate(tx, ty);
        if (layer.rotation !== 0) {
          ctx.rotate((layer.rotation * Math.PI) / 180);
        }

        ctx.font = `${layer.isItalic ? 'italic ' : ''}${layer.isBold ? 'bold ' : ''}${layer.fontSize}px ${
          layer.fontFamily
        }`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (layer.badgeBgColor) {
          const metrics = ctx.measureText(layer.text);
          const bgPadding = 12;
          ctx.fillStyle = layer.badgeBgColor;
          ctx.beginPath();
          ctx.roundRect(
            -metrics.width / 2 - bgPadding,
            -layer.fontSize / 2 - bgPadding / 2,
            metrics.width + bgPadding * 2,
            layer.fontSize + bgPadding,
            8
          );
          ctx.fill();
        }

        if (layer.shadow) {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
          ctx.shadowBlur = 10;
          ctx.shadowOffsetY = 3;
        }

        if (layer.strokeWidth > 0 && layer.strokeColor) {
          ctx.strokeStyle = layer.strokeColor;
          ctx.lineWidth = layer.strokeWidth;
          ctx.strokeText(layer.text, 0, 0);
        }

        ctx.fillStyle = layer.color;
        ctx.fillText(layer.text, 0, 0);

        ctx.restore();
      });

      // 6. Safe Area Circular Guide
      if (showSafeGuide && !targetCanvas) {
        ctx.save();
        const minDim = Math.min(baseWidth, baseHeight);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.arc(baseWidth / 2, baseHeight / 2, minDim * 0.48, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(236, 72, 153, 0.35)';
        ctx.beginPath();
        ctx.arc(baseWidth / 2, baseHeight / 2, minDim * 0.45, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      }

      // 7. Grid Lines
      if (showGridLines && !targetCanvas) {
        ctx.save();
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);

        ctx.beginPath();
        ctx.moveTo(baseWidth / 2, 0);
        ctx.lineTo(baseWidth / 2, baseHeight);
        ctx.moveTo(0, baseHeight / 2);
        ctx.lineTo(baseWidth, baseHeight / 2);
        ctx.stroke();

        ctx.restore();
      }

      ctx.restore();
    },
    [
      customWidth,
      customHeight,
      bgType,
      solidBgColor,
      selectedGradient,
      bgPattern,
      slots,
      selectedSlotIndex,
      emblem,
      curvedText,
      textLayers,
      showSafeGuide,
      showGridLines,
    ]
  );

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    let foundIndex = -1;
    let minDistance = Infinity;

    slots.forEach((slot, index) => {
      const dx = slot.x - clickX;
      const dy = slot.y - clickY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < Math.max(slot.width, slot.height) / 1.5 && dist < minDistance) {
        minDistance = dist;
        foundIndex = index;
      }
    });

    if (foundIndex !== -1) {
      setSelectedSlotIndex(foundIndex);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    preloadImage(url).then(() => {
      setSlots((prev) =>
        prev.map((s, idx) =>
          idx === selectedSlotIndex
            ? { ...s, photoUrl: url, photoName: file.name, zoom: 1, panX: 0, panY: 0 }
            : s
        )
      );
      pushHistory();
    });
  };

  const assignSamplePhoto = (sample: SampleAvatarItem) => {
    preloadImage(sample.url).then(() => {
      setSlots((prev) =>
        prev.map((s, idx) =>
          idx === selectedSlotIndex
            ? { ...s, photoUrl: sample.url, photoName: sample.name, zoom: 1, panX: 0, panY: 0 }
            : s
        )
      );
      pushHistory();
    });
  };

  const swapSlots = (indexA: number, indexB: number) => {
    setSlots((prev) => {
      const next = [...prev];
      const photoA = next[indexA].photoUrl;
      const nameA = next[indexA].photoName;
      next[indexA].photoUrl = next[indexB].photoUrl;
      next[indexA].photoName = next[indexB].photoName;
      next[indexB].photoUrl = photoA;
      next[indexB].photoName = nameA;
      return next;
    });
    pushHistory();
  };

  const shuffleAllPhotos = () => {
    setSlots((prev) => {
      const photos = prev.map((s) => ({ url: s.photoUrl, name: s.photoName }));
      for (let i = photos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [photos[i], photos[j]] = [photos[j], photos[i]];
      }
      return prev.map((s, idx) => ({
        ...s,
        photoUrl: photos[idx].url,
        photoName: photos[idx].name,
      }));
    });
    pushHistory();
  };

  const addNewSlot = () => {
    const nextId = `slot-${slots.length + 1}`;
    const nextSample = sampleUrls[slots.length % sampleUrls.length];
    const newSlot: CollageSlot = {
      id: nextId,
      photoUrl: nextSample,
      photoName: `Member ${slots.length + 1}`,
      x: 50,
      y: 50,
      width: 28,
      height: 28,
      rotation: 0,
      zoom: 1,
      panX: 0,
      panY: 0,
      photoRotation: 0,
      shape: 'circle',
      borderWidth: 4,
      borderColor: '#38bdf8',
      borderGlowColor: 'rgba(56, 189, 248, 0.4)',
      shadowBlur: 10,
      shadowColor: 'rgba(0, 0, 0, 0.6)',
      brightness: 100,
      contrast: 100,
      saturation: 100,
      filterPreset: 'normal',
      visible: true,
    };
    setSlots((prev) => [...prev, newSlot]);
    setSelectedSlotIndex(slots.length);
    pushHistory();
  };

  const removeSelectedSlot = () => {
    if (slots.length <= 1) return;
    setSlots((prev) => prev.filter((_, idx) => idx !== selectedSlotIndex));
    setSelectedSlotIndex(Math.max(0, selectedSlotIndex - 1));
    pushHistory();
  };

  const addTextLayer = () => {
    const newLayer: TextLayer = {
      id: `text-${Date.now()}`,
      text: 'Friends Forever',
      x: 50,
      y: 88,
      fontSize: 32,
      fontFamily: 'serif',
      color: '#ffffff',
      strokeColor: '#090d16',
      strokeWidth: 4,
      rotation: 0,
      isBold: true,
      isItalic: true,
      isUnderline: false,
      shadow: true,
      letterSpacing: 2,
    };
    setTextLayers((prev) => [...prev, newLayer]);
    setSelectedTextIndex(textLayers.length);
    pushHistory();
  };

  const addEmojiBadge = (emoji: string) => {
    const newLayer: TextLayer = {
      id: `emoji-${Date.now()}`,
      text: emoji,
      x: 50,
      y: 12,
      fontSize: 48,
      fontFamily: 'sans-serif',
      color: '#ffffff',
      strokeColor: '',
      strokeWidth: 0,
      rotation: 0,
      isBold: false,
      isItalic: false,
      shadow: true,
    };
    setTextLayers((prev) => [...prev, newLayer]);
    pushHistory();
  };

  const handleExportDownload = async () => {
    setIsExporting(true);
    try {
      const offscreen = document.createElement('canvas');
      renderCanvas(offscreen, exportMultiplier);

      const mimeType = exportFormat;
      const extension = exportFormat === 'image/png' ? 'png' : exportFormat === 'image/webp' ? 'webp' : 'jpg';

      offscreen.toBlob(
        (blob) => {
          if (blob) {
            const fileName = `pixal-lab-dp-collage-${Date.now()}.${extension}`;
            downloadBlob(blob, fileName);
          }
          setIsExporting(false);
        },
        mimeType,
        exportFormat === 'image/jpeg' ? jpegQuality : undefined
      );
    } catch (err) {
      console.error('Export error:', err);
      setIsExporting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      const offscreen = document.createElement('canvas');
      renderCanvas(offscreen, 1);

      offscreen.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob,
            }),
          ]);
          setClipboardCopied(true);
          setTimeout(() => setClipboardCopied(false), 2500);
        } catch {
          alert('Clipboard copy is not supported in this browser version. Use Download instead.');
        }
      }, 'image/png');
    } catch (err) {
      console.error(err);
    }
  };

  const activeSlot = slots[selectedSlotIndex] || slots[0];
  const activeText = textLayers[selectedTextIndex] || textLayers[0];

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#060a12] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* 1. TOP TOOLBAR */}
      <header
        className={`sticky top-0 z-30 px-4 py-2.5 border-b backdrop-blur-md flex items-center justify-between gap-3 ${
          theme === 'dark' ? 'bg-[#090d16]/95 border-slate-800' : 'bg-white/95 border-slate-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1.5 text-xs font-medium ${
              theme === 'dark'
                ? 'border-slate-800 hover:bg-slate-800/60 text-slate-300'
                : 'border-slate-200 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Tools</span>
          </button>

          <div className="h-4 w-px bg-slate-700/50 hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight">Photo Collage & DP Maker</h1>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-400 border border-violet-500/30">
                  Pro Studio
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block">
                {selectedPreset.name} • {customWidth} × {customHeight} px
              </p>
            </div>
          </div>
        </div>

        {/* Center Controls: Undo, Redo, Zoom, Safe Area, Grid */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            title="Undo"
            className={`p-1.5 rounded-lg border text-xs disabled:opacity-30 disabled:cursor-not-allowed ${
              theme === 'dark' ? 'border-slate-800 hover:bg-slate-800/60' : 'border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            title="Redo"
            className={`p-1.5 rounded-lg border text-xs disabled:opacity-30 disabled:cursor-not-allowed ${
              theme === 'dark' ? 'border-slate-800 hover:bg-slate-800/60' : 'border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-slate-700/50 mx-1 hidden sm:block" />

          <button
            onClick={() => setShowSafeGuide(!showSafeGuide)}
            title="Toggle WhatsApp / IG Circle Guide"
            className={`px-2 py-1 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
              showSafeGuide
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                : theme === 'dark'
                ? 'border-slate-800 text-slate-400 hover:bg-slate-800'
                : 'border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Circle className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">Safe Circle</span>
          </button>

          <button
            onClick={() => setShowGridLines(!showGridLines)}
            title="Toggle Grid Lines"
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              showGridLines
                ? 'bg-violet-500/20 border-violet-500/50 text-violet-400'
                : theme === 'dark'
                ? 'border-slate-800 text-slate-400 hover:bg-slate-800'
                : 'border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          <div className="items-center gap-1 hidden lg:flex ml-1">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.1))}
              className={`p-1.5 rounded-lg border text-xs ${
                theme === 'dark' ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'
              }`}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1 w-10 text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.1))}
              className={`p-1.5 rounded-lg border text-xs ${
                theme === 'dark' ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'
              }`}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Actions: Showcase Toggle, Clipboard Copy & Download */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowShowcaseBanner((prev) => !prev)}
            title="Toggle Before/After Showcase"
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1 ${
              showShowcaseBanner
                ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                : 'border-slate-800 bg-slate-900/60 text-slate-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">{showShowcaseBanner ? 'Hide Showcase' : 'Show Example'}</span>
          </button>

          <button
            onClick={handleCopyToClipboard}
            title="Copy to Clipboard"
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              clipboardCopied
                ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300'
                : theme === 'dark'
                ? 'border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200'
                : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800'
            }`}
          >
            {clipboardCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{clipboardCopied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            onClick={handleExportDownload}
            disabled={isExporting}
            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white shadow-lg shadow-indigo-500/25 flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
          >
            {isExporting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>Download</span>
          </button>
        </div>
      </header>

      {/* 2. BEFORE & AFTER SHOWCASE HEADER BANNER (matching reference UI) */}
      {showShowcaseBanner && (
        <section
          className={`relative border-b px-4 py-5 overflow-hidden transition-all duration-300 ${
            theme === 'dark'
              ? 'bg-gradient-to-b from-[#090e1c] via-[#070b16] to-[#060a12] border-slate-800/80'
              : 'bg-gradient-to-b from-blue-50/50 via-indigo-50/30 to-white border-slate-200'
          }`}
        >
          {/* Ambient Lighting */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            {/* Title & Subtitle */}
            <div className="text-center md:text-left shrink-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-2">
                <Sparkles className="w-3 h-3" />
                Pixal Lab Pro Studio
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Photo Collage <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">& DP Maker</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                Combine Your Photos • Create Beautiful Collages • Design Stunning DPs
              </p>
            </div>

            {/* Visual Transformation: Before (6 Photos) -> Arrow -> After (Circular Group DP) */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 w-full md:w-auto">
              {/* Left Side: Before */}
              <div className="flex flex-col items-center">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-600 border border-blue-400/80 text-white text-[10px] font-bold uppercase tracking-wider mb-2 shadow-md shadow-blue-500/40">
                  Before
                </span>
                {/* 6 Polaroid Photos in Grid */}
                <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-900/60 border border-slate-700/60 shadow-lg">
                  {[
                    portraitYoungWoman,
                    portraitYoungMan,
                    portraitAdultWoman,
                    portraitWomanRedBlazer,
                    cartoonYoungMan,
                    faceBeautyCloseup,
                  ].map((imgSrc, i) => (
                    <div
                      key={i}
                      className="w-10 h-12 bg-white p-[1.5px] rounded shadow-md transform hover:scale-105 transition-transform"
                    >
                      <img src={imgSrc} alt="Sample" className="w-full h-full object-cover rounded-[1px]" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Glowing Arrow */}
              <div className="flex flex-col items-center justify-center shrink-0">
                <svg
                  className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 filter drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                  viewBox="0 0 48 32"
                  fill="none"
                  stroke="url(#banner-arrow)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <defs>
                    <linearGradient id="banner-arrow" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                  <path d="M 6 22 Q 22 6 38 14" />
                  <polyline points="30,8 40,14 34,24" />
                </svg>
              </div>

              {/* Right Side: After */}
              <div className="flex flex-col items-center">
                <span className="px-2.5 py-0.5 rounded-full bg-violet-600 border border-violet-400/80 text-white text-[10px] font-bold uppercase tracking-wider mb-2 shadow-md shadow-violet-500/40">
                  After
                </span>

                <div className="relative w-28 h-28 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/40 via-indigo-500/40 to-pink-500/40 blur-md" />
                  <div className="relative w-26 h-26 rounded-full overflow-hidden border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.7)] bg-slate-950 flex items-center justify-center">
                    <div className="absolute top-0 inset-x-0 h-1/2 flex justify-center">
                      <img src={portraitYoungWoman} alt="P1" className="w-12 h-12 rounded-full object-cover border border-cyan-300" />
                    </div>
                    <div className="absolute top-3 right-0 w-9 h-9 rounded-full overflow-hidden border border-violet-300 z-10">
                      <img src={portraitYoungMan} alt="P2" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute bottom-3 right-0 w-9 h-9 rounded-full overflow-hidden border border-pink-300 z-10">
                      <img src={portraitAdultWoman} alt="P3" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute bottom-0 inset-x-0 h-1/2 flex justify-center items-end">
                      <img src={portraitWomanRedBlazer} alt="P4" className="w-12 h-12 rounded-full object-cover border border-emerald-300" />
                    </div>
                    <div className="absolute bottom-3 left-0 w-9 h-9 rounded-full overflow-hidden border border-amber-300 z-10">
                      <img src={cartoonYoungMan} alt="P5" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute top-3 left-0 w-9 h-9 rounded-full overflow-hidden border border-blue-300 z-10">
                      <img src={faceBeautyCloseup} alt="P6" className="w-full h-full object-cover" />
                    </div>

                    <div className="relative z-20 w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-lg">
                      <img src={faceRetouchSmooth} alt="Center" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  <div className="absolute -bottom-1 -right-2 z-30 px-2 py-0.5 rounded-md bg-slate-950/90 border border-violet-400/80 shadow-md backdrop-blur-sm flex items-center gap-1 transform rotate-[-6deg]">
                    <span className="text-[9px] text-amber-300">👑</span>
                    <span className="text-[9px] font-bold text-white tracking-tight italic font-serif">
                      Friends Forever
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. PROFESSIONAL WORKSPACE (LEFT TOOLBAR, CENTER CANVAS, RIGHT PROPERTIES, QUICK LAUNCHER) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT TOOLBAR TABS (matching reference icons) */}
        <aside
          className={`w-full lg:w-72 border-r flex flex-col shrink-0 ${
            theme === 'dark' ? 'bg-[#090d16]/95 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          {/* Navigation Tab Bar */}
          <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-4 gap-1 p-2 border-b border-slate-800/60 text-[10px] font-medium text-slate-400">
            {[
              { id: 'photos', label: 'Photos', icon: ImageIcon },
              { id: 'layouts', label: 'Layouts', icon: LayoutGrid },
              { id: 'templates', label: 'Templates', icon: Sparkles },
              { id: 'background', label: 'Backdrop', icon: Palette },
              { id: 'text', label: 'Text', icon: Type },
              { id: 'stickers', label: 'Stickers', icon: Smile },
              { id: 'shapes', label: 'Shapes', icon: Square },
              { id: 'frames', label: 'Frames', icon: BoxSelect },
            ].map((tabItem) => {
              const IconComp = tabItem.icon;
              return (
                <button
                  key={tabItem.id}
                  onClick={() => setActiveTab(tabItem.id as any)}
                  className={`py-1.5 px-1 rounded-lg flex flex-col items-center gap-1 transition-colors ${
                    activeTab === tabItem.id
                      ? 'bg-violet-600/20 text-cyan-400 border border-cyan-500/30'
                      : 'hover:bg-slate-800/40 hover:text-slate-200'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{tabItem.label}</span>
                </button>
              );
            })}
          </div>

          {/* Left Panel Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* TAB: PHOTOS */}
            {activeTab === 'photos' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Upload Photos
                  </h3>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                      theme === 'dark'
                        ? 'border-slate-700 hover:border-cyan-500 bg-slate-900/60'
                        : 'border-slate-300 hover:border-cyan-500 bg-slate-50'
                    }`}
                  >
                    <Upload className="w-6 h-6 mx-auto mb-1.5 text-cyan-400" />
                    <p className="text-xs font-semibold">Upload Photo for Slot #{selectedSlotIndex + 1}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Drag & drop or click to upload</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* 9 Slots Thumbnails Grid matching reference UI */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Photo Slots ({slots.length})
                    </h3>
                    <button
                      onClick={shuffleAllPhotos}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <Shuffle className="w-3 h-3" />
                      Shuffle
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {slots.map((slot, idx) => (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlotIndex(idx)}
                        className={`group relative aspect-square rounded-xl overflow-hidden border p-1 text-left transition-all ${
                          idx === selectedSlotIndex
                            ? 'border-cyan-400 ring-2 ring-cyan-500/50 bg-cyan-950/40'
                            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                        }`}
                      >
                        <img
                          src={slot.photoUrl}
                          alt={slot.photoName}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <span className="absolute top-1.5 left-1.5 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 font-bold text-[9px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={addNewSlot}
                    className="w-full mt-2.5 py-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add More Photos
                  </button>
                </div>

                {/* One-click Sample Library */}
                <div>
                  <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Sample Portrait Avatars
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {SAMPLE_AVATARS.map((sample) => (
                      <button
                        key={sample.id}
                        onClick={() => assignSamplePhoto(sample)}
                        className="group relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900/80 p-1 text-left hover:border-cyan-500"
                      >
                        <div className="aspect-square rounded-lg overflow-hidden bg-slate-800 mb-1">
                          <img src={sample.url} alt={sample.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <p className="text-[10px] font-semibold truncate leading-tight">{sample.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: LAYOUTS */}
            {activeTab === 'layouts' && (
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Group DP & Squad Rings
                </h3>
                <div className="space-y-2">
                  {LAYOUT_DEFINITIONS.map((layout) => (
                    <button
                      key={layout.id}
                      onClick={() => applyLayout(layout.id)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                        selectedLayoutId === layout.id
                          ? 'border-violet-500 bg-violet-500/15'
                          : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center shrink-0 border border-violet-500/30 font-bold text-xs">
                        {layout.slotsCount}
                      </div>
                      <div>
                        <p className="text-xs font-bold leading-tight">{layout.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                          {layout.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: TEMPLATES */}
            {activeTab === 'templates' && (
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  One-Click Starter Templates
                </h3>
                {[
                  {
                    name: 'Friends Forever Squad DP',
                    desc: '6 member circle with glowing cyan ring & script emblem',
                    action: () => {
                      applyLayout('dp-circle-6');
                      setSelectedGradient('midnight-navy');
                      setCurvedText((prev) => ({ ...prev, enabled: true, text: 'Friends Forever' }));
                      setEmblem((prev) => ({ ...prev, enabled: true, title: 'BFFS', iconEmoji: '👑' }));
                    },
                  },
                  {
                    name: 'Couple Duo Profile',
                    desc: '2 interlocking portrait circles with pink neon aura',
                    action: () => {
                      applyLayout('dp-circle-2');
                      setSelectedGradient('cyber-violet');
                      setCurvedText((prev) => ({ ...prev, enabled: true, text: 'Always & Forever' }));
                    },
                  },
                  {
                    name: 'Family 8-Person Circle',
                    desc: '8 member octagonal perimeter with family crest',
                    action: () => {
                      applyLayout('dp-circle-8');
                      setSelectedGradient('sunset-amber');
                      setEmblem((prev) => ({ ...prev, enabled: true, title: 'FAMILY', iconEmoji: '❤️' }));
                    },
                  },
                  {
                    name: 'Aesthetic 9-Grid Wall',
                    desc: 'Instagram 3x3 photo tile wall with dark onyx backdrop',
                    action: () => {
                      applyLayout('grid-3x3');
                      setSelectedGradient('dark-onyx');
                    },
                  },
                ].map((tpl, i) => (
                  <button
                    key={i}
                    onClick={tpl.action}
                    className="w-full p-3 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-cyan-500/60 text-left transition-all"
                  >
                    <p className="text-xs font-bold text-slate-200">{tpl.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{tpl.desc}</p>
                  </button>
                ))}
              </div>
            )}

            {/* TAB: BACKGROUND */}
            {activeTab === 'background' && (
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Backdrop Style
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {(['gradient', 'blurPhoto', 'solid', 'transparent'] as const).map((b) => (
                    <button
                      key={b}
                      onClick={() => setBgType(b)}
                      className={`p-2 rounded-xl border text-xs font-semibold capitalize ${
                        bgType === b
                          ? 'border-violet-500 bg-violet-500/20 text-violet-300'
                          : 'border-slate-800 bg-slate-900/60 text-slate-400'
                      }`}
                    >
                      {b === 'blurPhoto' ? 'Blurred Photo' : b}
                    </button>
                  ))}
                </div>

                {bgType === 'gradient' && (
                  <div className="space-y-2 pt-2">
                    <label className="text-[11px] text-slate-400 font-medium">Curated Gradients</label>
                    <div className="grid grid-cols-2 gap-2">
                      {BACKGROUND_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => setSelectedGradient(preset.id)}
                          style={{ background: preset.css }}
                          className={`h-14 rounded-xl border p-2 flex flex-col justify-end text-left transition-all ${
                            selectedGradient === preset.id
                              ? 'border-cyan-400 ring-2 ring-cyan-500/50 scale-[1.02]'
                              : 'border-slate-700/60 opacity-85 hover:opacity-100'
                          }`}
                        >
                          <span className="text-[9px] font-bold text-white drop-shadow-md">
                            {preset.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: TEXT */}
            {activeTab === 'text' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Text Overlays
                  </h3>
                  <button
                    onClick={addTextLayer}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Text
                  </button>
                </div>

                <div className="space-y-2">
                  {textLayers.map((layer, idx) => (
                    <div
                      key={layer.id}
                      onClick={() => setSelectedTextIndex(idx)}
                      className={`p-2.5 rounded-xl border space-y-2 cursor-pointer ${
                        idx === selectedTextIndex
                          ? 'border-cyan-500 bg-cyan-950/30'
                          : 'border-slate-800 bg-slate-900/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-300">Layer #{idx + 1}</span>
                        {textLayers.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setTextLayers((prev) => prev.filter((_, i) => i !== idx));
                            }}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={layer.text}
                        onChange={(e) =>
                          setTextLayers((prev) =>
                            prev.map((l, i) => (i === idx ? { ...l, text: e.target.value } : l))
                          )
                        }
                        className="w-full px-2 py-1 rounded border border-slate-700 bg-slate-900 text-xs font-bold"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: STICKERS */}
            {activeTab === 'stickers' && (
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Badges & Stickers
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {['👑', '⭐', '❤️', '✨', '🏆', '💎', '🔥', '⚡', '🎀', '🎯', '📸', '💖', '🌸', '🥂', '🕶️', '💫'].map(
                    (em) => (
                      <button
                        key={em}
                        onClick={() => addEmojiBadge(em)}
                        className="h-10 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-xl flex items-center justify-center transition-all hover:scale-110"
                      >
                        {em}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* TAB: SHAPES */}
            {activeTab === 'shapes' && (
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Photo Cutout Shapes
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'circle', label: 'Circle' },
                      { id: 'square', label: 'Square' },
                      { id: 'rounded', label: 'Rounded' },
                      { id: 'hexagon', label: 'Hexagon' },
                      { id: 'star', label: 'Star' },
                      { id: 'heart', label: 'Heart' },
                      { id: 'shield', label: 'Shield' },
                      { id: 'diamond', label: 'Diamond' },
                      { id: 'octagon', label: 'Octagon' },
                    ] as const
                  ).map((sh) => (
                    <button
                      key={sh.id}
                      onClick={() => {
                        setSlots((prev) =>
                          prev.map((s, idx) => (idx === selectedSlotIndex ? { ...s, shape: sh.id as SlotShape } : s))
                        );
                        pushHistory();
                      }}
                      className={`p-2.5 rounded-xl border text-center text-xs font-semibold ${
                        activeSlot.shape === sh.id
                          ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                          : 'border-slate-800 bg-slate-900/60 text-slate-400'
                      }`}
                    >
                      {sh.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: FRAMES */}
            {activeTab === 'frames' && (
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Frames & Border Styles
                </h3>
                {[
                  {
                    name: 'Neon Cyber Ring',
                    action: () => {
                      setSlots((prev) =>
                        prev.map((s) => ({
                          ...s,
                          shape: 'circle',
                          borderWidth: 4,
                          borderColor: '#38bdf8',
                          borderGlowColor: 'rgba(56, 189, 248, 0.6)',
                        }))
                      );
                    },
                  },
                  {
                    name: 'Polaroid Snapshot Card',
                    action: () => {
                      setSlots((prev) =>
                        prev.map((s) => ({
                          ...s,
                          shape: 'square',
                          borderWidth: 10,
                          borderColor: '#ffffff',
                          borderGlowColor: '',
                          shadowBlur: 16,
                        }))
                      );
                    },
                  },
                  {
                    name: 'Gold Luxury Crest',
                    action: () => {
                      setSlots((prev) =>
                        prev.map((s) => ({
                          ...s,
                          shape: 'hexagon',
                          borderWidth: 4,
                          borderColor: '#fbbf24',
                          borderGlowColor: 'rgba(251, 191, 36, 0.5)',
                        }))
                      );
                    },
                  },
                ].map((frm, i) => (
                  <button
                    key={i}
                    onClick={frm.action}
                    className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-cyan-500 text-left text-xs font-bold"
                  >
                    {frm.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* CENTER VIEWPORT: CANVAS DISPLAY & BOTTOM LAYER STRIP */}
        <main
          ref={containerRef}
          className={`flex-1 relative flex flex-col items-center justify-between p-4 lg:p-6 overflow-auto ${
            theme === 'dark' ? 'bg-[#050810]' : 'bg-slate-100'
          }`}
        >
          {/* Main Editing Canvas Area */}
          <div className="flex-1 flex items-center justify-center w-full">
            <div
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
                transition: 'transform 0.15s ease-out',
              }}
              className="relative shadow-2xl rounded-2xl overflow-hidden border border-slate-800/80 bg-checkerboard flex items-center justify-center"
            >
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="max-h-[65vh] max-w-[70vw] w-auto h-auto object-contain cursor-pointer"
              />
            </div>
          </div>

          {/* Bottom Layer Strip (matching reference bottom panel) */}
          <div className="w-full max-w-3xl mt-4 px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-md shadow-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Layers</span>
            </div>

            {/* Horizontal layer thumbnails */}
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {slots.map((s, idx) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedSlotIndex(idx)}
                  className={`relative w-9 h-9 rounded-lg overflow-hidden border-2 cursor-pointer transition-all shrink-0 ${
                    idx === selectedSlotIndex
                      ? 'border-cyan-400 scale-105 shadow-md shadow-cyan-500/40'
                      : 'border-slate-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={s.photoUrl} alt="L" className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 right-0 px-1 text-[8px] bg-slate-950/80 text-white font-mono">
                    {idx + 1}
                  </span>
                </div>
              ))}

              {/* Text Layer Card */}
              {textLayers.map((tl, i) => (
                <div
                  key={tl.id}
                  onClick={() => {
                    setSelectedTextIndex(i);
                    setRightTab('text');
                  }}
                  className={`w-9 h-9 rounded-lg border-2 bg-slate-800 flex items-center justify-center font-serif text-xs font-bold cursor-pointer shrink-0 ${
                    i === selectedTextIndex && rightTab === 'text'
                      ? 'border-violet-400 text-violet-300 shadow-md shadow-violet-500/40'
                      : 'border-slate-700 text-slate-400'
                  }`}
                >
                  Aa
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={addNewSlot}
                title="Add Photo Slot"
                className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-cyan-400 hover:bg-slate-700"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              {slots.length > 1 && (
                <button
                  onClick={removeSelectedSlot}
                  title="Remove Selected Slot"
                  className="p-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </main>

        {/* RIGHT SIDEBAR: PROPERTIES PANEL (Style, Text, Adjust, Effects) */}
        <aside
          className={`w-full lg:w-80 border-l flex flex-col shrink-0 ${
            theme === 'dark' ? 'bg-[#090d16]/95 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          {/* Right Sub-Tabs (Style, Text, Adjust, Effects - matching screenshot) */}
          <div className="grid grid-cols-4 border-b border-slate-800 p-1.5 gap-1 text-xs font-semibold">
            {(['style', 'text', 'adjust', 'effects'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setRightTab(t)}
                className={`py-1.5 rounded-lg capitalize transition-all ${
                  rightTab === t
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* TAB: STYLE */}
            {rightTab === 'style' && (
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-2">
                    Slot Cutout Shape
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['circle', 'square', 'rounded', 'hexagon', 'star', 'heart', 'shield', 'diamond'] as const).map(
                      (sh) => (
                        <button
                          key={sh}
                          onClick={() => {
                            setSlots((prev) =>
                              prev.map((s, idx) => (idx === selectedSlotIndex ? { ...s, shape: sh as SlotShape } : s))
                            );
                            pushHistory();
                          }}
                          className={`p-2 rounded-xl border text-xs capitalize ${
                            activeSlot.shape === sh
                              ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 font-bold'
                              : 'border-slate-800 bg-slate-900/60 text-slate-400'
                          }`}
                        >
                          {sh}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Border Thickness</span>
                    <span>{activeSlot.borderWidth}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="16"
                    value={activeSlot.borderWidth}
                    onChange={(e) => {
                      const bw = parseInt(e.target.value);
                      setSlots((prev) => prev.map((s, idx) => (idx === selectedSlotIndex ? { ...s, borderWidth: bw } : s)));
                    }}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Border Color</label>
                    <input
                      type="color"
                      value={activeSlot.borderColor}
                      onChange={(e) => {
                        const bc = e.target.value;
                        setSlots((prev) => prev.map((s, idx) => (idx === selectedSlotIndex ? { ...s, borderColor: bc } : s)));
                      }}
                      className="w-full h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Neon Glow</label>
                    <input
                      type="color"
                      value={activeSlot.borderGlowColor ? activeSlot.borderGlowColor.slice(0, 7) : '#38bdf8'}
                      onChange={(e) => {
                        const bgc = `${e.target.value}80`;
                        setSlots((prev) => prev.map((s, idx) => (idx === selectedSlotIndex ? { ...s, borderGlowColor: bgc } : s)));
                      }}
                      className="w-full h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSlots((prev) =>
                      prev.map((s) => ({
                        ...s,
                        shape: activeSlot.shape,
                        borderWidth: activeSlot.borderWidth,
                        borderColor: activeSlot.borderColor,
                        borderGlowColor: activeSlot.borderGlowColor,
                      }))
                    );
                    pushHistory();
                  }}
                  className="w-full py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <Wand2 className="w-3.5 h-3.5 text-cyan-400" /> Apply to All Slots
                </button>
              </div>
            )}

            {/* TAB: TEXT (matching reference text inspector) */}
            {rightTab === 'text' && (
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] text-slate-400 font-semibold block mb-1">Text</label>
                  <input
                    type="text"
                    value={activeText ? activeText.text : curvedText.text}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (activeText) {
                        setTextLayers((prev) =>
                          prev.map((t, idx) => (idx === selectedTextIndex ? { ...t, text: val } : t))
                        );
                      }
                      setCurvedText((prev) => ({ ...prev, text: val }));
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs font-bold"
                  />
                </div>

                {/* Font Selector & Style Buttons */}
                <div className="flex items-center gap-2">
                  <select
                    value={activeText?.fontFamily || 'serif'}
                    onChange={(e) => {
                      const ff = e.target.value;
                      setTextLayers((prev) =>
                        prev.map((t, idx) => (idx === selectedTextIndex ? { ...t, fontFamily: ff } : t))
                      );
                    }}
                    className="flex-1 px-2 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs"
                  >
                    <option value="sans-serif">Poppins (Sans)</option>
                    <option value="serif">Playfair (Serif)</option>
                    <option value="cursive">Pacifico (Script)</option>
                    <option value="Impact">Impact (Bold)</option>
                  </select>

                  <div className="flex rounded-lg border border-slate-700 overflow-hidden">
                    <button
                      onClick={() =>
                        setTextLayers((prev) =>
                          prev.map((t, idx) => (idx === selectedTextIndex ? { ...t, isBold: !t.isBold } : t))
                        )
                      }
                      className={`px-2.5 py-1 text-xs font-bold ${
                        activeText?.isBold ? 'bg-blue-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      B
                    </button>
                    <button
                      onClick={() =>
                        setTextLayers((prev) =>
                          prev.map((t, idx) => (idx === selectedTextIndex ? { ...t, isItalic: !t.isItalic } : t))
                        )
                      }
                      className={`px-2.5 py-1 text-xs italic ${
                        activeText?.isItalic ? 'bg-blue-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      I
                    </button>
                  </div>
                </div>

                {/* Color */}
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Color</label>
                  <input
                    type="color"
                    value={activeText?.color || '#ffffff'}
                    onChange={(e) => {
                      const col = e.target.value;
                      setTextLayers((prev) =>
                        prev.map((t, idx) => (idx === selectedTextIndex ? { ...t, color: col } : t))
                      );
                      setCurvedText((prev) => ({ ...prev, color: col }));
                    }}
                    className="w-full h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                  />
                </div>

                {/* Size slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Size</span>
                    <span>{activeText?.fontSize || 28}px</span>
                  </div>
                  <input
                    type="range"
                    min="14"
                    max="64"
                    value={activeText?.fontSize || 28}
                    onChange={(e) => {
                      const sz = parseInt(e.target.value);
                      setTextLayers((prev) =>
                        prev.map((t, idx) => (idx === selectedTextIndex ? { ...t, fontSize: sz } : t))
                      );
                    }}
                    className="w-full accent-blue-500"
                  />
                </div>

                {/* Curve Text Switch & Radius (matching reference UI) */}
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">Curve Text (Arc)</span>
                    <input
                      type="checkbox"
                      checked={curvedText.enabled}
                      onChange={(e) => setCurvedText((prev) => ({ ...prev, enabled: e.target.checked }))}
                      className="rounded accent-cyan-500 cursor-pointer"
                    />
                  </div>

                  {curvedText.enabled && (
                    <div className="space-y-2 pt-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Curve Radius</span>
                        <span>{curvedText.radiusPercent}%</span>
                      </div>
                      <input
                        type="range"
                        min="30"
                        max="49"
                        value={curvedText.radiusPercent}
                        onChange={(e) =>
                          setCurvedText((prev) => ({ ...prev, radiusPercent: parseInt(e.target.value) }))
                        }
                        className="w-full accent-cyan-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: ADJUST */}
            {rightTab === 'adjust' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Face Auto-Fit / Zoom</span>
                    <span>{Math.round(activeSlot.zoom * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.05"
                    value={activeSlot.zoom}
                    onChange={(e) => {
                      const zm = parseFloat(e.target.value);
                      setSlots((prev) => prev.map((s, idx) => (idx === selectedSlotIndex ? { ...s, zoom: zm } : s)));
                    }}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Pan Offset X</span>
                    <span>{activeSlot.panX}px</span>
                  </div>
                  <input
                    type="range"
                    min="-120"
                    max="120"
                    value={activeSlot.panX}
                    onChange={(e) => {
                      const px = parseInt(e.target.value);
                      setSlots((prev) => prev.map((s, idx) => (idx === selectedSlotIndex ? { ...s, panX: px } : s)));
                    }}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Pan Offset Y</span>
                    <span>{activeSlot.panY}px</span>
                  </div>
                  <input
                    type="range"
                    min="-120"
                    max="120"
                    value={activeSlot.panY}
                    onChange={(e) => {
                      const py = parseInt(e.target.value);
                      setSlots((prev) => prev.map((s, idx) => (idx === selectedSlotIndex ? { ...s, panY: py } : s)));
                    }}
                    className="w-full accent-cyan-500"
                  />
                </div>
              </div>
            )}

            {/* TAB: EFFECTS */}
            {rightTab === 'effects' && (
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] text-slate-400 font-semibold block mb-2">Color Grade Filter</label>
                  <div className="grid grid-cols-3 gap-1">
                    {(['normal', 'grayscale', 'warm', 'cool', 'vintage', 'sepia'] as const).map((fp) => (
                      <button
                        key={fp}
                        onClick={() => {
                          setSlots((prev) =>
                            prev.map((s, idx) => (idx === selectedSlotIndex ? { ...s, filterPreset: fp } : s))
                          );
                        }}
                        className={`py-1 px-2 rounded-lg border text-xs capitalize ${
                          activeSlot.filterPreset === fp
                            ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300 font-bold'
                            : 'border-slate-800 bg-slate-900/60 text-slate-400'
                        }`}
                      >
                        {fp}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Brightness</span>
                    <span>{activeSlot.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="140"
                    value={activeSlot.brightness}
                    onChange={(e) => {
                      const br = parseInt(e.target.value);
                      setSlots((prev) => prev.map((s, idx) => (idx === selectedSlotIndex ? { ...s, brightness: br } : s)));
                    }}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Contrast</span>
                    <span>{activeSlot.contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="140"
                    value={activeSlot.contrast}
                    onChange={(e) => {
                      const ct = parseInt(e.target.value);
                      setSlots((prev) => prev.map((s, idx) => (idx === selectedSlotIndex ? { ...s, contrast: ct } : s)));
                    }}
                    className="w-full accent-cyan-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Quick Feature Highlights (matching the 6 cards on the right of the reference image) */}
          <div className="p-3 border-t border-slate-800 bg-slate-900/60 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Quick Features
            </span>
            <div className="grid grid-cols-2 gap-2 text-left">
              {[
                { label: 'Group DP Maker', icon: Users, color: 'text-blue-400' },
                { label: 'Circular Text', icon: Type, color: 'text-violet-400' },
                { label: 'Templates', icon: LayoutGrid, color: 'text-cyan-400' },
                { label: 'High-Res 4K', icon: Download, color: 'text-emerald-400' },
              ].map((feat, i) => {
                const IconC = feat.icon;
                return (
                  <div
                    key={i}
                    className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/90 flex items-center gap-1.5"
                  >
                    <IconC className={`w-3.5 h-3.5 ${feat.color} shrink-0`} />
                    <span className="text-[10px] font-semibold text-slate-300 truncate">{feat.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>

      {/* 4. BOTTOM STATUS BAR */}
      <footer className="px-4 py-2 border-t border-slate-800 bg-[#070b14] text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-cyan-400 font-bold">★ All-in-One Studio</span>
          <span>•</span>
          <span>Fast In-Browser Processing</span>
          <span>•</span>
          <span>100% Free & Private</span>
        </div>
        <div className="font-mono text-[10px] text-slate-500">
          Resolution: {customWidth * exportMultiplier} × {customHeight * exportMultiplier} px
        </div>
      </footer>
    </div>
  );
};
