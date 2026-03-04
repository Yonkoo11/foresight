import type { Knex } from 'knex';

/**
 * Replace influencer 73IV_ (hokage) with CryptoLeon (@Crypto_Leon_).
 * Updates the row in-place so existing draft picks remain valid.
 */
export async function up(knex: Knex): Promise<void> {
  await knex('influencers')
    .where('twitter_handle', '73IV_')
    .update({
      twitter_handle: 'Crypto_Leon_',
      display_name: 'CryptoLeon',
      profile_image_url: null,
      follower_count: 0,
      engagement_rate: 0,
      updated_at: knex.fn.now(),
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex('influencers')
    .where('twitter_handle', 'Crypto_Leon_')
    .update({
      twitter_handle: '73IV_',
      display_name: 'Hokage',
      profile_image_url: null,
      follower_count: 0,
      engagement_rate: 0,
      updated_at: knex.fn.now(),
    });
}
