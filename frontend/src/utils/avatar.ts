/**
 * Avatar URL resolver
 *
 * Priority:
 * 1. Real Twitter/X CDN photo stored in DB (pbs.twimg.com)
 * 2. unavatar.io stored in DB (already fetches real Twitter photo)
 * 3. Fallback: unavatar.io lookup by handle
 */
export function getAvatarUrl(handle: string, dbUrl?: string | null): string {
  if (dbUrl && dbUrl.startsWith('http') && (dbUrl.includes('pbs.twimg.com') || dbUrl.includes('unavatar.io'))) {
    return dbUrl;
  }
  const clean = handle.replace(/^@/, '');
  return `https://unavatar.io/twitter/${clean}`;
}
