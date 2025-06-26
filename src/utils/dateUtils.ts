import { ProductivityData, GridCell } from '../types';

export const formatDate = (date: Date): string => {
  // Ensure we're working with local date, not UTC
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getTodayFormatted = (): string => {
  return formatDate(new Date());
};

export const getDaysAgo = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return formatDate(date);
};

export const getDateFromString = (dateString: string): Date => {
  // Create date in local timezone to avoid UTC issues
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const formatTooltipDate = (dateString: string): string => {
  const date = getDateFromString(dateString);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
};

export const getWeekday = (dateString: string): number => {
  const date = getDateFromString(dateString);
  return date.getDay();
};

export const generateGridData = (productivityData: ProductivityData): GridCell[][] => {
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  
  // Find the Sunday that starts the week containing one year ago
  const startSunday = new Date(oneYearAgo);
  const daysToSubtract = oneYearAgo.getDay(); // 0 = Sunday, 1 = Monday, etc.
  startSunday.setDate(oneYearAgo.getDate() - daysToSubtract);
  
  const grid: GridCell[][] = [];
  const currentDate = new Date(startSunday);
  
  // Generate exactly 53 weeks (371 days) to ensure we cover the full year
  for (let week = 0; week < 53; week++) {
    const weekData: GridCell[] = [];
    
    for (let day = 0; day < 7; day++) {
      const dateString = formatDate(currentDate);
      const level = productivityData[dateString] || 0;
      const isToday = dateString === getTodayFormatted();
      
      weekData.push({
        date: dateString,
        level: level as any,
        isToday
      });
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    grid.push(weekData);
  }
  
  return grid;
};