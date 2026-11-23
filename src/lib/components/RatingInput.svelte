<script lang="ts">
  import { glassFills, ratingTone } from '../data/rating.ts';

  let {
    value = $bindable(4),
  }: {
    value: number;
  } = $props();

  let track: HTMLDivElement;
  let dragging = $state(false);
  let preview = $state<number | null>(null);

  let shown = $derived(preview ?? value);
  let tone = $derived(ratingTone(shown));
  let fills = $derived(glassFills(shown));
  let percent = $derived(((shown - 1) / 4) * 100);

  function clamp(next: number): number {
    return Math.min(5, Math.max(1, Math.round(next * 10) / 10));
  }

  function fromPointer(event: PointerEvent): void {
    const bounds = track.getBoundingClientRect();
    const fraction = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
    value = clamp(1 + fraction * 4);
  }

  function onPointerDown(event: PointerEvent): void {
    dragging = true;
    track.setPointerCapture(event.pointerId);
    fromPointer(event);
  }

  function onPointerMove(event: PointerEvent): void {
    const bounds = track.getBoundingClientRect();
    const fraction = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
    preview = Math.round((1 + fraction * 4) * 10) / 10;
    if (dragging) fromPointer(event);
  }

  function onPointerUp(): void {
    dragging = false;
  }

  function onKeyDown(event: KeyboardEvent): void {
    const steps: Record<string, number> = {
      ArrowRight: 0.1,
      ArrowUp: 0.1,
      ArrowLeft: -0.1,
      ArrowDown: -0.1,
      PageUp: 0.5,
      PageDown: -0.5,
    };
    if (event.key in steps) {
      event.preventDefault();
      value = clamp(value + steps[event.key]);
    } else if (event.key === 'Home') {
      event.preventDefault();
      value = 1;
    } else if (event.key === 'End') {
      event.preventDefault();
      value = 5;
    }
  }
</script>

<div class="rating-input" style={`--rating:${tone.color};--rating-soft:${tone.soft}`}>
  <div class="rating-input-readout">
    <span class="rating-input-value">{shown.toFixed(1)}<small>/5</small></span>
    <span class="rating-input-word">{tone.label}</span>
    <span class="rating-input-glasses" aria-hidden="true">
      {#each fills as fill, index}
        <svg viewBox="0 0 16 20" class="rating-glass">
          <defs>
            <clipPath id={`input-fill-${index}`}
              ><path
                d="M4 2h8.5l-.9 13.2A2.4 2.4 0 0 1 9.2 17.5H6.8a2.4 2.4 0 0 1-2.4-2.3L3.5 2H4Z"
              /></clipPath
            >
          </defs>
          <path
            class="rating-glass-empty"
            d="M4 2h8.5l-.9 13.2A2.4 2.4 0 0 1 9.2 17.5H6.8a2.4 2.4 0 0 1-2.4-2.3L3.5 2H4Z"
          />
          <g clip-path={`url(#input-fill-${index})`}>
            <rect class="rating-glass-beer" x="0" y="0" width={fill * 16} height="20" />
          </g>
          <path
            class="rating-glass-outline"
            d="M4 2h8.5l-.9 13.2A2.4 2.4 0 0 1 9.2 17.5H6.8a2.4 2.4 0 0 1-2.4-2.3L3.5 2H4Z"
          />
        </svg>
      {/each}
    </span>
  </div>

  <div
    class="rating-track"
    bind:this={track}
    role="slider"
    tabindex="0"
    aria-label="Flavour score"
    aria-valuemin="1"
    aria-valuemax="5"
    aria-valuenow={value}
    aria-valuetext={`${value.toFixed(1)} out of 5, ${ratingTone(value).label}`}
    onpointerdown={onPointerDown}
    onpointermove={onPointerMove}
    onpointerup={onPointerUp}
    onpointercancel={onPointerUp}
    onpointerleave={() => (preview = null)}
    onkeydown={onKeyDown}
  >
    <span class="rating-track-glow" style={`width:${percent}%`}></span>
    <span class="rating-track-fill" style={`width:${percent}%`}></span>
    <span class="rating-track-thumb" style={`left:${percent}%`}>
      <svg viewBox="0 0 16 20" aria-hidden="true">
        <path d="M4 2h8.5l-.9 13.2A2.4 2.4 0 0 1 9.2 17.5H6.8a2.4 2.4 0 0 1-2.4-2.3L3.5 2H4Z" />
      </svg>
    </span>
  </div>

  <div class="rating-scale" aria-hidden="true">
    <span>Session</span><span>Solid</span><span>Standout</span>
  </div>
</div>
