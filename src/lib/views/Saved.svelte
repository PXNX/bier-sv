<script lang="ts">
  import Icon from '../components/Icon.svelte';
  import BeerCard from '../components/BeerCard.svelte';
  import type { HopnoteState } from '../store/tastings.svelte.ts';
  import type { Beer, Tasting, ViewId } from '../types';

  let {
    store,
    onOpenBeer,
    onNavigate,
    onLog,
  }: {
    store: HopnoteState;
    onOpenBeer: (beer: Beer | Tasting) => void;
    onNavigate: (id: ViewId) => void;
    onLog: (beer: Beer) => void;
  } = $props();

  let saved = $derived(store.catalog.filter((beer) => store.favorites.includes(beer.id)));
</script>

<div class="page-head">
  <div>
    <p class="eyebrow">Saved pours</p>
    <h1>Keep the <em>good ones.</em></h1>
    <p class="lede">
      A shortlist of the beers you want to find again. Save any beer from the board and it will live here.
    </p>
  </div>
  {#if saved.length}<button class="button button--ghost" onclick={() => onNavigate('discover')}
      ><Icon name="discover" size={15} /> Explore more</button
    >{/if}
</div>

{#if saved.length}
  <p class="result-count">{saved.length} saved {saved.length === 1 ? 'beer' : 'beers'}</p>
  <div class="beer-grid">
    {#each saved as beer (beer.id)}
      <BeerCard {beer} {store} onOpen={onOpenBeer} onLog={onLog} />
    {/each}
  </div>
{:else}
  <div class="card empty">
    <div class="empty-mark"><Icon name="heart" size={24} /></div>
    <h3>No saved pours yet</h3>
    <p>Tap the heart on any beer in Discover to build your own shortlist of favourites.</p>
    <button class="button button--primary" onclick={() => onNavigate('discover')}
      ><Icon name="discover" size={15} /> Browse the board</button
    >
  </div>
{/if}
