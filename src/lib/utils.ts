import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCurrentWeekRange(): { start: string; end: string } {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday...
  
  const diffToMonday = (dayOfWeek + 6) % 7; 
  const start = new Date(now);
  start.setDate(now.getDate() - diffToMonday);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  return {
    start: formatDate(start),
    end: formatDate(end),
  };
}

export function validateDateRange(startStr: string, endStr: string): string | null {
  if (!startStr || !endStr) return "Both start and end dates are required";

  const start = new Date(startStr);
  const end = new Date(endStr);

  if (start > end) {
    return "Start date cannot be after end date";
  }

  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;

  if (diffDays > 7) {
    return "Date range cannot exceed 7 calendar days";
  }

  return null; 
}
