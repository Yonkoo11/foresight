# Security Fixes — Priority & Action Items

**Generated:** 2026-03-01 | **Status:** PENDING REMEDIATION
**Critical Issues Blocking Production:** 5
**Timeline to Fix:** 2-3 days (CRITICAL + HIGH), then 1 day testing

---

## BLOCKING (Must Fix Before Any Deployment)

### 1. Remove CSRF Token from Response Body
**Severity:** CRITICAL | **File:** `/backend/src/api/auth.ts:329-330`

```typescript
// BEFORE (INSECURE):
sendSuccess(res, {
  csrfToken,  // ← Leaks to logs, telemetry, error handlers
  user: { ... }
});

// AFTER (SECURE):
sendSuccess(res, {
  // Don't return csrfToken; client reads from cookie
  user: { ... }
});
```

**Why:** Token returned in response body gets captured by logging systems and exposed to third parties (Sentry, DataDog, CloudFlare). Token is already in non-httpOnly cookie; exposing it in body adds nothing but risk.

**Estimated Time:** 5 minutes
**Testing:** Verify login response doesn't include `csrfToken` field

---

### 2. Fix Refresh Token Cookie Path
**Severity:** CRITICAL | **File:** `/backend/src/api/auth.ts:33-39`

```typescript
// BEFORE (FRAGILE):
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: 'lax' as const,
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: '/api/auth/refresh',  // ← Only sent to this exact path
};

// AFTER (ROBUST):
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: 'lax' as const,
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: '/',  // ← Sent to all requests
};
```

**Why:** Path restriction `/api/auth/refresh` breaks when URL structure changes, proxies rewrite paths, or code moves endpoints. The httpOnly + sameSite attributes already provide security; path is redundant and fragile.

**Estimated Time:** 2 minutes
**Testing:** Verify refresh token is sent to `/api/auth/refresh?foo=bar` (with query param)

---

### 3. Fix Refresh Token Deduplication Race Condition
**Severity:** CRITICAL | **File:** `/frontend/src/lib/apiClient.ts:36-70`

**Current Code (BROKEN):**
```typescript
let refreshPromise: Promise<boolean> | null = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retried) {
      original._retried = true;

      if (!refreshPromise) {
        // RACE CONDITION: Multiple concurrent 401s can all see !refreshPromise as true
        refreshPromise = apiClient
          .post('/api/auth/refresh')
          .then(() => true)
          .catch(() => false)
          .finally(() => {
            refreshPromise = null;
          });
      }

      const refreshed = await refreshPromise;
      if (refreshed) {
        return apiClient(original);
      }
    }

    return Promise.reject(error);
  },
);
```

**Fixed Code:**
```typescript
let refreshPromise: Promise<boolean> | null = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (
      error.response?.status === 401 &&
      !original._retried &&
      !original.url?.includes('/api/auth/refresh')
    ) {
      original._retried = true;

      // Create promise atomically
      if (!refreshPromise) {
        refreshPromise = (async () => {
          try {
            const res = await apiClient.post('/api/auth/refresh');
            return true;
          } catch (err) {
            console.error('[apiClient] Refresh failed:', err);
            return false;
          } finally {
            refreshPromise = null;
          }
        })();
      }

      const refreshed = await refreshPromise;
      if (refreshed) {
        // CSRF token is now in cookie (set by server response)
        return apiClient(original);
      }
    }

    return Promise.reject(error);
  },
);
```

**Why:** Multiple concurrent 401 errors can trigger multiple refresh requests, causing CSRF token mismatches. The `if (!refreshPromise)` check is non-atomic.

**Estimated Time:** 15 minutes
**Testing:** Fire 3 simultaneous requests with expired tokens, verify only 1 refresh occurs

---

### 4. Fix CSRF Exemption Logic
**Severity:** CRITICAL | **File:** `/backend/src/middleware/csrf.ts:20-28`

**Current Code (UNSAFE):**
```typescript
if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
  return next();
}

if (req.path === '/api/auth/verify') {
  return next();
}

// FOOTGUN: If no accessToken, skip CSRF (allows bypass on unauthenticated endpoints)
if (!req.cookies?.accessToken) {
  return next();
}
```

**Fixed Code:**
```typescript
const CSRF_EXEMPT_ROUTES = [
  '/api/auth/verify',    // Login endpoint
  '/api/auth/refresh',   // Refresh endpoint
  '/api/auth/logout',    // Logout endpoint
];

export function csrfProtection(req: Request, res: Response, next: NextFunction): void {
  // Safe methods don't need CSRF protection
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Explicit list of CSRF-exempt routes
  if (CSRF_EXEMPT_ROUTES.includes(req.path)) {
    return next();
  }

  // ALL other POST/PUT/PATCH/DELETE require CSRF, regardless of auth status
  const cookieToken = req.cookies['csrf-token'];
  const headerToken = req.headers['x-csrf-token'];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    res.status(403).json({ success: false, error: 'CSRF token mismatch' });
    return;
  }

  next();
}
```

**Why:** Current logic "if no accessToken, skip CSRF" is backwards and creates a footgun. Future endpoints without auth will automatically be CSRF-unprotected.

**Estimated Time:** 10 minutes
**Testing:** Try CSRF on authenticated endpoint (should fail), verify public endpoints are explicitly exempt

---

### 5. Remove Token Auth Header Fallback
**Severity:** CRITICAL | **File:** `/backend/src/middleware/auth.ts:18`

**Current Code (UNSAFE):**
```typescript
const token = req.cookies?.accessToken || extractTokenFromHeader(req.headers.authorization);
```

**Fixed Code (Option A - Cookies Only for Web):**
```typescript
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.accessToken;  // ← Cookies only

  if (!token) {
    res.status(401).json({ success: false, error: 'No token provided' });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
    return;
  }

  req.user = payload;
  next();
}

// For API clients, if needed:
export function authenticateApi(req: Request, res: Response, next: NextFunction): void {
  const token = extractTokenFromHeader(req.headers.authorization);

  if (!token) {
    res.status(401).json({ success: false, error: 'No token provided' });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
    return;
  }

  req.user = payload;
  next();
}
```

**Why:** Having both auth methods (cookies + headers) breaks CSRF protection. Web browsers should use cookies. API clients (if needed) should use headers on separate routes.

**Estimated Time:** 20 minutes
**Testing:** Verify web requests use cookies, API requests (if any) use headers

---

## HIGH PRIORITY (Before Public Launch)

### 6. Implement Logout Per-Session
**Severity:** HIGH | **File:** `/backend/src/api/auth.ts:478`

Add session ID cookie on login, use it in logout to delete only that session:

```typescript
// On login (after line 275)
res.cookie('sessionId', sessionId, {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: 'lax',
  path: '/',
});

// On logout
router.post('/logout', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const sessionId = req.cookies?.sessionId;

  if (sessionId) {
    await db('sessions').where({ id: sessionId }).del();
  } else {
    // Fallback for legacy clients
    const userId = req.user!.userId;
    await db('sessions').where({ user_id: userId }).del();
  }
  // ...
}));
```

**Estimated Time:** 15 minutes
**Testing:** Login on 2 devices, logout on 1, verify other device still works

---

### 7. Implement Refresh Token Rotation
**Severity:** HIGH | **File:** `/backend/src/api/auth.ts:419-467`

On successful refresh, issue new refresh token and invalidate old:

```typescript
router.post('/refresh', authLimiter, asyncHandler(async (req: Request, res: Response) => {
  const refreshTokenValue = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!refreshTokenValue) {
    throw new AppError('Refresh token is required', 400);
  }

  const payload = verifyToken(refreshTokenValue);
  if (!payload) {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const session = await db('sessions')
    .where({ refresh_token: hashToken(refreshTokenValue) })
    .first();

  if (!session) {
    throw new AppError('Session not found', 401);
  }

  if (new Date(session.expires_at) < new Date()) {
    await db('sessions').where({ id: session.id }).del();
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
    res.clearCookie('csrf-token', { path: '/' });
    throw new AppError('Session expired', 401);
  }

  // Create new tokens
  const newAccessToken = createAccessToken({
    userId: payload.userId,
    walletAddress: payload.walletAddress,
    role: payload.role,
  });

  const newRefreshToken = createRefreshToken({
    userId: payload.userId,
    walletAddress: payload.walletAddress,
    role: payload.role,
  });

  // Update with NEW refresh token (old one invalidated)
  await db('sessions')
    .where({ id: session.id })
    .update({
      access_token: newAccessToken,
      refresh_token: hashToken(newRefreshToken),  // ← New token, old one is now invalid
      updated_at: db.fn.now(),
    });

  res.cookie('accessToken', newAccessToken, ACCESS_COOKIE_OPTIONS);
  res.cookie('refreshToken', newRefreshToken, REFRESH_COOKIE_OPTIONS);

  sendSuccess(res, { refreshed: true });
}));
```

**Estimated Time:** 20 minutes
**Testing:** Verify old refresh token can't be reused after refresh

---

### 8. Fix Infinite Retry Loop
**Severity:** HIGH | **File:** `/frontend/src/hooks/usePrivyAuth.ts:71-76`

Implement exponential backoff with max retries:

```typescript
const retryCountRef = useRef(0);
const MAX_RETRIES = 3;

const syncWithBackend = useCallback(async () => {
  if (hasAttemptedAuth.current) return;
  hasAttemptedAuth.current = true;
  setSyncError(null);

  try {
    // ... existing sync logic ...
  } catch (error: any) {
    const status = error?.response?.status;

    if (status === 429) {
      setSyncError('rate_limited');
      hasAttemptedAuth.current = false;
    } else {
      retryCountRef.current++;

      if (retryCountRef.current <= MAX_RETRIES) {
        // Exponential backoff: 1s, 2s, 4s, 8s, 16s, 30s
        const delayMs = Math.min(
          1000 * Math.pow(2, retryCountRef.current - 1),
          30000
        );

        setTimeout(() => {
          hasAttemptedAuth.current = false;
          syncWithBackend();
        }, delayMs);
      } else {
        setSyncError('max_retries_exceeded');
      }
    }
  }
}, [getAccessToken, isBackendAuthed]);
```

**Estimated Time:** 15 minutes
**Testing:** Disconnect network, verify retries stop after 3 attempts

---

## MEDIUM PRIORITY (This Sprint)

### 9. Use Constant-Time CSRF Comparison
**File:** `/backend/src/middleware/csrf.ts:33`

```typescript
import crypto from 'crypto';

// Replace: if (!cookieToken || !headerToken || cookieToken !== headerToken)
// With:
if (!cookieToken || !headerToken) {
  res.status(403).json({ success: false, error: 'CSRF token mismatch' });
  return;
}

try {
  crypto.timingSafeEqual(Buffer.from(cookieToken), Buffer.from(headerToken));
} catch {
  res.status(403).json({ success: false, error: 'CSRF token mismatch' });
  return;
}
```

**Estimated Time:** 5 minutes

---

### 10. Add Token Validation Logging
**File:** `/backend/src/middleware/auth.ts:25-29`

```typescript
const payload = verifyToken(token);

if (!payload) {
  logger.warn('Token validation failed', {
    context: 'Authentication',
    ip: req.ip,
    userAgent: req.get('user-agent'),
    url: `${req.method} ${req.path}`,
  });

  res.status(401).json({ success: false, error: 'Invalid or expired token' });
  return;
}
```

**Estimated Time:** 5 minutes

---

### 11. Validate CSRF Token Format
**File:** `/frontend/src/lib/apiClient.ts:13-16`

```typescript
function getCsrfToken(): string | undefined {
  const match = document.cookie
    .split('; ')
    .find((c) => c.startsWith('csrf-token='));
  const token = match?.split('=')[1];

  // Validate: 64 hex characters
  if (token && /^[a-f0-9]{64}$/.test(token)) {
    return token;
  }

  if (token) {
    console.warn('[apiClient] Invalid CSRF token format');
  }

  return undefined;
}
```

**Estimated Time:** 5 minutes

---

### 12. Remove Window Reload
**File:** `/frontend/src/hooks/usePrivyAuth.ts:56`

```typescript
if (response.data?.success) {
  setIsBackendAuthed(true);
  console.log('[PrivyAuth] Backend session created');
  // Don't reload: window.location.reload();
}
```

**Estimated Time:** 2 minutes

---

### 13. Handle Logout Errors
**File:** `/frontend/src/hooks/usePrivyAuth.ts:112-121`

```typescript
const handleLogout = useCallback(async () => {
  try {
    await apiClient.post('/api/auth/logout');
  } catch (error) {
    console.error('[PrivyAuth] Backend logout failed:', error);
  } finally {
    // Always clear cookies, even if backend fails
    const cookieNames = ['accessToken', 'refreshToken', 'csrf-token', 'sessionId'];
    cookieNames.forEach(name => {
      document.cookie = `${name}=; path=/; max-age=0;`;
    });

    setIsBackendAuthed(false);
    await logout();
  }
}, [logout]);
```

**Estimated Time:** 5 minutes

---

## Implementation Order

1. **Day 1 (CRITICAL fixes):**
   - Fix #1: Remove CSRF from response (5 min)
   - Fix #2: Refresh token path (2 min)
   - Fix #3: Deduplication race (15 min)
   - Fix #4: CSRF exemption logic (10 min)
   - Fix #5: Remove header fallback (20 min)
   - **Subtotal:** 52 minutes

2. **Day 1 PM (HIGH fixes):**
   - Fix #6: Per-session logout (15 min)
   - Fix #7: Token rotation (20 min)
   - Fix #8: Retry backoff (15 min)
   - **Subtotal:** 50 minutes

3. **Day 2 (Testing & MEDIUM fixes):**
   - Test CSRF protection
   - Test refresh flow with concurrent requests
   - Test multi-device logout
   - Implement fixes #9-13 (30 minutes total)

4. **Day 3 (Final testing & deployment):**
   - Load testing on refresh flow
   - Penetration testing CSRF + token handling
   - Code review
   - Deploy to staging
   - Monitor logs for token failures

---

## Verification Checklist

- [ ] Login response doesn't include csrfToken field
- [ ] Refresh token sent to all routes (including `/api/auth/refresh?foo=bar`)
- [ ] Concurrent 401 requests only trigger 1 refresh
- [ ] Public endpoints explicitly CSRF-exempt
- [ ] Auth middleware uses cookies only (web routes)
- [ ] Logout on device A doesn't log out device B
- [ ] Refresh token rotates (old token no longer valid)
- [ ] Retry stops after 3 attempts (not infinite)
- [ ] Refresh token comparison uses timingSafeEqual
- [ ] Token validation failures are logged
- [ ] CSRF token format is validated before sending
- [ ] No page reload after login
- [ ] Logout errors are handled (cookies cleared)

---

## Deploy Checklist

- [ ] All CRITICAL fixes merged
- [ ] All HIGH fixes merged (before public launch)
- [ ] Unit tests pass
- [ ] Integration tests for auth flow pass
- [ ] Load test: 10 concurrent refresh requests
- [ ] Penetration test: CSRF token handling
- [ ] Code review by security team
- [ ] Staging deployment successful
- [ ] Monitor logs for 401/403 errors
- [ ] Alert on failed token validations

---

**Status:** Ready for implementation
**Priority:** CRITICAL — Do not deploy without fixes #1-5
**Next Step:** Create branch and implement fixes in priority order
