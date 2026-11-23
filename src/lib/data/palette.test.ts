import { describe, expect, test } from 'bun:test';
import { beerPalette } from './palette.ts';

describe('beerPalette', () => {
  test('gives each family its own colours', () => {
    expect(beerPalette({ style: 'Imperial Stout', type: 'Stout' }).liquid).toBe('#633b25');
    expect(beerPalette({ style: 'Hefeweizen', type: 'Wheat beer' }).liquid).toBe('#edbe5d');
    expect(beerPalette({ style: 'Gose', type: 'Sour & wild' }).liquid).toBe('#df9276');
    expect(beerPalette({ style: 'West Coast IPA', type: 'IPA' }).liquid).toBe('#d98b2b');
    expect(beerPalette({ style: 'Farmhouse Ale', type: 'Saison' }).liquid).toBe('#d8c05f');
  });

  test('falls back to the curated accent for other styles', () => {
    expect(beerPalette({ style: 'Draught', type: 'Lager', accent: '#ff0000' }).liquid).toBe('#e6b34a');
    expect(beerPalette({ style: 'Mystery', type: 'Unknown' as never, accent: '#123456' }).liquid).toBe(
      '#123456',
    );
  });
});
