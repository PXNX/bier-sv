import { flavorAccent, flavorAxes } from './beers.ts';
import type { Tasting } from '../types';

export type Archetype = {
  name: string;
  tagline: string;
  accent: string;
  axes: { id: string; value: number }[];
};

const identities: Record<string, { name: string; tagline: string }> = {
  Malt: { name: 'The Comfort Seeker', tagline: 'Soft bread, gentle sweetness and a familiar welcome.' },
  Hops: { name: 'The Hop Chaser', tagline: 'Bitter edges and leafy aromatics are your compass.' },
  Fruit: { name: 'The Bright Taster', tagline: 'You follow zest, peel and fruit wherever they lead.' },
  Roast: { name: 'The Roasted Explorer', tagline: 'Coffee, cocoa and toasted malt keep drawing you back.' },
  Tart: { name: 'The Tart Adventurer', tagline: 'A lively, tangy pour is never the wrong answer.' },
  Fresh: { name: 'The Sessionable Soul', tagline: 'Clean, easy-going pours with room for another.' },
};

/** A playful, private identity drawn from the flavours in your journal. */
export function paletteArchetype(tastings: Tasting[]): Archetype {
  const axes = flavorAxes.map((axis) => ({
    id: axis.id,
    value: tastings.length
      ? tastings.filter((tasting) => axis.flavors.some((flavor) => tasting.flavors.includes(flavor))).length /
        tastings.length
      : 0,
  }));
  const top = [...axes].sort((a, b) => b.value - a.value)[0];
  const identity = top?.value ? identities[top.id] : undefined;

  return {
    name: identity?.name || 'A Blank Slate',
    tagline: identity?.tagline || 'Log a few pours and your palate will introduce itself.',
    accent: top?.value
      ? flavorAccent(flavorAxes.find((axis) => axis.id === top.id)?.flavors[0] || '')
      : '#e0a23c',
    axes,
  };
}
