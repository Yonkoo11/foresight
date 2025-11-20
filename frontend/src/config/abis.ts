/**
 * Contract ABIs for CT league
 * Simplified ABIs containing only the functions needed by the frontend
 */

// ============================================
// REPUTATION ENGINE
// ============================================

export const REPUTATION_ENGINE_ABI = [
  {
    type: 'function',
    name: 'getReputation',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      {
        type: 'tuple',
        components: [
          { name: 'draftRank', type: 'uint256' },
          { name: 'ctIQ', type: 'uint256' },
          { name: 'arenaWins', type: 'uint256' },
          { name: 'arenaLosses', type: 'uint256' },
          { name: 'gauntletDays', type: 'uint256' },
          { name: 'totalCorrect', type: 'uint256' },
          { name: 'ctMasteryScore', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getDraftScore',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getWhispererScore',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getTimecasterScore',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
] as const;

// ============================================
// FORESIGHT NFT
// ============================================

export const FORESIGHT_NFT_ABI = [
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'tokenURI',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'ownerToTokenId',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
] as const;

// ============================================
// TREASURY
// ============================================

export const TREASURY_ABI = [
  {
    type: 'function',
    name: 'getCurrentMonth',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getMonthlyRevenue',
    inputs: [{ name: 'month', type: 'uint256' }],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
] as const;

// ============================================
// CT DRAFT
// ============================================

export const CT_DRAFT_ABI = [
  {
    type: 'function',
    name: 'setTeam',
    inputs: [
      {
        name: 'influencerIds',
        type: 'uint256[5]',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getTeam',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      {
        type: 'tuple',
        components: [
          { name: 'user', type: 'address' },
          { name: 'influencerIds', type: 'uint256[5]' },
          { name: 'lastUpdated', type: 'uint256' },
          { name: 'exists', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'TeamUpdated',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'influencerIds', type: 'uint256[5]' },
    ],
  },
] as const;

// ============================================
// TIMECASTER ARENA
// ============================================

export const TIMECASTER_ARENA_ABI = [
  {
    type: 'function',
    name: 'createPriceDuel',
    inputs: [
      { name: 'question', type: 'string' },
      { name: 'position', type: 'string' },
      { name: 'oracleKey', type: 'bytes32' },
      { name: 'targetPrice', type: 'uint256' },
      { name: 'resolutionTime', type: 'uint256' },
    ],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'createProtocolDuel',
    inputs: [
      { name: 'question', type: 'string' },
      { name: 'position', type: 'string' },
      { name: 'protocol', type: 'string' },
      { name: 'metric', type: 'string' },
      { name: 'targetValue', type: 'uint256' },
      { name: 'resolutionTime', type: 'uint256' },
    ],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'createNarrativeDuel',
    inputs: [
      { name: 'question', type: 'string' },
      { name: 'position', type: 'string' },
      { name: 'resolutionTime', type: 'uint256' },
    ],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'acceptDuel',
    inputs: [{ name: 'duelId', type: 'uint256' }],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'vote',
    inputs: [
      { name: 'duelId', type: 'uint256' },
      { name: 'voteForCreator', type: 'bool' },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'getDuel',
    inputs: [{ name: 'duelId', type: 'uint256' }],
    outputs: [
      {
        type: 'tuple',
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'duelType', type: 'uint8' },
          { name: 'creator', type: 'address' },
          { name: 'opponent', type: 'address' },
          { name: 'question', type: 'string' },
          { name: 'creatorPosition', type: 'string' },
          { name: 'stake', type: 'uint256' },
          { name: 'resolutionTime', type: 'uint256' },
          { name: 'status', type: 'uint8' },
          { name: 'resolved', type: 'bool' },
          { name: 'winner', type: 'address' },
          { name: 'creatorVotes', type: 'uint256' },
          { name: 'opponentVotes', type: 'uint256' },
          { name: 'totalVoteStake', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getUserStats',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      { name: 'totalDuels', type: 'uint256' },
      { name: 'wins', type: 'uint256' },
      { name: 'losses', type: 'uint256' },
      { name: 'activeDuels', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'DuelCreated',
    inputs: [
      { name: 'duelId', type: 'uint256', indexed: true },
      { name: 'creator', type: 'address', indexed: true },
      { name: 'duelType', type: 'uint8' },
      { name: 'question', type: 'string' },
      { name: 'stake', type: 'uint256' },
    ],
  },
  {
    type: 'event',
    name: 'DuelAccepted',
    inputs: [
      { name: 'duelId', type: 'uint256', indexed: true },
      { name: 'opponent', type: 'address', indexed: true },
    ],
  },
  {
    type: 'event',
    name: 'VoteCast',
    inputs: [
      { name: 'duelId', type: 'uint256', indexed: true },
      { name: 'voter', type: 'address', indexed: true },
      { name: 'voteForCreator', type: 'bool' },
      { name: 'stake', type: 'uint256' },
    ],
  },
  {
    type: 'event',
    name: 'DuelResolved',
    inputs: [
      { name: 'duelId', type: 'uint256', indexed: true },
      { name: 'winner', type: 'address', indexed: true },
    ],
  },
] as const;

// ============================================
// DAILY GAUNTLET
// ============================================

export const DAILY_GAUNTLET_ABI = [
  {
    type: 'function',
    name: 'submitEntry',
    inputs: [
      {
        name: 'userPredictions',
        type: 'bool[5]',
      },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'getCurrentDay',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getGauntletDay',
    inputs: [{ name: 'day', type: 'uint256' }],
    outputs: [
      {
        type: 'tuple',
        components: [
          { name: 'day', type: 'uint256' },
          { name: 'startTime', type: 'uint256' },
          { name: 'endTime', type: 'uint256' },
          { name: 'totalPool', type: 'uint256' },
          { name: 'totalEntries', type: 'uint256' },
          { name: 'active', type: 'bool' },
          { name: 'resolved', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getUserEntry',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'day', type: 'uint256' },
    ],
    outputs: [
      {
        type: 'tuple',
        components: [
          { name: 'user', type: 'address' },
          { name: 'day', type: 'uint256' },
          { name: 'predictions', type: 'bool[5]' },
          { name: 'correctCount', type: 'uint8' },
          { name: 'payout', type: 'uint256' },
          { name: 'claimed', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getUserStats',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      { name: 'totalDays', type: 'uint256' },
      { name: 'perfectDays', type: 'uint256' },
      { name: 'totalCorrect', type: 'uint256' },
      { name: 'totalPredictions', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'EntrySubmitted',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'day', type: 'uint256', indexed: true },
      { name: 'predictions', type: 'bool[5]' },
    ],
  },
  {
    type: 'event',
    name: 'GauntletResolved',
    inputs: [
      { name: 'day', type: 'uint256', indexed: true },
      { name: 'totalPool', type: 'uint256' },
    ],
  },
] as const;
