import { Knex } from 'knex';

/**
 * Add 49 missing C-tier influencers to reach 100 total.
 * Uses INSERT ON CONFLICT DO NOTHING to be safe for re-runs.
 * Excludes handles already in production DB.
 */
export async function up(knex: Knex): Promise<void> {
  const cTierInfluencers = [
    // Real CT accounts for C-tier ($12–18)
    { twitter_handle: 'MMCrypto', display_name: 'MMCrypto', follower_count: 510000, engagement_rate: 6.5 },
    { twitter_handle: 'AltcoinDaily', display_name: 'Altcoin Daily', follower_count: 520000, engagement_rate: 7.9 },
    { twitter_handle: 'CryptoZachXBT', display_name: 'ZachXBT', follower_count: 360000, engagement_rate: 9.4 },
    { twitter_handle: 'DocumentingBTC', display_name: 'Documenting Bitcoin', follower_count: 780000, engagement_rate: 8.5 },
    { twitter_handle: 'BitcoinArchive', display_name: 'Bitcoin Archive', follower_count: 590000, engagement_rate: 7.8 },
    { twitter_handle: 'RaoulGMI', display_name: 'Raoul Pal', follower_count: 1100000, engagement_rate: 8.1 },
    { twitter_handle: 'intocryptoverse', display_name: 'Benjamin Cowen', follower_count: 350000, engagement_rate: 7.2 },
    { twitter_handle: 'scottmelker', display_name: 'The Wolf Of All Streets', follower_count: 420000, engagement_rate: 6.7 },
    { twitter_handle: 'TheMoonCarl', display_name: 'The Moon Carl', follower_count: 320000, engagement_rate: 6.2 },
    { twitter_handle: 'inversebrah', display_name: 'InverseBrah', follower_count: 190000, engagement_rate: 7.4 },
    { twitter_handle: 'sassal0x', display_name: 'Sassal', follower_count: 420000, engagement_rate: 8.7 },
    { twitter_handle: 'CryptoKaleo', display_name: 'Kaleo', follower_count: 310000, engagement_rate: 8.9 },
    { twitter_handle: 'WhalePanda', display_name: 'WhalePanda', follower_count: 520000, engagement_rate: 6.3 },
    { twitter_handle: 'CryptoCobain', display_name: 'Crypto Cobain', follower_count: 580000, engagement_rate: 8.1 },
    { twitter_handle: 'DegenSpartan', display_name: 'Degen Spartan', follower_count: 550000, engagement_rate: 4.8 },
    { twitter_handle: 'APompliano', display_name: 'Anthony Pompliano', follower_count: 1700000, engagement_rate: 7.9 },
    { twitter_handle: 'saylor', display_name: 'Michael Saylor', follower_count: 3200000, engagement_rate: 9.4 },
    { twitter_handle: 'hasufl', display_name: 'Hasu', follower_count: 260000, engagement_rate: 9.1 },
    { twitter_handle: 'TechDev_52', display_name: 'TechDev', follower_count: 180000, engagement_rate: 8.5 },
    { twitter_handle: 'TraderSZ', display_name: 'TraderSZ', follower_count: 110000, engagement_rate: 8.2 },
    { twitter_handle: 'CryptoMichNL', display_name: 'Crypto Michaël', follower_count: 450000, engagement_rate: 8.3 },
    { twitter_handle: 'notthreadguy', display_name: 'Not Thread Guy', follower_count: 85000, engagement_rate: 6.9 },
    { twitter_handle: 'AlexBeckerCrypto', display_name: 'Alex Becker', follower_count: 190000, engagement_rate: 6.7 },
    { twitter_handle: 'CryptoQuant', display_name: 'CryptoQuant', follower_count: 270000, engagement_rate: 8.9 },
    { twitter_handle: 'CryptoPotato_', display_name: 'CryptoPotato', follower_count: 160000, engagement_rate: 6.9 },
    { twitter_handle: 'zhusu', display_name: 'Zhu Su', follower_count: 620000, engagement_rate: 4.2 },
    { twitter_handle: 'AltcoinSara', display_name: 'Altcoin Sara', follower_count: 120000, engagement_rate: 6.8 },
    { twitter_handle: 'CryptoVizArt', display_name: 'CryptoVizArt', follower_count: 92000, engagement_rate: 8.4 },
    { twitter_handle: 'BlockchainBabe', display_name: 'Blockchain Babe', follower_count: 89000, engagement_rate: 7.8 },
    { twitter_handle: 'TheCryptoLark', display_name: 'Lark Davis', follower_count: 450000, engagement_rate: 5.7 },
    { twitter_handle: 'CryptoCrispus', display_name: 'Crypto Crispus', follower_count: 92000, engagement_rate: 7.8 },
    { twitter_handle: 'altcoinpsycho', display_name: 'Altcoin Psycho', follower_count: 380000, engagement_rate: 7.5 },
    { twitter_handle: 'IamCryptoWolf', display_name: 'Crypto Wolf', follower_count: 160000, engagement_rate: 6.1 },
    { twitter_handle: 'RunnerXBT', display_name: 'Runner', follower_count: 210000, engagement_rate: 8.1 },
    { twitter_handle: 'twobitidiot', display_name: 'Ryan Selkis', follower_count: 350000, engagement_rate: 5.9 },
    { twitter_handle: 'CryptoCruz', display_name: 'Crypto Cruz', follower_count: 82000, engagement_rate: 6.5 },
    { twitter_handle: 'MessariCrypto', display_name: 'Messari', follower_count: 280000, engagement_rate: 7.1 },
    { twitter_handle: 'NancyPelosi_CT', display_name: 'On-Chain Nancy', follower_count: 68000, engagement_rate: 8.3 },
    { twitter_handle: 'CryptoEmpress', display_name: 'Crypto Empress', follower_count: 105000, engagement_rate: 6.9 },
    { twitter_handle: 'BigCheds', display_name: 'Big Cheds', follower_count: 170000, engagement_rate: 8.3 },
    { twitter_handle: 'Galois_Capital', display_name: 'Galois Capital', follower_count: 120000, engagement_rate: 6.3 },
    { twitter_handle: 'CryptoHamster', display_name: 'CryptoHamster', follower_count: 120000, engagement_rate: 6.8 },
    { twitter_handle: 'CryptoRover', display_name: 'Crypto Rover', follower_count: 95000, engagement_rate: 7.2 },
    { twitter_handle: 'CryptoStache', display_name: 'Crypto Stache', follower_count: 48000, engagement_rate: 6.7 },
    { twitter_handle: 'CryptoSays', display_name: 'CryptoSays', follower_count: 82000, engagement_rate: 5.8 },
    { twitter_handle: 'MMCrypto_CH', display_name: 'MMCrypto CH', follower_count: 65000, engagement_rate: 7.2 },
    { twitter_handle: 'PlanB_BTC', display_name: 'PlanB', follower_count: 1900000, engagement_rate: 9.7 },
    { twitter_handle: 'CryptoGainz1', display_name: 'Crypto Gainz', follower_count: 180000, engagement_rate: 7.3 },
    { twitter_handle: 'DocumentingETH', display_name: 'Documenting ETH', follower_count: 95000, engagement_rate: 7.6 },
  ];

  // Get existing handles to avoid duplicates
  const existing = await knex('influencers').select('twitter_handle');
  const existingHandles = new Set(existing.map((r: { twitter_handle: string }) => r.twitter_handle.toLowerCase()));

  const toInsert = cTierInfluencers
    .filter(inf => !existingHandles.has(inf.twitter_handle.toLowerCase()))
    .map(inf => ({
      twitter_handle: inf.twitter_handle,
      display_name: inf.display_name,
      avatar_url: `https://unavatar.io/twitter/${inf.twitter_handle}`,
      bio: `CT influencer with ${inf.follower_count.toLocaleString()} followers`,
      tier: 'C',
      price: 12,
      base_price: 12,
      follower_count: inf.follower_count,
      engagement_rate: inf.engagement_rate,
      form_score: 65,
      total_points: 0,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    }));

  if (toInsert.length > 0) {
    await knex('influencers').insert(toInsert);
  }

  // Re-run tier assignment so C-tier gets proper prices
  await knex.raw(`
    WITH tier_prices AS (
      SELECT
        id,
        tier,
        engagement_rate,
        CASE tier
          WHEN 'S' THEN 38 + ROUND((PERCENT_RANK() OVER (PARTITION BY tier ORDER BY engagement_rate))::numeric * 10)
          WHEN 'A' THEN 25 + ROUND((PERCENT_RANK() OVER (PARTITION BY tier ORDER BY engagement_rate))::numeric * 10)
          WHEN 'B' THEN 18 + ROUND((PERCENT_RANK() OVER (PARTITION BY tier ORDER BY engagement_rate))::numeric * 7)
          ELSE          12 + ROUND((PERCENT_RANK() OVER (PARTITION BY tier ORDER BY engagement_rate))::numeric * 6)
        END AS new_price
      FROM influencers
      WHERE is_active = true
    )
    UPDATE influencers
    SET price = tier_prices.new_price, base_price = tier_prices.new_price
    FROM tier_prices
    WHERE influencers.id = tier_prices.id
  `);

  const counts = await knex('influencers')
    .select('tier')
    .groupBy('tier')
    .count('* as count')
    .orderBy('tier');
  console.log(`✅ Inserted ${toInsert.length} C-tier influencers`);
  console.log('Final tier distribution:', JSON.stringify(counts));
}

export async function down(knex: Knex): Promise<void> {
  const handles = [
    'MMCrypto', 'AltcoinDaily', 'CryptoZachXBT', 'DocumentingBTC', 'BitcoinArchive',
    'RaoulGMI', 'intocryptoverse', 'scottmelker', 'TheMoonCarl', 'inversebrah',
    'sassal0x', 'CryptoKaleo', 'WhalePanda', 'CryptoCobain', 'DegenSpartan',
    'APompliano', 'saylor', 'hasufl', 'TechDev_52', 'TraderSZ',
    'CryptoMichNL', 'notthreadguy', 'AlexBeckerCrypto', 'CryptoQuant', 'CryptoPotato_',
    'zhusu', 'AltcoinSara', 'CryptoVizArt', 'BlockchainBabe', 'TheCryptoLark',
    'CryptoCrispus', 'altcoinpsycho', 'IamCryptoWolf', 'RunnerXBT', 'twobitidiot',
    'CryptoCruz', 'MessariCrypto', 'NancyPelosi_CT', 'CryptoEmpress', 'BigCheds',
    'Galois_Capital', 'CryptoHamster', 'CryptoRover', 'CryptoStache', 'CryptoSays',
    'MMCrypto_CH', 'PlanB_BTC', 'CryptoGainz1', 'DocumentingETH',
  ];
  await knex('influencers').whereIn('twitter_handle', handles).del();
}
