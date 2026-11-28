import { describe, expect, test } from 'bun:test';
import { suggestFlavors } from './suggestions.ts';
import type { Tasting } from '../types';

function tasting(id: string, type: string, flavorList: string[]): Tasting {
  return {
    id,
    name: id,
    brewery: '',
    logo: null,
    type,
    style: type,
    score: 4,
    flavors: flavorList,
    notes: '',
    createdAt: 0,
    seed: false,
  };
}

const journal = [
  tasting('a', 'Lager', ['Malty', 'Mild', 'Carbonated']),
  tasting('b', 'Lager', ['Malty', 'Sweet']),
  tasting('c', 'Stout', ['Roasted', 'Malty']),
];

describe('suggestFlavors', () => {
  test('favours flavours from the same style', () => {
    expect(suggestFlavors(journal, [], 'Lager')).toEqual(['Malty', 'Carbonated', 'Sweet', 'Mild']);
  });

  test('boosts flavours that travel with the current picks', () => {
    const result = suggestFlavors(journal, ['Malty'], 'Lager');
    expect(result).toContain('Mild');
    expect(result).toContain('Sweet');
    expect(result).not.toContain('Malty');
  });

  test('falls back to the whole journal for an unseen style', () => {
    expect(suggestFlavors(journal, [], 'Saison')).toContain('Malty');
  });

  test('returns nothing for an empty journal or an exhausted selection', () => {
    expect(suggestFlavors([], [], 'Lager')).toEqual([]);
    expect(suggestFlavors(journal, ['Malty', 'Mild', 'Carbonated', 'Sweet', 'Roasted'], 'Lager')).toEqual([]);
  });
});
