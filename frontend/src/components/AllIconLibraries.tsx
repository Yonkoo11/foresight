/**
 * All Icon Libraries Demo
 * Shows examples from multiple icon packages
 */

// NOTE: To use this component, you need to install the icon packages first:
// pnpm add @heroicons/react react-icons @phosphor-icons/react @tabler/icons-react

export default function AllIconLibraries() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-white text-center mb-12">
          📦 All Icon Libraries for React
        </h1>

        {/* Installation Guide */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">🚀 Installation</h2>

          <div className="space-y-4">
            <div className="bg-black/50 rounded-lg p-4">
              <div className="text-green-400 mb-2 text-sm">1. Lucide React (Already Installed ✅)</div>
              <code className="text-white font-mono">pnpm add lucide-react</code>
            </div>

            <div className="bg-black/50 rounded-lg p-4">
              <div className="text-yellow-400 mb-2 text-sm">2. Heroicons</div>
              <code className="text-white font-mono">pnpm add @heroicons/react</code>
            </div>

            <div className="bg-black/50 rounded-lg p-4">
              <div className="text-yellow-400 mb-2 text-sm">3. React Icons (All-in-One: 50,000+ icons!)</div>
              <code className="text-white font-mono">pnpm add react-icons</code>
            </div>

            <div className="bg-black/50 rounded-lg p-4">
              <div className="text-yellow-400 mb-2 text-sm">4. Phosphor Icons</div>
              <code className="text-white font-mono">pnpm add @phosphor-icons/react</code>
            </div>

            <div className="bg-black/50 rounded-lg p-4">
              <div className="text-yellow-400 mb-2 text-sm">5. Tabler Icons</div>
              <code className="text-white font-mono">pnpm add @tabler/icons-react</code>
            </div>

            <div className="bg-black/50 rounded-lg p-4">
              <div className="text-yellow-400 mb-2 text-sm">6. Font Awesome (Free)</div>
              <code className="text-white font-mono">pnpm add @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons</code>
            </div>

            <div className="bg-black/50 rounded-lg p-4">
              <div className="text-yellow-400 mb-2 text-sm">7. Material Icons</div>
              <code className="text-white font-mono">pnpm add @mui/icons-material @mui/material @emotion/react @emotion/styled</code>
            </div>

            <div className="bg-black/50 rounded-lg p-4">
              <div className="text-yellow-400 mb-2 text-sm">8. Feather Icons</div>
              <code className="text-white font-mono">pnpm add react-feather</code>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">📊 Quick Comparison</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left p-3">Library</th>
                  <th className="text-left p-3">Icons</th>
                  <th className="text-left p-3">Size</th>
                  <th className="text-left p-3">Best For</th>
                  <th className="text-left p-3">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                <tr className="hover:bg-white/5">
                  <td className="p-3 font-bold text-green-400">Lucide React ✅</td>
                  <td className="p-3">1,400+</td>
                  <td className="p-3 text-green-400">Tiny</td>
                  <td className="p-3">Modern React apps</td>
                  <td className="p-3">⭐⭐⭐⭐⭐</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 font-bold">Heroicons</td>
                  <td className="p-3">292</td>
                  <td className="p-3 text-green-400">Tiny</td>
                  <td className="p-3">Tailwind projects</td>
                  <td className="p-3">⭐⭐⭐⭐⭐</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 font-bold">React Icons</td>
                  <td className="p-3 text-yellow-400">50,000+</td>
                  <td className="p-3 text-yellow-400">Medium</td>
                  <td className="p-3">Need many sets</td>
                  <td className="p-3">⭐⭐⭐⭐⭐</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 font-bold">Phosphor</td>
                  <td className="p-3">7,800+</td>
                  <td className="p-3 text-green-400">Small</td>
                  <td className="p-3">Beautiful designs</td>
                  <td className="p-3">⭐⭐⭐⭐</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 font-bold">Tabler</td>
                  <td className="p-3">5,100+</td>
                  <td className="p-3 text-green-400">Small</td>
                  <td className="p-3">Stroke icons</td>
                  <td className="p-3">⭐⭐⭐⭐</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 font-bold">Font Awesome</td>
                  <td className="p-3">2,000+</td>
                  <td className="p-3 text-yellow-400">Medium</td>
                  <td className="p-3">Classic icons</td>
                  <td className="p-3">⭐⭐⭐⭐</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 font-bold">Material Icons</td>
                  <td className="p-3">2,100+</td>
                  <td className="p-3 text-red-400">Large</td>
                  <td className="p-3">Material Design</td>
                  <td className="p-3">⭐⭐⭐</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 font-bold">Feather</td>
                  <td className="p-3">287</td>
                  <td className="p-3 text-green-400">Tiny</td>
                  <td className="p-3">Minimal designs</td>
                  <td className="p-3">⭐⭐⭐⭐</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Heroicons */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4">Heroicons</h3>
            <div className="bg-black/50 rounded-lg p-4 mb-4 font-mono text-sm">
              <div className="text-green-400">import {'{'} BoltIcon {'}'} from '@heroicons/react/24/outline';</div>
              <div className="text-white">{'<BoltIcon className="w-6 h-6" />'}</div>
            </div>
            <div className="flex gap-3 text-gray-300">
              <span>• 292 icons</span>
              <span>• Outline + Solid</span>
              <span>• Tailwind native</span>
            </div>
          </div>

          {/* React Icons */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4">React Icons</h3>
            <div className="bg-black/50 rounded-lg p-4 mb-4 font-mono text-sm">
              <div className="text-green-400">import {'{'} FaBitcoin, MdRocket {'}'} from 'react-icons/...';</div>
              <div className="text-white">{'<FaBitcoin size={24} />'}</div>
            </div>
            <div className="flex gap-3 text-gray-300">
              <span>• 50,000+ icons</span>
              <span>• 20+ libraries</span>
              <span>• One package</span>
            </div>
          </div>

          {/* Phosphor */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4">Phosphor Icons</h3>
            <div className="bg-black/50 rounded-lg p-4 mb-4 font-mono text-sm">
              <div className="text-green-400">import {'{'} Lightning {'}'} from '@phosphor-icons/react';</div>
              <div className="text-white">{'<Lightning size={32} weight="bold" />'}</div>
            </div>
            <div className="flex gap-3 text-gray-300">
              <span>• 7,800+ icons</span>
              <span>• 6 weights</span>
              <span>• Beautiful</span>
            </div>
          </div>

          {/* Tabler */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4">Tabler Icons</h3>
            <div className="bg-black/50 rounded-lg p-4 mb-4 font-mono text-sm">
              <div className="text-green-400">import {'{'} IconBolt {'}'} from '@tabler/icons-react';</div>
              <div className="text-white">{'<IconBolt stroke={1.5} />'}</div>
            </div>
            <div className="flex gap-3 text-gray-300">
              <span>• 5,100+ icons</span>
              <span>• 2px stroke</span>
              <span>• Minimal</span>
            </div>
          </div>
        </div>

        {/* Special: React Icons - All Libraries */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">
            🌟 React Icons - The Ultimate Choice
          </h2>
          <p className="text-white/90 text-lg mb-6">
            One package with access to ALL these icon sets:
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-black/30 rounded-lg p-4">
              <div className="text-white font-bold">Font Awesome</div>
              <div className="text-white/70 text-sm">FaXxx</div>
            </div>
            <div className="bg-black/30 rounded-lg p-4">
              <div className="text-white font-bold">Material Design</div>
              <div className="text-white/70 text-sm">MdXxx</div>
            </div>
            <div className="bg-black/30 rounded-lg p-4">
              <div className="text-white font-bold">Feather</div>
              <div className="text-white/70 text-sm">FiXxx</div>
            </div>
            <div className="bg-black/30 rounded-lg p-4">
              <div className="text-white font-bold">Bootstrap</div>
              <div className="text-white/70 text-sm">BsXxx</div>
            </div>
            <div className="bg-black/30 rounded-lg p-4">
              <div className="text-white font-bold">Ant Design</div>
              <div className="text-white/70 text-sm">AiXxx</div>
            </div>
            <div className="bg-black/30 rounded-lg p-4">
              <div className="text-white font-bold">Ionicons</div>
              <div className="text-white/70 text-sm">IoXxx</div>
            </div>
            <div className="bg-black/30 rounded-lg p-4">
              <div className="text-white font-bold">Game Icons</div>
              <div className="text-white/70 text-sm">GiXxx</div>
            </div>
            <div className="bg-black/30 rounded-lg p-4">
              <div className="text-white font-bold">+13 more</div>
              <div className="text-white/70 text-sm">20+ total</div>
            </div>
          </div>

          <div className="bg-black/50 rounded-lg p-4 font-mono text-sm mb-4">
            <div className="text-green-300 mb-2">// Install once, use all</div>
            <div className="text-white mb-3">pnpm add react-icons</div>
            <div className="text-green-300 mb-2">// Import from any set</div>
            <div className="text-white">import {'{'} FaBitcoin, FaEthereum {'}'} from 'react-icons/fa';</div>
            <div className="text-white">import {'{'} MdRocket, MdStar {'}'} from 'react-icons/md';</div>
            <div className="text-white">import {'{'} GiTrophy, GiSword {'}'} from 'react-icons/gi';</div>
          </div>

          <div className="text-white/90">
            Browse all: <a href="https://react-icons.github.io/react-icons/" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline">react-icons.github.io</a>
          </div>
        </div>

        {/* Recommendation */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6">💡 My Recommendation</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="text-4xl">✅</div>
              <div>
                <h3 className="text-xl font-bold text-green-400 mb-2">Keep Lucide React (Already Installed)</h3>
                <p className="text-gray-300">
                  Perfect for modern crypto/gaming UI. Best performance, smallest bundle, great designs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="text-4xl">🌟</div>
              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">Add React Icons (If You Need More)</h3>
                <p className="text-gray-300 mb-2">
                  Gives you 50,000+ icons from 20+ libraries. One package for everything.
                </p>
                <code className="bg-black/50 px-3 py-1 rounded text-white font-mono text-sm">
                  pnpm add react-icons
                </code>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="text-4xl">🎨</div>
              <div>
                <h3 className="text-xl font-bold text-purple-400 mb-2">Alternative: Heroicons</h3>
                <p className="text-gray-300 mb-2">
                  If you want the Tailwind native experience with outline + solid variants.
                </p>
                <code className="bg-black/50 px-3 py-1 rounded text-white font-mono text-sm">
                  pnpm add @heroicons/react
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Browse Links */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">🔍 Browse Icons Online</h3>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer"
               className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
              Lucide Icons
            </a>
            <a href="https://heroicons.com/" target="_blank" rel="noopener noreferrer"
               className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition">
              Heroicons
            </a>
            <a href="https://react-icons.github.io/react-icons/" target="_blank" rel="noopener noreferrer"
               className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition">
              React Icons
            </a>
            <a href="https://phosphoricons.com/" target="_blank" rel="noopener noreferrer"
               className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">
              Phosphor
            </a>
            <a href="https://tabler.io/icons" target="_blank" rel="noopener noreferrer"
               className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition">
              Tabler
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
