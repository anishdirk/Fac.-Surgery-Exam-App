// PWA Installation & Service Worker Manager
import { registerSW } from 'virtual:pwa-register';

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners: Array<(canInstall: boolean) => void> = [];

export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  
  const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
  const isIOSStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
  const isAndroidApp = document.referrer.includes('android-app://');

  return Boolean(isStandaloneMode || isIOSStandalone || isAndroidApp);
}

export function isAndroid(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /android/i.test(navigator.userAgent || '');
}

export function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent || '') && !(window as unknown as { MSStream?: unknown }).MSStream;
}

export function initPWA() {
  if (typeof window === 'undefined') return;

  // 1. Listen for beforeinstallprompt
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    notifyListeners(true);
  });

  // 2. Listen for appinstalled
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    notifyListeners(false);
  });

  // 3. Register Service Worker in production / browser
  registerServiceWorker();
}

export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    if (import.meta.env.DEV) {
      // In development mode, unregister any previously registered service worker
      // to avoid WebSocket HMR interception or stale cache conflicts
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
      }).catch(() => {});
      return;
    }

    try {
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });

      const updateSW = registerSW({
        immediate: true,
        onNeedRefresh() {
          console.log('DuoMed PWA update ready');
          updateSW(true);
        },
        onOfflineReady() {
          console.log('DuoMed PWA ready for offline surgical exam practice');
        },
        onRegisterError(error: any) {
          console.warn('Service Worker registration failed:', error);
        }
      });
    } catch (err) {
      console.warn('registerSW execution failed:', err);
    }
  }
}

export function onInstallAvailabilityChange(callback: (canInstall: boolean) => void): () => void {
  listeners.push(callback);
  callback(Boolean(deferredPrompt));
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
}

function notifyListeners(canInstall: boolean) {
  listeners.forEach((cb) => {
    try {
      cb(canInstall);
    } catch {
      // ignore
    }
  });
}

export async function promptPWAInstall(): Promise<'accepted' | 'dismissed' | 'manual'> {
  if (!deferredPrompt) {
    return 'manual';
  }

  try {
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      deferredPrompt = null;
      notifyListeners(false);
    }
    return choice.outcome;
  } catch (err) {
    console.warn('PWA prompt error', err);
    return 'manual';
  }
}
