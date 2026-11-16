<script>
  import Insights from '#lib/views/Insights.svelte';
  import { state as store } from '#lib/store/tastings.svelte.js';
  import { navigate } from '#lib/navigation.js';
</script>

<svelte:head><title>Insights — Hopnote</title></svelte:head>

<Insights {store} onNavigate={navigate} />
