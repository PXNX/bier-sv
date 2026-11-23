export type ViewId = 'overview' | 'discover' | 'journal' | 'saved' | 'insights';

export type BeerType = 'Lager' | 'IPA' | 'Stout' | 'Sour & wild' | 'Wheat beer' | 'Saison';

export type TypeOption = {
  id: BeerType | 'All types';
  label: string;
  accent: string;
  description: string;
};

export type Flavor = {
  id: string;
  hint: string;
  accent: string;
};

export type FlavorAxis = {
  id: string;
  flavors: string[];
};

/** A beer as shown on the Discover board. */
export type Beer = {
  id: string;
  name: string;
  brewery?: string;
  logo?: string | null;
  city?: string;
  type: string;
  style: string;
  score: number;
  reviews: number;
  accent: string;
  flavors: string[];
  description?: string;
  coords?: [number, number];
  seed?: boolean;
  userMade?: boolean;
  ean?: string | null;
  image?: string | null;
  quantity?: string;
};

/** A journal entry — the "review" of a beer. */
export type Tasting = {
  id: string;
  name: string;
  brewery: string;
  logo: string | null;
  ean?: string | null;
  image?: string | null;
  quantity?: string;
  city?: string;
  coords?: [number, number];
  type: string;
  style: string;
  score: number;
  accent?: string;
  reviews?: number;
  description?: string;
  flavors: string[];
  notes: string;
  createdAt: number;
  seed: boolean;
};

export type TastingPrefill = Omit<TastingDraft, 'score' | 'flavors'>;

export type TastingDraft = {
  name: string;
  type: string;
  score: number;
  flavors: string[];
  notes: string;
  ean?: string | null;
  brewery?: string;
  image?: string | null;
  quantity?: string;
};

export type OpenFoodFactsProduct = {
  code: string;
  name: string;
  brand: string;
  image: string | null;
  quantity: string;
  categories: string;
  countries: string;
};

export type NotificationPrefs = {
  enabled: boolean;
  saved: boolean;
  scans: boolean;
  reminder: boolean;
  reminderTime: string;
};

export type GeoPoint = { lat: number; lon: number };
