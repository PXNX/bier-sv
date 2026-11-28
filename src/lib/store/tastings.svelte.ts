import type { Tasting, TastingDraft } from '../types';
import { flavorAxes, flavors, seedBeers, seedTastings, typeAccent } from '../data/beers.ts';
import { germanBeers } from '../data/germanBeers.ts';

const TASTINGS_KEY = 'hopnote.tastings.v1';
const FAVORITES_KEY = 'hopnote.favorites.v1';

function read<T>(key: string, fallback: T): T {
  if (typeof localStorage === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private browsing or full storage — keep the in-memory copy */
  }
}

export class HopnoteState {
  tastings = $state<Tasting[]>(read(TASTINGS_KEY, seedTastings()));
  favorites = $state<string[]>(read(FAVORITES_KEY, []));
  private lastDeleted: { tasting: Tasting; index: number; favorite: boolean } | null = null;

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

  #mostCommon(values: string[]): string {
    const counts = new Map<string, number>();
    for (const value of values) counts.set(value, (counts.get(value) || 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
  }

  addTasting(data: TastingDraft): Tasting {
    const name = (data.name || '').trim();
    const match = this.catalog.find((beer) => beer.name.toLowerCase() === name.toLowerCase());
    const tasting = {
      id: `t-${Date.now()}`,
      name: name || `Untitled ${data.type}`,
      brewery: data.brewery || match?.brewery || '',
      logo: match?.logo || null,
      ean: data.ean || null,
      image: data.image || null,
      quantity: data.quantity || '',
      price: data.price ?? null,
      abv: data.abv ?? null,
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

  updateTasting(id: string, data: TastingDraft): void {
    this.tastings = this.tastings.map((tasting) =>
      tasting.id === id
        ? {
            ...tasting,
            name: (data.name || '').trim() || tasting.name,
            type: data.type,
            score: Number(data.score),
            flavors: [...data.flavors],
            notes: data.notes.trim(),
            ean: data.ean || null,
            brewery: data.brewery || tasting.brewery,
            image: data.image || null,
            quantity: data.quantity || '',
            price: data.price ?? null,
            abv: data.abv ?? null,
          }
        : tasting,
    );
    write(TASTINGS_KEY, this.tastings);
  }

  removeTasting(id: string): Tasting | null {
    const index = this.tastings.findIndex((tasting) => tasting.id === id);
    if (index < 0) return null;
    const tasting = this.tastings[index];
    this.lastDeleted = { tasting, index, favorite: this.favorites.includes(id) };
    this.tastings = this.tastings.filter((entry) => entry.id !== id);
    write(TASTINGS_KEY, this.tastings);
    this.favorites = this.favorites.filter((favorite) => favorite !== id);
    write(FAVORITES_KEY, this.favorites);
    return tasting;
  }

  undoDelete(): void {
    if (!this.lastDeleted) return;
    const { tasting, index, favorite } = this.lastDeleted;
    this.tastings = [...this.tastings.slice(0, index), tasting, ...this.tastings.slice(index)];
    write(TASTINGS_KEY, this.tastings);
    if (favorite && !this.favorites.includes(tasting.id)) {
      this.favorites = [...this.favorites, tasting.id];
      write(FAVORITES_KEY, this.favorites);
    }
    this.lastDeleted = null;
  }

  toggleFavorite(id: string): void {
    this.favorites = this.favorites.includes(id)
      ? this.favorites.filter((favorite) => favorite !== id)
      : [...this.favorites, id];
    write(FAVORITES_KEY, this.favorites);
  }
}

export const state = new HopnoteState();
