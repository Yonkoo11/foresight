-- Quest System Setup
-- Run this to create all quest tables

-- 1. Quests table
CREATE TABLE IF NOT EXISTS quests (
    id SERIAL PRIMARY KEY,
    quest_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    points_reward INTEGER DEFAULT 0,
    eth_reward_wei BIGINT DEFAULT 0,
    eth_reward_enabled BOOLEAN DEFAULT FALSE,
    requirements JSONB NOT NULL,
    min_reputation INTEGER DEFAULT 0,
    min_account_age_days INTEGER DEFAULT 0,
    min_wallet_age_days INTEGER DEFAULT 0,
    min_games_played INTEGER DEFAULT 0,
    max_completions_per_user INTEGER,
    max_total_completions INTEGER,
    cooldown_hours INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. User quest completions
CREATE TABLE IF NOT EXISTS user_quest_completions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quest_id INTEGER NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
    completed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    points_earned INTEGER DEFAULT 0,
    eth_earned_wei BIGINT DEFAULT 0,
    eth_unlock_date TIMESTAMPTZ,
    eth_claimed BOOLEAN DEFAULT FALSE,
    claim_tx_hash VARCHAR(66),
    verification_data JSONB,
    UNIQUE(user_id, quest_id)
);

-- 3. Referrals
CREATE TABLE IF NOT EXISTS referrals (
    id SERIAL PRIMARY KEY,
    referrer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referee_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referred_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    reward_claimed BOOLEAN DEFAULT FALSE,
    reward_eligible_date TIMESTAMPTZ,
    referee_ip_hash VARCHAR(64),
    flagged BOOLEAN DEFAULT FALSE,
    UNIQUE(referrer_id, referee_id)
);

-- 4. User achievements
CREATE TABLE IF NOT EXISTS user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id VARCHAR(255) NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB,
    UNIQUE(user_id, achievement_id)
);

-- 5. User stats
CREATE TABLE IF NOT EXISTS user_stats (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    total_quests_completed INTEGER DEFAULT 0,
    total_points_earned INTEGER DEFAULT 0,
    total_eth_earned_wei BIGINT DEFAULT 0,
    current_login_streak INTEGER DEFAULT 0,
    longest_login_streak INTEGER DEFAULT 0,
    last_login_date TIMESTAMPTZ,
    total_referrals INTEGER DEFAULT 0,
    successful_referrals INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Quest activity log
CREATE TABLE IF NOT EXISTS quest_activity_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quest_id INTEGER REFERENCES quests(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    metadata JSONB,
    logged_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_quest_activity_user_time ON quest_activity_log(user_id, logged_at);
CREATE INDEX IF NOT EXISTS idx_user_completions_quest ON user_quest_completions(quest_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);

-- Success message
SELECT 'Quest system tables created successfully!' AS status;
