<script>
  import Icon from '../components/Icon.svelte';

  let { onNavigate } = $props();
</script>

<div class="error-page">
  <div class="error-visual" aria-hidden="true">
    <Icon name="hop" size={56} />
    <span class="mini-glass glass-pils">
      <span class="mini-liquid"></span>
      <span class="mini-foam"></span>
      <span class="mini-shine"></span>
    </span>
    <span class="error-code">404</span>
  </div>
  <p class="eyebrow">Off the tap</p>
  <h1>This pour slipped <em>away.</em></h1>
  <p class="lede">
    The page you're looking for isn't on the board. Let's get you back to something worth tasting.
  </p>
  <div class="error-actions">
    <button class="button button--primary" onclick={() => onNavigate('discover')}>
      Back to the board <Icon name="arrow" size={15} />
    </button>
    <button class="button button--ghost" onclick={() => onNavigate('overview')}>Go to overview</button>
  </div>
</div>
