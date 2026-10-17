import React from 'react';
import { CATEGORIES } from '../data/tools';
import { ToolCategory } from '../types';
import { useTheme } from '../context/ThemeContext';

interface CategoryFiltersProps {
  activeCategory: ToolCategory;
  onSelectCategory: (cat: ToolCategory) => void;
}

export const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const { theme } = useTheme();

  return (
    <div className="w-full max-w-full overflow-x-auto pb-2 scrollbar-none min-w-0">
      <div
        className={`inline-flex items-center gap-1.5 p-1.5 border rounded-2xl min-w-max transition-colors ${
          theme === 'dark'
            ? 'bg-slate-900/70 backdrop-blur-md border-indigo-500/20 shadow-md shadow-black/20'
            : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : theme === 'dark'
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : theme === 'dark'
                    ? 'bg-slate-800 text-slate-400'
                    : 'bg-slate-100 text-slate-600'
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
