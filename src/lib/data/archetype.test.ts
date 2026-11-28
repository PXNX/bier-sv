import { describe, expect, test } from 'bun:test';
import { paletteArchetype } from './archetype.ts';
import type { Tasting } from '../types';

function tasting(id: string, flavors: string[]): Tasting {
  return {
    id,
    name: id,
    brewery: '',
    logo: null,
    type: 'Stout',
    style: 'Stout',
    score: 4,
    flavors,
    notes: '',
    createdAt: 0,
    seed: false,
  };
}

describe('paletteArchetype', () => {
  test('names the dominant flavour axis', () => {
    const result = paletteArchetype([tasting('a', ['Roasted', 'Malty']), tasting('b', ['Roasted'])]);
    expect(result.name).toBe('The Roasted Explorer');
    expect(result.tagline).toContain('cocoa');
  });

  test('an empty journal gets a gentle placeholder', () => {
    const result = paletteArchetype([]);
    expect(result.name).toBe('A Blank Slate');
    expect(result.axes.every((axis) => axis.value === 0)).toBe(true);
  });

  test('axis values are proportions between zero and one', () => {
    const result = paletteArchetype([tasting('a', ['Sour']), tasting('b', ['Malty'])]);
    expect(result.axes.find((axis) => axis.id === 'Tart')?.value).toBe(0.5);
    expect(result.axes.every((axis) => axis.value >= 0 && axis.value <= 1)).toBe(true);
  });
});
