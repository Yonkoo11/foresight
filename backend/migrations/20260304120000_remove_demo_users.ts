/**
 * Remove Demo Users
 *
 * Clears all 15 fake demo users (SolanaWhale, DeFi_Degen, etc.)
 * and their associated data before launch.
 */
import { Knex } from 'knex';

const DEMO_WALLETS = [
  '0x1111111111111111111111111111111111111111',
  '0x2222222222222222222222222222222222222222',
  '0x3333333333333333333333333333333333333333',
  '0x4444444444444444444444444444444444444444',
  '0x5555555555555555555555555555555555555555',
  '0x6666666666666666666666666666666666666666',
  '0x7777777777777777777777777777777777777777',
  '0x8888888888888888888888888888888888888888',
  '0x9999999999999999999999999999999999999999',
  '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
  '0xcccccccccccccccccccccccccccccccccccccccc',
  '0xdddddddddddddddddddddddddddddddddddddd',
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  '0xffffffffffffffffffffffffffffffffffff0001',
];

export async function up(knex: Knex): Promise<void> {
  // Get demo user IDs
  const demoUsers = await knex('users')
    .whereIn('wallet_address', DEMO_WALLETS)
    .select('id');

  const ids = demoUsers.map(u => u.id);

  if (ids.length === 0) {
    console.log('No demo users found, nothing to clean up');
    return;
  }

  // Delete foresight_scores
  const fsDeleted = await knex('foresight_scores').whereIn('user_id', ids).del();
  console.log(`Deleted ${fsDeleted} foresight_scores`);

  // Delete free_league_entries
  const entriesDeleted = await knex('free_league_entries').whereIn('wallet_address', DEMO_WALLETS).del();
  console.log(`Deleted ${entriesDeleted} free_league_entries`);

  // Delete users
  const usersDeleted = await knex('users').whereIn('wallet_address', DEMO_WALLETS).del();
  console.log(`Deleted ${usersDeleted} demo users`);

  // Also clean up the old "Hackathon Demo League" contest
  const demoContest = await knex('prized_contests').where('name', 'Hackathon Demo League').first();
  if (demoContest) {
    await knex('prized_contests').where('id', demoContest.id).update({ player_count: 0 });
    console.log('Reset Hackathon Demo League player count');
  }
}

export async function down(_knex: Knex): Promise<void> {
  // No rollback — demo data should not be re-seeded for production
  console.log('No rollback for demo user removal');
}
