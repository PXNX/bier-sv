import type { Beer, Tasting, TastingPrefill } from '../types';

type ToastAction = { label: string; run: () => void };

export const ui = $state({
  search: '',
  showForm: false,
  showScanner: false,
  showNotifications: false,
  scanPrefill: null as TastingPrefill | null,
  editingId: null as string | null,
  celebrate: null as Tasting | null,
  selectedBeer: null as Beer | Tasting | null,
  toast: '',
  toastAction: null as ToastAction | null,
});

let toastTimer: ReturnType<typeof setTimeout> | undefined;

export function openForm(): void {
  ui.selectedBeer = null;
  ui.scanPrefill = null;
  ui.editingId = null;
  ui.showForm = true;
}

export function closeForm(): void {
  ui.showForm = false;
  ui.scanPrefill = null;
  ui.editingId = null;
}

/** Open the form with details already filled in from a card or journal entry. */
export function openFormWith(prefill: TastingPrefill): void {
  ui.selectedBeer = null;
  ui.scanPrefill = prefill;
  ui.editingId = null;
  ui.showForm = true;
}

/** Open the form over an existing tasting so its details can be corrected. */
export function openEdit(tasting: Tasting): void {
  ui.selectedBeer = null;
  ui.editingId = tasting.id;
  ui.scanPrefill = {
    name: tasting.name,
    type: tasting.type,
    score: tasting.score,
    flavors: [...tasting.flavors],
    notes: tasting.notes,
    ean: tasting.ean || null,
    brewery: tasting.brewery,
    image: tasting.image || null,
    quantity: tasting.quantity || '',
    price: tasting.price ?? null,
    abv: tasting.abv ?? null,
  };
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

export function notify(message: string, action: ToastAction | null = null): void {
  ui.toast = message;
  ui.toastAction = action;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(clearToast, action ? 6000 : 3200);
}

export function clearToast(): void {
  ui.toast = '';
  ui.toastAction = null;
  clearTimeout(toastTimer);
}
