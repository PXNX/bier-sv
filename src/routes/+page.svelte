<script lang="ts">
  import Overview from '#lib/views/Overview.svelte';
  import { state as store } from '#lib/store/tastings.svelte.ts';
  import { navigate } from '#lib/navigation.ts';
  import { ui, openFormWith } from '#lib/store/ui.svelte.ts';
  import { prefillFromBeer } from '#lib/data/prefill.ts';
</script>

<svelte:head>
  <title>Hopnote — Your Beer Tasting Journal</title>
  <meta
    name="description"
    content="Find your flavour, note every pour, and keep a personal atlas of the beers worth remembering."
  />
</svelte:head>

<Overview
  {store}
  onNavigate={navigate}
  onNew={() => (ui.showForm = true)}
  onOpenBeer={(beer) => (ui.selectedBeer = beer)}
  onLogAgain={(tasting) => openFormWith({ ...prefillFromBeer(tasting), score: tasting.score })}
/>
