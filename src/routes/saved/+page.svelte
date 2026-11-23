<script lang="ts">
  import Saved from '#lib/views/Saved.svelte';
  import { state as store } from '#lib/store/tastings.svelte.ts';
  import { navigate } from '#lib/navigation.ts';
  import { ui } from '#lib/store/ui.svelte.ts';
</script>

<svelte:head><title>Saved pours — Hopnote</title></svelte:head>

<Saved {store} onNavigate={navigate} onOpenBeer={(beer) => (ui.selectedBeer = beer)} />
