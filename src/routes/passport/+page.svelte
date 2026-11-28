<script lang="ts">
  import RadarChart from '#lib/components/charts/RadarChart.svelte';
  import Icon from '#lib/components/Icon.svelte';
  import { state as store } from '#lib/store/tastings.svelte.ts';
  import { flavorAccent, formatDate } from '#lib/data/beers.ts';
  import { formatAbv, formatPrice } from '#lib/data/details.ts';
  import { topPours } from '#lib/data/rankings.ts';
  import { paletteArchetype } from '#lib/data/archetype.ts';

  let ranked = $derived(topPours(store.tastings, 8));
  let archetype = $derived(paletteArchetype(store.tastings));
  let rows = $derived([...store.tastings].sort((a, b) => b.createdAt - a.createdAt).slice(0, 40));

  function detail(tasting: (typeof store.tastings)[number]): string {
    const price = formatPrice(tasting.price);
    return [price ? `${price} in a shop` : '', formatAbv(tasting.abv)].filter(Boolean).join(' · ');
  }
</script>

<svelte:head>
  <title>Beer passport — Hopnote</title>
  <meta name="description" content="A print-ready record of your beer tastings." />
</svelte:head>

<div class="passport-toolbar no-print">
  <a class="button button--ghost" href="/insights"><Icon name="arrow" size={15} /> Back to insights</a>
  <div>
    <button class="button button--primary" onclick={() => window.print()}>
      <Icon name="download" size={15} /> Print / Save as PDF
    </button>
    <p>Choose “Save as PDF” in your browser's print dialog. Nothing leaves this device.</p>
  </div>
</div>

<article class="passport-sheet">
  <header class="passport-header">
    <div>
      <p class="eyebrow">hopnote</p>
      <h1>Your beer <em>passport.</em></h1>
      <p>A printed record of the pours you decided were worth remembering.</p>
    </div>
    <div class="passport-stamp">
      <span>Issued</span>
      <strong>{formatDate(Date.now())}</strong>
      <small>{store.tastings.length} {store.tastings.length === 1 ? 'entry' : 'entries'}</small>
    </div>
  </header>

  <div class="passport-stats">
    <div><span>Tastings</span><strong>{store.tastings.length}</strong></div>
    <div><span>Average score</span><strong>{store.avgScore.toFixed(1)} / 5</strong></div>
    <div><span>Favourite style</span><strong>{store.topStyle}</strong></div>
    <div><span>Signature flavour</span><strong>{store.topFlavor}</strong></div>
  </div>

  <div class="passport-profile">
    <div>
      <p class="eyebrow">Your palate</p>
      <h2>{archetype.name}</h2>
      <p>{archetype.tagline}</p>
      <div class="passport-tags">
        {#each store.flavorCounts.slice(0, 6) as item}
          <span><i style={`background:${flavorAccent(item.id)}`}></i>{item.id} · {item.count}</span>
        {/each}
      </div>
    </div>
    <RadarChart values={store.axisProfile} size={200} />
  </div>

  <section class="passport-section">
    <div class="passport-section-head">
      <h2>Best loved</h2>
      <span>Averaged across repeat pours</span>
    </div>
    <table class="passport-table">
      <thead><tr><th>#</th><th>Beer</th><th>Pours</th><th>Score</th></tr></thead>
      <tbody>
        {#each ranked as pour, index (pour.id)}
          <tr>
            <td>{index + 1}</td>
            <td>{pour.name}</td>
            <td>{pour.times}</td>
            <td>{pour.score.toFixed(1)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </section>

  <section class="passport-section">
    <div class="passport-section-head">
      <h2>Tasting ledger</h2>
      <span>Newest first · up to 40 entries</span>
    </div>
    <table class="passport-table">
      <thead><tr><th>Date</th><th>Beer</th><th>Style</th><th>Flavours</th><th>Score</th></tr></thead>
      <tbody>
        {#each rows as tasting (tasting.id)}
          <tr>
            <td>{formatDate(tasting.createdAt)}</td>
            <td>
              {tasting.name}
              {#if tasting.brewery}<small>{tasting.brewery}</small>{/if}
              {#if detail(tasting)}<small>{detail(tasting)}</small>{/if}
              {#if tasting.notes}<small class="passport-note">“{tasting.notes}”</small>{/if}
            </td>
            <td>{tasting.type}</td>
            <td>{tasting.flavors.join(', ')}</td>
            <td>{Number(tasting.score).toFixed(1)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </section>

  <footer class="passport-footer">
    Printed from Hopnote. Every tasting stays on this device — no account, no cloud, no tracking.
  </footer>
</article>
