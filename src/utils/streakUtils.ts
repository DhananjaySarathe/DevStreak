import { ProductivityData } from '../types';
import { getTodayFormatted, getDaysAgo } from './dateUtils';

export const calculateCurrentStreak = (data: ProductivityData): number => {
  let streak = 0;
  const today = getTodayFormatted();
  
  // Check if today has productivity logged
  if (data[today] && data[today] > 0) {
    streak = 1;
  }
  
  // Check previous days
  let daysBack = 1;
  while (daysBack < 365) {
    const checkDate = getDaysAgo(daysBack);
    if (data[checkDate] && data[checkDate] > 0) {
      streak++;
      daysBack++;
    } else {
      break;
    }
  }
  
  return streak;
};

export const getProductivityLabel = (level: number): string => {
  const labels = ['No Activity', 'Not Productive', 'Slightly Productive', 'Productive', 'Highly Productive'];
  return labels[level] || 'No Activity';
};

export const getProductivityStats = (data: ProductivityData) => {
  const entries = Object.entries(data);
  const totalDays = entries.filter(([_, level]) => level > 0).length;
  
  // Calculate best streak
  let bestStreak = 0;
  let currentStreakCount = 0;
  
  // Sort dates to check streaks properly
  const sortedDates = entries
    .filter(([_, level]) => level > 0)
    .map(([date]) => date)
    .sort();
  
  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      currentStreakCount = 1;
    } else {
      const prevDate = new Date(sortedDates[i - 1]);
      const currentDate = new Date(sortedDates[i]);
      const dayDiff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        currentStreakCount++;
      } else {
        bestStreak = Math.max(bestStreak, currentStreakCount);
        currentStreakCount = 1;
      }
    }
  }
  bestStreak = Math.max(bestStreak, currentStreakCount);
  
  // Calculate distribution - Fixed the indexing issue
  const distribution = [
    { label: 'Not Productive', count: 0 },
    { label: 'Slightly Productive', count: 0 },
    { label: 'Productive', count: 0 },
    { label: 'Highly Productive', count: 0 },
  ];
  
  entries.forEach(([_, level]) => {
    if (level >= 1 && level <= 4) {
      distribution[level - 1].count++;
    }
  });
  
  return {
    totalDays,
    bestStreak,
    distribution,
  };
};