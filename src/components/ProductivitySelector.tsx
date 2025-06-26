import React from 'react';
import { ProductivityLevel } from '../types';

interface ProductivitySelectorProps {
  onSelect: (level: ProductivityLevel) => void;
}

const productivityLevels = [
  { level: 1, label: 'Not Productive', description: 'Minimal progress made' },
  { level: 2, label: 'Slightly Productive', description: 'Some tasks completed' },
  { level: 3, label: 'Productive', description: 'Average productivity' },
  { level: 4, label: 'Highly Productive', description: 'Exceptional day!' },
] as const;

export const ProductivitySelector: React.FC<ProductivitySelectorProps> = ({ onSelect }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white mb-6">How productive were you today?</h2>
      
      <div className="grid gap-3">
        {productivityLevels.map(({ level, label, description }) => (
          <button
            key={level}
            onClick={() => onSelect(level as ProductivityLevel)}
            className="group flex items-center justify-between p-4 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-green-500 transition-all duration-200 text-white"
          >
            <div className="text-left">
              <div className="font-medium text-white group-hover:text-green-400 transition-colors">
                {label}
              </div>
              <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                {description}
              </div>
            </div>
            <div className="flex items-center">
              <div 
                className={`w-4 h-4 rounded border-2 transition-all duration-200 ${
                  level === 1 ? 'bg-green-200 border-green-300' :
                  level === 2 ? 'bg-green-300 border-green-400' :
                  level === 3 ? 'bg-green-500 border-green-600' :
                  'bg-green-600 border-green-700'
                } group-hover:scale-110`}
              ></div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};