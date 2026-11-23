<script lang="ts">
  import Icon from './Icon.svelte';
  import BreweryMark from './BreweryMark.svelte';
  import BeerGlass from './BeerGlass.svelte';
  import RadarChart from './charts/RadarChart.svelte';
  import Rating from './Rating.svelte';
  import { flavors, profileFromFlavors, typeAccent } from '../data/beers.ts';
  import { beerPalette } from '../data/palette.ts';
  import type { Beer, Tasting } from '../types';
  import type { HopnoteState } from '../store/tastings.svelte.ts';

  let {
    beer,
    store,
    onClose,
    onNew,
  }: {
    beer: Beer | Tasting;
    store: HopnoteState;
    onClose: () => void;
    onNew: () => void;
  } = $props();

  function onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') onClose();
  }
</script>

<svelte:window onkeydown={onKeydown} />

<div class="drawer-backdrop" role="presentation" onclick={onClose}></div>
<div class="drawer" role="dialog" aria-modal="true" aria-label={`${beer.name} details`}>
  <button class="button button--subtle button--icon drawer-close" aria-label="Close details" onclick={onClose}
    ><Icon name="close" size={18} /></button
  >

  <div class="drawer-hero" style={`--accent:${beerPalette(beer).glow}`}>
    <span class="beer-type-stamp">{beer.type}</span>
    <BeerGlass beer={{ ...beer, accent: beer.accent || typeAccent(beer.type) }} size="drawer" />
  </div>

  <h2>{beer.name}</h2>
  {#if beer.brewery}
    <div class="drawer-brewery-row">
      <BreweryMark brewery={beer.brewery} logo={beer.logo} size={44} />
      <p class="drawer-brewery">{beer.brewery}{beer.city ? ` · ${beer.city}` : ''}</p>
    </div>
  {/if}
  <p class="drawer-sub">
    {beer.style} · {beer.reviews ?? 1}
    {(beer.reviews ?? 1) === 1 ? 'flavour note' : 'flavour notes'}
  </p>

  <div class="drawer-score">
    <Rating score={beer.score} variant="hero" showLabel />
    <p>Taste-led score<br />from the community and your journal</p>
  </div>

  {#if beer.description}
    <p class="drawer-desc">{beer.description}</p>
  {/if}

  <div class="section-head">
    <h2>Flavour profile</h2>
    <span>{beer.flavors.length} notes</span>
  </div>
  <div class="radar-wrap" style="gap:8px">
    <RadarChart values={profileFromFlavors(beer.flavors)} size={168} />
    <div class="beer-tags" style="flex-direction:column;align-items:flex-start;gap:7px">
      {#each beer.flavors as flavor}
        <span class="tag"
          ><i style={`--tag-dot:${flavors.find((f) => f.id === flavor)?.accent || '#e0a23c'}`}
          ></i>{flavor}</span
        >
      {/each}
    </div>
  </div>

  <div class="drawer-actions">
    <button class="button button--ghost" onclick={() => store.toggleFavorite(beer.id)}>
      <Icon name="heart" size={15} />
      {store.favorites.includes(beer.id) ? 'Saved' : 'Save beer'}
    </button>
    <button class="button button--primary" onclick={onNew}
      ><Icon name="plus" size={15} /> Log a tasting</button
    >
  </div>
</div>
