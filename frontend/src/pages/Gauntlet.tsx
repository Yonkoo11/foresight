/**
 * Daily Gauntlet Page
 * Daily prediction tournaments with 5 predictions
 */

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { GauntletCard, type Gauntlet } from '../components/gauntlet/GauntletCard';
import { DailyPredictionCard, type DailyPrediction, type UserPrediction } from '../components/gauntlet/DailyPredictionCard';
import { GauntletProgressPath } from '../components/gauntlet/GauntletProgressPath';
import { useDailyGauntlet, useCurrentDay, useGetGauntlet, useGetEntry, useGauntletConstants } from '../contracts/hooks';
import { useNotifications } from '../contexts/NotificationContext';

export default function Gauntlet() {
  const { address } = useAccount();
  const { showSuccess, showError, showWarning } = useNotifications();
  const [selectedDay, setSelectedDay] = useState<bigint | null>(null);
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [claimedDays, setClaimedDays] = useState<Set<bigint>>(new Set());
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Contract hooks
  const {
    submitPrediction,
    claimReward,
    isSuccess,
    error,
    hash,
  } = useDailyGauntlet();

  const { data: contractCurrentDay } = useCurrentDay();

  // Contract constants
  const { minStake, predictionsPerGauntlet } = useGauntletConstants();

  // Show transaction status
  useEffect(() => {
    if (isSuccess && hash) {
      showSuccess('Transaction Successful', 'Your transaction has been confirmed on-chain.');
      // TODO: Refetch gauntlet data and user entry from contract
      // Use useGetGauntlet(currentDay) and useGetEntry(currentDay, address) to get updated data
    }
  }, [isSuccess, hash, showSuccess]);

  useEffect(() => {
    if (error) {
      console.error('Transaction error:', error);
      showError('Transaction Failed', 'Please check your wallet and try again.');
    }
  }, [error, showError]);

  // Use contract current day or fallback to mock
  const currentDay = (contractCurrentDay as bigint | undefined) || 42n;

  const mockGauntlets: Gauntlet[] = address
    ? [
        {
          day: currentDay,
          totalPool: 5000000000000000000n, // 5 ETH
          totalParticipants: 123n,
          deadline: BigInt(Math.floor(Date.now() / 1000) + 18 * 60 * 60), // 18 hours from now
          resolved: false,
          userParticipated: true,
        },
        {
          day: currentDay - 1n,
          totalPool: 4500000000000000000n, // 4.5 ETH
          totalParticipants: 98n,
          deadline: BigInt(Math.floor(Date.now() / 1000) - 6 * 60 * 60), // 6 hours ago
          resolved: true,
          userParticipated: true,
          userScore: 4,
        },
        {
          day: currentDay - 2n,
          totalPool: 3800000000000000000n, // 3.8 ETH
          totalParticipants: 87n,
          deadline: BigInt(Math.floor(Date.now() / 1000) - 30 * 60 * 60), // 30 hours ago
          resolved: true,
          userParticipated: true,
          userScore: 5,
        },
        {
          day: currentDay - 3n,
          totalPool: 4200000000000000000n, // 4.2 ETH
          totalParticipants: 102n,
          deadline: BigInt(Math.floor(Date.now() / 1000) - 54 * 60 * 60), // 54 hours ago
          resolved: true,
          userParticipated: false,
        },
      ]
    : [];

  const mockPredictions: DailyPrediction[] = address && selectedDay
    ? [
        {
          id: 1n,
          day: selectedDay,
          question: 'What will be the highest price of ETH/USD today?',
          oracleKey: 'ETH_USD',
          targetValue: 0n,
          isAbove: true,
          deadline: BigInt(Math.floor(Date.now() / 1000) + 18 * 60 * 60),
          resolved: false,
        },
        {
          id: 2n,
          day: selectedDay,
          question: 'What will be the lowest price of BTC/USD today?',
          oracleKey: 'BTC_USD',
          targetValue: 0n,
          isAbove: false,
          deadline: BigInt(Math.floor(Date.now() / 1000) + 18 * 60 * 60),
          resolved: false,
        },
        {
          id: 3n,
          day: selectedDay,
          question: 'What will Uniswap V3 TVL be at end of day?',
          oracleKey: 'UNI_TVL',
          targetValue: 0n,
          isAbove: true,
          deadline: BigInt(Math.floor(Date.now() / 1000) + 18 * 60 * 60),
          resolved: false,
        },
        {
          id: 4n,
          day: selectedDay,
          question: 'What will be the 24h trading volume for SOL/USD?',
          oracleKey: 'SOL_VOLUME',
          targetValue: 0n,
          isAbove: true,
          deadline: BigInt(Math.floor(Date.now() / 1000) + 18 * 60 * 60),
          resolved: false,
        },
        {
          id: 5n,
          day: selectedDay,
          question: 'What will be the gas price (gwei) at 6pm UTC?',
          oracleKey: 'GAS_PRICE',
          targetValue: 0n,
          isAbove: false,
          deadline: BigInt(Math.floor(Date.now() / 1000) + 18 * 60 * 60),
          resolved: false,
        },
      ]
    : [];

  const mockUserPredictions: UserPrediction[] = address
    ? [
        { predictionId: 1n, guess: 320000n, submitted: true },
        { predictionId: 2n, guess: 4200000n, submitted: true },
        { predictionId: 3n, guess: 580000000n, submitted: false },
        { predictionId: 4n, guess: 0n, submitted: false },
        { predictionId: 5n, guess: 0n, submitted: false },
      ]
    : [];

  // Calculate streak
  useEffect(() => {
    if (!address || mockGauntlets.length === 0) return;

    // Sort gauntlets by day descending
    const sortedGauntlets = [...mockGauntlets]
      .filter(g => g.userParticipated)
      .sort((a, b) => Number(b.day) - Number(a.day));

    if (sortedGauntlets.length === 0) {
      setCurrentStreak(0);
      setBestStreak(0);
      return;
    }

    // Calculate current streak (consecutive days from most recent)
    let streak = 0;
    let expectedDay = Number(currentDay);

    for (const gauntlet of sortedGauntlets) {
      if (Number(gauntlet.day) === expectedDay || Number(gauntlet.day) === expectedDay - 1) {
        streak++;
        expectedDay = Number(gauntlet.day) - 1;
      } else {
        break;
      }
    }

    setCurrentStreak(streak);

    // Calculate best streak (longest consecutive run ever)
    let maxStreak = 0;
    let tempStreak = 1;

    for (let i = 0; i < sortedGauntlets.length - 1; i++) {
      const currentGauntletDay = Number(sortedGauntlets[i].day);
      const nextGauntletDay = Number(sortedGauntlets[i + 1].day);

      if (currentGauntletDay - nextGauntletDay === 1) {
        tempStreak++;
      } else {
        maxStreak = Math.max(maxStreak, tempStreak);
        tempStreak = 1;
      }
    }

    maxStreak = Math.max(maxStreak, tempStreak);
    setBestStreak(maxStreak);
  }, [address, currentDay]);

  const currentGauntlet = mockGauntlets.find((g) => g.day === currentDay);
  const historyGauntlets = mockGauntlets.filter((g) => g.day !== currentDay);

  const handleEnterGauntlet = async (day: bigint) => {
    setSelectedDay(day);
    // Entry fee: 0.05 ETH (would be handled in contract call)
    // TODO: Call contract to enter with ETH value
  };

  const handleViewGauntlet = (day: bigint) => {
    setSelectedDay(day);
  };

  const handleSubmitPrediction = async (predictionId: bigint, guess: bigint) => {
    try {
      if (!selectedDay) {
        throw new Error('No day selected');
      }

      await submitPrediction(selectedDay, predictionId, guess);

      showSuccess('Prediction Submitted', 'Your prediction has been recorded!');
    } catch (err: any) {
      console.error('Error submitting prediction:', err);
      showError('Failed to Submit Prediction', err.message || 'An unknown error occurred');
    }
  };

  const handleClaimReward = async (day: bigint) => {
    try {
      if (claimedDays.has(day)) {
        showWarning('Already Claimed', 'You have already claimed rewards for this day');
        return;
      }

      await claimReward(day);

      // Track claim locally
      setClaimedDays(prev => new Set(prev).add(day));
      showSuccess('Rewards Claimed', 'Your rewards have been claimed successfully!');
    } catch (err: any) {
      console.error('Error claiming reward:', err);
      showError('Failed to Claim Reward', err.message || 'An unknown error occurred');
    }
  };

  // Calculate user stats from gauntlets
  const myStats = address ? {
    totalGauntlets: mockGauntlets.filter(g => g.userParticipated).length,
    avgScore: mockGauntlets.filter(g => g.userParticipated && g.userScore !== undefined).length > 0
      ? mockGauntlets.filter(g => g.userParticipated && g.userScore !== undefined)
        .reduce((sum, g) => sum + (g.userScore || 0), 0) /
        mockGauntlets.filter(g => g.userParticipated && g.userScore !== undefined).length
      : 0,
    bestScore: mockGauntlets.filter(g => g.userParticipated && g.userScore !== undefined).length > 0
      ? Math.max(...mockGauntlets.filter(g => g.userParticipated && g.userScore !== undefined).map(g => g.userScore || 0))
      : 0,
    perfectScores: mockGauntlets.filter(g => g.userParticipated && g.userScore === 5).length,
    unclaimedRewards: mockGauntlets
      .filter(g =>
        g.resolved &&
        g.userParticipated &&
        (g.userScore || 0) >= 3 &&
        !claimedDays.has(g.day)
      )
      .reduce((total, g) => {
        const pool = Number(g.totalPool) / 1e18;
        const score = g.userScore || 0;
        const participants = Number(g.totalParticipants);

        // Calculate reward based on score
        let share = 0;
        if (score === 5) share = (pool * 0.5) / Math.max(1, participants * 0.1);
        else if (score === 4) share = (pool * 0.35) / Math.max(1, participants * 0.3);
        else if (score === 3) share = (pool * 0.15) / Math.max(1, participants * 0.5);

        return total + share;
      }, 0),
  } : null;

  const submittedCount = mockUserPredictions.filter((p) => p.submitted).length;

  // Mock earnings data
  // TODO: Replace with real data from useGetGauntlet(currentDay) and useGetEntry(currentDay, address)
  const todaysPrizePool = currentGauntlet ? Number(currentGauntlet.totalPool) / 1e18 : 0;
  const totalParticipants = currentGauntlet ? Number(currentGauntlet.totalParticipants) : 0;
  const entryFee = minStake ? Number(minStake) / 1e18 : 0.05; // ETH

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              Daily Gauntlet
            </h1>
            <p className="text-gray-400 mb-6">
              Make 5 daily predictions and win proportional rewards based on accuracy
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Current Day</div>
            <div className="text-2xl font-bold text-green-400">#{Number(currentDay)}</div>
          </div>
        </div>

        {/* Unclaimed Rewards Banner */}
        {myStats && myStats.unclaimedRewards > 0 && (
          <div className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 border border-yellow-500/30 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl">💰</div>
                <div>
                  <div className="text-lg font-bold text-yellow-400 mb-1">
                    Unclaimed Rewards Available!
                  </div>
                  <div className="text-sm text-gray-400">
                    {mockGauntlets.filter(g => g.resolved && g.userParticipated && (g.userScore || 0) >= 3 && !claimedDays.has(g.day)).length} gauntlet{mockGauntlets.filter(g => g.resolved && g.userParticipated && (g.userScore || 0) >= 3 && !claimedDays.has(g.day)).length !== 1 ? 's' : ''} with claimable rewards
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-400 mb-1">Total Unclaimed</div>
                  <div className="text-3xl font-bold text-yellow-400">
                    {myStats.unclaimedRewards.toFixed(4)} ETH
                  </div>
                </div>
                <button
                  onClick={() => setShowHistoryModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white rounded-lg font-medium transition-all"
                >
                  Claim Rewards
                </button>
              </div>
            </div>
          </div>
        )}

        {/* My Stats Dashboard */}
        {myStats && myStats.totalGauntlets > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-200">My Stats</h2>
              <button
                onClick={() => setShowHistoryModal(true)}
                className="text-sm text-green-400 hover:text-green-300 transition-all"
              >
                View History →
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">{myStats.totalGauntlets}</div>
                <div className="text-xs text-gray-500">Total Played</div>
              </div>
              <div className="bg-gray-800/50 border border-cyan-500/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-cyan-400 mb-1">{myStats.avgScore.toFixed(1)}</div>
                <div className="text-xs text-gray-500">Avg Score</div>
              </div>
              <div className="bg-gray-800/50 border border-yellow-500/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">{myStats.bestScore}/5</div>
                <div className="text-xs text-gray-500">Best Score</div>
              </div>
              <div className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">{myStats.perfectScores}</div>
                <div className="text-xs text-gray-500">Perfect 5/5</div>
              </div>
              <div className="bg-gray-800/50 border border-orange-500/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-400 mb-1">{currentStreak}</div>
                <div className="text-xs text-gray-500">Streak</div>
                <div className="text-xs text-gray-600 mt-1">Best: {bestStreak}</div>
              </div>
            </div>
          </div>
        )}

        {/* Prize Pool Banner */}
        <div className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-cyan-500/10 border border-green-500/30 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">Today's Prize Pool (Day #{Number(currentDay)})</div>
              <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                {todaysPrizePool.toFixed(2)} ETH
              </div>
              <div className="text-xs text-gray-500 mt-1">{totalParticipants} participants • {entryFee} ETH entry</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400 mb-1">Potential Earnings</div>
              <div className="text-2xl font-bold text-yellow-400">
                {totalParticipants > 0 ? ((todaysPrizePool * 0.5) / Math.max(1, totalParticipants * 0.1)).toFixed(2) : '0.00'} ETH
              </div>
              <div className="text-xs text-gray-500 mt-1">if perfect score (5/5)</div>
            </div>
          </div>

          {/* Proportional Payout Structure */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <div className="text-xs text-gray-500 mb-1">🎯 5/5 Correct</div>
              <div className="text-2xl font-bold text-green-400">50%</div>
              <div className="text-xs text-gray-600 mt-1">
                {(todaysPrizePool * 0.5).toFixed(2)} ETH shared
              </div>
              <div className="text-xs text-green-400 mt-1">
                ~{totalParticipants > 0 ? ((todaysPrizePool * 0.5) / Math.max(1, totalParticipants * 0.1)).toFixed(2) : '0.00'} ETH each
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <div className="text-xs text-gray-500 mb-1">✅ 4/5 Correct</div>
              <div className="text-2xl font-bold text-cyan-400">35%</div>
              <div className="text-xs text-gray-600 mt-1">
                {(todaysPrizePool * 0.35).toFixed(2)} ETH shared
              </div>
              <div className="text-xs text-cyan-400 mt-1">
                ~{totalParticipants > 0 ? ((todaysPrizePool * 0.35) / Math.max(1, totalParticipants * 0.3)).toFixed(2) : '0.00'} ETH each
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <div className="text-xs text-gray-500 mb-1">📊 3/5 Correct</div>
              <div className="text-2xl font-bold text-yellow-400">15%</div>
              <div className="text-xs text-gray-600 mt-1">
                {(todaysPrizePool * 0.15).toFixed(2)} ETH shared
              </div>
              <div className="text-xs text-yellow-400 mt-1">
                ~{totalParticipants > 0 ? ((todaysPrizePool * 0.15) / Math.max(1, totalParticipants * 0.5)).toFixed(2) : '0.00'} ETH each
              </div>
            </div>
          </div>
        </div>

        {/* Quest Rewards Banner */}
        <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-purple-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎁</span>
              <div>
                <div className="text-sm font-bold text-purple-400">Quest Reward System</div>
                <div className="text-xs text-gray-500">Earn reputation points + ETH bonuses (revenue-funded)</div>
              </div>
            </div>
            <div className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg">
              <div className="text-xs text-gray-400">Monthly Budget</div>
              <div className="text-sm font-bold text-purple-400">10 ETH</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-800/50 rounded-lg p-3 text-center border border-green-500/20">
              <div className="text-xs text-gray-500 mb-1">🌱 Daily Login (7 days)</div>
              <div className="text-lg font-bold text-green-400">+100 pts</div>
              <div className="text-xs text-green-400 mt-1">+0.001 ETH (vested)</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 text-center border border-cyan-500/20">
              <div className="text-xs text-gray-500 mb-1">🔥 Gauntlet Streak (7 days)</div>
              <div className="text-lg font-bold text-cyan-400">+200 pts</div>
              <div className="text-xs text-cyan-400 mt-1">+0.005 ETH (vested)</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 text-center border border-orange-500/20">
              <div className="text-xs text-gray-500 mb-1">🏆 Perfect Score (5/5)</div>
              <div className="text-lg font-bold text-orange-400">+150 pts</div>
              <div className="text-xs text-orange-400 mt-1">+0.003 ETH (vested)</div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs">
            <div className="text-gray-500">
              <span className="text-purple-400">💎</span> Earn reputation to unlock advanced quests
            </div>
            <div className="text-gray-500">
              <span className="text-yellow-400">⏳</span> All ETH rewards vest for 7 days
            </div>
          </div>
        </div>

        {/* Earnings Strategy Info */}
        <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-green-400 font-bold mb-1">💰 Gauntlet Winnings</div>
              <div className="text-xs text-gray-400">Entry: 0.05 ETH • Win up to {totalParticipants > 0 ? ((todaysPrizePool * 0.5) / Math.max(1, totalParticipants * 0.1)).toFixed(2) : '0.00'} ETH</div>
              <div className="text-xs text-green-400 mt-1">
                Zero-sum (skill-based)
              </div>
            </div>
            <div className="text-center">
              <div className="text-cyan-400 font-bold mb-1">📈 Quest Bonuses</div>
              <div className="text-xs text-gray-400">Daily/weekly milestones</div>
              <div className="text-xs text-cyan-400 mt-1">Capped at 10 ETH/month</div>
            </div>
            <div className="text-center">
              <div className="text-orange-400 font-bold mb-1">🔒 Anti-Exploit</div>
              <div className="text-xs text-gray-400">7-day vesting + daily limits</div>
              <div className="text-xs text-orange-400 mt-1">Sustainable & secure</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {!address ? (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-12 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold mb-4">Connect to Play</h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Connect your wallet to participate in the Daily Gauntlet and compete for proportional rewards.
          </p>
        </div>
      ) : selectedDay ? (
        /* Prediction View */
        <div>
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setSelectedDay(null)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded font-medium transition-all"
            >
              ← Back to Overview
            </button>
            <div className="text-sm text-gray-400">
              Day #{Number(selectedDay)} • {submittedCount}/5 submitted
            </div>
          </div>

          {/* Progress Path with Checkpoints */}
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 mb-6">
            <GauntletProgressPath
              totalPredictions={5}
              submittedCount={submittedCount}
              isResolved={false}
            />
          </div>

          {/* Predictions Grid */}
          <div className="grid grid-cols-1 gap-4">
            {mockPredictions.map((prediction, index) => (
              <DailyPredictionCard
                key={Number(prediction.id)}
                prediction={prediction}
                userPrediction={mockUserPredictions.find(
                  (up) => up.predictionId === prediction.id
                )}
                onSubmit={handleSubmitPrediction}
                index={index}
              />
            ))}
          </div>

          {/* Submit All Button */}
          {submittedCount === 5 && (
            <div className="mt-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-green-400 mb-2">All Predictions Submitted!</div>
              <p className="text-gray-400 mb-4">
                You've completed all 5 predictions for Day #{Number(selectedDay)}. Results will be revealed after the deadline.
              </p>
              <button
                onClick={() => setSelectedDay(null)}
                className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-all"
              >
                Return to Overview
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Overview */
        <div>
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('current')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'current'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600'
              }`}
            >
              Today's Gauntlet
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'history'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600'
              }`}
            >
              History ({historyGauntlets.length})
            </button>
          </div>

          {/* Content */}
          {activeTab === 'current' && currentGauntlet ? (
            <div>
              <GauntletCard
                gauntlet={currentGauntlet}
                onEnter={handleEnterGauntlet}
                onView={handleViewGauntlet}
                onClaim={handleClaimReward}
                hasClaimed={claimedDays.has(currentGauntlet.day)}
              />

              {/* How It Works */}
              <div className="mt-8 bg-gray-800/30 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4 text-center text-gray-300">
                  How the Daily Gauntlet Works
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold text-green-400">
                      1
                    </div>
                    <h4 className="text-sm font-semibold mb-2">Enter ({entryFee} ETH)</h4>
                    <p className="text-xs text-gray-500">Pay entry fee to participate</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold text-green-400">
                      2
                    </div>
                    <h4 className="text-sm font-semibold mb-2">
                      Make {predictionsPerGauntlet ? Number(predictionsPerGauntlet) : 5} Predictions
                    </h4>
                    <p className="text-xs text-gray-500">Submit your guesses before deadline</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold text-green-400">
                      3
                    </div>
                    <h4 className="text-sm font-semibold mb-2">Oracle Resolves</h4>
                    <p className="text-xs text-gray-500">Automated resolution via oracles</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold text-green-400">
                      4
                    </div>
                    <h4 className="text-sm font-semibold mb-2">Claim Rewards</h4>
                    <p className="text-xs text-gray-500">Get your share based on score</p>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'history' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {historyGauntlets.map((gauntlet) => (
                <GauntletCard
                  key={Number(gauntlet.day)}
                  gauntlet={gauntlet}
                  onView={handleViewGauntlet}
                  onClaim={handleClaimReward}
                  hasClaimed={claimedDays.has(gauntlet.day)}
                />
              ))}
            </div>
          ) : null}
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowHistoryModal(false)}>
          <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-green-500/10 to-emerald-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Gauntlet History</h2>
                  <p className="text-sm text-gray-400">
                    Your past performance across all daily gauntlets
                  </p>
                </div>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-all"
                >
                  ✕
                </button>
              </div>

              {/* Summary Stats */}
              {myStats && (
                <div className="mt-4 grid grid-cols-5 gap-3">
                  <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                    <div className="text-xs text-gray-500 mb-1">Total Played</div>
                    <div className="text-lg font-bold text-green-400">{myStats.totalGauntlets}</div>
                  </div>
                  <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                    <div className="text-xs text-gray-500 mb-1">Avg Score</div>
                    <div className="text-lg font-bold text-cyan-400">{myStats.avgScore.toFixed(1)}/5</div>
                  </div>
                  <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                    <div className="text-xs text-gray-500 mb-1">Best Score</div>
                    <div className="text-lg font-bold text-yellow-400">{myStats.bestScore}/5</div>
                  </div>
                  <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                    <div className="text-xs text-gray-500 mb-1">Perfect 5/5</div>
                    <div className="text-lg font-bold text-purple-400">{myStats.perfectScores}</div>
                  </div>
                  <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                    <div className="text-xs text-gray-500 mb-1">Unclaimed</div>
                    <div className="text-lg font-bold text-orange-400">
                      {myStats.unclaimedRewards.toFixed(2)} ETH
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Gauntlet List */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                {mockGauntlets
                  .filter(g => g.userParticipated)
                  .sort((a, b) => Number(b.day) - Number(a.day))
                  .map((gauntlet) => {
                    const canClaim = gauntlet.resolved && (gauntlet.userScore || 0) >= 3 && !claimedDays.has(gauntlet.day);
                    const hasClaimed = gauntlet.resolved && (gauntlet.userScore || 0) >= 3 && claimedDays.has(gauntlet.day);
                    const didNotQualify = gauntlet.resolved && (gauntlet.userScore || 0) < 3;

                    // Calculate individual reward
                    const pool = Number(gauntlet.totalPool) / 1e18;
                    const score = gauntlet.userScore || 0;
                    const participants = Number(gauntlet.totalParticipants);
                    let reward = 0;
                    if (score === 5) reward = (pool * 0.5) / Math.max(1, participants * 0.1);
                    else if (score === 4) reward = (pool * 0.35) / Math.max(1, participants * 0.3);
                    else if (score === 3) reward = (pool * 0.15) / Math.max(1, participants * 0.5);

                    return (
                      <div
                        key={Number(gauntlet.day)}
                        className="bg-gray-800/50 border border-gray-700 rounded-lg p-5 hover:border-gray-600 transition-all"
                      >
                        {/* Day Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <div className="text-lg font-bold text-gray-200">Day {Number(gauntlet.day)}</div>
                              {gauntlet.resolved ? (
                                <span className="px-2 py-1 text-xs rounded border bg-blue-500/20 text-blue-400 border-blue-500/30">
                                  Resolved
                                </span>
                              ) : (
                                <span className="px-2 py-1 text-xs rounded border bg-green-500/20 text-green-400 border-green-500/30">
                                  Active
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              {participants} participants • {pool.toFixed(2)} ETH pool
                            </div>
                          </div>

                          {/* Score Badge */}
                          {gauntlet.userScore !== undefined && (
                            <div className={`px-4 py-2 rounded-lg ${
                              score === 5
                                ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30'
                                : score === 4
                                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30'
                                : score === 3
                                ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
                                : 'bg-gray-900/50 border border-gray-700'
                            }`}>
                              <div className="text-xs text-gray-500 mb-1">Your Score</div>
                              <div className={`text-2xl font-bold ${
                                score === 5 ? 'text-green-400' :
                                score === 4 ? 'text-cyan-400' :
                                score === 3 ? 'text-yellow-400' :
                                'text-gray-400'
                              }`}>
                                {score}/5
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="bg-gray-900/50 rounded p-2 text-center">
                            <div className="text-xs text-gray-500 mb-1">Prize Pool</div>
                            <div className="text-sm font-bold text-green-400">{pool.toFixed(2)} ETH</div>
                          </div>
                          <div className="bg-gray-900/50 rounded p-2 text-center">
                            <div className="text-xs text-gray-500 mb-1">Your Score</div>
                            <div className="text-sm font-bold text-cyan-400">
                              {gauntlet.userScore !== undefined ? `${gauntlet.userScore}/5` : 'N/A'}
                            </div>
                          </div>
                          <div className="bg-gray-900/50 rounded p-2 text-center">
                            <div className="text-xs text-gray-500 mb-1">Your Reward</div>
                            <div className="text-sm font-bold text-yellow-400">
                              {reward > 0 ? `${reward.toFixed(4)} ETH` : 'None'}
                            </div>
                          </div>
                        </div>

                        {/* Performance Breakdown */}
                        {gauntlet.resolved && gauntlet.userScore !== undefined && (
                          <div className="bg-gray-900/50 rounded-lg p-3 mb-4">
                            <div className="text-xs text-gray-500 mb-2">Performance</div>
                            <div className="flex gap-2">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`flex-1 h-2 rounded ${
                                    i < gauntlet.userScore!
                                      ? 'bg-green-500'
                                      : 'bg-gray-700'
                                  }`}
                                />
                              ))}
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                              {gauntlet.userScore} correct prediction{gauntlet.userScore !== 1 ? 's' : ''}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {canClaim && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClaimReward(gauntlet.day);
                              }}
                              className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white rounded font-medium transition-all"
                            >
                              💰 Claim {reward.toFixed(4)} ETH
                            </button>
                          )}

                          {hasClaimed && (
                            <div className="flex-1 px-4 py-2 bg-green-500/20 text-green-400 rounded text-center text-sm border border-green-500/30">
                              ✓ Claimed
                            </div>
                          )}

                          {didNotQualify && (
                            <div className="flex-1 px-4 py-2 bg-gray-900/50 text-gray-400 rounded text-center text-sm">
                              Did Not Qualify ({score}/5)
                            </div>
                          )}

                          {!gauntlet.resolved && (
                            <div className="flex-1 px-4 py-2 bg-blue-500/20 text-blue-400 rounded text-center text-sm border border-blue-500/30">
                              Awaiting Resolution
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Empty State */}
              {mockGauntlets.filter(g => g.userParticipated).length === 0 && (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3">🎯</div>
                  <p className="text-gray-400">No gauntlet history yet</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Enter your first gauntlet to start building your track record!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
