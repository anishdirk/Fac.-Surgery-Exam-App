import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getIsOnline, subscribeToNetworkStatus } from '../../hooks/useOnlineStatus';

describe('Network status utilities', () => {
  const originalOnLine = typeof navigator !== 'undefined' ? navigator.onLine : true;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    if (typeof navigator !== 'undefined') {
      Object.defineProperty(navigator, 'onLine', {
        value: originalOnLine,
        configurable: true,
      });
    }
  });

  it('getIsOnline returns true when navigator.onLine is true', () => {
    if (typeof navigator === 'undefined') {
      (globalThis as any).navigator = {};
    }
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      configurable: true,
    });
    expect(getIsOnline()).toBe(true);
  });

  it('getIsOnline returns false when navigator.onLine is false', () => {
    if (typeof navigator === 'undefined') {
      (globalThis as any).navigator = {};
    }
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      configurable: true,
    });
    expect(getIsOnline()).toBe(false);
  });

  it('subscribeToNetworkStatus receives updates when events are dispatched on window', () => {
    const eventTarget = new EventTarget();
    (globalThis as any).window = eventTarget;

    const statuses: boolean[] = [];
    const unsubscribe = subscribeToNetworkStatus((status) => {
      statuses.push(status);
    });

    eventTarget.dispatchEvent(new Event('offline'));
    eventTarget.dispatchEvent(new Event('online'));
    eventTarget.dispatchEvent(new Event('offline'));

    expect(statuses).toEqual([false, true, false]);

    unsubscribe();
    eventTarget.dispatchEvent(new Event('online'));
    expect(statuses).toEqual([false, true, false]);
  });
});
