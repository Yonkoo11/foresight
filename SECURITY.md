# Security — Foresight

Foresight is a fantasy sports platform for Crypto Twitter influencers. This document summarizes our security posture for reviewers and contributors.

## Architecture

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 + Vite | User interface |
| Backend | Express + TypeScript | API, auth, scoring |
| Database | PostgreSQL + Knex | Data storage |
| Auth | Privy + JWT (HS256) | Multi-method login |
| EVM Contracts | Solidity / Foundry | Entry fees, prize pools (Base Sepolia) |
| SOL Prizes | @solana/web3.js | Prize distribution (Solana Devnet) |

## Security Measures

### Authentication & Authorization
- Privy-based multi-auth (wallet, email, Twitter) with JWT session layer
- JWT tokens signed with HS256, algorithm explicitly pinned
- Access tokens: 15-minute expiry, stored in httpOnly secure cookies
- Refresh tokens: 30-day expiry, hashed (SHA-256) before database storage, scoped to refresh endpoint
- CSRF protection: double-submit cookie pattern on all mutation requests
- `requireAdmin` middleware enforced on all admin endpoints
- Rate limiting: 15 auth attempts / 15min, 3 prize claims / hour, 500 API calls / 15min

### Data Protection
- Database SSL enforced in production
- Twitter OAuth tokens encrypted at rest (AES-256-GCM)
- Structured logging with PII sanitization
- Audit log table tracks all admin and prize claim actions

### Infrastructure
- Helmet security headers with Content Security Policy
- HTTPS enforcement via x-forwarded-proto redirect
- CORS locked to production domain (ngrok only in development)
- SSRF protection on image proxy: domain whitelist, private IP blocking, timeout, size limit

### Smart Contracts
- Checks-Effects-Interactions (CEI) pattern on all financial functions
- Reentrancy protection: state zeroed before external calls
- Two-step ownership transfer (propose + accept)
- Emergency withdraw limited to accumulated platform fees only
- Duplicate address validation in contest rankings
- Minimum contest duration enforcement (1 hour)
- `.call{value:}()` used everywhere (no `.transfer()` gas limit issues)

### Solana Transaction Security
- Atomic prize claims: `UPDATE WHERE claimed=false RETURNING *`
- `finalized` commitment level for irreversible transactions
- Contest finalization race condition prevented with atomic status transitions

## Self-Audit Summary

A structured self-audit was conducted covering dependency scanning, static analysis, secret scanning, smart contract review, OWASP Top 10 assessment, and manual code review.

| Metric | Count |
|--------|-------|
| Total findings | 45 |
| Fixed | 41 |
| Accepted risk | 2 |
| Already mitigated | 2 |
| Deferred (transitive deps) | 1 |

All **critical** and **high** severity findings have been addressed.

### Accepted Risks
- Free league results off-chain (planned for on-chain anchoring post-launch)
- Simulated SOL transfers in development (gated by NODE_ENV)

### Deferred Items
- Transitive dependency vulnerabilities (upstream fixes needed)

### Recently Fixed (formerly deferred)
- JWT secrets rotated, .env.example documents generation procedure
- JWT access tokens shortened to 15 minutes (from 7 days)
- httpOnly cookies replace localStorage for token storage
- CSRF protection via double-submit cookie pattern

## Reporting Vulnerabilities

If you discover a security issue, please report it responsibly:
- Email: security@foresight.gg
- Do NOT open a public GitHub issue for security vulnerabilities

## Tools Used
- `pnpm audit` — dependency scanning
- `eslint-plugin-security` — code-level linting
- `semgrep` — SAST with OWASP + TypeScript rules
- OWASP ZAP — dynamic API testing
- `forge build` / `forge test` — Solidity compilation and testing
- Git history secret scanning
- AuditAgent (Nethermind) — AI vulnerability detection
