const DISMISSED_KEY = 'hopnote.install-dismissed';

export const installState = $state({
  available: false,
  dismissed: false,
  installed: false,
});

let deferred = null;
let initialized = false;

export function initInstallPrompt() {
  if (initialized || typeof window === 'undefined') return () => {};
  initialized = true;

  try {
    installState.dismissed = localStorage.getItem(DISMISSED_KEY) === '1';
  } catch {
    installState.dismissed = false;
  }

  const onBeforeInstall = (event) => {
    event.preventDefault();
    deferred = event;
    installState.available = true;
    installState.dismissed = false;
  };

  const onInstalled = () => {
    installState.installed = true;
    installState.available = false;
    deferred = null;
  };

  window.addEventListener('beforeinstallprompt', onBeforeInstall);
  window.addEventListener('appinstalled', onInstalled);

  return () => {
    window.removeEventListener('beforeinstallprompt', onBeforeInstall);
    window.removeEventListener('appinstalled', onInstalled);
    initialized = false;
  };
}

export async function promptInstall() {
  if (!deferred) return false;
  deferred.prompt();
  const { outcome } = await deferred.userChoice;
  deferred = null;
  installState.available = false;
  if (outcome === 'accepted') {
    installState.installed = true;
  } else {
    dismissInstall();
  }
  return outcome === 'accepted';
}

export function dismissInstall() {
  installState.dismissed = true;
  try {
    localStorage.setItem(DISMISSED_KEY, '1');
  } catch {
    /* storage may be unavailable; dismissal still applies for this session */
  }
}
