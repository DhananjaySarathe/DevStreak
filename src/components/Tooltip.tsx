import React from 'react';
import { TooltipData } from '../types';
import { formatTooltipDate } from '../utils/dateUtils';
import { getProductivityLabel } from '../utils/streakUtils';

interface TooltipProps {
  data: TooltipData | null;
}

export const Tooltip: React.FC<TooltipProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div 
      className="fixed z-50 pointer-events-none"
      style={{ 
        left: data.x,
        top: data.y - 40,
        transform: 'translateX(-50%)'
      }}
    >
      <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg border border-gray-700 whitespace-nowrap">
        <div className="font-medium">{formatTooltipDate(data.date)}</div>
        <div className="text-gray-300">{getProductivityLabel(data.level)}</div>
        <div 
          className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"
        ></div>
      </div>
    </div>
  );
};