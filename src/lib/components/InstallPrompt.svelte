<script>
  import { installState, promptInstall, dismissInstall } from '../install.svelte.js';
</script>

{#if installState.available && !installState.dismissed && !installState.installed}
  <div class="install-banner" role="status" aria-live="polite">
    <span class="install-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d="M12 3v11m0 0 4-4m-4 4-4-4M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" /></svg>
    </span>
    <div class="install-copy">
      <strong>Keep Hopnote close</strong>
      <span>Install the app for quick, offline tasting notes.</span>
    </div>
    <div class="install-actions">
      <button type="button" class="install-accept" onclick={promptInstall}>Install</button>
      <button type="button" class="install-dismiss" aria-label="Dismiss install prompt" onclick={dismissInstall}>×</button>
    </div>
  </div>
{/if}

<style>
  .install-banner {
    position: fixed;
    z-index: 60;
    left: 50%;
    bottom: 22px;
    transform: translateX(-50%);
    width: min(460px, calc(100% - 32px));
    display: flex;
    align-items: center;
    gap: 13px;
    padding: 13px 14px;
    border: 1px solid rgba(240, 224, 188, 0.16);
    border-radius: 14px;
    background: rgba(32, 44, 36, 0.96);
    box-shadow: 0 18px 44px rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(12px);
    animation: rise 0.3s ease both;
  }
  .install-mark {
    flex: none;
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    border-radius: 10px;
    background: rgba(224, 162, 60, 0.15);
    color: var(--amber, #e0a23c);
  }
  .install-mark svg { width: 20px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
  .install-copy { flex: 1; min-width: 0; display: grid; gap: 2px; }
  .install-copy strong { font-size: 13px; color: var(--ink, #f4efe3); }
  .install-copy span { font-size: 11px; color: var(--muted, #9aa79a); }
  .install-actions { display: flex; align-items: center; gap: 6px; }
  .install-accept {
    border: 0;
    border-radius: 8px;
    padding: 9px 14px;
    background: var(--amber, #e0a23c);
    color: #1a1207;
    font-size: 12px;
    font-weight: 700;
  }
  .install-dismiss {
    width: 28px;
    height: 28px;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: var(--muted, #9aa79a);
    font-size: 20px;
    line-height: 1;
  }
  .install-dismiss:hover { background: rgba(255, 255, 255, 0.07); color: var(--ink, #f4efe3); }
  @keyframes rise { from { opacity: 0; transform: translate(-50%, 14px); } to { opacity: 1; transform: translate(-50%, 0); } }
</style>
