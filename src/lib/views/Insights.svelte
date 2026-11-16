<script>
  import DonutChart from '../components/charts/DonutChart.svelte';
  import Icon from '../components/Icon.svelte';
  import { flavorAccent, typeAccent } from '../data/beers.js';

  let { store, onNavigate } = $props();

  let flavorBars = $derived(store.flavorCounts.filter((item) => item.count > 0).slice(0, 8));
  let maxCount = $derived(Math.max(1, ...flavorBars.map((item) => item.count)));

  let styleSegments = $derived.by(() => {
    const counts = new Map();
    for (const tasting of store.tastings) counts.set(tasting.type, (counts.get(tasting.type) || 0) + 1);
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({ label, value, color: typeAccent(label) }));
  });

  let scoreBands = $derived.by(() => {
    const bands = [
      { label: '4.5 – 5.0', test: (score) => score >= 4.5 },
      { label: '4.0 – 4.4', test: (score) => score >= 4 && score < 4.5 },
      { label: 'Below 4.0', test: (score) => score < 4 }
    ];
    return bands.map((band) => ({
      label: band.label,
      value: store.tastings.filter((tasting) => band.test(Number(tasting.score))).length
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
    <p class="lede">Patterns emerge when you look back. These charts are drawn entirely from the tastings in your journal.</p>
  </div>
  <button class="button button--ghost" onclick={() => onNavigate('journal')}><Icon name="journal" size={15} /> Open journal</button>
</div>

<div class="insights-grid">
  <div class="card panel insight-panel">
    <div class="panel-title"><h2>Most-noted flavours</h2><span>Across all tastings</span></div>
    <div class="bar-list">
      {#each flavorBars as item}
        <div class="bar-row">
          <span>{item.id}</span>
          <div class="bar-track"><div class="bar-fill" style={`width:${(item.count / maxCount) * 100}%`}></div></div>
          <b>{item.count}</b>
        </div>
      {/each}
    </div>
  </div>

  <div class="card panel insight-panel">
    <div class="panel-title"><h2>Styles you reach for</h2><span>By tasting count</span></div>
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
    <div class="panel-title"><h2>How you score</h2><span>Score distribution</span></div>
    <div class="bar-list">
      {#each scoreBands as band}
        <div class="bar-row">
          <span>{band.label}</span>
          <div class="bar-track"><div class="bar-fill" style={`width:${store.tastings.length ? (band.value / store.tastings.length) * 100 : 0}%`}></div></div>
          <b>{band.value}</b>
        </div>
      {/each}
    </div>
    <p class="insight-note">Your average score is <strong>{store.avgScore.toFixed(1)}</strong>. A generous palate usually means you're noticing the small things.</p>
  </div>

  <div class="card panel insight-panel">
    <div class="panel-title"><h2>Flavours that travel together</h2><span>Top pairings</span></div>
    <div class="bar-list">
      {#each pairings as [label, count]}
        <div class="bar-row" style="grid-template-columns:1fr 28px">
          <span style="color:var(--ink)">{label}</span>
          <b>{count}</b>
        </div>
      {/each}
    </div>
    <p class="insight-note">Your signature combination is <strong>{store.topFlavor}</strong> with a {store.topStyle.toLowerCase()} — a useful starting point for your next pour.</p>
  </div>
</div>
