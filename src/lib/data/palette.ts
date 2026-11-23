export type BeerPalette = {
  liquid: string;
  foam: string;
  glow: string;
};

/** Style-aware colours so a stout, a wheat beer and a sour never look alike. */
export function beerPalette(beer: { style?: string; type: string; accent?: string | null }): BeerPalette {
  const style = (beer.style || '').toLowerCase();
  const type = beer.type || '';

  if (/stout|porter|schwarz|dunkel|imperial/.test(style) || type === 'Stout') {
    return { liquid: '#633b25', foam: '#e6d4b2', glow: '#8a5a3b' };
  }
  if (/weizen|weiss|weiß|wheat|wit/.test(style) || type === 'Wheat beer') {
    return { liquid: '#edbe5d', foam: '#fff4dc', glow: '#dcb551' };
  }
  if (/sour|sauer|gose|berliner|lambic|geuze/.test(style) || type === 'Sour & wild') {
    return { liquid: '#df9276', foam: '#ffe8d9', glow: '#c9614f' };
  }
  if (/ipa|pale ale|hop/.test(style) || type === 'IPA') {
    return { liquid: '#d98b2b', foam: '#f8e6bb', glow: '#d98b2b' };
  }
  if (/saison|farmhouse|bière de garde/.test(style) || type === 'Saison') {
    return { liquid: '#d8c05f', foam: '#fff1cd', glow: '#b6a447' };
  }
  if (/pils|helles|keller|lager|kölsch|export/.test(style) || type === 'Lager') {
    return { liquid: '#e6b34a', foam: '#fbf0d2', glow: '#e6b34a' };
  }
  return { liquid: beer.accent || '#e0a23c', foam: '#fbf0d2', glow: beer.accent || '#e0a23c' };
}
