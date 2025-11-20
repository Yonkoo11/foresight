import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Clear existing data
  await knex('influencers').del();

  // Top 100 CT accounts (realistic mix of popular crypto Twitter personalities)
  const influencers = [
    // Tier 1: Mega influencers (1-20)
    { id: 1, twitter_handle: 'VitalikButerin', display_name: 'Vitalik Buterin', follower_count: 5200000, engagement_rate: 8.5 },
    { id: 2, twitter_handle: 'elonmusk', display_name: 'Elon Musk', follower_count: 170000000, engagement_rate: 12.3 },
    { id: 3, twitter_handle: 'cz_binance', display_name: 'CZ', follower_count: 8500000, engagement_rate: 7.2 },
    { id: 4, twitter_handle: 'brian_armstrong', display_name: 'Brian Armstrong', follower_count: 1200000, engagement_rate: 5.1 },
    { id: 5, twitter_handle: 'SBF_FTX', display_name: 'SBF', follower_count: 1100000, engagement_rate: 6.8 },
    { id: 6, twitter_handle: 'saylor', display_name: 'Michael Saylor', follower_count: 3200000, engagement_rate: 9.4 },
    { id: 7, twitter_handle: 'APompliano', display_name: 'Anthony Pompliano', follower_count: 1700000, engagement_rate: 7.9 },
    { id: 8, twitter_handle: 'WhalePanda', display_name: 'WhalePanda', follower_count: 520000, engagement_rate: 6.3 },
    { id: 9, twitter_handle: 'CryptoCobain', display_name: 'Crypto Cobain', follower_count: 580000, engagement_rate: 8.1 },
    { id: 10, twitter_handle: 'TheCryptoLark', display_name: 'Lark Davis', follower_count: 450000, engagement_rate: 5.7 },
    { id: 11, twitter_handle: 'altcoinpsycho', display_name: 'Altcoin Psycho', follower_count: 380000, engagement_rate: 7.5 },
    { id: 12, twitter_handle: 'CryptoWendyO', display_name: 'Crypto Wendy O', follower_count: 290000, engagement_rate: 6.9 },
    { id: 13, twitter_handle: 'AltcoinGordon', display_name: 'Altcoin Gordon', follower_count: 310000, engagement_rate: 5.8 },
    { id: 14, twitter_handle: 'sassal0x', display_name: 'sassal', follower_count: 420000, engagement_rate: 8.7 },
    { id: 15, twitter_handle: 'cmsholdings', display_name: 'CMS Holdings', follower_count: 350000, engagement_rate: 6.4 },
    { id: 16, twitter_handle: 'DeFi_Dad', display_name: 'DeFi Dad', follower_count: 280000, engagement_rate: 7.3 },
    { id: 17, twitter_handle: 'hasufl', display_name: 'Hasu', follower_count: 260000, engagement_rate: 9.1 },
    { id: 18, twitter_handle: 'twobitidiot', display_name: 'Ryan Selkis', follower_count: 350000, engagement_rate: 5.9 },
    { id: 19, twitter_handle: 'trustlessstate', display_name: 'Trustless State', follower_count: 180000, engagement_rate: 7.8 },
    { id: 20, twitter_handle: 'scottmelker', display_name: 'The Wolf Of All Streets', follower_count: 420000, engagement_rate: 6.7 },

    // Tier 2: Major influencers (21-50)
    { id: 21, twitter_handle: 'CryptoCapo_', display_name: 'Crypto Capo', follower_count: 270000, engagement_rate: 8.2 },
    { id: 22, twitter_handle: 'inversebrah', display_name: 'Inverse', follower_count: 190000, engagement_rate: 7.4 },
    { id: 23, twitter_handle: 'DegenSpartan', display_name: 'Degen Spartan', follower_count: 210000, engagement_rate: 9.3 },
    { id: 24, twitter_handle: 'IamCryptoWolf', display_name: 'Crypto Wolf', follower_count: 160000, engagement_rate: 6.1 },
    { id: 25, twitter_handle: 'AngeloBTC', display_name: 'Angelo BTC', follower_count: 140000, engagement_rate: 5.5 },
    { id: 26, twitter_handle: 'CryptoKaleo', display_name: 'Kaleo', follower_count: 310000, engagement_rate: 8.9 },
    { id: 27, twitter_handle: 'CryptoHamster', display_name: 'CryptoHamster', follower_count: 120000, engagement_rate: 6.8 },
    { id: 28, twitter_handle: 'CryptoMonarch', display_name: 'Crypto Monarch', follower_count: 95000, engagement_rate: 7.1 },
    { id: 29, twitter_handle: 'JohnJKarony', display_name: 'John Karony', follower_count: 220000, engagement_rate: 5.4 },
    { id: 30, twitter_handle: 'CryptoBirb', display_name: 'Crypto Birb', follower_count: 250000, engagement_rate: 7.7 },
    { id: 31, twitter_handle: 'TechDev_52', display_name: 'TechDev', follower_count: 180000, engagement_rate: 8.5 },
    { id: 32, twitter_handle: 'TheMoonCarl', display_name: 'The Moon Carl', follower_count: 320000, engagement_rate: 6.2 },
    { id: 33, twitter_handle: 'BitBoy_Crypto', display_name: 'BitBoy Crypto', follower_count: 470000, engagement_rate: 5.8 },
    { id: 34, twitter_handle: 'CryptoGodJohn', display_name: 'Crypto God John', follower_count: 130000, engagement_rate: 7.9 },
    { id: 35, twitter_handle: 'TraderXO', display_name: 'TraderXO', follower_count: 110000, engagement_rate: 6.5 },
    { id: 36, twitter_handle: 'BigCheds', display_name: 'Big Cheds', follower_count: 170000, engagement_rate: 8.3 },
    { id: 37, twitter_handle: 'CryptoJelleNL', display_name: 'Crypto Jelle', follower_count: 140000, engagement_rate: 6.9 },
    { id: 38, twitter_handle: 'CryptoTutor', display_name: 'Crypto Tutor', follower_count: 95000, engagement_rate: 5.7 },
    { id: 39, twitter_handle: 'EllioTrades', display_name: 'Ellio Trades', follower_count: 380000, engagement_rate: 7.4 },
    { id: 40, twitter_handle: 'PlanB_BTC', display_name: 'PlanB', follower_count: 1900000, engagement_rate: 9.7 },
    { id: 41, twitter_handle: 'Pentosh1', display_name: 'Pentoshi', follower_count: 490000, engagement_rate: 8.8 },
    { id: 42, twitter_handle: 'Galois_Capital', display_name: 'Galois Capital', follower_count: 120000, engagement_rate: 6.3 },
    { id: 43, twitter_handle: 'intocryptoverse', display_name: 'Benjamin Cowen', follower_count: 350000, engagement_rate: 7.2 },
    { id: 44, twitter_handle: 'RunnerXBT', display_name: 'Runner', follower_count: 210000, engagement_rate: 8.1 },
    { id: 45, twitter_handle: 'SmartContracter', display_name: 'Smart Contracter', follower_count: 270000, engagement_rate: 7.6 },
    { id: 46, twitter_handle: 'CryptoCred', display_name: 'Crypto Cred', follower_count: 320000, engagement_rate: 8.4 },
    { id: 47, twitter_handle: 'CryptoWhale', display_name: 'Crypto Whale', follower_count: 850000, engagement_rate: 6.8 },
    { id: 48, twitter_handle: 'SheldonEvans', display_name: 'Sheldon Evans', follower_count: 95000, engagement_rate: 5.9 },
    { id: 49, twitter_handle: 'CryptoGainz1', display_name: 'Crypto Gainz', follower_count: 180000, engagement_rate: 7.3 },
    { id: 50, twitter_handle: 'RektCapital', display_name: 'Rekt Capital', follower_count: 440000, engagement_rate: 8.6 },

    // Tier 3: Rising influencers (51-80)
    { id: 51, twitter_handle: 'CryptoRick2021', display_name: 'Crypto Rick', follower_count: 75000, engagement_rate: 6.4 },
    { id: 52, twitter_handle: 'CryptoSays', display_name: 'Crypto Says', follower_count: 82000, engagement_rate: 5.8 },
    { id: 53, twitter_handle: 'CryptoBusy', display_name: 'Crypto Busy', follower_count: 68000, engagement_rate: 7.1 },
    { id: 54, twitter_handle: 'MMCrypto', display_name: 'MMCrypto', follower_count: 510000, engagement_rate: 6.5 },
    { id: 55, twitter_handle: 'CryptoCrispus', display_name: 'Crypto Crispus', follower_count: 92000, engagement_rate: 7.8 },
    { id: 56, twitter_handle: 'TraderSZ', display_name: 'TraderSZ', follower_count: 110000, engagement_rate: 8.2 },
    { id: 57, twitter_handle: 'notthreadguy', display_name: 'Not Thread Guy', follower_count: 85000, engagement_rate: 6.9 },
    { id: 58, twitter_handle: 'CryptoKaiser', display_name: 'Crypto Kaiser', follower_count: 73000, engagement_rate: 5.6 },
    { id: 59, twitter_handle: 'CryptoBull2020', display_name: 'Crypto Bull', follower_count: 98000, engagement_rate: 7.4 },
    { id: 60, twitter_handle: 'TheCryptoDog', display_name: 'Crypto Dog', follower_count: 420000, engagement_rate: 8.7 },
    { id: 61, twitter_handle: 'CryptoTea_', display_name: 'Crypto Tea', follower_count: 61000, engagement_rate: 6.2 },
    { id: 62, twitter_handle: 'CryptoFacilities', display_name: 'Crypto Facilities', follower_count: 88000, engagement_rate: 5.9 },
    { id: 63, twitter_handle: 'CryptoNewton', display_name: 'Crypto Newton', follower_count: 79000, engagement_rate: 7.5 },
    { id: 64, twitter_handle: 'AlexBeckerCrypto', display_name: 'Alex Becker', follower_count: 190000, engagement_rate: 6.7 },
    { id: 65, twitter_handle: 'AltcoinDaily', display_name: 'Altcoin Daily', follower_count: 520000, engagement_rate: 7.9 },
    { id: 66, twitter_handle: 'ComoZambrano', display_name: 'Como Zambrano', follower_count: 71000, engagement_rate: 6.3 },
    { id: 67, twitter_handle: 'CryptoRover', display_name: 'Crypto Rover', follower_count: 95000, engagement_rate: 7.2 },
    { id: 68, twitter_handle: 'CryptosRUs', display_name: 'CryptosRUs', follower_count: 280000, engagement_rate: 6.8 },
    { id: 69, twitter_handle: 'CryptoZachXBT', display_name: 'ZachXBT', follower_count: 360000, engagement_rate: 9.4 },
    { id: 70, twitter_handle: 'TheRealKiyosaki', display_name: 'Robert Kiyosaki', follower_count: 2100000, engagement_rate: 5.3 },
    { id: 71, twitter_handle: 'Raoul GMI', display_name: 'RaoulPal', follower_count: 1100000, engagement_rate: 8.1 },
    { id: 72, twitter_handle: 'CryptoBanterGroup', display_name: 'Crypto Banter', follower_count: 310000, engagement_rate: 7.6 },
    { id: 73, twitter_handle: 'CryptoRUs_Trade', display_name: 'CryptoRUs Trade', follower_count: 87000, engagement_rate: 6.1 },
    { id: 74, twitter_handle: 'BitcoinArchive', display_name: 'Bitcoin Archive', follower_count: 590000, engagement_rate: 7.8 },
    { id: 75, twitter_handle: 'DocumentingBTC', display_name: 'Documenting Bitcoin', follower_count: 780000, engagement_rate: 8.5 },
    { id: 76, twitter_handle: 'CryptoTownHall', display_name: 'Crypto Town Hall', follower_count: 72000, engagement_rate: 6.4 },
    { id: 77, twitter_handle: 'CryptoGems_', display_name: 'Crypto Gems', follower_count: 94000, engagement_rate: 7.1 },
    { id: 78, twitter_handle: 'CryptoPotato_', display_name: 'CryptoPotato', follower_count: 160000, engagement_rate: 6.9 },
    { id: 79, twitter_handle: 'CryptoMichNL', display_name: 'Crypto Michaël', follower_count: 450000, engagement_rate: 8.3 },
    { id: 80, twitter_handle: 'CryptosCafe', display_name: 'Cryptos Cafe', follower_count: 81000, engagement_rate: 5.8 },

    // Tier 4: Up and coming (81-100)
    { id: 81, twitter_handle: 'CryptoSharks_', display_name: 'Crypto Sharks', follower_count: 58000, engagement_rate: 6.5 },
    { id: 82, twitter_handle: 'CryptoKnight2020', display_name: 'Crypto Knight', follower_count: 63000, engagement_rate: 7.2 },
    { id: 83, twitter_handle: 'CryptoVizArt', display_name: 'Crypto Viz Art', follower_count: 92000, engagement_rate: 8.4 },
    { id: 84, twitter_handle: 'AltcoinSara', display_name: 'Altcoin Sara', follower_count: 120000, engagement_rate: 6.8 },
    { id: 85, twitter_handle: 'CryptoSurvival', display_name: 'Crypto Survival', follower_count: 69000, engagement_rate: 5.9 },
    { id: 86, twitter_handle: 'CryptoWizard99', display_name: 'Crypto Wizard', follower_count: 74000, engagement_rate: 7.6 },
    { id: 87, twitter_handle: 'CryptoSpider_', display_name: 'Crypto Spider', follower_count: 56000, engagement_rate: 6.3 },
    { id: 88, twitter_handle: 'TheCryptoDude_', display_name: 'The Crypto Dude', follower_count: 68000, engagement_rate: 7.1 },
    { id: 89, twitter_handle: 'CryptoElon2021', display_name: 'Crypto Elon', follower_count: 95000, engagement_rate: 8.2 },
    { id: 90, twitter_handle: 'CryptoStache', display_name: 'Crypto Stache', follower_count: 48000, engagement_rate: 6.7 },
    { id: 91, twitter_handle: 'TheCryptoMonk', display_name: 'Crypto Monk', follower_count: 77000, engagement_rate: 7.4 },
    { id: 92, twitter_handle: 'CryptoGuru2022', display_name: 'Crypto Guru', follower_count: 84000, engagement_rate: 6.1 },
    { id: 93, twitter_handle: 'CryptoQuant', display_name: 'CryptoQuant', follower_count: 270000, engagement_rate: 8.9 },
    { id: 94, twitter_handle: 'CryptoHawk_', display_name: 'Crypto Hawk', follower_count: 51000, engagement_rate: 5.7 },
    { id: 95, twitter_handle: 'BlockchainBabe', display_name: 'Blockchain Babe', follower_count: 89000, engagement_rate: 7.8 },
    { id: 96, twitter_handle: 'CryptoEmpress', display_name: 'Crypto Empress', follower_count: 105000, engagement_rate: 6.9 },
    { id: 97, twitter_handle: 'TheCryptoLion', display_name: 'Crypto Lion', follower_count: 73000, engagement_rate: 7.5 },
    { id: 98, twitter_handle: 'CryptoGalaxy_', display_name: 'Crypto Galaxy', follower_count: 62000, engagement_rate: 6.4 },
    { id: 99, twitter_handle: 'CryptoVoyager_', display_name: 'Crypto Voyager', follower_count: 91000, engagement_rate: 8.1 },
    { id: 100, twitter_handle: 'TheCryptoGent', display_name: 'The Crypto Gent', follower_count: 67000, engagement_rate: 7.3 },
  ];

  // Insert influencers
  await knex('influencers').insert(
    influencers.map((inf) => ({
      id: inf.id,
      twitter_handle: inf.twitter_handle,
      display_name: inf.display_name,
      avatar_url: `https://unavatar.io/twitter/${inf.twitter_handle}`,
      bio: `Crypto influencer with ${inf.follower_count.toLocaleString()} followers`,
      follower_count: inf.follower_count,
      engagement_rate: inf.engagement_rate,
      daily_tweets: Math.floor(Math.random() * 20) + 5, // 5-25 tweets per day
      draft_score: 0, // Will be calculated by backend
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    }))
  );

  console.log('✅ Seeded 100 CT influencers');
}
