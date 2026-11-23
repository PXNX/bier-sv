<script lang="ts">
  let {
    values = [],
    size = 190,
  }: {
    values?: { id: string; value: number }[];
    size?: number;
  } = $props();

  const uid = $props.id();
  const c = 95;
  const radius = 62;

  let points = $derived(
    values.map((item, index) => {
      const angle = -Math.PI / 2 + (index * 2 * Math.PI) / values.length;
      const distance = Math.max(item.value, 0.05) * radius;
      return {
        id: item.id,
        value: item.value,
        x: c + Math.cos(angle) * distance,
        y: c + Math.sin(angle) * distance,
        lx: c + Math.cos(angle) * (radius + 19),
        ly: c + Math.sin(angle) * (radius + 18),
      };
    }),
  );

  let polygon = $derived(points.map((point) => `${point.x},${point.y}`).join(' '));
  let rings = [0.33, 0.66, 1];

  function ringPoints(scale: number) {
    return values
      .map((_, index) => {
        const angle = -Math.PI / 2 + (index * 2 * Math.PI) / values.length;
        return `${c + Math.cos(angle) * radius * scale},${c + Math.sin(angle) * radius * scale}`;
      })
      .join(' ');
  }
</script>

<svg viewBox="0 0 190 190" width={size} height={size} role="img" aria-label="Flavour profile radar chart">
  <defs>
    <radialGradient id={`radar-fill-${uid}`} cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f7d38a" stop-opacity="0.36" />
      <stop offset="100%" stop-color="#e0a23c" stop-opacity="0.08" />
    </radialGradient>
  </defs>
  {#each rings as ring}
    <polygon
      points={ringPoints(ring)}
      fill="none"
      stroke="rgba(244,234,205,0.13)"
      stroke-width="1"
      stroke-dasharray="3 4"
    />
  {/each}
  {#each points as point}
    <line x1={c} y1={c} x2={point.lx} y2={point.ly} stroke="rgba(244,234,205,0.07)" stroke-width="1" />
  {/each}
  <polygon
    points={polygon}
    fill={`url(#radar-fill-${uid})`}
    stroke="#f2c978"
    stroke-width="2.2"
    stroke-linejoin="round"
    class="radar-shape"
  />
  {#each points as point}
    <circle cx={point.x} cy={point.y} r="5" fill="#1b251e" stroke="#f2c978" stroke-width="2" />
    <circle cx={point.x} cy={point.y} r="1.8" fill="#fff3d2" />
    <text
      x={point.lx}
      y={point.ly}
      text-anchor={point.lx > c + 6 ? 'start' : point.lx < c - 6 ? 'end' : 'middle'}
      dominant-baseline="middle"
      fill="#b9c5b7"
      font-size="9"
      font-family="DM Mono, monospace">{point.id}</text
    >
  {/each}
  <circle cx={c} cy={c} r="2" fill="rgba(242,201,120,0.7)" />
</svg>
