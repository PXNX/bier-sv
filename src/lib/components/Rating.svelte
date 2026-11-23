<script lang="ts">
  import { glassFills, ratingTone } from '../data/rating.ts';

  let {
    score,
    variant = 'badge',
    showNumber = true,
    showLabel = false,
  }: {
    score: number;
    variant?: 'badge' | 'hero' | 'compact';
    showNumber?: boolean;
    showLabel?: boolean;
  } = $props();

  const uid = $props.id();
  const GLASS = 'M4 2h8.5l-.9 13.2A2.4 2.4 0 0 1 9.2 17.5H6.8a2.4 2.4 0 0 1-2.4-2.3L3.5 2H4Z';

  let value = $derived(Math.min(5, Math.max(0, Number(score) || 0)));
  let tone = $derived(ratingTone(value));
  let fills = $derived(glassFills(value));
</script>

<div
  class={`rating rating--${variant}`}
  style={`--rating:${tone.color};--rating-soft:${tone.soft}`}
  role="img"
  aria-label={`${value.toFixed(1)} out of 5 — ${tone.label}`}
>
  <span class="rating-glasses" aria-hidden="true">
    {#each fills as fill, index}
      <svg class="rating-glass" viewBox="0 0 16 20">
        <defs>
          <clipPath id={`rating-fill-${uid}-${index}`}><path d={GLASS} /></clipPath>
        </defs>
        <path class="rating-glass-empty" d={GLASS} />
        <g clip-path={`url(#rating-fill-${uid}-${index})`}>
          <rect class="rating-glass-beer" x="0" y="0" width={fill * 16} height="20" />
          <path class="rating-glass-head" d={`M0 ${4 - fill * 2}h16v3H0Z`} />
        </g>
        <path class="rating-glass-outline" d={GLASS} />
      </svg>
    {/each}
  </span>

  {#if showNumber}
    <span class="rating-number">{value.toFixed(1)}</span>
  {/if}
  {#if showLabel}
    <span class="rating-label">{tone.label}</span>
  {/if}

  {#if variant === 'hero'}
    <div class="rating-meter" aria-hidden="true">
      <span class="rating-meter-fill" style={`width:${(value / 5) * 100}%`}></span>
      <span class="rating-meter-ticks"></span>
    </div>
  {/if}
</div>
