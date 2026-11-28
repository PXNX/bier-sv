import { describe, expect, test } from 'bun:test';
import { earnedMilestones, milestoneLabel } from './milestones.ts';
import { topPours } from './rankings.ts';
import type { Tasting } from '../types';

function tasting(id: string, name: string, type: string, score: number, flavors: string[]): Tasting {
  return {
    id,
    name,
    brewery: '',
    logo: null,
    type,
    style: type,
    score,
    flavors,
    notes: '',
    createdAt: 0,
    seed: false,
  };
}

const journal = [
  tasting('a', 'Helles', 'Lager', 4.5, ['Malty', 'Mild']),
  tasting('b', 'Helles', 'Lager', 4.7, ['Malty', 'Carbonated']),
  tasting('c', 'Gose', 'Sour & wild', 4.2, ['Sour', 'Fruity']),
];

describe('milestones', () => {
  test('earns badges from the journal', () => {
    const earned = earnedMilestones(journal);
    expect(earned).toContain('first');
    expect(earned).toContain('sour');
    expect(earned).not.toContain('ten');
  });

  test('an empty journal earns nothing and labels resolve', () => {
    expect(earnedMilestones([])).toEqual([]);
    expect(milestoneLabel('sour')).toBe('Sour adventurer');
  });
});

describe('topPours', () => {
  test('averages repeat pours and ranks them by score', () => {
    expect(topPours(journal, 5)).toEqual([
      { id: 'a', name: 'Helles', score: 4.6, times: 2 },
      { id: 'c', name: 'Gose', score: 4.2, times: 1 },
    ]);
  });

  test('returns an empty list for an empty journal', () => {
    expect(topPours([])).toEqual([]);
  });
});
