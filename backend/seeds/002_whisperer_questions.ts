import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Clear existing data
  await knex('whisperer_questions').del();

  // Sample CT Whisperer questions (tweet → guess the author)
  const questions = [
    // EASY - Very distinctive voices
    {
      tweet_id: 'q1',
      author_handle: 'VitalikButerin',
      tweet_text: 'The merge is an important milestone that will reduce Ethereum\'s energy consumption by ~99.95%',
      options: ['VitalikButerin', 'cz_binance', 'brian_armstrong', 'saylor'],
      correct_option: 0,
      difficulty: 'EASY',
    },
    {
      tweet_id: 'q2',
      author_handle: 'elonmusk',
      tweet_text: 'Doge to the moon 🚀',
      options: ['elonmusk', 'CryptoCobain', 'APompliano', 'saylor'],
      correct_option: 0,
      difficulty: 'EASY',
    },
    {
      tweet_id: 'q3',
      author_handle: 'saylor',
      tweet_text: 'Bitcoin is the first engineered monetary network in history. It is the apex property of the human race.',
      options: ['PlanB_BTC', 'saylor', 'APompliano', 'WhalePanda'],
      correct_option: 1,
      difficulty: 'EASY',
    },
    {
      tweet_id: 'q4',
      author_handle: 'APompliano',
      tweet_text: 'Inflation is going to be higher than they are telling you. Buy Bitcoin.',
      options: ['saylor', 'APompliano', 'scottmelker', 'PlanB_BTC'],
      correct_option: 1,
      difficulty: 'EASY',
    },
    {
      tweet_id: 'q5',
      author_handle: 'cz_binance',
      tweet_text: 'Stay SAFU',
      options: ['cz_binance', 'brian_armstrong', 'SBF_FTX', 'JohnJKarony'],
      correct_option: 0,
      difficulty: 'EASY',
    },

    // MEDIUM - Recognizable but requires CT knowledge
    {
      tweet_id: 'q6',
      author_handle: 'CryptoCobain',
      tweet_text: 'GM to people with at least 0.01 BTC',
      options: ['WhalePanda', 'CryptoCobain', 'DegenSpartan', 'inversebrah'],
      correct_option: 1,
      difficulty: 'MEDIUM',
    },
    {
      tweet_id: 'q7',
      author_handle: 'PlanB_BTC',
      tweet_text: 'Stock-to-Flow model predicts new ATH by end of year',
      options: ['PlanB_BTC', 'intocryptoverse', 'RektCapital', 'TechDev_52'],
      correct_option: 0,
      difficulty: 'MEDIUM',
    },
    {
      tweet_id: 'q8',
      author_handle: 'sassal0x',
      tweet_text: 'Another day, another DeFi exploit. When will we learn?',
      options: ['sassal0x', 'hasufl', 'DeFi_Dad', 'DegenSpartan'],
      correct_option: 0,
      difficulty: 'MEDIUM',
    },
    {
      tweet_id: 'q9',
      author_handle: 'DeFi_Dad',
      tweet_text: 'Gas fees are insane right now. This is why we need L2s.',
      options: ['DeFi_Dad', 'hasufl', 'sassal0x', 'trustlessstate'],
      correct_option: 0,
      difficulty: 'MEDIUM',
    },
    {
      tweet_id: 'q10',
      author_handle: 'CryptoKaleo',
      tweet_text: '$100k BTC is inevitable. The only question is when.',
      options: ['CryptoKaleo', 'RektCapital', 'PlanB_BTC', 'CryptoCapo_'],
      correct_option: 0,
      difficulty: 'MEDIUM',
    },
    {
      tweet_id: 'q11',
      author_handle: 'DegenSpartan',
      tweet_text: 'If you\'re not leveraged 10x right now, ngmi',
      options: ['CryptoCobain', 'DegenSpartan', 'inversebrah', 'Pentosh1'],
      correct_option: 1,
      difficulty: 'MEDIUM',
    },
    {
      tweet_id: 'q12',
      author_handle: 'Pentosh1',
      tweet_text: 'The macro setup is looking absolutely bullish for risk assets',
      options: ['Pentosh1', 'Raoul GMI', 'intocryptoverse', 'CryptoKaleo'],
      correct_option: 0,
      difficulty: 'MEDIUM',
    },
    {
      tweet_id: 'q13',
      author_handle: 'WhalePanda',
      tweet_text: 'Zoom out. We\'re still early.',
      options: ['WhalePanda', 'CryptoCobain', 'PlanB_BTC', 'APompliano'],
      correct_option: 0,
      difficulty: 'MEDIUM',
    },
    {
      tweet_id: 'q14',
      author_handle: 'RektCapital',
      tweet_text: 'Bitcoin just broke above the 200-week moving average. Very bullish signal.',
      options: ['RektCapital', 'TechDev_52', 'PlanB_BTC', 'CryptoCapo_'],
      correct_option: 0,
      difficulty: 'MEDIUM',
    },
    {
      tweet_id: 'q15',
      author_handle: 'CryptoZachXBT',
      tweet_text: 'Just exposed another scam project. Do your own research people!',
      options: ['CryptoZachXBT', 'cmsholdings', 'CryptoCobain', 'twobitidiot'],
      correct_option: 0,
      difficulty: 'MEDIUM',
    },

    // HARD - Requires deep CT knowledge
    {
      tweet_id: 'q16',
      author_handle: 'hasufl',
      tweet_text: 'The key innovation of Bitcoin isn\'t the blockchain, it\'s the incentive structure',
      options: ['hasufl', 'sassal0x', 'trustlessstate', 'twobitidiot'],
      correct_option: 0,
      difficulty: 'HARD',
    },
    {
      tweet_id: 'q17',
      author_handle: 'inversebrah',
      tweet_text: 'Everyone\'s a genius in a bull market. The real test is surviving the bear.',
      options: ['DegenSpartan', 'CryptoCobain', 'inversebrah', 'Pentosh1'],
      correct_option: 2,
      difficulty: 'HARD',
    },
    {
      tweet_id: 'q18',
      author_handle: 'cmsholdings',
      tweet_text: 'Position sizing is more important than entry price',
      options: ['cmsholdings', 'Galois_Capital', 'Pentosh1', 'RunnerXBT'],
      correct_option: 0,
      difficulty: 'HARD',
    },
    {
      tweet_id: 'q19',
      author_handle: 'TechDev_52',
      tweet_text: 'According to my fractal analysis, we should see a move soon',
      options: ['TechDev_52', 'RektCapital', 'CryptoKaleo', 'CryptoCapo_'],
      correct_option: 0,
      difficulty: 'HARD',
    },
    {
      tweet_id: 'q20',
      author_handle: 'trustlessstate',
      tweet_text: 'Decentralization isn\'t a binary state, it\'s a spectrum',
      options: ['trustlessstate', 'hasufl', 'sassal0x', 'DeFi_Dad'],
      correct_option: 0,
      difficulty: 'HARD',
    },
    {
      tweet_id: 'q21',
      author_handle: 'CryptoCapo_',
      tweet_text: 'Top is in. I\'m shorting this level.',
      options: ['CryptoCapo_', 'CryptoKaleo', 'TechDev_52', 'inversebrah'],
      correct_option: 0,
      difficulty: 'HARD',
    },
    {
      tweet_id: 'q22',
      author_handle: 'RunnerXBT',
      tweet_text: 'The setup is too clean. Expecting a quick wick before continuation.',
      options: ['RunnerXBT', 'SmartContracter', 'CryptoCred', 'TraderSZ'],
      correct_option: 0,
      difficulty: 'HARD',
    },
    {
      tweet_id: 'q23',
      author_handle: 'SmartContracter',
      tweet_text: 'We\'re at a critical support level. This is where bulls need to show up.',
      options: ['SmartContracter', 'RektCapital', 'RunnerXBT', 'CryptoKaleo'],
      correct_option: 0,
      difficulty: 'HARD',
    },
    {
      tweet_id: 'q24',
      author_handle: 'CryptoCred',
      tweet_text: 'Risk management > Being right about direction',
      options: ['CryptoCred', 'cmsholdings', 'RunnerXBT', 'SmartContracter'],
      correct_option: 0,
      difficulty: 'HARD',
    },
    {
      tweet_id: 'q25',
      author_handle: 'altcoinpsycho',
      tweet_text: 'Altseason is coming. Time to rotate into alts.',
      options: ['altcoinpsycho', 'AltcoinGordon', 'CryptoBirb', 'CryptoKaleo'],
      correct_option: 0,
      difficulty: 'HARD',
    },
  ];

  // Insert questions
  await knex('whisperer_questions').insert(
    questions.map((q) => ({
      tweet_id: q.tweet_id,
      author_handle: q.author_handle,
      tweet_text: q.tweet_text,
      options: q.options,
      correct_option: q.correct_option,
      difficulty: q.difficulty,
      times_shown: 0,
      times_correct: 0,
      success_rate: 0,
      active: true,
      created_at: knex.fn.now(),
    }))
  );

  console.log('✅ Seeded 25 CT Whisperer questions');
}
