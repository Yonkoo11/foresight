# FORESIGHT LAUNCH — OPERATIONS & INCIDENT GUIDE

**For: DevOps, Backend Lead, Monitoring**

**Scope:** 72-hour launch window (Monday 00:00 UTC → Wednesday 23:59 UTC)

---

## 1. PRE-LAUNCH VERIFICATION (Sunday, 6pm UTC)

### 1.1 — Backend Readiness

- [ ] Database migrations all applied (`knex migrate:latest`)
- [ ] Backend running on production instance (Railway or similar)
- [ ] All endpoints health-checked:
  - `GET /api/health` → 200
  - `GET /api/contests` → returns list
  - `POST /api/users/register` → accepted
  - `GET /api/referrals/my-code` → 200 with proper schema
  - `POST /api/entries` → accepts valid team
  - `GET /api/leaderboard` → returns ranked list
  - `POST /api/admin/trigger-prized-lock` → queues lock job

- [ ] Database connections stable (no timeouts, good response times)
- [ ] SOL airdrop endpoint configured and tested (dummy transaction)
- [ ] JWT secret is strong & not in logs
- [ ] Environment variables all set correctly
- [ ] Rate limiting enabled (50 req/min per IP for API, 1000/min per user for auth)

### 1.2 — Frontend Readiness

- [ ] Build passes: `npm run build` (no errors, no warnings)
- [ ] Homepage loads in <2s on 4G mobile
- [ ] Draft page responsive on mobile + desktop
- [ ] Leaderboard loads and updates
- [ ] Referral page shows properly
- [ ] Share buttons work (X, copy, etc.)
- [ ] OG card preview showing in X compose box (or will be cached within 24h)

### 1.3 — Monitoring & Alerting

Set up alerts for:
- [ ] **Error rate >1%** (PagerDuty, Sentry, etc.)
- [ ] **API response time >500ms** (avg)
- [ ] **Database query time >200ms** (avg)
- [ ] **Container memory >80%**
- [ ] **Container CPU >70%** (sustained)
- [ ] **Disk usage >85%**
- [ ] **Auth failures >10/min** (indicates attack or config issue)

Tools: Sentry, DataDog, New Relic, or custom CloudWatch dashboards.

### 1.4 — Admin Panel & Overrides

Test these admin functions work:

```bash
# Get raw contest data
curl -H "Authorization: Bearer $JWT" \
  https://api.ct-foresight.xyz/api/admin/contests/1/raw

# Update contest (test on non-production first!)
curl -X PATCH -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{"status":"locked"}' \
  https://api.ct-foresight.xyz/api/admin/contests/1

# Trigger lock job manually
curl -X POST -H "Authorization: Bearer $JWT" \
  https://api.ct-foresight.xyz/api/admin/trigger-prized-lock

# Trigger scoring job manually
curl -X POST -H "Authorization: Bearer $JWT" \
  https://api.ct-foresight.xyz/api/admin/trigger-prized-scoring

# Trigger finalization job manually
curl -X POST -H "Authorization: Bearer $JWT" \
  https://api.ct-foresight.xyz/api/admin/trigger-contest-finalization
```

All should return 200 + expected response.

### 1.5 — Backup & Recovery

- [ ] Database backup automated (daily or more frequent)
- [ ] Backup tested: Can restore from backup in <15 min?
- [ ] Container image stored (can redeploy in <5 min if needed)
- [ ] Secrets backed up safely (not in Git, use secrets manager)
- [ ] Plan if SOL airdrop fails: (a) manual fallback, (b) notification template, (c) delay playbook

### 1.6 — Load Testing

Run a quick load test 24h before launch:

```bash
# Using Apache Bench (ab) or k6 / Gatling
ab -n 1000 -c 50 https://api.ct-foresight.xyz/api/contests

# Expected: Should handle 50 concurrent users without timeouts
# If p95 latency >1000ms, scale up container/DB
```

---

## 2. LAUNCH DAY CHECKLIST (Monday, 6am UTC)

### 2.1 — 30 Minutes Before Launch (23:30 UTC Sunday)

- [ ] Team on-call (1 backend, 1 frontend, 1 ops): all awake, in Discord
- [ ] All services running (backend, frontend, database)
- [ ] Monitoring dashboards open in separate windows
- [ ] Incident response template loaded (below)
- [ ] All admin endpoints verified working one more time
- [ ] Contest created in DB with correct rules:
  ```sql
  SELECT * FROM contests WHERE id = 1;
  -- Should show: status='open', lock_time=2026-03-04 00:00:00, end_time=2026-03-06 23:59:59
  ```

### 2.2 — 5 Minutes Before (23:55 UTC Sunday)

- [ ] Frontend goes live (or already live)
- [ ] All team members in Discord/Slack voice channel
- [ ] Monitoring dashboards active
- [ ] Founder ready to post first launch tweet
- [ ] Discord bot ready to post #announcements message

### 2.3 — LAUNCH! (00:00 UTC Monday)

- [ ] Ops watches error logs in real-time (tail Sentry/CloudWatch)
- [ ] Backend lead watches API performance (response times, error rates)
- [ ] Frontend lead watches browser console errors (open DevTools on live site)
- [ ] Founder posts: "🚀 LIVE: Foresight is OPEN"
- [ ] Discord admin posts: "Contest is LIVE, link in #announcements"
- [ ] Monitor signup rate: Should see >1 signup/min by minute 5

### 2.4 — First Hour (00:00-01:00 UTC)

**Every 10 minutes:**
- [ ] Check error rate (target: <0.1%)
- [ ] Check signup count (target: >10 by 10min, >30 by 30min, >60 by 60min)
- [ ] Check entry count (target: >5 by 30min)
- [ ] Spot-check leaderboard loads (refresh homepage)

**If issues appear:** See Section 3 (Incident Response) below.

**If numbers lag:**
- Verify frontend is loading (check browser network tab)
- Check if DB is slow (check slow query logs)
- Verify auth is working (test signup yourself)

---

## 3. INCIDENT RESPONSE PLAYBOOK

### 3.1 — High Error Rate (>1%)

**Symptom:** Sentry shows >1% errors, users reporting "pages not loading" or timeouts.

**Diagnosis (1 minute):**
```bash
# Check error logs
tail -f /var/log/app.log | grep ERROR

# Check specific error type
curl https://sentry.io/api/0/organizations/foresight/issues/ \
  -H "Authorization: Bearer $SENTRY_KEY"

# Check database connection pool
SELECT count(*) FROM pg_stat_activity;
-- If >100, DB connections exhausted
```

**Response:**

| Error Type | Fix | ETA |
|-----------|-----|-----|
| **Timeout errors** | Scale container (2x CPU/RAM) | 3 min |
| **Connection pool exhausted** | Restart backend service (drains pool) | 2 min |
| **Database slow queries** | Kill long queries, restart DB if needed | 5-10 min |
| **Out of memory** | Increase container memory | 3 min |
| **Sentry/error tracking down** | Ignore if backend still works; monitor logs directly | N/A |

**User communication:**

```
If error persists >5 min, post:

Discord #announcements:
"⚠️ We're experiencing high load. Working on it. ETA 5 min. Thanks for patience!"

Twitter:
"Huge traffic on launch! Scaling up now. Should be smooth in 5 min. Thanks for the love 🚀"
```

**Recovery:**
1. Scale container (2x resources)
2. Monitor error rate (should drop within 2 min)
3. Gradually let signups resume
4. Post all-clear: "🟢 Back to normal. Thanks for bearing with us!"

### 3.2 — Database is Slow or Unresponsive

**Symptom:** API responses >1000ms, users see loading spinners.

**Diagnosis:**
```bash
# Check DB connection status
psql -h $DB_HOST -U $DB_USER -c "SELECT pid, state, query FROM pg_stat_activity;"

# Check for long-running queries
SELECT query, state, query_start FROM pg_stat_activity
WHERE state != 'idle' AND query_start < now() - interval '30 seconds';

# Check DB CPU/memory
# (In AWS/Railway dashboard)
```

**Response:**

| Symptom | Fix |
|---------|-----|
| **Connection pool full** | Restart backend service (drains connections) |
| **Long-running query** | Kill it: `SELECT pg_terminate_backend(pid);` |
| **Slow indexes** | Already set up, but verify at design time |
| **Disk full** | Check: `df -h` — unlikely, but possible |
| **DB CPU maxed** | Scale DB vertically (more CPU), or reduce backend concurrency |

**Command sequence:**
```bash
# Kill a specific slow query
SELECT pg_terminate_backend(pid) FROM pg_stat_activity
WHERE query LIKE '%SELECT%' AND query_start < now() - interval '1 minute';

# Restart backend service (if possible, use rolling restart)
curl -X POST $DEPLOYMENT_API/restart
# Or manually: kubectl rollout restart deployment/foresight-backend

# Wait 2 min for recovery, monitor dashboard
```

**If DB is truly down:**
1. Failover to read-replica (if configured)
2. If no replica, restore from backup (15-30 min, uptime cost)
3. Notify users: "Database failover in progress. Back in 15 min."

### 3.3 — Contest Lock Fails (Lock Time Passes, Status Still "Open")

**Symptom:** It's 00:00 UTC Tuesday, contest shows "open" still, users can still enter.

**Diagnosis:**
```bash
# Check contest status
SELECT id, status, lock_time, entries_count FROM contests WHERE id = 1;

# Check if cron job ran
tail -f /var/log/cron.log | grep "trigger-prized-lock"

# Or check database lock job status
SELECT * FROM audit_log WHERE action = 'contest_lock' ORDER BY created_at DESC LIMIT 5;
```

**Response:**

| Cause | Fix |
|-------|-----|
| **Cron job didn't fire** | Manually trigger: `POST /api/admin/trigger-prized-lock` |
| **Lock job failed silently** | Check logs for error, then retry manual trigger |
| **Database transaction hung** | Check for blocking queries, kill them, retry |

**Manual lock command:**
```bash
curl -X POST \
  -H "Authorization: Bearer $ADMIN_JWT" \
  -H "Content-Type: application/json" \
  https://api.ct-foresight.xyz/api/admin/trigger-prized-lock

# Verify:
SELECT status FROM contests WHERE id = 1;
-- Should now show 'locked'
```

**User communication:**
```
If lock delayed >30 min:

Discord:
"Contest lock took longer than expected (we're investigating).
Entries are now CLOSED. Scoring starts now.
Will notify when winners are announced (usually 10 min)."
```

### 3.4 — Scoring Fails or Produces Wrong Results

**Symptom:** Contest finalized, but leaderboard scores are wrong or 0 for everyone.

**Diagnosis:**
```bash
# Check leaderboard
SELECT user_id, username, total_score, rank FROM leaderboard
WHERE contest_id = 1 ORDER BY rank LIMIT 10;

# Check if scoring job ran
SELECT * FROM audit_log WHERE action LIKE '%scoring%' ORDER BY created_at DESC;

# Check entries and scoring details
SELECT e.id, e.user_id, e.team_ids, e.total_score
FROM entries e
WHERE e.contest_id = 1 LIMIT 5;
```

**Response:**

| Issue | Fix |
|-------|-----|
| **Scores are all 0** | Scoring job failed. Rerun: `POST /api/admin/trigger-prized-scoring` |
| **Scores look wrong** | Manual audit: Check 1-2 entries manually, verify formula |
| **Some entries scored, some not** | Partial failure — rerun scorer |

**Manual rescore command:**
```bash
curl -X POST \
  -H "Authorization: Bearer $ADMIN_JWT" \
  https://api.ct-foresight.xyz/api/admin/trigger-prized-scoring

# Wait 30 sec, verify leaderboard updated
```

**If scores still wrong:**
1. Check scoring algorithm in code (Section 3.6 below)
2. Manually calculate 1-2 scores to validate formula
3. If formula is wrong, fix code, backfill scores

**User communication:**
```
If delayed >5 min:

Twitter:
"Scoring is taking a bit longer than expected.
All entries will be scored fairly. ETA 5 min."

Discord #announcements:
"Final scores coming in. Patience 🙏"
```

### 3.5 — Prize Claim Fails (User Tries to Claim, Gets Error)

**Symptom:** Winner clicks "Claim Prize," sees error like "Airdrop failed" or "Transaction rejected."

**Diagnosis:**
```bash
# Check prize claim transaction
SELECT * FROM prize_claims WHERE contest_id = 1 AND status != 'success' LIMIT 5;

# Check Solana wallet balance (on devnet)
curl https://api.devnet.solana.com -X POST -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getBalance","params":["<TREASURY_WALLET>"]}'

# Check recent transaction history
SELECT * FROM solana_transactions ORDER BY created_at DESC LIMIT 10;
```

**Response:**

| Cause | Fix |
|-------|-----|
| **Not enough SOL in treasury** | Add SOL to treasury wallet (should have >$20 to start) |
| **Solana RPC endpoint down** | Use backup RPC endpoint (e.g., Helius, QuickNode) |
| **Transaction malformed** | Check airdrop code in `/backend/src/services/solanaService.ts` |
| **User wallet rejected txn** | Ask user to retry (network glitch) |

**Add SOL to treasury (if low):**
```bash
# Get current balance
solana balance $TREASURY_WALLET --url devnet

# If <1 SOL, request airdrop
solana airdrop 10 $TREASURY_WALLET --url devnet

# Verify
solana balance $TREASURY_WALLET --url devnet
```

**Retry prize claim:**
- Tell user: "Try claiming again in 2 min"
- Or manual override: `POST /api/admin/prize/{claimId}/retry`

**User communication:**
```
Twitter:
"A small number of prize claims are experiencing delays.
We're fixing this now. If you don't see your prize in 5 min, DM us."

Discord DM (to affected winner):
"Hey [name]! Your prize claim had a hiccup.
We're sending it now. Check your wallet in 30 sec.
[TX link once processed]"
```

### 3.6 — Scoring Algorithm Has a Bug

**Symptom:** Leaderboard is wrong. Player with lower engagement has higher score.

**Diagnosis:**
```bash
# Get entries for dispute
SELECT e.id, e.user_id, e.team_ids, e.captain_id,
       e.total_score, e.created_at
FROM entries e
WHERE e.contest_id = 1
ORDER BY total_score DESC LIMIT 5;

# Manually check one entry's scoring
-- Expected: sum(activity + engagement + growth + viral) * captain_multiplier
SELECT
  sum(engagement_points) as engagement,
  sum(activity_points) as activity,
  sum(growth_points) as growth,
  sum(viral_points) as viral
FROM influencer_snapshots
WHERE entry_id = '<ENTRY_ID>';
-- Then multiply captain by 2.0
```

**Response:**

**If formula is implemented wrongly:**
1. Fix in code
2. Rerun scoring
3. Verify 2-3 entries manually
4. Announce: "Found a scoring bug, corrected and rescored. Here's the new leaderboard."

**If formula is correct, execution is wrong:**
- Rerun scoring job
- Check for missing snapshots (influencers with no engagement data?)

**Post-mortem**
```
Publish transparency post:

"Found a minor scoring inconsistency during Day 1 scoring.
Fixed and recalculated. All leaderboards are now accurate.

This is why we launched on devnet first.
Every edge case helps us build the most robust game.

Thanks for your patience. 🙏"
```

---

## 4. MONITORING DASHBOARD CHECKLIST

### Real-Time Metrics to Track (Every Hour During Launch)

| Metric | Target | Alert Threshold | Tool |
|--------|--------|-----------------|------|
| **Signups (cumulative)** | 100/h launch, ramping | <30/h sustained | DB query |
| **Contest entries** | 30/h launch, ramping | <10/h sustained | DB query |
| **API error rate** | <0.1% | >1% | Sentry |
| **API latency (p95)** | <300ms | >500ms | New Relic / DataDog |
| **DB query time (avg)** | <50ms | >200ms | DB monitoring |
| **Container memory** | <60% | >80% | CloudWatch / K8s |
| **Container CPU** | <50% | >70% | CloudWatch / K8s |
| **Disk usage** | <50% | >85% | CloudWatch / K8s |
| **SSL cert validity** | N/A | Expires <30 days | SSL monitoring |
| **Discord members** | Growing | Stalled | Manual check |
| **X followers** | Growing | Stalled | Manual check |

### Dashboard Setup

**Sentry:**
- Create project, add to backend code
- Set alerts: Error rate >1%, Spike >50% errors

**DataDog / New Relic:**
- Add APM instrumentation
- Create dashboard: Error rate, Latency, Throughput, Container health

**Database monitoring (PostgreSQL):**
```sql
-- Query to monitor slow queries in real-time
SELECT pid, usename, query_start, state, query
FROM pg_stat_activity
WHERE state != 'idle' AND query_start < now() - interval '5 seconds'
ORDER BY query_start;
```

**CloudWatch (if on AWS):**
- Log group: `/ecs/foresight-backend`
- Metrics: CPU, Memory, Network
- Alarms: CPU >70%, Memory >80%, Errors >1%

---

## 5. LOAD TESTING RESULTS & CAPACITY

**Pre-launch load test (Sunday, day before):**

```bash
# Simulating 500 signups + 100 concurrent draft entries

# Test 1: Signup load (50 concurrent)
ab -n 500 -c 50 -p user.json \
  https://api.ct-foresight.xyz/api/users/register

# Expected results:
# Requests per second: >100 (good)
# Avg response time: <300ms
# Failed requests: 0
# p95 latency: <500ms

# Test 2: Entry submission (30 concurrent, representing drafts)
ab -n 150 -c 30 -p entry.json \
  https://api.ct-foresight.xyz/api/entries

# Expected:
# Requests per second: >50
# Avg response time: <200ms
# Failed requests: 0

# Test 3: Leaderboard reads (100 concurrent)
ab -n 1000 -c 100 https://api.ct-foresight.xyz/api/leaderboard

# Expected:
# Requests per second: >200
# Avg response time: <100ms (reads should be fast)
```

**If load test fails at any point:**
- Increase container resources (CPU/RAM)
- Check for N+1 query problems
- Add database indexes if needed
- Use read replicas for leaderboard (read-heavy)

---

## 6. FAILOVER & ROLLBACK PROCEDURES

### 6.1 — If Backend is Broken (Code Deploy Error)

```bash
# Option 1: Quick rollback (previous version)
kubectl rollout undo deployment/foresight-backend

# Option 2: Deploy specific commit
git checkout <LAST_KNOWN_GOOD_COMMIT>
git push heroku HEAD:main  # or your deploy pipeline

# Option 3: Switch to backup backend instance (if multi-region)
Update load balancer to point to backup instance
```

**Communication:**
```
Twitter: "Resolved a deployment issue. Services fully back online now. 🟢"
Discord: "Backend hiccup fixed. All good!"
```

### 6.2 — If Frontend is Broken

```bash
# Rollback frontend build
# Netlify / Vercel: One-click rollback in dashboard
# Or: Redeploy previous commit

git checkout <LAST_KNOWN_GOOD_COMMIT>
git push origin main
# Wait for rebuild (usually 2-3 min)
```

### 6.3 — If Database is Corrupted or Lost

**This is critical. Have a plan before launch:**

```bash
# Restore from automated backup (if available)
# This depends on your provider (AWS RDS, Railway, etc.)

# Example for Railway:
# 1. Go to Railway dashboard
# 2. Click Postgres plugin
# 3. Backups tab → Restore from last backup
# 4. Wait 5-30 min for restore

# For AWS RDS:
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier foresight-db-restored \
  --db-snapshot-identifier foresight-snapshot-latest

# Update connection string in backend
# Restart backend
```

**Uptime cost:** 15-30 minutes (unacceptable, but beats losing all data).

**Prevention:** Automated backups every 6 hours, test restore 48h before launch.

---

## 7. 72-HOUR SHIFT COVERAGE

**Goal:** Someone monitoring at all times during launch window.

**Team roles:**

| Time Slot | Timezone | Person | Role |
|-----------|----------|--------|------|
| **Mon 00:00-08:00** | UTC | [Backend Lead] | Primary ops + API monitoring |
| **Mon 08:00-16:00** | UTC | [Frontend Lead] | Frontend health + UX issues |
| **Mon 16:00-00:00** | UTC | [Ops/DevOps] | Infrastructure + database |
| **Tue 00:00-08:00** | UTC | [Backend Lead] | (Repeat) |
| **Tue 08:00-16:00** | UTC | [Frontend Lead] | (Repeat) |
| **Tue 16:00-Wed 00:00** | UTC | [Ops/DevOps] | (Repeat) |
| **Wed 00:00-08:00** | UTC | [Backend Lead] | Final push to contest end |

**Overlap:** 30 min handoff meetings at shift changes (08:00, 16:00, 00:00 UTC) to sync on any issues.

**On-call phone:** Someone (founder?) available 24/7 for critical escalations.

---

## 8. POST-LAUNCH ANALYSIS

### Day +1 (Thursday 9am UTC)

**Prepare a metrics summary:**

```
FORESIGHT LAUNCH — 72-HOUR REPORT
===================================

UPTIME:
- Backend: 99.97% (1 brief timeout at hour 23)
- Frontend: 100%
- Database: 99.99%
- Overall: 99.98% ✓

SIGNUPS:
- Total: 632 (target: 500) ✓
- Per hour avg: 8.8
- Peak hour: Mon 09:00 UTC (45 signups)
- Conversion from landing: 12.5%

CONTEST ENTRIES:
- Total: 198 (target: 150) ✓
- Per hour avg: 2.75
- Avg team quality: 98% valid (2 had to be auto-corrected for budget)

ERRORS:
- Sentry total: 23 issues (20 warnings, 3 real errors)
- Error rate peak: 0.3% (around Mon 06:00 UTC, resolved in 2 min)
- User-facing errors: 2 (referral code validation, prize claim delay)

DATABASE:
- Avg query time: 42ms ✓
- Peak connections: 68/100 (used 68%)
- Slow queries: 1 (leaderboard, optimized on Tue)

DISCORD:
- Final members: 487
- Daily active: avg 42%
- Most active channel: #wins

TWITTER:
- Followers added: 410 (from 90 to 500)
- Impressions on launch post: 34K
- Mentions/engagement: 127 replies

REFERRALS:
- Referral signups: 89 (14% of total, excellent)
- Top referrer: 25 referrals
- Avg quality score: 71%
- First milestone hits: "Talent Scout" (5 referrals) by 17 players

BUGS FOUND & FIXED:
1. Referral validation error when code had uppercase (fixed Tue 04:00)
2. Leaderboard cached for 5 min (optimized to 1 min Tue afternoon)
3. Mobile share button text overflow (fixed Tue)
4. Prize claim transaction didn't show link until manual refresh (fixed Tue evening)

LESSONS LEARNED:
1. Influencer outreach worked better than expected (8/20 posted)
2. Discord community was more active than anticipated
3. Mobile UX for share buttons needs refinement
4. Referral system is the most engaging feature
5. Contests 72h duration is perfect (no cliff at 48h)

RECOMMENDATIONS FOR WEEK 2:
1. Pre-optimize leaderboard query (add index on contest_id, user_id)
2. Increase cache TTL to 2 min (leaderboard)
3. Add email reminder 24h before contest lock
4. Expand referral bonus window to Week 2 launch
5. Create "Referral Leaderboard" page (high engagement signal)

WEEK 2 FORECAST:
- Expected signups: 800+ (word of mouth + influencers)
- Expected entries: 250+
- Required infrastructure: scale DB +20%, backend +10%
- Mainnet readiness: 90% (need legal review, final security audit)
```

**Share this publicly** (anonymize if needed). Transparency = trust.

---

## 9. EMERGENCY CONTACTS & ESCALATION

```
CRITICAL ISSUES (immediate response):

🔴 Backend down / Not responding
   → @[Backend Lead] on Discord voice
   → Call: [+1-XXX-XXX-XXXX]
   → Slack: #incidents

🔴 Database down / Can't connect
   → @[Ops/DevOps] on Discord voice
   → Database provider support (Railway/AWS)
   → Estimated recovery: 15-30 min

🔴 Severe data loss / Corruption
   → Founder + Full team
   → Restore from backup
   → Post public transparency update

🟡 High error rate (>1%) but not critical
   → @[Primary on-call]
   → Investigate, scale resources if needed
   → Update Discord when ETA clear

🟡 Performance degradation
   → Monitor for 5 min
   → If persists, scale container
   → Post updates to Discord

🟢 Minor bugs / UI issues
   → Log in GitHub, but don't interrupt launch
   → Fix after contest ends or in next patch

SUPPORT CHANNELS:
- Critical: Discord @everyone ping in #incidents
- Urgent: Discord voice channel
- Normal: GitHub issues / Discord #bugs-feedback
```

---

## 10. POST-CONTEST CHECKLIST

**When contest finalizes (Wed 23:59 UTC):**

- [ ] All final scores locked (no more updates)
- [ ] Prize claims processed (all winners airdropped)
- [ ] Winners notified via email + Discord
- [ ] Public leaderboard finalized + publicized
- [ ] Blog post published with results & learnings
- [ ] Tweet final stats + congrats to winners
- [ ] Share metrics + learnings in Discord
- [ ] Schedule Week 2 contest (higher prize pool)
- [ ] Full post-mortem meeting (Thursday 10am UTC) — entire team
  - What went well?
  - What broke?
  - What to improve?
  - Week 2 changes?
  - Mainnet readiness checklist?

**Infrastructure maintenance (Thursday):**
- [ ] Database optimization (run ANALYZE)
- [ ] Review slow query logs, add indexes if needed
- [ ] Check certificate renewal (SSL)
- [ ] Clean up old logs / temporary files
- [ ] Update security patches if any critical
- [ ] Verify backups completed for all 3 days

---

**Last updated: 2026-03-01**
**For: Launch Week 2026-03-03 to 2026-03-05**
