// Local notifications for Hopnote. There is no push server: the app has no
// backend, so these are notifications scheduled and delivered on the device.
const PREFS_KEY = 'hopnote.notifications.v1';

const DEFAULT_PREFS = {
  enabled: false,
  saved: true,
  scans: true,
  reminder: false,
  reminderTime: '19:00',
};

export const notificationState = $state({
  supported: false,
  permission: 'default',
  prefs: { ...DEFAULT_PREFS },
});

let initialized = false;
let reminderTimer = null;

function loadPrefs() {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) Object.assign(notificationState.prefs, DEFAULT_PREFS, JSON.parse(raw));
  } catch {
    /* storage may be unavailable */
  }
}

function savePrefs() {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(notificationState.prefs));
  } catch {
    /* keep the in-memory copy */
  }
}

function canNotify() {
  return (
    notificationState.supported &&
    notificationState.permission === 'granted' &&
    notificationState.prefs.enabled
  );
}

// The service worker is registered in production only. In development `ready`
// never settles, so wait briefly and fall back to the page-level API.
async function serviceWorkerRegistration() {
  if (typeof navigator === 'undefined' || !navigator.serviceWorker) return null;
  return Promise.race([
    navigator.serviceWorker.ready.catch(() => null),
    new Promise((resolve) => setTimeout(() => resolve(null), 800)),
  ]);
}

export async function sendNotification(title, options = {}) {
  if (!canNotify()) return false;
  const details = {
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: 'hopnote-update',
    ...options,
  };
  try {
    const registration = await serviceWorkerRegistration();
    if (registration?.showNotification) {
      await registration.showNotification(title, details);
      return true;
    }
  } catch {
    /* fall back to the page-level Notification API */
  }
  try {
    new Notification(title, details);
    return true;
  } catch {
    return false;
  }
}

export function notifySaved(name) {
  if (!canNotify() || !notificationState.prefs.saved) return;
  sendNotification('Tasting saved', {
    body: name ? `${name} is in your journal.` : 'Your pour is in the journal.',
    tag: 'hopnote-saved',
  });
}

export function notifyScan(name) {
  if (!canNotify() || !notificationState.prefs.scans) return;
  sendNotification('Beer found', {
    body: name ? `${name} is ready to review.` : 'The barcode was read — add the rest of your review.',
    tag: 'hopnote-scan',
  });
}

export async function syncPeriodicSync() {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
  try {
    const registration = await serviceWorkerRegistration();
    if (!registration) return;
    if (!registration.periodicSync) return;
    if (canNotify() && notificationState.prefs.reminder) {
      await registration.periodicSync.register('hopnote-reminder', {
        minInterval: 24 * 60 * 60 * 1000,
      });
    } else {
      await registration.periodicSync.unregister('hopnote-reminder');
    }
  } catch {
    /* periodic background sync is optional and not available everywhere */
  }
}

function clearReminder() {
  if (reminderTimer) clearTimeout(reminderTimer);
  reminderTimer = null;
}

export function scheduleReminder() {
  clearReminder();
  if (!canNotify() || !notificationState.prefs.reminder) return;

  const [hours, minutes] = String(notificationState.prefs.reminderTime).split(':').map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return;

  const now = new Date();
  const next = new Date(now);
  next.setHours(hours, minutes, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);

  reminderTimer = setTimeout(() => {
    sendNotification('A little tasting reminder', {
      body: 'Open Hopnote and note what is in your glass today.',
      tag: 'hopnote-daily-reminder',
    });
    scheduleReminder();
  }, next.getTime() - now.getTime());
}

export function setNotificationPref(key, value) {
  if (!(key in DEFAULT_PREFS)) return;
  notificationState.prefs[key] = value;
  savePrefs();
  if (key === 'reminder' || key === 'reminderTime') {
    scheduleReminder();
    syncPeriodicSync();
  }
}

export async function requestNotifications() {
  if (!notificationState.supported) return false;
  let result;
  try {
    result = await Notification.requestPermission();
  } catch {
    return false;
  }
  notificationState.permission = result;
  if (result === 'granted') {
    notificationState.prefs.enabled = true;
    savePrefs();
    scheduleReminder();
    syncPeriodicSync();
  }
  return result === 'granted';
}

export function initNotifications() {
  if (initialized || typeof window === 'undefined') return () => {};
  initialized = true;

  notificationState.supported = 'Notification' in window;
  notificationState.permission = notificationState.supported ? Notification.permission : 'unsupported';
  loadPrefs();
  if (notificationState.permission === 'granted') {
    scheduleReminder();
    syncPeriodicSync();
  }

  if (navigator.permissions?.query && notificationState.supported) {
    navigator.permissions
      .query({ name: 'notifications' })
      .then((status) => {
        status.addEventListener?.('change', () => {
          notificationState.permission = Notification.permission;
          if (notificationState.permission !== 'granted') clearReminder();
        });
      })
      .catch(() => {});
  }

  return () => {
    clearReminder();
    initialized = false;
  };
}
