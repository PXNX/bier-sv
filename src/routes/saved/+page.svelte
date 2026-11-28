<script lang="ts">
  import Saved from '#lib/views/Saved.svelte';
  import { state as store } from '#lib/store/tastings.svelte.ts';
  import { navigate } from '#lib/navigation.ts';
  import { ui, openFormWith } from '#lib/store/ui.svelte.ts';
  import { prefillFromBeer } from '#lib/data/prefill.ts';
</script>

<svelte:head><title>Saved pours — Hopnote</title></svelte:head>

<Saved
  {store}
  onNavigate={navigate}
  onOpenBeer={(beer) => (ui.selectedBeer = beer)}
  onLog={(beer) => openFormWith(prefillFromBeer(beer))}
/>
