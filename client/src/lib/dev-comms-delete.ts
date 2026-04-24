/**
 * Bulk-delete communications by email is a dev-only tool (see docs/dev-comms-delete.md).
 * Production Vite builds set import.meta.env.PROD to true; local `npm run dev` does not.
 */
export function isDevCommsDeleteEnabled(): boolean {
  return !import.meta.env.PROD;
}
