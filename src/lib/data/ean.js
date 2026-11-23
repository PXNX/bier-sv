// Barcode helpers and a read-only Open Food Facts lookup.
// Pure functions only — no reactive state, no storage, no UI.

const PRODUCT_FIELDS = [
  'code',
  'product_name',
  'product_name_en',
  'product_name_de',
  'brands',
  'image_front_url',
  'image_url',
  'quantity',
  'categories',
  'countries',
].join(',');

const OFF_ENDPOINT = 'https://world.openfoodfacts.org/api/v2/product';

/** Strip spaces, dashes and anything else that is not a digit. */
export function normalizeEan(value) {
  return String(value ?? '').replace(/\D/g, '');
}

/** Validate the GS1 check digit of an EAN-8, UPC-A/EAN-12, EAN-13 or GTIN-14. */
export function isValidGtin(value) {
  const code = normalizeEan(value);
  if (![8, 12, 13, 14].includes(code.length)) return false;

  const digits = code.split('').map(Number);
  const check = digits.pop();
  let sum = 0;
  let weight = 3;
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    sum += digits[index] * weight;
    weight = weight === 3 ? 1 : 3;
  }
  return (10 - (sum % 10)) % 10 === check;
}

function firstBrand(value) {
  return String(value || '')
    .split(/[,/]/)[0]
    .trim();
}

function productName(product) {
  return (product.product_name_de || product.product_name || product.product_name_en || '').trim();
}

/**
 * Look up a barcode in Open Food Facts. The API is public, read-only and CORS-enabled,
 * so this runs directly in the browser without a backend. Returns `null` when the
 * product is unknown; throws on network or parse failures.
 */
export async function lookupOpenFoodFacts(code, { timeout = 8000, signal } = {}) {
  const cleanCode = normalizeEan(code);
  if (!cleanCode) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const relayAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener('abort', relayAbort, { once: true });
  }

  try {
    const response = await fetch(
      `${OFF_ENDPOINT}/${encodeURIComponent(cleanCode)}.json?fields=${PRODUCT_FIELDS}`,
      { signal: controller.signal, headers: { Accept: 'application/json' } },
    );
    if (!response.ok) throw new Error(`Open Food Facts returned ${response.status}`);
    const payload = await response.json();
    if (payload.status !== 1 || !payload.product) return null;

    const product = payload.product;
    return {
      code: String(payload.code || cleanCode),
      name: productName(product),
      brand: firstBrand(product.brands),
      image: product.image_front_url || product.image_url || null,
      quantity: String(product.quantity || '').trim(),
      categories: String(product.categories || '').trim(),
      countries: String(product.countries || '').trim(),
    };
  } finally {
    clearTimeout(timer);
    if (signal) signal.removeEventListener('abort', relayAbort);
  }
}

/** Best-effort guess of a Hopnote beer type from Open Food Facts categories and name. */
export function inferBeerType(product = {}) {
  const text = `${product.name || ''} ${product.categories || ''} ${product.brand || ''}`.toLowerCase();
  if (/\bipa\b|india pale|pale ale/.test(text)) return 'IPA';
  if (/stout|porter|barley ?wine|imperial/.test(text)) return 'Stout';
  if (/sauer|sour|lambic|gose|berliner|wild/.test(text)) return 'Sour & wild';
  if (/weizen|wheat|weiß|weiss|hefeweizen|witbier/.test(text)) return 'Wheat beer';
  if (/saison|farmhouse|bière de garde/.test(text)) return 'Saison';
  return 'Lager';
}

/** A soft sanity check — never blocks a review, just informs the scan dialog. */
export function looksLikeBeer(product) {
  const text = `${product?.name || ''} ${product?.categories || ''}`.toLowerCase();
  return /beer|bier|ale|lager|pils|stout|ipa|weizen|weiss|weiß|saison|porter/.test(text);
}

/** Turn a lookup result into the draft shape used by the new-tasting form. */
export function productToDraft(product, code) {
  return {
    name: product?.name || '',
    type: inferBeerType(product || {}),
    brewery: product?.brand || '',
    ean: normalizeEan(code),
    image: product?.image || null,
    quantity: product?.quantity || '',
    notes: '',
  };
}
