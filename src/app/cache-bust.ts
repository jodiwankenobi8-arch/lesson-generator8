/**
 * Cache Busting Identifier
 * 
 * Updated whenever we need to force a hard refresh across all clients.
 * This file is imported by App.tsx to ensure the build system picks up changes.
 */

export const CACHE_VERSION = '2026-02-28T19:30:00Z-auth-guard-fix';
export const DESIGN_SYSTEM = 'apple-orchard-storybook';
export const BUILD_NUMBER = 1007;

// Force module re-evaluation
if (typeof window !== 'undefined') {
  (window as any).__CACHE_VERSION = CACHE_VERSION;
  console.log('🍎 Apple Orchard Storybook - Cache Version:', CACHE_VERSION);
  console.log('🔐 Auth guards enabled - unauthenticated users redirect to /auth');
}