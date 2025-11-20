/**
 * Earn Page
 * Central hub for all earning opportunities
 * Referrals, Share-to-Earn, Bonuses, and Rewards
 */

import { ShareToEarn } from '../components/ShareToEarn';
import { ReferralSystem } from '../components/ReferralSystem';
import { useAccount } from 'wagmi';

export default function Earn() {
  const { address } = useAccount();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          Rewards & Bonuses
        </h1>
        <p className="text-gray-400">
          Invite friends, share wins, and earn one-time bonuses
        </p>
      </div>

      {!address ? (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-12 text-center">
          <div className="text-6xl mb-4">💰</div>
          <h2 className="text-2xl font-bold mb-4">Connect to Start Earning</h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Connect your wallet to access referral links, share rewards, and bonus opportunities.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Total Earnings Summary */}
          <div className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-cyan-500/10 border border-green-500/30 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">0.25 ETH</div>
                <div className="text-sm text-gray-400">Referral Bonuses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-1">7</div>
                <div className="text-sm text-gray-400">Friends Invited</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-1">5</div>
                <div className="text-sm text-gray-400">Bonuses Claimed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-1">2</div>
                <div className="text-sm text-gray-400">Pending</div>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Referral System */}
            <div>
              <ReferralSystem />
            </div>

            {/* Share to Earn */}
            <div>
              <ShareToEarn />
            </div>
          </div>

          {/* Additional Earning Opportunities */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-white">Additional Rewards</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800/30 rounded-lg p-4">
                <div className="text-2xl mb-2">🏆</div>
                <h4 className="font-semibold text-white mb-2">Monthly Champions</h4>
                <p className="text-xs text-gray-400 mb-3">
                  Top performers in Arena and Gauntlet win prizes from treasury
                </p>
                <div className="text-xs text-cyan-400 font-bold">Compete on leaderboard</div>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4">
                <div className="text-2xl mb-2">🎯</div>
                <h4 className="font-semibold text-white mb-2">Achievement Badges</h4>
                <p className="text-xs text-gray-400 mb-3">
                  Unlock special badges for predictions, streaks, and community activity
                </p>
                <div className="text-xs text-purple-400 font-bold">Earn reputation rewards</div>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4">
                <div className="text-2xl mb-2">🐦</div>
                <h4 className="font-semibold text-white mb-2">Share & Earn</h4>
                <p className="text-xs text-gray-400 mb-3">
                  Post your wins on Twitter to unlock bonus rewards
                </p>
                <div className="text-xs text-green-400 font-bold">Up to 0.05 ETH in bonuses</div>
              </div>
            </div>
          </div>

          {/* Pro Tips */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
              <span>💡</span> Tips for Success
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-green-400 flex-shrink-0">✓</span>
                <p className="text-gray-300">
                  <strong>Share authentic wins</strong> - Post your real predictions to build credibility
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400 flex-shrink-0">✓</span>
                <p className="text-gray-300">
                  <strong>Focus on skill</strong> - Master the games to climb leaderboards and win prizes
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400 flex-shrink-0">✓</span>
                <p className="text-gray-300">
                  <strong>Build reputation</strong> - Consistent performance earns badges and unlocks perks
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400 flex-shrink-0">✓</span>
                <p className="text-gray-300">
                  <strong>Stay active</strong> - Daily participation improves your CT Mastery Score
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
