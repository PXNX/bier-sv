<script lang="ts">
  import Discover from '#lib/views/Discover.svelte';
  import { state as store } from '#lib/store/tastings.svelte.ts';
  import { ui } from '#lib/store/ui.svelte.ts';
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
/>
