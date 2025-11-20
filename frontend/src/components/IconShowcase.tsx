/**
 * Icon Showcase Component
 * Demonstrates all available Lucide icons for Timecaster
 */

import {
  // Gaming & Competition
  Zap, Trophy, Target, Sword, Shield, Crown, Award, Medal, Star,
  Flame, Rocket, Sparkles, Gem, Dices, Gamepad2,

  // Crypto & Finance
  Coins, Wallet, TrendingUp, TrendingDown, BarChart3, DollarSign,
  Bitcoin, Banknote, CreditCard, PiggyBank,

  // Status & Indicators
  Activity, Clock, CheckCircle, AlertCircle, Info, XCircle,
  Loader2, CheckCheck, AlertTriangle, CircleDot,

  // Social & Community
  Users, User, MessageCircle, Share2, Heart, ThumbsUp,
  UserPlus, Users2, MessageSquare, Send,

  // Navigation
  Home, Menu, Search, Settings, ChevronRight, ChevronDown,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, X as XIcon, Plus, Minus,

  // Actions
  Play, Pause, Check, Edit, Trash2, Copy, Download,
  Upload, Save, Eye, EyeOff, Lock, Unlock,

  // Features
  Globe, Calendar, Bell, Bookmark, Filter, SortAsc,
  LayoutGrid, List, Grid3X3, FileText, Image, Link2
} from 'lucide-react';

interface IconSection {
  title: string;
  description: string;
  icons: {
    Icon: any;
    name: string;
    color: string;
  }[];
}

const iconSections: IconSection[] = [
  {
    title: '🎮 Gaming & Competition',
    description: 'Perfect for arena, duels, and achievements',
    icons: [
      { Icon: Zap, name: 'Zap', color: 'text-blue-500' },
      { Icon: Trophy, name: 'Trophy', color: 'text-yellow-500' },
      { Icon: Target, name: 'Target', color: 'text-red-500' },
      { Icon: Sword, name: 'Sword', color: 'text-purple-500' },
      { Icon: Shield, name: 'Shield', color: 'text-green-500' },
      { Icon: Crown, name: 'Crown', color: 'text-orange-500' },
      { Icon: Award, name: 'Award', color: 'text-pink-500' },
      { Icon: Medal, name: 'Medal', color: 'text-yellow-600' },
      { Icon: Star, name: 'Star', color: 'text-yellow-400' },
      { Icon: Flame, name: 'Flame', color: 'text-orange-600' },
      { Icon: Rocket, name: 'Rocket', color: 'text-blue-600' },
      { Icon: Sparkles, name: 'Sparkles', color: 'text-purple-400' },
      { Icon: Gem, name: 'Gem', color: 'text-cyan-500' },
      { Icon: Dices, name: 'Dices', color: 'text-indigo-500' },
      { Icon: Gamepad2, name: 'Gamepad', color: 'text-violet-500' },
    ],
  },
  {
    title: '💰 Crypto & Finance',
    description: 'For wallets, rewards, and transactions',
    icons: [
      { Icon: Coins, name: 'Coins', color: 'text-yellow-500' },
      { Icon: Wallet, name: 'Wallet', color: 'text-blue-600' },
      { Icon: TrendingUp, name: 'Trending Up', color: 'text-green-500' },
      { Icon: TrendingDown, name: 'Trending Down', color: 'text-red-500' },
      { Icon: BarChart3, name: 'Bar Chart', color: 'text-purple-500' },
      { Icon: DollarSign, name: 'Dollar Sign', color: 'text-green-600' },
      { Icon: Bitcoin, name: 'Bitcoin', color: 'text-orange-500' },
      { Icon: Banknote, name: 'Banknote', color: 'text-emerald-500' },
      { Icon: CreditCard, name: 'Credit Card', color: 'text-blue-500' },
      { Icon: PiggyBank, name: 'Piggy Bank', color: 'text-pink-500' },
    ],
  },
  {
    title: '📊 Status & Indicators',
    description: 'Show prediction status and notifications',
    icons: [
      { Icon: Activity, name: 'Activity', color: 'text-green-500' },
      { Icon: Clock, name: 'Clock', color: 'text-yellow-500' },
      { Icon: CheckCircle, name: 'Check Circle', color: 'text-green-600' },
      { Icon: AlertCircle, name: 'Alert Circle', color: 'text-orange-500' },
      { Icon: Info, name: 'Info', color: 'text-blue-500' },
      { Icon: XCircle, name: 'X Circle', color: 'text-red-500' },
      { Icon: Loader2, name: 'Loader', color: 'text-blue-600' },
      { Icon: CheckCheck, name: 'Check Check', color: 'text-green-500' },
      { Icon: AlertTriangle, name: 'Alert Triangle', color: 'text-yellow-600' },
      { Icon: CircleDot, name: 'Circle Dot', color: 'text-purple-500' },
    ],
  },
  {
    title: '👥 Social & Community',
    description: 'User interactions and community features',
    icons: [
      { Icon: Users, name: 'Users', color: 'text-blue-500' },
      { Icon: User, name: 'User', color: 'text-purple-500' },
      { Icon: MessageCircle, name: 'Message Circle', color: 'text-green-500' },
      { Icon: Share2, name: 'Share', color: 'text-blue-600' },
      { Icon: Heart, name: 'Heart', color: 'text-red-500' },
      { Icon: ThumbsUp, name: 'Thumbs Up', color: 'text-green-600' },
      { Icon: UserPlus, name: 'User Plus', color: 'text-blue-500' },
      { Icon: Users2, name: 'Users Group', color: 'text-purple-600' },
      { Icon: MessageSquare, name: 'Message Square', color: 'text-cyan-500' },
      { Icon: Send, name: 'Send', color: 'text-blue-600' },
    ],
  },
  {
    title: '🧭 Navigation',
    description: 'Menu items and directional icons',
    icons: [
      { Icon: Home, name: 'Home', color: 'text-blue-500' },
      { Icon: Menu, name: 'Menu', color: 'text-gray-700' },
      { Icon: Search, name: 'Search', color: 'text-purple-500' },
      { Icon: Settings, name: 'Settings', color: 'text-gray-600' },
      { Icon: ChevronRight, name: 'Chevron Right', color: 'text-blue-600' },
      { Icon: ChevronDown, name: 'Chevron Down', color: 'text-blue-600' },
      { Icon: ArrowRight, name: 'Arrow Right', color: 'text-green-500' },
      { Icon: ArrowLeft, name: 'Arrow Left', color: 'text-red-500' },
      { Icon: ArrowUp, name: 'Arrow Up', color: 'text-green-600' },
      { Icon: ArrowDown, name: 'Arrow Down', color: 'text-red-600' },
      { Icon: XIcon, name: 'X', color: 'text-red-500' },
      { Icon: Plus, name: 'Plus', color: 'text-green-500' },
      { Icon: Minus, name: 'Minus', color: 'text-orange-500' },
    ],
  },
  {
    title: '⚡ Actions',
    description: 'Interactive buttons and controls',
    icons: [
      { Icon: Play, name: 'Play', color: 'text-green-500' },
      { Icon: Pause, name: 'Pause', color: 'text-yellow-500' },
      { Icon: Check, name: 'Check', color: 'text-green-600' },
      { Icon: Edit, name: 'Edit', color: 'text-blue-500' },
      { Icon: Trash2, name: 'Trash', color: 'text-red-500' },
      { Icon: Copy, name: 'Copy', color: 'text-purple-500' },
      { Icon: Download, name: 'Download', color: 'text-blue-600' },
      { Icon: Upload, name: 'Upload', color: 'text-green-600' },
      { Icon: Save, name: 'Save', color: 'text-blue-500' },
      { Icon: Eye, name: 'Eye', color: 'text-gray-600' },
      { Icon: EyeOff, name: 'Eye Off', color: 'text-gray-500' },
      { Icon: Lock, name: 'Lock', color: 'text-red-600' },
      { Icon: Unlock, name: 'Unlock', color: 'text-green-600' },
    ],
  },
  {
    title: '🎯 Features',
    description: 'Additional utility icons',
    icons: [
      { Icon: Globe, name: 'Globe', color: 'text-blue-500' },
      { Icon: Calendar, name: 'Calendar', color: 'text-purple-500' },
      { Icon: Bell, name: 'Bell', color: 'text-yellow-600' },
      { Icon: Bookmark, name: 'Bookmark', color: 'text-blue-600' },
      { Icon: Filter, name: 'Filter', color: 'text-gray-600' },
      { Icon: SortAsc, name: 'Sort', color: 'text-gray-700' },
      { Icon: LayoutGrid, name: 'Grid', color: 'text-purple-600' },
      { Icon: List, name: 'List', color: 'text-blue-500' },
      { Icon: Grid3X3, name: 'Grid 3x3', color: 'text-cyan-500' },
      { Icon: FileText, name: 'File Text', color: 'text-gray-600' },
      { Icon: Image, name: 'Image', color: 'text-pink-500' },
      { Icon: Link2, name: 'Link', color: 'text-blue-600' },
    ],
  },
];

export default function IconShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-yellow-400" />
            <h1 className="text-5xl font-bold text-white">Icon Showcase</h1>
            <Sparkles className="w-10 h-10 text-yellow-400" />
          </div>
          <p className="text-xl text-gray-300">
            Lucide React Icons - 100+ icons ready to use
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg">
            <Zap className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">Tree-shakeable • Customizable • Optimized</span>
          </div>
        </div>

        {/* Icon Sections */}
        {iconSections.map((section, idx) => (
          <div key={idx} className="mb-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-2">
                {section.title}
              </h2>
              <p className="text-gray-300 mb-6">{section.description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                {section.icons.map(({ Icon, name, color }) => (
                  <div
                    key={name}
                    className="flex flex-col items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all hover:scale-105 cursor-pointer group"
                  >
                    <Icon className={`w-12 h-12 ${color} group-hover:scale-110 transition-transform`} />
                    <span className="text-sm text-gray-300 text-center font-medium">
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Usage Examples */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-6">🚀 Quick Usage</h2>

          <div className="space-y-4">
            <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
              <div className="text-green-400">// Import icons</div>
              <div className="text-white">
                import {'{'} Zap, Trophy, Target {'}'} from 'lucide-react';
              </div>
            </div>

            <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
              <div className="text-green-400">// Use in components</div>
              <div className="text-white">
                {'<Zap className="w-6 h-6 text-blue-500" />'}
              </div>
              <div className="text-white">
                {'<Trophy size={24} color="#FFD700" />'}
              </div>
              <div className="text-white">
                {'<Target strokeWidth={1.5} className="w-8 h-8" />'}
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-lg">
                <Zap className="w-6 h-6 text-blue-500" />
                <span>Size prop</span>
              </div>
              <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-lg">
                <Trophy size={24} color="#FFD700" />
                <span>Color prop</span>
              </div>
              <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-lg">
                <Target strokeWidth={1.5} className="w-8 h-8 text-red-500" />
                <span>Tailwind classes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-400">
            Browse all icons at{' '}
            <a
              href="https://lucide.dev/icons/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              lucide.dev/icons
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
