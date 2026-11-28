/** Small formatters for the optional details on a tasting. */

export function formatPrice(value?: number | null): string {
  if (value === null || value === undefined || !Number.isFinite(value) || value < 0) return '';
  return `€${value.toFixed(2)}`;
}

export function formatAbv(value?: number | null): string {
  if (value === null || value === undefined || !Number.isFinite(value) || value < 0) return '';
  return `${value.toFixed(1)}% ABV`;
}
