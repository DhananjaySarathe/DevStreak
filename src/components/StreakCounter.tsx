import React from 'react';

interface StreakCounterProps {
  streak: number;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({ streak }) => {
  return (
    <div className="text-center py-6">
      <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-800 rounded-lg border border-gray-700">
        <span className="text-2xl">🔥</span>
        <div>
          <div className="text-2xl font-bold text-white">
            {streak} day{streak !== 1 ? 's' : ''}
          </div>
          <div className="text-sm text-gray-400">
            Current streak
          </div>
        </div>
      </div>
    </div>
  );
};