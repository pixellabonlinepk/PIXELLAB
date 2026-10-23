export type ToolCategory =
  | 'all'
  | 'optimize-resize'
  | 'convert-pdf'
  | 'social-identity'
  | 'edit-retouch'
  | 'qr-utilities';

export type ToolBadge = 'Free' | 'Browser-Based' | 'Popular' | 'Trending' | 'Security';

export interface ToolGuideStep {
  step: number;
  title: string;
  desc: string;
}

export interface ToolFAQ {
  question: string;
  answer: string;
}

export interface ToolGuideContent {
  steps: ToolGuideStep[];
  howItWorks: string;
  benefits: string[];
  faqs: ToolFAQ[];
}

export interface ToolMetadata {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: ToolCategory;
  categoryLabel: string;
  badge: ToolBadge;
  themeColor: 'blue' | 'emerald' | 'pink' | 'violet' | 'amber' | 'cyan' | 'rose' | 'indigo' | 'purple' | 'teal';
  features: string[];
  icon: string;
  previewType: 
    | 'before-after' 
    | 'editor' 
    | 'qr' 
    | 'format-flow' 
    | 'document' 
    | 'collage' 
    | 'palette' 
    | 'crop' 
    | 'avatar' 
    | 'badge';
  sampleBefore?: string;
  sampleAfter?: string;
  acceptedFormats: string[];
  maxFileSizeMB: number;
  guide?: ToolGuideContent;
}
