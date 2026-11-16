# Working in this repository

## Concurrent sessions

Other Claude sessions may be working in this same checkout at the same time and may edit the same files you are editing.

- Only commit your own changes. Stage files (or hunks) explicitly, e.g. `git add <file>` or `git add -p`, never `git add -A` / `git add .` / `git commit -a`.
- Before committing, review `git diff --staged` and make sure every staged line is yours. If a file contains both your edits and someone else's, stage only your hunks.
- Do not revert, reformat, stash, or "clean up" changes you did not make (no `git stash`, `git checkout -- <file>`, `git restore`, or `git reset --hard` on files touched by others).
- If an unexpected change blocks your work (e.g. breaks the build), mention it to the user instead of fixing or discarding it yourself.

## Where things live

This is **Hopnote**, a static, client-side beer tasting journal built with SvelteKit 3 (Svelte 5 runes) and Vite 8. There is no backend: all tastings, ratings, and saved pours live in the browser (`localStorage`). The app is client-rendered (`ssr = false`) and prerendered with `@sveltejs/adapter-static`.

| Area                  | Location                                                       | Notes                                                                           |
| --------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Routes & app shell    | `src/routes/`                                                  | File-based routes; `+layout.svelte` owns the shell, dialogs and install prompt. |
| Error pages           | `src/routes/+error.svelte`                                     | Themed 404 / error page with a reset action.                                    |
| Views                 | `src/lib/views/*.svelte`                                       | Overview, Discover, Journal, Saved, Insights.                                   |
| Shared UI             | `src/lib/components/*.svelte`                                  | Icons, glassware, brewery mark, beer card, dialogs and detail drawer.           |
| Charts                | `src/lib/components/charts/*.svelte`                           | Hand-rolled SVG radar and donut charts.                                         |
| State                 | `src/lib/store/`                                               | Tastings + localStorage persistence, and transient UI state.                    |
| Static data & helpers | `src/lib/data/`                                                | Beer types, flavours, German brewery catalogue, helpers.                        |
| PWA                   | `src/lib/pwa/`                                                 | Install prompt logic and banner component; assets in `static/`.                 |
| Global styles / theme | `src/lib/styles/theme.css`                                     | Design tokens, layout, components.                                              |
| Entry/config          | `src/app.html`, `vite.config.js`                               | Document shell, SvelteKit plugin and static adapter configuration.              |
| PWA assets            | `static/manifest.webmanifest`, `static/sw.js`, `static/icons/` | Manifest, offline cache shell, icons.                                           |

## Conventions

- Keep everything on-device. Do not add cloud APIs, analytics, or trackers.
- Pure helpers go in `.js` files; reactive state (anything using runes) in `.svelte.js` files.
- Persist user data through the single state module, never by touching `localStorage` from a component.
- User-facing copy is written in plain English in the components; keep the calm, editorial tone.
- `bun install`, `bun run build` and `bun run dev` are the toolchain commands (npm is not installed on this host). TypeScript is pinned at `6.0.3`.

## Committing

- Commit your own changes yourself, feature by feature: as soon as one self-contained piece of work is done (a new module, a view, a wired-up UI, a PWA piece), commit it before starting the next. Do not collect a whole task into one big commit at the end, and do not leave finished work uncommitted.
- Each commit should build on its own and have a message that says what that feature does, prefixed `feat(<mode>)`, `fix(<mode>)`, `chore(<mode>)`, `docs(<mode>)` or `refactor(<mode>)` (see `agents.md`).
- The rules from "Concurrent sessions" still apply to every one of these commits.

## Git workflow

- Commit directly onto `main`, feature by feature. Do not push after every commit: the commits stay local until the user asks for a push. Do not create feature branches or pull requests unless asked.
- Only commit your own changes. Other work may be in progress in the same working tree, so stage files explicitly and leave unrelated changes alone.
- The full agent rules are in `agents.md`.
