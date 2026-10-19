import React from 'react';
import { ToolMetadata } from '../types';
import { ToolCard } from './ToolCard';
import { Sparkles, RefreshCcw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ToolGridProps {
  tools: ToolMetadata[];
  onSelectTool: (id: string) => void;
  onResetFilters?: () => void;
  searchQuery?: string;
}

export const ToolGrid: React.FC<ToolGridProps> = ({
  tools,
  onSelectTool,
  onResetFilters,
  searchQuery,
}) => {
  const { theme } = useTheme();

  if (tools.length === 0) {
    return (
      <div className="text-center py-16 px-4 rounded-3xl glass-panel max-w-xl mx-auto my-8">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-indigo-500/10 text-indigo-500">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3
          className={`text-lg font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}
        >
          No tools found
        </h3>
        <p
          className={`text-xs max-w-md mx-auto mb-6 ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          {searchQuery
            ? `No tools matched "${searchQuery}". Try searching for compress, crop, watermark, QR, or PDF.`
            : 'No tools match the selected category.'}
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-sm"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Reset Search & Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} onSelect={onSelectTool} />
      ))}
    </div>
  );
};
