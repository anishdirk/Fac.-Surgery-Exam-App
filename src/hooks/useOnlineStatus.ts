import { useState, useEffect } from 'react';

/**
 * Returns the current online status of the browser.
 */
export function getIsOnline(): boolean {
  if (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') {
    return navigator.onLine;
  }
  return true;
}

/**
 * Subscribes a listener callback to window online and offline events.
 * Returns an unsubscribe function.
 */
export function subscribeToNetworkStatus(callback: (isOnline: boolean) => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

/**
 * Hook to track whether the browser currently has network connectivity.
 * Uses navigator.onLine and subscribes to window 'online' and 'offline' events.
 */
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState<boolean>(getIsOnline);

  useEffect(() => {
    // Sync initial state on mount
    setIsOnline(getIsOnline());
    return subscribeToNetworkStatus(setIsOnline);
  }, []);

  return isOnline;
}
