<script>
  import Overview from '#lib/views/Overview.svelte';
  import { state as store } from '#lib/store/tastings.svelte.js';
  import { navigate } from '#lib/navigation.js';
  import { ui } from '#lib/store/ui.svelte.js';
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
/>
