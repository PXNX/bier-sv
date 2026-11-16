<script>
  import { onMount } from 'svelte';
  import Icon from './lib/components/Icon.svelte';
  import InstallPrompt from './lib/pwa/InstallPrompt.svelte';
  import NewTastingModal from './lib/components/NewTastingModal.svelte';
  import DetailDrawer from './lib/components/DetailDrawer.svelte';
  import Overview from './lib/views/Overview.svelte';
  import Discover from './lib/views/Discover.svelte';
  import Journal from './lib/views/Journal.svelte';
  import Saved from './lib/views/Saved.svelte';
  import Insights from './lib/views/Insights.svelte';
  import { initInstallPrompt } from './lib/pwa/install.svelte.js';
  import { state as store } from './lib/store/tastings.svelte.js';

  const navigation = [
    { id: 'overview', label: 'Overview', icon: 'overview' },
    { id: 'discover', label: 'Discover', icon: 'discover' },
    { id: 'journal', label: 'Journal', icon: 'journal' },
    { id: 'saved', label: 'Saved', icon: 'saved' },
    { id: 'insights', label: 'Insights', icon: 'insights' },
  ];

  const pathFor = (id) => (id === 'overview' ? '/' : `/${id}`);
  const viewFor = (path) => {
    const segment = path.replace(/\/+$/, '').split('/').filter(Boolean).pop() || 'overview';
    return navigation.some((item) => item.id === segment) ? segment : 'overview';
  };

  let view = $state(viewFor(window.location.pathname));
  let search = $state('');
  let showForm = $state(false);
  let selectedBeer = $state(null);
  let toast = $state('');
  let toastTimer;

  let current = $derived(navigation.find((item) => item.id === view) || navigation[0]);
  let savedCount = $derived(store.favorites.length);

  onMount(() => {
    initInstallPrompt();
    // Normalize unknown paths and old `?view=` links into real routes.
    const legacyView = new URLSearchParams(window.location.search).get('view');
    if (legacyView && navigation.some((item) => item.id === legacyView)) {
      navigate(legacyView, true);
    } else if (window.location.pathname !== pathFor(view)) {
      window.history.replaceState({}, '', pathFor(view));
    }
  });

  function onPopState() {
    view = viewFor(window.location.pathname);
  }

  function navigate(id, replace = false) {
    view = id;
    if (id !== 'discover') search = '';
    if (window.location.pathname !== pathFor(id)) {
      window.history[replace ? 'replaceState' : 'pushState']({}, '', pathFor(id));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function notify(message) {
    toast = message;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (toast = ''), 3200);
  }

  function saveTasting(draft) {
    store.addTasting(draft);
    showForm = false;
    notify('Tasting saved to your journal');
  }

  function openBeer(beer) {
    selectedBeer = beer;
  }
</script>

<svelte:window onpopstate={onPopState} />

<svelte:head>
  <title>Hopnote — Your Beer Tasting Journal</title>
  <meta
    name="description"
    content="Find your flavour, note every pour, and keep a personal atlas of the beers worth remembering."
  />
</svelte:head>

<div class="shell">
  <aside class="sidebar">
    <div class="brand">
      <span class="brand-mark" aria-hidden="true"><Icon name="hop" size={19} /></span>
      <span class="brand-name">hop<em>note</em></span>
    </div>

    <p class="sidebar-label">Tasting room</p>
    <nav class="nav-list" aria-label="Primary navigation">
      {#each navigation as item}
        <button class="nav-item" class:active={view === item.id} onclick={() => navigate(item.id)}>
          <Icon name={item.icon} size={18} />
          {item.label}
          {#if item.id === 'saved' && savedCount}<span class="count">{savedCount}</span>{/if}
        </button>
      {/each}
    </nav>

    <div class="sidebar-spacer"></div>

    <div class="sidebar-note">
      <span class="sidebar-hop" aria-hidden="true"><Icon name="hop" size={64} /></span>
      <p class="eyebrow">A note on taste</p>
      <p>
        The best beers are the ones you can describe. Give each pour a few flavours and patterns will start to
        appear.
      </p>
    </div>
    <div class="sidebar-foot"><i></i> Saved on this device</div>
  </aside>

  <div class="main">
    <header class="topbar">
      <div class="mobile-head">
        <span class="brand-mark" aria-hidden="true"><Icon name="hop" size={17} /></span>
        <span class="brand-name">hop<em>note</em></span>
      </div>
      <span class="topbar-title">{current.label}</span>
      <span class="topbar-sub">/ {view}</span>
      <div class="topbar-spacer"></div>
      {#if view === 'discover'}
        <label class="topbar-search">
          <Icon name="search" size={15} />
          <input bind:value={search} placeholder="Search the board" aria-label="Search beers" />
        </label>
      {/if}
      <button
        class="button button--ghost button--icon"
        aria-label="View saved pours"
        onclick={() => navigate('saved')}
      >
        <Icon name="heart" size={17} />
      </button>
      <button class="button button--primary" onclick={() => (showForm = true)}
        ><Icon name="plus" size={15} /> <span class="button-label">New tasting</span></button
      >
    </header>

    <div class="page">
      {#if view === 'overview'}
        <Overview {store} onNavigate={navigate} onNew={() => (showForm = true)} onOpenBeer={openBeer} />
      {:else if view === 'discover'}
        <Discover {store} bind:search onOpenBeer={openBeer} onNew={() => (showForm = true)} />
      {:else if view === 'journal'}
        <Journal {store} onNew={() => (showForm = true)} onOpenBeer={openBeer} />
      {:else if view === 'saved'}
        <Saved {store} onOpenBeer={openBeer} onNavigate={navigate} />
      {:else if view === 'insights'}
        <Insights {store} onNavigate={navigate} />
      {/if}
    </div>
  </div>

  <nav class="mobile-tabs" aria-label="Mobile navigation">
    {#each navigation as item}
      <button class:on={view === item.id} onclick={() => navigate(item.id)}>
        <Icon name={item.icon} size={20} />
        {item.label}
      </button>
    {/each}
  </nav>
</div>

{#if showForm}
  <NewTastingModal onClose={() => (showForm = false)} onSave={saveTasting} />
{/if}

{#if selectedBeer}
  <DetailDrawer
    beer={selectedBeer}
    {store}
    onClose={() => (selectedBeer = null)}
    onNew={() => {
      selectedBeer = null;
      showForm = true;
    }}
  />
{/if}

{#if toast}<div class="toast" role="status">{toast}</div>{/if}

<InstallPrompt />
