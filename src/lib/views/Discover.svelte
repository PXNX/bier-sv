<script>
  import Icon from '../components/Icon.svelte';
  import BeerCard from '../components/BeerCard.svelte';
  import { beerTypes, distanceKm, flavors } from '../data/beers.js';

  let { store, onOpenBeer, search = $bindable(''), onNew } = $props();

  let activeType = $state('All types');
  let activeFlavors = $state([]);
  let sort = $state('Top rated');
  let savedOnly = $state(false);
  let visibleCount = $state(24);
  let userCoords = $state(null);
  let radius = $state(100);
  let locating = $state(false);
  let locationError = $state('');

  let results = $derived(
    store.catalog
      .filter((beer) => {
        const query = search.trim().toLowerCase();
        const matchesSearch =
          !query ||
          `${beer.name} ${beer.brewery || ''} ${beer.city || ''} ${beer.type} ${beer.style} ${beer.flavors.join(' ')}`
            .toLowerCase()
            .includes(query);
        const matchesType = activeType === 'All types' || beer.type === activeType;
        const matchesFlavors = activeFlavors.every((flavor) => beer.flavors.includes(flavor));
        const matchesSaved = !savedOnly || store.favorites.includes(beer.id);
        return matchesSearch && matchesType && matchesFlavors && matchesSaved;
      })
      .map((beer) => ({
        ...beer,
        distance:
          userCoords && beer.coords
            ? Math.round(distanceKm(userCoords, { lat: beer.coords[0], lon: beer.coords[1] }))
            : null,
      }))
      .filter((beer) => !userCoords || (beer.distance !== null && beer.distance <= radius))
      .sort((a, b) =>
        sort === 'Nearest'
          ? (a.distance ?? 99999) - (b.distance ?? 99999)
          : sort === 'Top rated'
            ? b.score - a.score
            : sort === 'Most reviewed'
              ? b.reviews - a.reviews
              : a.name.localeCompare(b.name),
      ),
  );

  let filterKey = $derived(
    `${activeType}|${activeFlavors.join(',')}|${search}|${sort}|${savedOnly}|${radius}|${userCoords?.lat},${userCoords?.lon}`,
  );
  let shown = $derived(results.slice(0, visibleCount));

  $effect(() => {
    filterKey;
    visibleCount = 24;
  });

  function findLocation() {
    if (userCoords) {
      userCoords = null;
      if (sort === 'Nearest') sort = 'Top rated';
      return;
    }
    if (!navigator.geolocation) {
      locationError = 'Location is not available in this browser.';
      return;
    }
    locating = true;
    locationError = '';
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userCoords = { lat: position.coords.latitude, lon: position.coords.longitude };
        locating = false;
      },
      () => {
        locationError = 'Location permission was denied. You can still browse every beer.';
        locating = false;
      },
      { timeout: 10000 },
    );
  }

  function toggleFlavor(id) {
    activeFlavors = activeFlavors.includes(id)
      ? activeFlavors.filter((item) => item !== id)
      : [...activeFlavors, id];
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
    <p class="lede">
      Pick a style, chase a flavour, or follow a hunch. Every pour here is described by how it tastes, not
      where it came from.
    </p>
  </div>
</div>

<div class="toolbar">
  <label class="search-field">
    <Icon name="search" size={15} />
    <input bind:value={search} placeholder="Search a beer, brewery or flavour" aria-label="Search beers" />
  </label>
  <button class="chip" class:on={savedOnly} onclick={() => (savedOnly = !savedOnly)}
    ><Icon name="heart" size={13} /> Saved</button
  >
  <button class="chip" class:on={!!userCoords} onclick={findLocation} disabled={locating}>
    <Icon name="location" size={13} />
    {locating ? 'Locating…' : userCoords ? 'Near me · on' : 'Near me'}
  </button>
  {#if userCoords}
    <label class="select-field"
      >Within
      <select bind:value={radius} aria-label="Search radius">
        <option value={25}>25 km</option>
        <option value={50}>50 km</option>
        <option value={100}>100 km</option>
        <option value={250}>250 km</option>
      </select>
    </label>
  {/if}
  <label class="select-field"
    >Sort
    <select bind:value={sort} aria-label="Sort beers">
      <option>Top rated</option>
      <option>Most reviewed</option>
      {#if userCoords}<option>Nearest</option>{/if}
      <option>A–Z</option>
    </select>
  </label>
</div>
{#if locationError}
  <p class="location-error">{locationError}</p>
{/if}

<div class="card filter-block">
  <div>
    <h3>Beer type</h3>
    <small>{beerTypes.find((type) => type.id === activeType)?.description}</small>
  </div>
  <div class="chip-row">
    {#each beerTypes as type}
      <button class="chip" class:on={activeType === type.id} onclick={() => (activeType = type.id)}
        >{type.label}</button
      >
    {/each}
  </div>
</div>

<div class="card filter-block">
  <div>
    <h3>Flavour focus</h3>
    <small>Multiple selections are combined — pick a few to narrow the board.</small>
  </div>
  <div class="chip-row">
    {#each flavors as flavor}
      <button
        class="chip"
        class:on={activeFlavors.includes(flavor.id)}
        onclick={() => toggleFlavor(flavor.id)}
      >
        <span class="dot" style={`--chip-dot:${flavor.accent}`}></span>{flavor.id}
      </button>
    {/each}
  </div>
</div>

<p class="result-count">{results.length} {results.length === 1 ? 'pour' : 'pours'} on the board</p>

{#if results.length}
  <div class="beer-grid">
    {#each shown as beer (beer.id)}
      <BeerCard {beer} {store} onOpen={onOpenBeer} distance={beer.distance} />
    {/each}
  </div>
  {#if visibleCount < results.length}
    <div class="load-more">
      <button class="button button--ghost" onclick={() => (visibleCount += 24)}>
        Show more pours · {results.length - visibleCount} left
      </button>
    </div>
  {/if}
{:else}
  <div class="card empty">
    <div class="empty-mark"><Icon name="search" size={24} /></div>
    <h3>No pours match that combination</h3>
    <p>Try a different style, loosen a flavour, or clear the board and start again.</p>
    <div style="display:flex;gap:9px;justify-content:center">
      <button class="button button--ghost" onclick={reset}>Clear filters</button>
      <button class="button button--primary" onclick={onNew}
        ><Icon name="plus" size={15} /> Log a tasting</button
      >
    </div>
  </div>
{/if}
