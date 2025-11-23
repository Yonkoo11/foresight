import { useState } from 'react';
import ShareCard from '../components/ShareCard';

const ShareCardDemo = () => {
  const [selectedCard, setSelectedCard] = useState<'achievement' | 'score' | 'rank'>('achievement');

  const achievementData = {
    icon: '💎',
    title: 'few understand',
    subtitle: 'drafted a perfect team',
    username: 'anon',
  };

  const scoreData = {
    title: 'Week 47',
    stats: '247 pts • #12 overall',
    subtitle: 'Team: Diamond Hands • 5/5 picks scored 20+',
    username: 'anon',
  };

  const rankData = {
    title: 'Rank Up',
    subtitle: 'anon → degen',
    stats: '1,247 XP',
    username: 'anon',
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Share Card Prototype
          </h1>
          <p className="text-gray-400">
            Preview how achievements, scores, and rank-ups will look when shared to Twitter
          </p>
        </div>

        {/* Card Type Selector */}
        <div className="flex justify-center gap-3 mb-12">
          <button
            onClick={() => setSelectedCard('achievement')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              selectedCard === 'achievement'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/25'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Achievement
          </button>
          <button
            onClick={() => setSelectedCard('score')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              selectedCard === 'score'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/25'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Weekly Score
          </button>
          <button
            onClick={() => setSelectedCard('rank')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              selectedCard === 'rank'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/25'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Rank Up
          </button>
        </div>

        {/* Share Card Preview */}
        <div className="flex justify-center bg-gradient-to-b from-gray-900/30 to-transparent rounded-2xl p-12 border border-gray-800/30">
          {selectedCard === 'achievement' && (
            <ShareCard type="achievement" data={achievementData} />
          )}
          {selectedCard === 'score' && (
            <ShareCard type="score" data={scoreData} />
          )}
          {selectedCard === 'rank' && (
            <ShareCard type="rank" data={rankData} />
          )}
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-gray-900/50 rounded-xl p-8 border border-gray-800">
          <h2 className="text-xl font-semibold text-white mb-4">How This Works</h2>
          <div className="space-y-3 text-gray-400 text-sm">
            <p>
              <strong className="text-white">Current Demo:</strong> Shows HTML/CSS version of the cards with Twitter share intent
            </p>
            <p>
              <strong className="text-white">Next Step:</strong> Convert these to actual images using Canvas API or Satori for proper Twitter card previews
            </p>
            <p>
              <strong className="text-white">Design Philosophy:</strong> Minimal, understated, factual. No cringe. Just clean flex.
            </p>
          </div>
        </div>

        {/* Example Achievements */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">Proposed Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: '💎', name: 'few understand', desc: 'drafted a perfect team' },
              { icon: '🔥', name: 'gm streak', desc: '30 days in a row' },
              { icon: '📈', name: 'diamond hands', desc: 'kept same team 4 weeks' },
              { icon: '🎯', name: 'sent it', desc: 'all budget on S-tier' },
              { icon: '🌙', name: 'to the moon', desc: 'scored 200+ in a week' },
              { icon: '⚡', name: 'degen mode', desc: 'risky draft paid off' },
            ].map((achievement) => (
              <div
                key={achievement.name}
                className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 flex items-center gap-4"
              >
                <div className="text-3xl">{achievement.icon}</div>
                <div>
                  <div className="text-white font-medium">{achievement.name}</div>
                  <div className="text-gray-500 text-sm">{achievement.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareCardDemo;
