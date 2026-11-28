<script lang="ts">
  import Discover from '#lib/views/Discover.svelte';
  import { state as store } from '#lib/store/tastings.svelte.ts';
  import { ui, openFormWith } from '#lib/store/ui.svelte.ts';
  import { prefillFromBeer } from '#lib/data/prefill.ts';
</script>

<svelte:head>
  <title>Discover — Hopnote</title>
  <meta name="description" content="Explore beers by style, flavour and brewery." />
</svelte:head>

<Discover
  {store}
  bind:search={ui.search}
  onOpenBeer={(beer) => (ui.selectedBeer = beer)}
  onNew={() => (ui.showForm = true)}
  onLog={(beer) => openFormWith(prefillFromBeer(beer))}
/>
