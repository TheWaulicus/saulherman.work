export function formatMonthYear(date: Date, month: 'short' | 'long' = 'short'): string {
  return new Intl.DateTimeFormat('en-US', { month, year: 'numeric', timeZone: 'UTC' }).format(date);
}

export function toYearMonthString(date: Date): string {
  return date.toISOString().slice(0, 7);
}

export function toPlainDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getCurrentYearSydney(): string {
  return new Intl.DateTimeFormat('en-AU', { year: 'numeric', timeZone: 'Australia/Sydney' }).format(new Date());
}
