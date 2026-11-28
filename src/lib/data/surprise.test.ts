import { describe, expect, test } from 'bun:test';
import { surpriseBeer, usualFlavors } from './surprise.ts';
import type { Beer, Tasting } from '../types';

function beer(id: string, score: number, flavors: string[]): Beer {
  return {
    id,
    name: id,
    type: 'Lager',
    style: 'Test',
    score,
    reviews: 1,
    accent: '#e0a23c',
    flavors,
  };
}

function tasting(flavors: string[]): Tasting {
  return {
    id: 't',
    name: 't',
    brewery: '',
    logo: null,
    type: 'Lager',
    style: 'Helles',
    score: 4,
    flavors,
    notes: '',
    createdAt: 0,
    seed: false,
  };
}

describe('surpriseBeer', () => {
  const journal = [tasting(['Malty', 'Mild']), tasting(['Malty', 'Carbonated'])];

  test('learns your usual flavours from the journal', () => {
    expect(usualFlavors(journal)).toEqual(['Malty', 'Mild', 'Carbonated']);
  });

  test('prefers a beer with no overlap and a good score', () => {
    const catalog = [
      beer('familiar', 5, ['Malty', 'Mild']),
      beer('unfamiliar', 4.5, ['Sour', 'Fruity']),
      beer('weak', 3, ['Roasted']),
    ];
    expect(surpriseBeer(catalog, journal, () => 0)?.id).toBe('unfamiliar');
  });

  test('falls back to a low-overlap pick when no beer is completely new', () => {
    const catalog = [beer('one-shared', 4.6, ['Malty', 'Sour']), beer('two-shared', 4.9, ['Malty', 'Mild'])];
    expect(surpriseBeer(catalog, journal, () => 0)?.id).toBe('one-shared');
  });

  test('handles empty inputs', () => {
    expect(surpriseBeer([], journal)).toBeNull();
    expect(surpriseBeer([beer('a', 4, ['Sour'])], [], () => 0)?.id).toBe('a');
  });
});
