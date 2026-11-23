export type RatingTone = {
  color: string;
  soft: string;
  label: string;
};

/** Colour and plain-English label for a 1–5 beer score. */
export function ratingTone(score: number): RatingTone {
  if (score >= 4.7) return { color: '#f6d489', soft: '#e0a23c', label: 'Exceptional' };
  if (score >= 4.3) return { color: '#ecbc65', soft: '#d29a3d', label: 'Excellent' };
  if (score >= 3.8) return { color: '#c2d59a', soft: '#9bb87f', label: 'Very good' };
  if (score >= 3.2) return { color: '#a8c2a4', soft: '#82a284', label: 'Solid' };
  return { color: '#96ada1', soft: '#769184', label: 'Sessionable' };
}

/** How full each of the five glasses in a rating should be, from 0 to 1. */
export function glassFills(score: number): number[] {
  return Array.from(
    { length: 5 },
    (_, index) => Math.round(Math.min(1, Math.max(0, score - index)) * 1000) / 1000,
  );
}
