<script>
  import { onDestroy, onMount } from 'svelte';
  import Icon from './Icon.svelte';
  import {
    isValidGtin,
    looksLikeBeer,
    lookupOpenFoodFacts,
    normalizeEan,
    productToDraft,
  } from '../data/ean.js';

  let { onClose, onDetected } = $props();

  let videoEl = $state(null);
  let manualCode = $state('');
  // starting → scanning | manual → looking-up → found | missing | error
  let phase = $state('starting');
  let product = $state(null);
  let activeCode = $state('');
  let message = $state('');
  let valid = $state(true);

  let stream = null;
  let detector = null;
  let timer = null;
  let lookupController = null;
  let busy = false;
  let lastSeen = '';
  let destroyed = false;

  function stopCamera() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    detector = null;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
    }
    if (videoEl) videoEl.srcObject = null;
  }

  async function startCamera() {
    stopCamera();
    phase = 'starting';
    message = '';

    if (!navigator.mediaDevices?.getUserMedia) {
      phase = 'manual';
      message = 'Camera access is not available here. Enter the EAN printed on the label instead.';
      return;
    }

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      if (destroyed) {
        stopCamera();
        return;
      }
      if (videoEl) {
        videoEl.srcObject = stream;
        await videoEl.play().catch(() => {});
      }

      if (typeof window.BarcodeDetector !== 'undefined') {
        let formats = ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'gtin_14'];
        try {
          const supported = await window.BarcodeDetector.getSupportedFormats?.();
          if (supported) formats = formats.filter((format) => supported.includes(format));
        } catch {
          /* Fall through with the default list. */
        }
        if (formats.length) {
          detector = new window.BarcodeDetector({ formats });
          phase = 'scanning';
          timer = setInterval(scanFrame, 350);
          return;
        }
      }

      stopCamera();
      phase = 'manual';
      message = 'Live barcode scanning is not supported in this browser. Enter the EAN from the label instead.';
    } catch (error) {
      stopCamera();
      phase = 'manual';
      message =
        error?.name === 'NotAllowedError'
          ? 'Camera permission was declined. Enter the EAN from the label instead.'
          : 'The camera could not be started. Enter the EAN from the label instead.';
    }
  }

  async function scanFrame() {
    if (!detector || !videoEl || busy || phase !== 'scanning' || videoEl.readyState < 2) return;
    busy = true;
    try {
      const codes = await detector.detect(videoEl);
      const raw = codes?.[0]?.rawValue;
      if (raw && raw !== lastSeen) {
        lastSeen = raw;
        await useCode(raw);
      }
    } catch {
      /* A frame can fail while the camera is focusing — keep trying. */
    } finally {
      busy = false;
    }
  }

  async function useCode(raw) {
    const code = normalizeEan(raw);
    if (!code) return;

    stopCamera();
    activeCode = code;
    manualCode = code;
    valid = isValidGtin(code);
    phase = 'looking-up';
    message = '';
    product = null;

    lookupController?.abort();
    lookupController = new AbortController();
    try {
      const found = await lookupOpenFoodFacts(code, { signal: lookupController.signal });
      if (destroyed) return;
      product = found;
      phase = found ? 'found' : 'missing';
      message = found
        ? looksLikeBeer(found)
          ? ''
          : 'Open Food Facts lists this outside beer — check that it is the right product.'
        : 'No product matched this EAN in Open Food Facts.';
    } catch (error) {
      if (destroyed || error?.name === 'AbortError') return;
      phase = 'error';
      message = 'Could not reach Open Food Facts. Check your connection and try again.';
    }
  }

  function submitManual(event) {
    event.preventDefault();
    useCode(manualCode);
  }

  function confirm() {
    onDetected(productToDraft(product, activeCode));
  }

  function again() {
    stopCamera();
    product = null;
    activeCode = '';
    manualCode = '';
    message = '';
    valid = true;
    lastSeen = '';
    startCamera();
  }

  function onKeydown(event) {
    if (event.key === 'Escape') onClose();
  }

  onMount(() => {
    startCamera();
  });

  onDestroy(() => {
    destroyed = true;
    stopCamera();
    lookupController?.abort();
  });
</script>

<svelte:window onkeydown={onKeydown} />

<div class="modal-backdrop modal-backdrop--scanner" role="presentation" onclick={onClose}></div>
<div class="modal modal--scanner" role="dialog" aria-modal="true" aria-labelledby="scan-title">
  <button class="button button--subtle button--icon modal-close" aria-label="Close" onclick={onClose}>
    <Icon name="close" size={18} />
  </button>
  <p class="eyebrow">Barcode lookup</p>
  <h2 id="scan-title">Scan a bottle</h2>
  <p class="modal-sub">
    Point the camera at the EAN on the label, or type the number by hand. We look it up in Open Food Facts and
    fill in what we can.
  </p>

  <div class="scan-viewport" class:hidden={phase !== 'starting' && phase !== 'scanning'}>
    <!-- svelte-ignore a11y_media_has_caption -->
    <video bind:this={videoEl} autoplay playsinline muted></video>
    <div class="scan-frame" aria-hidden="true"></div>
    {#if phase === 'starting' || phase === 'scanning'}
      <p class="scan-overlay">{phase === 'starting' ? 'Starting the camera…' : 'Looking for a barcode…'}</p>
    {/if}
  </div>

  {#if phase === 'looking-up'}
    <div class="scan-status"><span class="scan-spinner"></span> Looking up {activeCode}…</div>
  {/if}

  {#if phase === 'found' && product}
    <div class="scan-product">
      {#if product.image}
        <img src={product.image} alt="" />
      {/if}
      <div class="scan-product-copy">
        <p class="eyebrow">{product.brand || 'Open Food Facts'}</p>
        <h3>{product.name || 'Unnamed product'}</h3>
        <p class="scan-product-meta">{product.quantity || 'Size unknown'} · EAN {activeCode}</p>
        {#if message}<p class="scan-warning">{message}</p>{/if}
      </div>
    </div>
  {/if}

  {#if phase === 'missing' || phase === 'error'}
    <div class="scan-result-note">
      <strong>{phase === 'error' ? 'Lookup failed' : 'No match yet'}</strong>
      <span>{message}</span>
      <small>EAN {activeCode} will still be saved with your tasting.</small>
    </div>
  {/if}

  {#if phase === 'manual' || phase === 'starting' || phase === 'scanning' || phase === 'looking-up'}
    <form class="scan-manual" onsubmit={submitManual}>
      <label for="scan-code">EAN on the label <small>8–14 digits</small></label>
      <div class="scan-manual-row">
        <input
          id="scan-code"
          inputmode="numeric"
          autocomplete="off"
          bind:value={manualCode}
          placeholder="e.g. 4006381333931"
        />
        <button type="submit" class="button button--primary" disabled={!manualCode.trim() || phase === 'looking-up'}>
          Look up
        </button>
      </div>
      {#if !valid && manualCode}
        <p class="hint">Check the digits — that code may not have a valid check digit.</p>
      {/if}
      {#if message && phase === 'manual'}<p class="hint">{message}</p>{/if}
    </form>
  {/if}

  <div class="modal-actions">
    {#if phase === 'found' || phase === 'missing' || phase === 'error'}
      <button type="button" class="button button--subtle" onclick={again}>Scan another</button>
      <button type="button" class="button button--primary" onclick={confirm}>
        <Icon name="plus" size={15} /> Add review
      </button>
    {:else}
      <button type="button" class="button button--subtle" onclick={onClose}>Cancel</button>
      <button type="button" class="button button--ghost" onclick={startCamera} disabled={phase === 'starting'}>
        Use camera
      </button>
    {/if}
  </div>
</div>
