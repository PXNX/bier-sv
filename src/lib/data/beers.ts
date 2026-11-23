import type { Beer, Flavor, FlavorAxis, GeoPoint, Tasting, TypeOption } from '../types';

export type GlassKind = 'weizen' | 'kolsch' | 'alt' | 'stout' | 'mug' | 'goblet' | 'wine' | 'tulip' | 'pils';

export const beerTypes: TypeOption[] = [
  {
    id: 'All types',
    label: 'All types',
    accent: '#e0a23c',
    description: 'Every style in one place, sorted by the flavours you care about.',
  },
  {
    id: 'Lager',
    label: 'Lager',
    accent: '#e6b34a',
    description: 'Clean, crisp and balanced, with a smooth refreshing finish.',
  },
  {
    id: 'IPA',
    label: 'IPA',
    accent: '#d98b2b',
    description: 'Hop-forward: citrusy, resinous, floral or proudly bitter.',
  },
  {
    id: 'Stout',
    label: 'Stout',
    accent: '#8a5a3b',
    description: 'Dark and full-bodied, with roasted coffee, cocoa or caramel.',
  },
  {
    id: 'Sour & wild',
    label: 'Sour & wild',
    accent: '#c9614f',
    description: 'Bright, tart and lively, often led by fruit or a gentle funk.',
  },
  {
    id: 'Wheat beer',
    label: 'Wheat beer',
    accent: '#dcb551',
    description: 'Soft and rounded, lightly fruity or softly spiced.',
  },
  {
    id: 'Saison',
    label: 'Saison',
    accent: '#b6a447',
    description: 'Dry farmhouse ale with peppery spice, fruit and a sparkling finish.',
  },
];

export const selectableTypes = beerTypes.filter((type) => type.id !== 'All types');

export const flavors: Flavor[] = [
  { id: 'Carbonated', hint: 'lively bubbles', accent: '#8fc2c9' },
  { id: 'Bitter', hint: 'firm, drying edge', accent: '#c97f3a' },
  { id: 'Sweet', hint: 'soft sugar or honey', accent: '#e0b96b' },
  { id: 'Roasted', hint: 'coffee, toast, cocoa', accent: '#8a5a3b' },
  { id: 'Fruity', hint: 'berry, stone fruit, tropical', accent: '#d3697a' },
  { id: 'Hoppy', hint: 'leafy, floral, resinous', accent: '#7fa662' },
  { id: 'Malty', hint: 'bread, biscuit, cereal', accent: '#d5a24a' },
  { id: 'Mild', hint: 'gentle and easy-going', accent: '#a9b89b' },
  { id: 'Citrusy', hint: 'zest and bright peel', accent: '#e5c451' },
  { id: 'Spiced', hint: 'pepper, clove, coriander', accent: '#b98a55' },
  { id: 'Sour', hint: 'tangy and tart', accent: '#cf6a55' },
  { id: 'Dry', hint: 'clean, snappy finish', accent: '#a8b6a0' },
];

export const flavorAxes: FlavorAxis[] = [
  { id: 'Malt', flavors: ['Malty', 'Sweet'] },
  { id: 'Hops', flavors: ['Hoppy', 'Bitter'] },
  { id: 'Fruit', flavors: ['Fruity', 'Citrusy'] },
  { id: 'Roast', flavors: ['Roasted'] },
  { id: 'Tart', flavors: ['Sour'] },
  { id: 'Fresh', flavors: ['Carbonated', 'Dry', 'Mild', 'Spiced'] },
];

export const seedBeers: Beer[] = [
  {
    id: 'seed-1',
    name: 'Zwickel No. 5',
    type: 'Lager',
    style: 'Kellerbier',
    score: 4.7,
    reviews: 48,
    accent: '#d9a02f',
    flavors: ['Malty', 'Mild', 'Hoppy'],
    description: 'A soft, unfiltered lager with a fresh bread centre and a gentle herb-like lift.',
  },
  {
    id: 'seed-2',
    name: 'Night Shift',
    type: 'Stout',
    style: 'Oatmeal Stout',
    score: 4.5,
    reviews: 31,
    accent: '#7b5138',
    flavors: ['Roasted', 'Malty', 'Mild'],
    description: 'Dark and silken, bringing roasted coffee and cocoa together without sharpness.',
  },
  {
    id: 'seed-3',
    name: 'Daylight Radio',
    type: 'IPA',
    style: 'West Coast IPA',
    score: 4.3,
    reviews: 27,
    accent: '#d2912c',
    flavors: ['Hoppy', 'Bitter', 'Citrusy'],
    description: 'Clear citrus and pine-like hops framed by a dry, assertive bitter finish.',
  },
  {
    id: 'seed-4',
    name: 'Cherry Current',
    type: 'Sour & wild',
    style: 'Flanders Red',
    score: 4.4,
    reviews: 19,
    accent: '#b75a4b',
    flavors: ['Sour', 'Fruity', 'Dry'],
    description: 'A tart, cherry-led pour that stays bright and finishes with a woody dryness.',
  },
  {
    id: 'seed-5',
    name: 'Helles Belles',
    type: 'Lager',
    style: 'Helles',
    score: 4.6,
    reviews: 64,
    accent: '#dcae3c',
    flavors: ['Malty', 'Mild', 'Carbonated'],
    description: 'Pale, quietly sweet and gently sparkling with a clean biscuit backbone.',
  },
  {
    id: 'seed-6',
    name: 'Greenhouse',
    type: 'Saison',
    style: 'Farmhouse Ale',
    score: 4.2,
    reviews: 16,
    accent: '#a99a3f',
    flavors: ['Spiced', 'Fruity', 'Dry'],
    description: 'A bright farmhouse pour: soft fruit, peppery spice and a lively dry finish.',
  },
];

const DAY = 24 * 60 * 60 * 1000;

export function seedTastings(): Tasting[] {
  const now = Date.now();
  return [
    {
      id: 'seed-t1',
      name: 'Weihenstephaner Helles',
      brewery: 'Weihenstephan',
      logo: null,
      type: 'Lager',
      style: 'Helles',
      score: 4.7,
      flavors: ['Malty', 'Mild', 'Carbonated'],
      notes: 'Soft bread and a clean, gentle finish. Easy to come back to.',
      createdAt: now - 2 * 3600_000,
      seed: true,
    },
    {
      id: 'seed-t2',
      name: 'Köstritzer Schwarzbier',
      brewery: 'Köstritzer',
      logo: '/brewery-logos/k-stritzer.png',
      type: 'Lager',
      style: 'Schwarzbier',
      score: 4.4,
      flavors: ['Roasted', 'Malty', 'Dry'],
      notes: 'Roasted malt and dark chocolate, beautifully smooth.',
      createdAt: now - 3 * DAY,
      seed: true,
    },
    {
      id: 'seed-t3',
      name: 'Augustiner Lagerbier Hell',
      brewery: 'Augustiner-Bräu',
      logo: '/brewery-logos/augustiner-br-u.png',
      type: 'Lager',
      style: 'Helles',
      score: 4.8,
      flavors: ['Malty', 'Mild', 'Carbonated'],
      notes: 'Bready, gentle and quietly sweet — a benchmark hell.',
      createdAt: now - 6 * DAY,
      seed: true,
    },
    {
      id: 'seed-t4',
      name: 'Rothaus Tannenzäpfle',
      brewery: 'Rothaus',
      logo: '/brewery-logos/rothaus.png',
      type: 'Lager',
      style: 'Pils',
      score: 4.5,
      flavors: ['Hoppy', 'Bitter', 'Dry'],
      notes: 'Herbal hops and a crisp, dry Black Forest finish.',
      createdAt: now - 9 * DAY,
      seed: true,
    },
    {
      id: 'seed-t5',
      name: 'Veltins Pilsener',
      brewery: 'Veltins',
      logo: '/brewery-logos/veltins.png',
      type: 'Lager',
      style: 'Pils',
      score: 4.4,
      flavors: ['Hoppy', 'Bitter', 'Dry'],
      notes: 'Clean, bitter and sparkling with a dry snap.',
      createdAt: now - 14 * DAY,
      seed: true,
    },
  ];
}

export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(timestamp);
}

export function relativeDay(timestamp: number): string {
  const days = Math.floor((Date.now() - timestamp) / DAY);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return formatDate(timestamp);
}

export function typeAccent(type: string): string {
  return beerTypes.find((item) => item.id === type)?.accent || '#e0a23c';
}

export function glassFor(beer: Pick<Beer, 'style' | 'type'>): GlassKind {
  const style = (beer.style || '').toLowerCase();
  const type = beer.type || '';
  if (style.includes('weiss') || style.includes('weizen') || type === 'Wheat beer') return 'weizen';
  if (style.includes('kölsch')) return 'kolsch';
  if (style.includes('altbier')) return 'alt';
  if (style.includes('stout')) return 'stout';
  if (style.includes('rauch') || style.includes('export') || style.includes('märzen')) return 'mug';
  if (
    style.includes('doppelbock') ||
    style.includes('bock') ||
    style.includes('dunkel') ||
    style.includes('schwarz')
  )
    return 'goblet';
  if (type === 'Sour & wild') return 'wine';
  if (type === 'IPA' || type === 'Saison') return 'tulip';
  return 'pils';
}

export function distanceKm(a: GeoPoint, b: GeoPoint): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function flavorAccent(flavor: string): string {
  return flavors.find((item) => item.id === flavor)?.accent || '#a8b6a0';
}

export function profileFromFlavors(flavorList: string[]): { id: string; value: number }[] {
  return flavorAxes.map((axis) => ({
    id: axis.id,
    value: axis.flavors.some((flavor) => flavorList.includes(flavor)) ? 1 : 0,
  }));
}
