<script>
  import Icon from '../components/Icon.svelte';
  import { flavors, formatDate, relativeDay, typeAccent } from '../data/beers.js';

  let { store, onNew, onOpenBeer } = $props();

  let search = $state('');
  let sort = $state('Newest first');

  let entries = $derived(
    store.tastings
      .filter((tasting) => {
        const query = search.trim().toLowerCase();
        return !query || `${tasting.name} ${tasting.type} ${tasting.flavors.join(' ')} ${tasting.notes}`.toLowerCase().includes(query);
      })
      .sort((a, b) =>
        sort === 'Newest first' ? b.createdAt - a.createdAt : sort === 'Oldest first' ? a.createdAt - b.createdAt : b.score - a.score
      )
  );
</script>

<div class="page-head">
  <div>
    <p class="eyebrow">Your journal</p>
    <h1>Every pour, <em>remembered.</em></h1>
    <p class="lede">A running record of the beers you've tasted and the flavours you noticed. {store.tastings.length} {store.tastings.length === 1 ? 'entry' : 'entries'} and counting.</p>
  </div>
  <button class="button button--primary" onclick={onNew}><Icon name="plus" size={15} /> Log a tasting</button>
</div>

<div class="journal-tools">
  <label class="search-field" style="flex:1;min-width:210px;display:flex;align-items:center;gap:9px;padding:10px 13px;border:1px solid var(--line);border-radius:9px;background:var(--surface);color:var(--faint)">
    <Icon name="search" size={15} />
    <input bind:value={search} placeholder="Search your journal" aria-label="Search journal" style="width:100%;border:0;outline:0;background:transparent;color:var(--ink);font-size:12px" />
  </label>
  <label class="select-field">Sort
    <select bind:value={sort} aria-label="Sort journal">
      <option>Newest first</option>
      <option>Oldest first</option>
      <option>Highest score</option>
    </select>
  </label>
</div>

{#if entries.length}
  <div class="journal-list">
    {#each entries as tasting (tasting.id)}
      <article class="card journal-row">
        <span class="recent-mark" style={`--mark:${typeAccent(tasting.type)}`}></span>
        <div class="journal-main">
          <p style="margin:0;color:var(--faint);font:9px var(--font-mono);text-transform:uppercase;letter-spacing:.9px">{relativeDay(tasting.createdAt)} · {formatDate(tasting.createdAt)}</p>
          <h3>{tasting.name}</h3>
          <div>
            <span class="tag"><i style={`--tag-dot:${typeAccent(tasting.type)}`}></i>{tasting.type}</span>
            {#each tasting.flavors as flavor}
              <span class="tag"><i style={`--tag-dot:${flavors.find((f) => f.id === flavor)?.accent || '#e0a23c'}`}></i>{flavor}</span>
            {/each}
          </div>
          {#if tasting.notes}<p class="journal-notes">“{tasting.notes}”</p>{/if}
        </div>
        <div class="journal-side">
          <button class="button button--subtle button--small" onclick={() => onOpenBeer(tasting)}>Details</button>
          <span class="score"><strong>{Number(tasting.score).toFixed(1)}</strong></span>
          <button class="journal-delete" aria-label={`Delete ${tasting.name}`} onclick={() => store.removeTasting(tasting.id)}><Icon name="trash" size={15} /></button>
        </div>
      </article>
    {/each}
  </div>
{:else}
  <div class="card empty">
    <div class="empty-mark"><Icon name="journal" size={24} /></div>
    <h3>Nothing in the journal yet</h3>
    <p>{search ? 'No entry matches your search. Try another word.' : 'Log your first tasting and it will appear here, ready to revisit.'}</p>
    {#if !search}<button class="button button--primary" onclick={onNew}><Icon name="plus" size={15} /> Log a tasting</button>{/if}
  </div>
{/if}
