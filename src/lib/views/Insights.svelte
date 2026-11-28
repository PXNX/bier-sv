<script lang="ts">
  import DonutChart from '../components/charts/DonutChart.svelte';
  import Icon from '../components/Icon.svelte';
  import { flavorAccent, typeAccent } from '../data/beers.ts';
  import { ratingTone } from '../data/rating.ts';
  import { topPours } from '../data/rankings.ts';
  import { paletteArchetype } from '../data/archetype.ts';
  import { SUPPORT_URL } from '../data/support.ts';
  import Rating from '../components/Rating.svelte';
  import type { HopnoteState } from '../store/tastings.svelte.ts';
  import type { Tasting, ViewId } from '../types';

  let { store, onNavigate }: { store: HopnoteState; onNavigate: (id: ViewId) => void } = $props();

  let ranked = $derived(topPours(store.tastings));
  let archetype = $derived(paletteArchetype(store.tastings));
  let flavorBars = $derived(store.flavorCounts.filter((item) => item.count > 0).slice(0, 8));
  let maxCount = $derived(Math.max(1, ...flavorBars.map((item) => item.count)));

  let styleSegments = $derived.by(() => {
    const counts = new Map<string, number>();
    for (const tasting of store.tastings) counts.set(tasting.type, (counts.get(tasting.type) || 0) + 1);
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({ label, value, color: typeAccent(label) }));
  });

  let scoreBands = $derived.by(() => {
    const bands = [
      { label: '4.5 – 5.0', test: (score: number) => score >= 4.5, color: ratingTone(4.75).color },
      {
        label: '4.0 – 4.4',
        test: (score: number) => score >= 4 && score < 4.5,
        color: ratingTone(4.2).color,
      },
      { label: 'Below 4.0', test: (score: number) => score < 4, color: ratingTone(3.5).color },
    ];
    return bands.map((band) => ({
      label: band.label,
      value: store.tastings.filter((tasting) => band.test(Number(tasting.score))).length,
      color: band.color,
    }));
  });

  let pairings = $derived.by(() => {
    const counts = new Map();
    for (const tasting of store.tastings) {
      const list = tasting.flavors;
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          const key = [list[i], list[j]].sort().join(' + ');
          counts.set(key, (counts.get(key) || 0) + 1);
        }
      }
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
  });
</script>

<div class="page-head">
  <div>
    <p class="eyebrow">Your palate, in numbers</p>
    <h1>Taste <em>insights.</em></h1>
    <p class="lede">
      Patterns emerge when you look back. These charts are drawn entirely from the tastings in your journal.
    </p>
  </div>
  <div style="display:flex;gap:9px;align-items:center;flex-wrap:wrap">
    <a class="button button--ghost" href="/passport"><Icon name="download" size={15} /> Beer passport</a>
    <button class="button button--ghost" onclick={() => onNavigate('journal')}
      ><Icon name="journal" size={15} /> Open journal</button
    >
  </div>
</div>

<div class="card archetype-card" style={`--archetype:${archetype.accent}`}>
  <div class="archetype-identity">
    <p class="eyebrow">Your palate archetype</p>
    <h2>{archetype.name}</h2>
    <p>{archetype.tagline}</p>
  </div>
  <div class="archetype-axes">
    {#each archetype.axes as axis}
      <div class="archetype-axis">
        <span>{axis.id}</span>
        <div class="bar-track"><div class="archetype-fill" style={`width:${Math.round(axis.value * 100)}%`}></div></div>
      </div>
    {/each}
  </div>
</div>

<div class="insights-grid">
  <div class="card panel insight-panel">
    <div class="panel-title">
      <h2>Most-noted flavours</h2>
      <span>Across all tastings</span>
    </div>
    <div class="bar-list">
      {#each flavorBars as item}
        <div class="bar-row">
          <span>{item.id}</span>
          <div class="bar-track">
            <div class="bar-fill" style={`width:${(item.count / maxCount) * 100}%`}></div>
          </div>
          <b>{item.count}</b>
        </div>
      {/each}
    </div>
  </div>

  <div class="card panel insight-panel">
    <div class="panel-title">
      <h2>Styles you reach for</h2>
      <span>By tasting count</span>
    </div>
    <div class="donut-wrap">
      <DonutChart segments={styleSegments} size={156} />
      <div class="donut-legend">
        {#each styleSegments as segment}
          <div><i style={`background:${segment.color}`}></i>{segment.label}<b>{segment.value}</b></div>
        {/each}
      </div>
    </div>
  </div>

  <div class="card panel insight-panel">
    <div class="panel-title">
      <h2>How you score</h2>
      <span>Score distribution</span>
    </div>
    <div class="bar-list">
      {#each scoreBands as band}
        <div class="bar-row">
          <span>{band.label}</span>
          <div class="bar-track">
            <div
              class="bar-fill"
              style={`width:${store.tastings.length ? (band.value / store.tastings.length) * 100 : 0}%;background:linear-gradient(90deg,${band.color}88,${band.color})`}
            ></div>
          </div>
          <b>{band.value}</b>
        </div>
      {/each}
    </div>
    <div class="insight-average">
      <Rating score={store.avgScore} variant="hero" showLabel />
    </div>
    <p class="insight-note">
      Your average score is <strong>{store.avgScore.toFixed(1)}</strong>. A generous palate usually means
      you're noticing the small things.
    </p>
  </div>

  <div class="card panel insight-panel">
    <div class="panel-title">
      <h2>Flavours that travel together</h2>
      <span>Top pairings</span>
    </div>
    <div class="bar-list">
      {#each pairings as [label, count]}
        <div class="bar-row" style="grid-template-columns:1fr 28px">
          <span style="color:var(--ink)">{label}</span>
          <b>{count}</b>
        </div>
      {/each}
    </div>
    <p class="insight-note">
      Your signature combination is <strong>{store.topFlavor}</strong> with a {store.topStyle.toLowerCase()} — a
      useful starting point for your next pour.
    </p>
  </div>

  <div class="card panel insight-panel">
    <div class="panel-title">
      <h2>Your top pours</h2>
      <span>Averaged across repeats</span>
    </div>
    <div class="rank-list">
      {#each ranked as pour, index (pour.id)}
        <div class="rank-row">
          <span class="rank-index">{index + 1}</span>
          <span class="rank-name">{pour.name}</span>
          <span class="rank-times">{pour.times}×</span>
          <Rating score={pour.score} variant="compact" />
        </div>
      {:else}
        <p class="insight-note">Log a few tastings and your favourites will appear here.</p>
      {/each}
    </div>
  </div>
</div>

<div class="card support-card">
  <div>
    <p class="eyebrow">Keep it pouring</p>
    <h2>Hopnote stays free and on your device.</h2>
    <p>If it has been useful, you can say thanks with a pint — no account, no tracking.</p>
  </div>
  <a class="button button--ghost" href={SUPPORT_URL} target="_blank" rel="noopener noreferrer">
    <Icon name="heart" size={15} /> Buy me a pint
  </a>
</div>
