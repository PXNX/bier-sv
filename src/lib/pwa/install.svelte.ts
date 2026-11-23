const DISMISSED_KEY = 'hopnote.install-dismissed';

export const installState = $state({
  available: false,
  dismissed: false,
  installed: false,
});

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

let deferred: InstallEvent | null = null;
let initialized = false;

export function initInstallPrompt(): () => void {
  if (initialized || typeof window === 'undefined') return () => {};
  initialized = true;

  try {
    installState.dismissed = localStorage.getItem(DISMISSED_KEY) === '1';
  } catch {
    installState.dismissed = false;
  }

  const onBeforeInstall = (event: Event) => {
    event.preventDefault();
    deferred = event as InstallEvent;
    installState.available = true;
    installState.dismissed = false;
  };

  const onInstalled = (): void => {
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

export async function promptInstall(): Promise<boolean> {
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

export function dismissInstall(): void {
  installState.dismissed = true;
  try {
    localStorage.setItem(DISMISSED_KEY, '1');
  } catch {
    /* storage may be unavailable; dismissal still applies for this session */
  }
}
