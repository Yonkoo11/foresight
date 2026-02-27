import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';

/**
 * Seed demo CT tweets for hackathon demo.
 * These are realistic-looking tweets from real CT influencers.
 * Used when TWITTER_API_IO_KEY is not configured.
 */
export async function up(knex: Knex): Promise<void> {
  // Only seed if no tweets exist
  const existing = await knex('ct_tweets').count('* as cnt').first();
  if (existing && Number(existing.cnt) > 0) {
    console.log(`✅ CT tweets already exist (${existing.cnt}), skipping seed`);
    return;
  }

  // Get influencer IDs by handle
  const influencers = await knex('influencers')
    .select('id', 'twitter_handle', 'tier')
    .whereIn('twitter_handle', [
      'CryptoCapo_', 'CoinDesk', 'CoinGecko', 'BitBoy_Crypto',
      'HsakaTrades', 'Pentosh1', 'BanklessHQ', 'theblock__',
      'WuBlockchain', 'CryptoBanter', 'EllioTrades', 'TheCryptoDog',
      'ZssBecker', 'MoonOverlord', 'CryptoGodJohn', 'SmartContracter',
    ]);

  const infMap = new Map(influencers.map((i: { id: number; twitter_handle: string }) => [i.twitter_handle, i.id]));

  const now = new Date();
  const tweets = [
    // S-Tier tweets
    {
      tweet_id: '1762000000000000001',
      influencer_id: infMap.get('CoinDesk'),
      text: 'BREAKING: Bitcoin ETF inflows hit $1.2B in a single day, setting a new record. Institutional adoption is accelerating faster than anyone predicted. 🔥 #Bitcoin #ETF',
      likes: 8420, retweets: 2150, replies: 634, quotes: 890, views: 1200000,
      engagement_score: 95.2, viral_score: 88.5,
      created_at: new Date(now.getTime() - 2 * 3600000),
    },
    {
      tweet_id: '1762000000000000002',
      influencer_id: infMap.get('CoinGecko'),
      text: 'Crypto Market Update 🦎\n\n• BTC: $67,240 (+3.2%)\n• ETH: $3,890 (+4.1%)\n• SOL: $188 (+6.8%)\n\nTotal market cap: $2.41T\nFear & Greed Index: 76 (Greed)',
      likes: 6200, retweets: 3100, replies: 420, quotes: 780, views: 980000,
      engagement_score: 91.8, viral_score: 85.2,
      created_at: new Date(now.getTime() - 1 * 3600000),
    },
    {
      tweet_id: '1762000000000000003',
      influencer_id: infMap.get('CryptoCapo_'),
      text: 'The macro is flipping. Rate cuts incoming, dollar weakening, Bitcoin holding support. This is the setup everyone was waiting for.\n\nTarget: 6-figures. No cap.',
      likes: 12500, retweets: 4200, replies: 980, quotes: 1200, views: 2100000,
      engagement_score: 98.1, viral_score: 94.7,
      created_at: new Date(now.getTime() - 3 * 3600000),
      is_prediction: true,
    },
    {
      tweet_id: '1762000000000000004',
      influencer_id: infMap.get('BitBoy_Crypto'),
      text: 'I\'ve been saying for months: altcoin season is coming. The dominance charts don\'t lie. Once BTC chills, capital will rotate.\n\nDCA your bags. Don\'t miss it.',
      likes: 9800, retweets: 3600, replies: 1240, quotes: 820, views: 1500000,
      engagement_score: 96.3, viral_score: 91.2,
      created_at: new Date(now.getTime() - 5 * 3600000),
    },
    // A-Tier tweets
    {
      tweet_id: '1762000000000000005',
      influencer_id: infMap.get('HsakaTrades'),
      text: 'Spotted the cleanest breakout setup on ETH/BTC pair I\'ve seen all year. When this ratio moves, it tends to run hard.\n\nWatching closely.',
      likes: 4200, retweets: 1100, replies: 380, quotes: 290, views: 680000,
      engagement_score: 84.6, viral_score: 76.3,
      created_at: new Date(now.getTime() - 4 * 3600000),
      is_prediction: true,
    },
    {
      tweet_id: '1762000000000000006',
      influencer_id: infMap.get('Pentosh1'),
      text: 'Reminder: the best trades are the boring ones. Buy the dip, size correctly, hold with conviction.\n\nEveryone wants alpha. Nobody wants to be patient.',
      likes: 7800, retweets: 2900, replies: 620, quotes: 540, views: 920000,
      engagement_score: 89.4, viral_score: 82.1,
      created_at: new Date(now.getTime() - 6 * 3600000),
    },
    {
      tweet_id: '1762000000000000007',
      influencer_id: infMap.get('BanklessHQ'),
      text: 'Ethereum just processed $4.2B in stablecoin transfers. In one day. For pennies.\n\nThis is what programmable money looks like. The banks don\'t want you to know this.',
      likes: 5600, retweets: 2400, replies: 710, quotes: 640, views: 810000,
      engagement_score: 87.2, viral_score: 79.8,
      created_at: new Date(now.getTime() - 7 * 3600000),
    },
    {
      tweet_id: '1762000000000000008',
      influencer_id: infMap.get('theblock__'),
      text: 'JUST IN: Blackrock\'s IBIT Bitcoin ETF now holds more Bitcoin than MicroStrategy. First time a traditional fund has overtaken the OG corporate holder.',
      likes: 9200, retweets: 4100, replies: 890, quotes: 1050, views: 1800000,
      engagement_score: 94.7, viral_score: 90.3,
      created_at: new Date(now.getTime() - 8 * 3600000),
    },
    {
      tweet_id: '1762000000000000009',
      influencer_id: infMap.get('WuBlockchain'),
      text: 'Breaking: Binance reports $45B in trading volume over the past 24 hours. Volume up 82% week-over-week as crypto markets heat up heading into the weekend.',
      likes: 3400, retweets: 1800, replies: 280, quotes: 410, views: 590000,
      engagement_score: 82.1, viral_score: 74.6,
      created_at: new Date(now.getTime() - 9 * 3600000),
    },
    {
      tweet_id: '1762000000000000010',
      influencer_id: infMap.get('CryptoBanter'),
      text: 'The narrative is shifting from "Bitcoin is digital gold" to "Bitcoin is the global reserve asset".\n\nThis is a bigger deal than people realize. Entire portfolios will be rebalanced.',
      likes: 6100, retweets: 2200, replies: 540, quotes: 470, views: 750000,
      engagement_score: 86.8, viral_score: 78.4,
      created_at: new Date(now.getTime() - 10 * 3600000),
    },
    {
      tweet_id: '1762000000000000011',
      influencer_id: infMap.get('EllioTrades'),
      text: 'My top 5 altcoins for this cycle:\n\n1. $SOL - execution machine\n2. $AVAX - enterprise ready\n3. $INJ - DeFi powerhouse\n4. $SUI - next-gen infra\n5. $LINK - still undervalued\n\nDYOR. Not financial advice.',
      likes: 11200, retweets: 5300, replies: 1560, quotes: 1890, views: 2400000,
      engagement_score: 97.4, viral_score: 93.8,
      created_at: new Date(now.getTime() - 11 * 3600000),
    },
    {
      tweet_id: '1762000000000000012',
      influencer_id: infMap.get('TheCryptoDog'),
      text: 'Woke up and checked charts. Still bullish. Went back to sleep.\n\nThis is the way.',
      likes: 8900, retweets: 2100, replies: 430, quotes: 380, views: 1100000,
      engagement_score: 88.9, viral_score: 81.5,
      created_at: new Date(now.getTime() - 12 * 3600000),
    },
    {
      tweet_id: '1762000000000000013',
      influencer_id: infMap.get('ZssBecker'),
      text: 'Pattern recognition: Every time we get this combination of rising volume + declining funding rates + BTC holding above 200d MA...\n\nSomething big happens in the next 2 weeks.',
      likes: 4800, retweets: 1600, replies: 440, quotes: 320, views: 720000,
      engagement_score: 85.3, viral_score: 77.2,
      created_at: new Date(now.getTime() - 13 * 3600000),
      is_prediction: true,
    },
    {
      tweet_id: '1762000000000000014',
      influencer_id: infMap.get('MoonOverlord'),
      text: 'The people who called Bitcoin a bubble at $1K are the same ones calling it a bubble at $67K.\n\nThey will be calling it a bubble at $500K too.\n\nThis is a feature, not a bug.',
      likes: 13400, retweets: 5900, replies: 1820, quotes: 2100, views: 3200000,
      engagement_score: 99.2, viral_score: 96.5,
      created_at: new Date(now.getTime() - 14 * 3600000),
    },
    {
      tweet_id: '1762000000000000015',
      influencer_id: infMap.get('CryptoGodJohn'),
      text: 'Just added to my SOL position. The fundamentals are undeniable:\n• Fastest L1 by throughput\n• Cheapest fees\n• Growing developer ecosystem\n• Firedancer coming Q2\n\nConviction high.',
      likes: 5400, retweets: 1900, replies: 510, quotes: 420, views: 680000,
      engagement_score: 85.9, viral_score: 78.1,
      created_at: new Date(now.getTime() - 15 * 3600000),
    },
    {
      tweet_id: '1762000000000000016',
      influencer_id: infMap.get('SmartContracter'),
      text: 'On-chain data doesn\'t lie:\n\n→ Long-term holder supply at ATH\n→ Exchange reserves at 5-year low\n→ Miner balances growing\n→ Realized HODL ratio expanding\n\nMacro squeeze forming.',
      likes: 7200, retweets: 3100, replies: 680, quotes: 590, views: 940000,
      engagement_score: 90.1, viral_score: 83.7,
      created_at: new Date(now.getTime() - 16 * 3600000),
      is_prediction: true,
    },
    {
      tweet_id: '1762000000000000017',
      influencer_id: infMap.get('CoinDesk'),
      text: 'ANALYSIS: Why the SEC\'s latest Bitcoin ETF approval signals a permanent shift in institutional crypto policy. Full thread 🧵',
      likes: 4100, retweets: 1700, replies: 340, quotes: 510, views: 620000,
      engagement_score: 83.4, viral_score: 75.9,
      created_at: new Date(now.getTime() - 18 * 3600000),
    },
    {
      tweet_id: '1762000000000000018',
      influencer_id: infMap.get('BanklessHQ'),
      text: 'New episode 🎙️ "The Supercycle Thesis: Why This Bull Run Is Different"\n\nWith @RaoulGMI and @APompliano. Two of the sharpest macro minds in crypto.\n\nLink in bio.',
      likes: 3200, retweets: 890, replies: 210, quotes: 280, views: 420000,
      engagement_score: 79.6, viral_score: 71.3,
      created_at: new Date(now.getTime() - 20 * 3600000),
    },
    {
      tweet_id: '1762000000000000019',
      influencer_id: infMap.get('HsakaTrades'),
      text: 'Position update: reduced BTC exposure by 20%, rotating into ETH and SOL. Not bearish on BTC, just think the beta plays will outperform here.\n\nSizing matters more than entries.',
      likes: 5800, retweets: 1500, replies: 620, quotes: 380, views: 760000,
      engagement_score: 87.1, viral_score: 79.6,
      created_at: new Date(now.getTime() - 22 * 3600000),
    },
    {
      tweet_id: '1762000000000000020',
      influencer_id: infMap.get('CryptoCapo_'),
      text: 'Everyone asking about the top. I\'m asking: how long until the next 10x?\n\nBull markets don\'t end with everyone asking "is this the top?"\n\nThey end in euphoria. We\'re not there yet.',
      likes: 16800, retweets: 7200, replies: 2100, quotes: 2800, views: 4500000,
      engagement_score: 99.8, viral_score: 98.2,
      created_at: new Date(now.getTime() - 24 * 3600000),
    },
  ];

  // Filter out tweets where influencer not found
  const validTweets = tweets.filter(t => t.influencer_id !== undefined);

  const toInsert = validTweets.map(t => ({
    id: uuidv4(),
    tweet_id: t.tweet_id,
    influencer_id: t.influencer_id,
    text: t.text,
    created_at: t.created_at,
    likes: t.likes,
    retweets: t.retweets,
    replies: t.replies,
    quotes: t.quotes,
    views: t.views,
    bookmarks: Math.floor(t.likes * 0.05),
    engagement_score: t.engagement_score,
    viral_score: t.viral_score,
    is_reply: false,
    is_retweet: false,
    has_media: false,
    is_prediction: t.is_prediction || false,
    prediction_outcome: null,
    fetched_at: new Date(),
    updated_at: new Date(),
  }));

  if (toInsert.length > 0) {
    await knex('ct_tweets').insert(toInsert);
  }

  console.log(`✅ Seeded ${toInsert.length} demo CT tweets`);
}

export async function down(knex: Knex): Promise<void> {
  await knex('ct_tweets').whereIn('tweet_id', [
    '1762000000000000001', '1762000000000000002', '1762000000000000003',
    '1762000000000000004', '1762000000000000005', '1762000000000000006',
    '1762000000000000007', '1762000000000000008', '1762000000000000009',
    '1762000000000000010', '1762000000000000011', '1762000000000000012',
    '1762000000000000013', '1762000000000000014', '1762000000000000015',
    '1762000000000000016', '1762000000000000017', '1762000000000000018',
    '1762000000000000019', '1762000000000000020',
  ]).del();
}
