import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PrivyProvider, usePrivy } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';
import { useEffect, useMemo, useCallback } from 'react';

import { RealtimeProvider } from './contexts/RealtimeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ToastProvider } from './contexts/ToastContext';
import { AchievementToastProvider } from './contexts/AchievementToastContext';
import { OnboardingProvider } from './contexts/OnboardingContext';
import AchievementToastContainer from './components/AchievementToastContainer';
import Layout from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { setupGlobalErrorHandlers } from './utils/errorLogger';
import { useMiniApp } from './hooks/useMiniApp';
import { usePrivyAuth } from './hooks/usePrivyAuth';
import { AuthContext, type AuthState } from './hooks/useAuth';

// Pages - Primary Navigation
import Home from './pages/Home';
import Play from './pages/Compete';
import Feed from './pages/Intel';
import Profile from './pages/Profile';

// Pages - Sub-routes
import Progress from './pages/Progress';
import Settings from './pages/Settings';
import Referrals from './pages/Referrals';

// Pages - Game Features
import Draft from './pages/Draft';
import ContestDetail from './pages/ContestDetail';

// Legal Pages
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Cookies from './pages/Cookies';
import Imprint from './pages/Imprint';

const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID || '';

const solanaConnectors = toSolanaWalletConnectors();

const queryClient = new QueryClient();

/**
 * Privy auth bridge — populates AuthContext from Privy state
 */
function PrivyAuthBridge({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, user, login, logout: privyLogout } = usePrivy();
  usePrivyAuth();

  const address = useMemo(() => {
    if (!user) return undefined;
    const solanaWallet = user.linkedAccounts?.find(
      (a: any) => a.type === 'wallet' && a.chainType === 'solana'
    );
    if (solanaWallet && 'address' in solanaWallet) return (solanaWallet as any).address as string;
    const anyWallet = user.linkedAccounts?.find((a: any) => a.type === 'wallet');
    if (anyWallet && 'address' in anyWallet) return (anyWallet as any).address as string;
    return undefined;
  }, [user]);

  const handleLogout = useCallback(async () => {
    localStorage.removeItem('authToken');
    await privyLogout();
  }, [privyLogout]);

  const authState: AuthState = useMemo(() => ({
    isConnected: ready && authenticated,
    address,
    displayAddress: address ? `${address.slice(0, 4)}...${address.slice(-4)}` : '',
    isBackendAuthed: !!localStorage.getItem('authToken'),
    login,
    logout: handleLogout,
  }), [ready, authenticated, address, login, handleLogout]);

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
}

function AppContent() {
  const { isReady } = useMiniApp();

  useEffect(() => {
    setupGlobalErrorHandlers();
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Foresight...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Primary Navigation — 4 items */}
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<Play />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/profile" element={<Profile />} />

          {/* Sub-routes */}
          <Route path="/progress" element={<Progress />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/referrals" element={<Referrals />} />

          {/* Game Features */}
          <Route path="/draft" element={<Draft />} />
          <Route path="/contest/:id" element={<ContestDetail />} />

          {/* Legacy redirects */}
          <Route path="/league" element={<Navigate to="/play" replace />} />
          <Route path="/compete" element={<Navigate to="/play" replace />} />
          <Route path="/contests" element={<Navigate to="/play?tab=contests" replace />} />
          <Route path="/intel" element={<Navigate to="/feed" replace />} />
          <Route path="/quests" element={<Navigate to="/progress" replace />} />
          <Route path="/arena" element={<Navigate to="/play" replace />} />

          {/* Legal Pages */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/imprint" element={<Imprint />} />
        </Routes>
      </Layout>
    </Router>
  );
}

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#F59E0B',
          walletChainType: 'solana-only',
          showWalletLoginFirst: true,
        },
        loginMethods: ['wallet'],
        externalWallets: {
          solana: {
            connectors: solanaConnectors,
          },
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <PrivyAuthBridge>
          {children}
        </PrivyAuthBridge>
      </QueryClientProvider>
    </PrivyProvider>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <RealtimeProvider>
          <NotificationProvider>
            <ToastProvider>
              <AchievementToastProvider>
                <OnboardingProvider>
                  <AppContent />
                  <AchievementToastContainer />
                </OnboardingProvider>
              </AchievementToastProvider>
            </ToastProvider>
          </NotificationProvider>
        </RealtimeProvider>
      </AppProviders>
    </ErrorBoundary>
  );
}

export default App;
