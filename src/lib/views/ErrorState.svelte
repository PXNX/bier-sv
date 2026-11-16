<script>
  import Icon from '../components/Icon.svelte';
  import BeerGlass from '../components/BeerGlass.svelte';

  let { message = 'Something went wrong.', status = 500, onReset } = $props();
  const sampleBeer = { name: 'Stout', accent: '#7b5138', style: 'Stout' };
</script>

<div class="error-page">
  <div class="error-visual" aria-hidden="true">
    <Icon name="hop" size={56} />
    <BeerGlass beer={sampleBeer} size="drawer" />
    <span class="error-code">{status}</span>
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
