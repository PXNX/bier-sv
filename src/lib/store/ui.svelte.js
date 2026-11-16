export const ui = $state({
  search: '',
  showForm: false,
  selectedBeer: null,
  toast: '',
});

let toastTimer;

export function openForm() {
  ui.selectedBeer = null;
  ui.showForm = true;
}

export function closeForm() {
  ui.showForm = false;
}

export function openBeer(beer) {
  ui.selectedBeer = beer;
}

export function closeBeer() {
  ui.selectedBeer = null;
}

export function notify(message) {
  ui.toast = message;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (ui.toast = ''), 3200);
}
