<script lang="ts">
  import Journal from '#lib/views/Journal.svelte';
  import { state as store } from '#lib/store/tastings.svelte.ts';
  import { ui, openEdit, notify } from '#lib/store/ui.svelte.ts';
</script>

<svelte:head><title>Journal — Hopnote</title></svelte:head>

<Journal
  {store}
  onNew={() => (ui.showForm = true)}
  onOpenBeer={(beer) => (ui.selectedBeer = beer)}
  onEdit={openEdit}
  onDelete={(tasting) => {
    if (!store.removeTasting(tasting.id)) return;
    notify(`${tasting.name} removed`, { label: 'Undo', run: () => store.undoDelete() });
  }}
/>
