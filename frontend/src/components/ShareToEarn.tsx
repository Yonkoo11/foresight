/**
 * Share-to-Earn Component
 * Incentivizes users to share their wins on Twitter
 * Unlocks rewards and bonus entries
 */

import { useState } from 'react';
import { useAccount } from 'wagmi';

interface ShareReward {
  id: string;
  title: string;
  description: string;
  reward: string;
  completed: boolean;
  shareUrl: string;
  tweetText: string;
}

export function ShareToEarn() {
  const { address } = useAccount();
  const [rewards, setRewards] = useState<ShareReward[]>([
    {
      id: 'first-win',
      title: 'Share Your First Win',
      description: 'Tweet about your first prediction win',
      reward: '0.01 ETH bonus',
      completed: false,
      shareUrl: 'https://timecaster.xyz',
      tweetText: 'Just won my first prediction on @Timecaster! 🎯\n\nTest your crypto knowledge onchain.\n\nJoin me: timecaster.xyz',
    },
    {
      id: 'weekly-share',
      title: 'Share This Week',
      description: 'Post your weekly performance',
      reward: '5% entry discount',
      completed: false,
      shareUrl: 'https://timecaster.xyz',
      tweetText: 'My week on @Timecaster:\n\n🏆 CT Draft: Rank #42\n🧠 Whisperer: 87% accuracy\n⚔️ Arena: 8-2 record\n🎯 Gauntlet: 4.2/5 avg\n\nPrediction gaming is the future.\n\ntimecaster.xyz',
    },
    {
      id: 'referral-share',
      title: 'Invite 3 Friends',
      description: 'Share your referral link and get 3 signups',
      reward: '0.05 ETH bonus',
      completed: false,
      shareUrl: `https://timecaster.xyz/ref/${address?.slice(0, 10)}`,
      tweetText: `Just won predicting crypto on @Timecaster! 🎯\n\nIf you know CT, test your skills.\n\nJoin me: timecaster.xyz/ref/${address?.slice(0, 10)}`,
    },
    {
      id: 'big-win',
      title: 'Share a Big Win',
      description: 'Tweet about a major prediction win',
      reward: '0.02 ETH bonus',
      completed: false,
      shareUrl: 'https://timecaster.xyz',
      tweetText: '🎯 Perfect prediction on @Timecaster!\n\nTesting my CT knowledge onchain.\n\nPlay: timecaster.xyz',
    },
  ]);

  const handleShare = (reward: ShareReward) => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(reward.tweetText)}&url=${encodeURIComponent(reward.shareUrl)}`;
    window.open(tweetUrl, '_blank', 'width=550,height=420');

    // Mark as completed (in production, verify via Twitter API or smart contract)
    setTimeout(() => {
      setRewards(prev =>
        prev.map(r => r.id === reward.id ? { ...r, completed: true } : r)
      );
    }, 2000);
  };

  const completedCount = rewards.filter(r => r.completed).length;
  const totalRewards = rewards.length;

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐦</span>
            <h3 className="font-bold text-white">Share to Earn</h3>
          </div>
          <div className="text-xs px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30 font-medium">
            {completedCount}/{totalRewards} completed
          </div>
        </div>
        <p className="text-xs text-gray-400">
          Share on Twitter to unlock rewards and bonuses
        </p>
      </div>

      {/* Rewards List */}
      <div className="divide-y divide-gray-800">
        {rewards.map((reward) => (
          <div
            key={reward.id}
            className={`p-4 transition-all ${
              reward.completed
                ? 'bg-green-500/5'
                : 'hover:bg-gray-800/30'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Checkbox */}
              <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                reward.completed
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-600'
              }`}>
                {reward.completed && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-white text-sm">{reward.title}</h4>
                  <span className="text-xs px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded border border-orange-500/30 font-bold">
                    {reward.reward}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-3">{reward.description}</p>

                {!reward.completed && (
                  <button
                    onClick={() => handleShare(reward)}
                    disabled={!address}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white rounded-lg text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                    Share on Twitter
                  </button>
                )}

                {reward.completed && (
                  <div className="flex items-center gap-2 text-xs text-green-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Reward claimed!
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-gray-700 bg-gray-900/50">
        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          <div>
            <div className="text-cyan-400 font-bold mb-1">📈 Reach</div>
            <div className="text-gray-500">2,341 views</div>
          </div>
          <div>
            <div className="text-purple-400 font-bold mb-1">👥 Referrals</div>
            <div className="text-gray-500">7 signups</div>
          </div>
          <div>
            <div className="text-green-400 font-bold mb-1">💰 Earned</div>
            <div className="text-gray-500">0.05 ETH</div>
          </div>
        </div>
      </div>
    </div>
  );
}
