/**
 * Privy authentication hook
 * Replaces useAutoAuth (SIWE) with Privy-based auth flow.
 *
 * Flow:
 * 1. Privy handles wallet connection + authentication
 * 2. On successful Privy auth, we get a Privy access token
 * 3. Send token to our backend POST /api/auth/verify { privyToken }
 * 4. Backend verifies with Privy, creates/finds user, issues our JWT
 * 5. Store our JWT in localStorage for subsequent API calls
 */

import { useEffect, useRef, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function usePrivyAuth() {
  const { ready, authenticated, user, getAccessToken, logout } = usePrivy();
  const hasAttemptedAuth = useRef(false);
  const lastUserId = useRef<string | undefined>();

  const syncWithBackend = useCallback(async () => {
    if (hasAttemptedAuth.current) return;
    hasAttemptedAuth.current = true;

    try {
      // Get Privy access token
      const privyToken = await getAccessToken();
      if (!privyToken) {
        console.error('[PrivyAuth] No access token available');
        return;
      }

      // Check if we already have a valid backend session
      const existingToken = localStorage.getItem('authToken');
      if (existingToken) {
        try {
          const meResponse = await axios.get(`${API_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${existingToken}` },
          });
          if (meResponse.status === 200) {
            // Existing session still valid
            return;
          }
        } catch {
          // Token expired or invalid — continue to re-auth
          localStorage.removeItem('authToken');
        }
      }

      // Send Privy token to our backend for verification
      const response = await axios.post(`${API_URL}/api/auth/verify`, {
        privyToken,
      });

      const token =
        response.data.data?.accessToken ||
        response.data.accessToken ||
        response.data.token;

      if (token) {
        localStorage.setItem('authToken', token);
        console.log('[PrivyAuth] Backend session created');
        // Reload to fetch data with new auth context
        window.location.reload();
      }
    } catch (error) {
      console.error('[PrivyAuth] Backend sync failed:', error);
      // Don't throw — app can still function in limited mode
    }
  }, [getAccessToken]);

  useEffect(() => {
    if (!ready) return;

    // User disconnected
    if (!authenticated && lastUserId.current) {
      localStorage.removeItem('authToken');
      lastUserId.current = undefined;
      hasAttemptedAuth.current = false;
      return;
    }

    // New user or user changed
    if (authenticated && user && user.id !== lastUserId.current) {
      hasAttemptedAuth.current = false;
      lastUserId.current = user.id;
      syncWithBackend();
    }
  }, [ready, authenticated, user, syncWithBackend]);

  const handleLogout = useCallback(async () => {
    try {
      // Logout from our backend
      const token = localStorage.getItem('authToken');
      if (token) {
        await axios
          .post(
            `${API_URL}/api/auth/logout`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .catch(() => {});
      }
      localStorage.removeItem('authToken');

      // Logout from Privy
      await logout();
    } catch (error) {
      console.error('[PrivyAuth] Logout failed:', error);
      localStorage.removeItem('authToken');
    }
  }, [logout]);

  return {
    ready,
    authenticated,
    user,
    logout: handleLogout,
    isBackendAuthed: !!localStorage.getItem('authToken'),
  };
}
