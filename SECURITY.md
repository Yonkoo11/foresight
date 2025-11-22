# Security Notes & Required Actions

## 🚨 CRITICAL: JWT Secret Exposure

**Status:** CRITICAL - Requires Immediate Action
**Impact:** Complete authentication bypass, token forgery possible

### Problem

The JWT secret is currently hardcoded in `/backend/.env`:
```
JWT_SECRET=b8f3d4e7a9c2f1e6d8b5a3c9f2e7d4b8a1c5e9f3d7b2a8c4e6f1d9b3a7c5e2f8
```

This file was committed to the repository, exposing the secret to anyone with access to the codebase.

### Required Actions

#### 1. Rotate JWT Secret Immediately
Generate a new, secure random secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### 2. Update Production Environment
Set the new JWT_SECRET in your production environment variables:
- Vercel: Project Settings → Environment Variables
- Railway: Project → Variables tab
- Heroku: Settings → Config Vars
- Docker: Pass as environment variable `-e JWT_SECRET=...`

#### 3. Remove from .env File
**DO NOT** store JWT_SECRET in `.env` file in production. Use environment-only secrets.

#### 4. Invalidate All Existing Tokens
After rotating the secret, all existing user sessions will be invalidated. Users will need to re-authenticate.

#### 5. Git History Cleanup (Optional but Recommended)
The secret exists in git history. Consider:
```bash
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch backend/.env' \
  --prune-empty --tag-name-filter cat -- --all
```

**Warning:** This rewrites git history. Coordinate with team before running.

---

## ✅ Security Improvements Implemented

### Authentication
- ✅ SIWE (Sign-In with Ethereum) authentication
- ✅ JWT tokens for session management
- ✅ Token expiration (7 days)
- ✅ Session tracking in database
- ✅ Rate limiting on auth endpoints
- ✅ Admin routes now require authentication

### API Security
- ✅ CORS configuration
- ✅ Parameterized SQL queries (prevents SQL injection)
- ✅ Input validation on critical endpoints
- ✅ Error boundary prevents crash-to-white-screen

### Access Control
- ✅ `/api/admin/*` endpoints require authentication
- ✅ Team operations require ownership verification
- ✅ Vote endpoints prevent double-voting

---

## ⚠️ Recommended Improvements

### 1. Add Role-Based Access Control (RBAC)
Currently all authenticated users can access admin endpoints. Add role field:
```sql
ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user';
-- Options: 'user', 'admin', 'moderator'
```

Then check role in admin middleware:
```typescript
if (user.role !== 'admin') {
  throw new AppError('Admin access required', 403);
}
```

### 2. Add Request Signing
For critical operations (team locking, prize distribution), require request signing:
```typescript
const signature = await signMessageAsync({
  message: `Lock team ${teamId} at ${timestamp}`
});
```

### 3. Implement Rate Limiting Per User
Current rate limiting is IP-based. Add user-based limits:
```typescript
const userLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  keyGenerator: (req) => req.user.id,
});
```

### 4. Add Audit Logging
Log all admin actions:
```typescript
await db('audit_log').insert({
  user_id: req.user.id,
  action: 'trigger_scoring',
  timestamp: new Date(),
  ip: req.ip,
});
```

### 5. Implement CSRF Protection
Add CSRF tokens for state-changing operations from web interface.

---

## 📋 Security Checklist

- [x] CORS properly configured
- [x] Rate limiting enabled
- [x] SQL injection prevented (parameterized queries)
- [x] XSS protection (React escapes by default)
- [x] Authentication required for sensitive endpoints
- [ ] **JWT secret rotated and moved to env-only**
- [ ] Role-based access control
- [ ] Audit logging
- [ ] CSRF protection
- [ ] Request signing for critical ops

---

## 🔐 Best Practices

### Environment Variables
**NEVER** commit these to git:
- `JWT_SECRET`
- `DATABASE_URL` (if contains password)
- API keys
- Private keys

### Secrets Management
Use a secrets manager in production:
- AWS Secrets Manager
- HashiCorp Vault
- Google Secret Manager
- GitHub Secrets (for CI/CD)

### Token Rotation
Rotate JWT secret periodically (quarterly recommended).

---

## 📞 Security Contact

If you discover a security vulnerability, please email:
**[Your Security Email]**

Do not open public GitHub issues for security vulnerabilities.
