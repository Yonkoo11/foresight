import { useRef } from 'react';

interface ShareCardProps {
  type: 'achievement' | 'score' | 'rank';
  data: {
    icon?: string;
    title: string;
    subtitle?: string;
    username: string;
    stats?: string;
  };
}

const ShareCard = ({ type, data }: ShareCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShare = () => {
    const text = type === 'achievement'
      ? `just unlocked "${data.title}" on @ForesightCT ${data.icon || ''}`
      : type === 'score'
      ? `week results\n${data.stats}\n\n@ForesightCT`
      : `${data.title}\n\n@ForesightCT`;

    const url = 'https://foresight.ct';
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;

    window.open(tweetUrl, '_blank', 'width=550,height=420');
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Share Card */}
      <div
        ref={cardRef}
        className="relative w-[600px] h-[315px] rounded-xl overflow-hidden flex flex-col items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), inset 0 0 0 1px rgba(6, 182, 212, 0.1)',
        }}
      >
        {/* Animated gradient orbs in background */}
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute top-0 left-1/4 w-64 h-64 rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)',
            }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
            }}
          />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        {/* Achievement Card */}
        {type === 'achievement' && (
          <div className="relative flex flex-col items-center gap-6 px-8 text-center z-10">
            {/* Icon with glow */}
            <div className="relative">
              <div className="absolute inset-0 blur-2xl opacity-50" style={{ transform: 'scale(1.5)' }}>
                {data.icon || '💎'}
              </div>
              <div className="text-8xl relative">{data.icon || '💎'}</div>
            </div>

            {/* Title with glow effect */}
            <div className="space-y-3">
              <h2
                className="text-4xl font-bold text-white tracking-tight"
                style={{
                  textShadow: '0 0 30px rgba(6, 182, 212, 0.3), 0 0 60px rgba(6, 182, 212, 0.1)',
                }}
              >
                {data.title}
              </h2>
              {data.subtitle && (
                <p className="text-xl text-gray-300 font-light">
                  {data.subtitle}
                </p>
              )}
            </div>

            {/* Divider line */}
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

            {/* Username */}
            <div className="text-gray-400 text-sm tracking-wide">
              @{data.username} • Foresight
            </div>
          </div>
        )}

        {/* Score Card */}
        {type === 'score' && (
          <div className="relative flex flex-col items-center gap-6 px-8 text-center z-10">
            <div className="space-y-5">
              <div className="text-cyan-400/80 uppercase tracking-widest text-xs font-semibold">
                {data.title}
              </div>
              <div className="space-y-2">
                <div
                  className="text-7xl font-black text-white"
                  style={{
                    textShadow: '0 0 40px rgba(6, 182, 212, 0.4), 0 0 80px rgba(6, 182, 212, 0.2)',
                    background: 'linear-gradient(to bottom, #ffffff 0%, #e0e0e0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {data.stats?.split('•')[0]?.trim() || '247 pts'}
                </div>
                <div className="text-2xl text-cyan-400 font-semibold">
                  {data.stats?.split('•')[1]?.trim() || '#12 overall'}
                </div>
              </div>
            </div>
            {data.subtitle && (
              <div className="text-gray-400 text-sm max-w-md font-light">
                {data.subtitle}
              </div>
            )}
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mt-2" />
            <div className="text-gray-500 text-xs tracking-wide">
              @{data.username} • foresight.ct
            </div>
          </div>
        )}

        {/* Rank Card */}
        {type === 'rank' && (
          <div className="relative flex flex-col items-center gap-8 px-8 text-center z-10">
            {/* Rank progression */}
            <div className="flex items-center gap-6 text-4xl">
              <span className="text-gray-500/60 font-light">{data.subtitle?.split('→')[0]?.trim() || 'anon'}</span>
              <div className="flex flex-col items-center gap-1">
                <span className="text-cyan-400 text-2xl">→</span>
                <div className="w-12 h-px bg-gradient-to-r from-gray-600 via-cyan-500 to-cyan-400" />
              </div>
              <span
                className="text-white font-bold"
                style={{
                  textShadow: '0 0 30px rgba(6, 182, 212, 0.5)',
                }}
              >
                {data.subtitle?.split('→')[1]?.trim() || 'degen'}
              </span>
            </div>

            {/* Badge/pill for new rank */}
            <div className="px-6 py-2 rounded-full bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30">
              <span className="text-cyan-400 font-semibold text-sm tracking-wide">
                RANK UP
              </span>
            </div>

            <div className="space-y-2">
              <div className="text-gray-300 text-lg">@{data.username}</div>
              {data.stats && (
                <div className="text-cyan-400/60 text-sm font-mono">{data.stats}</div>
              )}
            </div>

            <div className="text-gray-600 text-xs tracking-wider">foresight.ct</div>
          </div>
        )}

        {/* Subtle branding watermark with glow */}
        <div
          className="absolute bottom-4 right-6 text-[10px] text-gray-600 uppercase tracking-widest font-semibold z-20"
          style={{
            textShadow: '0 0 10px rgba(6, 182, 212, 0.2)',
          }}
        >
          Foresight
        </div>

        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <div className="absolute top-4 right-4 w-16 h-px bg-gradient-to-l from-cyan-500 to-transparent" />
          <div className="absolute top-4 right-4 w-px h-16 bg-gradient-to-b from-cyan-500 to-transparent" />
        </div>
      </div>

      {/* Share Button */}
      <button
        onClick={handleShare}
        className="px-6 py-2.5 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
        Share to Twitter
      </button>

      {/* Helper text */}
      <p className="text-xs text-gray-500 text-center max-w-md">
        Click to preview the tweet. The card design shows what users will see when shared.
      </p>
    </div>
  );
};

export default ShareCard;
