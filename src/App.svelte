<script>
  import { onMount } from 'svelte';
  import InstallPrompt from './lib/components/InstallPrompt.svelte';
  import { initInstallPrompt } from './lib/install.svelte.js';

  const beerTypes = [
    { id: 'All types', label: 'All types', description: 'Explore every kind of beer by the flavours you enjoy.' },
    { id: 'Lager', label: 'Lager', description: 'Clean, crisp, and balanced, with a smooth, refreshing finish.' },
    { id: 'IPA', label: 'IPA', description: 'Hop-forward beers, often citrusy, resinous, floral, or distinctly bitter.' },
    { id: 'Stout', label: 'Stout', description: 'Dark and full-bodied, often carrying roasted, coffee, cocoa, or caramel notes.' },
    { id: 'Sour & wild', label: 'Sour & wild', description: 'Bright, tart, and lively beers with fruit-led or gently funky character.' },
    { id: 'Wheat beer', label: 'Wheat beer', description: 'Soft, rounded, and lightly refreshing, often fruity or softly spiced.' },
    { id: 'Saison', label: 'Saison', description: 'Dry farmhouse-style beer with peppery spice, fruit, and a sparkling finish.' }
  ];

  const flavorOptions = [
    { id: 'Carbonated', description: 'lively bubbles' },
    { id: 'Bitter', description: 'firm, drying edge' },
    { id: 'Sweet', description: 'soft sugar or honey' },
    { id: 'Roasted', description: 'coffee, toast, cocoa' },
    { id: 'Fruity', description: 'berry, stone fruit, tropical' },
    { id: 'Hoppy', description: 'leafy, floral, resinous' },
    { id: 'Malty', description: 'bread, biscuit, cereal' },
    { id: 'Mild', description: 'gentle and easy-going' },
    { id: 'Citrusy', description: 'zest and bright peel' },
    { id: 'Spiced', description: 'pepper, clove, coriander' },
    { id: 'Sour', description: 'tangy and tart' },
    { id: 'Dry', description: 'clean, snappy finish' }
  ];

  const initialBeers = [
    {
      id: 1,
      name: 'Zwickel No. 5',
      type: 'Lager',
      style: 'Kellerbier',
      score: 4.7,
      reviews: 48,
      gradient: 'linear-gradient(140deg, #f1c46c 0%, #a85d17 100%)',
      flavors: ['Malty', 'Mild', 'Hoppy'],
      description: 'A soft, unfiltered lager with a fresh bread centre and a gentle herb-like lift.'
    },
    {
      id: 2,
      name: 'Night Shift',
      type: 'Stout',
      style: 'Oatmeal Stout',
      score: 4.5,
      reviews: 31,
      gradient: 'linear-gradient(140deg, #8d634a 0%, #25140d 100%)',
      flavors: ['Roasted', 'Malty', 'Mild'],
      description: 'Dark and silken, bringing roasted coffee and cocoa together without sharpness.'
    },
    {
      id: 3,
      name: 'Daylight Radio',
      type: 'IPA',
      style: 'West Coast IPA',
      score: 4.3,
      reviews: 27,
      gradient: 'linear-gradient(140deg, #f9d86a 0%, #c36916 100%)',
      flavors: ['Hoppy', 'Bitter', 'Citrusy'],
      description: 'Clear citrus and pine-like hops framed by a dry, assertive bitter finish.'
    },
    {
      id: 4,
      name: 'Cherry Current',
      type: 'Sour & wild',
      style: 'Flanders Red',
      score: 4.4,
      reviews: 19,
      gradient: 'linear-gradient(140deg, #d46a52 0%, #6e191a 100%)',
      flavors: ['Sour', 'Fruity', 'Dry'],
      description: 'A tart, cherry-led pour that stays bright and finishes with a woody dryness.'
    },
    {
      id: 5,
      name: 'Helles Belles',
      type: 'Lager',
      style: 'Helles',
      score: 4.6,
      reviews: 64,
      gradient: 'linear-gradient(140deg, #ffe486 0%, #d38613 100%)',
      flavors: ['Malty', 'Mild', 'Carbonated'],
      description: 'Pale, quietly sweet, and gently sparkling with a clean biscuit-like backbone.'
    },
    {
      id: 6,
      name: 'Greenhouse',
      type: 'Saison',
      style: 'Farmhouse Ale',
      score: 4.2,
      reviews: 16,
      gradient: 'linear-gradient(140deg, #e6c576 0%, #9d621c 100%)',
      flavors: ['Spiced', 'Fruity', 'Dry'],
      description: 'A bright farmhouse pour: soft fruit, peppery spice, and a lively dry finish.'
    }
  ];

  const journal = [
    { day: 'Today', title: 'A soft, malty pour', detail: 'Zwickel No. 5 · 4.7', color: '#d88924' },
    { day: '18 Aug', title: 'Dark and roasted', detail: 'Night Shift · 4.5', color: '#4a2d1c' },
    { day: '15 Aug', title: 'A hop-led evening', detail: 'Daylight Radio · 4.3', color: '#d2a228' }
  ];

  let beers = initialBeers;
  let search = '';
  let activeType = 'All types';
  let activeFlavors = [];
  let sort = 'Top rated';
  let favorites = [];
  let showForm = false;
  let showDetail = false;
  let selectedBeer = initialBeers[0];
  let toast = '';
  let newTasting = {
    name: '', type: 'Lager', score: 4.0, flavors: []
  };

  $: activeTypeInfo = beerTypes.find((type) => type.id === activeType) || beerTypes[0];
  $: newTypeInfo = beerTypes.find((type) => type.id === newTasting.type) || beerTypes[1];
  $: filteredBeers = beers
    .filter((beer) => {
      const matchSearch = `${beer.name} ${beer.type} ${beer.style} ${beer.flavors.join(' ')}`.toLowerCase().includes(search.toLowerCase());
      const matchType = activeType === 'All types' || beer.type === activeType;
      const matchFlavors = activeFlavors.every((flavor) => beer.flavors.includes(flavor));
      return matchSearch && matchType && matchFlavors;
    })
    .sort((a, b) => sort === 'Top rated' ? b.score - a.score : sort === 'Most reviewed' ? b.reviews - a.reviews : a.name.localeCompare(b.name));

  onMount(() => {
    initInstallPrompt();
    const stored = localStorage.getItem('bier-sv-favorites');
    if (stored) favorites = JSON.parse(stored);
  });

  function toggleFavorite(id) {
    favorites = favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id];
    localStorage.setItem('bier-sv-favorites', JSON.stringify(favorites));
  }

  function toggleFlavorFilter(flavor) {
    activeFlavors = activeFlavors.includes(flavor)
      ? activeFlavors.filter((item) => item !== flavor)
      : [...activeFlavors, flavor];
  }

  function toggleNewFlavor(flavor) {
    newTasting = {
      ...newTasting,
      flavors: newTasting.flavors.includes(flavor)
        ? newTasting.flavors.filter((item) => item !== flavor)
        : [...newTasting.flavors, flavor]
    };
  }

  function openBeer(beer) {
    selectedBeer = beer;
    showDetail = true;
  }

  function submitTasting() {
    if (newTasting.flavors.length === 0) return;
    const colorMap = {
      Lager: '#e0aa2d', IPA: '#bf7420', Stout: '#4a2d1c', 'Sour & wild': '#a33127', 'Wheat beer': '#d6a33a', Saison: '#bd8c22'
    };
    const newBeer = {
      id: Date.now(),
      name: newTasting.name.trim() || `Untitled ${newTasting.type} tasting`,
      type: newTasting.type,
      style: newTasting.type,
      score: Number(newTasting.score),
      reviews: 1,
      gradient: `linear-gradient(140deg, #f0ca75 0%, ${colorMap[newTasting.type] || '#8f5219'} 100%)`,
      flavors: newTasting.flavors,
      description: `A ${newTasting.type.toLowerCase()} recorded for its ${newTasting.flavors.map((flavor) => flavor.toLowerCase()).join(', ')} character.`
    };
    beers = [newBeer, ...beers];
    selectedBeer = newBeer;
    showForm = false;
    newTasting = { name: '', type: 'Lager', score: 4.0, flavors: [] };
    toast = 'Flavor profile saved to your journal';
    setTimeout(() => toast = '', 3200);
  }
</script>

<svelte:head>
  <title>Hopnote — Beer Flavor Journal</title>
  <meta name="description" content="Find beer styles you enjoy and keep the flavours worth remembering." />
</svelte:head>

<div class="app-shell">
  <header class="site-header">
    <a class="brand" href="/" aria-label="Hopnote home">
      <span class="brand-mark" aria-hidden="true"><span></span><span></span><span></span></span>
      <span>hopnote</span>
    </a>
    <nav aria-label="Primary navigation">
      <a class="active" href="#discover">Discover</a>
      <a href="#journal">My journal</a>
      <a href="#about">About tasting</a>
    </nav>
    <div class="header-actions">
      <button class="icon-button" aria-label="View favorites" on:click={() => { activeType = 'All types'; activeFlavors = []; search = ''; toast = favorites.length ? `${favorites.length} saved beer${favorites.length === 1 ? '' : 's'}` : 'No saved beers yet'; setTimeout(() => toast = '', 2600); }}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.9-8.6a5.5 5.5 0 0 0-.1-7.8Z"/></svg>
        {#if favorites.length}<span class="notification-dot">{favorites.length}</span>{/if}
      </button>
      <button class="primary-button compact" on:click={() => showForm = true}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
        Add a tasting
      </button>
    </div>
  </header>

  <main>
    <section class="hero" id="discover">
      <div class="hero-copy">
        <p class="eyebrow">A better way to remember a good beer</p>
        <h1>Find your flavour.<br /><em>Style by style.</em></h1>
        <p class="hero-text">Choose a beer type, notice what you taste, and keep a personal record of the flavour profiles you want to find again.</p>
        <div class="hero-actions">
          <button class="primary-button" on:click={() => showForm = true}>Describe a tasting <span>→</span></button>
          <a class="text-link" href="#explore">Explore beer types <span>↓</span></a>
        </div>
        <div class="hero-proof">
          <div class="avatar-stack" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
          <p><strong>Flavor-first tasting</strong><br />for curious drinkers</p>
        </div>
      </div>

      <div class="hero-art" aria-label="A golden beer glass illustration">
        <div class="sun-disc"></div>
        <div class="art-grain grain-one"></div><div class="art-grain grain-two"></div><div class="art-grain grain-three"></div>
        <div class="beer-glass">
          <div class="foam"><b></b><b></b><b></b><b></b><b></b></div>
          <div class="beer-liquid"><span></span><span></span><span></span></div>
          <div class="glass-shine"></div>
        </div>
        <p class="art-caption">A better vocabulary<br />for a good pour.</p>
      </div>
    </section>

    <section class="taste-strip" aria-label="Flavor-led tasting philosophy">
      <div><span class="strip-number">01</span><p><strong>Pick a beer type</strong><br />Start with the style in your glass.</p></div>
      <div><span class="strip-number">02</span><p><strong>Choose the flavours</strong><br />Select every note that stands out.</p></div>
      <div><span class="strip-number">03</span><p><strong>Find your patterns</strong><br />Return to the profiles you love.</p></div>
    </section>

    <section class="board-section" id="explore">
      <div class="section-heading">
        <div>
          <p class="eyebrow">The flavor board</p>
          <h2>Learn beer types<br />through taste.</h2>
        </div>
        <p class="section-summary">Select a type to see a plain-language description, then discover beers through their flavour profile.</p>
      </div>

      <div class="type-guide" aria-label="Beer type guide">
        {#each beerTypes as type}
          <button class:chosen={activeType === type.id} on:click={() => activeType = type.id}>
            <strong>{type.label}</strong>
            <span>{type.description}</span>
          </button>
        {/each}
      </div>

      <div class="flavor-focus" aria-label="Flavor filters">
        <div><p class="eyebrow">Flavor focus</p><p>Choose more than one to find beers matching all selected flavours.</p></div>
        <div class="flavor-pills">
          {#each flavorOptions as flavor}
            <button class:chosen={activeFlavors.includes(flavor.id)} on:click={() => toggleFlavorFilter(flavor.id)}>{flavor.id}</button>
          {/each}
        </div>
      </div>

      <div class="filter-bar">
        <label class="search-field">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="m16 16 4.5 4.5"/></svg>
          <input bind:value={search} placeholder="Search a beer or flavor" aria-label="Search a beer or flavor" />
        </label>
        <p class="active-filter-copy"><strong>{activeTypeInfo.label}</strong> · {activeTypeInfo.description}</p>
        <label class="select-wrap">Sort
          <select bind:value={sort} aria-label="Sort beers"><option>Top rated</option><option>Most reviewed</option><option>A–Z</option></select>
        </label>
      </div>

      {#if filteredBeers.length}
        <div class="beer-grid">
          {#each filteredBeers as beer}
            <article class="beer-card" class:featured={beer.id === 1}>
              <button class="favorite-button" class:saved={favorites.includes(beer.id)} aria-label={`Save ${beer.name}`} on:click={() => toggleFavorite(beer.id)}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.9-8.6a5.5 5.5 0 0 0-.1-7.8Z"/></svg>
              </button>
              <button class="beer-click-area" on:click={() => openBeer(beer)} aria-label={`Read flavor profile for ${beer.name}`}>
                <div class="beer-visual" style={`--beer-gradient: ${beer.gradient}`}>
                  <div class="mini-glass"><div class="mini-foam"></div><div class="mini-liquid"></div><div class="mini-shine"></div></div>
                  <span class="style-stamp">{beer.type}</span>
                </div>
                <div class="beer-info">
                  <div class="beer-title-row"><div><p class="brewery">{beer.type} · {beer.style}</p><h3>{beer.name}</h3></div><div class="score"><strong>{beer.score.toFixed(1)}</strong><span>★</span></div></div>
                  <p class="beer-description">{beer.description}</p>
                  <div class="beer-meta"><span>{beer.reviews} flavor profile{beer.reviews === 1 ? '' : 's'}</span><span>taste-led rating</span></div>
                  <div class="tasting-notes"><span>Flavor</span>{#each beer.flavors as flavor}<i>{flavor}</i>{/each}</div>
                </div>
              </button>
            </article>
          {/each}
        </div>
      {:else}
        <div class="empty-state"><div class="empty-mark"></div><h3>No flavor profiles found</h3><p>Try a different beer type or remove one of the selected flavours.</p><button class="primary-button compact" on:click={() => showForm = true}>Describe a tasting</button></div>
      {/if}
    </section>

    <section class="journal-section" id="journal">
      <div class="journal-intro">
        <p class="eyebrow">Your flavor journal</p>
        <h2>Every pour has<br />a flavour memory.</h2>
        <p>Build a personal map of the roasted, citrusy, malty, mild, hoppy, and sparkling profiles that you enjoy most.</p>
        <button class="outline-button" on:click={() => showForm = true}>Add a flavor profile <span>→</span></button>
      </div>
      <div class="journal-card">
        <div class="journal-card-head"><span>Recent tastings</span><button on:click={() => showForm = true}>+ Add profile</button></div>
        {#each journal as entry}
          <div class="journal-row"><span class="journal-mark" style={`--mark: ${entry.color}`}></span><div><p>{entry.day}</p><strong>{entry.title}</strong><small>{entry.detail}</small></div><span class="row-arrow">↗</span></div>
        {/each}
        <div class="journal-total"><span>YOUR FLAVOR SCORE</span><strong>4.5 <i>★</i></strong><p>Across 12 taste-led entries this month</p></div>
      </div>
    </section>
  </main>

  <footer id="about"><a class="brand" href="/"><span class="brand-mark" aria-hidden="true"><span></span><span></span><span></span></span><span>hopnote</span></a><p>For the flavours worth noticing, and the beers that bring them together.</p><span>Drink thoughtfully.</span></footer>

  {#if showForm}
    <div class="modal-backdrop" role="presentation" on:click={() => showForm = false}></div>
    <div class="modal flavor-modal" role="dialog" aria-modal="true" aria-labelledby="new-tasting-title">
      <button class="modal-close" aria-label="Close form" on:click={() => showForm = false}>×</button>
      <p class="eyebrow">New flavor profile</p><h2 id="new-tasting-title">Describe the taste</h2><p class="modal-intro">Start with the beer type, then select every flavour you notice. Location, alcohol, and bitterness numbers are left out on purpose.</p>
      <form on:submit|preventDefault={submitTasting}>
        <div class="form-grid"><label>Beer name <small>Optional</small><input bind:value={newTasting.name} placeholder="e.g. Velvet Season" /></label><label>Beer type<select bind:value={newTasting.type}>{#each beerTypes.filter((type) => type.id !== 'All types') as type}<option value={type.id}>{type.label}</option>{/each}</select><small>{newTypeInfo.description}</small></label></div>
        <fieldset class="flavor-selector"><legend>What did it taste like? <span>Choose one or more</span></legend><div>{#each flavorOptions as flavor}<button type="button" class:selected={newTasting.flavors.includes(flavor.id)} on:click={() => toggleNewFlavor(flavor.id)}><strong>{flavor.id}</strong><small>{flavor.description}</small></button>{/each}</div></fieldset>
        {#if newTasting.flavors.length === 0}<p class="flavor-required">Choose at least one flavour to save this tasting.</p>{/if}
        <label>Flavor score <span class="score-value">{Number(newTasting.score).toFixed(1)} / 5</span><input class="range" type="range" min="1" max="5" step="0.1" bind:value={newTasting.score} /></label>
        <button class="primary-button form-submit" type="submit" disabled={newTasting.flavors.length === 0}>Save flavor profile <span>→</span></button>
      </form>
    </div>
  {/if}

  {#if showDetail}
    <div class="modal-backdrop" role="presentation" on:click={() => showDetail = false}></div>
    <div class="modal detail-modal" role="dialog" aria-modal="true" aria-labelledby="beer-detail-title">
      <button class="modal-close" aria-label="Close details" on:click={() => showDetail = false}>×</button>
      <div class="detail-header"><div class="detail-glass" style={`--beer-gradient: ${selectedBeer.gradient}`}><div></div></div><div><p class="eyebrow">{selectedBeer.type}</p><h2 id="beer-detail-title">{selectedBeer.name}</h2><p>{selectedBeer.style} · taste-led profile</p></div></div>
      <div class="detail-score"><span>FLAVOR SCORE</span><strong>{selectedBeer.score.toFixed(1)} <i>★</i></strong><p>Based on {selectedBeer.reviews} flavor profile{selectedBeer.reviews === 1 ? '' : 's'}</p></div>
      <p class="detail-description">{selectedBeer.description}</p>
      <div class="detail-notes"><span>SELECTED FLAVOURS</span><div>{#each selectedBeer.flavors as flavor}<b>{flavor}</b>{/each}</div></div>
      <div class="detail-actions"><button class="outline-button" on:click={() => toggleFavorite(selectedBeer.id)}>{favorites.includes(selectedBeer.id) ? 'Saved to favorites' : 'Save this beer'}</button><button class="primary-button" on:click={() => { showDetail = false; showForm = true; }}>Describe yours <span>→</span></button></div>
    </div>
  {/if}

  {#if toast}<div class="toast" role="status">{toast}</div>{/if}

  <InstallPrompt />
</div>
