<script>
  import Icon from '../components/Icon.svelte';
  import { beerTypes, flavors } from '../data/beers.js';

  let { store, onOpenBeer, search = $bindable(''), onNew } = $props();

  let activeType = $state('All types');
  let activeFlavors = $state([]);
  let sort = $state('Top rated');
  let savedOnly = $state(false);

  let results = $derived(
    store.catalog
      .filter((beer) => {
        const query = search.trim().toLowerCase();
        const matchesSearch =
          !query ||
          `${beer.name} ${beer.type} ${beer.style} ${beer.flavors.join(' ')}`.toLowerCase().includes(query);
        const matchesType = activeType === 'All types' || beer.type === activeType;
        const matchesFlavors = activeFlavors.every((flavor) => beer.flavors.includes(flavor));
        const matchesSaved = !savedOnly || store.favorites.includes(beer.id);
        return matchesSearch && matchesType && matchesFlavors && matchesSaved;
      })
      .sort((a, b) =>
        sort === 'Top rated' ? b.score - a.score : sort === 'Most reviewed' ? b.reviews - a.reviews : a.name.localeCompare(b.name)
      )
  );

  function toggleFlavor(id) {
    activeFlavors = activeFlavors.includes(id) ? activeFlavors.filter((item) => item !== id) : [...activeFlavors, id];
  }

  function reset() {
    activeType = 'All types';
    activeFlavors = [];
    search = '';
    savedOnly = false;
  }
</script>

<div class="page-head">
  <div>
    <p class="eyebrow">Explore the board</p>
    <h1>Discover by <em>flavour.</em></h1>
    <p class="lede">Pick a style, chase a flavour, or follow a hunch. Every pour here is described by how it tastes, not where it came from.</p>
  </div>
</div>

<div class="toolbar">
  <label class="search-field">
    <Icon name="search" size={15} />
    <input bind:value={search} placeholder="Search a beer, style or flavour" aria-label="Search beers" />
  </label>
  <button class="chip" class:on={savedOnly} onclick={() => (savedOnly = !savedOnly)}><Icon name="heart" size={13} /> Saved</button>
  <label class="select-field">Sort
    <select bind:value={sort} aria-label="Sort beers">
      <option>Top rated</option>
      <option>Most reviewed</option>
      <option>A–Z</option>
    </select>
  </label>
</div>

<div class="card filter-block">
  <div><h3>Beer type</h3><small>{beerTypes.find((type) => type.id === activeType)?.description}</small></div>
  <div class="chip-row">
    {#each beerTypes as type}
      <button class="chip" class:on={activeType === type.id} onclick={() => (activeType = type.id)}>{type.label}</button>
    {/each}
  </div>
</div>

<div class="card filter-block">
  <div><h3>Flavour focus</h3><small>Multiple selections are combined — pick a few to narrow the board.</small></div>
  <div class="chip-row">
    {#each flavors as flavor}
      <button class="chip" class:on={activeFlavors.includes(flavor.id)} onclick={() => toggleFlavor(flavor.id)}>
        <span class="dot" style={`--chip-dot:${flavor.accent}`}></span>{flavor.id}
      </button>
    {/each}
  </div>
</div>

<p class="result-count">{results.length} {results.length === 1 ? 'pour' : 'pours'} on the board</p>

{#if results.length}
  <div class="beer-grid">
    {#each results as beer (beer.id)}
      <article class="card beer-card">
        <button
          class="fav-button"
          class:on={store.favorites.includes(beer.id)}
          aria-label={store.favorites.includes(beer.id) ? `Unsave ${beer.name}` : `Save ${beer.name}`}
          onclick={() => store.toggleFavorite(beer.id)}
        ><Icon name="heart" size={15} /></button>
        <button class="beer-card-body" onclick={() => onOpenBeer(beer)} aria-label={`Open ${beer.name}`}>
          <div class="beer-visual" style={`--accent:${beer.accent}`}>
            <span class="beer-type-stamp">{beer.type}</span>
            <div class="mini-glass"><div class="mini-liquid"></div><div class="mini-foam"></div><div class="mini-shine"></div></div>
          </div>
          <div class="beer-info">
            <div class="beer-info-top">
              <div><p class="beer-style">{beer.style} · {beer.reviews} {beer.reviews === 1 ? 'note' : 'notes'}</p><h3>{beer.name}</h3></div>
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
    <div class="empty-mark"><Icon name="search" size={24} /></div>
    <h3>No pours match that combination</h3>
    <p>Try a different style, loosen a flavour, or clear the board and start again.</p>
    <div style="display:flex;gap:9px;justify-content:center">
      <button class="button button--ghost" onclick={reset}>Clear filters</button>
      <button class="button button--primary" onclick={onNew}><Icon name="plus" size={15} /> Log a tasting</button>
    </div>
  </div>
{/if}
