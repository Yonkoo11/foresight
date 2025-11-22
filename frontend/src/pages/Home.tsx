/**
 * Home Page
 * Landing page for CT Fantasy League
 */

import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import {
  Trophy, Target, TrendUp, CheckCircle, ArrowRight
} from '@phosphor-icons/react';

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />

      <div className="relative">
        {/* Hero Section */}
        <div className="container-narrow py-20 md:py-28">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-sm text-brand-400 font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              Live on Base
            </div>

            {/* Main headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-white mb-6 leading-tight">
              Fantasy league for
              <br />
              <span className="text-gradient-brand">Crypto Twitter</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Draft top CT influencers, earn points from community votes, and compete for rankings
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/draft" className="btn-primary btn-lg group">
                Start drafting
                <ArrowRight size={20} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
              </Link>

              <Link to="/vote" className="btn-secondary btn-lg">
                View leaderboard
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-gray-800 border-2 border-gray-950" />
                  <div className="w-7 h-7 rounded-full bg-gray-800 border-2 border-gray-950" />
                  <div className="w-7 h-7 rounded-full bg-gray-800 border-2 border-gray-950" />
                </div>
                <span>50 influencers</span>
              </div>
              <div className="h-4 w-px bg-gray-800" />
              <div>Active contests</div>
              <div className="h-4 w-px bg-gray-800" />
              <div>150 point budget</div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="container-app py-16 border-t border-gray-900">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat 1 */}
            <div className="card p-8">
              <div className="stat-card">
                <div className="stat-label">Influencers</div>
                <div className="stat-value">50</div>
                <p className="text-sm text-gray-400 mt-2">
                  Across all tier levels
                </p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="card p-8">
              <div className="stat-card">
                <div className="stat-label">Team size</div>
                <div className="stat-value">5</div>
                <p className="text-sm text-gray-400 mt-2">
                  Build your perfect squad
                </p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="card p-8">
              <div className="stat-card">
                <div className="stat-label">Budget</div>
                <div className="stat-value">150</div>
                <p className="text-sm text-gray-400 mt-2">
                  Points to spend wisely
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="container-narrow py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              How it works
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Three simple steps to start competing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400 font-semibold">
                    1
                  </div>
                  <h3 className="text-xl font-semibold text-white">Draft your team</h3>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  Select 5 influencers within your 150-point budget. Balance tier levels for optimal performance.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400 font-semibold">
                    2
                  </div>
                  <h3 className="text-xl font-semibold text-white">Vote daily</h3>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  Cast votes for top CT content. Your picks earn points when the community votes for them.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400 font-semibold">
                    3
                  </div>
                  <h3 className="text-xl font-semibold text-white">Climb rankings</h3>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  Compete against other managers. Track your position on the leaderboard each week.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="container-app py-20 border-t border-gray-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tier System */}
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center">
                  <Target size={20} className="text-accent-purple" />
                </div>
                <h3 className="text-xl font-semibold text-white">Tier system</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-800">
                  <span className="text-sm font-medium text-gray-300">S-Tier</span>
                  <span className="badge-warning">Legendary</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-800">
                  <span className="text-sm font-medium text-gray-300">A-Tier</span>
                  <span className="badge-primary">Epic</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-800">
                  <span className="text-sm font-medium text-gray-300">B-Tier</span>
                  <span className="badge-success">Rare</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-800">
                  <span className="text-sm font-medium text-gray-300">C-Tier</span>
                  <span className="badge-neutral">Common</span>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-accent-green/10 border border-accent-green/20 flex items-center justify-center">
                  <CheckCircle size={20} className="text-accent-green" />
                </div>
                <h3 className="text-xl font-semibold text-white">Features</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-brand-500 flex-shrink-0 mt-0.5" weight="fill" />
                  <div>
                    <div className="font-medium text-white text-sm mb-1">Budget strategy</div>
                    <div className="text-sm text-gray-400">150-point allocation system</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-brand-500 flex-shrink-0 mt-0.5" weight="fill" />
                  <div>
                    <div className="font-medium text-white text-sm mb-1">Real-time scoring</div>
                    <div className="text-sm text-gray-400">Live updates as votes roll in</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-brand-500 flex-shrink-0 mt-0.5" weight="fill" />
                  <div>
                    <div className="font-medium text-white text-sm mb-1">XP progression</div>
                    <div className="text-sm text-gray-400">Earn rewards for participation</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-brand-500 flex-shrink-0 mt-0.5" weight="fill" />
                  <div>
                    <div className="font-medium text-white text-sm mb-1">Team management</div>
                    <div className="text-sm text-gray-400">Update roster before lock</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="container-narrow py-20 border-t border-gray-900">
          {!isConnected ? (
            <div className="card-highlight p-12 text-center">
              <div className="w-14 h-14 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-6">
                <Trophy size={28} className="text-brand-400" weight="fill" />
              </div>
              <h2 className="text-3xl font-semibold text-white mb-4">
                Ready to start?
              </h2>
              <p className="text-lg text-gray-400 mb-8 max-w-md mx-auto">
                Connect your wallet to begin drafting your team
              </p>
              <p className="text-sm text-gray-500">
                Click "Connect Wallet" in the navigation to continue
              </p>
            </div>
          ) : (
            <div className="card p-12 text-center">
              <div className="w-14 h-14 rounded-xl bg-accent-green/10 border border-accent-green/20 flex items-center justify-center mx-auto mb-6">
                <TrendUp size={28} className="text-accent-green" weight="fill" />
              </div>
              <h2 className="text-3xl font-semibold text-white mb-4">
                You're all set
              </h2>
              <p className="text-lg text-gray-400 mb-8 max-w-md mx-auto">
                Your wallet is connected. Start building your team.
              </p>
              <Link to="/draft" className="btn-primary btn-lg inline-flex">
                Go to draft
                <ArrowRight size={20} weight="bold" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
