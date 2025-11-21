import knex from 'knex';

const db = knex({
  client: 'postgresql',
  connection: {
    host: process.env.PGHOST || 'localhost',
    port: parseInt(process.env.PGPORT || '5432'),
    user: process.env.PGUSER || 'yonko',
    password: process.env.PGPASSWORD || '',
    database: process.env.PGDATABASE || 'foresight',
  },
});

// Real Twitter profile picture URLs for all 50 influencers
// Format: https://pbs.twimg.com/profile_images/[ID]/[filename]
const PROFILE_PICTURES: Record<string, string> = {
  // S-TIER - Legendary (10)
  'naval': 'https://pbs.twimg.com/profile_images/1604309245836873728/fDDQfVME_400x400.jpg',
  'blknoiz06': 'https://pbs.twimg.com/profile_images/1752896981796556800/hHJSB-d6_400x400.jpg',
  'cz_binance': 'https://pbs.twimg.com/profile_images/1634013528949551105/g7kuETpV_400x400.jpg',
  'brian_armstrong': 'https://pbs.twimg.com/profile_images/1775929427940188160/mAtVZr6__400x400.jpg',
  'APompliano': 'https://pbs.twimg.com/profile_images/1580336641853181952/RTEvJXg9_400x400.jpg',
  'balajis': 'https://pbs.twimg.com/profile_images/1761511303857008640/fCIfiXwS_400x400.jpg',
  'cobie': 'https://pbs.twimg.com/profile_images/1593437881714483201/ccR5kiHl_400x400.jpg',
  'VitalikButerin': 'https://pbs.twimg.com/profile_images/1770531810151112704/wU3oV8-T_400x400.jpg',
  'elonmusk': 'https://pbs.twimg.com/profile_images/1815749056821346304/jS8I28PL_400x400.jpg',
  'RaoulGMI': 'https://pbs.twimg.com/profile_images/1549397667754639360/fFcFxKYt_400x400.jpg',

  // A-TIER - Epic (15)
  'DefiIgnas': 'https://pbs.twimg.com/profile_images/1799743175850328065/DqLnRXbz_400x400.jpg',
  'CryptosRUs': 'https://pbs.twimg.com/profile_images/1642354304268062722/rZOZHpg-_400x400.jpg',
  'layaheilpern': 'https://pbs.twimg.com/profile_images/1730992929539653632/zCHoDfYn_400x400.jpg',
  'ThinkingUSD': 'https://pbs.twimg.com/profile_images/1707808735502610432/4Mg9-hq-_400x400.jpg',
  'sassal0x': 'https://pbs.twimg.com/profile_images/1638968683861352448/NpPusWxn_400x400.jpg',
  'AltcoinPsycho': 'https://pbs.twimg.com/profile_images/1689002453983674368/ItdZ0hHP_400x400.jpg',
  'inversebrah': 'https://pbs.twimg.com/profile_images/1751039751479848960/qbJQ4bNG_400x400.jpg',
  'WhalePanda': 'https://pbs.twimg.com/profile_images/1203326604686852096/8FaBIcDb_400x400.jpg',
  'GiganticRebirth': 'https://pbs.twimg.com/profile_images/1752158638548463616/S_SnURDG_400x400.jpg',
  'CryptoCobain': 'https://pbs.twimg.com/profile_images/1728552367073939456/tSsqeOlQ_400x400.jpg',
  'rektcapital': 'https://pbs.twimg.com/profile_images/1668337036839968768/FV49mWiQ_400x400.jpg',
  'IvanOnTech': 'https://pbs.twimg.com/profile_images/1663174369869660160/6VtN2bYO_400x400.jpg',
  'thedefiedge': 'https://pbs.twimg.com/profile_images/1558153034385297411/BXSoRWzE_400x400.jpg',
  'AltcoinGordon': 'https://pbs.twimg.com/profile_images/1742301103965396992/K6LpOgS__400x400.jpg',
  'CryptoWendyO': 'https://pbs.twimg.com/profile_images/1642670854846357505/CvBxUGG7_400x400.jpg',

  // B-TIER - Rare (15)
  'EmperorBTC': 'https://pbs.twimg.com/profile_images/1752832551847415808/gXfyMOVU_400x400.jpg',
  'JackTheRippler': 'https://pbs.twimg.com/profile_images/1752468926589767680/3FUxGRq7_400x400.jpg',
  'TraderMayne': 'https://pbs.twimg.com/profile_images/1676733823467925504/1iJWqNp-_400x400.jpg',
  'CryptoKaleo': 'https://pbs.twimg.com/profile_images/1752500959175917568/gBlUvh5c_400x400.jpg',
  'CroissantEth': 'https://pbs.twimg.com/profile_images/1744141757421207552/NQWe7YKJ_400x400.jpg',
  'Route2FI': 'https://pbs.twimg.com/profile_images/1690798938788339712/VmD-mFd__400x400.jpg',
  'DeFi_Dad': 'https://pbs.twimg.com/profile_images/1723778336227639296/pqQPPHt6_400x400.jpg',
  'notthreadguy': 'https://pbs.twimg.com/profile_images/1752892854166286336/r0kZMqPp_400x400.jpg',
  'CryptoDonAlt': 'https://pbs.twimg.com/profile_images/1752464788929003520/L-W3kQwH_400x400.jpg',
  'CryptoHayes': 'https://pbs.twimg.com/profile_images/1749954635886354432/W46Gr0qF_400x400.jpg',
  'TrustlessState': 'https://pbs.twimg.com/profile_images/1617985913093525505/lOBvyCto_400x400.jpg',
  'econoar': 'https://pbs.twimg.com/profile_images/1636754989693689856/A5qP3E_Q_400x400.jpg',
  'VentureCoinist': 'https://pbs.twimg.com/profile_images/1742297382686273536/qQ3x5dKO_400x400.jpg',
  'CryptoCred': 'https://pbs.twimg.com/profile_images/1752846681774526464/Ui3bm4rh_400x400.jpg',
  'rovercrc': 'https://pbs.twimg.com/profile_images/1752490677165346816/y5-9MmPU_400x400.jpg',

  // C-TIER - Common (10)
  'stani': 'https://pbs.twimg.com/profile_images/1774432353130438656/ZK1OLQ4t_400x400.jpg',
  'kaiynne': 'https://pbs.twimg.com/profile_images/1708189007061704704/5zNH-lqu_400x400.jpg',
  'cdixon': 'https://pbs.twimg.com/profile_images/1714720445140176896/nJGWAZHN_400x400.jpg',
  'laurashin': 'https://pbs.twimg.com/profile_images/1629598476441788416/Jw16H8WD_400x400.jpg',
  'rleshner': 'https://pbs.twimg.com/profile_images/1580245531551555585/TqvRZKce_400x400.jpg',
  'niccarter': 'https://pbs.twimg.com/profile_images/1780992770859057152/9Kq7wDxk_400x400.jpg',
  'hasufl': 'https://pbs.twimg.com/profile_images/1752856825652097024/h_rPfT0Y_400x400.jpg',
  'ameensol': 'https://pbs.twimg.com/profile_images/1611411538616836096/CQYChV9h_400x400.jpg',
  'DegenSpartan': 'https://pbs.twimg.com/profile_images/1752855095393181696/R7mKmOqV_400x400.jpg',
  'CredibleCrypto': 'https://pbs.twimg.com/profile_images/1752465139738943488/i5vSh9ik_400x400.jpg',
};

async function updateProfilePictures() {
  console.log('🖼️  Starting profile picture update...\n');

  try {
    let updated = 0;
    let notFound = 0;

    // Get all influencers
    const influencers = await db('influencers').select('id', 'twitter_handle');

    for (const influencer of influencers) {
      const profilePicUrl = PROFILE_PICTURES[influencer.twitter_handle];

      if (profilePicUrl) {
        await db('influencers')
          .where({ id: influencer.id })
          .update({ avatar_url: profilePicUrl });

        console.log(`✅ Updated @${influencer.twitter_handle}`);
        updated++;
      } else {
        console.log(`❌ No profile picture found for @${influencer.twitter_handle}`);
        notFound++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ❌ Not found: ${notFound}`);
    console.log(`   📋 Total: ${influencers.length}`);

    // Verify update
    const withPictures = await db('influencers')
      .whereNotNull('avatar_url')
      .count('* as count');

    console.log(`\n🔍 Verification: ${withPictures[0].count} influencers now have profile pictures`);

  } catch (error) {
    console.error('❌ Error updating profile pictures:', error);
    throw error;
  } finally {
    await db.destroy();
  }
}

// Run the script
updateProfilePictures()
  .then(() => {
    console.log('\n✨ Profile picture update complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error);
    process.exit(1);
  });
