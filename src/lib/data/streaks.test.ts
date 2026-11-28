import { describe, expect, test } from 'bun:test';
import { currentStreak, longestStreak, pourCalendar } from './streaks.ts';
import type { Tasting } from '../types';

const now = new Date(2026, 10, 28, 18); // 28 November 2026

function day(offset: number): number {
  return new Date(2026, 10, 28 - offset, 18).getTime();
}

function tasting(id: string, at: number): Tasting {
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
    createdAt: at,
    seed: false,
  };
}

const journal = [tasting('today', day(0)), tasting('yesterday', day(1)), tasting('old', day(9))];

describe('streaks', () => {
  test('counts today and yesterday as one run', () => {
    expect(currentStreak(journal, now)).toBe(2);
  });

  test('keeps a run alive when today has no pour yet', () => {
    expect(currentStreak([tasting('yesterday', day(1))], now)).toBe(1);
    expect(currentStreak([tasting('two days ago', day(2))], now)).toBe(0);
  });

  test('finds the longest run in the journal', () => {
    expect(longestStreak(journal)).toBe(2);
    expect(longestStreak([])).toBe(0);
  });
});

describe('pourCalendar', () => {
  test('builds Monday-first weeks ending on today', () => {
    const weeks = pourCalendar(journal, now, 5);
    expect(weeks).toHaveLength(5);
    expect(weeks.every((week) => week.length === 7)).toBe(true);
    const days = weeks.flat();
    expect(days.filter((entry) => entry.today).map((entry) => entry.key)).toEqual(['2026-11-28']);
  });

  test('marks days with pours and their counts', () => {
    const flat = pourCalendar(journal, now, 5).flat();
    expect(flat.find((entry) => entry.key === '2026-11-28')?.count).toBe(1);
    expect(flat.find((entry) => entry.key === '2026-11-19')?.count).toBe(1);
    expect(flat.filter((entry) => entry.count > 0)).toHaveLength(3);
  });
});
