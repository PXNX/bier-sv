import { describe, expect, test } from 'bun:test';
import { glassFills, ratingTone } from './rating.ts';

describe('ratingTone', () => {
  test('labels the score bands', () => {
    expect(ratingTone(4.9).label).toBe('Exceptional');
    expect(ratingTone(4.4).label).toBe('Excellent');
    expect(ratingTone(3.9).label).toBe('Very good');
    expect(ratingTone(3.4).label).toBe('Solid');
    expect(ratingTone(2.5).label).toBe('Sessionable');
  });
});

describe('glassFills', () => {
  test('fills five glasses proportionally', () => {
    expect(glassFills(4.7)).toEqual([1, 1, 1, 1, 0.7]);
    expect(glassFills(5)).toEqual([1, 1, 1, 1, 1]);
    expect(glassFills(0)).toEqual([0, 0, 0, 0, 0]);
  });
});
