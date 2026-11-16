<script>
  import Icon from '../components/Icon.svelte';
  import { flavors } from '../data/beers.js';

  let { store, onOpenBeer, onNavigate } = $props();

  let saved = $derived(store.catalog.filter((beer) => store.favorites.includes(beer.id)));
</script>

<div class="page-head">
  <div>
    <p class="eyebrow">Saved pours</p>
    <h1>Keep the <em>good ones.</em></h1>
    <p class="lede">A shortlist of the beers you want to find again. Save any beer from the board and it will live here.</p>
  </div>
  {#if saved.length}<button class="button button--ghost" onclick={() => onNavigate('discover')}><Icon name="discover" size={15} /> Explore more</button>{/if}
</div>

{#if saved.length}
  <p class="result-count">{saved.length} saved {saved.length === 1 ? 'beer' : 'beers'}</p>
  <div class="beer-grid">
    {#each saved as beer (beer.id)}
      <article class="card beer-card">
        <button class="fav-button on" aria-label={`Unsave ${beer.name}`} onclick={() => store.toggleFavorite(beer.id)}><Icon name="heart" size={15} /></button>
        <button class="beer-card-body" onclick={() => onOpenBeer(beer)} aria-label={`Open ${beer.name}`}>
          <div class="beer-visual" style={`--accent:${beer.accent}`}>
            <span class="beer-type-stamp">{beer.type}</span>
            <div class="mini-glass"><div class="mini-liquid"></div><div class="mini-foam"></div><div class="mini-shine"></div></div>
          </div>
          <div class="beer-info">
            <div class="beer-info-top">
              <div><p class="beer-style">{beer.style}</p><h3>{beer.name}</h3></div>
              <span class="score"><strong>{Number(beer.score).toFixed(1)}</strong></span>
            </div>
            <p class="description">{beer.description}</p>
            <div class="beer-tags">
              {#each beer.flavors as flavor}<span class="tag"><i style={`--tag-dot:${flavors.find((f) => f.id === flavor)?.accent || '#e0a23c'}`}></i>{flavor}</span>{/each}
            </div>
          </div>
        </button>
      </article>
    {/each}
  </div>
{:else}
  <div class="card empty">
    <div class="empty-mark"><Icon name="heart" size={24} /></div>
    <h3>No saved pours yet</h3>
    <p>Tap the heart on any beer in Discover to build your own shortlist of favourites.</p>
    <button class="button button--primary" onclick={() => onNavigate('discover')}><Icon name="discover" size={15} /> Browse the board</button>
  </div>
{/if}
