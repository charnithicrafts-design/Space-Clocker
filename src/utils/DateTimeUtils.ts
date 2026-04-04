import { format, parse, startOfDay } from 'date-fns';

/**
 * Returns a date string in YYYY-MM-DD format for the local timezone.
 */
export const formatLocalISO = (date: Date = new Date()): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Parses a YYYY-MM-DD string into a local Date object set to the start of that day.
 */
export const parseLocalISO = (dateStr: string): Date => {
  return startOfDay(parse(dateStr, 'yyyy-MM-dd', new Date()));
};

/**
 * Returns today's date string in YYYY-MM-DD format for the local timezone.
 */
export const getTodayLocalISO = (): string => {
  return formatLocalISO(new Date());
};

/**
 * Returns the current local time in HH:mm format.
 */
export const getLocalTimeHHmm = (date: Date = new Date()): string => {
  return format(date, 'HH:mm');
};
