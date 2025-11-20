/**
 * Terminal Dashboard - Main Foresight Terminal View
 * Features Dynamic NFT Hero + Quick Stats + Prediction Feed/Tape Toggle
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { DynamicNFTCard } from '../components/terminal/DynamicNFTCard';
import { PredictionTape } from '../components/terminal/PredictionTape';
import { PredictionFeed } from '../components/terminal/PredictionFeed';
import { CreatePredictionModal } from '../components/modals/CreatePredictionModal';
import { MarkOutcomeModal } from '../components/modals/MarkOutcomeModal';
import { ContractErrorDisplay } from '../components/ContractErrorDisplay';
import { useNFTData } from '../hooks/terminal/useNFTData';
import type { Prediction } from '../components/terminal/PredictionCard';
import { List, SquaresFour } from '@phosphor-icons/react';
import '../styles/terminal.css';
import '../styles/animations.css';

type ViewMode = 'tape' | 'feed';

export default function TerminalDashboard() {
  const navigate = useNavigate();
  const { address } = useAccount();
  const { stats, isLoading, isConnected, refetch } = useNFTData();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('tape');

  // TODO: Replace with DailyGauntlet contract reads for predictions
  // ForesightNFT is a reputation display NFT, not a prediction contract
  // Prediction functionality is in DailyGauntlet
  // For now, using mock data for demonstration
  const mockPredictions: Prediction[] = address ? [
    {
      id: 1n,
      text: "ETH will reach $5,000 before end of year",
      creator: address,
      lockPeriod: 60n * 24n * 60n * 60n, // 60 days
      createdAt: BigInt(Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60), // 30 days ago
      stake: 100000000000000000n, // 0.1 ETH
      resolved: false,
    },
    {
      id: 2n,
      text: "Base will have 1M+ daily active users by March",
      creator: address,
      lockPeriod: 90n * 24n * 60n * 60n, // 90 days
      createdAt: BigInt(Math.floor(Date.now() / 1000) - 70 * 24 * 60 * 60), // 70 days ago
      stake: 0n,
      resolved: false,
    },
    {
      id: 3n,
      text: "CT league will launch mainnet in Q1 2025",
      creator: address,
      lockPeriod: 30n * 24n * 60n * 60n, // 30 days
      createdAt: BigInt(Math.floor(Date.now() / 1000) - 35 * 24 * 60 * 60), // 35 days ago (expired)
      stake: 50000000000000000n, // 0.05 ETH
      resolved: false,
    },
    {
      id: 4n,
      text: "Farcaster will integrate with major social platform",
      creator: address,
      lockPeriod: 60n * 24n * 60n * 60n,
      createdAt: BigInt(Math.floor(Date.now() / 1000) - 65 * 24 * 60 * 60), // 65 days ago (expired)
      stake: 0n,
      resolved: true,
      success: true,
    },
  ] : [];

  // Mock feed predictions with voting data
  const mockFeedPredictions: Array<{
    id: bigint;
    question: string;
    description?: string;
    category: 'crypto' | 'politics' | 'sports' | 'tech' | 'other';
    deadline: bigint;
    resolved: boolean;
    userVote?: 'YES' | 'NO';
    yesVotes: bigint;
    noVotes: bigint;
    createdBy: string;
    createdAt: bigint;
  }> = address ? [
    {
      id: 101n,
      question: 'Will ETH reach $5,000 by end of 2025?',
      description: 'Ethereum price prediction based on market conditions and upcoming upgrades',
      category: 'crypto',
      deadline: BigInt(Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60), // 30 days from now
      resolved: false,
      yesVotes: 1247n,
      noVotes: 653n,
      createdBy: address,
      createdAt: BigInt(Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60), // 7 days ago
    },
    {
      id: 102n,
      question: 'Will Base have 10M+ daily active users by Q2 2025?',
      description: 'Based on current growth trajectory and ecosystem development',
      category: 'crypto',
      deadline: BigInt(Math.floor(Date.now() / 1000) + 60 * 24 * 60 * 60),
      resolved: false,
      userVote: 'YES',
      yesVotes: 892n,
      noVotes: 1108n,
      createdBy: address,
      createdAt: BigInt(Math.floor(Date.now() / 1000) - 14 * 24 * 60 * 60),
    },
    {
      id: 103n,
      question: 'Will a prediction market protocol reach $1B TVL?',
      description: 'Including Polymarket, Kalshi, and other major platforms',
      category: 'crypto',
      deadline: BigInt(Math.floor(Date.now() / 1000) + 90 * 24 * 60 * 60),
      resolved: false,
      yesVotes: 2156n,
      noVotes: 344n,
      createdBy: address,
      createdAt: BigInt(Math.floor(Date.now() / 1000) - 3 * 24 * 60 * 60),
    },
    {
      id: 104n,
      question: 'Will Farcaster integrate with a top 10 social platform?',
      description: 'Major social platforms include Twitter, Instagram, TikTok, etc.',
      category: 'tech',
      deadline: BigInt(Math.floor(Date.now() / 1000) - 5 * 24 * 60 * 60), // Already passed
      resolved: true,
      userVote: 'YES',
      yesVotes: 1523n,
      noVotes: 877n,
      createdBy: address,
      createdAt: BigInt(Math.floor(Date.now() / 1000) - 65 * 24 * 60 * 60),
    },
    {
      id: 105n,
      question: 'Will an AI agent autonomously trade >$10M in crypto?',
      description: 'Fully autonomous trading without human intervention',
      category: 'tech',
      deadline: BigInt(Math.floor(Date.now() / 1000) + 45 * 24 * 60 * 60),
      resolved: false,
      yesVotes: 3421n,
      noVotes: 1879n,
      createdBy: address,
      createdAt: BigInt(Math.floor(Date.now() / 1000) - 21 * 24 * 60 * 60),
    },
  ] : [];

  const handlePredictionClick = (prediction: Prediction) => {
    // Check if prediction is ready to mark (expired and not resolved)
    const now = Date.now() / 1000;
    const expiresAt = Number(prediction.createdAt) + Number(prediction.lockPeriod);
    const isExpired = now >= expiresAt;

    if (isExpired && !prediction.resolved) {
      setSelectedPrediction(prediction);
      setShowMarkModal(true);
    }
  };

  const handleCreateSuccess = () => {
    refetch(); // Refresh NFT data
    // TODO: Refresh predictions from DailyGauntlet contract
  };

  const handleMarkSuccess = () => {
    refetch(); // Refresh NFT data
    // TODO: Refresh predictions from DailyGauntlet contract
  };

  const handleVote = (predictionId: bigint, vote: 'YES' | 'NO') => {
    console.log('Vote:', predictionId, vote);
    // TODO: Call smart contract to submit vote
  };

  const handleShare = (predictionId: bigint) => {
    console.log('Share:', predictionId);
    // TODO: Implement share functionality (copy link, share to Farcaster, etc.)
  };

  const handleBookmark = (predictionId: bigint) => {
    console.log('Bookmark:', predictionId);
    // TODO: Implement bookmark functionality
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔮</div>
          <h2 className="text-2xl font-bold mb-3 text-gray-200">
            Foresight Terminal
          </h2>
          <p className="text-gray-400 mb-6">
            Connect your wallet to access your prediction dashboard and build your
            onchain reputation.
          </p>
          <div className="bg-gray-800/50 border border-cyan-500/30 rounded-lg p-4">
            <p className="text-sm text-cyan-400">
              👆 Connect wallet above to continue
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen terminal-grid p-4 pb-20">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header with View Toggle */}
        <div className="text-center pt-4 pb-2">
          <div className="flex items-center justify-center gap-4 mb-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Foresight Terminal
            </h1>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-gray-800/50 border border-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('tape')}
                className={`p-2 rounded transition-all ${
                  viewMode === 'tape'
                    ? 'bg-cyan-500 text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                title="Tape View"
              >
                <List size={20} weight="bold" />
              </button>
              <button
                onClick={() => setViewMode('feed')}
                className={`p-2 rounded transition-all ${
                  viewMode === 'feed'
                    ? 'bg-cyan-500 text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                title="Feed View"
              >
                <SquaresFour size={20} weight="bold" />
              </button>
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            Your onchain prediction reputation dashboard
          </p>
        </div>

        {/* Dynamic NFT Hero Card - Only show in tape view */}
        {viewMode === 'tape' && (
          <DynamicNFTCard
            stats={stats}
            isLoading={isLoading}
            onViewProfile={() => navigate('/profile')}
          />
        )}

        {/* Quick Stats - Only show in tape view */}
        {viewMode === 'tape' && stats && Number(stats.totalPredictions) > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <StatCard
              label="Active"
              value={Number(stats.totalPredictions) - Number(stats.resolvedPredictions)}
              icon="⏳"
              color="cyan"
            />
            <StatCard
              label="Resolved"
              value={Number(stats.resolvedPredictions)}
              icon="✓"
              color="green"
            />
            <StatCard
              label="Streak"
              value={Number(stats.currentStreak)}
              icon="🔥"
              color="orange"
            />
          </div>
        )}

        {/* Prediction Tape View */}
        {viewMode === 'tape' && (
          <>
            {mockPredictions.length > 0 ? (
              <PredictionTape
                predictions={mockPredictions}
                isLoading={false}
                onPredictionClick={handlePredictionClick}
                autoScrollToReady={true}
              />
            ) : (
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center">
                <div className="text-4xl mb-4">🔮</div>
                <p className="text-gray-400">No predictions yet</p>
                <p className="text-sm text-gray-500 mt-2">
                  Create your first prediction to start building your onchain reputation
                </p>
              </div>
            )}
          </>
        )}

        {/* TikTok-Style Feed View */}
        {viewMode === 'feed' && mockFeedPredictions.length > 0 && (
          <div className="-mx-4 -mt-6">
            <PredictionFeed
              predictions={mockFeedPredictions}
              onVote={handleVote}
              onShare={handleShare}
              onBookmark={handleBookmark}
            />
          </div>
        )}

        {/* Create Prediction CTA - Only show in tape view */}
        {viewMode === 'tape' && (
          <>
            <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-lg font-semibold text-gray-200 mb-2">
                Ready to make a prediction?
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Lock in your foresight and build your onchain reputation
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 rounded-lg font-medium text-white transition-all duration-200 shadow-lg hover:shadow-cyan-500/50 tap-feedback"
              >
                Create Prediction
              </button>
            </div>

            {/* Terminal Footer */}
            <div className="text-center text-xs text-gray-600 pt-4">
              <p>Base Sepolia Testnet • Powered by CT league</p>
              <p className="mt-1 text-gray-700">
                💡 Tip: Click on expired predictions to mark their outcome
              </p>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <CreatePredictionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />

      <MarkOutcomeModal
        isOpen={showMarkModal}
        prediction={selectedPrediction}
        onClose={() => {
          setShowMarkModal(false);
          setSelectedPrediction(null);
        }}
        onSuccess={handleMarkSuccess}
      />
    </div>
  );
}

// ========================================
// Quick Stat Card Component
// ========================================

interface StatCardProps {
  label: string;
  value: number;
  icon: string;
  color: 'cyan' | 'green' | 'orange';
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  const colorClasses = {
    cyan: 'border-cyan-500/30 text-cyan-400',
    green: 'border-green-500/30 text-green-400',
    orange: 'border-orange-500/30 text-orange-400',
  };

  return (
    <div
      className={`bg-gray-800/50 border ${colorClasses[color]} rounded-lg p-4 text-center hover:bg-gray-800/70 transition-all duration-200 cursor-default`}
    >
      <div className="text-2xl mb-1">{icon}</div>
      <div className={`text-2xl font-bold mb-1 ${colorClasses[color]}`}>
        {value}
      </div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );
}
