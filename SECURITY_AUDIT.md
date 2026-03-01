# Security Audit — Foresight

**Started:** 2026-03-01
**Branch:** `audit/security-review`
**Status:** In Progress

---

## Architecture Overview

Foresight is a fantasy sports platform for Crypto Twitter influencers with two blockchain integrations:

| Layer | Tech | Chain | Purpose |
|-------|------|-------|---------|
| Entry Fees (Prized) | Solidity / Foundry | Base Sepolia (EVM) | `CTDraftPrizedV2.sol` — collects ETH, manages prize pools |
| Prize Distribution | Node.js + `@solana/web3.js` | Solana Devnet | Server-side treasury wallet sends SOL to winners |
| Free Leagues | PostgreSQL only | None | **CRITICAL: No on-chain verification** |
| Auth | Privy + JWT | N/A | Email/Twitter/wallet login via Privy, JWT for sessions |
| Backend | Express + TypeScript | N/A | Port 3001, Knex ORM for PostgreSQL |
| Frontend | React 18 + Vite | N/A | Port 5173, TailwindCSS |

### Critical Env Vars

| Variable | Sensitivity | Location |
|----------|------------|----------|
| `TREASURY_SECRET_KEY_BASE64` | **CRITICAL** | `backend/.env` — Solana keypair |
| `PRIVY_APP_SECRET` | **CRITICAL** | `backend/.env` — Auth provider secret |
| `JWT_SECRET` | **CRITICAL** | `backend/.env` — Session signing |
| `DATABASE_URL` | **CRITICAL** | `backend/.env` — PostgreSQL connection |

---

## Phase Tracker

| Phase | Status | Findings | Notes |
|-------|--------|----------|-------|
| 0: Setup | ✅ Complete | 1 | Branch, docs, snapshots created |
| 1A: Dependency Scanning | ✅ Complete | 4 | 1 critical, 10+ high, 8+ moderate across packages |
| 1B: SAST (Static Analysis) | ✅ Complete | 1 | Semgrep: XSS in image proxy (server.ts:127) |
| 1C: Secret Scanning | ✅ Complete | 1 | JWT secrets found in git history (2 distinct values) |
| 1D: Smart Contract Audit | ✅ Complete | 14 | 3 critical, 5 high, 6 medium across 10 contracts |
| 1E: Solana Tx Security Scan | ✅ Complete | 4 | Race condition, simulated tx, commitment level, finalization |
| 1F: Frontend Security Scan | ✅ Complete | 3 | localStorage JWT, no CSRF, no dangerouslySetInnerHTML (good) |
| 2A: Auth & Authorization | ✅ Complete | 7 | Admin no role check, JWT algo, token storage, logout, refresh |
| 2B: SOL Transaction Security | ✅ Complete | 4 | TOCTOU race, simulated fallback, commitment, finalization race |
| 2C: EVM Contract Security | ✅ Complete | 14 | Double finalization, reentrancy, rake math, rug-pull vector |
| 2D: API Input Validation | ✅ Complete | 3 | Duplicate influencers, limit/offset, admin batch |
| 2E: Frontend Security | ✅ Complete | 3 | localStorage, CSRF, VITE_ prefix clean |
| 2F: Database Security | ✅ Complete | 2 | No SSL, plaintext refresh tokens. SQL injection: SAFE (Knex) |
| 2G: Infrastructure & Config | ✅ Complete | 5 | SSRF proxy, ngrok CORS, HTTPS, CSP, console.log PII |
| 3: OWASP Top 10 | ✅ Complete | 5 | 6 FAIL, 3 PARTIAL, 1 PASS. 5 new findings (027-031) |
| 4: Fix & Harden | 🔄 In Progress | 18 | 18 findings fixed, 1 accepted, 26 remain (smart contracts + complex arch) |
| 5: Verify & Document | ⬜ Not Started | 0 | Re-scan, smoke test, SECURITY.md |

---

## Findings Summary

**Totals: 18 Fixed, 1 Accepted, 26 Open out of 45 findings**

| # | Severity | Category | Short Description | Status |
|---|----------|----------|-------------------|--------|
| 001 | **Critical** | Architecture | Free leagues off-chain | Open |
| 002 | **Critical** | SOL Transactions | Race condition in prize claim (TOCTOU) | Fixed ✅ |
| 003 | **Critical** | SSRF | Image proxy unvalidated URL | Fixed ✅ |
| 004 | **Critical** | Authorization | Admin endpoints no role check | Fixed ✅ |
| 005 | Low | SOL Transactions | Simulated transfers (gated by NODE_ENV) | Accepted |
| 006 | **Critical** | Secrets | JWT secrets in git history | Open |
| 007 | High | Auth / Frontend | JWT in localStorage | Open |
| 008 | High | API / DoS | No rate limit on prize claim | Fixed ✅ |
| 009 | High | Auth | No rate limit on token refresh | Fixed ✅ |
| 010 | High | Auth | Stolen tokens valid post-logout (7 days) | Open |
| 011 | High | Database | No SSL on DB connection | Fixed ✅ |
| 012 | High | CORS | ngrok allowed in production | Fixed ✅ |
| 013 | High | Infrastructure | No HTTPS enforcement | Fixed ✅ |
| 014 | High | SOL Transactions | Contest finalization race condition | Open |
| 015 | High | Auth / Database | Refresh tokens stored plaintext | Open |
| 016 | Medium | Auth | JWT algorithm not pinned | Fixed ✅ |
| 017 | Medium | Input Validation | Duplicate influencers in teams | Fixed ✅ |
| 018 | Medium | Info Disclosure | Console.log leaks PII/wallets | Fixed ✅ |
| 019 | Medium | SOL Transactions | 'confirmed' not 'finalized' commitment | Open |
| 020 | Medium | Headers | Helmet CSP not configured | Fixed ✅ |
| 021 | Medium | Frontend | Missing CSRF protection | Open |
| 022 | Medium | Input Validation | Unvalidated limit/offset params | Fixed ✅ |
| 023 | High | Dependencies | jws HMAC signature bypass (via jsonwebtoken) | Open |
| 024 | High | Dependencies | axios DoS via __proto__ | Fixed ✅ |
| 025 | High | Dependencies | react-router XSS + CSRF | Fixed ✅ |
| 026 | Medium | Dependencies | Multiple transitive vulns (hono, h3, minimatch, etc.) | Open |
| 027 | Medium | Injection | Twitter OAuth redirect unsanitized error param | Fixed ✅ |
| 028 | Medium | Cryptographic | Twitter access tokens unencrypted in DB | Open |
| 029 | Medium | Logging | No audit trail for admin/sensitive actions | Open |
| 030 | Medium | Auth | Expired sessions never garbage-collected | Open |
| 031 | Medium | Auth | Auth rate limiter too lenient (50-100/15min) | Fixed ✅ |
| 032 | **Critical** | Smart Contract | Double finalization — prizes redistributed | Open |
| 033 | **Critical** | Smart Contract | Reentrancy on prize claims | Open |
| 034 | **Critical** | Smart Contract | Rake calculation integer arithmetic bug | Open |
| 035 | High | Smart Contract | No duplicate validation in rankings array | Open |
| 036 | High | Smart Contract | emergencyWithdraw() rug-pull vector | Open |
| 037 | High | Smart Contract | Unsafe .transfer() in 3 contracts | Open |
| 038 | High | Smart Contract | Prize pool underflow on small contests | Open |
| 039 | High | Smart Contract | Contest finalized before end time | Open |
| 040 | Medium | Smart Contract | No min duration lock→end | Open |
| 041 | Medium | Smart Contract | Single-step ownership transfer | Open |
| 042 | Medium | Smart Contract | Unbounded allPlayers array DoS | Open |
| 043 | Medium | Smart Contract | ReputationEngine division-by-zero | Open |
| 044 | Medium | Smart Contract | Treasury zero-fee distribution | Open |
| 045 | Medium | Smart Contract | QuestRewards budget exceeds balance | Open |

See `AUDIT_FINDINGS.md` for full details on each finding.

---

## Tools Used

### Confirmed
- [x] `pnpm audit` — dependency vulnerability scanning (frontend + backend + contracts)
- [x] `eslint-plugin-security` — code-level security linting
- [x] `semgrep` — SAST with OWASP + TypeScript rulesets
- [x] Git history secret scan — leaked keys in commit history
- [x] OWASP ZAP — dynamic testing against running backend API
- [x] CDSecurity / Solodit checklists — self-audit reference for prize logic

### From Grok Research (CT Security Community)
- [x] **AuditAgent** (Nethermind) — AI vulnerability detection trained on Solana audit findings. Free tier at auditagent.nethermind.io
- [x] **rnsec** — React-specific CLI scanner, 65+ rules for XSS/auth bypass. Free OSS on GitHub
- [ ] **TokenFi Shield** — AI-powered Solana/EVM contract audit (free beta). Evaluate for Solidity contracts
- [ ] **Radar** (audit_wizard) — OSS vulnerability hunter for Solidity/Rust. Evaluate for contracts

### Skipped (with reason)
- solidityguard.org — Ethereum-only, our contracts are on Base (EVM-compatible but tool is Mainnet-focused)
- Immunefi/CertiK bounties — budget too high for hackathon project
- AuditInspect — insufficient community vetting

---

## Key Security Files

| File | Purpose |
|------|---------|
| `backend/src/server.ts` | Express setup: helmet (L44), CORS (L45-78), rate limiter |
| `backend/src/middleware/auth.ts` | JWT auth middleware: `authenticate()`, `optionalAuthenticate()` |
| `backend/src/middleware/rateLimiter.ts` | Rate limits: 500/15min API, 50/15min auth, 3/hr strict |
| `backend/src/api/auth.ts` | Auth endpoints, Privy token verification |
| `backend/src/api/prizedContestsV2.ts` | Prize claim endpoint (L1124), Solana transfer (L1177-1225) |
| `backend/src/utils/auth.ts` | JWT utilities |
| `contracts/src/CTDraftPrizedV2.sol` | Main EVM contest contract |
| `contracts/src/Treasury.sol` | Prize vault contract |
| `frontend/src/App.tsx` | Privy wallet connector |

---

## Git Workflow

```
main (clean, production)
  └── audit/security-review (all audit work)
        ├── commit: "audit: setup — tracking docs, dep snapshots"
        ├── commit: "audit: phase 1A — dependency scan results"
        ├── commit: "audit: fix FINDING-XXX — [description]"
        └── ... (one commit per fix category)
```

- Never force-push the audit branch
- Each fix commit references the finding number
- Final merge to main via PR for review
