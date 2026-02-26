/**
 * Avatar URL resolver
 *
 * Priority:
 * 1. Real Twitter/X CDN photo if stored in DB (pbs.twimg.com)
 * 2. DiceBear pixel-art — deterministic seed from handle, always works,
 *    gives the app a consistent crypto/gaming aesthetic
 *
 * DiceBear pixel-art: same handle always generates same avatar everywhere.
 */
export function getAvatarUrl(handle: string, dbUrl?: string | null): string {
  if (dbUrl && dbUrl.startsWith('http') && dbUrl.includes('pbs.twimg.com')) {
    return dbUrl;
  }
  const seed = encodeURIComponent(handle.toLowerCase().replace(/^@/, ''));
  return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}&scale=80`;
}
