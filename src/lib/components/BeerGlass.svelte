<script lang="ts">
  import { glassFor } from '../data/beers.ts';
  import { beerPalette } from '../data/palette.ts';
  import type { Beer } from '../types';

  type GlassConfig = {
    body: string;
    liquidTop: number;
    foamY: number;
    foamRx: number;
    stem?: string;
    base?: string;
    handle?: string;
  };

  let {
    beer,
    size = 'mini',
    pouring = false,
  }: {
    beer: Pick<Beer, 'style' | 'type' | 'accent'>;
    size?: 'mini' | 'drawer';
    pouring?: boolean;
  } = $props();
  const uid = $props.id();

  let kind = $derived(glassFor(beer));
  let palette = $derived(beerPalette(beer));

  const GLASSES: Record<string, GlassConfig> = {
    pils: {
      body: 'M33 18 L67 18 L65 124 Q65 130 59 130 L41 130 Q35 130 35 124 Z',
      liquidTop: 30,
      foamY: 25,
      foamRx: 17,
    },
    weizen: {
      body: 'M27 28 C27 15 38 10 50 10 C62 10 73 15 73 28 L68 116 C67 124 61 128 50 128 C39 128 33 124 32 116 Z',
      liquidTop: 34,
      foamY: 21,
      foamRx: 22,
    },
    kolsch: {
      body: 'M38 34 L62 34 L61 124 Q61 128 57 128 L43 128 Q39 128 39 124 Z',
      liquidTop: 44,
      foamY: 39,
      foamRx: 11,
    },
    alt: {
      body: 'M30 54 C30 48 36 46 50 46 C64 46 70 48 70 54 L68 118 C67 125 60 128 50 128 C40 128 33 125 32 118 Z',
      liquidTop: 62,
      foamY: 53,
      foamRx: 19,
    },
    tulip: {
      body: 'M24 28 C24 18 36 14 50 14 C64 14 76 18 76 28 C76 46 68 64 58 74 L55 86 L45 86 L42 74 C32 64 24 46 24 28 Z',
      liquidTop: 40,
      foamY: 27,
      foamRx: 24,
      stem: 'M50 86 L50 118 M36 120 Q50 114 64 120',
    },
    stout: {
      body: 'M30 22 L70 22 L66 124 Q66 130 60 130 L40 130 Q34 130 34 124 Z',
      liquidTop: 34,
      foamY: 29,
      foamRx: 19,
      base: 'M34 120 L66 120',
    },
    mug: {
      body: 'M28 26 L72 26 L70 124 Q70 129 65 129 L35 129 Q30 129 30 124 Z',
      liquidTop: 38,
      foamY: 33,
      foamRx: 21,
      handle: 'M72 46 C90 46 90 80 72 80',
    },
    goblet: {
      body: 'M22 28 C22 16 36 12 50 12 C64 12 78 16 78 28 C78 56 68 74 50 74 C32 74 22 56 22 28 Z',
      liquidTop: 40,
      foamY: 0,
      foamRx: 0,
      stem: 'M50 74 L50 116 M36 118 Q50 112 64 118',
    },
    wine: {
      body: 'M28 22 C28 14 38 11 50 11 C62 11 72 14 72 22 C72 48 64 62 50 62 C36 62 28 48 28 22 Z',
      liquidTop: 36,
      foamY: 0,
      foamRx: 0,
      stem: 'M50 62 L50 120 M38 122 Q50 116 62 122',
    },
  };

  let cfg = $derived(GLASSES[kind] || GLASSES.pils);
  const bubbles = [
    { x: 42, delay: 0, r: 1.9 },
    { x: 49, delay: 0.7, r: 2.6 },
    { x: 56, delay: 1.4, r: 1.6 },
    { x: 46, delay: 2.1, r: 2.2 },
    { x: 59, delay: 2.8, r: 1.4 },
    { x: 53, delay: 3.4, r: 2.4 },
  ];
  const droplets = [
    { x: 39, y: 58, r: 1.3 },
    { x: 60, y: 70, r: 1.1 },
    { x: 44, y: 84, r: 1.5 },
    { x: 57, y: 96, r: 1.2 },
    { x: 40, y: 108, r: 1 },
  ];
</script>

<svg
  class={`beer-glass glass-${kind} glass-${size}${pouring ? ' pouring' : ''}`}
  viewBox="0 0 100 140"
  style={`--accent:${palette.glow}`}
  role="img"
  aria-label={`${kind} glass`}
>
  <defs>
    <clipPath id={`glass-clip-${uid}`}><path d={cfg.body} /></clipPath>
    <linearGradient id={`glass-liquid-${uid}`} x1="0" y1="0" x2="0.25" y2="1">
      <stop offset="0%" style={`stop-color:${palette.liquid};stop-opacity:.98`} />
      <stop offset="30%" style={`stop-color:${palette.liquid};stop-opacity:.9`} />
      <stop offset="55%" stop-color="#fff3cf" stop-opacity=".12" />
      <stop offset="100%" stop-color="#1a1005" stop-opacity=".85" />
    </linearGradient>
    <linearGradient id={`glass-foam-${uid}`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color={palette.foam} />
      <stop offset="100%" style={`stop-color:${palette.foam};stop-opacity:.78`} />
    </linearGradient>
    <linearGradient id={`glass-body-${uid}`} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="rgba(255,255,255,.55)" />
      <stop offset="24%" stop-color="rgba(255,255,255,.14)" />
      <stop offset="76%" stop-color="rgba(255,255,255,.08)" />
      <stop offset="100%" stop-color="rgba(255,255,255,.42)" />
    </linearGradient>
  </defs>

  <ellipse class="glass-shadow" cx="50" cy="133" rx="31" ry="5" />

  {#if pouring}
    <rect class="glass-pour-stream" x="47" y="0" width="6" height={cfg.liquidTop} rx="3" />
  {/if}

  {#if cfg.stem}<path class="glass-stem" d={cfg.stem} />{/if}

  <path class="glass-body" d={cfg.body} />

  <g clip-path={`url(#glass-clip-${uid})`}>
    <rect
      class="glass-liquid"
      x="0"
      y={cfg.liquidTop}
      width="100"
      height="140"
      fill={`url(#glass-liquid-${uid})`}
    />
    <rect class="glass-surface" x="0" y={cfg.liquidTop} width="100" height="2" />
    {#each bubbles as bubble}
      <circle
        class="glass-bubble"
        cx={bubble.x}
        cy="116"
        r={bubble.r}
        style={`animation-delay:${bubble.delay}s`}
      />
    {/each}
    {#each droplets as drop}
      <circle class="glass-droplet" cx={drop.x} cy={drop.y} r={drop.r} />
    {/each}
  </g>

  {#if cfg.foamRx}
    <g class="glass-foam-group" style={`fill:url(#glass-foam-${uid})`}>
      <ellipse class="glass-foam" cx="50" cy={cfg.foamY} rx={cfg.foamRx} ry="6.5" />
      <circle class="glass-foam" cx={50 - cfg.foamRx * 0.58} cy={cfg.foamY - 4} r="4.5" />
      <circle class="glass-foam" cx={50 + cfg.foamRx * 0.5} cy={cfg.foamY - 4} r="3.8" />
      <circle class="glass-foam-bubble" cx={50 - cfg.foamRx * 0.2} cy={cfg.foamY - 2} r="1.4" />
      <circle class="glass-foam-bubble" cx={50 + cfg.foamRx * 0.24} cy={cfg.foamY - 1} r="1.1" />
    </g>
  {/if}

  <path class="glass-shine" d={`M41 ${cfg.liquidTop + 9} Q38 70 42 118`} />
  <path class="glass-shine glass-shine--thin" d={`M61 ${cfg.liquidTop + 15} Q64 84 60 117`} />
  <path class="glass-rim" d={cfg.body} stroke={`url(#glass-body-${uid})`} />
  {#if cfg.base}<path class="glass-base" d={cfg.base} />{/if}
  {#if cfg.handle}<path class="glass-handle" d={cfg.handle} />{/if}
</svg>
