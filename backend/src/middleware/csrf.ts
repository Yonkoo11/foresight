import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

/**
 * FINDING-021: CSRF protection using double-submit cookie pattern.
 *
 * On login, backend sets a non-httpOnly `csrf-token` cookie.
 * Frontend reads it and sends it as `X-CSRF-Token` header on mutations.
 * This middleware validates the header matches the cookie.
 *
 * Safe methods (GET, HEAD, OPTIONS) are exempt.
 * Auth routes (/api/auth/verify) are exempt (no session yet).
 */
export function csrfProtection(req: Request, res: Response, next: NextFunction): void {
  // Safe methods don't need CSRF protection
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Auth login/verify endpoints are exempt (user has no session cookie yet)
  if (req.path === '/api/auth/verify') {
    return next();
  }

  // If no access token cookie, this is likely a public/unauthenticated request — skip
  if (!req.cookies?.accessToken) {
    return next();
  }

  const cookieToken = req.cookies['csrf-token'];
  const headerToken = req.headers['x-csrf-token'];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    res.status(403).json({ success: false, error: 'CSRF token mismatch' });
    return;
  }

  next();
}

/**
 * Generate a random CSRF token
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}
