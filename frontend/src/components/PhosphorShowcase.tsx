/**
 * Phosphor Icons Showcase
 * Beautiful icons with 6 weight variants
 */

import { useState } from 'react';
import {
  // Gaming & Competition
  Lightning, Trophy, Target, Sword, ShieldChevron, Crown, Medal, Star,
  Fire, Rocket, Sparkle, Diamond, Dice, GameController,

  // Crypto & Finance
  Coins, Wallet, TrendingUp, TrendingDown, ChartBar, CurrencyDollar,
  CurrencyBtc, CurrencyEth, CreditCard, Vault,

  // Status & Indicators
  Activity, Clock, CheckCircle, Warning, Info, XCircle,
  CircleNotch, Checks, WarningCircle, Circle,

  // Social & Community
  Users, User, Chat, ShareNetwork, Heart, ThumbsUp,
  UserPlus, UsersThree, ChatCircle, PaperPlaneTilt,

  // Navigation
  House, List, MagnifyingGlass, Gear, CaretRight, CaretDown,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, X as XIcon, Plus, Minus,

  // Actions
  Play, Pause, Check, Pencil, Trash, Copy, Download,
  Upload, FloppyDisk, Eye, EyeSlash, Lock, LockOpen,

  // Features
  Globe, Calendar, Bell, Bookmark, Funnel, SortAscending,
  GridFour, ListBullets, SquaresFour, FileText, Image as ImageIcon, Link,
} from '@phosphor-icons/react';

type WeightVariant = 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';

interface IconShowcaseProps {
  Icon: any;
  name: string;
  color: string;
  weight: WeightVariant;
  size?: number;
}

const IconDemo = ({ Icon, name, color, weight, size = 32 }: IconShowcaseProps) => (
  <div className="flex flex-col items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all hover:scale-105 cursor-pointer group">
    <Icon className={color} size={size} weight={weight} />
    <span className="text-xs text-gray-300 text-center font-medium">{name}</span>
  </div>
);

export default function PhosphorShowcase() {
  const [selectedWeight, setSelectedWeight] = useState<WeightVariant>('regular');

  const weights: WeightVariant[] = ['thin', 'light', 'regular', 'bold', 'fill', 'duotone'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkle size={40} weight="duotone" className="text-pink-400" />
            <h1 className="text-5xl font-bold text-white">Phosphor Icons</h1>
            <Sparkle size={40} weight="duotone" className="text-pink-400" />
          </div>
          <p className="text-xl text-gray-300 mb-4">
            7,800+ Beautiful Icons with 6 Weight Variants
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 rounded-lg">
            <Lightning size={20} weight="bold" className="text-white" />
            <span className="text-white font-semibold">Flexible • Beautiful • Versatile</span>
          </div>
        </div>

        {/* Weight Selector */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            🎨 Choose Your Style - 6 Weights
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            {weights.map((weight) => (
              <button
                key={weight}
                onClick={() => setSelectedWeight(weight)}
                className={`px-6 py-4 rounded-xl font-semibold transition-all ${
                  selectedWeight === weight
                    ? 'bg-purple-600 text-white scale-105 shadow-lg'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {weight.charAt(0).toUpperCase() + weight.slice(1)}
              </button>
            ))}
          </div>

          {/* Weight Comparison */}
          <div className="grid grid-cols-6 gap-4 p-6 bg-black/30 rounded-xl">
            <div className="flex flex-col items-center gap-2">
              <Lightning size={48} weight="thin" className="text-yellow-400" />
              <span className="text-xs text-gray-400">Thin</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Lightning size={48} weight="light" className="text-yellow-400" />
              <span className="text-xs text-gray-400">Light</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Lightning size={48} weight="regular" className="text-yellow-400" />
              <span className="text-xs text-gray-400">Regular</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Lightning size={48} weight="bold" className="text-yellow-400" />
              <span className="text-xs text-gray-400">Bold</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Lightning size={48} weight="fill" className="text-yellow-400" />
              <span className="text-xs text-gray-400">Fill</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Lightning size={48} weight="duotone" className="text-yellow-400" />
              <span className="text-xs text-gray-400">Duotone</span>
            </div>
          </div>
        </div>

        {/* Gaming & Competition */}
        <div className="mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-2">
              🎮 Gaming & Competition
            </h2>
            <p className="text-gray-300 mb-6">Perfect for arena, duels, and achievements</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
              <IconDemo Icon={Lightning} name="Lightning" color="text-blue-400" weight={selectedWeight} />
              <IconDemo Icon={Trophy} name="Trophy" color="text-yellow-400" weight={selectedWeight} />
              <IconDemo Icon={Target} name="Target" color="text-red-400" weight={selectedWeight} />
              <IconDemo Icon={Sword} name="Sword" color="text-purple-400" weight={selectedWeight} />
              <IconDemo Icon={ShieldChevron} name="Shield" color="text-green-400" weight={selectedWeight} />
              <IconDemo Icon={Crown} name="Crown" color="text-orange-400" weight={selectedWeight} />
              <IconDemo Icon={Medal} name="Medal" color="text-yellow-500" weight={selectedWeight} />
              <IconDemo Icon={Star} name="Star" color="text-yellow-300" weight={selectedWeight} />
              <IconDemo Icon={Fire} name="Fire" color="text-orange-500" weight={selectedWeight} />
              <IconDemo Icon={Rocket} name="Rocket" color="text-blue-500" weight={selectedWeight} />
              <IconDemo Icon={Sparkle} name="Sparkle" color="text-pink-400" weight={selectedWeight} />
              <IconDemo Icon={Diamond} name="Diamond" color="text-cyan-400" weight={selectedWeight} />
              <IconDemo Icon={Dice} name="Dice" color="text-indigo-400" weight={selectedWeight} />
              <IconDemo Icon={GameController} name="Game" color="text-violet-400" weight={selectedWeight} />
            </div>
          </div>
        </div>

        {/* Crypto & Finance */}
        <div className="mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-2">
              💰 Crypto & Finance
            </h2>
            <p className="text-gray-300 mb-6">For wallets, rewards, and transactions</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
              <IconDemo Icon={Coins} name="Coins" color="text-yellow-400" weight={selectedWeight} />
              <IconDemo Icon={Wallet} name="Wallet" color="text-blue-500" weight={selectedWeight} />
              <IconDemo Icon={TrendingUp} name="Trending Up" color="text-green-400" weight={selectedWeight} />
              <IconDemo Icon={TrendingDown} name="Trending Down" color="text-red-400" weight={selectedWeight} />
              <IconDemo Icon={ChartBar} name="Chart" color="text-purple-400" weight={selectedWeight} />
              <IconDemo Icon={CurrencyDollar} name="Dollar" color="text-green-500" weight={selectedWeight} />
              <IconDemo Icon={CurrencyBtc} name="Bitcoin" color="text-orange-400" weight={selectedWeight} />
              <IconDemo Icon={CurrencyEth} name="Ethereum" color="text-blue-400" weight={selectedWeight} />
              <IconDemo Icon={CreditCard} name="Card" color="text-blue-500" weight={selectedWeight} />
              <IconDemo Icon={Vault} name="Vault" color="text-gray-400" weight={selectedWeight} />
            </div>
          </div>
        </div>

        {/* Status & Indicators */}
        <div className="mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-2">
              📊 Status & Indicators
            </h2>
            <p className="text-gray-300 mb-6">Show prediction status and notifications</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
              <IconDemo Icon={Activity} name="Activity" color="text-green-400" weight={selectedWeight} />
              <IconDemo Icon={Clock} name="Clock" color="text-yellow-400" weight={selectedWeight} />
              <IconDemo Icon={CheckCircle} name="Check" color="text-green-500" weight={selectedWeight} />
              <IconDemo Icon={Warning} name="Warning" color="text-orange-400" weight={selectedWeight} />
              <IconDemo Icon={Info} name="Info" color="text-blue-400" weight={selectedWeight} />
              <IconDemo Icon={XCircle} name="X Circle" color="text-red-400" weight={selectedWeight} />
              <IconDemo Icon={CircleNotch} name="Loading" color="text-blue-500" weight={selectedWeight} />
              <IconDemo Icon={Checks} name="Checks" color="text-green-400" weight={selectedWeight} />
              <IconDemo Icon={WarningCircle} name="Alert" color="text-yellow-500" weight={selectedWeight} />
              <IconDemo Icon={Circle} name="Circle" color="text-purple-400" weight={selectedWeight} />
            </div>
          </div>
        </div>

        {/* Social & Community */}
        <div className="mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-2">
              👥 Social & Community
            </h2>
            <p className="text-gray-300 mb-6">User interactions and community features</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
              <IconDemo Icon={Users} name="Users" color="text-blue-400" weight={selectedWeight} />
              <IconDemo Icon={User} name="User" color="text-purple-400" weight={selectedWeight} />
              <IconDemo Icon={Chat} name="Chat" color="text-green-400" weight={selectedWeight} />
              <IconDemo Icon={ShareNetwork} name="Share" color="text-blue-500" weight={selectedWeight} />
              <IconDemo Icon={Heart} name="Heart" color="text-red-400" weight={selectedWeight} />
              <IconDemo Icon={ThumbsUp} name="Thumbs Up" color="text-green-500" weight={selectedWeight} />
              <IconDemo Icon={UserPlus} name="User Plus" color="text-blue-400" weight={selectedWeight} />
              <IconDemo Icon={UsersThree} name="Group" color="text-purple-500" weight={selectedWeight} />
              <IconDemo Icon={ChatCircle} name="Message" color="text-cyan-400" weight={selectedWeight} />
              <IconDemo Icon={PaperPlaneTilt} name="Send" color="text-blue-500" weight={selectedWeight} />
            </div>
          </div>
        </div>

        {/* Usage Example */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white mb-12">
          <h2 className="text-3xl font-bold mb-6">🚀 Quick Usage</h2>

          <div className="space-y-4">
            <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
              <div className="text-green-300">// Import icons</div>
              <div className="text-white">
                import {'{'} Lightning, Trophy, Target {'}'} from '@phosphor-icons/react';
              </div>
            </div>

            <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
              <div className="text-green-300">// Use with different weights</div>
              <div className="text-white">{'<Lightning size={32} weight="thin" />'}</div>
              <div className="text-white">{'<Lightning size={32} weight="light" />'}</div>
              <div className="text-white">{'<Lightning size={32} weight="regular" />'}</div>
              <div className="text-white">{'<Lightning size={32} weight="bold" />'}</div>
              <div className="text-white">{'<Lightning size={32} weight="fill" />'}</div>
              <div className="text-white">{'<Lightning size={32} weight="duotone" />'}</div>
            </div>

            <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
              <div className="text-green-300">// Customize with props</div>
              <div className="text-white">{'<Trophy size={48} weight="bold" color="#FFD700" />'}</div>
              <div className="text-white">{'<Target size={24} weight="duotone" className="text-red-500" />'}</div>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2 bg-black/30 px-4 py-3 rounded-lg">
                <Lightning size={32} weight="thin" className="text-blue-400" />
                <span className="text-sm">Thin</span>
              </div>
              <div className="flex items-center gap-2 bg-black/30 px-4 py-3 rounded-lg">
                <Trophy size={32} weight="fill" color="#FFD700" />
                <span className="text-sm">Fill</span>
              </div>
              <div className="flex items-center gap-2 bg-black/30 px-4 py-3 rounded-lg">
                <Target size={32} weight="duotone" className="text-red-400" />
                <span className="text-sm">Duotone</span>
              </div>
              <div className="flex items-center gap-2 bg-black/30 px-4 py-3 rounded-lg">
                <Fire size={32} weight="bold" className="text-orange-500" />
                <span className="text-sm">Bold</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6">✨ Why Phosphor Icons?</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🎨</div>
              <div>
                <h3 className="text-xl font-bold text-purple-300 mb-2">6 Weight Variants</h3>
                <p className="text-gray-300">
                  Thin, Light, Regular, Bold, Fill, and Duotone - perfect for any design need
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="text-4xl">⚡</div>
              <div>
                <h3 className="text-xl font-bold text-blue-300 mb-2">7,800+ Icons</h3>
                <p className="text-gray-300">
                  Massive library covering every use case imaginable
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="text-4xl">🎯</div>
              <div>
                <h3 className="text-xl font-bold text-green-300 mb-2">Optimized for React</h3>
                <p className="text-gray-300">
                  Built specifically for React with TypeScript support
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="text-4xl">💎</div>
              <div>
                <h3 className="text-xl font-bold text-pink-300 mb-2">Beautiful Design</h3>
                <p className="text-gray-300">
                  Unique, elegant aesthetic that stands out from generic icon sets
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-300 mb-4">
            Browse all 7,800+ icons at{' '}
            <a
              href="https://phosphoricons.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              phosphoricons.com
            </a>
          </p>
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <Sparkle size={16} weight="fill" />
            <span>Installed & Ready to Use</span>
            <Sparkle size={16} weight="fill" />
          </div>
        </div>
      </div>
    </div>
  );
}
