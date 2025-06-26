import React, { useState, useEffect } from 'react';
import { ProductivityData, TooltipData } from '../types';
import { generateGridData } from '../utils/dateUtils';
import { Tooltip } from './Tooltip';

interface ContributionGridProps {
  data: ProductivityData;
}

export const ContributionGrid: React.FC<ContributionGridProps> = ({ data }) => {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [gridData, setGridData] = useState(() => generateGridData(data));

  // Update grid data when productivity data changes
  useEffect(() => {
    setGridData(generateGridData(data));
  }, [data]);

  const handleCellHover = (event: React.MouseEvent, date: string, level: number) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      date,
      level,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  const handleCellLeave = () => {
    setTooltip(null);
  };

  const getCellColor = (level: number, isToday: boolean) => {
    if (level === 0) {
      return isToday ? 'bg-gray-600 border-gray-500' : 'bg-gray-800 border-gray-700';
    }
    
    const colors = [
      'bg-gray-800 border-gray-700', // 0 - no activity
      'bg-red-500 border-red-600', // 1 - not productive (red)
      'bg-red-300 border-red-400', // 2 - slightly productive (light red)
      'bg-green-500 border-green-600', // 3 - productive (green)
      'bg-green-600 border-green-700', // 4 - highly productive (dark green)
    ];
    
    return colors[level] + (isToday ? ' ring-2 ring-blue-400' : '');
  };

  // Generate month labels based on the actual grid data
  const getMonthLabels = () => {
    const labels: { month: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    
    gridData.forEach((week, weekIndex) => {
      // Check the first day of each week (Sunday)
      const firstDayOfWeek = new Date(week[0].date + 'T00:00:00');
      const currentMonth = firstDayOfWeek.getMonth();
      
      // If this is a new month and we have space for the label
      if (currentMonth !== lastMonth && weekIndex > 0) {
        // Only add if there's enough space (at least 2 weeks since last label)
        const lastLabelWeek = labels.length > 0 ? labels[labels.length - 1].weekIndex : -3;
        if (weekIndex - lastLabelWeek >= 2) {
          labels.push({
            month: firstDayOfWeek.toLocaleDateString('en', { month: 'short' }),
            weekIndex: weekIndex
          });
        }
        lastMonth = currentMonth;
      }
    });
    
    return labels;
  };

  const monthLabels = getMonthLabels();

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Month labels */}
          <div className="flex mb-2 text-xs text-gray-400 h-4">
            <div className="w-6 sm:w-8"></div> {/* Space for day labels */}
            <div className="flex-1 relative">
              {monthLabels.map((label, index) => (
                <div 
                  key={index}
                  className="absolute text-xs"
                  style={{ 
                    left: `${label.weekIndex * (window.innerWidth < 640 ? 10 : 14)}px`, // Responsive spacing
                  }}
                >
                  {label.month}
                </div>
              ))}
            </div>
          </div>

          {/* Grid with day labels */}
          <div className="flex">
            {/* Day labels - aligned with grid rows */}
            <div className="flex flex-col text-xs text-gray-400 mr-1 sm:mr-2">
              <div className="h-2 mb-1 sm:h-3 sm:mb-1"></div> {/* Sunday - empty */}
              <div className="h-2 mb-1 sm:h-3 sm:mb-1 flex items-center">
                <span className="hidden sm:inline">Mon</span>
                <span className="sm:hidden">M</span>
              </div>
              <div className="h-2 mb-1 sm:h-3 sm:mb-1"></div> {/* Tuesday - empty */}
              <div className="h-2 mb-1 sm:h-3 sm:mb-1 flex items-center">
                <span className="hidden sm:inline">Wed</span>
                <span className="sm:hidden">W</span>
              </div>
              <div className="h-2 mb-1 sm:h-3 sm:mb-1"></div> {/* Thursday - empty */}
              <div className="h-2 mb-1 sm:h-3 sm:mb-1 flex items-center">
                <span className="hidden sm:inline">Fri</span>
                <span className="sm:hidden">F</span>
              </div>
              <div className="h-2 sm:h-3"></div> {/* Saturday - empty */}
            </div>

            {/* Contribution grid */}
            <div className="flex gap-0.5 sm:gap-1">
              {gridData.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-0.5 sm:gap-1">
                  {week.map((day, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}-${day.level}`} // Include level in key
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-sm border cursor-pointer transition-all duration-150 hover:scale-110 ${getCellColor(day.level, day.isToday)}`}
                      onMouseEnter={(e) => handleCellHover(e, day.date, day.level)}
                      onMouseLeave={handleCellLeave}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Tooltip data={tooltip} />
      
      {/* Legend */}
      <div className="flex items-center justify-between mt-4 text-xs sm:text-sm text-gray-400">
        <span>Less</span>
        <div className="flex gap-0.5 sm:gap-1">
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-sm border ${getCellColor(level, false)}`}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
};