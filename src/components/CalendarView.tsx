import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductivityData } from '../types';
import { formatDate, getDateFromString } from '../utils/dateUtils';
import { getProductivityLabel } from '../utils/streakUtils';

interface CalendarViewProps {
  data: ProductivityData;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ data }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Force re-render when data changes
  useEffect(() => {
    // This effect will trigger when data prop changes
  }, [data]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
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

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const today = new Date();
    const todayString = formatDate(today);
    
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-10 w-10 sm:h-12 sm:w-12"></div>
      );
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = formatDate(date);
      // Ensure we get the latest data value
      const level = data[dateString] || 0;
      const isToday = dateString === todayString;
      const isFuture = date > today;
      
      days.push(
        <div
          key={`${dateString}-${level}`} // Include level in key to force re-render
          className={`h-10 w-10 sm:h-12 sm:w-12 rounded-lg border-2 flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-200 ${
            isFuture 
              ? 'bg-gray-900 border-gray-800 text-gray-600 cursor-not-allowed'
              : `${getCellColor(level, isToday)} text-white cursor-pointer hover:scale-105`
          }`}
          title={isFuture ? 'Future date' : `${dateString} - ${getProductivityLabel(level)}`}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronLeft size={20} className="text-gray-400" />
        </button>
        
        <h2 className="text-lg sm:text-xl font-semibold text-white">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronRight size={20} className="text-gray-400" />
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-4">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs sm:text-sm font-medium text-gray-400 py-2">
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.slice(0, 1)}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {renderCalendar()}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 sm:mt-6 text-xs sm:text-sm text-gray-400">
        <span>Less</span>
        <div className="flex gap-1">
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