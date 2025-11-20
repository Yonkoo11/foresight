/**
 * Home Page
 * Landing page introducing CT league
 * Enhanced with smart hero banner
 */

import { Link } from 'react-router-dom';
import { SmartHeroBanner } from '../components/home/SmartHeroBanner';
import { ActivityFeed } from '../components/ActivityFeed';
import { DailyQuests } from '../components/DailyQuests';

export default function Home() {

  const apps = [
    {
      name: 'CT Draft',
      emoji: '🏆',
      description: 'Draft 5 crypto twitter influencers and compete for weekly prizes',
      path: '/draft',
      color: 'from-blue-500 to-cyan-500',
      features: ['0.05 ETH entry', 'Win up to 5 ETH', 'Weekly resets'],
      earnings: '💰 Top prize: 5 ETH/week',
    },
    {
      name: 'CT Whisperer',
      emoji: '🧠',
      description: 'Test your CT knowledge and win daily sponsored prizes',
      path: '/whisperer',
      color: 'from-purple-500 to-pink-500',
      features: ['Free to play', 'Sponsor prizes', 'Daily payouts'],
      earnings: '💰 Top score: ~0.75 ETH/day',
    },
    {
      name: 'Timecaster Arena',
      emoji: '⚔️',
      description: 'Win 1v1 prediction duels and earn from voting',
      path: '/arena',
      color: 'from-orange-500 to-red-500',
      features: ['Stake & win 95%', 'Vote to earn', '10x ROI potential'],
      earnings: '💰 Win duels + voting fees',
    },
    {
      name: 'Daily Gauntlet',
      emoji: '🎯',
      description: 'Make 5 daily predictions and win proportional rewards',
      path: '/gauntlet',
      color: 'from-green-500 to-emerald-500',
      features: ['0.05 ETH entry', '5-40x returns', 'Daily payouts'],
      earnings: '💰 Perfect score: 2-5 ETH',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Smart Hero Banner - Adapts to user state */}
      <SmartHeroBanner />

      {/* Earnings Banner */}
      <div className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-cyan-500/10 border border-green-500/30 rounded-xl p-6 sm:p-8 mb-8">
        <div className="text-center">
          <h2 className="heading-2 mb-3 text-gradient-green-emerald">
            Play. Predict. Profit.
          </h2>
          <p className="body-base mb-6 max-w-2xl mx-auto">
            Multiple ways to earn ETH through crypto predictions and CT knowledge
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700/50 hover:border-green-500/30 transition-all">
              <div className="stat-value text-green-400 mb-1">5 ETH</div>
              <div className="stat-label">Weekly in Draft</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700/50 hover:border-purple-500/30 transition-all">
              <div className="stat-value text-purple-400 mb-1">0.75 ETH</div>
              <div className="stat-label">Daily in Whisperer</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700/50 hover:border-orange-500/30 transition-all">
              <div className="stat-value text-orange-400 mb-1">10x ROI</div>
              <div className="stat-label">Arena Duels</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700/50 hover:border-cyan-500/30 transition-all">
              <div className="stat-value text-cyan-400 mb-1">40x</div>
              <div className="stat-label">Daily Gauntlet</div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Quests */}
      <div className="mb-10">
        <DailyQuests />
      </div>

      {/* Game Modes Section */}
      <div className="mb-8">
        <h2 className="section-heading justify-center mb-2">
          Choose Your Earning Strategy
        </h2>
        <p className="section-subtitle text-center mx-auto">
          Each game offers unique ways to make money from your crypto knowledge
        </p>
      </div>

      {/* Apps Grid - Enhanced with better typography */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-10">
        {apps.map((app) => (
          <Link
            key={app.path}
            to={app.path}
            className="bg-gray-800/50 rounded-xl p-6 hover:bg-gray-800 transition-all duration-300 border border-gray-700 hover:border-gray-600 hover:shadow-xl hover:shadow-cyan-500/10 group"
          >
            <div className="flex items-start space-x-4 mb-4">
              <div className="text-4xl transform group-hover:scale-110 transition-transform duration-300">{app.emoji}</div>
              <div className="flex-1">
                <h3 className="card-title mb-2 group-hover:text-gradient-cyan-blue transition-all">
                  {app.name}
                </h3>
                <p className="body-small mb-3 leading-relaxed">{app.description}</p>
                <div className="text-success flex items-center gap-1 text-sm font-semibold">
                  {app.earnings}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {app.features.map((feature) => (
                <span
                  key={feature}
                  className="body-tiny px-3 py-1 bg-gray-900/70 border border-gray-700/50 rounded-full"
                >
                  {feature}
                </span>
              ))}
            </div>
            <div
              className={`body-small font-semibold bg-gradient-to-r ${app.color} bg-clip-text text-transparent flex items-center gap-2 group-hover:gap-3 transition-all`}
            >
              Start Earning
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Live Activity Feed */}
      <div className="mb-10">
        <ActivityFeed limit={8} />
      </div>

      {/* Unified Reputation System - Compact */}
      <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-6 mb-10">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Unified Reputation System
          </h3>
          <p className="text-sm text-gray-400">
            All games contribute to your CT Mastery Score
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-800/30 rounded-lg p-3 text-center">
            <div className="text-base-blue font-bold text-sm mb-0.5">30%</div>
            <div className="text-xs text-gray-500">Draft</div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-3 text-center">
            <div className="text-purple-400 font-bold text-sm mb-0.5">30%</div>
            <div className="text-xs text-gray-500">CT IQ</div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-3 text-center">
            <div className="text-pink-400 font-bold text-sm mb-0.5">40%</div>
            <div className="text-xs text-gray-500">Timecaster</div>
          </div>
        </div>
      </div>

      {/* How It Works - Compact */}
      <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4 text-center text-gray-300">How It Works</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-10 h-10 bg-cyan-500/20 border border-cyan-500/50 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold text-cyan-400">
              1
            </div>
            <h4 className="text-sm font-semibold mb-1">Connect</h4>
            <p className="text-xs text-gray-500">
              Sign in
            </p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-cyan-500/20 border border-cyan-500/50 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold text-cyan-400">
              2
            </div>
            <h4 className="text-sm font-semibold mb-1">Play</h4>
            <p className="text-xs text-gray-500">
              Choose mode
            </p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-cyan-500/20 border border-cyan-500/50 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold text-cyan-400">
              3
            </div>
            <h4 className="text-sm font-semibold mb-1">Build</h4>
            <p className="text-xs text-gray-500">
              Earn reputation
            </p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-cyan-500/20 border border-cyan-500/50 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold text-cyan-400">
              4
            </div>
            <h4 className="text-sm font-semibold mb-1">Win</h4>
            <p className="text-xs text-gray-500">
              Climb ranks
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
