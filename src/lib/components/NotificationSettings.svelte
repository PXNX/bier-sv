<script>
  import Icon from './Icon.svelte';
  import {
    notificationState,
    requestNotifications,
    setNotificationPref,
  } from '../pwa/notifications.svelte.js';

  let { onClose } = $props();

  function onKeydown(event) {
    if (event.key === 'Escape') onClose();
  }
</script>

<svelte:window onkeydown={onKeydown} />

<div class="modal-backdrop" role="presentation" onclick={onClose}></div>
<div class="modal modal--settings" role="dialog" aria-modal="true" aria-labelledby="notify-title">
  <button class="button button--subtle button--icon modal-close" aria-label="Close" onclick={onClose}>
    <Icon name="close" size={18} />
  </button>
  <p class="eyebrow">Gentle nudges</p>
  <h2 id="notify-title">Notifications</h2>
  <p class="modal-sub">
    Hopnote has no server — these reminders are scheduled on your device. Nothing about your journal is sent
    anywhere.
  </p>

  {#if !notificationState.supported}
    <div class="notify-note">
      <strong>Not available here</strong>
      <span>This browser does not support desktop notifications.</span>
    </div>
  {:else if notificationState.permission === 'denied'}
    <div class="notify-note">
      <strong>Blocked in browser settings</strong>
      <span>Allow notifications for this site in your browser, then come back to switch them on.</span>
    </div>
  {:else if notificationState.permission !== 'granted'}
    <div class="notify-note">
      <strong>Turn on gentle nudges?</strong>
      <span>Get a small note when a tasting is saved, a scan succeeds, or at your chosen time each day.</span>
    </div>
    <button class="button button--primary notify-enable" onclick={requestNotifications}>
      <Icon name="bell" size={15} /> Allow notifications
    </button>
  {:else}
    <div class="notify-list">
      <label class="switch-row">
        <span>
          <strong>Keep notifications on</strong>
          <small>Master switch for all nudges.</small>
        </span>
        <input
          type="checkbox"
          checked={notificationState.prefs.enabled}
          onchange={(event) => setNotificationPref('enabled', event.currentTarget.checked)}
        />
      </label>
      <label class="switch-row">
        <span>
          <strong>Saved tastings</strong>
          <small>A quick cheer when a pour lands in your journal.</small>
        </span>
        <input
          type="checkbox"
          checked={notificationState.prefs.saved}
          onchange={(event) => setNotificationPref('saved', event.currentTarget.checked)}
        />
      </label>
      <label class="switch-row">
        <span>
          <strong>Barcode lookups</strong>
          <small>Confirm when Open Food Facts finds your bottle.</small>
        </span>
        <input
          type="checkbox"
          checked={notificationState.prefs.scans}
          onchange={(event) => setNotificationPref('scans', event.currentTarget.checked)}
        />
      </label>
      <label class="switch-row">
        <span>
          <strong>Daily tasting reminder</strong>
          <small>A nudge at the time you choose.</small>
        </span>
        <input
          type="checkbox"
          checked={notificationState.prefs.reminder}
          onchange={(event) => setNotificationPref('reminder', event.currentTarget.checked)}
        />
      </label>
      {#if notificationState.prefs.reminder}
        <label class="notify-time">
          Remind me at
          <input
            type="time"
            value={notificationState.prefs.reminderTime}
            onchange={(event) => setNotificationPref('reminderTime', event.currentTarget.value)}
          />
        </label>
      {/if}
    </div>
    <p class="notify-foot">
      The daily reminder fires while Hopnote is open. On supported Android browsers it can also arrive in the
      background.
    </p>
  {/if}

  <div class="modal-actions">
    <button type="button" class="button button--subtle" onclick={onClose}>Done</button>
  </div>
</div>

<style>
  .modal--settings {
    width: min(480px, calc(100% - 28px));
  }
  .notify-note {
    display: grid;
    gap: 5px;
    padding: 14px;
    border: 1px solid var(--line-strong);
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.025);
    font-size: 12px;
  }
  .notify-note span {
    color: var(--muted);
    font-size: 11px;
    line-height: 1.6;
  }
  .notify-enable {
    margin-top: 14px;
  }
  .notify-list {
    display: grid;
    gap: 4px;
  }
  .switch-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    padding: 11px 0;
    border-bottom: 1px solid var(--line-strong);
    cursor: pointer;
  }
  .switch-row span {
    display: grid;
    gap: 3px;
  }
  .switch-row strong {
    font-size: 12px;
    font-weight: 600;
  }
  .switch-row small {
    color: var(--faint);
    font-size: 10px;
  }
  .switch-row input {
    flex: none;
    width: 17px;
    height: 17px;
    accent-color: var(--amber);
  }
  .notify-time {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
    color: var(--muted);
    font-size: 11px;
  }
  .notify-time input {
    padding: 7px 9px;
    border: 1px solid var(--line-strong);
    border-radius: 8px;
    outline: 0;
    background: rgba(255, 255, 255, 0.035);
    color: var(--ink);
    font: 12px var(--font-mono);
  }
  .notify-foot {
    margin: 14px 0 0;
    color: var(--faint);
    font-size: 10px;
    line-height: 1.6;
  }
</style>
