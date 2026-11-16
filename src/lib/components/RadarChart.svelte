<script>
  let { values = [], size = 190 } = $props();

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
        ly: c + Math.sin(angle) * (radius + 18)
      };
    })
  );

  let polygon = $derived(points.map((point) => `${point.x},${point.y}`).join(' '));
  let rings = [0.33, 0.66, 1];

  function ringPoints(scale) {
    return values
      .map((_, index) => {
        const angle = -Math.PI / 2 + (index * 2 * Math.PI) / values.length;
        return `${c + Math.cos(angle) * radius * scale},${c + Math.sin(angle) * radius * scale}`;
      })
      .join(' ');
  }
</script>

<svg viewBox="0 0 190 190" width={size} height={size} role="img" aria-label="Flavour profile radar chart">
  {#each rings as ring}
    <polygon points={ringPoints(ring)} fill="none" stroke="rgba(244,234,205,0.09)" stroke-width="1" />
  {/each}
  {#each points as point}
    <line x1={c} y1={c} x2={point.lx} y2={point.ly} stroke="rgba(244,234,205,0.07)" stroke-width="1" />
  {/each}
  <polygon points={polygon} fill="rgba(224,162,60,0.20)" stroke="#e0a23c" stroke-width="2" stroke-linejoin="round" />
  {#each points as point}
    <circle cx={point.x} cy={point.y} r="3" fill="#f2c978" />
    <text
      x={point.lx}
      y={point.ly}
      text-anchor={point.lx > c + 6 ? 'start' : point.lx < c - 6 ? 'end' : 'middle'}
      dominant-baseline="middle"
      fill="#a4b1a2"
      font-size="9"
      font-family="DM Mono, monospace"
    >{point.id}</text>
  {/each}
</svg>
