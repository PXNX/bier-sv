import { flavors } from './beers.ts';
import type { Tasting } from '../types';

/**
 * Flavours worth offering next, based on what this taster usually logs.
 * Same-style tastings carry the most weight; the full journal is the fallback.
 */
export function suggestFlavors(
  tastings: Tasting[],
  selected: string[],
  type: string,
  limit = 5,
): string[] {
  const chosen = selected.filter((id) => flavors.some((flavor) => flavor.id === id));
  const sameStyle = tastings.filter((tasting) => tasting.type === type);
  const pool = sameStyle.length ? sameStyle : tastings;

  return flavors
    .filter((flavor) => !chosen.includes(flavor.id))
    .map((flavor) => {
      const overall = pool.filter((tasting) => tasting.flavors.includes(flavor.id)).length;
      const together = chosen.length
        ? pool.filter(
            (tasting) =>
              tasting.flavors.includes(flavor.id) &&
              chosen.some((id) => tasting.flavors.includes(id)),
          ).length
        : 0;
      return { id: flavor.id, score: overall + together * 3 };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.id);
}
