import { Knex } from 'knex';

/**
 * Make contract_contest_id and contract_address nullable using raw SQL.
 *
 * Migration 00004 tried using Knex's `.alter()` but it silently failed to apply
 * the NOT NULL drop. Using raw PostgreSQL ALTER TABLE instead.
 *
 * Then seeds the demo FREE_LEAGUE contest if one doesn't already exist.
 */
export async function up(knex: Knex): Promise<void> {
  // ── Step 1: Drop NOT NULL constraints via raw SQL ─────────────────────────
  await knex.raw('ALTER TABLE prized_contests ALTER COLUMN contract_contest_id DROP NOT NULL');
  await knex.raw('ALTER TABLE prized_contests ALTER COLUMN contract_address DROP NOT NULL');
  console.log('✅ Dropped NOT NULL on contract_contest_id and contract_address.');

  // ── Step 2: Ensure FREE_LEAGUE contest type exists ────────────────────────
  let contestType = await knex('contest_types').where('code', 'FREE_LEAGUE').first();
  if (!contestType) {
    await knex('contest_types').insert({
      code: 'FREE_LEAGUE',
      name: 'Free League',
      description: 'Practice mode - no entry fee, real prizes funded by platform',
      entry_fee: 0,
      team_size: 5,
      has_captain: true,
      duration_hours: 168,
      rake_percent: 0,
      min_players: 10,
      max_players: 0,
      winners_percent: 10,
      is_free: true,
      display_order: 1,
    });
    contestType = await knex('contest_types').where('code', 'FREE_LEAGUE').first();
    console.log('✅ Inserted FREE_LEAGUE contest type.');
  }

  // ── Step 3: Skip if a demo contest already exists ─────────────────────────
  const existing = await knex('prized_contests')
    .where('name', '🎯 CT Draft — Free League')
    .whereIn('status', ['open', 'locked', 'scoring'])
    .first();

  if (existing) {
    console.log(`⏭  Demo contest already active (id=${existing.id}) — skipping.`);
    return;
  }

  // ── Step 4: Create demo contest ────────────────────────────────────────────
  const now = new Date();
  const day = now.getUTCDay();
  const daysUntilMonday = day === 1 ? 7 : (8 - day) % 7 || 7;
  const lockTime = new Date(now);
  lockTime.setUTCDate(now.getUTCDate() + daysUntilMonday);
  lockTime.setUTCHours(12, 0, 0, 0);
  const endTime = new Date(lockTime.getTime() + 7 * 24 * 60 * 60 * 1000 - 1000);

  const [contest] = await knex('prized_contests').insert({
    contest_type_id: contestType.id,
    contract_contest_id: null,
    contract_address: null,
    name: '🎯 CT Draft — Free League',
    description: 'Draft 5 CT influencers and compete for prizes. Free to enter!',
    entry_fee: '0',
    team_size: contestType.team_size || 5,
    has_captain: contestType.has_captain ?? true,
    is_free: true,
    rake_percent: '0',
    min_players: contestType.min_players || 2,
    max_players: contestType.max_players || 0,
    lock_time: lockTime,
    end_time: endTime,
    status: 'open',
    prize_pool: '0.05',
    distributable_pool: '0.05',
    player_count: 0,
    created_at: new Date(),
    updated_at: new Date(),
  }).returning('*');

  console.log(`✅ Demo contest created (id=${contest.id})`);
  console.log(`   Lock: ${lockTime.toISOString()}`);
  console.log(`   End:  ${endTime.toISOString()}`);
}

export async function down(knex: Knex): Promise<void> {
  await knex('prized_contests')
    .where('name', '🎯 CT Draft — Free League')
    .whereIn('status', ['open', 'locked'])
    .update({ status: 'cancelled', updated_at: new Date() });
  console.log('↩️  Demo contest cancelled.');
}
