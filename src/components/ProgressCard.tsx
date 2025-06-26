import React, { useRef } from 'react';
import { Download, Calendar, TrendingUp } from 'lucide-react';
import { ProductivityData } from '../types';
import { ContributionGrid } from './ContributionGrid';
import { StreakCounter } from './StreakCounter';
import { calculateCurrentStreak, getProductivityStats } from '../utils/streakUtils';
import html2canvas from 'html2canvas';

interface ProgressCardProps {
  data: ProductivityData;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ data }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const currentStreak = calculateCurrentStreak(data);
  const stats = getProductivityStats(data);

  const downloadProgressCard = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#111827',
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const link = document.createElement('a');
      link.download = `devstreak-progress-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error generating progress card:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Download Button */}
      <div className="flex justify-end">
        <button
          onClick={downloadProgressCard}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors border border-blue-500"
        >
          <Download size={16} />
          Download Progress Card
        </button>
      </div>

      {/* Progress Card */}
      <div 
        ref={cardRef}
        className="bg-gray-800 rounded-lg p-8 border border-gray-700 space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            DevStreak Progress Report
          </h1>
          <p className="text-gray-400">
            Generated on {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="text-green-400" size={24} />
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalDays}</div>
            <div className="text-sm text-gray-400">Total Days Logged</div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <span className="text-2xl">🔥</span>
            </div>
            <div className="text-2xl font-bold text-white">{currentStreak}</div>
            <div className="text-sm text-gray-400">Current Streak</div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="text-blue-400" size={24} />
            </div>
            <div className="text-2xl font-bold text-white">{stats.bestStreak}</div>
            <div className="text-sm text-gray-400">Best Streak</div>
          </div>
        </div>

        {/* Productivity Distribution */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Productivity Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.distribution.map((item, index) => (
              <div key={index} className="bg-gray-900 rounded-lg p-4 text-center">
                <div className={`w-4 h-4 rounded mx-auto mb-2 ${
                  index === 0 ? 'bg-red-500' :      // Not Productive - Red
                  index === 1 ? 'bg-red-300' :      // Slightly Productive - Light Red
                  index === 2 ? 'bg-green-500' :    // Productive - Green
                  'bg-green-600'                     // Highly Productive - Dark Green
                }`}></div>
                <div className="text-lg font-bold text-white">{item.count}</div>
                <div className="text-xs text-gray-400">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Contribution Grid */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Your Productivity Journey</h3>
          <ContributionGrid data={data} />
        </div>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-gray-700">
          <p className="text-gray-500 text-sm">
            Keep building your streak! 💪
          </p>
        </div>
      </div>
    </div>
  );
};