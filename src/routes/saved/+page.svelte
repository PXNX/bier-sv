<script>
  import Saved from '#lib/views/Saved.svelte';
  import { state as store } from '#lib/store/tastings.svelte.js';
  import { navigate } from '#lib/navigation.js';
  import { ui } from '#lib/store/ui.svelte.js';
</script>

<svelte:head><title>Saved pours — Hopnote</title></svelte:head>

<Saved {store} onNavigate={navigate} onOpenBeer={(beer) => (ui.selectedBeer = beer)} />
