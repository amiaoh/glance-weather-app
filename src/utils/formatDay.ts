export function formatDay(date: Date): string {
  return date.toLocaleDateString('en-AU', { weekday: 'short' });
}
