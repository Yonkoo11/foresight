/**
 * Referral System Component
 * Simple one-time referral bonuses (sustainable model)
 */

import { useState } from 'react';
import { useAccount } from 'wagmi';

interface ReferralStats {
  totalReferrals: number;
  claimedBonuses: number;
  totalEarned: number;
  pendingBonuses: number;
}

export function ReferralSystem() {
  const { address } = useAccount();
  const [copied, setCopied] = useState(false);

  // Mock referral stats
  const stats: ReferralStats = {
    totalReferrals: 7,
    claimedBonuses: 5,
    totalEarned: 0.25, // 5 x 0.05 ETH
    pendingBonuses: 2,
  };

  const referralLink = address ? `https://timecaster.xyz/ref/${address.slice(0, 10)}` : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const BONUS_PER_REFERRAL = 0.05; // 0.05 ETH per referral who makes their first bet

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-2xl">
            👥
          </div>
          <div>
            <h3 className="font-bold text-white text-xl">Invite Friends</h3>
            <p className="text-xs text-gray-400">Earn 0.05 ETH per friend (one-time bonus)</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-800/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-cyan-400">{stats.totalReferrals}</div>
            <div className="text-xs text-gray-500 mt-1">Total Invites</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.claimedBonuses}</div>
            <div className="text-xs text-gray-500 mt-1">Bonuses Claimed</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.totalEarned} ETH</div>
            <div className="text-xs text-gray-500 mt-1">Total Earned</div>
          </div>
        </div>
      </div>

      {/* Referral Link */}
      <div className="p-6 border-b border-gray-700">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Your Referral Link
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm font-mono text-gray-300 focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={handleCopyLink}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white'
            }`}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* How It Works */}
      <div className="p-6 border-b border-gray-700">
        <h4 className="font-semibold text-white mb-4">How It Works</h4>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-cyan-400">1</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-white">Share Your Link</span>
              </div>
              <p className="text-xs text-gray-400">
                Copy your unique referral link and share it with friends
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-purple-400">2</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-white">Friend Makes First Bet</span>
              </div>
              <p className="text-xs text-gray-400">
                When your friend places their first bet (min 0.01 ETH)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-green-400">3</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-white">Both Earn Bonus</span>
                <span className="text-sm font-bold text-green-400">0.05 ETH each</span>
              </div>
              <p className="text-xs text-gray-400">
                You get 0.05 ETH, they get 0.05 ETH (one-time, claimable immediately)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reputation Badges */}
      <div className="p-6">
        <h4 className="font-semibold text-white mb-4">Unlock Badges</h4>
        <div className="space-y-2">
          {[
            { badge: '🌱 New Member', referrals: 0, reward: 'Welcome badge', unlocked: true },
            { badge: '👥 Connector', referrals: 3, reward: '5% entry fee discount', unlocked: stats.totalReferrals >= 3 },
            { badge: '🎯 Ambassador', referrals: 10, reward: 'Early access to new markets', unlocked: stats.totalReferrals >= 10 },
            { badge: '💎 Founder', referrals: 25, reward: 'Exclusive Discord role', unlocked: stats.totalReferrals >= 25 },
          ].map((item) => (
            <div
              key={item.badge}
              className={`flex items-center justify-between p-3 rounded-lg ${
                item.unlocked
                  ? 'bg-cyan-500/20 border border-cyan-500/30'
                  : 'bg-gray-800/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`text-xl ${
                  item.unlocked ? 'opacity-100' : 'opacity-30'
                }`}>
                  {item.badge.split(' ')[0]}
                </div>
                <span className={`text-sm font-medium ${
                  item.unlocked ? 'text-white' : 'text-gray-400'
                }`}>
                  {item.badge}
                </span>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">
                  {item.referrals}+ invites
                </div>
                <div className={`text-xs font-medium ${
                  item.unlocked ? 'text-cyan-400' : 'text-gray-600'
                }`}>
                  {item.reward}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pending Bonuses */}
        {stats.pendingBonuses > 0 && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white font-medium">
                {stats.pendingBonuses} Pending Bonus{stats.pendingBonuses > 1 ? 'es' : ''}
              </span>
              <span className="text-sm text-green-400 font-bold">
                {(stats.pendingBonuses * BONUS_PER_REFERRAL).toFixed(2)} ETH
              </span>
            </div>
            <button className="w-full py-2 bg-green-500 hover:bg-green-400 text-white rounded-lg text-sm font-medium transition-all">
              Claim Bonuses
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
