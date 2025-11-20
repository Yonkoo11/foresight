# Database Schema

## Overview

PostgreSQL 15+ database schema for CT league ecosystem.

**Database Name:** `ct_league_db`

**Total Tables:** 18

**Categories:**
- User & Auth (3 tables)
- CT Draft (4 tables)
- CT Whisperer (3 tables)
- Timecaster (4 tables)
- Shared/System (4 tables)

---

## Schema Diagram

```
users
  ├─ ct_draft_teams
  ├─ ct_whisperer_stats
  ├─ timecaster_entries
  └─ reputation_scores

influencers
  ├─ influencer_scores (time-series)
  └─ tweets

ct_draft_teams
  └─ team_influencers (join table)

ct_whisperer_questions
  ├─ ct_whisperer_answers
  └─ ct_whisperer_daily

timecaster_duels (on-chain events)
timecaster_gauntlets (on-chain events)

leaderboards (materialized view)
```

---

## Table Definitions

### 1. users

**Purpose:** Core user accounts

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE, -- optional
    username VARCHAR(50) UNIQUE,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    last_seen TIMESTAMP DEFAULT NOW(),
    is_banned BOOLEAN DEFAULT FALSE,
    referral_code VARCHAR(20) UNIQUE,
    referred_by_id BIGINT REFERENCES users(id)
);

CREATE INDEX idx_users_wallet ON users(wallet_address);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_referral ON users(referral_code);
```

---

### 2. auth_sessions

**Purpose:** JWT session management

```sql
CREATE TABLE auth_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(64) UNIQUE NOT NULL, -- sha256 of JWT
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    last_used TIMESTAMP DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

CREATE INDEX idx_sessions_user ON auth_sessions(user_id);
CREATE INDEX idx_sessions_token ON auth_sessions(token_hash);
CREATE INDEX idx_sessions_expires ON auth_sessions(expires_at);
```

---

### 3. nonces

**Purpose:** Sign-in with Ethereum nonces

```sql
CREATE TABLE nonces (
    wallet_address VARCHAR(42) PRIMARY KEY,
    nonce VARCHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    used BOOLEAN DEFAULT FALSE
);

-- Auto-delete old nonces (>10 minutes)
CREATE INDEX idx_nonces_created ON nonces(created_at);
```

---

## CT DRAFT TABLES

### 4. influencers

**Purpose:** Tracked CT accounts

```sql
CREATE TABLE influencers (
    id BIGSERIAL PRIMARY KEY,
    twitter_username VARCHAR(100) UNIQUE NOT NULL,
    twitter_id VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    avatar_url TEXT,
    follower_count INT DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    category VARCHAR(50), -- 'builder', 'trader', 'meme', 'analyst', etc.
    base_mentions_count INT DEFAULT 0, -- tracks "Base" mentions
    added_at TIMESTAMP DEFAULT NOW(),
    last_updated TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE -- still being tracked?
);

CREATE INDEX idx_influencers_username ON influencers(twitter_username);
CREATE INDEX idx_influencers_category ON influencers(category);
CREATE INDEX idx_influencers_active ON influencers(is_active);
```

**Seed Data:** Top 100 CT accounts (curated list)

---

### 5. influencer_scores

**Purpose:** Time-series influencer performance data

```sql
CREATE TABLE influencer_scores (
    id BIGSERIAL PRIMARY KEY,
    influencer_id BIGINT NOT NULL REFERENCES influencers(id) ON DELETE CASCADE,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),

    -- Raw metrics
    follower_count INT,
    follower_delta_1h INT, -- change in last hour
    follower_delta_24h INT, -- change in last 24h

    -- Engagement metrics (last 24h)
    tweets_count INT,
    total_likes INT,
    total_retweets INT,
    total_replies INT,
    total_impressions BIGINT,

    -- Calculated metrics
    engagement_velocity DECIMAL(10, 2), -- engagements per follower per hour
    meme_score INT, -- keyword matching for trending memes
    base_mentions INT, -- "Base" keyword mentions

    -- Final draft score
    draft_score INT NOT NULL,

    UNIQUE(influencer_id, timestamp)
);

CREATE INDEX idx_scores_influencer ON influencer_scores(influencer_id, timestamp DESC);
CREATE INDEX idx_scores_timestamp ON influencer_scores(timestamp DESC);

-- Partition by month for performance
CREATE TABLE influencer_scores_2025_01 PARTITION OF influencer_scores
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
-- ... create partitions per month
```

**Draft Score Formula:**
```
draft_score = (
    engagement_velocity * 40 +
    follower_delta_24h * 0.1 +
    meme_score * 30 +
    base_mentions * 20
)
```

---

### 6. tweets

**Purpose:** Scraped tweets for analysis

```sql
CREATE TABLE tweets (
    id BIGSERIAL PRIMARY KEY,
    tweet_id VARCHAR(50) UNIQUE NOT NULL,
    influencer_id BIGINT NOT NULL REFERENCES influencers(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    likes_count INT DEFAULT 0,
    retweets_count INT DEFAULT 0,
    replies_count INT DEFAULT 0,
    impressions BIGINT,

    -- Analysis flags
    contains_base_mention BOOLEAN DEFAULT FALSE,
    contains_meme_keywords BOOLEAN DEFAULT FALSE,
    sentiment VARCHAR(20), -- 'bullish', 'bearish', 'neutral'

    scraped_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tweets_influencer ON tweets(influencer_id, created_at DESC);
CREATE INDEX idx_tweets_created ON tweets(created_at DESC);
CREATE INDEX idx_tweets_base_mention ON tweets(contains_base_mention) WHERE contains_base_mention = TRUE;
```

---

### 7. ct_draft_teams

**Purpose:** User fantasy teams

```sql
CREATE TABLE ct_draft_teams (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Team composition (5 influencers)
    influencer1_id BIGINT REFERENCES influencers(id),
    influencer2_id BIGINT REFERENCES influencers(id),
    influencer3_id BIGINT REFERENCES influencers(id),
    influencer4_id BIGINT REFERENCES influencers(id),
    influencer5_id BIGINT REFERENCES influencers(id),

    -- Current scores
    current_score INT DEFAULT 0,
    daily_score INT DEFAULT 0,
    weekly_score INT DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    last_updated TIMESTAMP DEFAULT NOW(),

    -- Constraints
    CHECK (
        influencer1_id IS NOT NULL AND
        influencer2_id IS NOT NULL AND
        influencer3_id IS NOT NULL AND
        influencer4_id IS NOT NULL AND
        influencer5_id IS NOT NULL AND
        influencer1_id != influencer2_id AND
        influencer1_id != influencer3_id AND
        influencer1_id != influencer4_id AND
        influencer1_id != influencer5_id AND
        influencer2_id != influencer3_id AND
        influencer2_id != influencer4_id AND
        influencer2_id != influencer5_id AND
        influencer3_id != influencer4_id AND
        influencer3_id != influencer5_id AND
        influencer4_id != influencer5_id
    )
);

CREATE INDEX idx_draft_teams_user ON ct_draft_teams(user_id);
CREATE INDEX idx_draft_teams_score ON ct_draft_teams(current_score DESC);
```

---

### 8. ct_draft_history

**Purpose:** Historical team scores (for charts)

```sql
CREATE TABLE ct_draft_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    score INT NOT NULL,
    rank INT,

    UNIQUE(user_id, timestamp)
);

CREATE INDEX idx_draft_history_user ON ct_draft_history(user_id, timestamp DESC);
```

---

## CT WHISPERER TABLES

### 9. ct_whisperer_questions

**Purpose:** Tweet guessing questions

```sql
CREATE TABLE ct_whisperer_questions (
    id BIGSERIAL PRIMARY KEY,
    tweet_text TEXT NOT NULL,
    correct_influencer_id BIGINT NOT NULL REFERENCES influencers(id),

    -- Multiple choice options (4 options)
    option1_id BIGINT NOT NULL REFERENCES influencers(id),
    option2_id BIGINT NOT NULL REFERENCES influencers(id),
    option3_id BIGINT NOT NULL REFERENCES influencers(id),
    option4_id BIGINT NOT NULL REFERENCES influencers(id),

    category VARCHAR(50), -- 'serious', 'degen', 'unhinged', 'alpha'
    difficulty VARCHAR(20), -- 'easy', 'medium', 'hard'

    -- Stats
    times_shown INT DEFAULT 0,
    times_correct INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_whisperer_category ON ct_whisperer_questions(category);
CREATE INDEX idx_whisperer_difficulty ON ct_whisperer_questions(difficulty);
CREATE INDEX idx_whisperer_active ON ct_whisperer_questions(is_active);
```

---

### 10. ct_whisperer_answers

**Purpose:** User answer records

```sql
CREATE TABLE ct_whisperer_answers (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question_id BIGINT NOT NULL REFERENCES ct_whisperer_questions(id) ON DELETE CASCADE,
    selected_influencer_id BIGINT NOT NULL REFERENCES influencers(id),
    is_correct BOOLEAN NOT NULL,
    time_taken_ms INT, -- milliseconds to answer
    answered_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(user_id, question_id)
);

CREATE INDEX idx_whisperer_answers_user ON ct_whisperer_answers(user_id, answered_at DESC);
CREATE INDEX idx_whisperer_answers_question ON ct_whisperer_answers(question_id);
```

---

### 11. ct_whisperer_stats

**Purpose:** User Whisperer statistics

```sql
CREATE TABLE ct_whisperer_stats (
    user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,

    -- Overall stats
    total_questions INT DEFAULT 0,
    total_correct INT DEFAULT 0,
    ct_iq INT DEFAULT 0, -- 0-100 score

    -- Streaks
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_answer_date DATE,

    -- Category breakdown
    serious_correct INT DEFAULT 0,
    serious_total INT DEFAULT 0,
    degen_correct INT DEFAULT 0,
    degen_total INT DEFAULT 0,
    unhinged_correct INT DEFAULT 0,
    unhinged_total INT DEFAULT 0,
    alpha_correct INT DEFAULT 0,
    alpha_total INT DEFAULT 0,

    -- Timing
    avg_time_ms INT,

    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_whisperer_stats_ct_iq ON ct_whisperer_stats(ct_iq DESC);
CREATE INDEX idx_whisperer_stats_streak ON ct_whisperer_stats(current_streak DESC);
```

**CT IQ Formula:**
```sql
ct_iq = (total_correct / total_questions * 70) +
        (current_streak / 20 * 20) +
        (CASE WHEN avg_time_ms < 5000 THEN 10 ELSE 0 END)
```

---

## TIMECASTER TABLES

### 12. timecaster_duels

**Purpose:** Indexed on-chain duel events

```sql
CREATE TABLE timecaster_duels (
    id BIGINT PRIMARY KEY, -- matches on-chain duel ID

    -- Participants
    challenger_address VARCHAR(42) NOT NULL,
    opponent_address VARCHAR(42),

    -- Duel details
    statement TEXT NOT NULL,
    stake DECIMAL(20, 8) NOT NULL, -- ETH amount
    duel_type VARCHAR(20) NOT NULL, -- 'PRICE', 'PROTOCOL', 'NARRATIVE'
    challenger_side_yes BOOLEAN NOT NULL,

    -- Timestamps
    created_at TIMESTAMP NOT NULL,
    accept_deadline TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    accepted_at TIMESTAMP,
    resolved_at TIMESTAMP,

    -- Resolution
    status VARCHAR(20) NOT NULL, -- 'OPEN', 'ACTIVE', 'RESOLVED', 'CANCELLED', 'VOTING'
    outcome BOOLEAN,
    winner_address VARCHAR(42),
    payout DECIMAL(20, 8),

    -- Voting (for NARRATIVE duels)
    voter_count INT DEFAULT 0,
    yes_votes INT DEFAULT 0,
    no_votes INT DEFAULT 0,

    -- On-chain reference
    tx_hash VARCHAR(66) NOT NULL,
    block_number BIGINT NOT NULL,

    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_duels_challenger ON timecaster_duels(challenger_address);
CREATE INDEX idx_duels_opponent ON timecaster_duels(opponent_address);
CREATE INDEX idx_duels_status ON timecaster_duels(status);
CREATE INDEX idx_duels_expires ON timecaster_duels(expires_at);
CREATE INDEX idx_duels_created ON timecaster_duels(created_at DESC);
```

---

### 13. timecaster_duel_votes

**Purpose:** Track community votes on narrative duels

```sql
CREATE TABLE timecaster_duel_votes (
    id BIGSERIAL PRIMARY KEY,
    duel_id BIGINT NOT NULL REFERENCES timecaster_duels(id) ON DELETE CASCADE,
    voter_address VARCHAR(42) NOT NULL,
    vote BOOLEAN NOT NULL, -- true = YES, false = NO
    stake DECIMAL(20, 8) NOT NULL,
    voted_at TIMESTAMP DEFAULT NOW(),
    tx_hash VARCHAR(66) NOT NULL,

    UNIQUE(duel_id, voter_address)
);

CREATE INDEX idx_duel_votes_duel ON timecaster_duel_votes(duel_id);
CREATE INDEX idx_duel_votes_voter ON timecaster_duel_votes(voter_address);
```

---

### 14. timecaster_gauntlets

**Purpose:** Indexed daily gauntlet events

```sql
CREATE TABLE timecaster_gauntlets (
    day DATE PRIMARY KEY,

    -- 5 predictions
    pred1_statement TEXT NOT NULL,
    pred1_type VARCHAR(20) NOT NULL,
    pred1_yes_stakes DECIMAL(20, 8) DEFAULT 0,
    pred1_no_stakes DECIMAL(20, 8) DEFAULT 0,
    pred1_outcome BOOLEAN,

    pred2_statement TEXT NOT NULL,
    pred2_type VARCHAR(20) NOT NULL,
    pred2_yes_stakes DECIMAL(20, 8) DEFAULT 0,
    pred2_no_stakes DECIMAL(20, 8) DEFAULT 0,
    pred2_outcome BOOLEAN,

    pred3_statement TEXT NOT NULL,
    pred3_type VARCHAR(20) NOT NULL,
    pred3_yes_stakes DECIMAL(20, 8) DEFAULT 0,
    pred3_no_stakes DECIMAL(20, 8) DEFAULT 0,
    pred3_outcome BOOLEAN,

    pred4_statement TEXT NOT NULL,
    pred4_type VARCHAR(20) NOT NULL,
    pred4_yes_stakes DECIMAL(20, 8) DEFAULT 0,
    pred4_no_stakes DECIMAL(20, 8) DEFAULT 0,
    pred4_outcome BOOLEAN,

    pred5_statement TEXT NOT NULL,
    pred5_type VARCHAR(20) NOT NULL,
    pred5_yes_stakes DECIMAL(20, 8) DEFAULT 0,
    pred5_no_stakes DECIMAL(20, 8) DEFAULT 0,
    pred5_outcome BOOLEAN,

    -- Status
    entry_deadline TIMESTAMP NOT NULL,
    total_participants INT DEFAULT 0,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP,

    -- On-chain
    tx_hash VARCHAR(66) NOT NULL,
    block_number BIGINT NOT NULL,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_gauntlets_day ON timecaster_gauntlets(day DESC);
CREATE INDEX idx_gauntlets_resolved ON timecaster_gauntlets(resolved);
```

---

### 15. timecaster_gauntlet_entries

**Purpose:** User entries in daily gauntlets

```sql
CREATE TABLE timecaster_gauntlet_entries (
    id BIGSERIAL PRIMARY KEY,
    day DATE NOT NULL REFERENCES timecaster_gauntlets(day),
    user_address VARCHAR(42) NOT NULL,

    -- Predictions (5 per day)
    pred1_choice BOOLEAN,
    pred1_stake DECIMAL(20, 8),

    pred2_choice BOOLEAN,
    pred2_stake DECIMAL(20, 8),

    pred3_choice BOOLEAN,
    pred3_stake DECIMAL(20, 8),

    pred4_choice BOOLEAN,
    pred4_stake DECIMAL(20, 8),

    pred5_choice BOOLEAN,
    pred5_stake DECIMAL(20, 8),

    -- Results
    correct_count INT DEFAULT 0,
    total_payout DECIMAL(20, 8) DEFAULT 0,
    claimed BOOLEAN DEFAULT FALSE,
    claimed_at TIMESTAMP,

    entered_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(day, user_address)
);

CREATE INDEX idx_gauntlet_entries_day ON timecaster_gauntlet_entries(day);
CREATE INDEX idx_gauntlet_entries_user ON timecaster_gauntlet_entries(user_address);
CREATE INDEX idx_gauntlet_entries_correct ON timecaster_gauntlet_entries(correct_count DESC);
```

---

## SHARED TABLES

### 16. reputation_scores

**Purpose:** Cached reputation data from smart contract

```sql
CREATE TABLE reputation_scores (
    user_address VARCHAR(42) PRIMARY KEY,

    -- CT Draft
    draft_rank INT,
    draft_score INT,

    -- CT Whisperer
    ct_iq INT,
    whisperer_streak INT,

    -- Timecaster Arena
    arena_wins INT DEFAULT 0,
    arena_losses INT DEFAULT 0,
    total_staked DECIMAL(20, 8) DEFAULT 0,
    total_winnings DECIMAL(20, 8) DEFAULT 0,

    -- Timecaster Gauntlet
    gauntlet_days INT DEFAULT 0,
    total_correct INT DEFAULT 0,
    total_predictions INT DEFAULT 0,

    -- Combined
    ct_mastery_score INT NOT NULL DEFAULT 0, -- 0-100

    -- NFT
    nft_token_id INT,
    nft_level VARCHAR(20), -- 'NOVICE', 'APPRENTICE', 'SEER', 'PROPHET', 'ORACLE'

    last_updated TIMESTAMP DEFAULT NOW(),
    last_synced_block BIGINT -- last on-chain sync
);

CREATE INDEX idx_reputation_mastery ON reputation_scores(ct_mastery_score DESC);
CREATE INDEX idx_reputation_draft_rank ON reputation_scores(draft_rank);
CREATE INDEX idx_reputation_ct_iq ON reputation_scores(ct_iq DESC);
```

---

### 17. leaderboards

**Purpose:** Materialized view for fast leaderboard queries

```sql
CREATE MATERIALIZED VIEW leaderboards AS
SELECT
    user_address,
    ct_mastery_score,
    draft_rank,
    draft_score,
    ct_iq,
    arena_wins,
    arena_losses,
    CASE
        WHEN arena_wins + arena_losses > 0
        THEN (arena_wins::DECIMAL / (arena_wins + arena_losses) * 100)::INT
        ELSE 0
    END as arena_win_rate,
    gauntlet_days,
    CASE
        WHEN total_predictions > 0
        THEN (total_correct::DECIMAL / total_predictions * 100)::INT
        ELSE 0
    END as gauntlet_accuracy,
    total_winnings,
    nft_level,
    ROW_NUMBER() OVER (ORDER BY ct_mastery_score DESC) as global_rank
FROM reputation_scores
WHERE ct_mastery_score > 0
ORDER BY ct_mastery_score DESC;

CREATE UNIQUE INDEX idx_leaderboards_address ON leaderboards(user_address);
CREATE INDEX idx_leaderboards_rank ON leaderboards(global_rank);

-- Refresh every 5 minutes
REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboards;
```

---

### 18. system_events

**Purpose:** Event log for debugging and analytics

```sql
CREATE TABLE system_events (
    id BIGSERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL, -- 'twitter_scrape', 'score_update', 'duel_resolved', etc.
    data JSONB,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_events_type ON system_events(event_type);
CREATE INDEX idx_events_created ON system_events(created_at DESC);
CREATE INDEX idx_events_success ON system_events(success);

-- Auto-delete events older than 30 days
CREATE INDEX idx_events_cleanup ON system_events(created_at) WHERE created_at < NOW() - INTERVAL '30 days';
```

---

## Database Functions & Triggers

### Auto-update timestamps

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ct_draft_teams_updated_at BEFORE UPDATE ON ct_draft_teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ... etc for other tables
```

---

### Calculate CT IQ on insert/update

```sql
CREATE OR REPLACE FUNCTION calculate_ct_iq()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ct_iq = LEAST(100, (
        (NEW.total_correct::DECIMAL / NULLIF(NEW.total_questions, 0) * 70)::INT +
        (LEAST(NEW.current_streak, 20)::DECIMAL / 20 * 20)::INT +
        (CASE WHEN NEW.avg_time_ms < 5000 THEN 10 ELSE 0 END)
    ));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ct_iq BEFORE INSERT OR UPDATE ON ct_whisperer_stats
    FOR EACH ROW EXECUTE FUNCTION calculate_ct_iq();
```

---

### Update Draft Team Score

```sql
CREATE OR REPLACE FUNCTION update_draft_team_score()
RETURNS TRIGGER AS $$
DECLARE
    total_score INT;
BEGIN
    -- Sum scores of all 5 influencers (latest score)
    SELECT COALESCE(SUM(latest_score.draft_score), 0) INTO total_score
    FROM (
        SELECT DISTINCT ON (influencer_id) draft_score
        FROM influencer_scores
        WHERE influencer_id IN (
            NEW.influencer1_id,
            NEW.influencer2_id,
            NEW.influencer3_id,
            NEW.influencer4_id,
            NEW.influencer5_id
        )
        ORDER BY influencer_id, timestamp DESC
    ) as latest_score;

    NEW.current_score = total_score;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_team_score BEFORE INSERT OR UPDATE ON ct_draft_teams
    FOR EACH ROW EXECUTE FUNCTION update_draft_team_score();
```

---

## Indexes Summary

**High-Priority Indexes (for performance):**

```sql
-- Users
CREATE INDEX CONCURRENTLY idx_users_wallet_lower ON users(LOWER(wallet_address));

-- Influencer Scores (time-series queries)
CREATE INDEX CONCURRENTLY idx_influencer_scores_composite
    ON influencer_scores(influencer_id, timestamp DESC)
    INCLUDE (draft_score);

-- Tweets (recent tweets)
CREATE INDEX CONCURRENTLY idx_tweets_recent
    ON tweets(created_at DESC)
    WHERE created_at > NOW() - INTERVAL '7 days';

-- Draft Teams (leaderboard)
CREATE INDEX CONCURRENTLY idx_draft_teams_leaderboard
    ON ct_draft_teams(current_score DESC, last_updated DESC);

-- Whisperer Stats (leaderboard)
CREATE INDEX CONCURRENTLY idx_whisperer_leaderboard
    ON ct_whisperer_stats(ct_iq DESC, current_streak DESC);

-- Duels (active/open)
CREATE INDEX CONCURRENTLY idx_duels_active
    ON timecaster_duels(status, created_at DESC)
    WHERE status IN ('OPEN', 'ACTIVE', 'VOTING');

-- Gauntlet Entries (daily participants)
CREATE INDEX CONCURRENTLY idx_gauntlet_daily
    ON timecaster_gauntlet_entries(day, correct_count DESC);
```

---

## Database Maintenance

### Vacuum Schedule

```sql
-- Auto-vacuum settings in postgresql.conf
autovacuum = on
autovacuum_max_workers = 4
autovacuum_naptime = 1min
```

### Backup Strategy

```bash
# Daily backups
pg_dump ct_league_db | gzip > backup_$(date +%Y%m%d).sql.gz

# Retain:
# - 7 days of daily backups
# - 4 weeks of weekly backups
# - 12 months of monthly backups
```

### Monitoring Queries

```sql
-- Check table sizes
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan;

-- Check slow queries
SELECT
    query,
    mean_exec_time,
    calls
FROM pg_stat_statements
WHERE mean_exec_time > 100 -- ms
ORDER BY mean_exec_time DESC
LIMIT 20;
```

---

## Data Retention Policy

| Table | Retention | Strategy |
|-------|-----------|----------|
| tweets | 30 days | Delete after 30d |
| influencer_scores | 90 days | Partition by month, drop old partitions |
| system_events | 30 days | Auto-delete via cron |
| ct_whisperer_answers | Forever | Archive to S3 after 6 months |
| timecaster_duels | Forever | Keep all on-chain data |
| auth_sessions | 7 days | Delete expired sessions |

---

## Migration Strategy

**Use a migration tool:** Knex.js or TypeORM

**Example Migration:**

```javascript
// migrations/001_initial_schema.js
exports.up = async function(knex) {
    await knex.schema.createTable('users', (table) => {
        table.bigIncrements('id').primary();
        table.string('wallet_address', 42).unique().notNullable();
        table.string('email', 255).unique();
        table.string('username', 50).unique();
        table.text('avatar_url');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('last_seen').defaultTo(knex.fn.now());
        table.boolean('is_banned').defaultTo(false);
        table.string('referral_code', 20).unique();
        table.bigInteger('referred_by_id').unsigned().references('id').inTable('users');
    });

    // ... create other tables
};

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('users');
    // ... drop other tables in reverse order
};
```

**Run migrations:**
```bash
npx knex migrate:latest
```

---

## Seed Data

**Influencers (100 accounts):**

```sql
INSERT INTO influencers (twitter_username, twitter_id, display_name, category) VALUES
('cobie', '1234567890', 'Cobie', 'trader'),
('punk6529', '0987654321', '6529', 'analyst'),
('degenSpartan', '1122334455', 'Degen Spartan', 'degen'),
-- ... 97 more
;
```

**Whisperer Questions (500+):**

```sql
INSERT INTO ct_whisperer_questions (tweet_text, correct_influencer_id, option1_id, option2_id, option3_id, option4_id, category, difficulty) VALUES
('gm', 1, 1, 2, 3, 4, 'serious', 'hard'), -- everyone says gm lol
('this is going to zero', 5, 5, 6, 7, 8, 'degen', 'medium'),
-- ... 498 more
;
```

---

## Performance Considerations

1. **Connection Pooling:** Max 20 connections
2. **Read Replicas:** Add for high traffic (>10k users)
3. **Caching:** Redis for hot data (leaderboards, recent scores)
4. **Partitioning:** Partition `influencer_scores` by month
5. **Materialized Views:** Refresh `leaderboards` every 5 minutes
6. **Denormalization:** Store computed scores in tables vs. calculating on-the-fly

---

## Next Steps

1. Create initial migration files
2. Set up PostgreSQL database
3. Run migrations
4. Seed with initial data (100 influencers)
5. Set up automated backups
6. Configure monitoring

See `BACKEND_API.md` for how the API interacts with this schema.
