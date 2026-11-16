# Hopnote

**Hopnote** is a calm, flavour-first beer tasting journal. It is a static, client-side app: every tasting, rating and saved pour lives in the browser, so there is no backend to run and no account to create.

## What's inside

| View | What it does |
| --- | --- |
| Overview | A personal dashboard: tasting count, average score, favourite style and signature flavour, a radar chart of your flavour fingerprint, and recent pours. |
| Discover | A searchable board of beer styles and flavours. Filter by beer type, combine up to twelve flavour descriptors, sort the results, save favourites, and open a detail drawer with a flavour profile. |
| Journal | A searchable, sortable record of every tasting, with notes and the option to delete an entry. |
| Saved | Your shortlist of saved pours, always one tap away. |
| Insights | Charts built from your journal: flavour frequency, style distribution, score spread and common flavour pairings. |

New tastings are added through a focused dialog: pick a style, choose the flavours you noticed, set an optional score and write an optional note. Data persists in `localStorage` and is also reflected across the dashboard, charts and discovery board.

## PWA

Hopnote ships as an installable progressive web app:

- `public/manifest.webmanifest` with app icons and standalone display.
- `public/sw.js`, an offline app-shell cache with stale-while-revalidate for assets.
- An **Install** banner that appears when the browser fires `beforeinstallprompt`; it can be dismissed and won't ask again.

The service worker is only registered in production builds, so local development stays live-reloaded.

## Run locally

This host uses **Bun** (npm is not installed):

```bash
bun install
bun run dev
```

Open the URL printed by Vite. To create a production bundle:

```bash
bun run build
bun run preview
```

## Project layout

Code is grouped by concern under `src/lib/`:

```text
src/
├─ App.svelte              app shell, navigation and view switching
├─ main.js                 entry point, service-worker registration
└─ lib/
   ├─ data/beers.js        beer types, flavours, seed data, helpers
   ├─ store/tastings.svelte.js   reactive state and localStorage persistence
   ├─ pwa/                 install prompt logic and banner component
   ├─ components/          shared UI (icons, cards, dialogs, drawer)
   │  └─ charts/           hand-rolled SVG radar and donut charts
   ├─ views/               one component per screen
   └─ styles/theme.css     design tokens, layout and component styles
```

## Stack

Svelte 5 (runes) + Vite. TypeScript is pinned at `6.0.3` for editor tooling. Charts and icons are hand-rolled SVG — no chart or icon dependencies. Views are thin screens over a single state module; the beer card is shared between Discover and Saved.
