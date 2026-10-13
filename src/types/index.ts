export type ToolCategory =
  | 'all'
  | 'edit'
  | 'compress-resize'
  | 'conversion'
  | 'social'
  | 'pdf'
  | 'color-qr';

export type ToolBadge = 'Free' | 'Browser-Based';

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
}
