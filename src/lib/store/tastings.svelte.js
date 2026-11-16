import { flavorAxes, flavors, seedBeers, seedTastings, typeAccent } from '../data/beers.js';
import { germanBeers } from '../data/germanBeers.js';

const TASTINGS_KEY = 'hopnote.tastings.v1';
const FAVORITES_KEY = 'hopnote.favorites.v1';

function read(key, fallback) {
  if (typeof localStorage === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private browsing or full storage — keep the in-memory copy */
  }
}

export class HopnoteState {
  tastings = $state(read(TASTINGS_KEY, seedTastings()));
  favorites = $state(read(FAVORITES_KEY, []));

  catalog = $derived([
    ...this.tastings
      .filter((tasting) => !tasting.seed)
      .map((tasting) => ({
        ...tasting,
        accent: typeAccent(tasting.type),
        reviews: 1,
        userMade: true,
        description: tasting.notes || `A ${tasting.type.toLowerCase()} you logged by flavour.`,
      })),
    ...seedBeers,
    ...germanBeers,
  ]);

  avgScore = $derived(
    this.tastings.length
      ? this.tastings.reduce((sum, tasting) => sum + Number(tasting.score), 0) / this.tastings.length
      : 0,
  );

  flavorCounts = $derived(
    flavors
      .map((flavor) => ({
        id: flavor.id,
        count: this.tastings.filter((tasting) => tasting.flavors.includes(flavor.id)).length,
      }))
      .sort((a, b) => b.count - a.count),
  );

  axisProfile = $derived(
    flavorAxes.map((axis) => ({
      id: axis.id,
      value: this.tastings.length
        ? this.tastings.filter((tasting) => axis.flavors.some((flavor) => tasting.flavors.includes(flavor)))
            .length / this.tastings.length
        : 0,
    })),
  );

  topStyle = $derived(this.#mostCommon(this.tastings.map((tasting) => tasting.type)));
  topFlavor = $derived(this.flavorCounts[0]?.id || '—');

  #mostCommon(values) {
    const counts = new Map();
    for (const value of values) counts.set(value, (counts.get(value) || 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
  }

  addTasting(data) {
    const match = this.catalog.find((beer) => beer.name.toLowerCase() === data.name.trim().toLowerCase());
    const tasting = {
      id: `t-${Date.now()}`,
      name: data.name.trim() || `Untitled ${data.type}`,
      brewery: match?.brewery || '',
      logo: match?.logo || null,
      type: data.type,
      style: data.type,
      score: Number(data.score),
      flavors: [...data.flavors],
      notes: data.notes.trim(),
      createdAt: Date.now(),
      seed: false,
    };
    this.tastings = [tasting, ...this.tastings];
    write(TASTINGS_KEY, this.tastings);
    return tasting;
  }

  removeTasting(id) {
    this.tastings = this.tastings.filter((tasting) => tasting.id !== id);
    write(TASTINGS_KEY, this.tastings);
    this.favorites = this.favorites.filter((favorite) => favorite !== id);
    write(FAVORITES_KEY, this.favorites);
  }

  toggleFavorite(id) {
    this.favorites = this.favorites.includes(id)
      ? this.favorites.filter((favorite) => favorite !== id)
      : [...this.favorites, id];
    write(FAVORITES_KEY, this.favorites);
  }
}

export const state = new HopnoteState();
