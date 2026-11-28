import type { Beer, Tasting, TastingPrefill } from '../types';

export const ui = $state({
  search: '',
  showForm: false,
  showScanner: false,
  showNotifications: false,
  scanPrefill: null as TastingPrefill | null,
  celebrate: null as Tasting | null,
  selectedBeer: null as Beer | Tasting | null,
  toast: '',
});

let toastTimer: ReturnType<typeof setTimeout> | undefined;

export function openForm(): void {
  ui.selectedBeer = null;
  ui.scanPrefill = null;
  ui.showForm = true;
}

export function closeForm(): void {
  ui.showForm = false;
  ui.scanPrefill = null;
}

/** Open the form with details already filled in from a card or journal entry. */
export function openFormWith(prefill: TastingPrefill): void {
  ui.selectedBeer = null;
  ui.scanPrefill = prefill;
  ui.showForm = true;
}

export function openScanner(): void {
  ui.showScanner = true;
}

export function closeScanner(): void {
  ui.showScanner = false;
}

export function openNotifications(): void {
  ui.showNotifications = true;
}

export function closeNotifications(): void {
  ui.showNotifications = false;
}

export function celebratePour(beer: Tasting): void {
  ui.celebrate = beer;
}

export function endPour(): void {
  ui.celebrate = null;
}

export function openBeer(beer: Beer | Tasting): void {
  ui.selectedBeer = beer;
}

export function closeBeer(): void {
  ui.selectedBeer = null;
}

export function notify(message: string): void {
  ui.toast = message;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (ui.toast = ''), 3200);
}
