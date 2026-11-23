<script lang="ts">
  let {
    brewery = '',
    logo = null,
    size = 30,
  }: {
    brewery?: string;
    logo?: string | null;
    size?: number;
  } = $props();

  let failed = $state(false);

  let initials = $derived(
    (brewery || '?')
      .replace(
        /^(privat|schloss|kloster|gasthaus|haus|micro|biermanufaktur|braumanufaktur|brauerei|brauhaus)\s*/gi,
        '',
      )
      .split(/[\s&-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase() || '?',
  );
</script>

<span class="brewery-mark" style={`--mark-size:${size}px`} title={brewery} aria-label={brewery}>
  {#if logo && !failed}
    <img src={logo} alt="" loading="lazy" onerror={() => (failed = true)} />
  {:else}
    <span>{initials}</span>
  {/if}
</span>

<style>
  .brewery-mark {
    width: var(--mark-size);
    height: var(--mark-size);
    flex: none;
    display: grid;
    place-items: center;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 8px;
    background: #f7efe0;
    box-shadow: 0 3px 9px rgba(0, 0, 0, 0.25);
  }
  .brewery-mark img {
    width: 100%;
    height: 100%;
    padding: 2px;
    object-fit: contain;
    background: #f7efe0;
  }
  .brewery-mark span {
    color: #2c3a2d;
    font: 700 11px var(--font-mono);
    letter-spacing: -0.5px;
  }
</style>
