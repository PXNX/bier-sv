import { describe, expect, test } from 'bun:test';
import { duelStats, pickDuel } from './duels.ts';
import type { DuelVote, Tasting } from '../types';

function tasting(id: string): Tasting {
  return {
    id,
    name: id,
    brewery: '',
    logo: null,
    type: 'Lager',
    style: 'Helles',
    score: 4,
    flavors: [],
    notes: '',
    createdAt: 0,
    seed: false,
  };
}

const trio = [tasting('a'), tasting('b'), tasting('c')];
const votes: DuelVote[] = [
  { winnerId: 'a', loserId: 'b', at: 1 },
  { winnerId: 'a', loserId: 'c', at: 2 },
];

describe('duelStats', () => {
  test('ranks by smoothed win rate', () => {
    expect(duelStats(votes, trio).map((item) => item.id)).toEqual(['a', 'b', 'c']);
    expect(duelStats(votes, trio)[0]).toMatchObject({ wins: 2, losses: 0 });
  });

  test('ignores votes for removed tastings', () => {
    expect(duelStats(votes, [tasting('a')]).map((item) => item.id)).toEqual(['a']);
  });
});

describe('pickDuel', () => {
  test('needs at least two pours', () => {
    expect(pickDuel([], [])).toBeNull();
    expect(pickDuel([tasting('a')], [])).toBeNull();
  });

  test('prefers an uncompared pair', () => {
    expect(pickDuel(trio, votes, () => 0)).toEqual([tasting('b'), tasting('c')]);
  });

  test('falls back to a known pair once every combination is used', () => {
    const all: DuelVote[] = [...votes, { winnerId: 'b', loserId: 'c', at: 3 }];
    expect(pickDuel(trio, all, () => 0)).toEqual([tasting('a'), tasting('b')]);
  });
});
