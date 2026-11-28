import type { Tasting } from '../types';

export type RankedPour = {
  id: string;
  name: string;
  score: number;
  times: number;
};

/** Your best-loved beers, averaged across every time you poured one. */
export function topPours(tastings: Tasting[], limit = 5): RankedPour[] {
  const grouped = new Map<string, { name: string; total: number; times: number; id: string }>();
  for (const tasting of tastings) {
    const key = tasting.name.trim().toLowerCase();
    const entry = grouped.get(key) || { name: tasting.name, total: 0, times: 0, id: tasting.id };
    entry.total += Number(tasting.score);
    entry.times += 1;
    grouped.set(key, entry);
  }
  return [...grouped.values()]
    .map((entry) => ({
      id: entry.id,
      name: entry.name,
      score: entry.total / entry.times,
      times: entry.times,
    }))
    .sort((a, b) => b.score - a.score || b.times - a.times || a.name.localeCompare(b.name))
    .slice(0, limit);
}
