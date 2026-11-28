import type { Beer, Tasting, TastingPrefill } from '../types';

/** Build a form prefill from a beer on the board or a tasting in the journal. */
export function prefillFromBeer(beer: Beer | Tasting): TastingPrefill {
  return {
    name: beer.name,
    type: beer.type,
    brewery: beer.brewery || '',
    ean: beer.ean ?? null,
    image: beer.image ?? null,
    quantity: beer.quantity || '',
    notes: 'notes' in beer ? beer.notes : beer.description || '',
    flavors: [...beer.flavors],
  };
}
