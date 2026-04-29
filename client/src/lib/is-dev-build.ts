/** True when this bundle is not a production Vite build (`npm run dev` or non-production mode). */
export function isDevBuild(): boolean {
  return !import.meta.env.PROD;
}
