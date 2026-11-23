import { describe, expect, test } from 'bun:test';
import { inferBeerType, isValidGtin, looksLikeBeer, normalizeEan, productToDraft } from './ean.js';

describe('normalizeEan', () => {
  test('keeps only digits', () => {
    expect(normalizeEan(' 4006-381 333.931 ')).toBe('4006381333931');
  });
});

describe('isValidGtin', () => {
  test('accepts valid EAN-13, EAN-8 and UPC-A codes', () => {
    expect(isValidGtin('4006381333931')).toBe(true);
    expect(isValidGtin('96385074')).toBe(true);
    expect(isValidGtin('036000291452')).toBe(true);
  });

  test('rejects a wrong check digit and unsupported lengths', () => {
    expect(isValidGtin('4006381333932')).toBe(false);
    expect(isValidGtin('12345')).toBe(false);
    expect(isValidGtin('')).toBe(false);
  });
});

describe('inferBeerType', () => {
  test('maps common category words to Hopnote types', () => {
    expect(inferBeerType({ name: 'Hazy Crane', categories: 'Beers, India Pale Ale' })).toBe('IPA');
    expect(inferBeerType({ name: 'Midnight', categories: 'Beers, Stout' })).toBe('Stout');
    expect(inferBeerType({ name: 'Weizen', categories: 'Beer' })).toBe('Wheat beer');
    expect(inferBeerType({ name: 'Something', categories: 'Beverages, Beers' })).toBe('Lager');
  });
});

describe('looksLikeBeer', () => {
  test('recognises beer categories and stays quiet for other products', () => {
    expect(looksLikeBeer({ name: 'Pils', categories: 'Beers' })).toBe(true);
    expect(looksLikeBeer({ name: 'Würzsalz', categories: 'Gels' })).toBe(false);
  });
});

describe('productToDraft', () => {
  test('builds a new-tasting draft from a lookup result', () => {
    const draft = productToDraft(
      {
        name: 'Rothaus Tannenzäpfle',
        brand: 'Rothaus',
        image: 'https://example.com/front.jpg',
        quantity: '500 ml',
        categories: 'Beers, Pils',
      },
      '4006381333931',
    );
    expect(draft).toEqual({
      name: 'Rothaus Tannenzäpfle',
      type: 'Lager',
      brewery: 'Rothaus',
      ean: '4006381333931',
      image: 'https://example.com/front.jpg',
      quantity: '500 ml',
      notes: '',
    });
  });

  test('still returns a usable draft when the product was not found', () => {
    expect(productToDraft(null, '4006381333931')).toMatchObject({
      name: '',
      type: 'Lager',
      ean: '4006381333931',
    });
  });
});
