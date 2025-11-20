/**
 * Seed Influencers
 * Populates the database with 50 tracked CT accounts
 */

import db from '../utils/db';

interface Influencer {
  twitter_id: string;
  handle: string;
  name: string;
  tier: 'S' | 'A' | 'B' | 'C';
  base_price: number;
  follower_count?: number;
}

// 50 Top Crypto Twitter Influencers
const influencers: Influencer[] = [
  // S-Tier (45 points) - Mega influencers, 1M+ followers
  { twitter_id: '902926941413453824', handle: 'cz_binance', name: 'CZ', tier: 'S', base_price: 45, follower_count: 8500000 },
  { twitter_id: '295218901', handle: 'VitalikButerin', name: 'Vitalik Buterin', tier: 'S', base_price: 45, follower_count: 5200000 },
  { twitter_id: '537009957', handle: 'balajis', name: 'Balaji Srinivasan', tier: 'S', base_price: 45, follower_count: 950000 },
  { twitter_id: '1419423948', handle: 'APompliano', name: 'Anthony Pompliano', tier: 'S', base_price: 45, follower_count: 1800000 },
  { twitter_id: '6253282', handle: 'elonmusk', name: 'Elon Musk', tier: 'S', base_price: 45, follower_count: 170000000 },
  { twitter_id: '2312333412', handle: 'barton_options', name: 'Ansem', tier: 'S', base_price: 45, follower_count: 580000 },
  { twitter_id: '1549144881', handle: 'brian_armstrong', name: 'Brian Armstrong', tier: 'S', base_price: 45, follower_count: 1100000 },
  { twitter_id: '3300605768', handle: 'cobie', name: 'Cobie', tier: 'S', base_price: 45, follower_count: 820000 },
  { twitter_id: '961445378', handle: 'SBF_FTX', name: 'SBF', tier: 'S', base_price: 45, follower_count: 1500000 },
  { twitter_id: '783214', handle: 'naval', name: 'Naval Ravikant', tier: 'S', base_price: 45, follower_count: 2100000 },

  // A-Tier (35 points) - Major influencers, 500K-1M followers
  { twitter_id: '1362726038', handle: 'layaheilpern', name: 'Laya Heilpern', tier: 'A', base_price: 35, follower_count: 620000 },
  { twitter_id: '1274011694326657026', handle: 'inversebrah', name: 'InverseBrah', tier: 'A', base_price: 35, follower_count: 480000 },
  { twitter_id: '1569347623', handle: 'sassal0x', name: 'sassal', tier: 'A', base_price: 35, follower_count: 710000 },
  { twitter_id: '1390440723290222594', handle: 'DefiIgnas', name: 'DeFi Ignas', tier: 'A', base_price: 35, follower_count: 540000 },
  { twitter_id: '1322695475871318017', handle: 'CryptoCobain', name: 'Crypto Cobain', tier: 'A', base_price: 35, follower_count: 650000 },
  { twitter_id: '884984080882573312', handle: 'AltcoinGordon', name: 'Altcoin Gordon', tier: 'A', base_price: 35, follower_count: 590000 },
  { twitter_id: '1073248908018880512', handle: 'GiganticRebirth', name: 'GCR', tier: 'A', base_price: 35, follower_count: 520000 },
  { twitter_id: '15504735', handle: 'WhalePanda', name: 'WhalePanda', tier: 'A', base_price: 35, follower_count: 480000 },
  { twitter_id: '987321458', handle: 'CryptoWendyO', name: 'Crypto Wendy O', tier: 'A', base_price: 35, follower_count: 670000 },
  { twitter_id: '1587501922517606400', handle: 'rektcapital', name: 'Rekt Capital', tier: 'A', base_price: 35, follower_count: 580000 },
  { twitter_id: '701847669', handle: 'IvanOnTech', name: 'Ivan on Tech', tier: 'A', base_price: 35, follower_count: 690000 },
  { twitter_id: '3284168592', handle: 'CryptosRUs', name: 'George (CryptosRUs)', tier: 'A', base_price: 35, follower_count: 530000 },
  { twitter_id: '1347956961513402369', handle: 'ThinkingUSD', name: 'ThinkingCrypto', tier: 'A', base_price: 35, follower_count: 510000 },
  { twitter_id: '984009074892496896', handle: 'AltcoinPsycho', name: 'Altcoin Psycho', tier: 'A', base_price: 35, follower_count: 560000 },
  { twitter_id: '1264567890123456789', handle: 'thedefiedge', name: 'The DeFi Edge', tier: 'A', base_price: 35, follower_count: 490000 },

  // B-Tier (25 points) - Established voices, 100K-500K followers
  { twitter_id: '1346536722', handle: 'JackTheRippler', name: 'Jack the Rippler', tier: 'B', base_price: 25, follower_count: 380000 },
  { twitter_id: '1487234567890123456', handle: 'Route2FI', name: 'Route2FI', tier: 'B', base_price: 25, follower_count: 320000 },
  { twitter_id: '2876543210987654321', handle: 'CryptoHayes', name: 'Arthur Hayes', tier: 'B', base_price: 25, follower_count: 420000 },
  { twitter_id: '1234567891234567890', handle: 'DeFi_Dad', name: 'DeFi Dad', tier: 'B', base_price: 25, follower_count: 290000 },
  { twitter_id: '9876543219876543210', handle: 'MessariCrypto', name: 'Messari', tier: 'B', base_price: 25, follower_count: 350000 },
  { twitter_id: '1122334455667788990', handle: 'econoar', name: 'Ryan Sean Adams', tier: 'B', base_price: 25, follower_count: 310000 },
  { twitter_id: '2233445566778899001', handle: 'TrustlessState', name: 'Trustless State', tier: 'B', base_price: 25, follower_count: 270000 },
  { twitter_id: '3344556677889900112', handle: 'CroissantEth', name: 'Croissant', tier: 'B', base_price: 25, follower_count: 340000 },
  { twitter_id: '4455667788990011223', handle: 'CryptoCred', name: 'Cred', tier: 'B', base_price: 25, follower_count: 280000 },
  { twitter_id: '5566778899001122334', handle: 'EmperorBTC', name: 'Emperor', tier: 'B', base_price: 25, follower_count: 360000 },
  { twitter_id: '6677889900112233445', handle: 'TraderMayne', name: 'Trader Mayne', tier: 'B', base_price: 25, follower_count: 240000 },
  { twitter_id: '7788990011223344556', handle: 'CryptoDonAlt', name: 'Crypto Don Alt', tier: 'B', base_price: 25, follower_count: 330000 },
  { twitter_id: '8899001122334455667', handle: 'VentureCoinist', name: 'Venture Coinist', tier: 'B', base_price: 25, follower_count: 260000 },
  { twitter_id: '9900112233445566778', handle: 'notthreadguy', name: 'Thread Guy', tier: 'B', base_price: 25, follower_count: 300000 },
  { twitter_id: '1011223344556677889', handle: 'CryptoKaleo', name: 'Kaleo', tier: 'B', base_price: 25, follower_count: 370000 },

  // C-Tier (15 points) - Rising stars, <100K followers
  { twitter_id: '1122334455667788991', handle: 'trendingalpha', name: 'Trending Alpha', tier: 'C', base_price: 15, follower_count: 85000 },
  { twitter_id: '2233445566778899002', handle: 'thedefiant_io', name: 'The Defiant', tier: 'C', base_price: 15, follower_count: 92000 },
  { twitter_id: '3344556677889900113', handle: 'cdixon', name: 'Chris Dixon', tier: 'C', base_price: 15, follower_count: 78000 },
  { twitter_id: '4455667788990011224', handle: 'hasufl', name: 'Hasu', tier: 'C', base_price: 15, follower_count: 95000 },
  { twitter_id: '5566778899001122335', handle: 'niccarter', name: 'Nic Carter', tier: 'C', base_price: 15, follower_count: 88000 },
  { twitter_id: '6677889900112233446', handle: 'laurashin', name: 'Laura Shin', tier: 'C', base_price: 15, follower_count: 91000 },
  { twitter_id: '7788990011223344557', handle: 'rleshner', name: 'Robert Leshner', tier: 'C', base_price: 15, follower_count: 72000 },
  { twitter_id: '8899001122334455668', handle: 'stani', name: 'Stani Kulechov', tier: 'C', base_price: 15, follower_count: 83000 },
  { twitter_id: '9900112233445566779', handle: 'kaiynne', name: 'Kain Warwick', tier: 'C', base_price: 15, follower_count: 79000 },
  { twitter_id: '1011223344556677890', handle: 'ameensol', name: 'Ameen Soleimani', tier: 'C', base_price: 15, follower_count: 68000 },
];

async function seedInfluencers() {
  try {
    console.log('========================================');
    console.log('Starting Influencer Seed');
    console.log('========================================\n');

    let inserted = 0;
    let skipped = 0;

    for (const influencer of influencers) {
      try {
        const result = await db.raw(
          `INSERT INTO influencers (twitter_id, handle, name, tier, base_price, follower_count)
           VALUES (?, ?, ?, ?, ?, ?)
           ON CONFLICT (twitter_id) DO NOTHING
           RETURNING id`,
          [
            influencer.twitter_id,
            influencer.handle,
            influencer.name,
            influencer.tier,
            influencer.base_price,
            influencer.follower_count || 0,
          ]
        );

        if (result.rowCount && result.rowCount > 0) {
          inserted++;
          console.log(`✅ Added: @${influencer.handle.padEnd(20)} | ${influencer.tier}-Tier | ${influencer.base_price} pts`);
        } else {
          skipped++;
          console.log(`⏭️  Skipped: @${influencer.handle.padEnd(20)} (already exists)`);
        }
      } catch (error) {
        console.error(`❌ Error adding @${influencer.handle}:`, error);
      }
    }

    console.log('\n========================================');
    console.log('Seed Summary');
    console.log('========================================');
    console.log(`✅ Inserted: ${inserted}`);
    console.log(`⏭️  Skipped:  ${skipped}`);
    console.log(`📊 Total:    ${influencers.length}`);
    console.log('========================================\n');

    // Verify counts
    const tierCounts = await db.raw(
      `SELECT tier, COUNT(*) as count FROM influencers GROUP BY tier ORDER BY tier`
    );

    console.log('Tier Distribution:');
    tierCounts.rows.forEach((row: any) => {
      console.log(`  ${row.tier}-Tier: ${row.count} influencers`);
    });

    console.log('\n✅ Influencer seed completed successfully!\n');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
}

// Run seed if executed directly
if (require.main === module) {
  seedInfluencers()
    .then(() => {
      console.log('Exiting...');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export default seedInfluencers;
