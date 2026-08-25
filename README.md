# Hopnote

**Hopnote** is a responsive beer tasting and rating journal built as a themed counterpart to the referenced tasting-discovery experience. It focuses on thoughtful tasting notes, memorable pours, and a calm editorial interface rather than generic beer listings.

## Included experience

| Area | What it provides |
| --- | --- |
| Discovery board | Searchable and style-filtered beer cards with ratings, beer metadata, aroma notes, and detailed tasting views. |
| Tasting journal | A personal recent-tastings panel that frames ratings as a growing record. |
| New tasting workflow | An accessible modal form for adding a beer, brewery, style, ABV, score, and personal notes. Newly added beers appear immediately on the board. |
| Saved pours | Client-side favorite toggling, persisted with `localStorage`. |
| Responsive design | A refined desktop layout that reflows cleanly for phones and tablets. |

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL displayed by Vite. Create a production bundle with:

```bash
npm run build
```

## Stack

This repository uses **Svelte** and **Vite**. The current version deliberately keeps its records client-side so it can be deployed as a lightweight static app; the UI is structured so a future persistent API can replace the sample data without changing the interaction model.
