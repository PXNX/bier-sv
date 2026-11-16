<script>
  import Journal from '#lib/views/Journal.svelte';
  import { state as store } from '#lib/store/tastings.svelte.js';
  import { ui } from '#lib/store/ui.svelte.js';
</script>

<svelte:head><title>Journal — Hopnote</title></svelte:head>

<Journal {store} onNew={() => (ui.showForm = true)} onOpenBeer={(beer) => (ui.selectedBeer = beer)} />
