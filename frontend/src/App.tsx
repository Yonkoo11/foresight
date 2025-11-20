import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

import { config } from './config/wagmi';
import { RealtimeProvider } from './contexts/RealtimeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/Layout';

// Pages
import Home from './pages/Home';
import Draft from './pages/Draft';
import Whisperer from './pages/Whisperer';
import Arena from './pages/Arena';
import Gauntlet from './pages/Gauntlet';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import TerminalDashboard from './pages/TerminalDashboard';
import Earn from './pages/Earn';
import IconShowcase from './components/IconShowcase';
import AllIconLibraries from './components/AllIconLibraries';
// import PhosphorShowcase from './components/PhosphorShowcase';

const queryClient = new QueryClient();

function App() {
  console.log('App component rendering');
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#0052FF',
            accentColorForeground: 'white',
            borderRadius: 'large',
          })}
        >
          <RealtimeProvider>
            <NotificationProvider>
              <Router>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/terminal" element={<TerminalDashboard />} />
                    <Route path="/draft" element={<Draft />} />
                    <Route path="/whisperer" element={<Whisperer />} />
                    <Route path="/arena" element={<Arena />} />
                    <Route path="/gauntlet" element={<Gauntlet />} />
                    <Route path="/earn" element={<Earn />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/icons" element={<IconShowcase />} />
                    <Route path="/all-icons" element={<AllIconLibraries />} />
                    {/* <Route path="/phosphor" element={<PhosphorShowcase />} /> */}
                  </Routes>
                </Layout>
              </Router>
            </NotificationProvider>
          </RealtimeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
