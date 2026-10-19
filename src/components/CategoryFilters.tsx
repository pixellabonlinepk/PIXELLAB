import React from 'react';
import { CATEGORIES } from '../data/tools';
import { ToolCategory } from '../types';

interface CategoryFiltersProps {
  activeCategory: ToolCategory;
  onSelectCategory: (cat: ToolCategory) => void;
}

export const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div className="w-full max-w-full overflow-x-auto pb-2 scrollbar-none min-w-0">
      <div className="inline-flex items-center gap-1.5 p-1.5 apple-segmented rounded-full glass-panel min-w-max shadow-sm">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full transition-all whitespace-nowrap shrink-0 active:scale-95 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-[#6E6E73] dark:text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-black/5 dark:bg-white/10 text-[#6E6E73] dark:text-[#86868B]'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
