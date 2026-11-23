<script lang="ts">
  import RadarChart from '../components/charts/RadarChart.svelte';
  import Icon from '../components/Icon.svelte';
  import { flavorAccent, relativeDay, typeAccent } from '../data/beers.ts';
  import type { HopnoteState } from '../store/tastings.svelte.ts';
  import type { Beer, Tasting, ViewId } from '../types';

  let {
    store,
    onNavigate,
    onNew,
    onOpenBeer,
  }: {
    store: HopnoteState;
    onNavigate: (id: ViewId) => void;
    onNew: () => void;
    onOpenBeer: (beer: Beer | Tasting) => void;
  } = $props();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  let recent = $derived(store.tastings.slice(0, 4));
  let legend = $derived(store.flavorCounts.slice(0, 4));
</script>

<div class="page-head greeting">
  <div>
    <p class="eyebrow">Your tasting room</p>
    <h1>{greeting}, <em>taster.</em></h1>
    <p class="lede">
      A quiet record of what you've poured and what you loved. Your palate is taking shape — here's where it's
      going.
    </p>
  </div>
  <button class="button button--primary" onclick={onNew}><Icon name="plus" size={15} /> Log a tasting</button>
</div>

<div class="stat-grid">
  <div class="card stat" style="--stat-glow: rgba(224,162,60,.10)">
    <div class="stat-label">Tastings logged</div>
    <div class="stat-value">{store.tastings.length}</div>
    <div class="stat-foot">Your growing <b>flavour ledger</b></div>
  </div>
  <div class="card stat" style="--stat-glow: rgba(143,177,135,.10)">
    <div class="stat-label">Average score</div>
    <div class="stat-value">{store.avgScore.toFixed(1)}<small> / 5</small></div>
    <div class="stat-foot">Across every recorded pour</div>
  </div>
  <div class="card stat" style="--stat-glow: rgba(212,121,95,.10)">
    <div class="stat-label">Favourite style</div>
    <div class="stat-value" style="font-size:21px; letter-spacing:-.6px">{store.topStyle}</div>
    <div class="stat-foot">The style you reach for most</div>
  </div>
  <div class="card stat" style="--stat-glow: rgba(143,194,201,.10)">
    <div class="stat-label">Signature flavour</div>
    <div class="stat-value" style="font-size:21px; letter-spacing:-.6px">{store.topFlavor}</div>
    <div class="stat-foot">The note that keeps returning</div>
  </div>
</div>

<div class="section-head">
  <h2>The bigger picture</h2>
  <span>Overview</span>
</div>
<div class="overview-grid">
  <div class="card panel">
    <div class="panel-title">
      <h2>Your flavour fingerprint</h2>
      <span>From all tastings</span>
    </div>
    <div class="radar-wrap">
      <RadarChart values={store.axisProfile} size={180} />
      <div class="radar-legend">
        {#each legend as item}
          <div>
            <i style={`background:${flavorAccent(item.id)};opacity:1`}></i>{item.id}<strong
              >{item.count}</strong
            >
          </div>
        {/each}
        <div style="color:var(--faint);font-size:10px;margin-top:5px">
          Six axes, drawn from every flavour you've noted.
        </div>
      </div>
    </div>
  </div>

  <div class="card panel">
    <div class="panel-title">
      <h2>Recent pours</h2>
      <button class="button button--subtle button--small" onclick={() => onNavigate('journal')}
        >View journal →</button
      >
    </div>
    <div class="recent-list">
      {#each recent as tasting (tasting.id)}
        <button
          class="recent-row"
          style="width:100%;border:0;background:transparent;color:inherit;text-align:left;padding-left:0;padding-right:0"
          onclick={() => onOpenBeer(tasting)}
        >
          <span class="recent-mark" style={`--mark:${typeAccent(tasting.type)}`}></span>
          <span class="recent-body">
            <p>{relativeDay(tasting.createdAt)} · {tasting.type}</p>
            <strong>{tasting.name}</strong>
            <small>{tasting.flavors.join(' · ')}</small>
          </span>
          <span class="recent-score">{Number(tasting.score).toFixed(1)}</span>
        </button>
      {/each}
    </div>
  </div>
</div>

<div class="prompt-strip">
  <span class="empty-mark" style="margin:0"><Icon name="hop" size={24} /></span>
  <div class="prompt-copy">
    <h3>Found something worth remembering?</h3>
    <p>A few flavours and a score are all it takes to add it to your atlas.</p>
  </div>
  <button class="button button--primary" onclick={onNew}><Icon name="plus" size={15} /> Log a tasting</button>
</div>
