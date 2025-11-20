import type { Knex } from 'knex';

/**
 * Seed CT Whisperer Questions
 *
 * Format: "What would [Influencer] say about [Topic]?"
 *
 * Categories:
 * - tech: Technology, protocols, development
 * - market: Trading, price action, investments
 * - governance: Regulation, decentralization, politics
 * - culture: Community, memes, philosophy
 */

export async function seed(knex: Knex): Promise<void> {
  // Clear existing data
  await knex('whisperer_questions').del();

  // Sample questions (you'd generate more with AI or manual curation)
  await knex('whisperer_questions').insert([
    // VITALIK - Tech questions
    {
      influencer_id: 2, // Vitalik
      topic: 'Solana network outages',
      question: "What would Vitalik say about Solana's approach to scaling despite network downtime?",
      category: 'tech',
      difficulty: 'medium',
      option_a: 'Solana is fundamentally broken and will never work at scale',
      option_b: 'Network outages are learning experiences that benefit all blockchains exploring scalability',
      option_c: 'Only Ethereum can achieve true decentralization and uptime',
      option_d: 'Solana should immediately switch to a rollup-centric architecture',
      correct_answer: 'B',
      explanation: 'Vitalik typically takes a nuanced, charitable view of other chains. He acknowledges different approaches to the scalability trilemma and sees value in diverse experimentation.',
      reference_sources: JSON.stringify([
        'Multiple tweets showing Vitalik\'s measured takes on competing chains',
      ]),
      is_active: true,
    },

    {
      influencer_id: 2, // Vitalik
      topic: 'AI and blockchain intersection',
      question: "What's Vitalik's stance on integrating AI with blockchain systems?",
      category: 'tech',
      difficulty: 'hard',
      option_a: 'AI is a distraction from crypto\'s core mission of decentralization',
      option_b: 'AI + crypto is overhyped marketing with no real use cases',
      option_c: 'Decentralized AI is crucial for preventing AI monopolies and ensuring fair access',
      option_d: 'AI should be developed separately from blockchain technology',
      correct_answer: 'C',
      explanation: 'Vitalik has written extensively about crypto-AI synergies, particularly around decentralized AI compute and governance to prevent concentration of AI power.',
      reference_sources: JSON.stringify([
        'Vitalik\'s blog posts on crypto + AI',
      ]),
      is_active: true,
    },

    // CZ - Market questions
    {
      influencer_id: 1, // CZ
      topic: 'Bitcoin vs Altcoins',
      question: "What would CZ say about diversifying beyond Bitcoin?",
      category: 'market',
      difficulty: 'easy',
      option_a: 'Bitcoin is the only true cryptocurrency, everything else is a scam',
      option_b: 'A diverse portfolio of quality projects makes sense for most investors',
      option_c: 'Only invest in coins listed on Binance',
      option_d: 'Altcoins will all go to zero eventually',
      correct_answer: 'B',
      explanation: 'CZ has consistently supported ecosystem diversity and innovation across different blockchain projects, not just Bitcoin maximalism.',
      reference_sources: JSON.stringify([
        'CZ interviews and tweets about portfolio diversification',
      ]),
      is_active: true,
    },

    // BALAJI - Governance
    {
      influencer_id: 5, // Balaji
      topic: 'The Network State concept',
      question: "What would Balaji say about traditional nation-states in 50 years?",
      category: 'governance',
      difficulty: 'medium',
      option_a: 'They\'ll remain dominant as they are today',
      option_b: 'Cloud-based network states will compete with and potentially replace many traditional states',
      option_c: 'All governments will collapse due to cryptocurrency',
      option_d: 'Nation-states will ban crypto and maintain total control',
      correct_answer: 'B',
      explanation: 'This is literally the thesis of Balaji\'s book "The Network State" - he envisions cloud communities organizing into legitimate governing entities.',
      reference_sources: JSON.stringify([
        'The Network State book and related talks',
      ]),
      is_active: true,
    },

    // COBIE - Market/Culture
    {
      influencer_id: 4, // Cobie
      topic: 'NFT market crash',
      question: "What would Cobie say about the NFT bear market of 2022-2023?",
      category: 'culture',
      difficulty: 'easy',
      option_a: 'NFTs were always a scam and had no real value',
      option_b: 'The hype cycle was obvious; traders who got rekt ignored clear warning signs',
      option_c: 'JPEGs are still the future of digital ownership despite the crash',
      option_d: 'Everyone should hold their NFTs and never sell',
      correct_answer: 'B',
      explanation: 'Cobie is known for pragmatic, sometimes harsh takes on market cycles. He warned about NFT overvaluation and called out obvious red flags.',
      reference_sources: JSON.stringify([
        'Cobie\'s threads during NFT peak and crash',
      ]),
      is_active: true,
    },

    // ANTHONY POMPLIANO - Market
    {
      influencer_id: 3, // Pomp
      topic: 'Bitcoin as inflation hedge',
      question: "What would Pomp say about Bitcoin's role during high inflation periods?",
      category: 'market',
      difficulty: 'easy',
      option_a: 'Bitcoin is the ultimate inflation hedge and everyone should hold it',
      option_b: 'Gold is superior to Bitcoin for inflation protection',
      option_c: 'Stocks outperform Bitcoin during inflation',
      option_d: 'Bitcoin has no correlation with inflation',
      correct_answer: 'A',
      explanation: 'Pomp is a well-known Bitcoin bull who frequently advocates for BTC as "digital gold" and protection against monetary debasement.',
      reference_sources: JSON.stringify([
        'Numerous Pomp podcasts and tweets on Bitcoin as inflation hedge',
      ]),
      is_active: true,
    },

    // WILLY WOO - Tech/Market
    {
      influencer_id: 6, // Willy Woo
      topic: 'On-chain analytics for trading',
      question: "What would Willy Woo say about using on-chain metrics for price predictions?",
      category: 'market',
      difficulty: 'medium',
      option_a: 'On-chain data is useless noise that can\'t predict price',
      option_b: 'Technical analysis is superior to on-chain metrics',
      option_c: 'On-chain indicators provide valuable insights into market cycles and accumulation patterns',
      option_d: 'Only insider information matters for trading',
      correct_answer: 'C',
      explanation: 'Willy Woo pioneered on-chain analysis and created Woobull charts. He built his reputation on blockchain data analysis.',
      reference_sources: JSON.stringify([
        'Woobull.com and Willy Woo\'s research on NVT ratio, SOPR, etc.',
      ]),
      is_active: true,
    },

    // CRYPTO COBAIN - Culture
    {
      influencer_id: 7, // Crypto Cobain
      topic: 'New altcoin launches',
      question: "What would Crypto Cobain say about brand new altcoin launches promising 100x returns?",
      category: 'culture',
      difficulty: 'easy',
      option_a: 'Every new launch is an opportunity to get rich quick',
      option_b: 'Most are likely exit scams or will dump on retail; be extremely cautious',
      option_c: 'New launches are safer than established coins',
      option_d: 'VCs always know which launches will succeed',
      correct_answer: 'B',
      explanation: 'Crypto Cobain is known for skeptical, often cynical takes on new projects and warning followers about common scams.',
      reference_sources: JSON.stringify([
        'CC\'s tweets warning about various launches and scams',
      ]),
      is_active: true,
    },

    // ANDREAS ANTONOPOULOS - Tech/Philosophy
    {
      influencer_id: 8, // Andreas
      topic: 'Bitcoin vs banks',
      question: "What would Andreas say about using banks vs self-custody for Bitcoin?",
      category: 'tech',
      difficulty: 'easy',
      option_a: 'Banks are fine for holding Bitcoin if they\'re regulated',
      option_b: 'Not your keys, not your coins - self-custody is essential',
      option_c: 'Exchanges are safer than hardware wallets',
      option_d: 'Custody doesn\'t matter as long as the price goes up',
      correct_answer: 'B',
      explanation: 'Andreas is one of the strongest advocates for self-custody and has written extensively about the importance of controlling your own keys.',
      reference_sources: JSON.stringify([
        'Mastering Bitcoin book and countless talks on self-sovereignty',
      ]),
      is_active: true,
    },

    // PETER BRANDT - Market
    {
      influencer_id: 9, // Peter Brandt
      topic: 'Technical analysis validity',
      question: "What would Peter Brandt say about the effectiveness of classical charting patterns?",
      category: 'market',
      difficulty: 'medium',
      option_a: 'Chart patterns are astrology for traders and don\'t work',
      option_b: 'Classical patterns like head & shoulders and flags work across all markets when properly identified',
      option_c: 'Only fundamental analysis matters for trading',
      option_d: 'Technical analysis only works in stocks, not crypto',
      correct_answer: 'B',
      explanation: 'Peter Brandt is a legendary trader with 45+ years experience using classical charting. He\'s proven its effectiveness across commodities, forex, and now crypto.',
      reference_sources: JSON.stringify([
        'Peter Brandt\'s trading history and chart analysis tweets',
      ]),
      is_active: true,
    },
  ]);

  console.log('✅ Seeded 10 CT Whisperer questions');
}
