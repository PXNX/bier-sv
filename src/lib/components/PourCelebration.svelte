<script>
  import { onMount } from 'svelte';
  import BeerGlass from './BeerGlass.svelte';
  import Icon from './Icon.svelte';
  import { typeAccent } from '../data/beers.js';

  let { beer, onDone } = $props();

  let glass = $derived({ ...beer, accent: beer.accent || typeAccent(beer.type) });

  onMount(() => {
    const timer = setTimeout(onDone, 2200);
    return () => clearTimeout(timer);
  });
</script>

<div class="pour-overlay" role="status" aria-live="polite">
  <div class="pour-card">
    <div class="pour-stage">
      <span class="pour-spark pour-spark--a" aria-hidden="true"><Icon name="spark" size={16} /></span>
      <span class="pour-spark pour-spark--b" aria-hidden="true"><Icon name="spark" size={12} /></span>
      <span class="pour-spark pour-spark--c" aria-hidden="true"><Icon name="hop" size={16} /></span>
      <BeerGlass beer={glass} size="drawer" pouring />
    </div>
    <p class="pour-title">Cheers — logged!</p>
    <p class="pour-sub">{beer.name}</p>
  </div>
</div>

<style>
  .pour-overlay {
    position: fixed;
    inset: 0;
    z-index: 68;
    display: grid;
    place-items: center;
    pointer-events: none;
    background: rgba(6, 10, 7, 0.32);
    backdrop-filter: blur(2px);
    animation: pour-fade 0.22s ease both;
  }
  .pour-card {
    padding: 18px 26px 22px;
    text-align: center;
    border: 1px solid rgba(224, 162, 60, 0.3);
    border-radius: 18px;
    background: rgba(32, 44, 36, 0.96);
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.45);
    animation: pour-rise 0.4s cubic-bezier(0.18, 0.9, 0.3, 1.2) both;
  }
  .pour-stage {
    position: relative;
    width: 100px;
    height: 142px;
    margin: 0 auto 6px;
  }
  .pour-spark {
    position: absolute;
    color: var(--amber, #e0a23c);
    opacity: 0;
    animation: pour-spark 1.4s ease-out both;
  }
  .pour-spark--a {
    top: 8px;
    left: -30px;
    animation-delay: 0.5s;
  }
  .pour-spark--b {
    top: 34px;
    right: -26px;
    animation-delay: 0.72s;
  }
  .pour-spark--c {
    top: -12px;
    right: 2px;
    animation-delay: 0.95s;
  }
  .pour-title {
    margin: 0;
    font-family: var(--font-display);
    font-size: 20px;
    letter-spacing: -0.4px;
  }
  .pour-sub {
    margin: 4px 0 0;
    color: var(--muted, #9aa79a);
    font-size: 11px;
  }
  @keyframes pour-fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes pour-rise {
    from {
      opacity: 0;
      transform: translateY(18px) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  @keyframes pour-spark {
    0% {
      opacity: 0;
      transform: translateY(8px) scale(0.5) rotate(-20deg);
    }
    40% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateY(-22px) scale(1.1) rotate(20deg);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .pour-overlay,
    .pour-card,
    .pour-spark {
      animation-duration: 0.01ms;
      animation-iteration-count: 1;
    }
    .pour-spark {
      opacity: 0;
    }
  }
</style>
