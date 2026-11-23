# Hopnote

**Hopnote** is a calm, flavour-first beer tasting journal. It is a static, client-side app: every tasting, rating and saved pour lives in the browser, so there is no backend to run and no account to create.

## What's inside

| View     | What it does                                                                                                                                                                                       |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Overview | A personal dashboard: tasting count, average score, favourite style and signature flavour, a radar chart of your flavour fingerprint, and recent pours.                                            |
| Discover | A searchable board of beer styles and flavours. Filter by beer type, combine up to twelve flavour descriptors, sort the results, save favourites, and open a detail drawer with a flavour profile. |
| Journal  | A searchable, sortable record of every tasting, with notes and the option to delete an entry.                                                                                                      |
| Saved    | Your shortlist of saved pours, always one tap away.                                                                                                                                                |
| Insights | Charts built from your journal: flavour frequency, style distribution, score spread and common flavour pairings.                                                                                   |

Each view has a real path — `/`, `/discover`, `/journal`, `/saved` and `/insights` — so links can be shared and pages survive a reload. Old `?view=` links are redirected to their matching path. Unknown paths show a themed 404, and a boundary around the views shows a themed error state if rendering fails; `public/404.html` and `public/500.html` are the matching static fallbacks.

New tastings are added through a focused dialog: pick a style, choose the flavours you noticed, set an optional score and write an optional note. You can also scan the EAN on a bottle or can — the **Scan** button in the top bar opens the camera (or a manual entry field where live scanning is unavailable), looks the code up in the public [Open Food Facts](https://world.openfoodfacts.org/) catalogue and prefills the beer name, brewery, style and product image. Unknown codes and offline lookups still work: the EAN is saved with the tasting and you fill in the rest yourself. No product data is ever sent anywhere — the lookup is a read-only GET, and your journal stays in `localStorage`. Data is reflected across the dashboard, charts and discovery board.

The Discover board also includes a catalogue of 200 real German breweries. Search by brewery or town, or turn on **Near me** to filter by distance from your device using its location (with a 25–250 km radius).

## PWA

Hopnote ships as an installable progressive web app:

- `static/manifest.webmanifest` with standard and maskable app icons, standalone display and shortcuts for **Log a tasting**, **Scan a bottle** and **Open journal**.
- `static/sw.js`, a versioned cache: the app shell is precached, hashed assets use stale-while-revalidate, and Open Food Facts lookups and bottle photos get their own bounded runtime cache so previously scanned beers still appear offline. Navigations fall back to the cached shell.
- An **Install** banner that appears when the browser fires `beforeinstallprompt`; it can be dismissed and won't ask again.
- A **bell** in the top bar opens notification settings. Notifications are scheduled on your device — there is no push server and no account. You can allow them, toggle saved-tasting and scan confirmations, and set a daily reminder. Where Chromium's periodic background sync is available, that reminder can also arrive while the app is closed.
- Saving a tasting plays a short pouring animation (with a reduced-motion fallback), so logging a beer feels like pouring one.

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

### Quality checks

Linting and formatting use Bun's built-in tools, configured in `bunfig.toml` (Svelte runes are declared as globals):

```bash
bun run lint       # bun lint
bun run lint:fix   # auto-fix lint issues
bun run fmt        # format the whole project
bun run fmt:check  # fail if anything is unformatted
```

## Deploying

Deployment is handled by Vercel and happens automatically on every push to `main` — there are no server-side steps or environment variables to configure.

`vercel.json` describes the deployment:

- **Build** — SvelteKit framework preset, `npm run build` as the build command, `build` as the output directory (npm is used on Vercel so the deploy does not depend on Bun being installed in its build image).
- **Routing** — SvelteKit handles the routes; `@sveltejs/adapter-static` prerenders every page and emits a `404.html` fallback for unknown paths.
- **PWA headers** — `sw.js` is served with `must-revalidate` and a root service-worker scope so updates are picked up; the web manifest is served as `application/manifest+json`.

To ship a change, push it to `main`. For a one-off preview from a local checkout, use `bunx vercel` and open the preview URL it prints.

## Project layout

Code is grouped by concern under `src/lib/`:

```text
src/
├─ app.html                document shell
├─ routes/
│  ├─ +layout.svelte       sidebar, top bar, dialogs, install prompt
│  ├─ +layout.js           prerender + client-only rendering
│  ├─ +page.svelte         Overview
│  ├─ discover/            Discover board
│  ├─ journal/             tasting journal
│  ├─ saved/               saved pours
│  ├─ insights/            analytics
│  └─ +error.svelte        themed 404 / error page
└─ lib/
   ├─ data/                beer types, flavours, brewery catalogue, helpers
   ├─ store/               reactive state, localStorage and UI state
   ├─ pwa/                 install prompt logic and banner component
   ├─ components/          shared UI (icons, glassware, cards, dialogs, drawer)
   │  └─ charts/           hand-rolled SVG radar and donut charts
   ├─ views/               one component per screen
   └─ styles/theme.css     design tokens, layout and component styles
```

Root-level config: `vite.config.js` (SvelteKit 3 plugin, static adapter, `$lib`-style `#lib` alias), `bunfig.toml` (lint globals + format rules) and `vercel.json` (deploy).

## Stack

SvelteKit 3 + Svelte 5 (runes) + Vite 8. The app is fully client-rendered and prerendered to static files, so there is no server at runtime. TypeScript is pinned at `6.0.3` for editor tooling. Charts, icons and glassware are hand-rolled SVG — no chart or icon dependencies. Route pages are thin wrappers over the view components and a shared state module.
