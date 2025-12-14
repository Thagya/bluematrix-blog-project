'use client';

import { Category } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter by Category</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectCategory(null)}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            !selectedCategory || selectedCategory === ''
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          All Posts
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => onSelectCategory(category._id)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              selectedCategory === category._id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}