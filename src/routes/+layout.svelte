<script lang="ts">
  import { onMount } from 'svelte';
  import type { Snippet } from 'svelte';
  import { page } from '$app/state';
  import '../lib/styles/theme.css';
  import Icon from '#lib/components/Icon.svelte';
  import InstallPrompt from '#lib/pwa/InstallPrompt.svelte';
  import NewTastingModal from '#lib/components/NewTastingModal.svelte';
  import EanScannerModal from '#lib/components/EanScannerModal.svelte';
  import NotificationSettings from '#lib/components/NotificationSettings.svelte';
  import PourCelebration from '#lib/components/PourCelebration.svelte';
  import DetailDrawer from '#lib/components/DetailDrawer.svelte';
  import { initInstallPrompt } from '#lib/pwa/install.svelte.ts';
  import { initNotifications, notifySaved, notifyScan } from '#lib/pwa/notifications.svelte.ts';
  import { state as store } from '#lib/store/tastings.svelte.ts';
  import {
    ui,
    openForm,
    openFormWith,
    closeForm,
    openScanner,
    closeScanner,
    openNotifications,
    closeNotifications,
    celebratePour,
    endPour,
    closeBeer,
    notify,
    clearToast,
  } from '#lib/store/ui.svelte.ts';

  import { navigate, pathFor } from '#lib/navigation.ts';
  import { prefillFromBeer } from '#lib/data/prefill.ts';
  import { earnedMilestones, milestoneLabel } from '#lib/data/milestones.ts';
  import { SUPPORT_URL } from '#lib/data/support.ts';
  import type { TastingDraft, TastingPrefill, ViewId } from '#lib/types.ts';

  let { children }: { children: Snippet } = $props();

  type NavItem = {
    id: ViewId;
    label: string;
    icon: 'overview' | 'discover' | 'journal' | 'saved' | 'insights';
  };
  const navigation: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: 'overview' },
    { id: 'discover', label: 'Discover', icon: 'discover' },
    { id: 'journal', label: 'Journal', icon: 'journal' },
    { id: 'saved', label: 'Saved', icon: 'saved' },
    { id: 'insights', label: 'Insights', icon: 'insights' },
  ];

  let known = $derived(navigation.some((item) => pathFor(item.id) === page.url.pathname));
  let current = $derived(
    navigation.find((item) => pathFor(item.id) === page.url.pathname) ?? { label: 'Page not found' },
  );
  let savedCount = $derived(store.favorites.length);

  onMount(() => {
    initInstallPrompt();
    const stopNotifications = initNotifications();
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
      });
    }
    // App shortcuts in the installed PWA deep-link straight into a flow.
    if (page.url.searchParams.has('scan')) openScanner();
    else if (page.url.searchParams.has('new')) openForm();
    return stopNotifications;
  });

  $effect(() => {
    if (page.url.pathname !== '/discover') ui.search = '';
  });

  function saveTasting(draft: TastingDraft): void {
    const editingId = ui.editingId;
    if (editingId) {
      store.updateTasting(editingId, draft);
      closeForm();
      notify('Tasting updated');
      return;
    }
    const before = earnedMilestones(store.tastings);
    const saved = store.addTasting(draft);
    const fresh = earnedMilestones(store.tastings).find((id) => !before.includes(id));
    closeForm();
    notify(fresh ? `New milestone — ${milestoneLabel(fresh)}` : 'Tasting saved to your journal');
    notifySaved(draft.name);
    celebratePour(saved);
  }

  function handleScan(prefill: TastingPrefill): void {
    ui.scanPrefill = prefill;
    closeScanner();
    ui.showForm = true;
    notify(
      prefill.name ? `Found ${prefill.name} — check the details` : 'EAN saved — add the rest of your review',
    );
    notifyScan(prefill.name);
  }
</script>

<div class="shell">
  <aside class="sidebar">
    <a class="brand" href="/" aria-label="Hopnote home">
      <span class="brand-mark" aria-hidden="true"><Icon name="hop" size={19} /></span>
      <span class="brand-name">hop<em>note</em></span>
    </a>

    <p class="sidebar-label">Tasting room</p>
    <nav class="nav-list" aria-label="Primary navigation">
      {#each navigation as item}
        <button
          class="nav-item"
          class:active={pathFor(item.id) === page.url.pathname}
          onclick={() => navigate(item.id)}
        >
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
    <a class="support-link" href={SUPPORT_URL} target="_blank" rel="noopener noreferrer">
      <Icon name="heart" size={14} /> Buy me a pint
    </a>
    <div class="sidebar-foot"><i></i> Saved on this device</div>
  </aside>

  <div class="main">
    <header class="topbar">
      <a class="mobile-head" href="/" aria-label="Hopnote home">
        <span class="brand-mark" aria-hidden="true"><Icon name="hop" size={17} /></span>
        <span class="brand-name">hop<em>note</em></span>
      </a>
      <span class="topbar-title">{current.label}</span>
      <span class="topbar-sub">/ {known ? page.url.pathname.replace(/^\//, '') || 'overview' : '404'}</span>
      <div class="topbar-spacer"></div>
      {#if page.url.pathname === '/discover'}
        <label class="topbar-search">
          <Icon name="search" size={15} />
          <input bind:value={ui.search} placeholder="Search the board" aria-label="Search beers" />
        </label>
      {/if}
      <button
        class="button button--ghost button--icon"
        aria-label="View saved pours"
        onclick={() => navigate('saved')}
      >
        <Icon name="heart" size={17} />
      </button>
      <button
        class="button button--ghost button--icon"
        aria-label="Scan a barcode"
        title="Scan a barcode"
        onclick={openScanner}
      >
        <Icon name="scan" size={17} />
      </button>
      <button
        class="button button--ghost button--icon"
        aria-label="Notification settings"
        title="Notifications"
        onclick={openNotifications}
      >
        <Icon name="bell" size={17} />
      </button>
      <button class="button button--primary" onclick={openForm}>
        <Icon name="plus" size={15} /> <span class="button-label">New tasting</span>
      </button>
    </header>

    <div class="page">
      <svelte:boundary>
        {@render children()}

        {#snippet failed(error, reset)}
          <div class="error-page">
            <p class="eyebrow">A spilled pint</p>
            <h1>We lost the <em>plot.</em></h1>
            <p class="lede">
              {error instanceof Error ? error.message : 'Something went wrong.'} Your journal is safe on this device.
            </p>
            <button
              class="button button--primary"
              onclick={() => {
                reset();
                navigate('overview');
              }}>Start over</button
            >
          </div>
        {/snippet}
      </svelte:boundary>
    </div>
  </div>

  <nav class="mobile-tabs" aria-label="Mobile navigation">
    {#each navigation as item}
      <button class:on={pathFor(item.id) === page.url.pathname} onclick={() => navigate(item.id)}>
        <Icon name={item.icon} size={20} />
        {item.label}
      </button>
    {/each}
  </nav>
</div>

{#if ui.showForm}
  <NewTastingModal
    onClose={closeForm}
    onSave={saveTasting}
    onScan={openScanner}
    {store}
    prefill={ui.scanPrefill}
    suspended={ui.showScanner}
    editing={!!ui.editingId}
  />
{/if}

{#if ui.showScanner}
  <EanScannerModal onClose={closeScanner} onDetected={handleScan} />
{/if}

{#if ui.showNotifications}
  <NotificationSettings onClose={closeNotifications} />
{/if}

{#if ui.selectedBeer}
  <DetailDrawer
    beer={ui.selectedBeer}
    {store}
    onClose={closeBeer}
    onLog={(beer) => openFormWith(prefillFromBeer(beer))}
  />
{/if}

{#if ui.toast}
  <div class="toast" role="status">
    <span>{ui.toast}</span>
    {#if ui.toastAction}
      <button
        class="toast-action"
        onclick={() => {
          ui.toastAction?.run();
          clearToast();
        }}>{ui.toastAction.label}</button
      >
    {/if}
  </div>
{/if}

{#if ui.celebrate}
  <PourCelebration beer={ui.celebrate} onDone={endPour} />
{/if}

<InstallPrompt />
