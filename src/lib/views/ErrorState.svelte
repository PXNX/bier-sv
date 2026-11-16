<script>
  import Icon from '../components/Icon.svelte';

  let { message = 'Something went wrong.', onReset } = $props();
</script>

<div class="error-page">
  <div class="error-visual" aria-hidden="true">
    <Icon name="hop" size={56} />
    <span class="mini-glass glass-stout">
      <span class="mini-liquid"></span>
      <span class="mini-foam"></span>
      <span class="mini-shine"></span>
    </span>
    <span class="error-code">500</span>
  </div>
  <p class="eyebrow">A spilled pint</p>
  <h1>We lost the <em>plot.</em></h1>
  <p class="lede">{message} Your journal is safe on this device — try loading the view again.</p>
  <div class="error-actions">
    <button class="button button--primary" onclick={onReset}>
      Start over <Icon name="arrow" size={15} />
    </button>
  </div>
</div>
