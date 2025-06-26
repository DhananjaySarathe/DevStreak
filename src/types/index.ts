export interface ProductivityData {
  [date: string]: number; // date in YYYY-MM-DD format, value 1-4 (changed from 0-4)
}

export interface TooltipData {
  date: string;
  level: number;
  x: number;
  y: number;
}

export type ProductivityLevel = 1 | 2 | 3 | 4; // Changed from 0 | 1 | 2 | 3 | 4

export interface GridCell {
  date: string;
  level: ProductivityLevel;
  isToday: boolean;
}