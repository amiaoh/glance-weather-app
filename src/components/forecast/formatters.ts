export function formatHour(date: Date): string {
  const hour = date.getHours();
  if (hour === 0) return '12am';
  if (hour === 12) return '12pm';
  if (hour < 12) return `${hour}am`;
  return `${hour - 12}pm`;
}

export function formatDay(date: Date): string {
  return date.toLocaleDateString('en-AU', { weekday: 'short' });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'numeric' });
}

export function isDayChange(currentTime: Date, previousTime: Date | undefined): boolean {
  if (!previousTime) return true;
  return currentTime.toDateString() !== previousTime.toDateString();
}
