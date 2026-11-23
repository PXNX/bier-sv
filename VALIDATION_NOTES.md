# Validation notes

## Build

`bun run build` completes cleanly with no Svelte compiler warnings. The production bundle includes the compiled HTML, CSS and JS plus the PWA assets (manifest, service worker and three icon sizes).

## Visual review

The redesigned app was rendered at desktop (1440×1050) and mobile (390×844) widths:

- **Overview** — greeting, four summary cards, flavour radar, recent pours and the quick-action strip all reflow correctly; the radar and its legend no longer overlap.
- **Discover** — type and flavour filters, search, sort and the three-column card grid render as intended; cards collapse to one column on phones.
- **Journal / Saved / Insights** — list rows, empty states, bar charts and the donut chart render without horizontal overflow.
- **Dialogs** — the add-tasting modal and the beer detail drawer are centred/right-anchored correctly, remain scrollable on short viewports, and close on backdrop click or Escape.

## Interaction smoke test

Driven against a running instance:

1. The discovery board shows six unique beers (sample journal entries are no longer duplicated on the board).
2. Saving a beer updates the heart state, writes `hopnote.favorites.v1`, and increments the Saved badge.
3. The add-tasting dialog opens from the header, accepts a name and two flavours, then saves: a confirmation toast appears, `hopnote.tastings.v1` gains an entry, and the new beer shows up in the journal.

## Barcode scanning

- `bun run test` covers EAN normalisation, GS1 check digits for EAN-8/UPC-A/EAN-13, category-to-style inference and the lookup-to-draft mapping (7 tests).
- The Open Food Facts v2 endpoint was checked directly: it returns product name, brand, image and quantity for a known EAN, and sends `Access-Control-Allow-Origin: *`, so the browser can call it without a proxy.
- `bun run build`, `bun run lint` and `bun run fmt:check` all pass with the scanner wired in.
- Camera capture uses `getUserMedia` with the rear camera and the native `BarcodeDetector` where available. Browsers without either fall back to manual EAN entry; camera permission errors and failed lookups both leave the manual path usable. Media tracks are stopped when the dialog closes.

## Progressive web app

The manifest declares standalone display, a theme colour and 192/512px icons (including a maskable variant). The service worker precaches the app shell, serves cached navigations offline and refreshes hashed assets in the background. Registration is production-only. The install banner listens for `beforeinstallprompt` and respects a persisted dismissal.
