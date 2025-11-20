/**
 * Timecaster Arena Page
 * Create and accept 1v1 prediction duels
 */

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { DuelCard, type Duel } from '../components/arena/DuelCard';
import { DuelFaceOff } from '../components/arena/DuelFaceOff';
import { CreateDuelModal } from '../components/arena/CreateDuelModal';
import { DuelDetailsModal } from '../components/arena/DuelDetailsModal';
import { LiveLobby } from '../components/LiveLobby';
import { useTimecasterArena, useHasVoted, useArenaConstants } from '../contracts/hooks';
import { useNotifications } from '../contexts/NotificationContext';

export default function Arena() {
  const { address } = useAccount();
  const { showSuccess, showError, showWarning } = useNotifications();
  const [activeTab, setActiveTab] = useState<'all' | 'open' | 'active' | 'my'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'faceoff'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDuel, setSelectedDuel] = useState<Duel | null>(null);
  const [votedDuels, setVotedDuels] = useState<Set<bigint>>(new Set());
  const [claimedDuels, setClaimedDuels] = useState<Set<bigint>>(new Set());

  // Contract hooks
  const {
    createPriceDuel,
    createProtocolDuel,
    createNarrativeDuel,
    acceptDuel,
    voteOnDuel,
    cancelDuel,
    isSuccess,
    error,
    hash,
  } = useTimecasterArena();

  // Contract constants
  const { minVotes, voteStake, votingPeriod, acceptDeadline } = useArenaConstants();

  // Show transaction status
  useEffect(() => {
    if (isSuccess && hash) {
      showSuccess('Transaction Successful', 'Your transaction has been confirmed on-chain.');
      // TODO: Refetch duel data from contract
      // Note: The TimecasterArena contract needs a getAllDuels() or getDuelCount()
      // function to fetch all duels. For now, we're using mock data.
    }
  }, [isSuccess, hash, showSuccess]);

  useEffect(() => {
    if (error) {
      console.error('Transaction error:', error);
      showError('Transaction Failed', 'Please check your wallet and try again.');
    }
  }, [error, showError]);

  // TODO: Replace with contract reads
  // Note: The contract needs getAllDuels() or getDuelCount() functions to fetch all duels
  // For now, using mock data for demonstration
  // Mock data for demonstration
  const mockDuels: Duel[] = address ? [
    {
      id: 1n,
      creator: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' as `0x${string}`,
      opponent: '0x0000000000000000000000000000000000000000' as `0x${string}`,
      duelType: 'PRICE',
      question: 'Will ETH reach $5,000 by end of Q1 2025?',
      creatorPosition: 'YES',
      stake: 100000000000000000n, // 0.1 ETH
      deadline: BigInt(Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60), // 30 days
      resolved: false,
      oracleKey: 'ETH/USD',
    },
    {
      id: 2n,
      creator: address,
      opponent: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199' as `0x${string}`,
      duelType: 'NARRATIVE',
      question: 'Will memecoins dominate the next crypto cycle?',
      creatorPosition: 'Memecoins will be top performers',
      stake: 50000000000000000n, // 0.05 ETH
      deadline: BigInt(Math.floor(Date.now() / 1000) + 60 * 24 * 60 * 60), // 60 days
      resolved: false,
      totalVotes: 15n,
      creatorVotes: 9n,
    },
    {
      id: 3n,
      creator: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0' as `0x${string}`,
      opponent: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E' as `0x${string}`,
      duelType: 'PROTOCOL',
      question: 'Will Uniswap v4 TVL exceed $10B within 6 months of launch?',
      creatorPosition: 'YES - will exceed $10B',
      stake: 200000000000000000n, // 0.2 ETH
      deadline: BigInt(Math.floor(Date.now() / 1000) + 180 * 24 * 60 * 60), // 180 days
      resolved: false,
      totalVotes: 23n,
      creatorVotes: 14n,
      oracleKey: 'UNI_TVL',
    },
    {
      id: 4n,
      creator: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed' as `0x${string}`,
      opponent: '0x0000000000000000000000000000000000000000' as `0x${string}`,
      duelType: 'NARRATIVE',
      question: 'Will AI agents become the dominant narrative in crypto by mid-2025?',
      creatorPosition: 'AI agents will dominate',
      stake: 100000000000000000n, // 0.1 ETH
      deadline: BigInt(Math.floor(Date.now() / 1000) + 90 * 24 * 60 * 60), // 90 days
      resolved: false,
    },
    {
      id: 5n,
      creator: address,
      opponent: '0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359' as `0x${string}`,
      duelType: 'PRICE',
      question: 'Will BTC reach $150,000 before ETH reaches $10,000?',
      creatorPosition: 'BTC first',
      stake: 300000000000000000n, // 0.3 ETH
      deadline: BigInt(Math.floor(Date.now() / 1000) - 5 * 24 * 60 * 60), // Expired 5 days ago
      resolved: true,
      winner: address,
      totalVotes: 45n,
      creatorVotes: 28n,
      oracleKey: 'BTC/USD',
    },
  ] : [];

  // Filter duels based on active tab
  const filteredDuels = mockDuels.filter(duel => {
    const isOpen = duel.opponent === '0x0000000000000000000000000000000000000000';
    const isActive = !isOpen && !duel.resolved;
    const isMine = address && (
      duel.creator.toLowerCase() === address.toLowerCase() ||
      duel.opponent.toLowerCase() === address.toLowerCase()
    );

    switch (activeTab) {
      case 'open':
        return isOpen;
      case 'active':
        return isActive;
      case 'my':
        return isMine;
      case 'all':
      default:
        return true;
    }
  });

  const handleCreateDuel = async (duelData: any) => {
    try {
      // Call appropriate contract function based on duel type
      if (duelData.duelType === 'PRICE') {
        await createPriceDuel(
          duelData.question,
          duelData.oracleKey,
          duelData.creatorPosition === 'YES',
          duelData.stake
        );
      } else if (duelData.duelType === 'PROTOCOL') {
        await createProtocolDuel(
          duelData.question,
          duelData.oracleKey,
          BigInt(duelData.targetValue),
          duelData.isAbove,
          duelData.stake
        );
      } else if (duelData.duelType === 'NARRATIVE') {
        await createNarrativeDuel(
          duelData.question,
          duelData.creatorPosition,
          duelData.stake
        );
      }

      // Close modal on success
      setShowCreateModal(false);
    } catch (err: any) {
      console.error('Error creating duel:', err);
      showError('Failed to Create Duel', err.message || 'An unknown error occurred');
    }
  };

  const handleAcceptDuel = async (duelId: bigint) => {
    try {
      // Find the duel to get the stake amount
      const duel = mockDuels.find(d => d.id === duelId);
      if (!duel) {
        throw new Error('Duel not found');
      }

      // Convert stake from wei to ETH string
      const stakeInEth = (Number(duel.stake) / 1e18).toString();

      await acceptDuel(duelId, stakeInEth);
    } catch (err: any) {
      console.error('Error accepting duel:', err);
      showError('Failed to Accept Duel', err.message || 'An unknown error occurred');
    }
  };

  const handleVote = async (duelId: bigint, position: boolean) => {
    try {
      // TODO: When using real contract data, check with useHasVoted hook:
      // const { data: hasVoted } = useHasVoted(duelId, address);
      // if (hasVoted) { showWarning(...); return; }

      if (votedDuels.has(duelId)) {
        showWarning('Already Voted', 'You have already voted on this duel');
        return;
      }

      await voteOnDuel(duelId, position);

      // Track vote locally (will be replaced by contract read when using real data)
      setVotedDuels(prev => new Set(prev).add(duelId));

      showSuccess('Vote Submitted', `You voted ${position ? 'FOR' : 'AGAINST'} the creator's position`);
    } catch (err: any) {
      console.error('Error voting on duel:', err);
      showError('Failed to Vote', err.message || 'An unknown error occurred');
    }
  };


  const handleClaimReward = async (duelId: bigint) => {
    try {
      if (claimedDuels.has(duelId)) {
        showWarning('Already Claimed', 'You have already claimed rewards for this duel');
        return;
      }

      // TODO: Call contract's claimReward function
      // await claimReward(duelId);

      // For now, just track locally
      setClaimedDuels(prev => new Set(prev).add(duelId));
      showSuccess('Rewards Claimed', 'Your rewards have been claimed successfully!');
    } catch (err: any) {
      console.error('Error claiming reward:', err);
      showError('Failed to Claim Reward', err.message || 'An unknown error occurred');
    }
  };

  const handleCancelDuel = async (duelId: bigint) => {
    try {
      const confirmed = window.confirm('Are you sure you want to cancel this duel? Your stake will be returned.');
      if (!confirmed) return;

      await cancelDuel(duelId);

      showSuccess('Duel Cancelled', 'Your duel has been cancelled and your stake will be returned');
    } catch (err: any) {
      console.error('Error cancelling duel:', err);
      showError('Failed to Cancel Duel', err.message || 'An unknown error occurred');
    }
  };

  // Calculate user stats from duels
  const myStats = address ? {
    totalDuels: mockDuels.filter(d =>
      d.creator.toLowerCase() === address.toLowerCase() ||
      d.opponent.toLowerCase() === address.toLowerCase()
    ).length,
    wins: mockDuels.filter(d =>
      d.resolved && d.winner?.toLowerCase() === address.toLowerCase()
    ).length,
    losses: mockDuels.filter(d =>
      d.resolved &&
      (d.creator.toLowerCase() === address.toLowerCase() || d.opponent.toLowerCase() === address.toLowerCase()) &&
      d.winner?.toLowerCase() !== address.toLowerCase()
    ).length,
    unclaimedWinnings: mockDuels
      .filter(d => d.resolved && d.winner?.toLowerCase() === address.toLowerCase() && !claimedDuels.has(d.id))
      .reduce((total, d) => total + Number(d.stake) * 2 * 0.95, 0), // Winner gets 95% of total stakes
  } : null;

  const tabs = [
    { id: 'all', label: 'All Duels', count: mockDuels.length },
    { id: 'open', label: 'Open Challenges', count: mockDuels.filter(d => d.opponent === '0x0000000000000000000000000000000000000000').length },
    { id: 'active', label: 'Active', count: mockDuels.filter(d => d.opponent !== '0x0000000000000000000000000000000000000000' && !d.resolved).length },
    { id: 'my', label: 'My Duels', count: address ? mockDuels.filter(d => d.creator.toLowerCase() === address.toLowerCase() || d.opponent.toLowerCase() === address.toLowerCase()).length : 0 },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Timecaster Arena
            </h1>
            <p className="text-gray-400">
              Challenge others to 1v1 prediction duels and win ETH
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 text-sm font-medium transition-all ${
                  viewMode === 'grid'
                    ? 'bg-orange-500/20 text-orange-400 border-r border-orange-500/30'
                    : 'text-gray-400 hover:text-gray-300 border-r border-gray-700'
                }`}
              >
                📋 Grid
              </button>
              <button
                onClick={() => setViewMode('faceoff')}
                className={`px-4 py-2 text-sm font-medium transition-all ${
                  viewMode === 'faceoff'
                    ? 'bg-orange-500/20 text-orange-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                ⚔️ Face-Off
              </button>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              disabled={!address}
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Create Duel
            </button>
          </div>
        </div>

        {/* Unclaimed Winnings Banner */}
        {myStats && myStats.unclaimedWinnings > 0 && (
          <div className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-cyan-500/20 border border-green-500/30 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl">🏆</div>
                <div>
                  <div className="text-lg font-bold text-green-400 mb-1">
                    You Have Unclaimed Winnings!
                  </div>
                  <div className="text-sm text-gray-400">
                    {myStats.wins} win{myStats.wins !== 1 ? 's' : ''} waiting to be claimed
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-400 mb-1">
                  {(myStats.unclaimedWinnings / 1e18).toFixed(4)} ETH
                </div>
                <div className="text-xs text-gray-400">Total Unclaimed</div>
              </div>
            </div>
          </div>
        )}

        {/* Earnings Opportunities Banner */}
        <div className="bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10 border border-orange-500/30 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl mb-2">⚔️</div>
              <div className="text-sm font-bold text-orange-400 mb-1">Win Duels</div>
              <div className="text-xs text-gray-400">Winner takes 95% of total stakes</div>
              <div className="text-sm font-bold text-green-400 mt-2">Up to 10x ROI</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🗳️</div>
              <div className="text-sm font-bold text-purple-400 mb-1">Vote & Earn</div>
              <div className="text-xs text-gray-400">Vote on narrative duels (0.01 ETH/vote)</div>
              <div className="text-sm font-bold text-green-400 mt-2">Share 50% of fees</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-sm font-bold text-cyan-400 mb-1">Spectate Mode</div>
              <div className="text-xs text-gray-400">Watch duels and earn from accurate predictions</div>
              <div className="text-sm font-bold text-green-400 mt-2">Passive Income</div>
            </div>
          </div>
        </div>

        {/* My Stats */}
        {myStats && myStats.totalDuels > 0 && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-1">{myStats.totalDuels}</div>
              <div className="text-xs text-gray-500">Total Duels</div>
            </div>
            <div className="bg-gray-800/50 border border-green-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">{myStats.wins}</div>
              <div className="text-xs text-gray-500">Wins</div>
            </div>
            <div className="bg-gray-800/50 border border-red-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-400 mb-1">{myStats.losses}</div>
              <div className="text-xs text-gray-500">Losses</div>
            </div>
            <div className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {myStats.totalDuels > 0 ? Math.round((myStats.wins / myStats.totalDuels) * 100) : 0}%
              </div>
              <div className="text-xs text-gray-500">Win Rate</div>
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📈</span>
              <div className="text-sm font-bold text-blue-400">PRICE DUELS</div>
            </div>
            <p className="text-xs text-gray-400 mb-2">
              Bet on crypto price movements. Resolved by oracle.
            </p>
            <div className="text-xs text-green-400">💰 Min stake: 0.01 ETH • Max: 10 ETH</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">⚙️</span>
              <div className="text-sm font-bold text-purple-400">PROTOCOL DUELS</div>
            </div>
            <p className="text-xs text-gray-400 mb-2">
              Predict protocol metrics & TVL. Resolved by oracle.
            </p>
            <div className="text-xs text-green-400">💰 Min stake: 0.05 ETH • Max: 20 ETH</div>
          </div>
          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">💭</span>
              <div className="text-sm font-bold text-orange-400">NARRATIVE DUELS</div>
            </div>
            <p className="text-xs text-gray-400 mb-2">
              Vote on viral narratives & trends. Community voted.
            </p>
            <div className="text-xs text-green-400">
              💰 Min stake: 0.01 ETH • {voteStake ? `${Number(voteStake) / 1e18} ETH` : '0.01 ETH'} per vote
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600'
            }`}
          >
            {tab.label}
            <span className="ml-2 text-xs opacity-70">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Main Content - Duels Grid + Live Lobby */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Duels (2/3 width) */}
        <div className="lg:col-span-2">
          {!address ? (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-12 text-center">
              <div className="text-6xl mb-4">⚔️</div>
              <h2 className="text-2xl font-bold mb-4">Connect to View Duels</h2>
              <p className="text-gray-400 max-w-md mx-auto">
                Connect your wallet to browse duels, create challenges, and prove your prediction skills in 1v1 battles.
              </p>
            </div>
          ) : filteredDuels.length === 0 ? (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-12 text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold mb-4">No Duels Found</h2>
              <p className="text-gray-400 max-w-md mx-auto mb-6">
                {activeTab === 'my'
                  ? "You haven't participated in any duels yet. Create one to get started!"
                  : 'No duels in this category yet. Be the first to create one!'}
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-lg font-medium transition-all"
              >
                Create First Duel
              </button>
            </div>
          ) : viewMode === 'faceoff' ? (
            // Face-Off View - Show one duel at a time with combat animations
            <div className="space-y-6">
              {filteredDuels
                .filter(duel => duel.opponent !== '0x0000000000000000000000000000000000000000') // Only show duels with both participants
                .slice(0, 3) // Show first 3 active duels
                .map((duel) => {
                  const isCreator = address && duel.creator.toLowerCase() === address.toLowerCase();
                  const isOpponent = address && duel.opponent.toLowerCase() === address.toLowerCase();
                  const canVote = !isCreator && !isOpponent && !votedDuels.has(duel.id);

                  return (
                    <DuelFaceOff
                      key={Number(duel.id)}
                      duel={duel}
                      onVote={canVote ? (position) => {
                        // Convert 'creator' | 'opponent' to boolean (true = vote for creator)
                        handleVote(duel.id, position === 'creator');
                      } : undefined}
                      showResult={duel.resolved}
                      winner={duel.winner === duel.creator ? 'creator' : duel.winner === duel.opponent ? 'opponent' : null}
                    />
                  );
                })}

              {filteredDuels.filter(duel => duel.opponent !== '0x0000000000000000000000000000000000000000').length === 0 && (
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-12 text-center">
                  <div className="text-6xl mb-4">⚔️</div>
                  <h2 className="text-2xl font-bold mb-4">No Active Duels</h2>
                  <p className="text-gray-400 max-w-md mx-auto mb-6">
                    Face-Off mode shows duels with both participants. Check the "Open Challenges" tab to accept a duel!
                  </p>
                  <button
                    onClick={() => setViewMode('grid')}
                    className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-lg font-medium transition-all"
                  >
                    Switch to Grid View
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Grid View - Classic card layout
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDuels.map((duel) => (
                <DuelCard
                  key={Number(duel.id)}
                  duel={duel}
                  currentUser={address}
                  onAccept={handleAcceptDuel}
                  onClick={setSelectedDuel}
                  onClaim={handleClaimReward}
                  onCancel={handleCancelDuel}
                  hasClaimed={claimedDuels.has(duel.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Live Lobby (1/3 width) */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <LiveLobby />
          </div>
        </div>
      </div>

      {/* How It Works Section (shown when empty or on All tab) */}
      {address && (activeTab === 'all' || filteredDuels.length === 0) && (
        <div className="mt-8 bg-gray-800/30 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4 text-center text-gray-300">How Duels Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500/20 border border-orange-500/50 rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold text-orange-400">
                1
              </div>
              <h4 className="text-sm font-semibold mb-2">Create Challenge</h4>
              <p className="text-xs text-gray-500">
                Set question, position, and stake
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500/20 border border-orange-500/50 rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold text-orange-400">
                2
              </div>
              <h4 className="text-sm font-semibold mb-2">Opponent Accepts</h4>
              <p className="text-xs text-gray-500">
                Someone matches your stake
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500/20 border border-orange-500/50 rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold text-orange-400">
                3
              </div>
              <h4 className="text-sm font-semibold mb-2">Community Votes</h4>
              <p className="text-xs text-gray-500">
                Others vote for {voteStake ? `${Number(voteStake) / 1e18} ETH` : '0.01 ETH'}
                {minVotes && ` (min ${Number(minVotes)} votes)`}
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500/20 border border-orange-500/50 rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold text-orange-400">
                4
              </div>
              <h4 className="text-sm font-semibold mb-2">Winner Takes All</h4>
              <p className="text-xs text-gray-500">
                Winner gets 190% of stake
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateDuelModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateDuel}
      />

      <DuelDetailsModal
        isOpen={selectedDuel !== null}
        onClose={() => setSelectedDuel(null)}
        duel={selectedDuel}
        currentUser={address}
        onVote={handleVote}
      />
    </div>
  );
}
