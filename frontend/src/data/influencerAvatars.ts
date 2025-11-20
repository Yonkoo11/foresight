/**
 * Twitter Avatar Service for Crypto Influencers
 * Uses multiple fallback services for reliability
 */

/**
 * Get avatar URL for an influencer using multiple services
 * Services tried in order:
 * 1. unavatar.io (primary - fetches from Twitter)
 * 2. Component will fallback to tier-colored initials on error
 */
export function getInfluencerAvatar(handle: string): string {
  // Use unavatar.io which proxies Twitter avatars and handles CORS
  return `https://unavatar.io/twitter/${handle}`;
}
