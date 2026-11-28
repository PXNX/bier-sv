import { describe, expect, test } from 'bun:test';
import { formatAbv, formatPrice } from './details.ts';

describe('optional tasting details', () => {
  test('formats money and strength', () => {
    expect(formatPrice(3.5)).toBe('€3.50');
    expect(formatAbv(5.2)).toBe('5.2% ABV');
  });

  test('leaves blank values out entirely', () => {
    expect(formatPrice(null)).toBe('');
    expect(formatPrice(undefined)).toBe('');
    expect(formatAbv(null)).toBe('');
    expect(formatAbv(-1)).toBe('');
  });
});
