/**
 * Simple runtime env accessor.
 *
 * This app is currently in-memory. When a backend is available, swap in REST calls
 * using NG_APP_API_BASE / NG_APP_BACKEND_URL (injected at runtime/build by the platform).
 */
export const appEnv = {
  apiBaseUrl:
    (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } })?.process?.env?.[
      'NG_APP_API_BASE'
    ] ??
    (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } })?.process?.env?.[
      'NG_APP_BACKEND_URL'
    ] ??
    '',
};
