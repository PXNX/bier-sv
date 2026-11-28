import { describe, expect, test } from 'bun:test';
import { prefillFromBeer } from './prefill.ts';
import type { Beer, Tasting } from '../types';

const beer: Beer = {
  id: 'seed-1',
  name: 'Zwickel No. 5',
  type: 'Lager',
  style: 'Kellerbier',
  score: 4.7,
  reviews: 48,
  accent: '#d9a02f',
  flavors: ['Malty', 'Mild', 'Hoppy'],
  brewery: 'Somewhere',
  description: 'Soft and bready.',
};

const tasting: Tasting = {
  ...beer,
  id: 't-1',
  brewery: 'Somewhere',
  logo: null,
  notes: 'Lovely with dinner.',
  createdAt: 0,
  seed: false,
};

describe('prefillFromBeer', () => {
  test('carries the identifying details and flavours from a board beer', () => {
    expect(prefillFromBeer(beer)).toEqual({
      name: 'Zwickel No. 5',
      type: 'Lager',
      brewery: 'Somewhere',
      ean: null,
      image: null,
      quantity: '',
      notes: 'Soft and bready.',
      flavors: ['Malty', 'Mild', 'Hoppy'],
    });
  });

  test('uses the tasting note when the source is a journal entry', () => {
    expect(prefillFromBeer(tasting).notes).toBe('Lovely with dinner.');
  });

  test('does not share the source flavour array', () => {
    const prefill = prefillFromBeer(beer);
    prefill.flavors?.push('Sour');
    expect(beer.flavors).toEqual(['Malty', 'Mild', 'Hoppy']);
  });
});
