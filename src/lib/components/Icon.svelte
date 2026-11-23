<script>
  let { name, size = 18 } = $props();

  const paths = {
    overview:
      '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    discover: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
    journal: '<path d="M6 3h11a2 2 0 0 1 2 2v16H8a2 2 0 0 1-2-2V3Z"/><path d="M6 17h13M9.5 8h6M9.5 12h4"/>',
    saved: '<path d="M6 4h12v17l-6-4-6 4V4Z"/>',
    insights: '<path d="M4 20h16M7 16v-5M12 16V6M17 16v-8"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/>',
    heart:
      '<path d="M20.8 5.6a5.2 5.2 0 0 0-7.4 0L12 7l-1.4-1.4a5.2 5.2 0 1 0-7.4 7.4L12 21l8.8-8a5.2 5.2 0 0 0 0-7.4Z"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6"/>',
    arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
    spark: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/>',
    location:
      '<path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z"/><circle cx="12" cy="10" r="2.4"/>',
    download: '<path d="M12 3v12m0 0 4-4m-4 4-4-4M4 18v2h16v-2"/>',
    scan: '<path d="M4 6v12M7.5 6v12M11 6v12M14.5 6v12M18 6v12M21 6v12"/>',
    hop: '<path d="M12 3c3.4 2 5.5 5.3 5.5 9.2 0 4.2-2.3 7.6-5.5 8.8-3.2-1.2-5.5-4.6-5.5-8.8C6.5 8.3 8.6 5 12 3Z"/><path d="M12 6v14M8.8 9.5 12 11.5l3.2-2M8.4 13.2 12 15l3.6-1.8"/>',
  };
</script>

<svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">{@html paths[name] || ''}</svg>

<style>
  svg {
    fill: none;
    stroke: currentColor;
    stroke-width: 1.7;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
</style>
