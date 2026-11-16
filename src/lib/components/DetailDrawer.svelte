<script>
  import Icon from './Icon.svelte';
  import RadarChart from './charts/RadarChart.svelte';
  import { flavors, profileFromFlavors, typeAccent } from '../data/beers.js';

  let { beer, store, onClose, onNew } = $props();

  function onKeydown(event) {
    if (event.key === 'Escape') onClose();
  }
</script>

<svelte:window onkeydown={onKeydown} />

<div class="drawer-backdrop" role="presentation" onclick={onClose}></div>
<div class="drawer" role="dialog" aria-modal="true" aria-label={`${beer.name} details`}>
  <button class="button button--subtle button--icon drawer-close" aria-label="Close details" onclick={onClose}
    ><Icon name="close" size={18} /></button
  >

  <div class="drawer-hero" style={`--accent:${beer.accent}`}>
    <span class="beer-type-stamp">{beer.type}</span>
    <div class="mini-glass">
      <div class="mini-liquid"></div>
      <div class="mini-foam"></div>
      <div class="mini-shine"></div>
    </div>
  </div>

  <h2>{beer.name}</h2>
  <p class="drawer-sub">
    {beer.style} · {beer.reviews}
    {beer.reviews === 1 ? 'flavour note' : 'flavour notes'}
  </p>

  <div class="drawer-score">
    <span class="score"><strong>{Number(beer.score).toFixed(1)}</strong></span>
    <p>Taste-led score<br />from the community and your journal</p>
  </div>

  <p class="drawer-desc">{beer.description}</p>

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
