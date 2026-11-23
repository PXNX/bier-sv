<script lang="ts">
  let {
    segments = [],
    size = 146,
  }: {
    segments?: { label: string; value: number; color: string }[];
    size?: number;
  } = $props();

  const radius = 52;
  const circumference = 2 * Math.PI * radius;

  let total = $derived(segments.reduce((sum, segment) => sum + segment.value, 0) || 1);

  let arcs = $derived.by(() => {
    let accumulated = 0;
    return segments.map((segment) => {
      const fraction = segment.value / total;
      const arc = {
        ...segment,
        dash: `${fraction * circumference} ${circumference}`,
        offset: -accumulated * circumference,
      };
      accumulated += fraction;
      return arc;
    });
  });
</script>

<svg viewBox="0 0 140 140" width={size} height={size} role="img" aria-label="Style distribution chart">
  <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="15" />
  {#each arcs as arc}
    <circle
      cx="70"
      cy="70"
      r={radius}
      fill="none"
      stroke={arc.color}
      stroke-width="15"
      stroke-dasharray={arc.dash}
      stroke-dashoffset={arc.offset}
      transform="rotate(-90 70 70)"
    />
  {/each}
  <text x="70" y="66" text-anchor="middle" fill="#f5efe1" font-family="Fraunces, serif" font-size="22"
    >{total}</text
  >
  <text
    x="70"
    y="84"
    text-anchor="middle"
    fill="#748474"
    font-family="DM Mono, monospace"
    font-size="8"
    letter-spacing="1">TASTINGS</text
  >
</svg>
