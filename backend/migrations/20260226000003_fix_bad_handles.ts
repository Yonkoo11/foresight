import { Knex } from 'knex';

/**
 * Fix C-tier handles that don't match real Twitter accounts.
 * Also fix any influencers missing avatar_url (set to unavatar.io fallback).
 */
export async function up(knex: Knex): Promise<void> {
  // Delete bad/fake handles — the real replacements are already in the DB
  const badHandles = [
    'MMCrypto_CH',      // small unrelated account; MMCrypto already exists
    'CryptoPotato_',    // wrong handle; CryptoPotato already exists
    'NancyPelosi_CT',   // fake parody account
    'CryptoGainz1',     // unverifiable account
    'DocumentingETH',   // unverifiable account
  ];

  await knex('influencers').whereIn('twitter_handle', badHandles).delete();

  // Backfill any remaining NULL avatar_url with unavatar.io
  await knex.raw(`
    UPDATE influencers
    SET avatar_url = 'https://unavatar.io/twitter/' || twitter_handle
    WHERE avatar_url IS NULL OR avatar_url = ''
  `);
}

export async function down(knex: Knex): Promise<void> {
  // Not reversible — handle fixes are improvements
}
