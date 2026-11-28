import type { Beer, Tasting } from '../types';

/** The flavours you reach for most often. */
export function usualFlavors(tastings: Tasting[], limit = 6): string[] {
  const counts = new Map<string, number>();
  for (const tasting of tastings) {
    for (const flavor of tasting.flavors) counts.set(flavor, (counts.get(flavor) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([flavor]) => flavor);
}

/**
 * Pick a well-rated beer whose flavours barely overlap with your usual ones.
 * The random choice is injected so the selection stays testable.
 */
export function surpriseBeer(catalog: Beer[], tastings: Tasting[], rng = Math.random): Beer | null {
  if (!catalog.length) return null;
  const usual = new Set(usualFlavors(tastings));

  const scored = catalog.map((beer) => ({
    beer,
    overlap: beer.flavors.filter((flavor) => usual.has(flavor)).length,
    novel: beer.flavors.filter((flavor) => !usual.has(flavor)).length,
  }));
  const different = scored.filter((item) => item.overlap === 0 && item.novel > 0);
  const pool = different.length ? different : scored.filter((item) => item.overlap <= 1);
  if (!pool.length) return null;

  const best = Math.max(...pool.map((item) => item.beer.score));
  const finalists = pool.filter((item) => item.beer.score >= best - 0.4);
  return finalists[Math.min(finalists.length - 1, Math.floor(rng() * finalists.length))]?.beer || null;
}
