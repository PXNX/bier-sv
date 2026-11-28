import type { Tasting } from '../types';

/** Well-loved pours you have not logged in a while — drawn only from your own journal. */
export function forgottenPours(
  tastings: Tasting[],
  now = new Date(),
  days = 14,
  minScore = 4.4,
  limit = 3,
): Tasting[] {
  const cutoff = now.getTime() - days * 24 * 60 * 60 * 1000;
  return tastings
    .filter((tasting) => Number(tasting.score) >= minScore && tasting.createdAt <= cutoff)
    .sort((a, b) => Number(b.score) - Number(a.score) || a.createdAt - b.createdAt)
    .slice(0, limit);
}
