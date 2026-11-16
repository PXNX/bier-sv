<script>
  import Icon from './Icon.svelte';
  import { flavors } from '../data/beers.js';

  let { beer, store, onOpen } = $props();

  let saved = $derived(store.favorites.includes(beer.id));
  let tags = $derived(
    beer.flavors.map((flavor) => ({
      id: flavor,
      accent: flavors.find((item) => item.id === flavor)?.accent || '#e0a23c',
    })),
  );
</script>

<article class="card beer-card">
  <button
    class="fav-button"
    class:on={saved}
    aria-label={saved ? `Unsave ${beer.name}` : `Save ${beer.name}`}
    onclick={() => store.toggleFavorite(beer.id)}><Icon name="heart" size={15} /></button
  >
  <button class="beer-card-body" onclick={() => onOpen(beer)} aria-label={`Open ${beer.name}`}>
    <div class="beer-visual" style={`--accent:${beer.accent}`}>
      <span class="beer-type-stamp">{beer.type}</span>
      <div class="mini-glass">
        <div class="mini-liquid"></div>
        <div class="mini-foam"></div>
        <div class="mini-shine"></div>
      </div>
    </div>
    <div class="beer-info">
      <div class="beer-info-top">
        <div>
          {#if beer.brewery}
            <p class="beer-brewery">{beer.brewery}{beer.city ? ` · ${beer.city}` : ''}</p>
          {/if}
          <p class="beer-style">{beer.style} · {beer.reviews} {beer.reviews === 1 ? 'note' : 'notes'}</p>
          <h3>{beer.name}</h3>
        </div>
        <span class="score"><strong>{Number(beer.score).toFixed(1)}</strong></span>
      </div>
      {#if beer.description}
        <p class="description">{beer.description}</p>
      {/if}
      <div class="beer-tags">
        {#each tags as tag}
          <span class="tag"><i style={`--tag-dot:${tag.accent}`}></i>{tag.id}</span>
        {/each}
      </div>
    </div>
  </button>
</article>
