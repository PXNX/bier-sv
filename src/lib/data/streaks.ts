import type { Tasting } from '../types';

export type CalendarDay = {
  key: string;
  count: number;
  today: boolean;
};

function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function countsByDay(tastings: Tasting[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const tasting of tastings) {
    const key = dateKey(new Date(tasting.createdAt));
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return counts;
}

/** Consecutive days with a pour, counting today or yesterday as the start. */
export function currentStreak(tastings: Tasting[], now = new Date()): number {
  const counts = countsByDay(tastings);
  const cursor = startOfDay(now);
  if (!counts.has(dateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (counts.has(dateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/** The longest unbroken run of pouring days in the journal. */
export function longestStreak(tastings: Tasting[]): number {
  const counts = countsByDay(tastings);
  const keys = [...counts.keys()].sort();
  if (!keys.length) return 0;
  const cursor = new Date(`${keys[0]}T12:00:00`);
  const end = new Date(`${keys[keys.length - 1]}T12:00:00`);
  let run = 0;
  let best = 0;
  while (cursor <= end) {
    if (counts.has(dateKey(cursor))) {
      run += 1;
      best = Math.max(best, run);
    } else {
      run = 0;
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return best;
}

/** A Monday-first grid of the last `weeks` weeks, ending with today. */
export function pourCalendar(tastings: Tasting[], now = new Date(), weeks = 5): CalendarDay[][] {
  const counts = countsByDay(tastings);
  const todayKey = dateKey(now);
  const cursor = startOfDay(now);
  cursor.setDate(cursor.getDate() - ((cursor.getDay() + 6) % 7) - (weeks - 1) * 7);

  return Array.from({ length: weeks }, () =>
    Array.from({ length: 7 }, () => {
      const key = dateKey(cursor);
      const day = { key, count: counts.get(key) || 0, today: key === todayKey };
      cursor.setDate(cursor.getDate() + 1);
      return day;
    }),
  );
}
