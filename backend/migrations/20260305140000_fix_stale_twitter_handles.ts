import type { Knex } from 'knex';

/**
 * Fix stale Twitter handles that have been changed by their owners.
 * Updates in-place so existing draft picks remain valid.
 */
const HANDLE_UPDATES = [
  { old: '0xMert_',       new: 'mert',          name: 'Mert Mumtaz' },
  { old: 'aeyakovenko',  new: 'toly',          name: 'Anatoly Yakovenko' },
  { old: 'woonomic',     new: 'willywoo',      name: 'Willy Woo' },
  { old: 'nic__carter',  new: 'nic_carter',    name: 'Nic Carter' },
  { old: 'iamDCinvestor', new: 'DCinvestor',   name: 'DCinvestor' },
];

export async function up(knex: Knex): Promise<void> {
  for (const h of HANDLE_UPDATES) {
    await knex('influencers')
      .where('twitter_handle', h.old)
      .update({
        twitter_handle: h.new,
        display_name: h.name,
        avatar_url: null,
        updated_at: knex.fn.now(),
      });
  }
}

export async function down(knex: Knex): Promise<void> {
  for (const h of HANDLE_UPDATES) {
    await knex('influencers')
      .where('twitter_handle', h.new)
      .update({
        twitter_handle: h.old,
        updated_at: knex.fn.now(),
      });
  }
}
