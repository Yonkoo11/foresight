/**
 * Farcaster Mini App SDK Hook
 * Handles SDK initialization and provides Mini App context
 */

import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export function useMiniApp() {
  const [isReady, setIsReady] = useState(false);
  const [context, setContext] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeMiniApp = async () => {
      try {
        // Initialize the SDK
        await sdk.init();

        // Get context (user info, etc)
        const miniAppContext = await sdk.context;
        setContext(miniAppContext);

        // Tell Farcaster we're ready to display (hides splash screen)
        sdk.actions.ready();
        setIsReady(true);

        console.log('Mini App initialized:', miniAppContext);
      } catch (err) {
        console.error('Failed to initialize Mini App:', err);
        setError(err as Error);
        // Still mark as ready even if initialization fails (for web fallback)
        setIsReady(true);
      }
    };

    initializeMiniApp();
  }, []);

  return {
    isReady,
    context,
    error,
    sdk,
    // Useful helpers
    user: context?.user,
    isInMiniApp: !!context,
  };
}
