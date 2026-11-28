import { describe, expect, test } from 'bun:test';
import { forgottenPours } from './revisit.ts';
import type { Tasting } from '../types';

const now = new Date(2026, 10, 28, 18);
const DAY = 24 * 60 * 60 * 1000;

function tasting(id: string, score: number, ageDays: number): Tasting {
  return {
    id,
    name: id,
    brewery: '',
    logo: null,
    type: 'Lager',
    style: 'Helles',
    score,
    flavors: [],
    notes: '',
    createdAt: now.getTime() - ageDays * DAY,
    seed: false,
  };
}

describe('forgottenPours', () => {
  test('resurfaces only good, older pours, best first', () => {
    const journal = [
      tasting('fresh', 4.9, 1),
      tasting('old-ok', 4.0, 40),
      tasting('old-good', 4.6, 30),
      tasting('old-best', 4.8, 20),
    ];
    expect(forgottenPours(journal, now).map((item) => item.id)).toEqual(['old-best', 'old-good']);
  });

  test('respects an empty journal and custom thresholds', () => {
    expect(forgottenPours([], now)).toEqual([]);
    expect(forgottenPours([tasting('a', 4.5, 5)], now, 14)).toEqual([]);
    expect(forgottenPours([tasting('a', 4.5, 5)], now, 2)).toHaveLength(1);
  });
});
