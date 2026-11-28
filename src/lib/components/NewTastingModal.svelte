<script lang="ts">
  import { untrack } from 'svelte';
  import { flavorAccent, flavors, selectableTypes } from '../data/beers.ts';
  import { suggestFlavors } from '../data/suggestions.ts';
  import Icon from './Icon.svelte';
  import RatingInput from './RatingInput.svelte';
  import type { HopnoteState } from '../store/tastings.svelte.ts';
  import type { TastingDraft, TastingPrefill } from '../types';

  let {
    onClose,
    onSave,
    onScan,
    store,
    prefill = null,
    suspended = false,
    editing = false,
  }: {
    onClose: () => void;
    onSave: (draft: TastingDraft) => void;
    onScan: () => void;
    store: HopnoteState;
    prefill?: TastingPrefill | null;
    suspended?: boolean;
    editing?: boolean;
  } = $props();

  function initialDraft(prefill: TastingPrefill | null): TastingDraft {
    return {
      name: prefill?.name || '',
      type: prefill?.type || 'Lager',
      score: prefill?.score ?? 4,
      flavors: [...(prefill?.flavors || [])],
      notes: prefill?.notes || '',
      ean: prefill?.ean || null,
      brewery: prefill?.brewery || '',
      image: prefill?.image || null,
      quantity: prefill?.quantity || '',
    };
  }

  let draft = $state<TastingDraft>(untrack(() => initialDraft(prefill)));
  let typeInfo = $derived(selectableTypes.find((type) => type.id === draft.type) || selectableTypes[0]);
  let suggestions = $derived(suggestFlavors(store.tastings, draft.flavors, draft.type));

  // The scanner can be opened while this dialog stays on screen — apply the
  // result as soon as it arrives without wiping the flavours already picked.
  $effect(() => {
    const next = prefill;
    if (!next) return;
    if (next.name !== undefined) draft.name = next.name;
    if (next.type !== undefined) draft.type = next.type;
    if (next.notes !== undefined) draft.notes = next.notes;
    if (next.ean !== undefined) draft.ean = next.ean;
    if (next.brewery !== undefined) draft.brewery = next.brewery;
    if (next.image !== undefined) draft.image = next.image;
    if (next.quantity !== undefined) draft.quantity = next.quantity;
    if (next.flavors !== undefined) draft.flavors = [...next.flavors];
    if (next.score !== undefined) draft.score = next.score;
  });

  function clearScan(): void {
    draft.ean = null;
    draft.brewery = '';
    draft.image = null;
    draft.quantity = '';
  }

  function toggleFlavor(id: string): void {
    draft.flavors = draft.flavors.includes(id)
      ? draft.flavors.filter((flavor) => flavor !== id)
      : [...draft.flavors, id];
  }

  function submit(): void {
    if (!draft.flavors.length) return;
    onSave(draft);
  }

  function onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && !suspended) onClose();
  }
</script>

<svelte:window onkeydown={onKeydown} />

<div class="modal-backdrop" role="presentation" onclick={onClose}></div>
<div class="modal" role="dialog" aria-modal="true" aria-labelledby="new-tasting-title">
  <button class="button button--subtle button--icon modal-close" aria-label="Close" onclick={onClose}>
    <Icon name="close" size={18} />
  </button>
  <p class="eyebrow">{editing ? 'Your journal' : 'New tasting'}</p>
  <h2 id="new-tasting-title">{editing ? 'Edit this memory' : 'Log a flavour memory'}</h2>
  <p class="modal-sub">
    {editing
      ? 'Adjust the flavours, score or note — the details you already saved stay in place.'
      : 'Start with the style, then pick every flavour that stood out. The numbers are optional — the taste is the point.'}
  </p>

  {#if draft.ean}
    <div class="scan-chip">
      {#if draft.image}<img src={draft.image} alt="" />{/if}
      <div class="scan-chip-copy">
        <strong>{draft.brewery || draft.name || 'Scanned bottle'}</strong>
        <small>EAN {draft.ean}{draft.quantity ? ` · ${draft.quantity}` : ''}</small>
      </div>
      <button
        type="button"
        class="button button--subtle button--icon"
        aria-label="Remove scanned product"
        title="Remove scanned product"
        onclick={clearScan}><Icon name="close" size={15} /></button
      >
    </div>
  {/if}

  <form
    onsubmit={(event) => {
      event.preventDefault();
      submit();
    }}
  >
    <div class="form-grid">
      <div class="field">
        <label for="tasting-name">Beer name <small>optional</small></label>
        <input id="tasting-name" bind:value={draft.name} placeholder="e.g. Velvet Season" />
      </div>
      <div class="field">
        <label for="tasting-type">Beer type</label>
        <select id="tasting-type" bind:value={draft.type}>
          {#each selectableTypes as type}<option value={type.id}>{type.label}</option>{/each}
        </select>
        <small>{typeInfo.description}</small>
      </div>
    </div>

    {#if !editing}
      <button type="button" class="scan-link" onclick={onScan} disabled={suspended}>
        <Icon name="scan" size={14} /> Scan a bottle label
      </button>
    {/if}

    <fieldset class="flavor-selector">
      <legend>What did it taste like? <span>choose one or more</span></legend>
      {#if suggestions.length}
        <div class="suggested-flavors">
          <span>{draft.flavors.length ? 'Goes with your picks' : 'Common in this style'}</span>
          {#each suggestions as id}
            <button type="button" class="chip" onclick={() => toggleFlavor(id)}>
              <i class="dot" style={`--chip-dot:${flavorAccent(id)}`}></i>{id}
            </button>
          {/each}
        </div>
      {/if}
      <div class="flavor-options">
        {#each flavors as flavor}
          <button
            type="button"
            class="flavor-option"
            class:on={draft.flavors.includes(flavor.id)}
            onclick={() => toggleFlavor(flavor.id)}
          >
            <strong>{flavor.id}</strong>
            <small>{flavor.hint}</small>
          </button>
        {/each}
      </div>
      {#if !draft.flavors.length}<p class="hint">Pick at least one flavour to save this tasting.</p>{/if}
    </fieldset>

    <div class="field score-field">
      <span class="field-label">Flavour score</span>
      <RatingInput bind:value={draft.score} />
    </div>

    <div class="field">
      <label for="tasting-notes">Tasting note <small>optional</small></label>
      <textarea id="tasting-notes" bind:value={draft.notes} placeholder="What made this one memorable?"
      ></textarea>
    </div>

    <div class="modal-actions">
      <button type="button" class="button button--subtle" onclick={onClose}>Cancel</button>
      <button type="submit" class="button button--primary" disabled={!draft.flavors.length}>
        <Icon name={editing ? 'check' : 'plus'} size={15} /> {editing ? 'Save changes' : 'Save tasting'}
      </button>
    </div>
  </form>
</div>
