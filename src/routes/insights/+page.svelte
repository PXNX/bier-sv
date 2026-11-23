<script lang="ts">
  import Insights from '#lib/views/Insights.svelte';
  import { state as store } from '#lib/store/tastings.svelte.ts';
  import { navigate } from '#lib/navigation.ts';
</script>

<svelte:head><title>Insights — Hopnote</title></svelte:head>

<Insights {store} onNavigate={navigate} />
