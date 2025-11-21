/**
 * Home Page - Ultra Premium Edition
 * Showcases CT Draft as the killer feature with premium design
 */

import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import {
  Trophy, Crown, Target, TrendUp, Fire, Sparkle,
  Users, CheckCircle, Lightning, Star
} from '@phosphor-icons/react';

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <div className="inline-block">
              <div className="text-8xl mb-6 animate-bounce-slow">🏆</div>
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent leading-tight">
            CT Fantasy League
          </h1>

          <p className="text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Draft crypto influencers, earn points from daily votes, and compete for glory in the ultimate CT competition
          </p>

          {/* Main CTA */}
          <Link
            to="/draft"
            className="inline-block group"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-all duration-300 animate-pulse" />

              {/* Button */}
              <button className="relative px-12 py-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-2xl font-bold text-2xl transition-all transform hover:scale-105 shadow-2xl shadow-cyan-500/30 flex items-center gap-3">
                <Crown size={32} weight="bold" />
                Start Drafting
                <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm">+50 XP</span>
              </button>
            </div>
          </Link>
        </div>

        {/* Stats Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl border-2 border-cyan-500/30 p-8 text-center transform hover:scale-105 transition-all shadow-2xl">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
              <Users size={40} weight="bold" className="text-white" />
            </div>
            <div className="text-5xl font-black text-cyan-400 mb-2">50</div>
            <div className="text-lg text-gray-300 font-semibold">CT Influencers</div>
            <div className="text-sm text-gray-500 mt-2">From all tiers</div>
          </div>

          <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl border-2 border-orange-500/30 p-8 text-center transform hover:scale-105 transition-all shadow-2xl">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mb-4 shadow-lg">
              <Target size={40} weight="bold" className="text-white" />
            </div>
            <div className="text-5xl font-black text-orange-400 mb-2">5</div>
            <div className="text-lg text-gray-300 font-semibold">Team Picks</div>
            <div className="text-sm text-gray-500 mt-2">Build your squad</div>
          </div>

          <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl border-2 border-yellow-500/30 p-8 text-center transform hover:scale-105 transition-all shadow-2xl">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl mb-4 shadow-lg">
              <Trophy size={40} weight="bold" className="text-white" />
            </div>
            <div className="text-5xl font-black text-yellow-400 mb-2">100</div>
            <div className="text-lg text-gray-300 font-semibold">Point Budget</div>
            <div className="text-sm text-gray-500 mt-2">Spend wisely</div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl border-2 border-gray-700/50 p-10 mb-16 shadow-2xl">
          <h2 className="text-4xl font-black text-white mb-8 text-center flex items-center justify-center gap-3">
            <Lightning size={40} weight="fill" className="text-yellow-400" />
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-xl opacity-50" />
                  <div className="relative w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-3xl font-black text-white shadow-2xl">
                    1
                  </div>
                </div>
                <div className="mb-4">
                  <Crown size={48} weight="fill" className="text-cyan-400 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">Draft Your Team</h3>
                <p className="text-gray-400 leading-relaxed">
                  Pick 5 CT influencers within your 100-point budget. Choose from Legendary, Epic, Rare, and Common tiers.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-xl opacity-50" />
                  <div className="relative w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-3xl font-black text-white shadow-2xl">
                    2
                  </div>
                </div>
                <div className="mb-4">
                  <Target size={48} weight="fill" className="text-orange-400 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">Vote Daily</h3>
                <p className="text-gray-400 leading-relaxed">
                  Vote for the best CT take of the day. Your influencers earn points when others vote for them.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="absolute -inset-2 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full blur-xl opacity-50" />
                  <div className="relative w-20 h-20 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center text-3xl font-black text-white shadow-2xl">
                    3
                  </div>
                </div>
                <div className="mb-4">
                  <Trophy size={48} weight="fill" className="text-yellow-400 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">Climb the Ranks</h3>
                <p className="text-gray-400 leading-relaxed">
                  Compete against other managers. Build the best team and dominate the leaderboard.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* Rarity System */}
          <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl border-2 border-gray-700/50 p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Sparkle size={32} weight="fill" className="text-purple-400" />
              <h3 className="text-2xl font-bold text-white">Rarity Tiers</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-400/20 via-yellow-500/20 to-amber-600/20 rounded-xl border border-yellow-500/30">
                <Crown size={24} weight="fill" className="text-yellow-400" />
                <div className="flex-1">
                  <div className="font-bold text-yellow-400">Legendary (S-Tier)</div>
                  <div className="text-sm text-gray-400">Top CT influencers</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-400/20 via-fuchsia-500/20 to-purple-600/20 rounded-xl border border-purple-500/30">
                <Sparkle size={24} weight="fill" className="text-purple-400" />
                <div className="flex-1">
                  <div className="font-bold text-purple-400">Epic (A-Tier)</div>
                  <div className="text-sm text-gray-400">High-tier performers</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-400/20 via-cyan-500/20 to-blue-600/20 rounded-xl border border-cyan-500/30">
                <Star size={24} weight="fill" className="text-cyan-400" />
                <div className="flex-1">
                  <div className="font-bold text-cyan-400">Rare (B-Tier)</div>
                  <div className="text-sm text-gray-400">Solid picks</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-400/20 via-gray-500/20 to-gray-600/20 rounded-xl border border-gray-500/30">
                <Fire size={24} weight="fill" className="text-gray-400" />
                <div className="flex-1">
                  <div className="font-bold text-gray-300">Common (C-Tier)</div>
                  <div className="text-sm text-gray-400">Budget-friendly</div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl border-2 border-gray-700/50 p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle size={32} weight="fill" className="text-green-400" />
              <h3 className="text-2xl font-bold text-white">Key Features</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle size={24} weight="fill" className="text-cyan-400 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-white mb-1">100-Point Budget System</div>
                  <div className="text-sm text-gray-400">Strategic team building with balanced costs</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={24} weight="fill" className="text-cyan-400 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-white mb-1">Live Scoring</div>
                  <div className="text-sm text-gray-400">Real-time updates as votes come in</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={24} weight="fill" className="text-cyan-400 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-white mb-1">XP & Progression</div>
                  <div className="text-sm text-gray-400">Earn rewards for team creation and daily votes</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={24} weight="fill" className="text-cyan-400 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-white mb-1">Flexible Team Management</div>
                  <div className="text-sm text-gray-400">Update your squad anytime before contests lock</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        {!isConnected && (
          <div className="bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 border-2 border-cyan-500/30 rounded-3xl p-12 text-center shadow-2xl">
            <Fire size={64} weight="fill" className="text-cyan-400 mx-auto mb-6" />
            <h2 className="text-4xl font-black text-white mb-4">Ready to Dominate?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Connect your wallet to start building your championship team
            </p>
            <div className="text-sm text-gray-400">
              👆 Click "Connect Wallet" in the top right to begin
            </div>
          </div>
        )}

        {isConnected && (
          <div className="bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-green-600/10 border-2 border-green-500/30 rounded-3xl p-12 text-center shadow-2xl">
            <TrendUp size={64} weight="fill" className="text-green-400 mx-auto mb-6" />
            <h2 className="text-4xl font-black text-white mb-4">You're All Set!</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Your wallet is connected. Time to draft your winning team.
            </p>
            <Link
              to="/draft"
              className="inline-block px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-2xl font-bold text-xl transition-all transform hover:scale-105 shadow-2xl shadow-green-500/30"
            >
              Go to Draft →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
