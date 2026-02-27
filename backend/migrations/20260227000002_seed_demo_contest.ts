import { Knex } from 'knex';

/**
 * Seed a demo FREE_LEAGUE contest for production.
 *
 * Lock: next Monday 12:00 UTC
 * End:  following Sunday 23:59 UTC
 *
 * Safe to re-deploy — skips if a contest with this name is already active.
 */
export async function up(knex: Knex): Promise<void> {
  // Skip if a demo contest is already active
  const existing = await knex('prized_contests')
    .where('name', '🎯 CT Draft — Free League')
    .whereIn('status', ['open', 'locked', 'scoring'])
    .first();

  if (existing) {
    console.log(`⏭  Demo contest already active (id=${existing.id}) — skipping seed.`);
    return;
  }

  const contestType = await knex('contest_types').where('code', 'FREE_LEAGUE').first();
  if (!contestType) {
    console.error('❌ FREE_LEAGUE contest type not found. Skipping demo contest seed.');
    return;
  }

  // Lock next Monday 12:00 UTC, end following Sunday 23:59 UTC
  const now = new Date();
  const day = now.getUTCDay(); // 0=Sun, 1=Mon ... 6=Sat
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
